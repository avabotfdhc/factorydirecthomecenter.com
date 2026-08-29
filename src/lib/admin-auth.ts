import { cookies } from "next/headers";

// Admin auth = the SAME accounts as the existing CMS admin panel
// (admin.factorydirecthomescenter.com). We proxy the CMS login endpoint and
// keep the JWT in an httpOnly cookie so it never touches browser storage.

export const ADMIN_COOKIE = "fdhc_admin";

export const CMS_API = (
  process.env.NEXT_PUBLIC_API_URL || "https://api.factorydirecthomescenter.com"
).replace(/\/$/, "");

/** JWT from the httpOnly admin cookie, or null. */
export async function getAdminToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value ?? null;
}

/** Authenticated GET against the CMS API. Returns parsed JSON or null on 401/error. */
export async function cmsGet(path: string, token: string): Promise<any | null> {
  try {
    const res = await fetch(`${CMS_API}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Verify an admin token against the CMS. Only a definitive 401/403 from the CMS
 * counts as unauthorized; a transient CMS error (5xx, timeout, network) does NOT
 * — the operator already holds a token the CMS issued at login, so a flaky
 * get-profile call must not bounce them back to /login in a redirect loop.
 */
export async function verifyAdmin(
  token: string,
): Promise<{ authorized: boolean; profile: any | null }> {
  try {
    const res = await fetch(`${CMS_API}/api/authenticate/get-profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) return { authorized: false, profile: null };
    const profile = await res.json().catch(() => null);
    return { authorized: true, profile };
  } catch {
    // CMS unreachable/transient — keep the valid session rather than lock out.
    return { authorized: true, profile: null };
  }
}

// Pull the row array out of whatever shape the CMS wraps it in.
export function extractRows(json: any): any[] {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.data?.data)) return json.data.data;
  if (Array.isArray(json?.data?.rows)) return json.data.rows;
  if (Array.isArray(json?.rows)) return json.rows;
  if (Array.isArray(json?.result)) return json.result;
  if (Array.isArray(json?.enquiries)) return json.enquiries;
  return [];
}

export interface LeadsProbe {
  endpoint: string;
  status: number | string;
  keys: string[];
  rowCount: number;
  firstRowKeys: string[];
}

export interface LeadsResult {
  rows: any[];
  total: number;
  source: string | null;
  probes: LeadsProbe[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// The admin panel doesn't know the exact CMS endpoint that lists website
// enquiries, so try the known candidates (leads are WRITTEN to
// /api/enquiry/rash-enquiry). The CMS rate-limits authenticated requests HARD
// (429), so we must not burst: the /api/enquiry/* paths go first (they avoid
// the /authenticate limiter), calls are paced, and a 429 backs off and retries
// once. Stop at the first endpoint that returns real rows.
const LEAD_ENDPOINTS = [
  "/api/enquiry/get-all",
  "/api/enquiry/get-list",
  "/api/enquiry/get-enquiry",
  "/api/enquiry/rash-enquiry",
  "/api/authenticate/get/enquiry-form",
  "/api/authenticate/get/enquiry",
];

export async function fetchLeads(
  token: string,
  { limit = 100, page = 1 }: { limit?: number; page?: number } = {},
): Promise<LeadsResult> {
  const probes: LeadsProbe[] = [];
  let firstOkSource: { rows: any[]; total: number; source: string } | null = null;

  for (let i = 0; i < LEAD_ENDPOINTS.length; i++) {
    const base = LEAD_ENDPOINTS[i];
    const endpoint = `${base}?limit=${limit}&page=${page}`;
    let status: number | string = "error";
    let json: any = null;

    // Up to 2 attempts: a 429 backs off then retries once.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(`${CMS_API}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        status = res.status;
        if (res.status === 429 && attempt === 0) {
          await sleep(2000); // rate-limited — wait out the window, then retry
          continue;
        }
        json = await res.json().catch(() => null);
      } catch (e) {
        status = (e as { name?: string })?.name || "fetch-failed";
      }
      break;
    }

    const rows = extractRows(json);
    probes.push({
      endpoint: base,
      status,
      keys: json && typeof json === "object" ? Object.keys(json) : [],
      rowCount: rows.length,
      firstRowKeys: rows[0] && typeof rows[0] === "object" ? Object.keys(rows[0]) : [],
    });

    const total =
      json?.pagination?.totalCount ??
      json?.totalCount ??
      json?.total ??
      json?.data?.totalCount ??
      rows.length;

    if (rows.length > 0) {
      return { rows, total, source: base, probes };
    }
    // Remember a 200 that simply had no rows (correct endpoint, empty result)
    // as a fallback, but keep looking for one with data.
    if (status === 200 && !firstOkSource) {
      firstOkSource = { rows, total, source: base };
    }

    // Pace the calls so we don't trip the CMS auth rate limiter.
    if (i < LEAD_ENDPOINTS.length - 1) await sleep(400);
  }

  if (firstOkSource) return { ...firstOkSource, probes };
  return { rows: [], total: 0, source: null, probes };
}
