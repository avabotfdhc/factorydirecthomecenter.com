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
    // DealerTide feed shapes (2026-10-18): glued room words, "staged"
    // interiors named for the family, "hallway", and the listing's lead photo.
    ["112-aspire-1672h32184-exteriorfront-2.jpg", "exterior"],
    ["112-aspire-1672h32184-livingroom-staged-1.jpg", "living room"],
    ["112-aspire-1672h32184-utilityroom-2.jpg", "utility room"],
    ["112-aspire-2852h32171-primarybedroom-staged.jpg", "primary bedroom"],
    ["112-aspire-2852h32171-lincoln-staged-3.jpg", "staged interior"],
    ["112-aspire-1676h32089-hallway.jpg", "hallway"],
    ["aspire-1432h11214-main-image.jpg", "main photo"],
    ["aspire_0020_2852h42096-main.jpg", "main photo"],
    ["112-aspire-2852h32171-vs-living-room-main.jpg", "living room"],
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

// Champion's marketing art for a plan it has not photographed. Naming it costs
// nothing and says the picture is an artist's impression rather than a home
// that exists — the same thing SpecsDisclaimer says in words. Eleven files in
// /images/prime/ are named this way and described nothing before 2026-09-28.
test("a rendering is described as a rendering, and never outranks a named room", () => {
  assert.equal(describeImageFile("/images/prime/apex-rendering.webp"), "exterior rendering");
  assert.equal(describeImageFile("/images/prime/crown-rendering.webp"), "exterior rendering");
  // A file that names a room is still that room, not a rendering. These two
  // carry BOTH words, which is the only shape that actually tests the ordering
  // — asserting it with a filename that has no "rendering" in it proves
  // nothing, and the first version of this test did exactly that.
  assert.equal(describeImageFile("kitchen-rendering.webp"), "kitchen");
  assert.equal(describeImageFile("primary-bedroom-render.jpg"), "primary bedroom");
  assert.equal(describeImageFile("/images/prime/monte-dining.webp"), "dining area");
  assert.equal(describeImageFile("/images/prime/monte-exterior-1.webp"), "exterior");
  // A drawing is still a drawing.
  assert.equal(describeImageFile("/images/prime/barkley-floorplan.webp"), "floor plan sheet");
});

// The alt bar applies to GALLERY photos, which show one part of a home. A hero
// image is of the whole home, so "Woodward multi-section home by Champion
// Homes" is the correct alt for it, not a failure to describe. Measuring hero
// images against a room-naming bar produced a misleading "72.9% coverage" on
// 2026-09-28 and nearly triggered a pointless rewrite. scripts/audit-image-alt.ts
// keeps the two apart when it checks the live catalogue; this pins the shape the
// fallback has to keep for that to be true.
test("a home's own card image gets a complete alt without naming a room", () => {
  // Filenames that are just the model number: nothing to describe, by design.
  assert.equal(describeImageFile("/images/paramount/2460h42096.webp"), "");
  assert.equal(describeImageFile("legacy/silverton-2856h32174.webp"), "");

  const alt = planImageAlt("legacy/silverton-2856h32174.webp", "Silverton", "Multi-Section", 0, 1);
  assert.match(alt, /Silverton/, "the home is named");
  assert.match(alt, /multi-section home/, "the kind of home is named");
  assert.match(alt, /Champion Homes/, "the builder is named");
  assert.ok(alt.trim().length > 20, `fallback alt must be substantive, got "${alt}"`);
});

// 2026-10-13: an SEO tool reported the site's photos as "Champion modular".
// The source was the default share-image alt in generateMetadata() — "…
// Manufactured and Modular Homes" — inherited by every page without its own
// image, describing a photo of a manufactured home. The default must describe
// /images/hero-home.jpg, which is not a modular home.
test("the default share-image alt does not call the photo modular", async () => {
  const { generateMetadata } = await import("../src/lib/seo");
  const meta = generateMetadata({ title: "Test", description: "Test page", url: "/test" });
  const images = [meta.openGraph?.images, meta.twitter?.images].flat().filter(Boolean) as Array<{ alt?: string }>;
  assert.ok(images.length > 0, "expected a default share image");
  for (const img of images) assert.doesNotMatch(img.alt ?? "", /modular/i);
});
