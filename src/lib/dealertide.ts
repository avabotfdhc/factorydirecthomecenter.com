// DealerTide (Renter Insight) partner-API adapter.
//
// Feed architecture: DealerTide is Kyle's CRM/DMS and the long-term source of
// truth for inventory. This module mirrors the shape of api-content.ts so pages
// can switch sources without changing render code. Auth comes from the
// DEALERTIDE_API_KEY env var (set only in Vercel — never committed, never
// logged). Endpoint map confirmed 2026-08-07 by probing (401=exists):
//   GET  /vehicles, /vehicles/{id}   inventory units ("vehicle" = home)
//   POST /leads                      inbound lead intake (source defaulting +
//                                    dedupe configured on the key in DealerTide)
//   GET  /locations, /contacts, /deals, /quotes   (CRM side, not used here)

const DT_BASE =
  process.env.DEALERTIDE_API_BASE ||
  "https://renterinsight-api-prod.onrender.com/api/partner/v1";

/** Accepts the key with or without a "Bearer " prefix pasted into the env var. */
function authHeader(): string | null {
  const raw = process.env.DEALERTIDE_API_KEY?.trim();
  if (!raw) return null;
  return raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
}

export function dealertideConfigured(): boolean {
  return Boolean(authHeader());
}

async function dtFetch(path: string, revalidate = 300): Promise<any | null> {
  const auth = authHeader();
  if (!auth) return null;
  try {
    const res = await fetch(`${DT_BASE}${path}`, {
      headers: { Authorization: auth, Accept: "application/json" },
      next: { revalidate },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Raw vehicle list, shape-agnostic. The partner API's exact response shape is
 * confirmed via /api/admin/dealertide-preview (admin-gated) before we commit to
 * a field mapping — this defensively unwraps the common envelope patterns.
 */
export async function getDealertideVehiclesRaw(): Promise<any[] | null> {
  const json = await dtFetch(`/vehicles`);
  if (!json) return null;
  if (Array.isArray(json)) return json;
  for (const k of ["data", "vehicles", "results", "items", "rows"]) {
    if (Array.isArray(json?.[k])) return json[k];
  }
  return null;
}

export async function getDealertideVehicleRaw(id: string): Promise<any | null> {
  const json = await dtFetch(`/vehicles/${encodeURIComponent(id)}`);
  return json?.data ?? json ?? null;
}

/** Payload fields per the key's inbound-lead instructions in DealerTide. */
export interface DealertideLead {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  source?: string;
  [extra: string]: unknown;
}

/**
 * Push a website lead into DealerTide. Returns true on 2xx (201 created, or
 * 202 = matched an existing contact and was skipped as a duplicate — both count
 * as delivered). Never throws: lead capture must not break on CRM hiccups.
 */
export async function pushLeadToDealertide(lead: DealertideLead): Promise<boolean> {
  const auth = authHeader();
  if (!auth) return false;
  try {
    const res = await fetch(`${DT_BASE}/leads`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ source: "Website", ...lead }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}
