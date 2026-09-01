import { launchSession } from "./browser.js";
import { loadConfig } from "./config.js";
import { log } from "./logger.js";
import { saveState } from "./state.js";

/**
 * One-time interactive login.
 *
 * Opens a real headed browser on the target site and waits for you to sign in
 * by hand — no credentials are ever stored in or read by this project. When you
 * press Resume, the cookies/localStorage/sessionStorage are snapshotted and the
 * persistent profile keeps them for every later run.
 */
export async function runLogin(): Promise<void> {
  const config = loadConfig();
  const session = await launchSession(config, { headless: false });

  try {
    const origin = new URL(config.target.productUrl).origin;
    log.info(`Opening ${origin}`);
    await session.page.goto(origin, { waitUntil: "domcontentloaded" });

    log.banner(
      "LOG IN BY HAND IN THE BROWSER WINDOW.\n" +
        "  Complete any 2FA. Land on a logged-in page.\n" +
        "  Then click ▶ Resume in the Playwright Inspector to save the session.",
    );

    await session.page.pause();

    await saveState(session.context, config);
    log.banner("SESSION SAVED. `npm run monitor` will reuse this login.");
  } finally {
    await session.close();
  }
}
