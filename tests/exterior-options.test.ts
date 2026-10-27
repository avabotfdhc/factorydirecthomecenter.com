// What the Design Your Home page may offer, by series and section type
// (src/lib/exterior-options.ts). Prime is the value series with a fixed
// feature set and its own colour board (Kyle, 2026-10-27); Aspire gets the
// full 2026 board, the Perfect Options doors and packages, and the dormer and
// elevation sheets for its section type. Nothing here carries a price.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { exteriorCatalog, sectionType, seriesKey, swatchLabel } from "../src/lib/exterior-options";

const HEX = /^#[0-9A-Fa-f]{6}$/;

test("Prime homes get Prime's own colours and no upgrades", () => {
  for (const type of ["Single Wide", "Multi-Section"]) {
    const c = exteriorCatalog("Prime", type);
    assert.equal(c.series, "prime");
    assert.deepEqual(c.siding.map((s) => s.label), ["Flint", "White", "Cypress", "Light Blue", "Clay"]);
    assert.deepEqual(c.shutters.map((s) => s.label), ["Black", "Blue", "White", "Clay", "Wine"]);
    assert.deepEqual(c.shingles.map((s) => s.label), ["Black"], "Prime shingles are black 3-tab only");
    assert.equal(c.lineals, false);
    assert.equal(c.blackPackage, false);
    assert.equal(c.upgrades, false);
    assert.equal(c.windowGrids, false, "Prime's standards sheet says Low-E windows, no grids");
    assert.deepEqual(c.gableAccents, []);
    assert.deepEqual(c.dormers, []);
    assert.deepEqual(c.elevations, []);
    assert.deepEqual(c.extraDoors, []);
    assert.deepEqual(c.doors.map((d) => d.id), ["6-panel"]);
    assert.ok(c.siding.every((s) => !s.upgrade), "Prime's board has no upgrade row");
  }
});

test("Prime's Flint and Cypress are Prime's shades, not Aspire's", () => {
  const prime = exteriorCatalog("Prime", "Single Wide");
  const aspire = exteriorCatalog("Aspire", "Single Wide");
  for (const name of ["Flint", "Cypress", "Clay"]) {
    const p = prime.siding.find((s) => s.label === name)!.hex;
    const a = aspire.siding.find((s) => s.label === name)!.hex;
    assert.notEqual(p.toLowerCase(), a.toLowerCase(), `${name} must come from the Prime board`);
  }
});

test("Aspire gets the 2026 board, the Perfect Options doors, and section-specific dormers", () => {
  const single = exteriorCatalog("Aspire", "Single Wide");
  const multi = exteriorCatalog("Aspire", "Multi-Section");
  const modular = exteriorCatalog("Aspire", "Modular");
  for (const c of [single, multi, modular]) {
    assert.equal(c.series, "aspire");
    assert.equal(c.siding.length, 9);
    assert.deepEqual(c.siding.filter((s) => s.upgrade).map((s) => s.label), ["Wedgewood", "Shadow", "Brunswick", "Dublin"]);
    assert.ok(!c.siding.find((s) => s.label === "Cypress")!.upgrade, "Cypress is standard on the 2026 board");
    assert.deepEqual(c.shingles.map((s) => s.label), ["Black", "Weatherwood"]);
    assert.equal(c.lineals, true);
    assert.equal(c.blackPackage, true);
    assert.equal(c.upgrades, true);
    assert.equal(c.windowGrids, true, "Aspire standards sheets say Low-E vinyl grid windows");
    assert.deepEqual(c.doors.map((d) => d.id), ["6-panel", "9-lite", "craftsman", "craftsman-black"]);
    assert.ok(c.doors[0].standard, "6-panel is the standard door on both Aspire standards sheets");
    assert.equal(c.gableAccents.length, 3);
    assert.ok(c.dormers.length > 0 && c.elevations.length > 0);
  }
  assert.equal(single.section, "single");
  assert.equal(multi.section, "multi");
  assert.equal(modular.section, "modular");
  // the sheets differ by section: singles have the S-series, doubles the D-series
  assert.ok(single.dormers.some((d) => d.id === "s7") && !multi.dormers.some((d) => d.id === "s7"));
  assert.ok(multi.dormers.some((d) => d.id === "d10") && !single.dormers.some((d) => d.id === "d10"));
  assert.ok(modular.dormers.some((d) => d.id === "m20"));
});

test("every swatch is a real colour and labels say when the board calls it an upgrade", () => {
  for (const series of ["Aspire", "Prime"]) {
    for (const type of ["Single Wide", "Multi-Section", "Modular"]) {
      const c = exteriorCatalog(series, type);
      const all = [...c.siding, ...c.shingles, ...c.shutters, ...c.gableAccents, ...c.interior.cabinets, ...c.interior.flooring, ...c.interior.countertops];
      for (const s of all) assert.match(s.hex, HEX, `${series} ${s.label}`);
      const labels = all.map((s) => s.label);
      // no duplicate labels inside one list, so a pick is never ambiguous
      for (const list of [c.siding, c.shutters, c.interior.countertops]) {
        assert.equal(new Set(list.map((s) => s.label)).size, list.length);
      }
      assert.ok(labels.length > 0);
    }
  }
  assert.equal(swatchLabel({ label: "Dublin", hex: "#000000", upgrade: true }), "Dublin (upgrade)");
  assert.equal(swatchLabel({ label: "Pearl", hex: "#000000" }), "Pearl");
});

test("series and section are read from the catalogue's own labels", () => {
  assert.equal(seriesKey("Prime"), "prime");
  assert.equal(seriesKey("Aspire"), "aspire");
  assert.equal(seriesKey("Dutch"), "aspire");
  assert.equal(seriesKey(undefined), "aspire");
  assert.equal(sectionType("Single Wide"), "single");
  assert.equal(sectionType("Multi-Section"), "multi");
  assert.equal(sectionType("Modular"), "modular");
  assert.equal(sectionType("Home", 16), "single");
  assert.equal(sectionType("Home", 28), "multi");
});

test("the designer never prices an option and keeps Prime off the upgrade list", () => {
  const src = readFileSync("src/components/HomeDesigner.tsx", "utf8") + readFileSync("src/lib/exterior-options.ts", "utf8");
  assert.ok(!/\$\s?\d/.test(src), "no dollar figures in the designer or its option catalogue");
  assert.match(src, /catalog\.upgrades \?/, "the upgrade checklist is gated on the catalogue");
});
