// Redirects for the URLs Google Search Console reported as 404 on 2026-10-12.
//
// What each test protects:
//   - a source is listed once, here and across the whole redirect config
//     (Next.js takes the first match, so a duplicate is silently dead)
//   - no destination is itself a redirect source (one hop, never a chain) or a
//     retired Paramount page
//   - plan destinations are CMS "aspire-*" slugs carrying the SAME model code
//     as the dutch-aspire page they replace
//   - the list is spread first in next.config.ts, ahead of the pattern rules
//     that would otherwise catch some of these URLs
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { searchConsoleRedirects, DEAD_DUTCH_ASPIRE, LIVE_DUTCH_ASPIRE } from "../src/lib/search-console-redirects";
import { legacyFloorPlanRedirects } from "../src/lib/legacy-redirects";
import { retiredSeriesRedirects, isRetiredPlanSlug } from "../src/lib/retired-series";

const MODEL = /(\d{4}[hm]\d{2}[a-z0-9]{3})$/;

test("every source is listed exactly once", () => {
  const seen = new Set<string>();
  for (const r of searchConsoleRedirects) {
    assert.ok(!seen.has(r.source), `duplicate source ${r.source}`);
    seen.add(r.source);
    assert.equal(r.permanent, true, `${r.source} must be a permanent redirect`);
  }
});

test("no source is also claimed by the older exact-match lists", () => {
  const older = new Set([...legacyFloorPlanRedirects, ...retiredSeriesRedirects].map((r) => r.source));
  for (const r of searchConsoleRedirects) assert.ok(!older.has(r.source), `${r.source} is already redirected elsewhere`);
});

test("no destination is itself redirected or retired (single hop)", () => {
  const sources = new Set(
    [...searchConsoleRedirects, ...legacyFloorPlanRedirects, ...retiredSeriesRedirects].map((r) => r.source),
  );
  for (const r of searchConsoleRedirects) {
    assert.ok(!sources.has(r.destination), `${r.source} → ${r.destination} is a chain`);
    assert.ok(!/^\/(brands|special-plans)(\/|$)/.test(r.destination), `${r.destination} matches a pattern redirect`);
    const slug = r.destination.match(/^\/floor-plans\/(.+)$/)?.[1];
    if (slug) {
      assert.ok(!isRetiredPlanSlug(slug), `${r.destination} is a retired plan`);
      assert.ok(!slug.startsWith("dutch-aspire"), `${r.destination} is a repo-only duplicate page`);
    }
  }
});

test("each dutch-aspire page lands on the aspire page for the same model code", () => {
  assert.equal(DEAD_DUTCH_ASPIRE.length, 66);
  assert.equal(LIVE_DUTCH_ASPIRE.length, 44);
  for (const [from, dest] of [...DEAD_DUTCH_ASPIRE, ...LIVE_DUTCH_ASPIRE]) {
    assert.match(from, /^dutch-aspire/);
    assert.match(dest, /^aspire-/);
    assert.equal(from.match(MODEL)?.[1], dest.match(MODEL)?.[1], `${from} → ${dest} changes the model`);
  }
});

test("the list is spread before every other redirect in next.config.ts", () => {
  const config = readFileSync("next.config.ts", "utf8");
  const body = config.slice(config.indexOf("async redirects()"));
  const first = body.indexOf("...searchConsoleRedirects");
  assert.ok(first > 0, "next.config.ts does not spread searchConsoleRedirects");
  assert.ok(first < body.indexOf("source:"), "searchConsoleRedirects must come before the pattern rules");
});

// 2026-10-13: every repo-published dutch-aspire-* page duplicated a CMS page.
// A new one added to the data files must get its 301 too, or it becomes a
// second, unlisted page for the same home again.
test("every dutch-aspire slug in the repo data files is redirected", () => {
  const sources = new Set(searchConsoleRedirects.map((r) => r.source));
  const slugs = ["src/lib/aspire-floor-plans.ts", "src/lib/local-floor-plans.ts"].flatMap((f) =>
    [...readFileSync(f, "utf8").matchAll(/slug:\s*"(dutch-aspire[^"]*)"/g)].map((m) => m[1]),
  );
  assert.ok(slugs.length >= 44, "expected the repo dutch-aspire plans to be found");
  const missing = slugs.filter((s) => !sources.has(`/floor-plans/${s}`));
  assert.deepEqual(missing, [], "redirect these to the aspire-* page with the same model code");
});
