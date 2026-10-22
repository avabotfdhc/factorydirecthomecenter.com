// The retired town posts (src/lib/town-post-redirects.ts).
//
// What each test protects:
//   - no town post is left in local-posts.ts: a slug on the redirect list must
//     not also be a post the route would serve, and no post may match the
//     town-post slug shape again (the rule is "no new town posts")
//   - every source is listed once across the whole redirect config
//   - every destination is a page the registry knows, and never itself a
//     redirect source (one hop)
//   - no remaining post or county page links a redirected URL
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { TOWN_POST_DESTINATIONS, TOWN_POST_SLUG, townPostRedirects } from "../src/lib/town-post-redirects";
import { searchConsoleRedirects } from "../src/lib/search-console-redirects";
import { legacyFloorPlanRedirects } from "../src/lib/legacy-redirects";
import { retiredSeriesRedirects } from "../src/lib/retired-series";
import { allLocalBlogPosts } from "../src/lib/local-posts";
import { countyPages } from "../src/lib/county-pages";
import { getAllPages } from "../src/lib/pages";

test("no town post remains in local-posts.ts", () => {
  const redirected = new Set(TOWN_POST_DESTINATIONS.map(([slug]) => slug));
  for (const post of allLocalBlogPosts) {
    assert.ok(!redirected.has(post.slug), `${post.slug} is redirected but still published`);
    assert.ok(!TOWN_POST_SLUG.test(post.slug), `${post.slug} is a new town post; add a /locations page instead`);
  }
});

test("every source is listed exactly once across the redirect config", () => {
  const others = new Set([...searchConsoleRedirects, ...legacyFloorPlanRedirects, ...retiredSeriesRedirects].map((r) => r.source));
  const seen = new Set<string>();
  for (const r of townPostRedirects) {
    assert.ok(r.source.startsWith("/blog/"), r.source);
    assert.equal(r.permanent, true, `${r.source} must be permanent`);
    assert.ok(!seen.has(r.source), `duplicate source ${r.source}`);
    assert.ok(!others.has(r.source), `${r.source} is already redirected elsewhere`);
    seen.add(r.source);
  }
});

test("every destination is a registered page and a single hop", () => {
  const pages = new Set(getAllPages().map((p) => p.url));
  const sources = new Set([...townPostRedirects, ...searchConsoleRedirects, ...legacyFloorPlanRedirects, ...retiredSeriesRedirects].map((r) => r.source));
  for (const r of townPostRedirects) {
    assert.ok(r.destination.startsWith("/locations/"), `${r.source} → ${r.destination}`);
    assert.ok(pages.has(r.destination), `${r.source} → ${r.destination}, which is not a registered page`);
    assert.ok(!sources.has(r.destination), `${r.source} → ${r.destination} chains into another redirect`);
  }
});

test("nothing still links a redirected post", () => {
  const redirected = new Set(townPostRedirects.map((r) => r.source));
  for (const post of allLocalBlogPosts) {
    for (const m of post.html.matchAll(/href="(\/blog\/[^"]+)"/g)) {
      assert.ok(!redirected.has(m[1]), `${post.slug} links ${m[1]}, which now redirects`);
    }
  }
  for (const c of countyPages) {
    for (const p of c.relatedPosts ?? []) assert.ok(!redirected.has(p.href), `${c.slug} lists ${p.href}, which now redirects`);
  }
});
