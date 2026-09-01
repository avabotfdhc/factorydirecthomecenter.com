import type { Page } from "playwright";
import type { Config } from "./config.js";
import { log } from "./logger.js";

export type CartStage = "added-to-cart" | "at-checkout";

export interface CartResult {
  stage: CartStage;
  url: string;
}

/**
 * Drive the page from "in stock" to "sitting on the checkout form".
 *
 * Every step is an explicit Playwright wait on a real page condition — a
 * selector becoming actionable, a load state settling. There are no blind
 * timeouts anywhere in this path, because on a drop the difference between
 * "waited exactly as long as the DOM needed" and "waited 3 seconds and hoped"
 * is the whole ballgame.
 *
 * It deliberately stops at the checkout form. Payment is yours to confirm.
 */
export async function addToCartAndProceed(page: Page, config: Config): Promise<CartResult> {
  const { selectors, behavior } = config;

  log.info(`Waiting for add-to-cart control: ${selectors.addToCart}`);
  const addButton = page.locator(selectors.addToCart).first();
  await addButton.waitFor({ state: "visible" });
  await addButton.scrollIntoViewIfNeeded();
  await addButton.click();
  log.info("Clicked add-to-cart.");

  log.info(`Waiting for cart confirmation: ${selectors.cartConfirmation}`);
  await page.locator(selectors.cartConfirmation).first().waitFor({ state: "visible" });
  log.banner("IN THE CART");

  if (!behavior.autoProceedToCheckout) {
    return { stage: "added-to-cart", url: page.url() };
  }

  if (selectors.goToCart) {
    log.info(`Navigating to cart: ${selectors.goToCart}`);
    const cartLink = page.locator(selectors.goToCart).first();
    await cartLink.waitFor({ state: "visible" });
    await Promise.all([page.waitForLoadState("domcontentloaded"), cartLink.click()]);
  }

  // checkoutButton is required by config validation when autoProceedToCheckout
  // is on, so this is guaranteed present here.
  const checkoutSelector = selectors.checkoutButton!;
  log.info(`Waiting for checkout control: ${checkoutSelector}`);
  const checkoutButton = page.locator(checkoutSelector).first();
  await checkoutButton.waitFor({ state: "visible" });
  await checkoutButton.scrollIntoViewIfNeeded();
  await Promise.all([page.waitForLoadState("domcontentloaded"), checkoutButton.click()]);

  log.info(`Waiting for checkout form: ${selectors.checkoutConfirmation}`);
  await page.locator(selectors.checkoutConfirmation).first().waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle").catch(() => undefined);

  log.banner("AT CHECKOUT — STOPPING HERE. PAYMENT IS YOURS TO CONFIRM.");
  return { stage: "at-checkout", url: page.url() };
}
