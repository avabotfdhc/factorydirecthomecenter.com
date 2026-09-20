// Site-wide search, shared by GET /api/search and the /search results page.
//
// This used to live entirely inside the route handler, which meant the only
// way to search the site was with JavaScript running. That mattered for more
// than tidiness: the WebSite schema in src/lib/seo.ts publishes a
// SearchAction whose target is /search?q={search_term_string}, and that URL
// answered 404 — no /search route existed at all. Google's sitelinks
// searchbox requires the target to resolve, so the markup was claiming a
// feature the site did not have. Extracting the logic here lets the results
// page render server-side on the very URL the schema advertises.

import { guides } from "@/lib/guides";
import { encodeImageUrl } from "@/lib/encode-url";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const STORAGE_BUCKET = "floor-plans";

export interface SearchResult {
  id: string;
  title: string;
  category: string;
  url: string;
  content: string;
  rank: number;
}

function storageUrl(path: string): string {
  return encodeImageUrl(`${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path.replace(/^\//, "")}`);
}

async function searchSupabase(q: string): Promise<SearchResult[] | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/search_entire_site`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ search_term: q }),
  });
  if (!res.ok) throw new Error(`search_entire_site HTTP ${res.status}`);
  const rows = (await res.json()) as SearchResult[];
  return rows.map((r) => ({
    ...r,
    url: r.url.startsWith("storage:") ? storageUrl(r.url.slice("storage:".length)) : r.url,
    content: String(r.content || "").slice(0, 240),
  }));
}

// Repo-published plans: used when Supabase is not configured, so search still
// works on the same catalogue the pages render.
async function searchLocalPlans(q: string): Promise<SearchResult[]> {
  const { localFloorPlans, PRIME_SERIES, PRIME_HOME_TYPE } = await import("@/lib/local-floor-plans");
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  return localFloorPlans
    .filter((p) => !p.hidden)
    .map((p) => {
      const hay = `${p.name} ${p.modelNumber} ${p.series || PRIME_SERIES} ${p.homeType || PRIME_HOME_TYPE} ${p.beds} bed ${p.baths} bath ${p.sqft}`.toLowerCase();
      const hits = terms.filter((t) => hay.includes(t)).length;
      return { p, hits };
    })
    .filter(({ hits }) => hits === terms.length)
    .slice(0, 25)
    .map(({ p, hits }) => ({
      id: p.slug,
      title: p.name,
      category: "Floor Plan",
      url: `/floor-plans/${p.slug}`,
      content: `${p.series || PRIME_SERIES} • ${p.homeType || PRIME_HOME_TYPE} • ${p.sqft} sq ft • ${p.beds} Bed, ${p.baths} Bath`,
      rank: hits,
    }));
}

function searchGuides(q: string): SearchResult[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  return guides
    .map((g) => {
      const hay = `${g.title} ${g.description}`.toLowerCase();
      const hits = terms.filter((t) => hay.includes(t)).length;
      return { g, hits };
    })
    .filter(({ hits }) => hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .map(({ g, hits }) => ({
      id: g.href,
      title: g.title,
      category: "Guide & Resource",
      url: g.href,
      content: g.description,
      rank: hits / terms.length,
    }));
}

export interface SiteSearchResponse {
  results: SearchResult[];
  /** "supabase+local" or "local" — which catalogue answered. */
  source: string;
}

/** Runs one query across the catalogue, the brochure library and the guides. */
export async function runSiteSearch(rawQuery: string): Promise<SiteSearchResponse> {
  const q = rawQuery.trim().slice(0, 100);
  if (q.length < 2) return { results: [], source: "none" };

  // Supabase holds the imported catalogue (Aspire today); the PRIME and
  // Paramount homes are repo-published, so the repo catalogue is always
  // searched too and the two are merged by URL.
  let remote: SearchResult[] = [];
  let source = "supabase+local";
  try {
    remote = (await searchSupabase(q)) || [];
    if (!SUPABASE_URL || !SUPABASE_KEY) source = "local";
  } catch (err) {
    console.error("[search] Supabase search failed, using repo catalogue only:", err);
    source = "local";
  }
  const seen = new Set(remote.map((r) => r.url));
  const local = (await searchLocalPlans(q)).filter((r) => !seen.has(r.url));
  const catalog = [...remote, ...local].sort((a, b) => b.rank - a.rank);

  return { results: [...catalog, ...searchGuides(q)].slice(0, 30), source };
}
