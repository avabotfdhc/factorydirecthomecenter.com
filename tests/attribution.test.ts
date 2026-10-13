// Lead attribution: the rules that decide which campaign gets credit.
//
// These are not incidental details. Get the merge rule wrong and every lead
// is relabelled "direct" at the moment it converts, which is exactly the
// failure that makes ad reporting say no campaign ever produced anything.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ATTRIBUTION_COOKIE,
  attributionColumns,
  attributionSummaryLines,
  decodeAttribution,
  encodeAttribution,
  isAttributedTouch,
  mergeAttribution,
  parseTouch,
  readAttributionCookie,
} from "../src/lib/attribution";

const SITE = "https://factorydirecthomescenter.com";

test("utm parameters are read into the touch", () => {
  const t = parseTouch({
    url: `${SITE}/floor-plans?utm_source=google&utm_medium=cpc&utm_campaign=spring-doublewides&utm_term=double+wide+fort+wayne&utm_content=ad-b`,
  });
  assert.equal(t.source, "google");
  assert.equal(t.medium, "cpc");
  assert.equal(t.campaign, "spring-doublewides");
  assert.equal(t.term, "double wide fort wayne");
  assert.equal(t.content, "ad-b");
  assert.match(t.landingPage, /^\/floor-plans\?/);
});

test("a gclid alone identifies a paid Google click", () => {
  const t = parseTouch({ url: `${SITE}/?gclid=Cj0KCQabc123` });
  assert.equal(t.source, "google");
  assert.equal(t.medium, "cpc");
  assert.equal(t.clickIdType, "gclid");
  assert.equal(t.clickId, "Cj0KCQabc123");
});

test("an explicit utm_medium beats the click id's default", () => {
  // A Meta campaign tagged utm_medium=paid_social must not be downgraded to
  // the "social" default fbclid carries for organic shares.
  const t = parseTouch({ url: `${SITE}/?fbclid=abc&utm_source=facebook&utm_medium=paid_social` });
  assert.equal(t.medium, "paid_social");
  assert.equal(t.clickIdType, "fbclid");
});

test("referrers are classified: search, social, answer engine, plain referral", () => {
  const cases: Array<[string, string, string]> = [
    ["https://www.google.com/search?q=manufactured+homes+auburn+in", "google", "organic"],
    ["https://www.bing.com/search?q=champion+homes", "bing", "organic"],
    ["https://m.facebook.com/", "facebook", "social"],
    ["https://chatgpt.com/c/abc", "chatgpt", "ai"],
    ["https://www.perplexity.ai/search/xyz", "perplexity", "ai"],
    ["https://www.dekalbcountyin.gov/planning", "dekalbcountyin.gov", "referral"],
  ];
  for (const [referrer, source, medium] of cases) {
    const t = parseTouch({ url: `${SITE}/locations/auburn`, referrer });
    assert.equal(t.source, source, referrer);
    assert.equal(t.medium, medium, referrer);
  }
});

test("an internal referrer is not a new touch", () => {
  const t = parseTouch({ url: `${SITE}/floor-plans`, referrer: `${SITE}/` });
  assert.equal(t.referrer, "");
  assert.equal(t.source, "direct");
  assert.equal(isAttributedTouch(t), false);
});

test("www and non-www are the same site", () => {
  const t = parseTouch({ url: `${SITE}/about`, referrer: "https://www.factorydirecthomescenter.com/" });
  assert.equal(t.referrer, "");
});

test("first touch survives a later direct return visit", () => {
  // The whole point: someone clicks a Google ad in March, comes back in May by
  // typing the domain, and enquires. The ad must still get the credit.
  const ad = parseTouch({ url: `${SITE}/?utm_source=google&utm_medium=cpc&utm_campaign=spring` });
  let attribution = mergeAttribution(null, ad);
  const direct = parseTouch({ url: `${SITE}/floor-plans` });
  attribution = mergeAttribution(attribution, direct);

  assert.equal(attribution.first.campaign, "spring");
  assert.equal(attribution.last.campaign, "spring", "a direct return must not overwrite the last touch");
  assert.equal(attribution.visits, 1);
});

test("a genuinely new campaign does move the last touch, keeping the first", () => {
  const blog = parseTouch({ url: `${SITE}/blog/auburn`, referrer: "https://www.google.com/" });
  const retarget = parseTouch({ url: `${SITE}/?utm_source=facebook&utm_medium=paid_social&utm_campaign=retarget` });
  const attribution = mergeAttribution(mergeAttribution(null, blog), retarget);

  assert.equal(attribution.first.source, "google");
  assert.equal(attribution.first.medium, "organic");
  assert.equal(attribution.last.source, "facebook");
  assert.equal(attribution.last.campaign, "retarget");
  assert.equal(attribution.visits, 2);
});

test("repeating the same campaign is not counted as another visit", () => {
  const touch = parseTouch({ url: `${SITE}/?utm_source=google&utm_medium=cpc&utm_campaign=spring` });
  const again = parseTouch({ url: `${SITE}/floor-plans?utm_source=google&utm_medium=cpc&utm_campaign=spring` });
  const attribution = mergeAttribution(mergeAttribution(null, touch), again);
  assert.equal(attribution.visits, 1);
});

test("the cookie round-trips", () => {
  const touch = parseTouch({
    url: `${SITE}/floor-plans/thornton?utm_source=google&utm_medium=cpc&utm_campaign=spring+2026&gclid=abc`,
    referrer: "https://www.google.com/",
  });
  const attribution = mergeAttribution(null, touch);
  const decoded = decodeAttribution(encodeAttribution(attribution));
  assert.deepEqual(decoded, attribution);
});

