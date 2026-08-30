// Joins a price-sheet model number to its entry in the published catalog, so a
// sale listing can carry the photographs, the floor-plan sheet, the brochure
// and the 3D tour that already exist for that home instead of duplicating any
// of them.
//
// Two joins are needed. Dutch Aspire rows carry a Champion model number that
// matches the catalog's `modelNumber` directly. Prime rows use plant codes
// ("1656H22P01") that only some catalog entries record, so those fall back to
// matching on the model's name, which Prime homes have and the catalog spells
// the same way ("BARKLEY" / "Barkley").
//
// Hidden plans are skipped. `hidden` marks a home paused until Champion
// supplies imagery, and getApiFloorPlanBySlug returns null for one — linking a
// sale listing to it would send a shopper to a 404.

import { paramountFloorPlans } from "./paramount-floor-plans";
import { localFloorPlans } from "./local-floor-plans";
import type { LocalFloorPlan } from "./local-floor-plans";

export interface CatalogLink {
  /** Catalog slug — the home's page under /floor-plans. */
  slug: string;
  /** Hero image, or "" when the catalog has none. */
  image: string;
  /** Every published photograph and floor-plan sheet, hero first. */
  gallery: string[];
  /** Champion's PDF brochure, where the literature library has one. */
  brochureUrl?: string;
  /** Matterport / 3D Vista walkthrough, where Champion publishes one. */
  virtualTour?: string;
}

const CATALOG: LocalFloorPlan[] = [...paramountFloorPlans, ...localFloorPlans];

const normalizeName = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const BY_MODEL = new Map<string, LocalFloorPlan>();
const BY_NAME = new Map<string, LocalFloorPlan>();
for (const plan of CATALOG) {
  if (plan.hidden) continue;
  if (plan.modelNumber) {
    const key = plan.modelNumber.toUpperCase();
    if (!BY_MODEL.has(key)) BY_MODEL.set(key, plan);
  }
  const nameKey = normalizeName(plan.name);
  if (nameKey && !BY_NAME.has(nameKey)) BY_NAME.set(nameKey, plan);
}

/**
 * The catalog entry for a price-sheet model, or undefined when the catalog
 * doesn't carry it (or carries it only as a paused, image-less placeholder).
 * `name` is the price sheet's display name, used for the Prime fallback
 * described above.
 */
export function catalogLinkFor(model: string, name?: string): CatalogLink | undefined {
  const plan =
    BY_MODEL.get(model.trim().toUpperCase()) ??
    (name ? BY_NAME.get(normalizeName(name)) : undefined);
  if (!plan) return undefined;

  // Hero first, then the rest — a gallery that opens on a different picture
  // than the card showed reads as the wrong home.
  const hero = plan.image || "";
  const rest = (plan.gallery ?? []).filter((src) => src && src !== hero);
  return {
    slug: plan.slug,
    image: hero,
    gallery: hero ? [hero, ...rest] : rest,
    brochureUrl: plan.brochureUrl,
    virtualTour: plan.virtualTour,
  };
}

/**
 * Hero image for a model. Kept as its own helper because most callers want
 * only the picture.
 */
export function catalogImageFor(model: string, name?: string): string {
  return catalogLinkFor(model, name)?.image ?? "";
}
