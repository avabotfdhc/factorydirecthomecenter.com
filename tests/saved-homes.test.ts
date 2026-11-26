// Saved homes (src/lib/saved-homes-core.ts): whatever a browser holds under
// the key is read safely, and a heart press always does what was pressed.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { MAX_SAVED, parseSaved, toggleSaved, toSavedHome, type SavedHome } from "../src/lib/saved-homes-core";

const home = (slug: string): SavedHome => ({
  slug,
  name: slug.toUpperCase(),
  title: "",
  price: "Call for pricing",
  sqft: 1200,
  beds: 3,
  baths: 2,
  image: "",
  brand: "Champion Homes",
  homeType: "Multi-Section",
  series: "Aspire",
});

test("garbage under the key is an empty list, never a crash", () => {
  for (const raw of [null, "", "not json", "{}", "42", '[null, 1, "x"]', '[{"slug":"../../etc","name":"x"}]']) {
    assert.deepEqual(parseSaved(raw), [], String(raw));
  }
});

test("duplicates are dropped and the list is capped", () => {
  const list = Array.from({ length: MAX_SAVED + 5 }, (_, i) => home(`plan-${i}`));
  const raw = JSON.stringify([home("plan-0"), ...list]);
  const parsed = parseSaved(raw);
  assert.equal(parsed.length, MAX_SAVED);
  assert.equal(new Set(parsed.map((h) => h.slug)).size, MAX_SAVED);
});

test("toggling adds newest first, removes on the second press, and drops the oldest when full", () => {
  let list: SavedHome[] = [];
  list = toggleSaved(list, home("a"));
  list = toggleSaved(list, home("b"));
  assert.deepEqual(list.map((h) => h.slug), ["b", "a"]);
  list = toggleSaved(list, home("a"));
  assert.deepEqual(list.map((h) => h.slug), ["b"]);
  const full = Array.from({ length: 3 }, (_, i) => home(`p${i}`));
  assert.deepEqual(toggleSaved(full, home("new"), 3).map((h) => h.slug), ["new", "p0", "p1"]);
});

test("a saved snapshot keeps only card fields", () => {
  const detail = { ...home("x"), floorPlanHtml: "<p>long</p>", gallery: ["a", "b"], modelNumber: "2856H32103" } as SavedHome;
  const saved = toSavedHome(detail) as Record<string, unknown>;
  assert.equal(saved.floorPlanHtml, undefined);
  assert.equal(saved.gallery, undefined);
  assert.equal(saved.modelNumber, undefined);
  assert.equal(saved.slug, "x");
});

test("a round trip through storage gives back the same homes", () => {
  const list = [home("a"), { ...home("b"), bedsMin: 2, bedsMax: 4, virtualTour: "https://my.matterport.com/show/?m=1" }];
  assert.deepEqual(parseSaved(JSON.stringify(list)), list);
});
