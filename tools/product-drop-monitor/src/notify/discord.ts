import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import type { Config } from "../config.js";
import { SEVERITY_COLOR, SEVERITY_EMOJI, type Notifier, type NotifyEvent } from "./types.js";

export class DiscordNotifier implements Notifier {
  readonly name = "discord";

  constructor(private readonly cfg: Config["notify"]["discord"]) {}

  async send(event: NotifyEvent): Promise<void> {
    const embed = {
      title: `${SEVERITY_EMOJI[event.severity]}  ${event.title}`,
      description: event.message,
      color: SEVERITY_COLOR[event.severity],
      url: event.url,
      timestamp: new Date().toISOString(),
      fields: Object.entries(event.fields ?? {}).map(([name, value]) => ({
        name,
        value: value || "—",
        inline: true,
      })),
    };

    const payload: Record<string, unknown> = { embeds: [embed] };
    if (event.severity === "urgent" && this.cfg.mentionOnUrgent) {
      payload["content"] = this.cfg.mentionOnUrgent;
    }

    const form = new FormData();
    form.append("payload_json", JSON.stringify(payload));

    if (event.screenshotPath) {
      const buf = await readFile(event.screenshotPath);
      form.append(
        "files[0]",
        new Blob([new Uint8Array(buf)], { type: "image/png" }),
        basename(event.screenshotPath),
      );
    }

    const res = await fetch(this.cfg.webhookUrl, { method: "POST", body: form });
    if (!res.ok) {
      throw new Error(`Discord webhook returned ${res.status}: ${await res.text()}`);
    }
  }
}
