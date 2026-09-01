import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "playwright";
import { projectPath, type Config } from "./config.js";
import { log } from "./logger.js";
import { errorMessage } from "./util.js";

/**
 * Full-page screenshot for a notification. Never throws: a capture failure must
 * not swallow the underlying event we were trying to report.
 */
export async function capture(page: Page, config: Config, label: string): Promise<string | undefined> {
  try {
    const dir = projectPath(config.paths.artifacts);
    mkdirSync(dir, { recursive: true });

    const safeLabel = label.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const path = join(dir, `${stamp}__${safeLabel}.png`);

    await page.screenshot({ path, fullPage: true });
    log.debug(`Screenshot → ${path}`);
    return path;
  } catch (err) {
    log.warn(`Screenshot failed (${label}): ${errorMessage(err)}`);
    return undefined;
  }
}
