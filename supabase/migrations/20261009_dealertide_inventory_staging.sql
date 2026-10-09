-- DealerTide inventory staging (2026-10-09).
--
-- DealerTide's public inventory feed (241 homes, linked to Champion catalog
-- models) is copied here by the `dealertide-sync` edge function so it can be
-- compared with the catalogue before anything reaches the website. Nothing the
-- site reads is touched: floor_plans / floor_plan_images / floor_plan_documents
-- stay as they are, and these tables are private (RLS on, no policies, no
-- grants to anon/authenticated). See docs/dealertide-inventory-sync.md.

create extension if not exists pg_net with schema extensions;

-- One row per DealerTide home, keyed on DealerTide's own "id".
create table if not exists public.dealertide_inventory (
  id                text primary key,
  model_code        text,            -- Champion model, e.g. 2852H32169 / 1456H22P01, upper-case
  title             text,
  status            text,
  image_urls        text[] not null default '{}',   -- first one is the lead photo
  floor_plan_images text[] not null default '{}',
  feed_updated_at   timestamptz,
  raw               jsonb not null,
  first_seen_at     timestamptz not null default now(),
  last_seen_at      timestamptz not null default now(),
  media_changed_at  timestamptz,     -- photo or floor-plan list differed from the previous sync
  removed_at        timestamptz      -- gone from the feed and its detail call answered 410
);
create index if not exists dealertide_inventory_model_code_idx on public.dealertide_inventory (model_code);

create table if not exists public.dealertide_sync_runs (
  id            bigserial primary key,
  started_at    timestamptz not null default now(),
  finished_at   timestamptz,
  ok            boolean,
  pages         integer,
  homes         integer,
  added         integer,
  media_changed integer,
  removed       integer,
  note          text
);

alter table public.dealertide_inventory enable row level security;
alter table public.dealertide_sync_runs enable row level security;
revoke all on public.dealertide_inventory, public.dealertide_sync_runs from anon, authenticated;
revoke all on sequence public.dealertide_sync_runs_id_seq from anon, authenticated;

-- How each DealerTide home lines up with the catalogue. A model can appear on
-- several DealerTide homes (one per unit); they all point at the same plan, so
-- a model already in the catalogue is never added twice.
--   in_catalogue         same Champion model is a live plan (Aspire or Prime)
--   retired_series_only  only a Paramount plan has it (retired; /series/redman)
--   new_model            a model code the catalogue does not have
--   no_model_code        no Champion model code found on the home
create or replace view public.dealertide_catalogue_match
with (security_invoker = true) as
with plans as (
  select f.id, f.slug, f.series, f.name, upper(f.model_number) as model_code,
    (select count(*) from public.floor_plan_images i
      where i.floor_plan_id = f.id and i.kind in ('gallery', 'banner', 'rendering'))::int as our_photos,
    (select count(*) from public.floor_plan_images i
      where i.floor_plan_id = f.id and i.kind = 'floorplan')::int as our_drawings,
    (select count(*) from public.floor_plan_documents d
      where d.floor_plan_id = f.id)::int as our_sheets
  from public.floor_plans f
  where f.is_active
),
matched as (
  select d.*,
    coalesce(
      -- Champion model code; a live series beats retired Paramount.
      (select p.id from plans p where p.model_code = d.model_code
        order by (p.series = 'Paramount'), p.series limit 1),
      -- Prime plans named rather than coded (MONTE, HICKMAN, …): match the name.
      (select p.id from plans p
        where d.model_code is null and p.series = 'Prime'
          and d.title ~* ('\m' || regexp_replace(p.name, '\W+', '\\W+', 'g') || '\M')
        order by length(p.name) desc limit 1)
    ) as plan_id
  from public.dealertide_inventory d
  where d.removed_at is null
)
select
  m.id as dealertide_id,
  m.title,
  m.status,
  m.model_code,
  case
    when p.id is null and m.model_code is null then 'no_model_code'
    when p.id is null then 'new_model'
    when p.series = 'Paramount' then 'retired_series_only'
    else 'in_catalogue'
  end as match,
  p.slug as plan_slug,
  p.series as plan_series,
  cardinality(m.image_urls) as their_photos,
  cardinality(m.floor_plan_images) as their_floor_plans,
  p.our_photos,
  p.our_drawings,
  p.our_sheets,
  m.media_changed_at,
  m.feed_updated_at
from matched m
left join plans p on p.id = m.plan_id;

revoke all on public.dealertide_catalogue_match from anon, authenticated;

-- The key that lets SQL start a sync. Generated here and kept in the vault, so
-- no one types it; the edge function asks dealertide_sync_key_ok() whether the
-- x-sync-key it received matches.
do $$
begin
  if not exists (select 1 from vault.secrets where name = 'dealertide_sync_key') then
    perform vault.create_secret(encode(extensions.gen_random_bytes(32), 'hex'), 'dealertide_sync_key',
      'x-sync-key for the dealertide-sync edge function');
  end if;
end $$;

create or replace function public.dealertide_sync_key_ok(k text)
returns boolean
language sql
security definer
set search_path = ''
as $$
  select coalesce(k, '') <> '' and exists (
    select 1 from vault.decrypted_secrets where name = 'dealertide_sync_key' and decrypted_secret = k
  );
$$;
revoke all on function public.dealertide_sync_key_ok(text) from public, anon, authenticated;
grant execute on function public.dealertide_sync_key_ok(text) to service_role;

-- Starts a sync from SQL (this sandbox and the dashboard SQL editor can both
-- call it). Returns the pg_net request id; the edge function's JSON summary
-- lands in net._http_response.
create or replace function public.dealertide_sync_start()
returns bigint
language sql
security definer
set search_path = ''
as $$
  select net.http_post(
    url := 'https://mvetqzhjszlullttfkwa.supabase.co/functions/v1/dealertide-sync',
    headers := jsonb_build_object(
      'content-type', 'application/json',
      'x-sync-key', (select decrypted_secret from vault.decrypted_secrets where name = 'dealertide_sync_key')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 150000
  );
$$;
revoke all on function public.dealertide_sync_start() from public, anon, authenticated;
