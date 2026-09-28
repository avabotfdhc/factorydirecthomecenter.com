-- Attach the photos the repo pages show to the CMS records for the same home.
--
-- Fourteen homes had two pages: a repo-published "dutch-aspire-*" page carrying
-- the full Champion photo set, and the CMS "aspire-*" page that the sitemap,
-- the grid and Ava actually publish -- which carried only the banner and the
-- option drawing. /homes-on-sale linked the first, so the page a buyer reached
-- from the sale was the one Google cannot see.
--
-- catalog-index.ts now points every model at its CMS page. These rows make that
-- switch lossless: each plan ends with exactly the gallery its repo twin showed.
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
  ('aspire-woodward-2868h32047', '/images/floor-plans/aspire-modular-2860/primary-bedroom-1.jpg', 10),
  ('aspire-warren-2852h32172', 'legacy/warren-2856h32172.webp', 0),
  ('aspire-warren-2852h32172', 'legacy/warren-2860h32172.webp', 1),
  ('aspire-summit-2852h32a1c', 'legacy/summit-2864h42a1c.webp', 0),
  ('aspire-summit-2852h32a1c', 'legacy/summit-2868h52a1c.webp', 1),
  ('aspire-summit-2856h32a1c', 'legacy/summit-2864h42a1c.webp', 0),
  ('aspire-summit-2856h32a1c', 'legacy/summit-2868h52a1c.webp', 1),
  ('aspire-monroe-2844h32024', 'legacy/monroe-2840h32024.webp', 0),
  ('aspire-bayfield-2844h32169', 'legacy/bayfield-2852h32169.webp', 0),
  ('aspire-monroe-2848h32024', 'legacy/monroe-2840h32024.webp', 0),
  ('aspire-bayfield-2848h32169', 'legacy/bayfield-2852h32169.webp', 0),
  ('aspire-brighton-2848h32170', 'legacy/112apf-2852h32170-sales-page-1.webp', 0),
  ('aspire-pontiac-2856h32103', 'legacy/pontiac-2852h32103.webp', 0),
  ('aspire-easton-2860h32301', 'legacy/easton-2856h32301.webp', 0),
  ('aspire-odyssey-2868h32394', 'legacy/odyssey-2860h32394.webp', 0)
) as v(slug, path, n)
join public.floor_plans f on f.slug = v.slug
where not exists (
  select 1 from public.floor_plan_images i
  where i.floor_plan_id = f.id and i.path = v.path
);
