// Server-only reads for the admin dashboard: leads and catalogue counts from
// Supabase (service role, bypasses RLS). Never import into a client component.
import type { LeadRow } from "@/app/admin/(protected)/LeadsTable";

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function rest(path: string, extra: Record<string, string> = {}): Promise<Response> {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    cache: "no-store",
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, ...extra },
  });
}

function contentRangeTotal(res: Response): number {
  const m = /\/(\d+)$/.exec(res.headers.get("content-range") || "");
  return m ? Number(m[1]) : 0;
}

interface StoredLeadRow {
  id: string;
  created_at: string;
  full_name: string | null;
  contact_info: string | null;
  target_county: string | null;
  timeline: string | null;
  model_interest: string | null;
  series_interest: string | null;
  source_page: string | null;
  status: string | null;
}

function toLeadRow(r: StoredLeadRow): LeadRow {
  const parts = String(r.contact_info || "").split("·").map((s) => s.trim()).filter(Boolean);
  const email = parts.find((p) => p.includes("@"));
  const phone = parts.find((p) => !p.includes("@"));
  const [firstName, ...rest] = String(r.full_name || "").trim().split(/\s+/);
  return {
    id: r.id,
    firstName,
    lastName: rest.join(" "),
    email,
    phoneNo: phone,
    floorTitle: r.model_interest || r.series_interest || undefined,
    leadSource: r.source_page ? r.source_page.replace(/^https?:\/\/[^/]+/, "") || "/" : "Website",
    address: [r.timeline && `Timeframe: ${r.timeline}`, r.status && `Status: ${r.status}`].filter(Boolean).join(" · "),
    createdAt: r.created_at,
    deliveryStateDetails: r.target_county ? { name: r.target_county } : null,
  };
}

export async function fetchLeads({ limit = 20, page = 1 }: { limit?: number; page?: number } = {}) {
  if (!SUPABASE_URL || !SERVICE_KEY) return { rows: [] as LeadRow[], total: 0 };
  const from = (page - 1) * limit;
  const res = await rest(`leads?select=*&order=created_at.desc`, {
    Range: `${from}-${from + limit - 1}`,
    Prefer: "count=exact",
  });
  if (!res.ok) throw new Error(`[admin-data] leads ${res.status} ${await res.text()}`);
  const rows = ((await res.json()) as StoredLeadRow[]).map(toLeadRow);
  return { rows, total: contentRangeTotal(res) || rows.length };
}

export async function countLeadsInLastDays(days: number): Promise<number> {
  if (!SUPABASE_URL || !SERVICE_KEY) return 0;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const res = await rest(`leads?select=id&created_at=gte.${encodeURIComponent(since)}`, {
    Prefer: "count=exact",
    Range: "0-0",
  });
  return res.ok ? contentRangeTotal(res) : 0;
}

export async function countActivePlans(): Promise<number> {
  if (!SUPABASE_URL || !SERVICE_KEY) return 0;
  const res = await rest(`floor_plans?select=id&is_active=eq.true`, { Prefer: "count=exact", Range: "0-0" });
  return res.ok ? contentRangeTotal(res) : 0;
}
