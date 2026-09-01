import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const TargetSchema = z.object({
  name: z.string().min(1),
  productUrl: z.url(),
  /**
   * Floor is deliberately 15s. This tool watches one product on one session;
   * hammering a storefront faster than this is abusive and is the fastest way
   * to get the IP and the account blocked outright.
   */
  pollIntervalMs: z.number().int().min(15_000).default(60_000),
  jitterMs: z.number().int().min(0).default(15_000),
  navigationTimeoutMs: z.number().int().min(5_000).default(45_000),
  respectRobotsTxt: z.boolean().default(true),
});

const SelectorsSchema = z.object({
  inStock: z.array(z.string()).default([]),
  outOfStock: z.array(z.string()).default([]),
  addToCart: z.string().min(1),
  cartConfirmation: z.string().min(1),
  goToCart: z.string().optional(),
  checkoutButton: z.string().optional(),
  checkoutConfirmation: z.string().min(1),
});

const StockTextSchema = z.object({
  inStock: z.array(z.string()).default([]),
  outOfStock: z.array(z.string()).default([]),
});

const QueueSchema = z.object({
  urlPatterns: z.array(z.string()).default([]),
  selectors: z.array(z.string()).default([]),
  positionSelector: z.string().optional(),
  progressPollMs: z.number().int().min(5_000).default(20_000),
  maxWaitMs: z.number().int().min(60_000).default(10_800_000),
});

const BlockersSchema = z.object({
  urlPatterns: z.array(z.string()).default([]),
  selectors: z.array(z.string()).default([]),
  bodyText: z.array(z.string()).default([]),
});

const BehaviorSchema = z.object({
  autoAddToCart: z.boolean().default(true),
  autoProceedToCheckout: z.boolean().default(true),
  pauseAtCheckout: z.boolean().default(true),
  headless: z.boolean().default(false),
  maxConsecutiveErrors: z.number().int().min(1).default(5),
});

const NotifySchema = z.object({
  discord: z
    .object({
      enabled: z.boolean().default(false),
      webhookUrl: z.string().default(""),
      mentionOnUrgent: z.string().default("@here"),
    })
    .default({ enabled: false, webhookUrl: "", mentionOnUrgent: "@here" }),
  slack: z
    .object({
      enabled: z.boolean().default(false),
      webhookUrl: z.string().default(""),
      botToken: z.string().default(""),
      channel: z.string().default(""),
    })
    .default({ enabled: false, webhookUrl: "", botToken: "", channel: "" }),
  sms: z
    .object({
      enabled: z.boolean().default(false),
      accountSid: z.string().default(""),
      authToken: z.string().default(""),
      from: z.string().default(""),
      to: z.string().default(""),
      urgentOnly: z.boolean().default(true),
    })
    .default({
      enabled: false,
      accountSid: "",
      authToken: "",
      from: "",
      to: "",
      urgentOnly: true,
    }),
});

const PathsSchema = z.object({
  userDataDir: z.string().default(".profile"),
  storageState: z.string().default(".auth/state.json"),
  artifacts: z.string().default("artifacts"),
});

export const ConfigSchema = z.object({
  target: TargetSchema,
  selectors: SelectorsSchema,
  stockText: StockTextSchema.default({ inStock: [], outOfStock: [] }),
  queue: QueueSchema.default({
    urlPatterns: [],
    selectors: [],
    progressPollMs: 20_000,
    maxWaitMs: 10_800_000,
  }),
  blockers: BlockersSchema.default({
    urlPatterns: [],
    selectors: [],
    bodyText: [],
  }),
  behavior: BehaviorSchema.default({
    autoAddToCart: true,
    autoProceedToCheckout: true,
    pauseAtCheckout: true,
    headless: false,
    maxConsecutiveErrors: 5,
  }),
  notify: NotifySchema.default({
    discord: { enabled: false, webhookUrl: "", mentionOnUrgent: "@here" },
    slack: { enabled: false, webhookUrl: "", botToken: "", channel: "" },
    sms: {
      enabled: false,
      accountSid: "",
      authToken: "",
      from: "",
      to: "",
      urgentOnly: true,
    },
  }),
  paths: PathsSchema.default({
    userDataDir: ".profile",
    storageState: ".auth/state.json",
    artifacts: "artifacts",
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

/** Resolve a config-relative path against the project root. */
export function projectPath(...segments: string[]): string {
  return resolve(PROJECT_ROOT, ...segments);
}

/**
 * Loads config.json from the project root. Override the filename with the
 * MONITOR_CONFIG env var (used by the fixture test run).
 */
export function loadConfig(file = process.env["MONITOR_CONFIG"] ?? "config.json"): Config {
  const path = projectPath(file);

  if (!existsSync(path)) {
    throw new Error(
      `No config found at ${path}.\n` +
        `Copy config.example.json to config.json and fill in your target URL, selectors, and webhook keys.`,
    );
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    throw new Error(`${path} is not valid JSON: ${(err as Error).message}`);
  }

  const parsed = ConfigSchema.safeParse(raw);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`${file} failed validation:\n${detail}`);
  }

  const config = parsed.data;

  // Cross-field checks the schema can't express on its own.
  if (config.behavior.autoProceedToCheckout && !config.selectors.checkoutButton) {
    throw new Error(
      "behavior.autoProceedToCheckout is true but selectors.checkoutButton is not set. " +
        "Set the selector, or turn autoProceedToCheckout off and stop at the cart.",
    );
  }

  const anyChannel =
    config.notify.discord.enabled ||
    config.notify.slack.enabled ||
    config.notify.sms.enabled;
  if (!anyChannel) {
    throw new Error(
      "No notification channel is enabled. The whole point of this tool is to reach you — " +
        "enable at least one of notify.discord, notify.slack, or notify.sms.",
    );
  }

  return config;
}
