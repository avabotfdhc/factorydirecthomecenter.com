import { NextResponse } from "next/server";
import { planElevation } from "@/lib/plan-elevation";

// GET /api/plan-elevation?model=2452H32167&length=52&width=24&beds=3
//
// One plan's exterior elevation for the Design Your Home preview
// (src/components/HomeDesigner.tsx). The data file behind it is ~70 KB for the
// whole catalogue, so the browser asks for the one plan it is drawing rather
// than shipping every plan in the page bundle. The size fields are only used
// for the representative fallback when the model has no readable sheet.

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const model = url.searchParams.get("model") || "";
  // The size fields only shape the representative fallback. They are clamped
  // to the range Champion builds, because this is a public endpoint and the
  // fallback draws one window per bedroom — an unbounded `beds` would loop.
  const num = (k: string, min: number, max: number) => {
    const v = Number(url.searchParams.get(k));
    return Number.isFinite(v) && v > 0 ? Math.min(Math.max(v, min), max) : undefined;
  };
  const plan = planElevation({
    modelNumber: model.slice(0, 32),
    lengthFt: num("length", 20, 120),
    widthFt: num("width", 10, 40),
    beds: num("beds", 1, 6),
  });
  if (!plan) {
    return NextResponse.json({ error: "no elevation for this plan" }, { status: 404 });
  }
  return NextResponse.json(plan, {
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
