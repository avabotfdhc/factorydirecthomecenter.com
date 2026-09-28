-- Attach the photos the repo pages show to the CMS records for the same home.
--
-- Fourteen homes had two pages: a repo-published "dutch-aspire-*" page carrying
-- Champion's photo set, and the CMS "aspire-*" page that the sitemap, the grid
-- and Ava actually publish -- which carried only the banner and the option
-- drawing. /homes-on-sale linked the first, so the page a buyer reached from
-- the sale was the one Google cannot see.
--
-- catalog-index.ts now points every model at its CMS page. These rows carry the
-- photography across so that switch costs nothing.
--
-- ONLY the professional photo sets move (1800x1200, Champion's own shoots).
-- An earlier draft of this file also copied 14 rows of legacy S3 "banner"
-- art, and those were wrong to add to a canonical page:
--   * ~600x400 -- a ninth of the pixels of the real photos, blurry in a gallery
--   * shot of a DIFFERENT model number (the 2856 and 2860 Warren banners were
--     landing on the 2852 Warren's page)
--   * no room in the filename, so describeImageFile() returns "" and the alt
--     text falls back to the generic "<name> multi-section home by Champion
--     Homes" -- 13 of 48 additions, against the 95% specific-alt bar in
--     tests/image-alt.test.ts
--   * one was not a photograph at all: 112APF-2852H32170 SALES_Page_1 is a
--     sales sheet, and kind='gallery' put a document in the photo gallery
-- sitemap.ts feeds plan.gallery into <image:loc>, so every one of those would
-- have been submitted to Google Images. The 34 rows below are 100% room-
-- specific alt and nothing under 1800px.
--
-- Paths follow the two forms already in this table: "/images/..." for a file
-- served from the repo, and a bare storage key for an object in the
-- "floor-plans" bucket. Never an absolute URL -- imgUrl() builds that.
--
-- kind is 'gallery' for every row: 'banner' would compete with the
-- floor_plans.banner_image column, and 'floorplan' would change which image
-- drawingFrom() picks as the plan drawing. Appended after the existing rows so
-- the existing "-opt2" drawing still wins that pick.
--
-- Idempotent: re-running inserts nothing.

insert into public.floor_plan_images (floor_plan_id, path, kind, sort_order)
select f.id, v.path, 'gallery',
       coalesce((select max(i2.sort_order) from public.floor_plan_images i2
                 where i2.floor_plan_id = f.id), 0) + 1 + v.n
from (values
  ('aspire-1672h32087', '/images/floor-plans/aspire-1672/exterior-1.jpg', 0),
  ('aspire-1672h32087', '/images/floor-plans/aspire-1672/exterior-2.jpg', 1),
  ('aspire-1672h32087', '/images/floor-plans/aspire-1672/exterior-3.jpg', 2),
  ('aspire-1672h32087', '/images/floor-plans/aspire-1672/bath.jpg', 3),
  ('aspire-1672h32087', '/images/floor-plans/aspire-1672/dining-kitchen.jpg', 4),
  ('aspire-1672h32087', '/images/floor-plans/aspire-1672/kitchen-1.jpg', 5),
  ('aspire-1672h32087', '/images/floor-plans/aspire-1672/kitchen-2.jpg', 6),
  ('aspire-1672h32087', '/images/floor-plans/aspire-1672/living-room-1.jpg', 7),
  ('aspire-1672h32087', '/images/floor-plans/aspire-1672/living-room-2.jpg', 8),
  ('aspire-1672h32087', '/images/floor-plans/aspire-1672/primary-bath-1.jpg', 9),
  ('aspire-1672h32087', '/images/floor-plans/aspire-1672/primary-bedroom-1.jpg', 10),
  ('aspire-1672h32087', '/images/floor-plans/aspire-1672/primary-bedroom-2.jpg', 11),
  ('aspire-woodward-2860h32047', '/images/floor-plans/aspire-modular-2860/exterior-1.jpg', 0),
  ('aspire-woodward-2860h32047', '/images/floor-plans/aspire-modular-2860/exterior-2.jpg', 1),
  ('aspire-woodward-2860h32047', '/images/floor-plans/aspire-modular-2860/exterior-3.jpg', 2),
  ('aspire-woodward-2860h32047', '/images/floor-plans/aspire-modular-2860/dining-area.jpg', 3),
  ('aspire-woodward-2860h32047', '/images/floor-plans/aspire-modular-2860/entry.jpg', 4),
  ('aspire-woodward-2860h32047', '/images/floor-plans/aspire-modular-2860/kitchen-1.jpg', 5),
  ('aspire-woodward-2860h32047', '/images/floor-plans/aspire-modular-2860/kitchen-2.jpg', 6),
  ('aspire-woodward-2860h32047', '/images/floor-plans/aspire-modular-2860/living-room-1.jpg', 7),
  ('aspire-woodward-2860h32047', '/images/floor-plans/aspire-modular-2860/living-room-2.jpg', 8),
  ('aspire-woodward-2860h32047', '/images/floor-plans/aspire-modular-2860/primary-bath-1.jpg', 9),
  ('aspire-woodward-2860h32047', '/images/floor-plans/aspire-modular-2860/primary-bedroom-1.jpg', 10),
  ('aspire-woodward-2868h32047', '/images/floor-plans/aspire-modular-2860/exterior-1.jpg', 0),
  ('aspire-woodward-2868h32047', '/images/floor-plans/aspire-modular-2860/exterior-2.jpg', 1),
  ('aspire-woodward-2868h32047', '/images/floor-plans/aspire-modular-2860/exterior-3.jpg', 2),
  ('aspire-woodward-2868h32047', '/images/floor-plans/aspire-modular-2860/dining-area.jpg', 3),
  ('aspire-woodward-2868h32047', '/images/floor-plans/aspire-modular-2860/entry.jpg', 4),
  ('aspire-woodward-2868h32047', '/images/floor-plans/aspire-modular-2860/kitchen-1.jpg', 5),
  ('aspire-woodward-2868h32047', '/images/floor-plans/aspire-modular-2860/kitchen-2.jpg', 6),
  ('aspire-woodward-2868h32047', '/images/floor-plans/aspire-modular-2860/living-room-1.jpg', 7),
  ('aspire-woodward-2868h32047', '/images/floor-plans/aspire-modular-2860/living-room-2.jpg', 8),
  ('aspire-woodward-2868h32047', '/images/floor-plans/aspire-modular-2860/primary-bath-1.jpg', 9),
  ('aspire-woodward-2868h32047', '/images/floor-plans/aspire-modular-2860/primary-bedroom-1.jpg', 10)
) as v(slug, path, n)
join public.floor_plans f on f.slug = v.slug
where not exists (
  select 1 from public.floor_plan_images i
  where i.floor_plan_id = f.id and i.path = v.path
);
