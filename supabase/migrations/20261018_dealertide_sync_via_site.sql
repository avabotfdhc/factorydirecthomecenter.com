-- DealerTide inventory sync, started from SQL but run on the website (2026-10-18).
--
-- The `dealertide-sync` edge function reads its feed token from Supabase's
-- secrets store, and that secret was never set: Kyle keeps every key on Vercel,
-- and nothing in this repo or the agent session can read Vercel env vars to
-- move it. POST /api/dealertide/sync on the site does the same staging work
-- reading the token from Vercel (DEALERTIDE_INVENTORY_TOKEN, or the token
-- inside DEALERTIDE_FEED_URL). It is gated the same way as the edge function:
-- the x-sync-key header must match the vault secret `dealertide_sync_key`.
--
--   select public.dealertide_sync_start_site();   -- returns a pg_net request id
--   select status_code, content from net._http_response order by id desc limit 1;

create or replace function public.dealertide_sync_start_site()
returns bigint
language sql
security definer
set search_path = ''
as $$
  select net.http_post(
    url := 'https://factorydirecthomescenter.com/api/dealertide/sync',
    headers := jsonb_build_object(
      'content-type', 'application/json',
      'x-sync-key', (select decrypted_secret from vault.decrypted_secrets where name = 'dealertide_sync_key')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 150000
  );
$$;
revoke all on function public.dealertide_sync_start_site() from public, anon, authenticated;
