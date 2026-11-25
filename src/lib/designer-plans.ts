// The homes the Design Your Home tool offers, and one of them by slug.
//
// Server only. The page (src/app/design-your-home/page.tsx) lists them, and
// the design-copy paths (src/lib/design-summary-send.ts, the
// /api/design-summary image routes) look a buyer's home up here by slug, so a
// copy is always written from the catalogue, never from what a request says
// about a home.

import type { DesignerPlan } from "@/components/HomeDesigner";
import { getApiFloorPlans, pickDrawing } from "@/lib/api-content";

/** A designer plan plus the pictures a design copy shows. */
export interface DesignerPlanWithMedia extends DesignerPlan {
  /** the dimensioned floor-plan drawing (site-relative or absolute), or "" */
  floorPlanImage: string;
}

// The picker must never take down the page. getApiFloorPlans throws on a CMS
// network failure (by design, to protect ISR elsewhere) — here we'd rather
// render the designer with the repo-published catalog than 500, so we fall
// back to the local floor plans if the live fetch fails.
export async function getDesignerPlans(): Promise<DesignerPlanWithMedia[]> {
  try {
    const plans = await getApiFloorPlans();
    if (plans.length) {
      return plans.map((p) => ({
        slug: p.slug,
        name: p.name,
        series: p.series || "",
        homeType: p.homeType || "Home",
        ...(p.modelNumber ? { modelNumber: p.modelNumber } : {}),
        ...(p.lengthFt ? { lengthFt: p.lengthFt } : {}),
        ...(p.widthFt ? { widthFt: p.widthFt } : {}),
        ...(p.beds ? { beds: p.beds } : {}),
        floorPlanImage: p.floorPlanImage || "",
      }));
    }
  } catch {
    /* fall through to the repo catalog */
  }
  const { localFloorPlans, PRIME_SERIES, PRIME_HOME_TYPE } = await import("@/lib/local-floor-plans");
  return localFloorPlans
    .filter((p) => !p.hidden)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      series: p.series || PRIME_SERIES,
      homeType: p.homeType || PRIME_HOME_TYPE,
      modelNumber: p.modelNumber,
      lengthFt: parseInt(p.length, 10) || undefined,
      widthFt: parseInt(p.width, 10) || undefined,
      beds: p.beds,
      floorPlanImage: pickDrawing([...(p.gallery || []), p.image]),
    }));
}

/** The page's list without the media fields, which the browser never needs. */
export function forBrowser(plans: DesignerPlanWithMedia[]): DesignerPlan[] {
  return plans.map((p) => ({
    slug: p.slug,
    name: p.name,
    series: p.series,
    homeType: p.homeType,
    ...(p.modelNumber ? { modelNumber: p.modelNumber } : {}),
    ...(p.lengthFt ? { lengthFt: p.lengthFt } : {}),
    ...(p.widthFt ? { widthFt: p.widthFt } : {}),
    ...(p.beds ? { beds: p.beds } : {}),
  }));
}

export async function findDesignerPlan(slug: string): Promise<DesignerPlanWithMedia | undefined> {
  if (!slug) return undefined;
  return (await getDesignerPlans()).find((p) => p.slug === slug);
}
