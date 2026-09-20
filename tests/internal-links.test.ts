// Every URL the site advertises must actually resolve.
//
// The failure this guards against was live in production on 2026-09-14: the
// twelve posts in `blog.ts` that no route serves were injected into the page
// registry, so they appeared as "Related Resources" cards on pages across the
// site and as URLs in sitemap.xml, and all twelve answered 404. A dealership
// asking Google to crawl twelve dead pages, and sending buyers to them, is a
// trust problem before it is a crawl-budget one.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { getAllPages, sitePages } from "../src/lib/pages";
import { localBlogPosts } from "../src/lib/local-posts";
import { getPublishedPosts } from "../src/lib/blog";
import { structuredData } from "../src/lib/seo";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const liveSlugs = new Set(localBlogPosts.map((p) => p.slug));

test("the page registry only advertises blog posts that render", () => {
  const advertised = getAllPages().filter((p) => p.url.startsWith("/blog/"));
  const dead = advertised.filter((p) => !liveSlugs.has(p.url.replace("/blog/", "")));
  assert.deepEqual(
    dead.map((p) => p.url),
    [],
    "these URLs are linked and put in the sitemap but 404: publish the post in local-posts.ts, or drop it from blog.ts",
  );
});

test("the guard is actually doing something", () => {
  // If blog.ts ever stops listing posts the route cannot serve, this test can
  // go — until then it proves the filter is load-bearing, not decoration.
  const unpublishable = getPublishedPosts().filter((p) => !liveSlugs.has(p.slug));
  assert.ok(
    unpublishable.length > 0,
    "blog.ts no longer lists unrendered posts — the registry filter in pages.ts can be removed",
  );
  const advertisedSlugs = new Set(
    getAllPages()
      .filter((p) => p.url.startsWith("/blog/"))
      .map((p) => p.url.replace("/blog/", "")),
  );
  for (const p of unpublishable) {
    assert.equal(advertisedSlugs.has(p.slug), false, `${p.slug} must not be advertised`);
  }
});

test("no registry page points at an empty or off-site URL", () => {
  for (const page of sitePages) {
    assert.ok(page.url.startsWith("/"), `${page.title}: URL must be a site path, got "${page.url}"`);
    assert.ok(!page.url.includes("undefined"), `${page.title}: URL contains "undefined"`);
    assert.ok(!page.url.includes("null"), `${page.title}: URL contains "null"`);
  }
});

test("the sitelinks searchbox target is a route that exists", () => {
  // structuredData.website() has always published a SearchAction pointing at
  // /search?q={search_term_string}. Until 2026-09-20 no /search route existed
  // and that URL answered 404 — the site was telling Google it had a search
  // endpoint it did not have. Google's sitelinks-searchbox documentation
  // requires the target to resolve, and a schema claim the site cannot honour
  // undermines the rest of the graph.
  const action = (structuredData.website() as {
    potentialAction?: { target?: { urlTemplate?: string } };
  }).potentialAction;
  const template = action?.target?.urlTemplate;
  assert.ok(template, "WebSite schema must declare a SearchAction target");

  const path = new URL(template!).pathname.replace(/^\/|\/$/g, "");
  const route = resolve(process.cwd(), "src/app", path, "page.tsx");
  assert.ok(
    existsSync(route),
    `SearchAction points at /${path} but ${route} does not exist — either build the page or drop the SearchAction`,
  );
});
