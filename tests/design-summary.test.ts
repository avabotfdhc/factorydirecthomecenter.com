// A buyer's design copy (src/lib/design-summary.ts, src/lib/design-summary-send.ts):
// the picks travel intact, nothing the catalogue does not offer gets into a
// copy, the copy carries the dealership's details, and nothing is sent until
// every lead question is answered.
//
// No network: fetch is replaced while the send tests run.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { BUSINESS, SITE_URL } from "../src/lib/business";
import { exteriorCatalog } from "../src/lib/exterior-options";
import { localFloorPlans } from "../src/lib/local-floor-plans";
import {
  SMS_CONSENT_TEXT,
  decodeDesign,
  designLines,
  emptyPicks,
  encodeDesign,
  missingForCopy,
  sanitizePicks,
  toE164,
} from "../src/lib/design-summary";
import { buildDesignCopy, buildDesignEmail, buildDesignSms, hoursLine, sendDesignCopy } from "../src/lib/design-summary-send";

const prime = exteriorCatalog("Prime", "Single Wide", 16);
const aspire = exteriorCatalog("Aspire", "Multi-Section", 28);
const home = localFloorPlans.find((p) => !p.hidden)!.slug;

const contact = {
  firstName: "Dana",
  lastName: "Buyer",
  email: "dana@example.com",
  phone: "(260) 555-0101",
  financingStatus: "Financing",
  landStatus: "I own my land",
  timeframe: "1–3 months",
};

test("a design survives the trip through a URL", () => {
  const picks = {
    ...emptyPicks(home),
    siding: aspire.siding[1].label,
    upgrades: aspire.upgrades ? ["Electric fireplace"] : [],
    door: (aspire.doors[1] || aspire.doors[0]).id as never,
    blackPackage: aspire.blackPackage,
    foundation: "skirting" as const,
  };
  const encoded = encodeDesign(picks);
  assert.match(encoded, /^[A-Za-z0-9_-]+$/, "URL-safe");
  assert.deepEqual(sanitizePicks(decodeDesign(encoded)!, aspire), picks);
});

test("garbage never decodes", () => {
  for (const bad of ["", "%%%", "not base64!", "e30", "W10", "a".repeat(3000)]) assert.equal(decodeDesign(bad), null, bad);
});

test("picks the home's board does not offer are dropped", () => {
  const raw = { home, siding: "Hot Pink", shingle: prime.shingles[0].label, upgrades: ["Electric fireplace"], dormer: "anything", kitchen: "<script>", blackPackage: true, trim: "lineals" };
  const p = sanitizePicks(raw, prime);
  assert.equal(p.siding, "", "not a Prime colour");
  assert.equal(p.shingle, prime.shingles[0].label);
  assert.deepEqual(p.upgrades, [], "Prime has no upgrade list");
  assert.equal(p.dormer, "");
  assert.equal(p.kitchen, "");
  assert.equal(p.blackPackage, false);
  assert.equal(p.trim, "shutters");
});

test("a copy needs every lead answer: name, email, phone, cash or finance, land or community, time frame", () => {
  assert.deepEqual(missingForCopy(contact), []);
  assert.deepEqual(missingForCopy({}), ["first name", "last name", "email", "phone", "cash or financing", "land or community", "time frame"]);
  assert.deepEqual(missingForCopy({ ...contact, phone: "555-0101" }), ["phone"]);
  assert.deepEqual(missingForCopy({ ...contact, landStatus: " " }), ["land or community"]);
});

test("US phone numbers become E.164", () => {
  assert.equal(toE164("(260) 555-0101"), "+12605550101");
  assert.equal(toE164("1-260-555-0101"), "+12605550101");
  assert.equal(toE164("555-0101"), null);
});

test("the buyer's list leaves out the sales-only line", () => {
  const picks = { ...emptyPicks(home), siding: prime.siding[0].label };
  const elevation = { src: "sheet", model: "X" } as never;
  const sales = designLines({ home: undefined, catalog: prime, picks, elevation, audience: "sales" });
  const buyer = designLines({ home: undefined, catalog: prime, picks, elevation, audience: "buyer" });
  assert.ok(sales.some((l) => l.startsWith("Exterior preview:")));
  assert.ok(!buyer.some((l) => l.startsWith("Exterior preview:")));
  assert.ok(buyer.includes(`Siding color: ${prime.siding[0].label} (Prime)`));
});

test("the email carries the design, the floor plan, the choices and the dealership's details, escaped", async () => {
  const copy = (await buildDesignCopy("<b>Dana</b>", { ...emptyPicks(home) }, "https://preview.example"))!;
  assert.ok(copy, "a catalogue home builds a copy");
  assert.ok(copy.imageUrl?.startsWith("https://preview.example/api/design-summary/image?d="));
  assert.equal(copy.planUrl, `${SITE_URL}/floor-plans/${home}`);
  const { subject, html, text } = buildDesignEmail({ ...copy, floorPlanUrl: "https://preview.example/api/design-summary/floor-plan?home=x" });
  assert.ok(subject.includes(copy.home.name) && subject.includes(BUSINESS.name));
  for (const s of [BUSINESS.name, BUSINESS.streetAddress, BUSINESS.city, BUSINESS.postalCode, BUSINESS.phoneDisplay, "factorydirecthomescenter.com", hoursLine()]) {
    assert.ok(html.includes(s.replace(/&/g, "&amp;")), `html missing ${s}`);
    assert.ok(text.includes(s), `text missing ${s}`);
  }
  assert.ok(html.includes(copy.imageUrl!.replace(/&/g, "&amp;")));
  assert.ok(html.includes("Floor plan"));
  assert.ok(!html.includes("<b>Dana</b>") && html.includes("&lt;b&gt;Dana&lt;/b&gt;"), "the name is escaped");
  assert.ok(!/\$\s?\d/.test(html), "no prices in the copy");
});

