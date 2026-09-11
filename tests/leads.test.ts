// Lead pipeline tests: /api/leads → DealerTide, against a scripted mock of
// DealerTide's POST /leads. No network, no real CRM, no Supabase, no Resend.
//
//   npm test
//
// Env is set BEFORE the route module loads, because the route reads
// RESEND_API_KEY / LEAD_EMAIL_TO / GOOGLE_* at module scope.

import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

type Step = { status: number; body?: string } | "hang";
let plan: Step[] = [];
const received: { body: Record<string, unknown>; headers: http.IncomingHttpHeaders }[] = [];
let server: http.Server;
let logs: string[] = [];

const origLog = console.log, origError = console.error;
function captureConsole() {
  logs = [];
  console.log = (...a: unknown[]) => { logs.push(a.map(String).join(" ")); };
  console.error = (...a: unknown[]) => { logs.push(a.map(String).join(" ")); };
}
function restoreConsole() { console.log = origLog; console.error = origError; }
const logged = (needle: string) => logs.some((l) => l.includes(needle));

let pushLeadToDealertide: typeof import("../src/lib/dealertide").pushLeadToDealertide;
let NO_EMAIL_PLACEHOLDER: string;
let spamVerdict: typeof import("../src/lib/anti-spam").spamVerdict;
let MIN_FILL_MS: number;
let POST: typeof import("../src/app/api/leads/route").POST;

before(async () => {
  server = http.createServer((req, res) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      received.push({ body: JSON.parse(raw || "{}"), headers: req.headers });
      const step = plan.shift();
      if (step === "hang" || step === undefined) return;
      res.writeHead(step.status, { "Content-Type": "application/json" });
      res.end(step.body ?? "{}");
    });
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()));
  const port = (server.address() as { port: number }).port;

  process.env.DEALERTIDE_API_BASE = `http://127.0.0.1:${port}`;
  process.env.DEALERTIDE_API_KEY = "test-key-not-real";
  for (const k of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY",
                   "RESEND_API_KEY", "GOOGLE_SHEETS_ID", "GOOGLE_SERVICE_ACCOUNT_KEY"]) {
    delete process.env[k];
  }

  ({ pushLeadToDealertide, NO_EMAIL_PLACEHOLDER } = await import("../src/lib/dealertide"));
  ({ spamVerdict, MIN_FILL_MS } = await import("../src/lib/anti-spam"));
  ({ POST } = await import("../src/app/api/leads/route"));
});
after(() => { server.close(); restoreConsole(); });
beforeEach(() => { received.length = 0; plan = []; captureConsole(); });

