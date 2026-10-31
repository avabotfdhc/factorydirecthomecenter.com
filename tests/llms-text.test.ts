// /llms.txt is generated from the same modules as the pages (src/lib/llms-text.ts).
// The static file it replaced carried, on 2026-10-29, the old address spelling,
// "20 miles", "largest factory", the retired Paramount series, four
// "financing partners", "no dealership markup" and "referral list" — each a
// claim the rest of the site is tested against. These tests keep the generated
// text inside the same rules, and keep a static copy from shadowing the route.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { buildLlmsText } from "../src/lib/llms-text";
import { BUSINESS } from "../src/lib/business";
import { LENDERS } from "../src/lib/lenders";

const text = buildLlmsText();

test("no static llms.txt or mcp.json shadows the generated route", () => {
  assert.ok(!existsSync("public/llms.txt"), "public/llms.txt would be served instead of src/app/llms.txt/route.ts");
  assert.ok(!existsSync("public/.well-known/mcp.json"), "the hand-written mcp.json carried prices and six states; do not bring it back");
});

test("the address, phones and service area are the ones business.ts publishes", () => {
  assert.ok(text.includes(`${BUSINESS.streetAddress}, ${BUSINESS.city}`));
  const addressLine = text.split("\n").find((l) => l.startsWith("- Address:")) ?? "";
  assert.ok(!/State Road|SR-8|State Rd/.test(addressLine), "one spelling of the address: 1211 IN-8");
  assert.ok(text.includes(BUSINESS.phoneDisplay) && text.includes(BUSINESS.smsDisplay));
  for (const s of BUSINESS.states) assert.ok(text.includes(s));
  assert.ok(!/Wisconsin|Illinois|Kentucky/.test(text), "the service area is BUSINESS.states only");
});

test("no dollar figure, price floor or distance claim the site does not make", () => {
  assert.ok(!/\$\s?\d/.test(text), "no dollar figures");
  assert.ok(!/\b\d+K\b/.test(text), "no price floors");
  assert.ok(!/\b20[ -]?mi/.test(text), "the plant is 30 miles away, not 20");
  assert.ok(!/largest[^.\n]{0,40}(plant|factory|facility)/i.test(text), "never 'largest plant'");
});

test("names every lender or none, and never calls them partners", () => {
  const named = LENDERS.filter((l) => text.includes(l.name)).length;
  assert.ok(named === 0 || named === LENDERS.length, `${named} of ${LENDERS.length} lenders named`);
  assert.ok(!/financing partners|lending partners/i.test(text));
  assert.ok(!/referral/i.test(text), "no 'referral' — it is a contractor list, not a referral");
  assert.ok(!/no (dealer(ship)?|retail|hidden) markup|no middleman/i.test(text));
});

test("the retired Paramount series is not offered as a live lineup", () => {
  assert.ok(!/Paramount Series[^.\n]*(lineup|models)/i.test(text));
  assert.ok(text.includes("/series/redman"), "the Redman hub, which took over the Paramount plans, is listed");
});

test("every linked page is a site URL", () => {
  const links = [...text.matchAll(/https?:\/\/[^\s)]+/g)].map((m) => m[0]);
  const foreign = links.filter((l) => !l.startsWith("https://factorydirecthomescenter.com") && !l.startsWith("https://www.google.com/maps") && !l.startsWith("https://g.co") && !l.startsWith("https://maps.app.goo.gl") && !l.startsWith("https://www.google.com/"));
  assert.deepEqual(foreign, [], "only our own pages and the Google listing/directions");
});
