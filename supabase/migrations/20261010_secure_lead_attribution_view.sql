-- Close a live PII exposure on public.lead_attribution_report.
--
-- Supabase's security advisor reported the view as SECURITY DEFINER. It was
-- that, and the consequence was worse than the advisory's wording suggests.
-- Measured against the live project (mvetqzhjszlullttfkwa) before this ran:
--
--   anon -> public.leads (direct)            ALLOWED, 0 rows   (RLS working)
--   anon -> lead_attribution_report (view)   ALLOWED, 52 rows  (RLS bypassed)
--   anon UPDATE through view                 PERMITTED
--   anon DELETE through view                 PERMITTED
--
-- The view selects full_name and contact_info, so every lead's name and
-- contact details were readable with the anon key — a public value that ships
-- in the page source. The view is single-table and therefore auto-updatable,
-- so the same default grant let anon modify or delete rows in `leads` through
-- it. `leads` has RLS enabled with an anon INSERT policy and no anon SELECT;
-- none of that applied through this view, because the view ran as its owner
-- (`postgres`), which bypasses RLS.
--
-- Two independent halves, because either alone leaves a hole.
-- 20260920_lead_attribution.sql now creates the view this way, so a fresh
-- apply of the migration set is safe on its own.

-- 1. Run the view as the querying role, so RLS on `leads` applies.
alter view public.lead_attribution_report set (security_invoker = on);

-- 2. anon has no legitimate use for a staff reporting view. Nothing in the
--    application reads it: /admin reads `leads` with the service role.
revoke all on public.lead_attribution_report from anon;

-- 3. Staff may read it; nothing should ever write through it.
revoke insert, update, delete, truncate, references, trigger
    on public.lead_attribution_report from authenticated;

-- 4. The same inert write grants on the public search-index view. That view is
--    not auto-updatable today, so these were unusable — but a later change
--    that simplified it would make them live without anyone noticing.
revoke insert, update, delete, truncate, references, trigger
    on public.site_search_index from anon, authenticated;

comment on view public.lead_attribution_report is
    'Leads with their acquisition channel resolved. Source: src/lib/attribution.ts. '
    'security_invoker=on: reads are subject to the caller''s RLS on public.leads. '
    'Do not grant anon any privilege on this view — it exposes lead PII.';

-- Verified after applying: options {security_invoker=on}; anon SELECT/UPDATE/
-- DELETE all false; anon read "permission denied for view"; service_role still
-- reads all 52 rows, so reporting is unaffected. The advisor's
-- security_definer_view finding cleared.