const base = { first_name: "Test", last_name: "Lead", phone: "2605551234" };
const post = (b: object) =>
  POST(new Request("http://x/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }));

// ── pushLeadToDealertide ─────────────────────────────────────────────────────
test("retries once on 5xx and succeeds", async () => {
  plan = [{ status: 503 }, { status: 201 }];
  const r = await pushLeadToDealertide({ ...base, email: "a@b.co" });
  assert.equal(r.ok, true); assert.equal(r.status, 201); assert.equal(r.attempts, 2);
});
test("4xx is not retried and the body is in detail", async () => {
  plan = [{ status: 422, body: '{"error":"phone is invalid"}' }];
  const r = await pushLeadToDealertide(base);
  assert.equal(r.ok, false); assert.equal(r.status, 422); assert.equal(r.attempts, 1);
  assert.match(r.detail, /phone is invalid/);
});
test("202 counts as delivered, flagged as duplicate", async () => {
  plan = [{ status: 202 }];
  const r = await pushLeadToDealertide(base);
  assert.equal(r.ok, true); assert.equal(r.status, 202); assert.match(r.detail, /duplicate/);
});
test("placeholder email is never sent; a real one is sent trimmed; key never in payload", async () => {
  plan = [{ status: 201 }];
  await pushLeadToDealertide({ ...base, email: NO_EMAIL_PLACEHOLDER });
  assert.ok(!("email" in received[0].body));
  plan = [{ status: 201 }]; received.length = 0;
  await pushLeadToDealertide({ ...base, email: "  Real@Example.com " });
  assert.equal(received[0].body.email, "Real@Example.com");
  assert.ok(!JSON.stringify(received[0].body).includes("test-key"));
});
test("no response → retry → give up, bounded well under maxDuration", async () => {
  plan = ["hang", "hang"];
  const t = Date.now();
  const r = await pushLeadToDealertide(base);
  const ms = Date.now() - t;
  assert.equal(r.ok, false); assert.equal(r.status, null); assert.equal(r.attempts, 2);
  assert.match(r.detail, /no response within/);
  assert.ok(ms < 16_000, `took ${ms}ms`);
});

// ── spamVerdict ──────────────────────────────────────────────────────────────
test("spamVerdict: honeypot, too-fast, and the allowed cases", () => {
  assert.equal(spamVerdict({ hp: "http://spam.example" }), "honeypot");
  assert.equal(spamVerdict({ website: "x" }), "honeypot");
  assert.equal(spamVerdict({ hp: "", fillMs: 300 }), "too-fast");
  assert.equal(spamVerdict({ hp: "", fillMs: MIN_FILL_MS }), null);
  assert.equal(spamVerdict({ hp: "", fillMs: 45_000 }), null);
  assert.equal(spamVerdict({}), null, "no signals at all is allowed (server action, chat)");
  assert.equal(spamVerdict({ fillMs: "not-a-number" }), null);
});

// ── /api/leads route ─────────────────────────────────────────────────────────
test("route accepts phone-only and assembles the DealerTide message", async () => {
  plan = [{ status: 201 }];
  const res = await post({ firstName: "Beth", lastName: "Cartwright", phone: "260-555-0100", interest: "Lincoln 2856H32171",
    deliveryState: "Indiana", timeframe: "0-3 months", financingStatus: "Finance", message: "Call after 5",
    source: "Sale Claim", pageUrl: "/homes-on-sale/x", fillMs: 9000 });
  assert.equal(res.status, 200);
  const m = String(received[0].body.message);
  for (const s of ["Form: Sale Claim", "Interest: Lincoln 2856H32171", "Delivery: Indiana", "Timeframe: 0-3 months", "Financing: Finance", "Message: Call after 5"]) {
    assert.ok(m.includes(s), `message missing ${s}`);
  }
  assert.ok(!("email" in received[0].body));
  for (const k of ["first_name", "last_name", "phone", "source", "message", "page_url"]) assert.ok(k in received[0].body, k);
  assert.ok(logged("DealerTide accepted (201 created, attempt 1)"));
});
test("route strips the placeholder email before DealerTide", async () => {
  plan = [{ status: 201 }];
  const res = await post({ firstName: "A", lastName: "B", phone: "2605550000", email: NO_EMAIL_PLACEHOLDER });
  assert.equal(res.status, 200); assert.ok(!("email" in received[0].body));
});
test("route rejects a lead with no contact method, sends nothing", async () => {
  plan = [{ status: 201 }];
  const res = await post({ firstName: "A", lastName: "B" });
  assert.equal(res.status, 400); assert.equal(received.length, 0);
});
test("skipStore=true still delivers to DealerTide", async () => {
  plan = [{ status: 201 }];
  const res = await post({ firstName: "A", lastName: "B", phone: "2605550000", skipStore: true });
  assert.equal(res.status, 200); assert.equal(received.length, 1);
});
test("honeypot filled → 200, nothing forwarded, logged as spam", async () => {
  plan = [{ status: 201 }];
  const res = await post({ firstName: "Bot", lastName: "Net", phone: "0000000000", hp: "http://casino.example" });
  assert.equal(res.status, 200); assert.equal(received.length, 0);
  assert.ok(logged("Dropped as spam (honeypot)"));
});
test("submitted too fast → 200, nothing forwarded, logged as spam", async () => {
  plan = [{ status: 201 }];
  const res = await post({ firstName: "Bot", lastName: "Net", phone: "0000000000", hp: "", fillMs: 120 });
  assert.equal(res.status, 200); assert.equal(received.length, 0);
  assert.ok(logged("Dropped as spam (too-fast)"));
});
test("no anti-spam signals at all is still accepted (server action / chat path)", async () => {
  plan = [{ status: 201 }];
  const res = await post({ firstName: "Ava", lastName: "Chat", phone: "2605550000" });
  assert.equal(res.status, 200); assert.equal(received.length, 1);
});
test("no request is made to the retired legacy CMS", async () => {
  plan = [{ status: 201 }];
  await post({ firstName: "A", lastName: "B", phone: "2605550000" });
  assert.ok(!logged("CMS channel failed"), "no failing CMS request should be made");
});
test("DealerTide failure is logged with the reason and does not break the response", async () => {
  plan = [{ status: 500, body: '{"error":"boom"}' }, { status: 500, body: '{"error":"boom"}' }];
  const res = await post({ firstName: "A", lastName: "B", phone: "2605550000" });
  assert.equal(res.status, 200);
  assert.ok(logged("DealerTide channel failed after 2 attempt(s): HTTP 500"));
  assert.ok(!logged("Problem alert emailed"), "no RESEND_API_KEY → alert is skipped silently");
});
