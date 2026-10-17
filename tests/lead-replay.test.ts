// Rebuilding a DealerTide lead from a stored `public.leads` row, for the replay
// script that re-sends leads the CRM refused (2026-10-09 → 2026-10-17, dead
// partner key). Pure functions; no network.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  attributionLinesFromRow,
  looksLikeTestLead,
  parseContactInfo,
  replayPayload,
  splitName,
  type StoredLeadRow,
} from "../src/lib/lead-replay";

const row = (over: Partial<StoredLeadRow> = {}): StoredLeadRow => ({
  id: "11111111-1111-1111-1111-111111111111",
  created_at: "2026-10-12T15:01:30.621543+00:00",
  full_name: "Dawn m hale",
  contact_info: "14195512514 · buterflie_76@yahoo.com",
  target_county: "Ohio",
  timeline: "3-6 months",
  model_interest: "1476H32082",
  series_interest: "Aspire",
  source_page: "/floor-plans",
  utm_source: "google",
  utm_medium: "organic",
  utm_campaign: null,
  utm_term: null,
  click_id: null,
  click_id_type: null,
  landing_page: "/floor-plans/aspire-1476h32082",
  referrer: "www.google.com",
  first_touch_source: "google",
  first_touch_medium: "organic",
  first_touch_campaign: null,
  touch_count: 1,
  ...over,
});

test("splitName: first word is the first name, the rest the last; one word gets a dash", () => {
  assert.deepEqual(splitName("Dawn m hale"), { first_name: "Dawn", last_name: "m hale" });
  assert.deepEqual(splitName("  Al "), { first_name: "Al", last_name: "—" });
  assert.deepEqual(splitName(""), { first_name: "Website", last_name: "—" });
});

test("parseContactInfo: phone and email in either order, either alone, odd formatting", () => {
  assert.deepEqual(parseContactInfo("14195512514 · buterflie_76@yahoo.com"), { phone: "14195512514", email: "buterflie_76@yahoo.com" });
  assert.deepEqual(parseContactInfo("someone@example.com · (765) 625 - 1868"), { phone: "(765) 625 - 1868", email: "someone@example.com" });
  assert.deepEqual(parseContactInfo("+12604143880"), { phone: "+12604143880", email: "" });
  assert.deepEqual(parseContactInfo("only@example.com"), { phone: "", email: "only@example.com" });
  assert.deepEqual(parseContactInfo("—"), { phone: "", email: "" });
});

test("replayPayload: the shape /api/leads sends, with the original date and the attribution", () => {
  const p = replayPayload(row());
  assert.equal(p.first_name, "Dawn");
  assert.equal(p.last_name, "m hale");
  assert.equal(p.phone, "14195512514");
  assert.equal(p.email, "buterflie_76@yahoo.com");
  assert.equal(p.source, "Website");
  assert.equal(p.page_url, "/floor-plans");
  const m = String(p.message);
  assert.match(m, /^Form: Website \(replayed .* originally submitted Oct 12, 2026, 11:01 AM ET\)/);
  for (const s of ["Interest: 1476H32082", "Delivery: Ohio", "Timeframe: 3-6 months", "— Source (last touch): google / organic", "— Referred by: www.google.com", "— Landed on: /floor-plans/aspire-1476h32082"]) {
    assert.ok(m.includes(s), `message missing ${s}`);
  }
  assert.ok(!m.includes("First found us via"), "first touch equals last touch, so it is not repeated");
});

test("replayPayload: phone-only lead carries no email key; placeholder fields stay out", () => {
  const p = replayPayload(row({ contact_info: "+12604143880", model_interest: "Direct Inquiry", target_county: "Not specified", timeline: "Not specified", utm_source: null, utm_medium: null, first_touch_source: null, first_touch_medium: null, landing_page: null, referrer: null }));
  assert.ok(!("email" in p));
  assert.equal(p.phone, "+12604143880");
  const m = String(p.message);
  assert.ok(!m.includes("Interest:")); assert.ok(!m.includes("Delivery:")); assert.ok(!m.includes("Timeframe:"));
  assert.ok(!m.includes("Source (last touch)"));
});

test("attributionLinesFromRow: first touch shown only when it differs; click id and touches", () => {
  const lines = attributionLinesFromRow(row({ utm_source: "facebook", utm_medium: "social", first_touch_source: "google", first_touch_medium: "organic", click_id: "abc", click_id_type: "fbclid", touch_count: 3, referrer: null, landing_page: null }));
  assert.deepEqual(lines, [
    "Source (last touch): facebook / social",
    "First found us via: google / organic",
    "Click ID (fbclid): abc",
    "Campaign touches before enquiring: 3",
  ]);
});

test("looksLikeTestLead: our own addresses and 'Test' names are skipped, real buyers are not", () => {
  assert.equal(looksLikeTestLead(row({ full_name: "Kyle Dudgeon", contact_info: "2603081457 · kdudgeon@factorydirecthomescenter.com" })), true);
  assert.equal(looksLikeTestLead(row({ full_name: "Test", contact_info: "2607501828 · kdudgeon@factorydirecthomescenter.com" })), true);
  assert.equal(looksLikeTestLead(row({ full_name: "Ava Bot", contact_info: "2607501828 · avabotfdhc@gmail.com" })), true);
  assert.equal(looksLikeTestLead(row()), false);
  assert.equal(looksLikeTestLead(row({ full_name: "Testa Rossi", contact_info: "2605550000 · t@example.com" })), false);
});
