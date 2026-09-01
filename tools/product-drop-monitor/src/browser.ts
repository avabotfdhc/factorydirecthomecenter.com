import { mkdirSync } from "node:fs";
import { chromium, type BrowserContext, type Page } from "playwright";
import { projectPath, type Config } from "./config.js";
import { log } from "./logger.js";

export interface Session {
  context: BrowserContext;
  page: Page;
  close(): Promise<void>;
}

/**
 * Launch a persistent Chromium profile.
 *
 * Deliberately NOT `puppeteer-extra-plugin-stealth`. That plugin patches a
 * headless fingerprint after the fact; a persistent real profile *is* a real
 * browser — real cookies, real GPU/canvas, real TLS stack — which is both more
 * honest and far more stable than a patched one. The profile also carries your
 * login forward between runs with no cookie juggling.
 */
export async function launchSession(config: Config, overrides: { headless?: boolean } = {}): Promise<Session> {
  const userDataDir = projectPath(config.paths.userDataDir);
  mkdirSync(userDataDir, { recursive: true });

  const headless = overrides.headless ?? config.behavior.headless;

  // Point CHROME_PATH at a real Google Chrome / Chromium binary to run this in
  // your actual browser build rather than Playwright's bundled one. Optional,
  // but a stock consumer Chrome is the most ordinary-looking client there is.
  const executablePath = process.env["CHROME_PATH"] || undefined;

  log.info(
    `Launching Chromium (headless=${headless}) with profile ${config.paths.userDataDir}` +
      (executablePath ? ` using ${executablePath}` : ""),
  );

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless,
    ...(executablePath ? { executablePath } : {}),
    viewport: { width: 1440, height: 900 },
    acceptDownloads: false,
    args: [
      // Keeps the automation flag out of the profile without spoofing anything
      // else about the browser; a stock Chromium otherwise advertises itself as
      // driven purely as a side effect of being launched by CDP.
      "--disable-blink-features=AutomationControlled",
      "--start-maximized",
    ],
  });

  context.setDefaultNavigationTimeout(config.target.navigationTimeoutMs);
  context.setDefaultTimeout(config.target.navigationTimeoutMs);

  const page = context.pages()[0] ?? (await context.newPage());

  return {
    context,
    page,
    close: async () => {
      await context.close().catch(() => undefined);
    },
  };
}
