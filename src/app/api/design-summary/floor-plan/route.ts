import { NextResponse } from "next/server";
import { findDesignerPlan } from "@/lib/designer-plans";
import { floorPlanJpeg } from "@/lib/design-image";

// GET /api/design-summary/floor-plan?home=<plan slug>
//
// The home's floor-plan drawing as a JPEG, for a buyer's emailed or texted
// design copy. Most drawings are stored as WebP, which Outlook and many
// phones' picture messages do not show. The drawing's address comes from the
// catalogue by slug, never from the request.

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const slug = (new URL(req.url).searchParams.get("home") || "").slice(0, 120);
  const plan = await findDesignerPlan(slug);
  if (!plan) return NextResponse.json({ error: "unknown home" }, { status: 404 });
  let jpeg: Buffer | null;
  try {
    jpeg = await floorPlanJpeg(plan);
  } catch (err) {
    console.error("[design-summary] floor plan failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "floor plan unavailable" }, { status: 502 });
  }
  if (!jpeg) return NextResponse.json({ error: "no floor plan for this home" }, { status: 404 });
  return new NextResponse(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
      "X-Robots-Tag": "noindex",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
