import { NextResponse } from "next/server";
import { decodeDesign } from "@/lib/design-summary";
import { findDesignerPlan } from "@/lib/designer-plans";
import { renderDesignPng } from "@/lib/design-image";

// GET /api/design-summary/image?d=<encodeDesign(picks)>
//
// A buyer's design as a PNG, for the copy they ask to be emailed or texted
// (src/lib/design-summary-send.ts). Email clients do not show SVG and MMS
// wants a raster, so this is the raster twin of /api/plan-elevation/image.
// The home is looked up by slug in the catalogue and every pick is checked
// against that home's board, so the URL can only ever draw a home we sell in
// colours Champion offers. The picture never changes for a given URL, so the
// CDN keeps it.

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const raw = decodeDesign(new URL(req.url).searchParams.get("d"));
  if (!raw) return NextResponse.json({ error: "bad design" }, { status: 400 });
  const plan = await findDesignerPlan(String(raw.home));
  if (!plan) return NextResponse.json({ error: "unknown home" }, { status: 404 });
  let png: Buffer | null;
  try {
    png = await renderDesignPng(plan, raw);
  } catch (err) {
    console.error("[design-summary] image render failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "render failed" }, { status: 500 });
  }
  if (!png) return NextResponse.json({ error: "no drawing for this home" }, { status: 404 });
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=2592000, immutable",
      "X-Robots-Tag": "noindex",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
