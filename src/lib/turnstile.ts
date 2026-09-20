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
  /** False only when Turnstile is configured AND actively rejected the token. */
  ok: boolean;
  /** Why, for the log line. */
  reason: string;
}

export async function verifyTurnstile(token: unknown, remoteIp?: string | null): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, reason: "not-configured" };

  if (typeof token !== "string" || !token.trim()) {
    return { ok: false, reason: "missing-token" };
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
    return { ok: false, reason: (data["error-codes"] || ["rejected"]).join(",") };
  } catch (err) {
    // Cloudflare unreachable or slow: let the lead through and say so.
    return { ok: true, reason: `verify-unreachable-failed-open (${err instanceof Error ? err.message : "error"})` };
  }
}
