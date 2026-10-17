// sitemap.xml must never publish the degraded catalogue.
//
// When the CMS cannot be read, pages fall back to the repo-published copy —
// 77 plans, 44 of them `dutch-aspire-*` slugs that now 301. For a page that
// is a graceful substitute; in the sitemap it is a lie: two hundred live URLs
// gone and forty redirects listed, cached for the ISR hour. The sitemap reads
// the catalogue strictly and, when the read fails or collapses, throws at
// runtime (ISR keeps the last good file) or omits the section at build time
// (so a CMS blip cannot block a deploy). See src/lib/sitemap-catalogue.ts.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  MIN_CMS_SITEMAP_PLANS,
  isBuildPhase,
  planEntriesForSitemap,
} from "../src/lib/sitemap-catalogue";
import { getApiFloorPlans } from "../src/lib/api-content";

const quiet = { error: () => {} };
const healthy = Array.from({ length: 214 }, (_, i) => ({ slug: `aspire-${i}` }));
const degraded = Array.from({ length: 77 }, (_, i) => ({ slug: `dutch-aspire-${i}` }));

test("a healthy CMS read is published as-is", () => {
  const out = planEntriesForSitemap({ plans: healthy, cmsConfigured: true }, { buildPhase: false }, quiet);
  assert.equal(out, healthy);
});

test("a repo-only site (no CMS configured) is never 'degraded'", () => {
  const out = planEntriesForSitemap({ plans: degraded, cmsConfigured: false }, { buildPhase: false }, quiet);
  assert.equal(out, degraded);
});

test("a failed CMS read throws at runtime so ISR keeps the last good sitemap", () => {
  assert.throws(
    () =>
      planEntriesForSitemap(
        { plans: degraded, cmsConfigured: true, error: new Error("ETIMEDOUT") },
        { buildPhase: false },
        quiet,
      ),
    /DEGRADED.*ETIMEDOUT/,
  );
});

test("a collapsed result (CMS answered, far too few rows) is treated as a failure", () => {
  assert.throws(
    () => planEntriesForSitemap({ plans: degraded, cmsConfigured: true }, { buildPhase: false }, quiet),
    /only 77 plans/,
  );
  assert.throws(
    () => planEntriesForSitemap({ plans: [], cmsConfigured: true }, { buildPhase: false }, quiet),
    /only 0 plans/,
  );
});

test("at build time a degraded read omits the section instead of failing the build", () => {
  const logged: string[] = [];
  const out = planEntriesForSitemap(
    { plans: degraded, cmsConfigured: true, error: new Error("HTTP 404") },
    { buildPhase: true },
    { error: (m: string) => logged.push(m) },
  );
  assert.deepEqual(out, []);
  assert.equal(logged.length, 1);
  assert.match(logged[0], /build-time render omits the floor-plan section/);
});

test("isBuildPhase reads Next's build marker", () => {
  assert.equal(isBuildPhase({ NEXT_PHASE: "phase-production-build" }), true);
  assert.equal(isBuildPhase({}), false);
  assert.equal(isBuildPhase({ NEXT_PHASE: "phase-development-server" }), false);
});

test("the floor sits above the repo-only catalogue, so 'CMS returned nothing' is always caught", async () => {
  // In the test environment no Supabase env vars are set, so this is exactly
  // the list the sitemap would have published during a CMS outage.
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const repoOnly = await getApiFloorPlans();
  assert.ok(repoOnly.length > 0, "the repo copy exists");
  assert.ok(
    repoOnly.length < MIN_CMS_SITEMAP_PLANS,
    `repo-only catalogue (${repoOnly.length}) must stay below the floor (${MIN_CMS_SITEMAP_PLANS}); raise the floor if the repo copy grows`,
  );
  const redirecting = repoOnly.filter((p) => p.slug.startsWith("dutch-aspire-")).length;
  assert.ok(redirecting > 0, "the repo copy still carries redirecting slugs — the reason this guard exists");
});

test("sitemap.ts reads the catalogue strictly and routes it through the guard", () => {
  const src = readFileSync("src/app/sitemap.ts", "utf8").replace(/\/\/.*$/gm, "");
  assert.ok(src.includes("getApiFloorPlans({ requireCms: true })"), "sitemap asks for a strict CMS read");
  assert.ok(src.includes("planEntriesForSitemap("), "sitemap routes plans through the guard");
  assert.ok(!/\bgetApiFloorPlans\(\)/.test(src), "no lenient catalogue read remains in sitemap.ts");
});

test("getApiFloorPlans still falls back silently for pages (requireCms defaults off)", () => {
  const src = readFileSync("src/lib/api-content.ts", "utf8");
  assert.ok(src.includes("requireCms = false"), "pages keep the graceful fallback by default");
  const supabase = readFileSync("src/lib/supabase-content.ts", "utf8");
  assert.ok(supabase.includes("if (throwOnFailure) throw err;"), "the strict path rethrows");
  assert.ok(supabase.includes("throwOnFailure = false"), "the lenient path is still the default");
});
