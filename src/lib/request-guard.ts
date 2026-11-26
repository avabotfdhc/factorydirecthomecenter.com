import { createHash, timingSafeEqual } from "node:crypto";

// Small server-only helpers shared by the public endpoints (security fixes,
// 2026-11-26). Import only from route handlers and server actions: this file
// uses node:crypto.

/**
 * Constant-time string comparison for shared secrets. Both sides are hashed
 * first so inputs of different lengths compare without leaking the length.
 */
export function safeEqual(a: string | null | undefined, b: string | null | undefined): boolean {
  if (typeof a !== "string" || typeof b !== "string" || !a || !b) return false;
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

// In-memory fixed-window limiter, one map per named bucket. On Vercel each
// warm instance keeps its own map, so the real ceiling is a little higher
// under fan-out; it still stops one browser or script from looping an
// endpoint. Platform-wide limits belong in a Vercel Firewall rule.
const buckets = new Map<string, Map<string, { count: number; resetAt: number }>>();

export function rateLimit(
  bucket: string,
  key: string,
  max: number,
  windowMs: number,
  now: number = Date.now(),
): { allowed: boolean; retryAfterSec: number } {
  let map = buckets.get(bucket);
  if (!map) {
    map = new Map();
    buckets.set(bucket, map);
  }
  if (map.size > 5000) {
    for (const [k, v] of map) if (v.resetAt <= now) map.delete(k);
  }
  const entry = map.get(key);
  if (!entry || entry.resetAt <= now) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }
  entry.count += 1;
  return {
    allowed: entry.count <= max,
    retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

/** Client IP from the proxy headers Vercel sets; "unknown" when absent. */
export function requestIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

// ── Internal lead calls ─────────────────────────────────────────────────────
// The instant-quote server action and Ava post to /api/leads over HTTP. They
// prove they are this app (not a script on the internet) with a header
// derived from a server-only secret that is already set on Vercel, so no new
// env var is needed. LEAD_INTERNAL_SECRET, when set, takes precedence.
export const INTERNAL_LEAD_HEADER = "x-fdhc-internal-lead";

function internalLeadKey(): string | null {
  const base =
    process.env.LEAD_INTERNAL_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.DEALERTIDE_API_KEY ||
    "";
  if (!base) return null;
  return createHash("sha256").update(`fdhc-internal-lead|${base}`).digest("hex");
}

/** Header to attach to a server-side fetch of /api/leads. Empty when no secret exists. */
export function internalLeadHeaders(): Record<string, string> {
  const key = internalLeadKey();
  return key ? { [INTERNAL_LEAD_HEADER]: key } : {};
}

/** True when the request carries this app's internal lead key. */
export function isInternalLeadCall(headers: Headers): boolean {
  const key = internalLeadKey();
  return key !== null && safeEqual(headers.get(INTERNAL_LEAD_HEADER), key);
}
