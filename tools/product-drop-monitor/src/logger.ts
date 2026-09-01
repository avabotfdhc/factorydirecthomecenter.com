type Level = "debug" | "info" | "warn" | "error";

const COLORS: Record<Level, string> = {
  debug: "\x1b[90m",
  info: "\x1b[36m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
};
const RESET = "\x1b[0m";

const ORDER: Level[] = ["debug", "info", "warn", "error"];
const threshold = (process.env.LOG_LEVEL as Level) ?? "info";

function stamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function emit(level: Level, message: string, extra?: unknown): void {
  if (ORDER.indexOf(level) < ORDER.indexOf(threshold)) return;
  const line = `${COLORS[level]}[${stamp()}] ${level.toUpperCase().padEnd(5)}${RESET} ${message}`;
  const stream = level === "error" || level === "warn" ? console.error : console.log;
  if (extra === undefined) stream(line);
  else stream(line, extra);
}

export const log = {
  debug: (m: string, e?: unknown) => emit("debug", m, e),
  info: (m: string, e?: unknown) => emit("info", m, e),
  warn: (m: string, e?: unknown) => emit("warn", m, e),
  error: (m: string, e?: unknown) => emit("error", m, e),
  /** Loud separator so a state change is findable in a long scrollback. */
  banner: (m: string) => console.log(`\n\x1b[1m\x1b[35m${"=".repeat(64)}\n  ${m}\n${"=".repeat(64)}\x1b[0m\n`),
};
