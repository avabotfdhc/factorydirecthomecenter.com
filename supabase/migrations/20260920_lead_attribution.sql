-- =====================================================
-- Factory Direct Homes Center — lead attribution columns
-- Migration 20260920.
--
-- Apply to the WIRED catalogue project (mvetqzhjszlullttfkwa,
-- "supabase-purple-queen") BEFORE deploying the code that writes these
-- columns: PostgREST rejects an insert naming an unknown column with a 400,
-- which would take every website lead down until the migration landed.
--
-- Why: until now `public.leads` recorded who enquired and nothing about how
-- they arrived. Every lead looked identical whether it came from a paid
-- Google Ads click, an organic blog post, a Facebook share or someone typing
-- the domain. There was no way to work out what advertising paid for itself.
--
-- The columns mirror src/lib/attribution.ts#attributionColumns exactly. All
-- are nullable: a visitor who opts out of tracking (or whose browser sends
-- Global Privacy Control) still gets their lead saved, just unattributed.
-- =====================================================

ALTER TABLE public.leads
    -- Last touch: the campaign that was active when they enquired.
    ADD COLUMN IF NOT EXISTS utm_source          TEXT,
    ADD COLUMN IF NOT EXISTS utm_medium          TEXT,
    ADD COLUMN IF NOT EXISTS utm_campaign        TEXT,
    ADD COLUMN IF NOT EXISTS utm_term            TEXT,
    ADD COLUMN IF NOT EXISTS utm_content         TEXT,
    -- The ad platform's click identifier and which platform it belongs to
    -- (gclid / gbraid / wbraid / msclkid / fbclid / ttclid / li_fat_id).
    -- Keeping the raw id is what makes offline-conversion upload possible
    -- later: Google Ads and Meta both match a sale back to a click by this.
    ADD COLUMN IF NOT EXISTS click_id            TEXT,
    ADD COLUMN IF NOT EXISTS click_id_type       TEXT,
    -- The page the visit started on, and the external site that sent them.
    ADD COLUMN IF NOT EXISTS landing_page        TEXT,
    ADD COLUMN IF NOT EXISTS referrer            TEXT,
    -- First touch: what originally earned the relationship. Home buying runs
    -- weeks to months, so crediting only the last click would hand every sale
    -- to a branded search and hide the content that actually found the buyer.
    ADD COLUMN IF NOT EXISTS first_touch_source   TEXT,
    ADD COLUMN IF NOT EXISTS first_touch_medium   TEXT,
    ADD COLUMN IF NOT EXISTS first_touch_campaign TEXT,
    ADD COLUMN IF NOT EXISTS first_touch_at       TIMESTAMPTZ,
    -- How many campaign/referral touches preceded the enquiry.
    ADD COLUMN IF NOT EXISTS touch_count          INTEGER;

-- Reporting indexes. `utm_campaign` answers "what did this campaign produce",
-- `first_touch_source` answers "what channel finds our buyers".
CREATE INDEX IF NOT EXISTS idx_leads_utm_campaign ON public.leads (utm_campaign)
    WHERE utm_campaign IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON public.leads (utm_source)
    WHERE utm_source IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_first_touch_source ON public.leads (first_touch_source)
    WHERE first_touch_source IS NOT NULL;

COMMENT ON COLUMN public.leads.click_id IS
    'Ad-platform click identifier, kept so a closed sale can be uploaded back to Google Ads / Meta as an offline conversion.';
COMMENT ON COLUMN public.leads.first_touch_source IS
    'The channel that first brought this browser to the site, never overwritten by later visits.';

-- =====================================================
-- Reporting view: one row per lead with the channel resolved, so Kyle can
-- answer "which channel produced leads last month" without writing SQL every
-- time. Read it in the Supabase SQL editor or wire it into a dashboard.
--
-- `security_invoker = true` is NOT optional, and it was missing in the first
-- version of this file. Without it a view runs with its owner's rights, and
-- the owner here is `postgres`, which bypasses RLS. Combined with Supabase's
-- default grants on the public schema — which hand `anon` every privilege on
-- a newly created view in `public` — that made this view a hole straight
-- through the RLS on `leads`: measured on the live project 2026-10-10, `anon`
-- read 0 rows from `public.leads` directly and all 52 through this view,
-- names and contact details included, with the anon key that ships in every
-- page. The view is single-table and so auto-updatable, so UPDATE and DELETE
-- went through too.
--
-- The grants below are the second half of the fix and are equally required:
-- security_invoker makes the caller's RLS apply, the revoke means `anon` has
-- no privilege to apply it to. tests/attribution.test.ts fails if either half
-- goes missing from this file.
-- =====================================================
CREATE OR REPLACE VIEW public.lead_attribution_report
    WITH (security_invoker = true) AS
SELECT
    l.id,
    l.created_at,
    l.full_name,
    l.contact_info,
    l.model_interest,
    l.target_county,
    l.timeline,
    l.status,
    COALESCE(l.first_touch_source, 'unknown')  AS first_touch_source,
    COALESCE(l.first_touch_medium, 'unknown')  AS first_touch_medium,
    COALESCE(l.utm_source, 'unknown')          AS last_touch_source,
    COALESCE(l.utm_medium, 'unknown')          AS last_touch_medium,
    l.utm_campaign,
    l.click_id_type,
    l.landing_page,
    l.referrer,
    l.touch_count,
    -- A coarse bucket for weekly reporting. `ai` is broken out on purpose:
    -- referrals from ChatGPT, Perplexity, Copilot, Gemini and Claude are the
    -- only direct evidence anyone gets that answer-engine optimisation works,
    -- and they vanish if they are lumped in with plain referral traffic.
    CASE
        WHEN l.utm_medium IN ('cpc', 'ppc', 'paid', 'paidsearch', 'paid_search') THEN 'paid search'
        WHEN l.utm_medium IN ('paid_social', 'paidsocial')                       THEN 'paid social'
        WHEN l.utm_medium = 'ai'                                                 THEN 'answer engine'
        WHEN l.utm_medium = 'organic'                                            THEN 'organic search'
        WHEN l.utm_medium = 'social'                                             THEN 'social'
        WHEN l.utm_medium = 'email'                                              THEN 'email'
        WHEN l.utm_medium = 'referral'                                           THEN 'referral'
        WHEN l.utm_source = 'direct' OR l.utm_source IS NULL                     THEN 'direct / unknown'
        ELSE 'other'
    END AS channel
FROM public.leads l;

-- `anon` must never hold a privilege on a view that selects lead PII. Nothing
-- in the application reads this view: /admin reads `leads` with the service
-- role. Staff may read it; nothing writes through it.
REVOKE ALL ON public.lead_attribution_report FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
    ON public.lead_attribution_report FROM authenticated;

COMMENT ON VIEW public.lead_attribution_report IS
    'Leads with their acquisition channel resolved. Source: src/lib/attribution.ts. '
    'security_invoker=on: reads are subject to the caller''s RLS on public.leads. '
    'Do not grant anon any privilege on this view — it exposes lead PII.';
