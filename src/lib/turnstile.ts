// Cloudflare Turnstile verification for /api/leads.
//
// The existing guard (src/lib/anti-spam.ts) is a honeypot field plus a 2.5s
// minimum fill time. That stops naive form-fillers and nothing else: a
// headless browser driving the real form defeats both. Turnstile adds a
// server-verified proof that a browser, not a script, produced the submission
// — and unlike reCAPTCHA it shows no puzzle to real people in the ordinary
// case, so it costs nothing in form completion.
//
// DELIBERATELY INERT UNTIL CONFIGURED. With no TURNSTILE_SECRET_KEY set, every
// submission is allowed through exactly as it is today. That means this can
// ship ahead of Kyle creating the Cloudflare account without a window where
// real leads bounce off a widget that is not wired up yet. Once both env vars
// are set (NEXT_PUBLIC_TURNSTILE_SITE_KEY for the widget,
// TURNSTILE_SECRET_KEY for this check) verification becomes mandatory.
//
// Fail-open on Cloudflare being unreachable is intentional and is the right
// trade for a dealership: a few spam leads cost Kyle a minute each, a lost
// real lead costs a house sale.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function turnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export interface TurnstileResult {
  /** False only when Turnstile is configured AND Cloudflare rejected a token as invalid. */
  ok: boolean;
  /** Why, for the log line. */
  reason: string;
}

export async function verifyTurnstile(token: unknown, remoteIp?: string | null): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, reason: "not-configured" };

  // No token at all: the widget's script was blocked, failed to load, or had
  // not finished on a slow phone. That is far more often a real buyer than a
  // bot (the honeypot and fill timer still ran), so it fails OPEN like an
  // unreachable Cloudflare, and the log line says so. Security fixes,
  // 2026-11-26: this used to drop the lead while the visitor saw "thank you".
  if (typeof token !== "string" || !token.trim()) {
    return { ok: true, reason: "missing-token-failed-open" };
  }

  const body = new URLSearchParams({ secret, response: token.trim() });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return { ok: true, reason: `verify-http-${res.status}-failed-open` };
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (data.success) return { ok: true, reason: "verified" };
    const codes = data["error-codes"] || ["rejected"];
    // An expired or already-used token (a double tap, a resubmit after an
    // error, a form left open for 5+ minutes) is a person, not a bot.
    if (codes.every((c) => c === "timeout-or-duplicate")) {
      return { ok: true, reason: "timeout-or-duplicate-failed-open" };
    }
    return { ok: false, reason: codes.join(",") };
  } catch (err) {
    // Cloudflare unreachable or slow: let the lead through and say so.
    return { ok: true, reason: `verify-unreachable-failed-open (${err instanceof Error ? err.message : "error"})` };
  }
}
