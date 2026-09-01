import { launchSession } from "./browser.js";
import { loadConfig } from "./config.js";
import { detectBlocker } from "./detectors/blocker.js";
import { detectQueue } from "./detectors/queue.js";
import { detectStock } from "./detectors/stock.js";
import { log } from "./logger.js";
import { capture } from "./screenshot.js";
import { restoreState } from "./state.js";

/**
 * Selector sanity check. Loads the product page once, reports what every
 * configured selector actually matches, then leaves the browser open so you can
 * fix selectors against the live DOM. Run this before you trust a drop to it.
 */
export async function runProbe(): Promise<void> {
  const config = loadConfig();
  const session = await launchSession(config, { headless: false });

  try {
    await restoreState(session.context, config);
    const { page } = session;

    log.info(`Loading ${config.target.productUrl}`);
    await page.goto(config.target.productUrl, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("domcontentloaded");

    const groups: [string, string[]][] = [
      ["selectors.inStock", config.selectors.inStock],
      ["selectors.outOfStock", config.selectors.outOfStock],
      ["selectors.addToCart", [config.selectors.addToCart]],
      ["selectors.cartConfirmation", [config.selectors.cartConfirmation]],
      ["selectors.goToCart", config.selectors.goToCart ? [config.selectors.goToCart] : []],
      ["selectors.checkoutButton", config.selectors.checkoutButton ? [config.selectors.checkoutButton] : []],
      ["selectors.checkoutConfirmation", [config.selectors.checkoutConfirmation]],
      ["queue.selectors", config.queue.selectors],
      ["blockers.selectors", config.blockers.selectors],
    ];

    log.banner("SELECTOR PROBE");

    for (const [label, selectors] of groups) {
      if (!selectors.length) continue;
      console.log(`\n\x1b[1m${label}\x1b[0m`);
      for (const selector of selectors) {
        try {
          const locator = page.locator(selector);
          const count = await locator.count();
          if (count === 0) {
            console.log(`  \x1b[31m✗\x1b[0m ${selector}  → no match`);
            continue;
          }
          const first = locator.first();
          const visible = await first.isVisible().catch(() => false);
          const enabled = await first.isEnabled().catch(() => false);
          const text = (await first.innerText().catch(() => "")).trim().replace(/\s+/g, " ").slice(0, 60);
          const mark = visible && enabled ? "\x1b[32m✓\x1b[0m" : "\x1b[33m~\x1b[0m";
          console.log(
            `  ${mark} ${selector}  → ${count} match(es), visible=${visible}, enabled=${enabled}` +
              (text ? `, text="${text}"` : ""),
          );
        } catch (err) {
          console.log(`  \x1b[31m✗\x1b[0m ${selector}  → invalid: ${(err as Error).message}`);
        }
      }
    }

    const [stock, queue, blocker] = await Promise.all([
      detectStock(page, config),
      detectQueue(page, config),
      detectBlocker(page, config),
    ]);

    log.banner("VERDICT");
    console.log(`  Stock:   ${stock.status}  (${stock.evidence})`);
    console.log(`  Queue:   ${queue.inQueue}  (${queue.evidence})`);
    console.log(`  Blocked: ${blocker.blocked}  (${blocker.evidence})\n`);

    const shot = await capture(page, config, "probe");
    if (shot) log.info(`Screenshot: ${shot}`);

    log.info("Browser left open — inspect the DOM, fix selectors, click Resume to exit.");
    await page.pause();
  } finally {
    await session.close();
  }
}
