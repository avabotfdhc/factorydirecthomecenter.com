import { NextResponse } from "next/server";
import { guides } from "@/lib/guides";

// GET /api/search?q=... — site-wide search.
//
// Floor plans and brochures come from Supabase's search_entire_site()
// (full-text, ranked; see supabase/migrations/20260909_lead_search_schema.sql).
// Guides live in the repo, so they are matched here and merged in. When the
// Supabase env vars are not set, the repo-published catalogue is searched
// instead, so the endpoint always answers.

export const dynamic = "force-dynamic";

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
  return encodeURI(`${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path.replace(/^\//, "")}`);
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

export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") || "").trim().slice(0, 100);
  if (q.length < 2) return NextResponse.json({ results: [] });

  let catalog: SearchResult[] = [];
  let source = "supabase";
  try {
    const remote = await searchSupabase(q);
    if (remote) {
      catalog = remote;
    } else {
      source = "local";
      catalog = await searchLocalPlans(q);
    }
  } catch (err) {
    console.error("[search] Supabase search failed, using repo catalogue:", err);
    source = "local";
    catalog = await searchLocalPlans(q);
  }

  return NextResponse.json(
    { results: [...catalog, ...searchGuides(q)].slice(0, 30), source },
    { headers: { "Cache-Control": "no-store" } },
  );
}
