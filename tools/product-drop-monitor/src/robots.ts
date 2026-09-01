import { log } from "./logger.js";
import { errorMessage } from "./util.js";

/**
 * A minimal robots.txt check for the User-agent:* group. This is advisory —
 * it warns rather than blocks — but if the product path is disallowed you
 * should know that before pointing a poller at it.
 */
export async function checkRobots(productUrl: string): Promise<{ allowed: boolean; reason: string }> {
  try {
    const target = new URL(productUrl);
    const res = await fetch(new URL("/robots.txt", target.origin), {
      headers: { accept: "text/plain" },
    });

    if (!res.ok) return { allowed: true, reason: `no robots.txt (${res.status})` };

    const body = await res.text();
    const rules: { type: "allow" | "disallow"; path: string }[] = [];
    let inStarGroup = false;

    for (const rawLine of body.split(/\r?\n/)) {
      const line = rawLine.split("#")[0]?.trim() ?? "";
      if (!line) continue;
      const [rawKey, ...rest] = line.split(":");
      const key = rawKey?.trim().toLowerCase();
      const value = rest.join(":").trim();

      if (key === "user-agent") {
        inStarGroup = value === "*";
      } else if (inStarGroup && (key === "disallow" || key === "allow")) {
        if (value) rules.push({ type: key, path: value });
      }
    }

    // Longest matching prefix wins; Allow beats Disallow at equal length.
    let best: { type: "allow" | "disallow"; path: string } | undefined;
    for (const rule of rules) {
      if (!target.pathname.startsWith(rule.path)) continue;
      if (
        !best ||
        rule.path.length > best.path.length ||
        (rule.path.length === best.path.length && rule.type === "allow")
      ) {
        best = rule;
      }
    }

    if (best?.type === "disallow") {
      return { allowed: false, reason: `robots.txt disallows "${best.path}" for User-agent: *` };
    }
    return { allowed: true, reason: best ? `allowed by "${best.path}"` : "no matching rule" };
  } catch (err) {
    log.debug(`robots.txt check skipped: ${errorMessage(err)}`);
    return { allowed: true, reason: "robots.txt unreachable" };
  }
}
