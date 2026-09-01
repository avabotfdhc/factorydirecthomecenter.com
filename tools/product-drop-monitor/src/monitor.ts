import type { Page } from "playwright";
import { launchSession, type Session } from "./browser.js";
import { addToCartAndProceed } from "./cart.js";
import { loadConfig, type Config } from "./config.js";
import { detectBlocker } from "./detectors/blocker.js";
import { detectQueue, formatDuration, waitOutQueue } from "./detectors/queue.js";
import { detectStock } from "./detectors/stock.js";
import { handOff } from "./handoff.js";
import { log } from "./logger.js";
import { NotifierHub } from "./notify/index.js";
import { checkRobots } from "./robots.js";
import { capture } from "./screenshot.js";
import { restoreState, saveState } from "./state.js";
import { AbortError, backoffMs, errorMessage, jitteredInterval, sleepUntilNextPoll } from "./util.js";

export interface MonitorOptions {
  headless?: boolean;
}

export async function runMonitor(options: MonitorOptions = {}): Promise<void> {
  const config = loadConfig();
  if (options.headless !== undefined) config.behavior.headless = options.headless;

  const notify = new NotifierHub(config.notify);
  log.info(`Notification channels: ${notify.channelNames.join(", ")}`);

  if (config.target.respectRobotsTxt) {
    const robots = await checkRobots(config.target.productUrl);
    if (!robots.allowed) {
      log.warn(`robots.txt: ${robots.reason}`);
      await notify.warn(
        "robots.txt disallows this path",
        `${robots.reason}. Polling anyway is your call — set target.respectRobotsTxt to false to silence this.`,
        { url: config.target.productUrl },
      );
    } else {
      log.debug(`robots.txt: ${robots.reason}`);
    }
  }

  const controller = new AbortController();
  const onSignal = () => {
    log.info("Shutting down…");
    controller.abort();
  };
  process.once("SIGINT", onSignal);
  process.once("SIGTERM", onSignal);

  let session: Session | undefined;

  try {
    session = await launchSession(config);
    await restoreState(session.context, config);

    await notify.info(
      "Monitor started",
      `Watching ${config.target.name}. Checking about every ${Math.round(config.target.pollIntervalMs / 1000)}s.`,
      { url: config.target.productUrl, fields: { Mode: config.behavior.headless ? "headless" : "headed" } },
    );

    await pollLoop(session, config, notify, controller.signal);
  } catch (err) {
    if (err instanceof AbortError) {
      log.info("Stopped by user.");
      return;
    }
    await handleFatal(err, session?.page, config, notify);
  } finally {
    if (session && !config.behavior.headless) {
      // Persist whatever the session picked up before the process ends.
      await saveState(session.context, config).catch(() => undefined);
    }
    await session?.close();
  }
}

