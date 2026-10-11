-- Supabase advisor: three "RLS Policy Always True" findings on public.leads and
-- one "Public Bucket Allows Listing" on storage.floor-plans. All the same
-- shape — a policy written as `true` granting far more than the site uses.
--
-- APPLIED IN FULL to the wired project (mvetqzhjszlullttfkwa) on 2026-10-11.
-- All four advisor findings cleared; the only security advisories left are
-- rls_enabled_no_policy (INFO, and deny-all is the safe state) and the
-- leaked-password dashboard toggle.
--
-- NOTE ON FORM: this narrows the offending policies with ALTER POLICY instead
-- of dropping and recreating them. DROP POLICY could not be executed through
-- the agent's Supabase tooling — it timed out at 60s every time, bare and
-- wrapped in a DO block, while CREATE and ALTER ran in milliseconds. It was
-- not lock contention: ACCESS EXCLUSIVE on public.leads was acquired in 6ms
-- and pg_stat_activity showed no long-running or idle-in-transaction backends.
-- The cause was never identified. ALTER reaches the same end state, is
-- reversible in place, and leaves the policy visible in the dashboard.
--
-- Consequence worth knowing: `leads` now carries two SELECT policies and two
-- UPDATE policies with identical admin expressions — the new "Admins may…"
-- pair and the narrowed "Allow authenticated staff…" pair. Redundant but
-- harmless (permissive policies are ORed, and both say the same thing).
-- Collapse them to one pair whenever DROP POLICY is available again.
--
-- Evidence gathered before any of this was written:
--   * The ONLY path that inserts a lead is src/lib/leads-store.ts, called from
--     a server action and an API route — neither is a client component. It
--     prefers SUPABASE_SERVICE_ROLE_KEY, confirmed set in production by
--     GET /api/health ("supabaseServiceRole": true). The service role bypasses
--     RLS, so the anon INSERT policy was never used by the website.
--   * Nothing in the codebase lists the storage bucket. storage.buckets says
--     floor-plans is public = true, and catalogue images are fetched through
--     /storage/v1/object/public/… (next.config.ts rewrites /fp/<key> to that
--     same prefix), which for a public bucket does not consult the SELECT
--     policy on storage.objects. Verified after applying: GET of a real key
--     through the live site returned 200 image/webp, 23,322 bytes.
--   * /admin reads leads with the service role (src/lib/admin-data.ts), so no
--     application path depended on the `authenticated` policies.

-- 1. The admin-scoped replacements. src/lib/admin-auth.ts already refuses to
--    sign anyone in unless app_metadata.role = 'admin'; the database now
--    checks the same claim rather than trusting the `authenticated` role,
--    which previously let ANY signed-in user read and modify every lead.
create policy "Admins may view leads" on public.leads
    for select to authenticated
    using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "Admins may update leads" on public.leads
    for update to authenticated
    using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
    with check (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

-- 2. anon INSERT with WITH CHECK (true) was a public write API into a table of
--    customer PII: any row, any status, any payload. Being PostgREST rather
--    than the website form, it also bypassed the honeypot, the 2.5s fill timer
--    and Turnstile that /api/leads relies on for spam control. Denied outright.
--
--    One consequence: leads-store.ts falls back to the anon key when
--    SUPABASE_SERVICE_ROLE_KEY is absent. Production has the service role, so
--    this is a no-op there — but an environment without it would have its lead
--    inserts refused by RLS rather than silently accepted.
alter policy "Allow anonymous lead inserts" on public.leads with check (false);

-- 3. The old staff policies, narrowed to the same admin claim.
alter policy "Allow authenticated staff to view leads" on public.leads
    using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

alter policy "Allow authenticated staff to update leads" on public.leads
    using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
    with check (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

-- 4. A broad SELECT on storage.objects let any client enumerate every file in
--    the bucket, including assets uploaded but not yet linked from a page.
--    Public object URLs do not use this policy, so denying it costs nothing.
alter policy "floor-plans public read" on storage.objects using (false);

comment on table public.leads is
    'Customer enquiries. Writes come only from the server with the service role '
    '(src/lib/leads-store.ts) — anon INSERT is denied, so a direct PostgREST POST '
    'cannot bypass the honeypot, fill timer and Turnstile. Reads and updates '
    'require app_metadata.role = ''admin''.';
