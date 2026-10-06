// Keep the blog's full HTML out of every page's first download.
//
// PageFooter is a client component, and to find the current URL's related
// pages it imports the page registry, which is built from every blog post in
// local-posts.ts — bodies included. Imported straight into the root layout,
// that put ~35 posts of HTML (~67 KB compressed, growing with each post) in the
// JavaScript every visitor downloads ahead of the LCP image (PageSpeed,
// 2026-09-29). DeferredPageFooter loads it with React.lazy instead: still
// server-rendered, but its code arrives after hydration starts.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("the root layout renders PageFooter through the lazy wrapper", () => {
  const layout = readFileSync("src/app/layout.tsx", "utf8");
  assert.ok(
    !/from\s+["']@\/components\/PageFooter["']/.test(layout),
    "layout.tsx imports PageFooter directly — use DeferredPageFooter so the registry (and every post body) stays out of the initial bundle",
  );
  assert.ok(layout.includes("<DeferredPageFooter />"));
  const wrapper = readFileSync("src/components/DeferredPageFooter.tsx", "utf8");
  assert.match(wrapper, /lazy\(\(\) => import\(["']\.\/PageFooter["']\)\)/);
});

test("the lazy wrapper never imports the registry, and skips the homepage", () => {
  // DeferredPageFooter is in the layout, so whatever it imports ships on every
  // page. canonicalPathname lives in its own import-free module for that reason.
  const wrapper = readFileSync("src/components/DeferredPageFooter.tsx", "utf8");
  assert.ok(!/from\s+["']@\/lib\/pages["']/.test(wrapper), "DeferredPageFooter must not import @/lib/pages");
  assert.match(wrapper, /canonicalPathname\(usePathname\(\)\)/);
  assert.match(wrapper, /pathname === "\/"\) return null/);
  const helper = readFileSync("src/lib/canonical-pathname.ts", "utf8");
  assert.ok(!/^import /m.test(helper), "canonical-pathname.ts must stay import-free");
});
