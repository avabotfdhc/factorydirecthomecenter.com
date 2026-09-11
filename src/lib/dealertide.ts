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
 * The email the instant-quote path used to fabricate when a visitor gave only
 * a phone number, because /api/leads once required one. DealerTide dedupes on
 * email, so every such lead collided into the first contact and came back as
 * a 202 "duplicate" — counted as delivered, silently dropped from the CRM.
 * Never send it; a phone number is a perfectly good identifier on its own.
 */
export const NO_EMAIL_PLACEHOLDER = "no-email@factorydirecthomescenter.com";

export interface DealertideResult {
  ok: boolean;
  /** HTTP status of the final attempt, or null when no response arrived. */
  status: number | null;
  /** Short reason, safe to log — never includes the key. */
  detail: string;
  attempts: number;
}

const LEAD_TIMEOUT_MS = 6_000;
const LEAD_RETRY_DELAY_MS = 1_000;

// Retry only where a second try can plausibly succeed: no response (network,
// timeout, Render cold start), rate limiting, or a server-side error. A 4xx
// other than 429 means the request itself is wrong and will fail again.
function retryable(status: number | null): boolean {
  return status === null || status === 429 || status >= 500;
}

/**
 * Push a website lead into DealerTide. `ok` is true on 2xx: 201 = created,
 * 202 = matched an existing contact and was skipped as a duplicate — both
 * count as delivered. Never throws: lead capture must not break on CRM hiccups.
 * Tries at most twice; worst case ~13s, inside the route's maxDuration.
 */
export async function pushLeadToDealertide(lead: DealertideLead): Promise<DealertideResult> {
  const auth = authHeader();
  if (!auth) return { ok: false, status: null, detail: "DEALERTIDE_API_KEY not set", attempts: 0 };

  const { email, ...rest } = lead;
  const payload: DealertideLead = { source: "Website", ...rest };
  if (email && email.trim().toLowerCase() !== NO_EMAIL_PLACEHOLDER) payload.email = email.trim();

  let last: DealertideResult = { ok: false, status: null, detail: "not attempted", attempts: 0 };
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`${DT_BASE}/leads`, {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: AbortSignal.timeout(LEAD_TIMEOUT_MS),
      });
      if (res.ok) {
        return {
          ok: true,
          status: res.status,
          detail: res.status === 202 ? "accepted as duplicate of an existing contact" : "created",
          attempts: attempt,
        };
      }
      const body = (await res.text().catch(() => "")).replace(/\s+/g, " ").slice(0, 200);
      last = { ok: false, status: res.status, detail: `HTTP ${res.status}${body ? `: ${body}` : ""}`, attempts: attempt };
    } catch (err) {
      const detail =
        err instanceof Error
          ? err.name === "TimeoutError" ? `no response within ${LEAD_TIMEOUT_MS}ms` : err.message
          : String(err);
      last = { ok: false, status: null, detail, attempts: attempt };
    }
    if (!retryable(last.status) || attempt === 2) break;
    await new Promise((r) => setTimeout(r, LEAD_RETRY_DELAY_MS));
  }
  return last;
}
