// Cheap, server-verified spam guard for /api/leads.
//
// Two signals, both from src/lib/use-anti-spam.tsx on the client:
//   hp      — a visually hidden "website" field. Humans never see it; form-filling
//             bots fill everything. Any value => spam.
//   fillMs  — milliseconds between the form mounting and submit. Bots that
//             render the page submit in well under a second; a person takes
//             seconds just to type a name. Under MIN_FILL_MS => spam.
//
// Either signal missing => allowed. The instant-quote server action and the
// Ava chat tools post without them, and a bot that skips the form entirely is
// the job of a platform rate limit (Vercel Firewall on /api/leads), not this.
//
// A spam verdict is acknowledged with the same 200 a real lead gets, so the
// sender learns nothing, and NOTHING is forwarded or stored.

export const MIN_FILL_MS = 2_500;

export type SpamVerdict = "honeypot" | "too-fast" | null;

export function spamVerdict(body: Record<string, unknown>): SpamVerdict {
  const hp = [body.hp, body.website].find((v) => typeof v === "string" && v.trim()) as string | undefined;
  if (hp) return "honeypot";
  const fillMs = Number(body.fillMs);
  if (Number.isFinite(fillMs) && fillMs >= 0 && fillMs < MIN_FILL_MS) return "too-fast";
  return null;
}
