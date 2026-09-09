import { NextResponse } from "next/server";
import { localFloorPlans, PRIME_HOME_TYPE, PRIME_SERIES, seriesLabel } from "@/lib/local-floor-plans";

export const dynamic = "force-static";

// GET /api/catalogue/local — the repo-published catalogue (Prime, Paramount,
// Aspire twins) in floor_plans / floor_plan_images row shape. Used to seed the
// Supabase catalogue so the /admin importer has a row (with model_number) to
// attach Box files to. Images are referenced by slug; the DB assigns ids.
export function GET() {
  const plans = localFloorPlans.map((p, i) => ({
    slug: p.slug,
    name: p.name,
    title: `${p.name} - ${p.beds} Bed ${p.baths} Bath ${p.homeType || PRIME_HOME_TYPE} | Champion ${seriesLabel(p)} Series`,
    sqft: p.sqft || null,
    beds: p.beds,
    baths: p.baths,
    home_type: p.homeType || PRIME_HOME_TYPE,
    series: p.series || PRIME_SERIES,
    brand: "Champion Homes",
    model_number: p.modelNumber,
    length: p.length.replace(/'/g, ""),
    width: p.width.replace(/'/g, ""),
    banner_image: p.image || "",
    brochure_url: p.brochureUrl || "",
    virtual_tour: p.virtualTour || "",
    is_active: !p.hidden,
    sort_order: i,
  }));
  const images = localFloorPlans.flatMap((p) => {
    const seen = new Set<string>();
    return (p.gallery ?? (p.image ? [p.image] : [])).flatMap((path, j) => {
      if (!path || seen.has(path)) return [];
      seen.add(path);
      return [{ slug: p.slug, path, kind: j === 0 ? "banner" : "gallery", sort_order: j }];
    });
  });
  return NextResponse.json({ plans, images, generatedAt: new Date().toISOString() });
}
