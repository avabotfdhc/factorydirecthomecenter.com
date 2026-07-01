import { NextResponse } from "next/server";
import { getApiFloorPlans } from "@/lib/api-content";

// Returns a small, presentable set of real CMS homes for the homepage
// "Featured Floor Plans" section. Prefers homes that have both a photo and a
// price so the cards look complete; falls back to any homes if needed.
// Ignore implausible CMS price entries (e.g. the "$1" data-entry bug) so the
// homepage featured cards only show homes with a real photo and real price.
const priceValue = (raw: string) => Number(String(raw).replace(/[^0-9.]/g, "")) || 0;

export async function GET() {
  const all = await getApiFloorPlans();
  const complete = all.filter((h) => h.image && priceValue(h.price) >= 10000);
  const pick = (complete.length >= 4 ? complete : all.filter((h) => h.image)).slice(0, 4);
  return NextResponse.json(
    { homes: pick },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
