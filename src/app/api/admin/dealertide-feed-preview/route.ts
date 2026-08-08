import { NextResponse } from "next/server";
import { getAdminToken, cmsGet } from "@/lib/admin-auth";
import { feedConfigured, getFeedRecordsRaw, mapToFloorPlan } from "@/lib/dealertide-feed";

export const dynamic = "force-dynamic";

// Admin-only inspection of the DealerTide Meta catalog feed, used to confirm the
// field mapping against real data. Gated on the same live-validated CMS admin
// session as the dashboard — never publicly reachable (feed carries a token and
// may include non-public inventory fields).
export async function GET() {
  const token = await getAdminToken();
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const profile = await cmsGet("/api/authenticate/get-profile", token);
  if (!profile?.success) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!feedConfigured()) {
    return NextResponse.json({
      configured: false,
      hint: "Set DEALERTIDE_FEED_URL in Vercel env vars (Production + Preview), then redeploy.",
    });
  }

  const rows = await getFeedRecordsRaw();
  if (!rows) {
    return NextResponse.json({ configured: true, ok: false, error: "feed fetch/parse failed — see server logs" });
  }

  return NextResponse.json({
    configured: true,
    ok: true,
    count: rows.length,
    fieldKeys: rows[0] ? Object.keys(rows[0]) : [],
    rawSample: rows.slice(0, 2),
    mappedSample: rows.slice(0, 2).map(mapToFloorPlan),
  });
}
