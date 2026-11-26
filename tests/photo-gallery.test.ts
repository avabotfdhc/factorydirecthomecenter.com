// The /photos gallery (src/lib/photo-gallery.ts): what goes in a room, what
// stays out, and that every room page is registered for the sitemap.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildGallery, GALLERY_ROOMS, roomForImage, type PlanPhotoSource } from "../src/lib/photo-gallery";
import { getAllPages } from "../src/lib/pages";

const B = "https://example.supabase.co/storage/v1/object/public/catalogue/aspire";

function plan(slug: string, homeType: string, images: string[]): PlanPhotoSource {
  return { slug, name: slug.split("-")[1] ?? slug, homeType, series: "Aspire", images };
}

test("room photos land in their room; drawings, renderings and unnamed files stay out", () => {
  assert.equal(roomForImage(`${B}/2856H32103/photos/woodward-kitchen2.webp`), "kitchens");
  assert.equal(roomForImage(`${B}/2856H32103/photos/woodward-primary-bath.webp`), "bathrooms");
  assert.equal(roomForImage(`${B}/2856H32103/photos/woodward-exterior-front.webp`), "exteriors");
  assert.equal(roomForImage(`${B}/2856H32103/photos/woodward-utility.webp`), "laundry-and-entry");
  // Not photographs of a room, or nothing we can name:
  assert.equal(roomForImage(`${B}/2856H32103/plans/112AP-2856H32103-SALES.webp`), "");
  assert.equal(roomForImage(`${B}/2856H32103/photos/woodward-rendering.webp`), "");
  assert.equal(roomForImage(`${B}/2856H32103/photos/aspire-2856h32103-main-image.jpg`), "");
  assert.equal(roomForImage(`${B}/2856H32103/photos/1456H22P01_LR.jpg`), "");
});

test("a photo shared by two plans is shown once, under the first plan", () => {
  const shared = `${B}/2852H32103/photos/lincoln-kitchen.webp`;
  const twin = shared.replace("2852H32103", "2852M32103");
  const g = buildGallery([
    plan("aspire-lincoln-2852h32103", "Multi-Section", [shared]),
    plan("aspire-lincoln-2852m32103", "Modular", [twin]),
  ]);
  const kitchens = g.get("kitchens")!;
  assert.equal(kitchens.length, 1);
  assert.equal(kitchens[0].planSlug, "aspire-lincoln-2852h32103");
  assert.equal(kitchens[0].kind, "multi");
});

test("a room interleaves homes instead of stacking one home's photos", () => {
  const g = buildGallery([
    plan("aspire-a-1", "Single Wide", [`${B}/a/a-kitchen.webp`, `${B}/a/a-kitchen2.webp`, `${B}/a/a-kitchen3.webp`]),
    plan("aspire-b-2", "Single Wide", [`${B}/b/b-kitchen.webp`, `${B}/b/b-kitchen2.webp`]),
  ]);
  assert.deepEqual(
    g.get("kitchens")!.map((p) => p.planSlug),
    ["aspire-a-1", "aspire-b-2", "aspire-a-1", "aspire-b-2", "aspire-a-1"],
  );
});

test("alt text names the room, the home and its type", () => {
  const g = buildGallery([plan("aspire-summit-2868h52a1c", "Multi-Section", [`${B}/x/summit-primary-bath.webp`])]);
  assert.equal(g.get("bathrooms")![0].alt, "Primary bathroom in the Champion Aspire summit double wide home");
});

test("every room page is in the page registry, so it reaches the sitemap", () => {
  const urls = new Set(getAllPages().map((p) => p.url));
  assert.ok(urls.has("/photos"), "/photos missing from src/lib/pages.ts");
  for (const r of GALLERY_ROOMS) assert.ok(urls.has(`/photos/${r.slug}`), `/photos/${r.slug} missing from src/lib/pages.ts`);
});

test("room slugs are unique and every label maps to one room", () => {
  const slugs = GALLERY_ROOMS.map((r) => r.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  const labels = GALLERY_ROOMS.flatMap((r) => r.labels);
  assert.equal(new Set(labels).size, labels.length);
});
