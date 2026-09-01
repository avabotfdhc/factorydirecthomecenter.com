import type { Page } from "playwright";
import type { Config } from "../config.js";
import { log } from "../logger.js";
import { sleepUntilNextPoll } from "../util.js";

export interface QueueState {
  inQueue: boolean;
  evidence: string;
}

export function urlLooksLikeQueue(url: string, config: Config): string | undefined {
  const lower = url.toLowerCase();
  return config.queue.urlPatterns.find((p) => lower.includes(p.toLowerCase()));
}

export async function detectQueue(page: Page, config: Config): Promise<QueueState> {
  const urlHit = urlLooksLikeQueue(page.url(), config);
  if (urlHit) return { inQueue: true, evidence: `url contains "${urlHit}"` };

  for (const selector of config.queue.selectors) {
    try {
      const locator = page.locator(selector).first();
      if ((await locator.count()) > 0 && (await locator.isVisible())) {
        return { inQueue: true, evidence: `queue element visible: ${selector}` };
      }
    } catch {
      /* selector didn't resolve — not a queue signal */
    }
  }

  return { inQueue: false, evidence: "no queue signal" };
}

/** Best-effort read of the position/ETA text the waiting room renders. */
export async function readQueuePosition(page: Page, config: Config): Promise<string | undefined> {
  const selector = config.queue.positionSelector;
  if (!selector) return undefined;
  try {
    const locator = page.locator(selector).first();
    if ((await locator.count()) === 0) return undefined;
    const text = (await locator.innerText()).trim().replace(/\s+/g, " ");
    return text || undefined;
  } catch {
    return undefined;
  }
}

export interface QueueOutcome {
  passed: boolean;
  finalUrl: string;
  lastPosition?: string;
  waitedMs: number;
}

/**
 * Wait out a virtual waiting room.
 *
 * The critical rule: DO NOT RELOAD. Queue-It and every system like it hold your
 * place with a token tied to the live page and advance it themselves via their
 * own polling. A manual refresh at best does nothing and at worst invalidates
 * the token and drops you to the back of the line — the exact failure this is
 * built to avoid.
 *
 * So this waits on a real navigation *away* from the queue (`waitForURL`) and,
 * in parallel, reads position text straight out of the already-loaded DOM. That
 * read costs zero network requests, so progress can be reported as often as you
 * like without touching the queue's rate limits.
 */
export async function waitOutQueue(
  page: Page,
  config: Config,
  hooks: {
    onProgress?: (position: string | undefined, elapsedMs: number) => void | Promise<void>;
    signal?: AbortSignal;
  } = {},
): Promise<QueueOutcome> {
  const startedAt = Date.now();
  let lastPosition: string | undefined;
  let reportedPosition: string | undefined;
  let done = false;

  const progressLoop = (async () => {
    while (!done) {
      try {
        await sleepUntilNextPoll(config.queue.progressPollMs, hooks.signal);
      } catch {
        return; // aborted
      }
      if (done) return;

      lastPosition = await readQueuePosition(page, config);
      const elapsed = Date.now() - startedAt;

      if (lastPosition && lastPosition !== reportedPosition) {
        reportedPosition = lastPosition;
        log.info(`Queue position: ${lastPosition} (waiting ${formatDuration(elapsed)})`);
        await hooks.onProgress?.(lastPosition, elapsed);
      } else {
        log.debug(`Still queued (${formatDuration(elapsed)})`);
      }
    }
  })();

  let passed = false;
  try {
    await page.waitForURL((url) => !urlLooksLikeQueue(url.toString(), config), {
      timeout: config.queue.maxWaitMs,
      waitUntil: "domcontentloaded",
    });
    passed = true;
  } catch {
    // Either the wait ceiling was hit, or the queue never navigated us out via
    // a URL change. Re-check the DOM before calling it a failure: some rooms
    // swap content in place without changing the address.
    const state = await detectQueue(page, config);
    passed = !state.inQueue;
  } finally {
    done = true;
    await progressLoop.catch(() => undefined);
  }

  return {
    passed,
    finalUrl: page.url(),
    lastPosition,
    waitedMs: Date.now() - startedAt,
  };
}

export function formatDuration(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${s}s`;
  return `${s}s`;
}
