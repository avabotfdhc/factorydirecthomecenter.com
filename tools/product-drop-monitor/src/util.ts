/**
 * Pause between poll cycles.
 *
 * This is the ONLY deliberate sleep in the codebase, and it is not a substitute
 * for a page wait: every wait for a *page condition* uses an explicit Playwright
 * wait (`waitForSelector`, `waitForLoadState`, `waitForURL`). This delay exists
 * because polling a remote server on a schedule inherently requires a schedule.
 * It is abort-aware so Ctrl-C is instant rather than blocking for a full cycle.
 */
export function sleepUntilNextPoll(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new AbortError());
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(new AbortError());
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export class AbortError extends Error {
  constructor() {
    super("aborted");
    this.name = "AbortError";
  }
}

/**
 * Poll interval with jitter. The jitter is not an attempt to look human — it
 * spreads retries so a restart storm or a shared schedule doesn't land every
 * request on the same second.
 */
export function jitteredInterval(baseMs: number, jitterMs: number): number {
  if (jitterMs <= 0) return baseMs;
  return baseMs + Math.floor(Math.random() * jitterMs);
}

/** Exponential backoff with a ceiling, for consecutive failures. */
export function backoffMs(attempt: number, baseMs: number, ceilingMs = 600_000): number {
  return Math.min(baseMs * 2 ** Math.max(0, attempt - 1), ceilingMs);
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.stack ?? err.message;
  return String(err);
}
