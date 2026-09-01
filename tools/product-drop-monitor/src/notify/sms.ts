import type { Config } from "../config.js";
import { SEVERITY_EMOJI, type Notifier, type NotifyEvent } from "./types.js";
import { truncate } from "../util.js";

/**
 * Twilio SMS. Text has no attachments, so the screenshot is referenced by the
 * local path it was written to rather than sent — the richer channels carry the
 * image, this one carries the interrupt.
 */
export class SmsNotifier implements Notifier {
  readonly name = "sms";

  constructor(private readonly cfg: Config["notify"]["sms"]) {}

  async send(event: NotifyEvent): Promise<void> {
    if (this.cfg.urgentOnly && event.severity !== "urgent" && event.severity !== "error") {
      return;
    }

    const parts = [
      `${SEVERITY_EMOJI[event.severity]} ${event.title}`,
      event.message,
      event.url,
    ].filter(Boolean) as string[];

    const body = truncate(parts.join("\n"), 1500);

    const params = new URLSearchParams({
      To: this.cfg.to,
      From: this.cfg.from,
      Body: body,
    });

    const auth = Buffer.from(`${this.cfg.accountSid}:${this.cfg.authToken}`).toString("base64");

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(this.cfg.accountSid)}/Messages.json`,
      {
        method: "POST",
        headers: {
          authorization: `Basic ${auth}`,
          "content-type": "application/x-www-form-urlencoded",
        },
        body: params,
      },
    );

    if (!res.ok) {
      throw new Error(`Twilio returned ${res.status}: ${truncate(await res.text(), 400)}`);
    }
  }
}
