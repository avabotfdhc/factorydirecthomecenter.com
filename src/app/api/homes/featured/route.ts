import { NextResponse } from "next/server";
import { getApiFloorPlans } from "@/lib/api-content";

// Returns a small, presentable set of real CMS homes for the homepage
// "Featured Floor Plans" section. Prefers homes that have both a photo and a
// price so the cards look complete; falls back to any homes if needed.
// Ignore implausible CMS price entries (e.g. the "$1" data-entry bug) so the
// homepage featured cards only show homes with a real photo and real price.
const priceValue = (raw: string) => Number(String(raw).replace(/[^0-9.]/g, "")) || 0;

export async function GET() {
  let all;
  try {
    all = await getApiFloorPlans();
  } catch {
    // CMS API failure (already logged in api-content). Empty + no-store so the
    // homepage shows its fallback link and the CDN never caches the outage.
    return NextResponse.json(
      { homes: [] },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  const complete = all.filter((h) => h.image && priceValue(h.price) >= 10000);
  const pick = (complete.length >= 4 ? complete : all.filter((h) => h.image)).slice(0, 4);
  return NextResponse.json(
    { homes: pick },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
