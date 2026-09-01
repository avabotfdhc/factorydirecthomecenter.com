import type { Page } from "playwright";
import type { Config } from "../config.js";

export interface BlockerState {
  blocked: boolean;
  evidence: string;
}

/**
 * Detects CAPTCHAs, bot-challenge interstitials, and hard blocks.
 *
 * This only *recognises* a challenge — it never attempts to solve or bypass
 * one. A challenge means the site wants a human, so the monitor's job is to
 * stop touching it, page you, and hold the browser open so you can answer it
 * yourself. Solving these automatically is exactly the line this tool doesn't
 * cross.
 */
export async function detectBlocker(page: Page, config: Config): Promise<BlockerState> {
  const url = page.url().toLowerCase();
  const urlHit = config.blockers.urlPatterns.find((p) => url.includes(p.toLowerCase()));
  if (urlHit) return { blocked: true, evidence: `url contains "${urlHit}"` };

  for (const selector of config.blockers.selectors) {
    try {
      const locator = page.locator(selector).first();
      if ((await locator.count()) > 0 && (await locator.isVisible())) {
        return { blocked: true, evidence: `challenge element visible: ${selector}` };
      }
    } catch {
      /* not a signal */
    }
  }

  if (config.blockers.bodyText.length) {
    const body = (await page.locator("body").innerText().catch(() => "")).toLowerCase();
    const textHit = config.blockers.bodyText.find((t) => body.includes(t.toLowerCase()));
    if (textHit) return { blocked: true, evidence: `page text contains "${textHit}"` };
  }

  return { blocked: false, evidence: "no challenge detected" };
}
