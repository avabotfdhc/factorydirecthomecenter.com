import { NextResponse } from "next/server";
import { getAdminToken, cmsGet } from "@/lib/admin-auth";
import { dealertideConfigured, getDealertideVehiclesRaw } from "@/lib/dealertide";

export const dynamic = "force-dynamic";

// Admin-only inspection of the DealerTide /vehicles payload, used once to pin
// down the field mapping for the site feed. Gated on the same live-validated
// CMS admin session as the dashboard — this must never be publicly reachable
// because inventory records may carry non-public fields.
export async function GET() {
  const token = await getAdminToken();
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const profile = await cmsGet("/api/authenticate/get-profile", token);
  if (!profile?.success) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!dealertideConfigured()) {
    return NextResponse.json({
      configured: false,
      hint: "Set DEALERTIDE_API_KEY in Vercel env vars, then redeploy.",
    });
  }

  const vehicles = await getDealertideVehiclesRaw();
  return NextResponse.json({
    configured: true,
    count: vehicles?.length ?? null,
    // Two records are enough to see the shape; avoids dumping the whole book.
    sample: vehicles?.slice(0, 2) ?? null,
  });
}
