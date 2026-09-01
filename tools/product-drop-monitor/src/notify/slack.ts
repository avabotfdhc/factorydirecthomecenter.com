import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";
import type { Config } from "../config.js";
import { SEVERITY_EMOJI, type Notifier, type NotifyEvent } from "./types.js";
import { log } from "../logger.js";

export class SlackNotifier implements Notifier {
  readonly name = "slack";

  constructor(private readonly cfg: Config["notify"]["slack"]) {}

  async send(event: NotifyEvent): Promise<void> {
    await this.postMessage(event);

    // Screenshots require a bot token; an incoming webhook alone cannot upload
    // files. If no token is configured we still delivered the text — that is a
    // degraded send, not a failure, so it is logged rather than thrown.
    if (event.screenshotPath) {
      if (this.cfg.botToken && this.cfg.channel) {
        await this.uploadScreenshot(event.screenshotPath, event.title);
      } else {
        log.debug("Slack: screenshot not uploaded (no botToken/channel configured)");
      }
    }
  }

  private async postMessage(event: NotifyEvent): Promise<void> {
    const lines = [
      `${SEVERITY_EMOJI[event.severity]}  *${event.title}*`,
      event.message,
      ...Object.entries(event.fields ?? {}).map(([k, v]) => `• *${k}:* ${v || "—"}`),
      ...(event.url ? [`<${event.url}|Open page>`] : []),
    ];
    const text = lines.join("\n");

    if (this.cfg.webhookUrl) {
      const res = await fetch(this.cfg.webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        throw new Error(`Slack webhook returned ${res.status}: ${await res.text()}`);
      }
      return;
    }

    if (this.cfg.botToken && this.cfg.channel) {
      await this.api("chat.postMessage", { channel: this.cfg.channel, text });
      return;
    }

    throw new Error("Slack is enabled but neither webhookUrl nor botToken+channel is set.");
  }

  /** Slack's external-upload flow: reserve a URL, PUT the bytes, then finalize. */
  private async uploadScreenshot(path: string, title: string): Promise<void> {
    const { size } = await stat(path);
    const filename = basename(path);

    const reserved = await this.api<{ upload_url: string; file_id: string }>(
      "files.getUploadURLExternal",
      { filename, length: String(size) },
      "form",
    );

    const body = new FormData();
    body.append(
      "file",
      new Blob([new Uint8Array(await readFile(path))], { type: "image/png" }),
      filename,
    );
    const put = await fetch(reserved.upload_url, { method: "POST", body });
    if (!put.ok) throw new Error(`Slack file upload returned ${put.status}`);

    await this.api("files.completeUploadExternal", {
      files: [{ id: reserved.file_id, title }],
      channel_id: this.cfg.channel,
    });
  }

  private async api<T = unknown>(
    method: string,
    payload: Record<string, unknown>,
    encoding: "json" | "form" = "json",
  ): Promise<T> {
    const init: RequestInit = {
      method: "POST",
      headers: { authorization: `Bearer ${this.cfg.botToken}` },
    };

    if (encoding === "form") {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(payload)) params.set(k, String(v));
      init.body = params;
    } else {
      init.headers = { ...init.headers, "content-type": "application/json; charset=utf-8" };
      init.body = JSON.stringify(payload);
    }

    const res = await fetch(`https://slack.com/api/${method}`, init);
    const json = (await res.json()) as { ok: boolean; error?: string } & Record<string, unknown>;
    if (!json.ok) throw new Error(`Slack ${method} failed: ${json.error ?? res.status}`);
    return json as T;
  }
}
