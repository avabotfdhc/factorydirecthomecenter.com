import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// DealerTide webhook receiver — registered in DealerTide → Settings → Webhooks
// for the Inventory events (Vehicle Created/Updated/Sold/Archived, Inventory
// Increase/Decrease). Endpoint: POST /api/webhooks/dealertide
//
// Security model: the payload is deliberately treated as UNTRUSTED and never
// stored or rendered — the only effect of any request is a cache revalidation
// of pages that re-fetch from the authenticated API. That makes a shared
// secret unnecessary: the worst an attacker can do is refresh our own cache.
export async function POST() {
  revalidatePath("/floor-plans");
  revalidatePath("/inventory");
  revalidatePath("/");
  return NextResponse.json({ ok: true, revalidated: true });
}

// DealerTide may probe the endpoint; respond so the URL validates.
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "dealertide-webhook" });
}