test("a home we do not sell builds no copy", async () => {
  assert.equal(await buildDesignCopy("Dana", { home: "not-a-home" }, "https://x"), null);
});

test("the text says who it is from, how to reach us, and how to stop", async () => {
  const copy = (await buildDesignCopy("Dana", { ...emptyPicks(home) }, "https://x"))!;
  const sms = buildDesignSms(copy);
  assert.ok(sms.startsWith(`${BUSINESS.name}:`));
  assert.ok(sms.includes(BUSINESS.phoneDisplay) && sms.includes(BUSINESS.streetAddress));
  assert.ok(sms.includes("Reply STOP to opt out."));
  assert.ok(sms.length < 1600, "fits one Twilio message");
});

test("the consent sentence names the dealership and how to stop", () => {
  assert.match(SMS_CONSENT_TEXT, /Factory Direct Homes Center/);
  assert.match(SMS_CONSENT_TEXT, /Reply STOP/);
  assert.match(SMS_CONSENT_TEXT, /not a condition of purchase/);
  const designer = readFileSync("src/components/HomeDesigner.tsx", "utf8");
  assert.match(designer, /useState\(false\);\n\s*const \[copySent/, "the text box starts unticked");
  assert.match(designer, /smsConsent: copySms/);
});

async function withFetch<T>(fn: (calls: { url: string; init: RequestInit }[]) => Promise<T>): Promise<T> {
  const calls: { url: string; init: RequestInit }[] = [];
  const real = globalThis.fetch;
  globalThis.fetch = (async (url: string | URL, init: RequestInit = {}) => {
    calls.push({ url: String(url), init });
    return new Response("{}", { status: 200 });
  }) as typeof fetch;
  try {
    return await fn(calls);
  } finally {
    globalThis.fetch = real;
  }
}

const env = {
  RESEND_API_KEY: "re_test",
  TWILIO_ACCOUNT_SID: "AC_test",
  TWILIO_AUTH_TOKEN: "tok",
  TWILIO_FROM_NUMBER: "+12605550000",
} as unknown as NodeJS.ProcessEnv;

test("nothing is sent while a lead answer is missing", async () => {
  await withFetch(async (calls) => {
    const r = await sendDesignCopy({ contact: { ...contact, timeframe: "" }, rawDesign: { home }, request: { email: true, sms: true }, smsConsent: true, origin: "https://x", env });
    assert.deepEqual(r, { email: "incomplete", sms: "incomplete" });
    assert.equal(calls.length, 0);
  });
});

test("a complete request emails and texts the buyer's own address and number, once each", async () => {
  await withFetch(async (calls) => {
    const r = await sendDesignCopy({ contact, rawDesign: { home }, request: { email: true, sms: true }, smsConsent: true, origin: "https://x", env });
    assert.deepEqual(r, { email: "sent", sms: "sent" });
    const mail = calls.filter((c) => c.url === "https://api.resend.com/emails");
    const sms = calls.filter((c) => c.url.startsWith("https://api.twilio.com/"));
    assert.equal(mail.length, 1);
    assert.equal(sms.length, 1);
    const body = JSON.parse(String(mail[0].init.body));
    assert.equal(body.to, contact.email);
    assert.equal(body.reply_to, BUSINESS.email);
    const form = new URLSearchParams(String(sms[0].init.body));
    assert.equal(form.get("To"), "+12605550101");
    assert.equal(form.get("From"), "+12605550000");
    assert.ok(form.getAll("MediaUrl").some((u) => u.startsWith("https://x/api/design-summary/image?d=")));
  });
});

test("no text without the consent box, and nothing at all when not asked", async () => {
  await withFetch(async (calls) => {
    const r = await sendDesignCopy({ contact, rawDesign: { home }, request: { email: false, sms: true }, smsConsent: false, origin: "https://x", env });
    assert.deepEqual(r, { email: "not-requested", sms: "incomplete" });
    const none = await sendDesignCopy({ contact, rawDesign: { home }, request: { email: false, sms: false }, smsConsent: true, origin: "https://x", env });
    assert.deepEqual(none, { email: "not-requested", sms: "not-requested" });
    assert.equal(calls.length, 0);
  });
});

test("a provider failure is reported, not thrown", async () => {
  const real = globalThis.fetch;
  globalThis.fetch = (async () => new Response("nope", { status: 500 })) as typeof fetch;
  const origError = console.error;
  console.error = () => {};
  try {
    const r = await sendDesignCopy({ contact, rawDesign: { home }, request: { email: true, sms: true }, smsConsent: true, origin: "https://x", env });
    assert.deepEqual(r, { email: "failed", sms: "failed" });
  } finally {
    globalThis.fetch = real;
    console.error = origError;
  }
});
