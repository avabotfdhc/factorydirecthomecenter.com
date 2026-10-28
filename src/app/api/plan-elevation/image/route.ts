import { NextResponse } from "next/server";
import { planElevation } from "@/lib/plan-elevation";
import { exteriorCatalog } from "@/lib/exterior-options";
import { defaultChoices } from "@/lib/elevation-defaults";
import { renderElevationSvg } from "@/lib/elevation-svg";
import type { ViewName } from "@/lib/plan-elevation-types";

// GET /api/plan-elevation/image?model=1676H32P01&series=Prime&type=Single%20Wide
//                                 &width=16&length=76&beds=3&view=front&siding=Flint
//
// One plan's elevation as a standalone SVG, for the plan page's "Design this
// home" teaser (src/components/DesignThisHome.tsx), which shows it as a
// plain <img>. Drawing it here instead of inlining the SVG keeps ~25 KB of
// markup out of every plan page's HTML and its RSC payload, and lets the CDN
// cache each picture for a day. The series and section type pick the
// catalogue (Prime's five colours vs Aspire's board), `siding` picks the
// colour by its board label (an unknown label falls back to the default), and
// the size fields only shape the representative fallback for a model with no
// readable sheet — same clamps as /api/plan-elevation.

export const dynamic = "force-dynamic";

const VIEWS: ViewName[] = ["front", "rear", "left", "right"];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (k: string, max = 64) => (url.searchParams.get(k) || "").slice(0, max);
  const num = (k: string, min: number, max: number) => {
    const v = Number(url.searchParams.get(k));
    return Number.isFinite(v) && v > 0 ? Math.min(Math.max(v, min), max) : undefined;
  };
  const widthFt = num("width", 10, 40);
  const plan = planElevation({
    modelNumber: q("model", 32),
    lengthFt: num("length", 20, 120),
    widthFt,
    beds: num("beds", 1, 6),
  });
  if (!plan) {
    return NextResponse.json({ error: "no elevation for this plan" }, { status: 404 });
  }
  const view = (VIEWS as string[]).includes(q("view", 8)) ? (q("view", 8) as ViewName) : "front";
  const catalog = exteriorCatalog(q("series") || undefined, q("type") || undefined, widthFt);
  const choices = defaultChoices(catalog, { siding: q("siding") });
  const name = q("name", 80);
  const svg = await renderElevationSvg({
    plan,
    choices,
    view,
    title: `${name || plan.model} — ${view} elevation in ${choices.siding.label} siding (illustration)`,
  });
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
      // an image for a page, never a page
      "X-Robots-Tag": "noindex",
      "X-Content-Type-Options": "nosniff",
      // the SVG is static markup; forbid anything a viewer might try to run
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
