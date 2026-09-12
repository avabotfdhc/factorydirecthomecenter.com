// Retry + last-known-good caching for the Supabase REST reads.
//
// Why: Vercel's functions intermittently fail to reach Supabase — production
// logs for 2026-09-10/11 show `ETIMEDOUT`, `ECONNRESET` and
// `UND_ERR_SOCKET: other side closed` against mvetqzhjszlullttfkwa.supabase.co
// every 20–60 minutes, while Supabase's own edge logs show only 200s. Each of
// those failures hit the catalogue with no retry, and the fallbacks are
// visible to buyers:
//
//   * the nine Prime plans that exist only in the CMS drop out of the
//     catalogue and their detail pages 404;
//   * the other 33 fall back to the repo copy, which carries fewer photos, so
//     galleries shrink to a single rendering;
//   * the degraded render is then cached for the route's five-minute window,
//     so it stays wrong for every visitor even once Supabase is reachable.
//
// (Kyle reported exactly that on 2026-09-11: "Prime unit floor plans and
// photos just disappeared.")
//
// So: retry a failed read a couple of times with a short backoff, and when
// every attempt fails, serve the last successful response for that same query
// instead of an empty/absent result. The cache is per function instance and
// in memory only — no new dependency, nothing to invalidate, and a cold
// instance simply behaves as before.

/** A network-level failure worth retrying: the request never got an answer. */
export function isTransientError(err: unknown): boolean {
  const seen = new Set<unknown>();
  for (let e: unknown = err; e && !seen.has(e); e = (e as { cause?: unknown }).cause) {
    seen.add(e);
    const code = String((e as { code?: unknown }).code || "");
    if (
      code === "ETIMEDOUT" ||
      code === "ECONNRESET" ||
      code === "ECONNREFUSED" ||
      code === "EPIPE" ||
      code === "ENOTFOUND" ||
      code === "EAI_AGAIN" ||
      code.startsWith("UND_ERR_")
    ) {
      return true;
    }
    const msg = String((e as { message?: unknown }).message || "").toLowerCase();
    if (
      msg.includes("fetch failed") ||
      msg.includes("socket") ||
      msg.includes("network") ||
      msg.includes("terminated") ||
      msg.includes("timeout")
    ) {
      return true;
    }
  }
  return false;
}

/** HTTP statuses worth retrying — the server is busy or briefly broken, not
 *  answering "no". A 4xx (bad query, missing row, RLS) is never retried. */
export function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 425 || status === 429 || (status >= 500 && status <= 599);
}

export class RetryableHttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = "RetryableHttpError";
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface RetryOptions {
  /** Backoff before each retry, in ms. Length = number of retries. */
  delays?: number[];
  /** Called before each retry, for logging. */
  onRetry?: (attempt: number, err: unknown) => void;
}

/** Run `fn`, retrying only transient network failures and retryable statuses.
 *  Anything else (and the final failure) propagates unchanged. */
export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const delays = opts.delays ?? [200, 600];
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const retryable =
        isTransientError(err) ||
        (err instanceof RetryableHttpError && isRetryableStatus(err.status));
      if (!retryable || attempt >= delays.length) throw err;
      opts.onRetry?.(attempt + 1, err);
      await sleep(delays[attempt]);
    }
  }
}

interface CacheEntry {
  value: unknown;
  at: number;
}

/** Last successful response per query key. Module scope, so it lives as long
 *  as the serverless instance does. */
const lastGood = new Map<string, CacheEntry>();

/** How long a remembered response may stand in for a live one. Long enough to
 *  cover an outage of hours, short enough that a genuinely removed plan does
 *  not linger on a warm instance for a day. */
export const STALE_MAX_AGE_MS = 6 * 60 * 60 * 1000;

/** Cap the map so a long-lived instance serving many slugs cannot grow without
 *  bound; oldest entry is dropped first. */
const MAX_ENTRIES = 500;

export function rememberGood(key: string, value: unknown, now = Date.now()): void {
  if (lastGood.size >= MAX_ENTRIES && !lastGood.has(key)) {
    const oldest = lastGood.keys().next();
    if (!oldest.done) lastGood.delete(oldest.value);
  }
  lastGood.set(key, { value, at: now });
}

/** The remembered response for `key`, or undefined when there is none or it
 *  has aged out. */
export function recallGood(key: string, now = Date.now()): { value: unknown; ageMs: number } | undefined {
  const hit = lastGood.get(key);
  if (!hit) return undefined;
  const ageMs = now - hit.at;
  if (ageMs > STALE_MAX_AGE_MS) {
    lastGood.delete(key);
    return undefined;
  }
  return { value: hit.value, ageMs };
}

/** Test seam. */
export function clearRememberedGood(): void {
  lastGood.clear();
}
