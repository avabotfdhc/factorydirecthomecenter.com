import { test } from "node:test";
import assert from "node:assert/strict";
import { allLocalBlogPosts } from "../src/lib/local-posts";
import { countyPages } from "../src/lib/county-pages";
import { countyPostLinks, townPageOnlyPosts } from "../src/lib/county-posts";

// County pages with a hand-built route (src/app/locations/<slug>/page.tsx)
// rather than an entry in county-pages.ts.
const STATIC_COUNTIES = ["dekalb-county", "noble-county", "steuben-county", "adams-county", "wells-county", "whitley-county", "lagrange-county"];
const ALL_COUNTIES = [...new Set([...STATIC_COUNTIES, ...countyPages.map((c) => c.slug)])];

// Town posts end in "-indiana"; the guides (Fort Wayne, Auburn, Indianapolis) do not.
const isTownPost = (slug: string) => /^manufactured-homes-.+-indiana$/.test(slug);

test("every town post is listed on at least one county page", () => {
  const listed = new Set(ALL_COUNTIES.flatMap((c) => countyPostLinks(c).map((p) => p.href)));
  const now = new Date().toISOString();
  const missing = allLocalBlogPosts
    .filter((p) => isTownPost(p.slug))
    .filter((p) => !p.publishAt || p.publishAt <= now)
    .filter((p) => !listed.has(`/blog/${p.slug}`))
    .map((p) => p.slug);
  assert.deepEqual(missing, []);
});

test("every new town post links a county page that exists", () => {
  const known = new Set(ALL_COUNTIES);
  for (const p of allLocalBlogPosts) {
    if (!isTownPost(p.slug)) continue;
    const mapped = Object.entries(townPageOnlyPosts).some(([, slugs]) => slugs.includes(p.slug));
    const linked = [...p.html.matchAll(/\/locations\/([a-z-]+-county)"/g)].map((m) => m[1]);
    assert.ok(mapped || linked.length > 0, `${p.slug} names no county page`);
    for (const c of linked) assert.ok(known.has(c), `${p.slug} links /locations/${c}, which does not exist`);
  }
});

test("the town-page-only map names real posts and real counties", () => {
  const slugs = new Set(allLocalBlogPosts.map((p) => p.slug));
  for (const [county, posts] of Object.entries(townPageOnlyPosts)) {
    assert.ok(ALL_COUNTIES.includes(county), county);
    for (const s of posts) assert.ok(slugs.has(s), s);
  }
});
