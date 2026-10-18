-- A plan's video tour (2026-10-18). DealerTide's detail record names a
-- YouTube video for nine homes; the URL is kept here so the plan page can
-- embed it and the page graph can publish a VideoObject. The VideoObject is
-- emitted only when video_published_on is set (Google requires uploadDate),
-- so a video with no known date is embedded but not marked up.
alter table public.floor_plans add column if not exists video_url text not null default '';
alter table public.floor_plans add column if not exists video_published_on date;
