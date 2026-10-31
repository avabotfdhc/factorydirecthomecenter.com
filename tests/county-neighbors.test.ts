// Neighbouring-county links (src/lib/county-neighbors.ts).
//
// What each test protects:
//   - the map is symmetric: if A lists B as a neighbour, B lists A
//   - every slug in the map is a county page that exists (programmatic entry
//     in county-pages.ts or a static folder under src/app/locations/)
//   - every county page has at least one neighbour, so none is left unlinked
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { COUNTY_NEIGHBORS, countyLabel, neighborCounties } from "../src/lib/county-neighbors";
import { countyPages } from "../src/lib/county-pages";

const LOCATIONS_DIR = join(__dirname, "..", "src", "app", "locations");
const pageExists = (slug: string) =>
  countyPages.some((c) => c.slug === slug) || existsSync(join(LOCATIONS_DIR, slug, "page.tsx"));

test("neighbour map is symmetric", () => {
  for (const [a, list] of Object.entries(COUNTY_NEIGHBORS)) {
    for (const b of list) {
      assert.ok(COUNTY_NEIGHBORS[b]?.includes(a), `${a} lists ${b}, but ${b} does not list ${a}`);
    }
  }
});

test("every slug in the map has a page", () => {
  const all = new Set([...Object.keys(COUNTY_NEIGHBORS), ...Object.values(COUNTY_NEIGHBORS).flat()]);
  for (const slug of all) assert.ok(pageExists(slug), `no page for /locations/${slug}`);
});

test("every county page has at least one neighbour", () => {
  const countySlugs = new Set([
    ...countyPages.map((c) => c.slug),
    "dekalb-county", "noble-county", "steuben-county", "lagrange-county",
    "wells-county", "adams-county", "whitley-county",
  ]);
  for (const slug of countySlugs) {
    assert.ok(neighborCounties(slug).length > 0, `${slug} has no neighbours listed`);
  }
});

test("labels keep the irregular spellings", () => {
  assert.equal(countyLabel("dekalb-county"), "DeKalb County");
  assert.equal(countyLabel("lagrange-county"), "LaGrange County");
  assert.equal(countyLabel("st-joseph-county"), "St. Joseph County");
  assert.equal(countyLabel("wells-county"), "Wells County");
});
