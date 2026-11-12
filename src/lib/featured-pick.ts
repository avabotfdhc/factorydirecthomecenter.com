// Which four homes the homepage leads with.
//
// Until 2026-11-11 this was "the first four plans in catalogue order that have
// an image", and catalogue order is by model code — so the homepage's
// "Featured Floor Plans" were the four smallest homes we sell: 1-bed,
// 427–587 sq ft single wides listed by code ("1432H11214"), under copy that
// called them hand-picked. A buyer's first look at the range, and an answer
// engine's, was a row of homes almost nobody is shopping for.
//
// The pick is now a rule a visitor would recognise as a showcase:
//   - a home with a family name (code-named singles stay in the catalogue,
//     not in the shop window) and a photo
//   - the HUD page, never its modular twin (the twin canonicalises to it)
//   - one home per family, so Woodward 28×60/64/68 cannot take three slots
//   - three multi-section homes and one single wide
//   - ranked by: has a 3D tour, three bedrooms, a mid-range size
// Deterministic (ties break on slug), so the homepage does not reshuffle
// between renders. To feature four specific homes instead, list their slugs
// in PINNED_FEATURED_SLUGS — that is Kyle's call and it wins over the rule.

import type { ApiFloorPlan } from "./api-content";
import { isCodeNamed } from "./page-title";

/** Slugs to feature first, in order. Empty = the rule below decides. */
export const PINNED_FEATURED_SLUGS: string[] = [];

const isModularTwin = (h: ApiFloorPlan) => /^\d{4}M/i.test(h.modelNumber ?? "");
const isSingle = (h: ApiFloorPlan) =>
  h.widthFt ? h.widthFt <= 18 : /single/i.test(h.homeType);

function score(h: ApiFloorPlan): number {
  return (
    (h.virtualTour ? 4 : 0) +
    (h.beds === 3 ? 2 : 0) +
    (h.sqft >= 1100 && h.sqft <= 1900 ? 1 : 0)
  );
}

export function pickFeaturedHomes(all: ApiFloorPlan[], count = 4): ApiFloorPlan[] {
  const withImage = all.filter((h) => h.image);
  const picked: ApiFloorPlan[] = [];
  const families = new Set<string>();
  const take = (h: ApiFloorPlan | undefined) => {
    if (!h || picked.length >= count || picked.includes(h)) return;
    const family = h.name.trim().toLowerCase();
    if (families.has(family)) return;
    families.add(family);
    picked.push(h);
  };

  for (const slug of PINNED_FEATURED_SLUGS) take(withImage.find((h) => h.slug === slug));

  const showcase = withImage
    // A "Reverse Aisle" plan is a mirror of its base plan, not a showcase home.
    .filter((h) => !isCodeNamed(h.name, h.modelNumber) && !isModularTwin(h) && !/reverse aisle/i.test(h.name))
    .sort((a, b) => score(b) - score(a) || a.slug.localeCompare(b.slug));
  const multis = showcase.filter((h) => !isSingle(h));
  const singles = showcase.filter(isSingle);

  // Three multi-section homes, then one single wide, then whatever is left.
  for (const h of multis) if (picked.length < count - (singles.length ? 1 : 0)) take(h);
  for (const h of singles) take(h);
  for (const h of showcase) take(h);
  // A degraded catalogue (CMS unreachable) may hold no named home at all:
  // show something rather than an empty section.
  for (const h of withImage) take(h);
  return picked;
}
