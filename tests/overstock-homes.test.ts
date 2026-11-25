// Overstock homes (src/lib/overstock-homes.ts) are real units at a Champion
// plant, listed on /homes-on-sale/clearance. The list is hand-entered from a
// factory order, so these checks hold the rules a hand entry can break.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { OVERSTOCK_HOMES, formatOverstockDate, overstockMonth } from "../src/lib/overstock-homes";
import { getAllPages } from "../src/lib/pages";

const source = readFileSync("src/lib/overstock-homes.ts", "utf8");
const page = readFileSync("src/app/homes-on-sale/clearance/page.tsx", "utf8");

test("no dollar figure in the overstock data or on the page", () => {
  assert.doesNotMatch(source, /\$\s?\d/, "prices are hidden site-wide");
  assert.doesNotMatch(page, /\$\s?\d/, "prices are hidden site-wide");
});

test("an overstock home never claims to be on the lot or in stock", () => {
  for (const text of [source.replace(/\/\/.*$/gm, ""), page.replace(/\/\/.*$/gm, "")]) {
    assert.doesNotMatch(text, /in[- ]stock|on (our|the) lot/i);
  }
});

test("every overstock home has its images, a plan page slug and a real completion day", () => {
  for (const home of OVERSTOCK_HOMES) {
    assert.ok(existsSync(`public${home.image}`), `${home.id}: missing ${home.image}`);
    assert.ok(existsSync(`public${home.floorPlanImage}`), `${home.id}: missing ${home.floorPlanImage}`);
    assert.match(home.factoryCompleteDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(home.planSlug, /^[a-z0-9-]+$/);
    assert.ok(home.imageAlt.length > 20 && home.floorPlanAlt.length > 20);
    assert.ok(home.colors.length > 0 && home.options.length > 0 && home.standards.length > 0);
  }
});

test("Prime overstock homes name the Decatur plant, never Topeka", () => {
  for (const home of OVERSTOCK_HOMES.filter((h) => h.series === "Prime")) {
    assert.match(home.plant, /Decatur/);
    assert.doesNotMatch(home.plant, /Topeka/);
  }
});

test("the page is registered exactly while a home is listed, and renders the specs disclaimer", () => {
  const registered = getAllPages().some((p) => p.url === "/homes-on-sale/clearance");
  assert.equal(registered, OVERSTOCK_HOMES.length > 0);
  assert.match(page, /noindex: !HAS_HOMES/);
  assert.match(page, /<SpecsDisclaimer \/>/);
});

test("dates read as calendar dates", () => {
  assert.equal(formatOverstockDate("2026-12-09"), "December 9, 2026");
  assert.equal(overstockMonth("2026-12-09"), "December");
});
