import { mkdirSync, existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { BrowserContext } from "playwright";
import { projectPath, type Config } from "./config.js";
import { log } from "./logger.js";

/**
 * The persistent profile already carries cookies between runs. This module
 * exports a portable snapshot on top of that so the session can be inspected,
 * backed up, or moved to another machine — and so a wiped profile can be
 * rehydrated without logging in again.
 */

interface OriginState {
  origin: string;
  localStorage: { name: string; value: string }[];
}

interface Snapshot {
  cookies: Awaited<ReturnType<BrowserContext["cookies"]>>;
  origins: OriginState[];
  sessionStorage: Record<string, Record<string, string>>;
  savedAt: string;
}

export async function saveState(context: BrowserContext, config: Config): Promise<string> {
  const target = projectPath(config.paths.storageState);
  mkdirSync(dirname(target), { recursive: true });

  const base = await context.storageState();

  // storageState() covers cookies + localStorage but not sessionStorage, which
  // some checkout flows key on. Read it per-page and store it alongside.
  const sessionStorage: Record<string, Record<string, string>> = {};
  for (const page of context.pages()) {
    try {
      const origin = new URL(page.url()).origin;
      if (origin === "null" || !origin.startsWith("http")) continue;
      sessionStorage[origin] = await page.evaluate(() => ({ ...window.sessionStorage }));
    } catch {
      // A page mid-navigation or on about:blank is not worth failing the save.
    }
  }

  const snapshot: Snapshot = {
    cookies: base.cookies,
    origins: base.origins,
    sessionStorage,
    savedAt: new Date().toISOString(),
  };

  await writeFile(target, JSON.stringify(snapshot, null, 2), "utf8");
  log.info(
    `Saved session state → ${config.paths.storageState} ` +
      `(${snapshot.cookies.length} cookies, ${snapshot.origins.length} origins)`,
  );
  return target;
}

/** Rehydrate a context from the snapshot. Safe to call when no snapshot exists. */
export async function restoreState(context: BrowserContext, config: Config): Promise<boolean> {
  const source = projectPath(config.paths.storageState);
  if (!existsSync(source)) return false;

  const snapshot = JSON.parse(await readFile(source, "utf8")) as Snapshot;

  if (snapshot.cookies?.length) {
    await context.addCookies(snapshot.cookies);
  }

  // localStorage and sessionStorage can only be written from a page on the
  // matching origin, so they are replayed as an init script keyed by origin.
  const origins = snapshot.origins ?? [];
  const session = snapshot.sessionStorage ?? {};

  if (origins.length || Object.keys(session).length) {
    await context.addInitScript(
      ({ originStates, sessionStates }) => {
        const here = window.location.origin;
        const local = originStates.find((o) => o.origin === here);
        if (local) {
          for (const { name, value } of local.localStorage) {
            try {
              window.localStorage.setItem(name, value);
            } catch {
              /* quota or disabled storage — not fatal */
            }
          }
        }
        const sess = sessionStates[here];
        if (sess) {
          for (const [name, value] of Object.entries(sess)) {
            try {
              window.sessionStorage.setItem(name, value);
            } catch {
              /* ignore */
            }
          }
        }
      },
      { originStates: origins, sessionStates: session },
    );
  }

  log.info(`Restored session state from ${config.paths.storageState} (saved ${snapshot.savedAt})`);
  return true;
}
