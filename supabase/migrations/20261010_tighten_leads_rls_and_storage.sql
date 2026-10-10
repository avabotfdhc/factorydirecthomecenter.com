-- Supabase advisor: three "RLS Policy Always True" / "Public Bucket Allows
-- Listing" findings. All the same shape — a policy written as `true` granting
-- far more than the site uses.
--
-- STATUS WHEN COMMITTED: the two CREATE statements below are APPLIED to the
-- wired project (mvetqzhjszlullttfkwa). The four DROP statements are NOT:
-- the Supabase MCP gates destructive statements behind a confirmation that
-- cannot be answered from an agent session, so every DROP POLICY timed out at
-- 60s while CREATE POLICY succeeded. Verified it is not a lock: pg_stat_activity
-- showed no long-running or idle-in-transaction backends.
--
-- The ordering is deliberate and the intermediate state is safe: PostgreSQL ORs
-- permissive policies, so with both the new admin policies and the old `true`
-- ones present, behaviour is exactly as before. Nothing is broken while the
-- drops are outstanding; the tightening simply has not taken effect yet.
--
-- Evidence gathered before writing any of this:
--   * The ONLY path that inserts a lead is src/lib/leads-store.ts, called from
--     a server action and an API route — neither is a client component. It
--     prefers SUPABASE_SERVICE_ROLE_KEY, confirmed set in production by
--     GET /api/health ("supabaseServiceRole": true). The service role bypasses
--     RLS, so the anon INSERT policy is not used by the website at all.
--   * Nothing in the codebase lists the storage bucket. Catalogue images are
--     fetched via /storage/v1/object/public/..., which for a public bucket does
--     not consult the SELECT policy on storage.objects. Removing it stops
--     enumeration without affecting a single image.
--   * /admin reads leads with the service role (src/lib/admin-data.ts), so no
--     application path depends on the `authenticated` policies.

-- ── APPLIED ────────────────────────────────────────────────────────────────
-- The staff policies trusted the `authenticated` role itself, so ANY signed-in
-- user could read and modify every lead. src/lib/admin-auth.ts already refuses
-- to sign anyone in unless app_metadata.role = 'admin'; the database should
-- check that claim rather than take the role's word for it.
create policy "Admins may view leads" on public.leads
    for select to authenticated
    using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "Admins may update leads" on public.leads
    for update to authenticated
    using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
    with check (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

-- ── STILL TO RUN (paste into the Supabase SQL editor) ──────────────────────
-- anon INSERT with WITH CHECK (true) is a public write API into a table of
-- customer PII: any row, any status, any length. Being PostgREST rather than
-- the website form, it also bypasses the honeypot, the 2.5s fill timer and
-- Turnstile that /api/leads relies on for spam control.
--
-- One consequence to know before running it: leads-store.ts falls back to the
-- anon key when SUPABASE_SERVICE_ROLE_KEY is absent. Production has the service
-- role, so this is a no-op there — but an environment without it would have
-- its lead inserts refused by RLS rather than silently accepted.
drop policy if exists "Allow anonymous lead inserts" on public.leads;

-- Superseded by the two admin policies above.
drop policy if exists "Allow authenticated staff to view leads" on public.leads;
drop policy if exists "Allow authenticated staff to update leads" on public.leads;

-- A broad SELECT on storage.objects lets any client enumerate every file in the
-- bucket, including assets uploaded but not yet linked from a page.
drop policy if exists "floor-plans public read" on storage.objects;

comment on table public.leads is
    'Customer enquiries. Writes come only from the server with the service role '
    '(src/lib/leads-store.ts) — there is deliberately no anon INSERT policy, so a '
    'direct PostgREST POST cannot bypass the honeypot, fill timer and Turnstile. '
    'Reads and updates require app_metadata.role = ''admin''.';
