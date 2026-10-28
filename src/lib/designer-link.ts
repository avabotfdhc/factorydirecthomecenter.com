// Links into Design Your Home, built in one place so every entry point
// (plan page, grid card, promo band, quote modal, Ava) agrees on the shape:
//
//   /design-your-home?home=<slug>&siding=<board label>&src=<placement>
//
// `home` preselects the plan, `siding` the board colour (validated against the
// plan's catalogue on the server, so an unknown label is simply ignored), and
// `src` names the placement the visitor came from. The page reads `src` only
// to tag its GA4 `designer_step` events, so a quote that started from a plan
// page's teaser is distinguishable from one that started in the header.
//
// Client-safe.

import { isCodeNamed } from "@/lib/page-title";

export const DESIGNER_PATH = "/design-your-home";

/** What a page knows about a plan when it draws or links to it. */
export interface DesignerPlanRef {
  slug: string;
  name: string;
  series?: string;
  homeType?: string;
  modelNumber?: string;
  widthFt?: number;
  lengthFt?: number;
  beds?: number;
}

/** "the Woodward", or "model 1676H32107" for a plan Champion names by its code. */
export function homeLabel(plan: { name: string; modelNumber?: string }): string {
  return isCodeNamed(plan.name, plan.modelNumber) ? `model ${plan.name}` : `the ${plan.name}`;
}

export type DesignerSource =
  | "plan_page"
  | "plan_page_swatch"
  | "plan_card"
  | "promo_band"
  | "quote_modal"
  | "header"
  | "footer"
  | "home";

export function designerHref(slug?: string, opts: { siding?: string; src?: DesignerSource } = {}): string {
  const q = new URLSearchParams();
  if (slug) q.set("home", slug);
  if (opts.siding) q.set("siding", opts.siding);
  if (opts.src) q.set("src", opts.src);
  const s = q.toString();
  return s ? `${DESIGNER_PATH}?${s}` : DESIGNER_PATH;
}

/** The fields a plan page passes to draw a home without the buyer's picks. */
export interface ElevationImagePlan {
  modelNumber?: string | null;
  name?: string;
  series?: string | null;
  homeType?: string | null;
  widthFt?: number | null;
  lengthFt?: number | null;
  beds?: number | null;
}

/**
 * URL of a plan's elevation as a standalone SVG (/api/plan-elevation/image).
 * The series and section type pick the colour catalogue; the size fields only
 * shape the representative fallback for a model with no readable sheet.
 */
export function elevationImageUrl(
  plan: ElevationImagePlan,
  opts: { view?: "front" | "rear" | "left" | "right"; siding?: string } = {},
): string {
  const q = new URLSearchParams();
  if (plan.modelNumber) q.set("model", plan.modelNumber);
  if (plan.series) q.set("series", plan.series);
  if (plan.homeType) q.set("type", plan.homeType);
  if (plan.widthFt) q.set("width", String(plan.widthFt));
  if (plan.lengthFt) q.set("length", String(plan.lengthFt));
  if (plan.beds) q.set("beds", String(plan.beds));
  if (opts.view && opts.view !== "front") q.set("view", opts.view);
  if (opts.siding) q.set("siding", opts.siding);
  if (plan.name) q.set("name", plan.name);
  return `/api/plan-elevation/image?${q.toString()}`;
}