test("a corrupt or truncated cookie reads as absent, never throws", () => {
  for (const bad of ["", "not json", "%7B%22v%22%3A1", encodeURIComponent('{"v":9}'), null, undefined]) {
    assert.equal(decodeAttribution(bad), null, String(bad));
  }
});

test("the cookie is found among other cookies and only under its own name", () => {
  const touch = parseTouch({ url: `${SITE}/?utm_source=bing&utm_medium=cpc` });
  const value = encodeAttribution(mergeAttribution(null, touch));
  const header = `sb-access-token=xyz; ${ATTRIBUTION_COOKIE}=${value}; other=1`;
  assert.equal(readAttributionCookie(header)?.last.source, "bing");
  assert.equal(readAttributionCookie(`not_${ATTRIBUTION_COOKIE}=${value}`), null);
  assert.equal(readAttributionCookie(null), null);
});

test("long values are clamped so the cookie can never exceed the 4KB browser limit", () => {
  const long = "x".repeat(5000);
  const touch = parseTouch({
    url: `${SITE}/${long}?utm_campaign=${long}&utm_source=${long}&utm_term=${long}&utm_content=${long}&gclid=${long}`,
    referrer: `https://example.com/${long}`,
  });
  const encoded = encodeAttribution(mergeAttribution(null, touch));
  assert.ok(encoded.length < 4000, `cookie was ${encoded.length} bytes`);
});

test("columns are null rather than empty strings, so `is null` works in SQL", () => {
  const cols = attributionColumns(null);
  for (const [key, value] of Object.entries(cols)) {
    assert.equal(value, null, `${key} should be null when there is no attribution`);
  }
  const touch = parseTouch({ url: `${SITE}/?utm_source=google&utm_medium=cpc` });
  const set = attributionColumns(mergeAttribution(null, touch));
  assert.equal(set.utm_source, "google");
  assert.equal(set.utm_campaign, null);
  assert.equal(set.touch_count, 1);
});

test("the column set matches the migration exactly", () => {
  // If these drift, PostgREST rejects the whole insert with a 400 and every
  // website lead is lost until someone notices.
  const expected = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "click_id",
    "click_id_type",
    "landing_page",
    "referrer",
    "first_touch_source",
    "first_touch_medium",
    "first_touch_campaign",
    "first_touch_at",
    "touch_count",
  ].sort();
  assert.deepEqual(Object.keys(attributionColumns(null)).sort(), expected);
});

test("the CRM note names the campaign, and stays quiet when there is nothing to say", () => {
  assert.deepEqual(attributionSummaryLines(null), []);
  const ad = parseTouch({ url: `${SITE}/?utm_source=google&utm_medium=cpc&utm_campaign=spring&gclid=abc` });
  const organic = parseTouch({ url: `${SITE}/blog/auburn`, referrer: "https://www.google.com/" });
  const lines = attributionSummaryLines(mergeAttribution(mergeAttribution(null, organic), ad));
  assert.ok(lines.some((l) => l.includes("Source (last touch): google / cpc / spring")), lines.join(" | "));
  assert.ok(lines.some((l) => l.startsWith("First found us via: google / organic")), lines.join(" | "));
  assert.ok(lines.some((l) => l.includes("gclid")), lines.join(" | "));
});

// ---------------------------------------------------------------------------
// The reporting view must not be a hole through the RLS on `leads`.
//
// Supabase's advisor flagged public.lead_attribution_report as SECURITY
// DEFINER on 2026-10-10. It was: the view ran as `postgres` (which bypasses
// RLS) and Supabase's default grants on the public schema had given `anon`
// every privilege on it. Measured on the live project, `anon` read 0 rows from
// public.leads directly and all 52 through the view — full_name and
// contact_info included — with the anon key that ships in the page source, and
// could UPDATE and DELETE through it because a single-table view is
// auto-updatable.
//
// A test cannot check live database state (CI has no network and no
// credentials), but it can check that the committed migration still declares
// both halves of the fix, so re-applying the migration set cannot recreate the
// hole. That is the whole failure mode here: the first version of this file
// was correct about the columns and silent about the view's rights.
// ---------------------------------------------------------------------------

test("the attribution migration creates the reporting view with security_invoker", () => {
  const sql = readFileSync(
    resolve(import.meta.dirname, "../supabase/migrations/20260920_lead_attribution.sql"),
    "utf8",
  );
  const create = sql.match(/CREATE OR REPLACE VIEW\s+public\.lead_attribution_report[\s\S]*?\sAS/i);
  assert.ok(create, "the lead_attribution_report view is no longer created by this migration");
  assert.match(
    create[0],
    /WITH\s*\(\s*security_invoker\s*=\s*(true|on)\s*\)/i,
    "the view must be created WITH (security_invoker = true), or it runs as postgres and bypasses RLS on leads",
  );
});

test("the attribution migration revokes anon's privileges on the reporting view", () => {
  const sql = readFileSync(
    resolve(import.meta.dirname, "../supabase/migrations/20260920_lead_attribution.sql"),
    "utf8",
  );
  assert.match(
    sql,
    /REVOKE\s+ALL\s+ON\s+public\.lead_attribution_report\s+FROM\s+anon\s*;/i,
    "anon must hold no privilege on a view that selects lead PII — security_invoker alone is one half of the fix",
  );
  assert.match(
    sql,
    /REVOKE[\s\S]{0,120}?ON\s+public\.lead_attribution_report\s+FROM\s+authenticated\s*;/i,
    "nothing should be able to write through the reporting view",
  );
});
