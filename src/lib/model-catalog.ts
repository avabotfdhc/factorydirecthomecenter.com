// Joins a price-sheet model number to its entry in the published catalog, so a
// sale listing can carry the photo and the detail-page link that already exist
// for that home instead of duplicating either.
//
// Two joins are needed. Dutch Aspire rows carry a Champion model number that
// matches the catalog's `modelNumber` directly. Prime rows use plant codes
// ("1656H22P01") that only some catalog entries record, so those fall back to
// matching on the model's name, which Prime homes have and the catalog spells
// the same way ("BARKLEY" / "Barkley").

import { paramountFloorPlans } from "./paramount-floor-plans";
import { localFloorPlans } from "./local-floor-plans";
import type { LocalFloorPlan } from "./local-floor-plans";

export interface CatalogLink {
  /** Catalog slug — the home's page under /floor-plans. */
  slug: string;
  /** Hero image, or "" when the catalog has none. */
  image: string;
}

/**
 * Hero image for a model. Slug and series come from CATALOG_INDEX (taken from
 * the published catalogue); only the picture is looked up here, because the
 * repo's two catalogue files disagree about series but agree about artwork.
 */
export function catalogImageFor(model: string, name?: string): string {
  return catalogLinkFor(model, name)?.image ?? "";
}

const CATALOG: LocalFloorPlan[] = [...paramountFloorPlans, ...localFloorPlans];

const normalizeName = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const BY_MODEL = new Map<string, LocalFloorPlan>();
const BY_NAME = new Map<string, LocalFloorPlan>();
for (const plan of CATALOG) {
  if (plan.modelNumber) {
    const key = plan.modelNumber.toUpperCase();
    if (!BY_MODEL.has(key)) BY_MODEL.set(key, plan);
  }
  const nameKey = normalizeName(plan.name);
  if (nameKey && !BY_NAME.has(nameKey)) BY_NAME.set(nameKey, plan);
}

/**
 * The catalog entry for a price-sheet model, or undefined when the catalog
 * doesn't carry it. `name` is the price sheet's display name, used for the
 * Prime fallback described above.
 */
export function catalogLinkFor(model: string, name?: string): CatalogLink | undefined {
  const plan =
    BY_MODEL.get(model.trim().toUpperCase()) ??
    (name ? BY_NAME.get(normalizeName(name)) : undefined);
  if (!plan) return undefined;
  return { slug: plan.slug, image: plan.image || "" };
}
