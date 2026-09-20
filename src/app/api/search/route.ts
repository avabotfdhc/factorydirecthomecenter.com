import { NextResponse } from "next/server";
import { runSiteSearch } from "@/lib/site-search";

// GET /api/search?q=... — site-wide search.
//
// A thin wrapper now: the implementation lives in src/lib/site-search.ts so
// that the /search results page can run the same query server-side rather
// than duplicating it (or being unable to render without JavaScript).

export const dynamic = "force-dynamic";

export type { SearchResult } from "@/lib/site-search";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") || "";
  const { results, source } = await runSiteSearch(q);
  if (!results.length && q.trim().length < 2) return NextResponse.json({ results: [] });
  return NextResponse.json({ results, source }, { headers: { "Cache-Control": "no-store" } });
}
