// Alt text for the catalogue photos.
//
// There are 945 photos in Champion's Box manifest and they are the bulk of the
// site's imagery. Their alt text is generated from the filename, because
// Champion names the room in it, so the quality of that generator IS the alt
// quality across ~200 floor-plan pages. A photo that falls through gets
// "<plan> multi-section home by Champion Homes — photo 4 of 9", which is true
// but says nothing a search engine or a screen reader can use.
//
// Coverage measured against the real manifest on 2026-09-23: 89.4% before,
// 97.4% after. The floor is pinned here so a change to ROOMS cannot quietly
// send photos back to the generic alt.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describeImageFile, planImageAlt } from "../src/lib/image-alt";

const manifestPhotos = (): string[] => {
  const raw = JSON.parse(readFileSync("public/seed/box-import-manifest.json", "utf8"));
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === "string") { if (/\.(jpe?g|png|webp)$/i.test(v)) out.push(v); }
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(raw);
  return out;
};

test("at least 95% of the real catalogue photos get a specific description", () => {
  const photos = manifestPhotos();
  assert.ok(photos.length > 900, `expected the manifest to still hold the catalogue, found ${photos.length}`);

  const described = photos.filter((p) => describeImageFile(p) !== "").length;
  const pct = (described / photos.length) * 100;
  assert.ok(
    pct >= 95,
    `only ${pct.toFixed(1)}% of ${photos.length} catalogue photos get a room description (was 97.4% on 2026-09-23)`,
  );
});

test("the filename patterns Champion actually uses are read correctly", () => {
  const cases: [string, string][] = [
    ["112-paramount-3260h32394-odyssey-bath.jpg", "bathroom"],
    ["lincoln-kitchen.webp", "kitchen"],
    ["043-prime-vertex-primary-bedroom2.jpg", "primary bedroom"],
    ["043-prime-vertex-kitchen3.jpg", "kitchen"],
    ["112-paramount-1668h22259-drone4.jpg", "aerial exterior view"],
    ["112-paramount-1668h22259-utilities.jpg", "utility room"],
    ["043-prime-vertex-details1.jpg", "detail view"],
    ["aspire-1660h22212-exterior.jpg", "exterior"],
  ];
  for (const [file, expected] of cases) {
    assert.equal(describeImageFile(file), expected, `describeImageFile(${file})`);
  }
});

test("a repeated room number does not fall through to the generic alt", () => {
  // Every ROOMS pattern ends in \b, and a digit straight after a letter is not
  // a word boundary, so "…-bedroom2" used to describe nothing at all.
  for (const n of ["bedroom2", "bedroom3", "kitchen2", "bathroom4"]) {
    assert.notEqual(describeImageFile(`043-prime-vertex-${n}.jpg`), "", n);
  }
});

test("every alt names the home, so no photo is described by its room alone", () => {
  const alt = planImageAlt("112-paramount-1668h22259-drone4.jpg", "Dutch Aspire 1660H22212", "Multi-Section", 3, 9);
  assert.match(alt, /Dutch Aspire 1660H22212/);
  assert.match(alt, /aerial exterior view/);
  assert.match(alt, /photo 4 of 9/);

  // And the fallback still identifies the home and the builder.
  const fallback = planImageAlt("1456H22P01_LR.jpg", "Prime Peak", "Single Wide", 0, 1);
  assert.match(fallback, /Prime Peak/);
  assert.match(fallback, /Champion Homes/);
});
