import { NextResponse } from "next/server";
import { getFeaturedHomes } from "@/lib/api-content";

// Same selection the server-rendered homepage uses (see lib/api-content.ts).
// The homepage no longer fetches this route, but it stays for any external
// consumers. Selection details (photo + plausible price, "$1" data-entry bug
// filtering) live in getFeaturedHomes.
export async function GET() {
  let pick;
  try {
    pick = await getFeaturedHomes();
  } catch {
    // CMS API failure (already logged in api-content). Empty + no-store so
    // the CDN never caches the outage.
    return NextResponse.json(
      { homes: [] },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.json(
    { homes: pick },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
