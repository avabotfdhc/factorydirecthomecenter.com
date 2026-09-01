import type { Page } from "playwright";
import type { Config } from "../config.js";
import { log } from "../logger.js";

export type StockStatus = "in-stock" | "out-of-stock" | "unknown";

export interface StockResult {
  status: StockStatus;
  evidence: string;
}

/**
 * Selectors first, page text second.
 *
 * Selectors are authoritative when they match — a site's own enabled/disabled
 * add-to-cart button is the most reliable signal there is. Text matching is the
 * fallback for sites that swap copy instead of state, and it checks the
 * out-of-stock vocabulary first: "Sold out" and "Add to cart" can both be
 * present on a page (related products, size variants), and a false negative
 * costs you a poll cycle while a false positive sends you a bogus 3am alert.
 */
export async function detectStock(page: Page, config: Config): Promise<StockResult> {
  const { selectors, stockText } = config;

  for (const selector of selectors.outOfStock) {
    if (await isVisible(page, selector)) {
      return { status: "out-of-stock", evidence: `selector matched: ${selector}` };
    }
  }

  for (const selector of selectors.inStock) {
    if (await isVisible(page, selector)) {
      return { status: "in-stock", evidence: `selector matched: ${selector}` };
    }
  }

  const body = (await page.locator("body").innerText().catch(() => "")).toLowerCase();
  if (!body) return { status: "unknown", evidence: "page body was empty or unreadable" };

  for (const phrase of stockText.outOfStock) {
    if (body.includes(phrase.toLowerCase())) {
      return { status: "out-of-stock", evidence: `text matched: "${phrase}"` };
    }
  }

  for (const phrase of stockText.inStock) {
    if (body.includes(phrase.toLowerCase())) {
      return { status: "in-stock", evidence: `text matched: "${phrase}"` };
    }
  }

  return { status: "unknown", evidence: "no configured selector or phrase matched" };
}

/**
 * Visible AND enabled. A present-but-disabled add-to-cart button is the single
 * most common false positive in this whole category of tool.
 */
async function isVisible(page: Page, selector: string): Promise<boolean> {
  try {
    const locator = page.locator(selector).first();
    if ((await locator.count()) === 0) return false;
    if (!(await locator.isVisible())) return false;
    if (!(await locator.isEnabled())) return false;
    return true;
  } catch (err) {
    log.debug(`Selector check failed for "${selector}": ${(err as Error).message}`);
    return false;
  }
}
