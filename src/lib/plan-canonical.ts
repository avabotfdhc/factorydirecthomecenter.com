// Which floor-plan page is the canonical one for a physical home.
//
// Champion builds many sectionals twice from one box: a HUD-code version
// (model letter `H`, e.g. 2856H32103) and an IRC modular version (`M`,
// 2856M32103). The site gives each its own /floor-plans page, and on
// 2026-10-31 the live catalogue had 215 active plans of which 58 were modular
// twins of an active HUD plan in the same series. Those pairs are 85–98%
// identical text (measured on the built pages), ~104 plan URLs sat in Search
// Console as "Discovered – currently not indexed", and the duplicates compete
// with each other for the same searches.
//
// Kyle's decision (2026-10-31, option A of the handoff): a modular page KEEPS
// its URL and its content — a buyer who needs IRC construction still lands on
// a real page with the right specs — but it declares its HUD twin as the
// canonical URL, and sitemap.xml lists only canonical pages. No redirects,
// no URL changes, nothing a visitor can see. Google folds the pair's signals
// onto the HUD page instead of splitting them.
//
// The HUD page is the canonical of the two because it is the version the
// search is for in this market (chattel-financed, community- or
// pier-set homes), the one the sale table and the type landing pages link,
// and the one Champion photographs; the modular page says "also built as an
// IRC modular home" in its narrative and now says it to crawlers too.
//
// A modular plan with NO active HUD twin in its series stays self-canonical
// and in the sitemap (one on 2026-10-31: aspire-odyssey-3268m32394). The
// Aspire ⇄ Prime same-model-number siblings are a different series with
// different standard features and are deliberately NOT canonicalised here.

import type { ApiFloorPlan } from "./api-content";

type PlanLike = Pick<ApiFloorPlan, "slug" | "series" | "modelNumber">;

const CODE_RE = /(\d{4})([HM])(\d{2}[A-Z0-9]{3})/i;

/**
 * Champion model code for a plan ("2856H32103"), from the CMS `modelNumber`
 * when it carries one, else from the slug ("aspire-woodward-2856h32103").
 * Empty when neither does (Prime plans named without a code in the slug and
 * with no model number recorded).
 */
export function planModelCode(plan: PlanLike): string {
  const fromModel = plan.modelNumber?.match(CODE_RE);
  if (fromModel) return `${fromModel[1]}${fromModel[2]}${fromModel[3]}`.toUpperCase();
  const fromSlug = plan.slug.match(CODE_RE);
  return fromSlug ? `${fromSlug[1]}${fromSlug[2]}${fromSlug[3]}`.toUpperCase() : "";
}

/** True for an IRC modular model code (the `M` letter after the box size). */
export function isModularCode(code: string): boolean {
  return /^\d{4}M/.test(code);
}

/** The HUD-code model code for a modular one: 2856M32103 → 2856H32103. */
export function hudCodeFor(code: string): string {
  return code.replace(/^(\d{4})M/, "$1H");
}

/**
 * The active HUD-code twin of a modular plan, in the same series, if the
 * catalogue has one. Undefined for a HUD plan, for a code-less plan, and for
 * a modular plan whose HUD version is not sold.
 */
export function hudTwinOf<T extends PlanLike>(plan: PlanLike, all: readonly T[]): T | undefined {
  const code = planModelCode(plan);
  if (!code || !isModularCode(code)) return undefined;
  const want = hudCodeFor(code);
  const series = plan.series.toLowerCase();
  return all.find((p) => p.slug !== plan.slug && p.series.toLowerCase() === series && planModelCode(p) === want);
}

/**
 * The slug whose URL this plan's page should declare as canonical: the HUD
 * twin's for a modular plan that has one, otherwise its own.
 */
export function canonicalPlanSlug(plan: PlanLike, all: readonly PlanLike[]): string {
  return hudTwinOf(plan, all)?.slug ?? plan.slug;
}

/** True when the plan's page is its own canonical (and so belongs in the sitemap). */
export function isCanonicalPlan(plan: PlanLike, all: readonly PlanLike[]): boolean {
  return canonicalPlanSlug(plan, all) === plan.slug;
}

/** The plans whose pages are self-canonical — what sitemap.xml lists. */
export function canonicalPlans<T extends PlanLike>(all: readonly T[]): T[] {
  return all.filter((p) => isCanonicalPlan(p, all));
}