async function pollLoop(
  session: Session,
  config: Config,
  notify: NotifierHub,
  signal: AbortSignal,
): Promise<void> {
  const { page } = session;
  let cycle = 0;
  let consecutiveErrors = 0;
  let announcedQueue = false;

  for (;;) {
    if (signal.aborted) throw new AbortError();
    cycle += 1;

    try {
      log.info(`[cycle ${cycle}] Loading ${config.target.productUrl}`);
      const response = await page.goto(config.target.productUrl, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("domcontentloaded");

      const status = response?.status();

      // Rate limiting is the site telling us plainly to slow down. Honour it.
      if (status === 429 || status === 503) {
        const retryAfter = Number(response?.headers()["retry-after"]);
        const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter * 1000
          : backoffMs(++consecutiveErrors, config.target.pollIntervalMs);
        log.warn(`HTTP ${status} — backing off ${formatDuration(waitMs)}`);
        await notify.warn(
          "Rate limited",
          `The site returned HTTP ${status}. Backing off ${formatDuration(waitMs)} before the next check.`,
          { url: page.url() },
        );
        await sleepUntilNextPoll(waitMs, signal);
        continue;
      }

      // 1. Challenge / hard block — stop touching the site and get the human.
      const blocker = await detectBlocker(page, config);
      if (blocker.blocked) {
        const shot = await capture(page, config, "blocked");
        await notify.error(
          "Blocked — needs you",
          `Hit a CAPTCHA or bot challenge (${blocker.evidence}). Not attempting to solve it. ` +
            `The browser is held open — solve it and the monitor picks back up.`,
          { url: page.url(), screenshotPath: shot },
        );
        await handOff(page, config, "CAPTCHA / challenge");
        consecutiveErrors = 0;
        continue;
      }

      // 2. Virtual waiting room — hold the slot, never refresh.
      const queue = await detectQueue(page, config);
      if (queue.inQueue) {
        if (!announcedQueue) {
          announcedQueue = true;
          const shot = await capture(page, config, "queue-entered");
          await notify.info(
            "In the queue",
            `Entered a virtual waiting room (${queue.evidence}). Holding the slot — not refreshing.`,
            { url: page.url(), screenshotPath: shot },
          );
        }

        const outcome = await waitOutQueue(page, config, {
          signal,
          onProgress: (position, elapsed) =>
            notify.info("Queue progress", `Position: ${position ?? "unknown"} · waiting ${formatDuration(elapsed)}`, {
              url: page.url(),
            }),
        });

        if (!outcome.passed) {
          const shot = await capture(page, config, "queue-timeout");
          await notify.warn(
            "Still queued",
            `Hit the ${formatDuration(config.queue.maxWaitMs)} queue ceiling without getting through. ` +
              `Last position: ${outcome.lastPosition ?? "unknown"}. Restarting the cycle.`,
            { url: page.url(), screenshotPath: shot },
          );
          announcedQueue = false;
          continue;
        }

        const shot = await capture(page, config, "queue-passed");
        await notify.urgent(
          "THROUGH THE QUEUE",
          `Out of the waiting room after ${formatDuration(outcome.waitedMs)}. Checking stock now.`,
          { url: outcome.finalUrl, screenshotPath: shot },
        );
        announcedQueue = false;
        await saveState(session.context, config).catch(() => undefined);
      }

      // 3. Stock.
      const stock = await detectStock(page, config);
      log.info(`[cycle ${cycle}] Stock: ${stock.status} (${stock.evidence})`);
      consecutiveErrors = 0;

      if (stock.status === "in-stock") {
        await onStockFound(session, config, notify);
        return;
      }

      if (stock.status === "unknown") {
        log.warn("Could not determine stock state — check your selectors with `npm run probe`.");
        if (cycle === 1) {
          const shot = await capture(page, config, "stock-unknown");
          await notify.warn(
            "Can't read stock state",
            "No configured selector or phrase matched on the first check. Verify your selectors — " +
              "the monitor will keep trying, but it may be blind.",
            { url: page.url(), screenshotPath: shot, fields: { Evidence: stock.evidence } },
          );
        }
      }
    } catch (err) {
      if (err instanceof AbortError) throw err;

      consecutiveErrors += 1;
      log.error(`[cycle ${cycle}] Failed: ${errorMessage(err)}`);

      if (consecutiveErrors >= config.behavior.maxConsecutiveErrors) {
        const shot = await capture(page, config, "repeated-failure");
        await notify.error(
          "Monitor is stuck",
          `${consecutiveErrors} checks in a row failed. Latest: ${errorMessage(err)}`,
          { url: page.url(), screenshotPath: shot },
        );
        await handOff(page, config, `${consecutiveErrors} consecutive failures`);
        consecutiveErrors = 0;
        continue;
      }

      const waitMs = backoffMs(consecutiveErrors, config.target.pollIntervalMs);
      log.warn(`Backing off ${formatDuration(waitMs)} (failure ${consecutiveErrors})`);
      await sleepUntilNextPoll(waitMs, signal);
      continue;
    }

    const waitMs = jitteredInterval(config.target.pollIntervalMs, config.target.jitterMs);
    log.debug(`Next check in ${formatDuration(waitMs)}`);
    await sleepUntilNextPoll(waitMs, signal);
  }
}

async function onStockFound(session: Session, config: Config, notify: NotifierHub): Promise<void> {
  const { page } = session;

  const foundShot = await capture(page, config, "in-stock");
  await notify.urgent("IN STOCK", `${config.target.name} is available. Going for the cart.`, {
    url: page.url(),
    screenshotPath: foundShot,
  });

  if (!config.behavior.autoAddToCart) {
    await handOff(page, config, "in stock (autoAddToCart is off)");
    return;
  }

  try {
    const result = await addToCartAndProceed(page, config);
    await saveState(session.context, config).catch(() => undefined);
    const shot = await capture(page, config, result.stage);

    if (result.stage === "at-checkout") {
      await notify.urgent(
        "🛒 AT CHECKOUT — GO NOW",
        `${config.target.name} is in the cart and the checkout page is open and logged in. ` +
          `Stopping here: confirm payment yourself. The browser is waiting for you.`,
        { url: result.url, screenshotPath: shot },
      );
    } else {
      await notify.urgent(
        "🛒 IN THE CART",
        `${config.target.name} is in the cart. Take it from here.`,
        { url: result.url, screenshotPath: shot },
      );
    }

    await handOff(page, config, "checkout ready");
  } catch (err) {
    const shot = await capture(page, config, "cart-failed");
    await notify.error(
      "Cart flow failed — it's in stock, go manually",
      `Found stock but couldn't complete the cart steps: ${errorMessage(err)}. ` +
        `The browser is open and logged in on the page — take over now.`,
      { url: page.url(), screenshotPath: shot },
    );
    await handOff(page, config, "cart flow failed");
  }
}

async function handleFatal(
  err: unknown,
  page: Page | undefined,
  config: Config,
  notify: NotifierHub,
): Promise<void> {
  log.error(`Fatal: ${errorMessage(err)}`);
  const shot = page ? await capture(page, config, "fatal") : undefined;
  await notify
    .error("Monitor crashed", errorMessage(err), { url: page?.url(), screenshotPath: shot })
    .catch(() => undefined);
  if (page) await handOff(page, config, "fatal error").catch(() => undefined);
}
