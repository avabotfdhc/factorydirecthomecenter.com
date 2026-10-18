-- dealertide_sync_start_site(payload): the same call as dealertide_sync_start_site()
-- with a JSON body, so the sync route's probe mode can be reached from SQL:
--
--   select public.dealertide_sync_start_site('{"detail_id":"MH-20260504-2EBC41"}'::jsonb);
--
-- answers (in net._http_response) with the field NAMES of that home's detail
-- record and which of them hold a Champion model code — never a value, never
-- the token. An empty payload runs the ordinary inventory sync. Applied to the
-- wired project on 2026-10-18.
create or replace function public.dealertide_sync_start_site(payload jsonb)
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
    body := coalesce(payload, '{}'::jsonb),
    timeout_milliseconds := 150000
  );
$$;

revoke all on function public.dealertide_sync_start_site(jsonb) from public, anon, authenticated;
