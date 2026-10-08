// The slimmed plan shape every floor-plan grid sends to the client.
import { shortImageSrc } from "@/lib/image-src";
import type { ApiFloorPlan } from "@/lib/api-content";

/**
 * Only what the grid and its cards read, with empty fields left out (an
 * undefined key is not serialised) and image addresses in their short form.
 * 214 homes × the fields the grid never used — title, updatedAt, the "Call for
 * pricing" placeholder, empty priceFrom/virtualTour — was ~25 KB of the page.
 * An empty price hides the price label exactly as "Call for pricing" did.
 */
export function gridPlan(p: ApiFloorPlan): ApiFloorPlan {
  const priced = p.price && !/call for pricing/i.test(p.price) ? p.price : "";
  return {
    slug: p.slug,
    name: p.name,
    title: "",
    price: priced,
    sqft: p.sqft,
    beds: p.beds,
    baths: p.baths,
    image: shortImageSrc(p.image),
    brand: p.brand,
    homeType: p.homeType,
    series: p.series,
    priceFrom: p.priceFrom || undefined,
    virtualTour: p.virtualTour || undefined,
    widthFt: p.widthFt,
    bedsMin: p.bedsMin,
    bedsMax: p.bedsMax,
    flexNote: p.flexNote || undefined,
    floorPlanImage: p.floorPlanImage ? shortImageSrc(p.floorPlanImage) : undefined,
  };
}

// Home-type buckets for the type landing pages. Modular (IRC) twins are left
// out of both: these pages are about HUD-code homes. A width, when known, is
// the tiebreaker — single sections ship 14–18 ft wide, multi-sections 24 ft+.
const MODULAR = /modular/i;

/** HUD-code multi-section homes (double wides and larger). */
export function isMultiSectionHud(p: ApiFloorPlan): boolean {
  if (MODULAR.test(p.homeType) || /single/i.test(p.homeType)) return false;
  return /multi|double|triple/i.test(p.homeType) || (p.widthFt ?? 0) >= 24;
}

/** HUD-code single-section homes. */
export function isSingleSectionHud(p: ApiFloorPlan): boolean {
  if (MODULAR.test(p.homeType)) return false;
  return /single/i.test(p.homeType) || (!isMultiSectionHud(p) && (p.widthFt ?? 99) < 24);
}
