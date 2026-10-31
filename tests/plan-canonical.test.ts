import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  canonicalPlanSlug,
  canonicalPlans,
  hudCodeFor,
  hudTwinOf,
  isCanonicalPlan,
  isModularCode,
  planModelCode,
} from "../src/lib/plan-canonical";
import { MIN_CMS_SITEMAP_PLANS } from "../src/lib/sitemap-catalogue";

// Kyle, 2026-10-31 (option A): a modular (M) plan page keeps its URL but
// declares its HUD (H) twin as canonical, and the sitemap lists only
// self-canonical pages. Measured that day: 215 active plans, 58 modular twins
// of an active HUD plan, one modular plan with no HUD version.

type P = { slug: string; series: string; modelNumber?: string };

const hud: P = { slug: "aspire-woodward-2856h32103", series: "Aspire", modelNumber: "2856H32103" };
const modular: P = { slug: "aspire-woodward-2856m32103", series: "Aspire", modelNumber: "2856M32103" };
const orphanModular: P = { slug: "aspire-odyssey-3268m32394", series: "Aspire", modelNumber: "3268M32394" };
// Prime's named plans carry no code in the slug; the CMS model number does.
const primeHud: P = { slug: "prime-ballard", series: "Prime", modelNumber: "1676H32107" };
const primeModular: P = { slug: "prime-ballard-1676m32107", series: "Prime", modelNumber: "1676M32107" };
// Same box, other series: a sibling, never a canonical target.
const otherSeriesHud: P = { slug: "prime-2856h32103", series: "Prime", modelNumber: "2856H32103" };
const retiredHudOnly: P = { slug: "aspire-lincoln-2856m32174", series: "Aspire", modelNumber: "2856M32174" };

const all: P[] = [hud, modular, orphanModular, primeHud, primeModular, otherSeriesHud, retiredHudOnly];

test("model codes are read from the CMS model number first, then the slug", () => {
  assert.equal(planModelCode(hud), "2856H32103");
  assert.equal(planModelCode(primeHud), "1676H32107");
  assert.equal(planModelCode({ slug: "aspire-woodward-2856m32103", series: "Aspire" }), "2856M32103");
  assert.equal(planModelCode({ slug: "prime-ballard", series: "Prime" }), "");
  assert.equal(isModularCode("2856M32103"), true);
  assert.equal(isModularCode("2856H32103"), false);
  assert.equal(hudCodeFor("2856M32103"), "2856H32103");
  assert.equal(hudCodeFor("2856H32103"), "2856H32103");
});

test("a modular plan canonicalises to its HUD twin in the same series only", () => {
  assert.equal(hudTwinOf(modular, all)?.slug, hud.slug);
  assert.equal(canonicalPlanSlug(modular, all), hud.slug);
  assert.equal(isCanonicalPlan(modular, all), false);

  // The twin is found through the model number even when the HUD slug has no code.
  assert.equal(canonicalPlanSlug(primeModular, all), primeHud.slug);

  // HUD plans are always their own canonical.
  assert.equal(canonicalPlanSlug(hud, all), hud.slug);
  assert.equal(hudTwinOf(hud, all), undefined);

  // No HUD version sold → self-canonical, stays in the sitemap.
  assert.equal(canonicalPlanSlug(orphanModular, all), orphanModular.slug);
  assert.equal(isCanonicalPlan(orphanModular, all), true);

  // A HUD plan with the same box in ANOTHER series is a sibling, not a twin.
  assert.equal(canonicalPlanSlug(retiredHudOnly, all), retiredHudOnly.slug);
  assert.equal(hudTwinOf({ slug: "prime-2856m32103", series: "Prime", modelNumber: "2856M32103" }, [hud]), undefined);
});

test("the sitemap set is exactly the self-canonical pages", () => {
  const slugs = canonicalPlans(all).map((p) => p.slug);
  assert.deepEqual(slugs, [hud.slug, orphanModular.slug, primeHud.slug, otherSeriesHud.slug, retiredHudOnly.slug]);
});

test("the live catalogue shape stays above the sitemap's degraded-catalogue floor", () => {
  // 215 active plans, 58 modular twins (2026-10-31). The floor is applied to
  // the full set before the canonical filter, but the filtered count must
  // also stay comfortably above it, or a legitimate sitemap would look
  // degraded if the order of the two steps were ever swapped.
  assert.ok(215 - 58 > MIN_CMS_SITEMAP_PLANS);
});

test("the plan page sets the canonical from plan-canonical, and the sitemap filters through it", () => {
  const page = readFileSync(new URL("../src/app/floor-plans/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(page, /canonicalPlanSlug\(plan, allPlans\)/);
  assert.match(page, /alternates: \{ canonical \}/);
  assert.doesNotMatch(page, /alternates: \{ canonical: url \}/);
  const sitemap = readFileSync(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
  assert.match(sitemap, /canonicalPlans\(/);
});
