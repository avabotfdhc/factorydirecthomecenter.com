export type Severity = "info" | "warn" | "urgent" | "error";

export interface NotifyEvent {
  severity: Severity;
  title: string;
  message: string;
  /** Page URL at the moment of the event, if there is one. */
  url?: string;
  /** Absolute path to a screenshot to attach, if one was captured. */
  screenshotPath?: string;
  /** Extra key/value context rendered as fields. */
  fields?: Record<string, string>;
}

export interface Notifier {
  readonly name: string;
  send(event: NotifyEvent): Promise<void>;
}

export const SEVERITY_COLOR: Record<Severity, number> = {
  info: 0x3b82f6,
  warn: 0xf59e0b,
  urgent: 0x22c55e,
  error: 0xef4444,
};

export const SEVERITY_EMOJI: Record<Severity, string> = {
  info: "ℹ️",
  warn: "⚠️",
  urgent: "🚨",
  error: "💥",
};
