import type { Page } from "playwright";
import type { Config } from "./config.js";
import { log } from "./logger.js";
import { errorMessage } from "./util.js";

/**
 * Freeze the run and hand the live, authenticated browser to the human.
 *
 * In headed mode this opens the Playwright Inspector via `page.pause()`, which
 * blocks until you click Resume — the browser stays interactive the whole time,
 * so you just take over the window. In headless mode there is no window to take
 * over, so it holds the process open instead and tells you to restart headed.
 */
export async function handOff(page: Page, config: Config, reason: string): Promise<void> {
  log.banner(`HANDING OVER TO YOU — ${reason}`);
  log.info(`Live page: ${page.url()}`);

  if (config.behavior.headless) {
    log.warn(
      "Running headless: there is no window to take over. The session is held open so " +
        "cookies stay valid — re-run `npm run monitor` (headed) to drive it, or press Ctrl-C.",
    );
    await new Promise<never>(() => {});
  }

  log.info("Opening Playwright Inspector. The browser is yours — click Resume when you're done.");
  try {
    await page.pause();
  } catch (err) {
    // pause() needs the inspector; if it can't start, don't lose the session.
    log.warn(`Could not open the Inspector (${errorMessage(err)}). Holding the browser open instead.`);
    await new Promise<never>(() => {});
  }
}
