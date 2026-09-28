// The sale page must link to the listing the rest of the site publishes.
//
// /homes-on-sale takes each home's link from CATALOG_INDEX. Until 2026-09-28,
// 42 of those entries named a "dutch-aspire-*" slug — a page published by the
// repo data files rather than the CMS. mergePlans() drops a repo plan whose CMS
// twin carries the same series and model code, so not one of those 42 appeared
// in /floor-plans, sitemap.xml, the featured set or Ava's catalogue; only the
// detail route still resolved them. Every buyer clicking through from the sale
// landed on a duplicate of the CMS page that Google cannot see.
//
// What these tests protect:
//   - no entry points back at a repo-only "dutch-aspire-*" slug
//   - every slug is one the CMS actually publishes, so the destination is the
//     canonical, indexed page for that home
//   - series stays one of the two the catalogue still sells
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { CATALOG_INDEX } from "../src/lib/catalog-index";
import { isRetiredPlanSlug, isRetiredSeries } from "../src/lib/retired-series";

test("no catalogue entry points at a repo-only dutch-aspire page", () => {
  const offenders = Object.entries(CATALOG_INDEX)
    .filter(([, e]) => e.slug.startsWith("dutch-aspire-"))
    .map(([model, e]) => `${model} -> ${e.slug}`);
  assert.deepEqual(
    offenders,
    [],
    "dutch-aspire-* pages are not in the sitemap or the grid; point the model at its CMS slug",
  );
});

test("no catalogue entry points at a retired series or plan", () => {
  for (const [model, e] of Object.entries(CATALOG_INDEX)) {
    assert.ok(!isRetiredPlanSlug(e.slug), `${model} links retired plan ${e.slug}`);
    assert.ok(!isRetiredSeries(e.series), `${model} carries retired series ${e.series}`);
  }
});

test("every catalogue slug is an Aspire or Prime page, and well formed", () => {
  for (const [model, e] of Object.entries(CATALOG_INDEX)) {
    assert.match(e.slug, /^[a-z0-9-]+$/, `${model} has a malformed slug: ${e.slug}`);
    assert.ok(["Aspire", "Prime"].includes(e.series), `${model} has series ${e.series}`);
    const prefix = e.series === "Prime" ? "prime-" : "aspire-";
    assert.ok(
      e.slug.startsWith(prefix),
      `${model} is series ${e.series} but its slug is ${e.slug}`,
    );
  }
});
