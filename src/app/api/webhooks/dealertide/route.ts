import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { safeEqual } from "@/lib/request-guard";

// DealerTide webhook receiver — registered in DealerTide → Settings → Webhooks
// for the Inventory events (Vehicle Created/Updated/Sold/Archived, Inventory
// Increase/Decrease). Endpoint: POST /api/webhooks/dealertide
//
// Security model: the payload is deliberately treated as UNTRUSTED and never
// stored or rendered — the only effect of any request is a cache revalidation
// of pages that re-fetch from the authenticated API.
//
// Two guards (security fixes, 2026-11-26):
//  • Optional shared secret. When DEALERTIDE_WEBHOOK_SECRET is set on Vercel,
//    the request must carry it as `?key=` or an `x-webhook-secret` header
//    (append `?key=<secret>` to the webhook URL in DealerTide). Unset, the
//    endpoint keeps working as before so DealerTide is never cut off by a
//    deploy.
//  • Purges are coalesced to at most one per 60 s per instance, so a flood of
//    anonymous POSTs can no longer keep the homepage and catalogue cold.
const PURGE_INTERVAL_MS = 60_000;
let lastPurgeAt = 0;

export async function POST(request: Request) {
  const secret = process.env.DEALERTIDE_WEBHOOK_SECRET;
  if (secret) {
    const given =
      new URL(request.url).searchParams.get("key") || request.headers.get("x-webhook-secret");
    if (!safeEqual(given, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const now = Date.now();
  if (now - lastPurgeAt < PURGE_INTERVAL_MS) {
    return NextResponse.json({ ok: true, revalidated: false, coalesced: true });
  }
  lastPurgeAt = now;
  revalidatePath("/floor-plans");
  revalidatePath("/design-your-home");
  revalidatePath("/");
  return NextResponse.json({ ok: true, revalidated: true });
}

// DealerTide may probe the endpoint; respond so the URL validates.
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "dealertide-webhook" });
}
