-- Start the dealertide-media-import edge function from SQL (2026-10-18).
-- Step 2 of the DealerTide inventory sync: copy Champion's Scene7 photos for the
-- named catalogue plans into the floor-plans bucket as appended gallery rows.
-- See supabase/functions/dealertide-media-import/index.ts for the rules.
--
--   select public.dealertide_media_import('{"slugs":["aspire-verona-3276h42179"],"dry_run":true}'::jsonb);
--   select status_code, content from net._http_response order by id desc limit 1;

create or replace function public.dealertide_media_import(payload jsonb)
returns bigint
language sql
security definer
set search_path = ''
as $$
  select net.http_post(
    url := 'https://mvetqzhjszlullttfkwa.supabase.co/functions/v1/dealertide-media-import',
    headers := jsonb_build_object(
      'content-type', 'application/json',
      'x-sync-key', (select decrypted_secret from vault.decrypted_secrets where name = 'dealertide_sync_key')
    ),
    body := coalesce(payload, '{}'::jsonb),
    timeout_milliseconds := 150000
  );
$$;
revoke all on function public.dealertide_media_import(jsonb) from public, anon, authenticated;
