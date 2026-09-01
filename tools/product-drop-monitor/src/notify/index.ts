import type { Config } from "../config.js";
import { log } from "../logger.js";
import { errorMessage } from "../util.js";
import { DiscordNotifier } from "./discord.js";
import { SlackNotifier } from "./slack.js";
import { SmsNotifier } from "./sms.js";
import type { Notifier, NotifyEvent, Severity } from "./types.js";

export type { NotifyEvent, Severity } from "./types.js";

/**
 * Fans one event out to every enabled channel.
 *
 * A notifier that throws must never take the monitor down with it — a dead
 * Discord webhook is not a reason to abandon a drop. Failures are logged and
 * swallowed, and the send is best-effort across all channels in parallel.
 */
export class NotifierHub {
  private readonly channels: Notifier[] = [];

  constructor(cfg: Config["notify"]) {
    if (cfg.discord.enabled) this.channels.push(new DiscordNotifier(cfg.discord));
    if (cfg.slack.enabled) this.channels.push(new SlackNotifier(cfg.slack));
    if (cfg.sms.enabled) this.channels.push(new SmsNotifier(cfg.sms));
  }

  get channelNames(): string[] {
    return this.channels.map((c) => c.name);
  }

  async send(event: NotifyEvent): Promise<void> {
    log.info(`notify[${event.severity}] ${event.title} — ${event.message}`);

    const results = await Promise.allSettled(
      this.channels.map(async (channel) => {
        try {
          await channel.send(event);
        } catch (err) {
          throw new Error(`${channel.name}: ${errorMessage(err)}`);
        }
      }),
    );

    for (const result of results) {
      if (result.status === "rejected") {
        log.warn(`Notification channel failed: ${errorMessage(result.reason)}`);
      }
    }
  }

  info(title: string, message: string, extra: Partial<NotifyEvent> = {}) {
    return this.send({ severity: "info", title, message, ...extra });
  }
  warn(title: string, message: string, extra: Partial<NotifyEvent> = {}) {
    return this.send({ severity: "warn", title, message, ...extra });
  }
  urgent(title: string, message: string, extra: Partial<NotifyEvent> = {}) {
    return this.send({ severity: "urgent", title, message, ...extra });
  }
  error(title: string, message: string, extra: Partial<NotifyEvent> = {}) {
    return this.send({ severity: "error", title, message, ...extra });
  }
}
