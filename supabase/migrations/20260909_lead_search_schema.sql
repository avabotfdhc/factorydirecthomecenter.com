-- =====================================================
-- Factory Direct Homes Center — leads table + site search
-- Migration 20260909: applied to the "FDHC Site" Supabase project.
--
-- Written against the LIVE schema (floor_plans, floor_plan_images,
-- literature), not the aspirational 001 file: there is no `articles` table,
-- so guides are merged into search results by the API route from the repo's
-- own guide catalogue (src/lib/guides.ts).
-- =====================================================

-- 1. Leads captured by the instant-quote modal and the mobile action bar.
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    target_county TEXT NOT NULL,
    timeline TEXT NOT NULL,
    model_interest TEXT NOT NULL,
    series_interest TEXT DEFAULT 'Champion',
    source_page TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'archived'))
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Customers submit with the publishable (anon) key; only inserts are allowed.
DROP POLICY IF EXISTS "Allow anonymous lead inserts" ON public.leads;
CREATE POLICY "Allow anonymous lead inserts" ON public.leads
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Signed-in staff read and update. (The /admin pages use the service-role
-- key server-side, which bypasses RLS; these cover the Supabase dashboard
-- and any future authenticated staff UI.)
DROP POLICY IF EXISTS "Allow authenticated staff to view leads" ON public.leads;
CREATE POLICY "Allow authenticated staff to view leads" ON public.leads
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated staff to update leads" ON public.leads;
CREATE POLICY "Allow authenticated staff to update leads" ON public.leads
    FOR UPDATE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_model ON public.leads (model_interest);

-- 2. Full-text search index across the catalogue and the literature library.
--    `url` for literature is "storage:<path>"; the API route turns that into
--    the public storage URL (the bucket host is an env var, not DB data).
CREATE OR REPLACE VIEW public.site_search_index AS
SELECT
    fp.id::text AS id,
    coalesce(nullif(fp.name, ''), fp.title) AS title,
    'Floor Plan' AS category,
    '/floor-plans/' || fp.slug AS url,
    concat_ws(' • ',
        nullif(fp.series, ''),
        nullif(fp.home_type, ''),
        CASE WHEN fp.sqft IS NOT NULL THEN fp.sqft || ' sq ft' END,
        CASE WHEN fp.beds IS NOT NULL THEN fp.beds || ' Bed' END,
        CASE WHEN fp.baths IS NOT NULL THEN fp.baths || ' Bath' END
    ) || '. ' || coalesce(fp.description, '') AS content,
    to_tsvector('english',
        coalesce(fp.name, '') || ' ' || coalesce(fp.title, '') || ' ' ||
        coalesce(fp.series, '') || ' ' || coalesce(fp.home_type, '') || ' ' ||
        coalesce(fp.model_number, '') || ' ' || coalesce(fp.description, '') || ' ' ||
        coalesce(regexp_replace(fp.floor_plan_html, '<[^>]+>', ' ', 'g'), '')
    ) AS search_vector
FROM public.floor_plans fp
WHERE fp.is_active = true

UNION ALL

SELECT
    l.id::text AS id,
    l.title,
    'Brochure' AS category,
    'storage:' || l.path AS url,
    concat_ws(' • ', nullif(l.series, ''), nullif(l.home_type, ''), nullif(l.category, '')) AS content,
    to_tsvector('english',
        coalesce(l.title, '') || ' ' || coalesce(l.series, '') || ' ' ||
        coalesce(l.home_type, '') || ' ' || coalesce(l.category, '') || ' ' ||
        coalesce(l.box_filename, '')
    ) AS search_vector
FROM public.literature l
WHERE l.is_active = true AND coalesce(l.path, '') <> '';

GRANT SELECT ON public.site_search_index TO anon, authenticated;

-- 3. Ranked search. Runs as the caller (SECURITY INVOKER), so the anon key
--    only ever sees rows its RLS policies already allow.
CREATE OR REPLACE FUNCTION public.search_entire_site(search_term text)
RETURNS TABLE (
    id text,
    title text,
    category text,
    url text,
    content text,
    rank real
)
LANGUAGE sql STABLE AS $$
    SELECT
        id,
        title,
        category,
        url,
        content,
        ts_rank(search_vector, websearch_to_tsquery('english', search_term)) AS rank
    FROM public.site_search_index
    WHERE search_vector @@ websearch_to_tsquery('english', search_term)
       OR title ILIKE '%' || search_term || '%'
    ORDER BY rank DESC, title ASC
    LIMIT 25;
$$;

GRANT EXECUTE ON FUNCTION public.search_entire_site(text) TO anon, authenticated;
