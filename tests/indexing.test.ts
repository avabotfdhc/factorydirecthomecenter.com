// Search Console, 2026-10-12: two things kept good pages out of the index.
//
//   - Every page published hreflang alternates at `?lang=es` / `?lang=my`. The
//     server renders English at those URLs and canonicalises them to the plain
//     URL, so Google recorded ~200 "Page with redirect" / alternate-canonical
//     rows. No page may publish hreflang until a translation renders on the
//     server at its own URL.
//   - `/champion-homes` and `/design-your-home` rendered and were indexable but
//     were missing from the page registry, so sitemap.xml never listed them.
//     Every static, indexable route must be in the registry.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { getAllPages } from "../src/lib/pages";
import { SERVICE_AREA_LINKS } from "../src/lib/service-area-links";

const APP = "src/app";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const sourceFiles = walk("src").filter((f) => /\.(ts|tsx)$/.test(f));

test("no page publishes hreflang alternates", () => {
  const offenders = sourceFiles.filter((f) => {
    const src = readFileSync(f, "utf8").replace(/\/\/.*$/gm, "");
    return /\blanguages\s*:/.test(src) || /\?lang=(es|my)/.test(src);
  });
  assert.deepEqual(offenders, [], "hreflang to ?lang= URLs points Google at English duplicates");
});

// Routes that are deliberately not in the sitemap: noindex or disallowed in
// robots.txt.
const NOT_INDEXED = new Set(["/search", "/design-system"]);

test("every static, indexable page route is in the page registry (and so the sitemap)", () => {
  const registered = new Set(getAllPages().map((p) => p.url));
  const routes = walk(APP)
    .filter((f) => f.endsWith(`${sep}page.tsx`))
    .map((f) => "/" + relative(APP, f).split(sep).slice(0, -1).join("/"))
    .map((r) => (r === "/" ? "/" : r.replace(/\/$/, "")))
    // dynamic segments are listed from their data, route groups and admin are private
    .filter((r) => !r.includes("[") && !r.includes("(") && !r.startsWith("/admin"))
    .filter((r) => !NOT_INDEXED.has(r));
  const missing = routes.filter((r) => !registered.has(r));
  assert.deepEqual(missing, [], "add these routes to sitePages in src/lib/pages.ts so the sitemap lists them");
});

// 2026-10-13: the homepage and footer now link the town pages (until then
// nothing outside /locations did). A link to a page that is not registered is
// either a 404 or a page missing from the sitemap.

test("every Areas We Serve link points at a registered page", () => {
  const registered = new Set(getAllPages().map((p) => p.url));
  const missing = SERVICE_AREA_LINKS.map((l) => l.href).filter((h) => !registered.has(h));
  assert.deepEqual(missing, [], "these service-area links are not in the page registry");
});
