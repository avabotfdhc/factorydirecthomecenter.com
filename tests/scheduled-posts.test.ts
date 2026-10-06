// Scheduled blog posts (`publishAt` in src/lib/local-posts.ts).
//
// Kyle asks for posts to go live on set days (2026-10-06: three on Monday,
// two on Thursday). A post is cut off by the BUILD time, inlined by
// next.config.ts, so a deployment either publishes it everywhere — index,
// route, sitemap, registry, related-resource cards — or nowhere.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { allLocalBlogPosts, isPublished, localBlogPosts } from "../src/lib/local-posts";
import { getAllPages } from "../src/lib/pages";

test("a post with no publishAt is always published", () => {
  assert.equal(isPublished({}, "2000-01-01T00:00:00Z"), true);
});

test("a scheduled post is out before its instant and in from it", () => {
  const post = { publishAt: "2026-10-15T13:00:00Z" };
  assert.equal(isPublished(post, "2026-10-15T12:59:59Z"), false);
  assert.equal(isPublished(post, "2026-10-15T13:00:00Z"), true);
  assert.equal(isPublished(post, "2026-10-16T00:00:00Z"), true);
});

test("every publishAt parses, and the post's display date is that day in Indiana", () => {
  for (const post of allLocalBlogPosts.filter((p) => p.publishAt)) {
    const at = Date.parse(post.publishAt!);
    assert.ok(!Number.isNaN(at), `${post.slug}: publishAt "${post.publishAt}" does not parse`);
    const day = new Date(at).toLocaleDateString("en-US", {
      timeZone: "America/Indiana/Indianapolis",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    assert.equal(post.date, day, `${post.slug}: shows "${post.date}" but publishes on ${day}`);
  }
});

test("the published list and the registry agree on what is unpublished", () => {
  const published = new Set(localBlogPosts.map((p) => p.slug));
  const registered = new Set(
    getAllPages()
      .filter((p) => p.url.startsWith("/blog/"))
      .map((p) => p.url.replace("/blog/", "")),
  );
  for (const post of allLocalBlogPosts) {
    const live = isPublished(post);
    assert.equal(published.has(post.slug), live, `${post.slug}: published list disagrees with publishAt`);
    assert.equal(registered.has(post.slug), live, `${post.slug}: registry disagrees with publishAt`);
  }
});

test("slugs are unique across published and scheduled posts", () => {
  const slugs = allLocalBlogPosts.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});
