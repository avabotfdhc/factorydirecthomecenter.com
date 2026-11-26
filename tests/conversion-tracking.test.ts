// Conversion measurement guards (2026-11-25).
//
// GA4 was collecting `generate_lead` and `phone_call_click`, but three lead
// paths never reported to it and one of them never produced a lead at all:
//   - the exit pop-up "submitted" to a one-second timer and discarded the email
//   - a lead or showroom visit Ava saved in chat fired no event
//   - only hand-labelled `tel:` links counted as phone clicks
// These tests hold each fix in place.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  PHONE_CLICK_DEDUPE_MS,
  createPhoneClickGate,
  pageTypeFromPath,
  phoneClickLocation,
} from "../src/lib/phone-click";

const read = (p: string) => readFileSync(resolve(import.meta.dirname, "..", p), "utf8");
const analytics = read("src/lib/analytics.tsx");
const popup = read("src/components/ExitIntentPopup.tsx");
const ava = read("src/components/AvaChatWidget.tsx");
const gaConsent = read("src/lib/ga-consent.ts");

test("one tap on a labelled phone link is one event, and an unlabelled link still counts", () => {
  let t = 10_000;
  const gate = createPhoneClickGate(() => t);
  // Unlabelled link: only the document listener sees it.
  assert.equal(gate.shouldReport(), true);
  // Labelled link: the component reports first, then the listener stands down.
  t += 60_000;
  gate.mark();
  t += 5;
  assert.equal(gate.shouldReport(), false, "the listener double-counted a link a component already reported");
  // A second, later tap is a second click.
  t += PHONE_CLICK_DEDUPE_MS + 1;
  assert.equal(gate.shouldReport(), true);
});

test("a phone click is located by landmark, never by the link's text or number", () => {
  const el = (attrs: Record<string, string>, inside: string[]) => ({
    getAttribute: (n: string) => attrs[n] ?? null,
    closest: (sel: string) => (inside.includes(sel) ? {} : null),
  });
  assert.equal(phoneClickLocation(el({ "data-track-location": "exit_intent" }, ["footer"])), "exit_intent");
  assert.equal(phoneClickLocation(el({}, ["header"])), "header");
  assert.equal(phoneClickLocation(el({}, ["footer"])), "footer");
  assert.equal(phoneClickLocation(el({}, [])), "page_body");
  assert.equal(pageTypeFromPath("/"), "home");
  assert.equal(pageTypeFromPath("/locations/fort-wayne"), "locations");
});

test("the site-wide phone listener is installed and bubbles, so React's onClick runs first", () => {
  assert.match(analytics, /usePhoneClickTracking\(\);/, "useTracking() no longer installs the phone-click listener");
  const hook = analytics.slice(analytics.indexOf("export function usePhoneClickTracking()"));
  const body = hook.slice(0, hook.indexOf("\n}\n"));
  assert.match(body, /a\[href\^="tel:"\]/);
  assert.match(body, /document\.addEventListener\("click", onClick\)/, "must be a bubble-phase listener: a capture-phase one fires before the component's own label and the dedupe keeps the wrong one");
  assert.match(body, /phoneClickGate\.shouldReport\(\)/);
});

test("a phone click reports phone_call_click to GA4 and the standard Contact event to Meta", () => {
  const fn = analytics.slice(analytics.indexOf("function reportPhoneClick("));
  const body = fn.slice(0, fn.indexOf("\n}\n"));
  assert.match(body, /trackGA4Event\("phone_call_click"/);
  assert.match(body, /FacebookEvents\.contact\(/);
});

test("the exit pop-up posts a real lead and only then claims success", () => {
  assert.ok(!/Simulate API call/.test(popup), "the fake submit is back");
  assert.ok(!/new Promise\(\(resolve\) => setTimeout/.test(popup), "the fake submit is back");
  const post = popup.indexOf('fetch("/api/leads"');
  const ok = popup.indexOf("if (!res.ok) throw");
  const tracked = popup.indexOf('trackLeadFormSubmit("exit_intent"');
  const done = popup.indexOf('setStatus("done")');
  assert.ok(post > 0, "the exit pop-up no longer posts to /api/leads");
  assert.ok(post < ok && ok < tracked && tracked < done, "the conversion event and the success screen must come after an accepted lead");
  // /api/leads rejects a lead without a name; the form must collect one.
  assert.match(popup, /firstName,\s*\n\s*lastName,/);
  assert.match(popup, /antiSpam\.payload\(\)/, "the pop-up must carry the honeypot and fill timer like every other form");
});

test("a lead or visit Ava saves in chat is reported once per session", () => {
  assert.match(ava, /if \(!tracked\.current\.lead\) \{\s*tracked\.current\.lead = true;\s*trackLeadFormSubmit\("ava_chat"/);
  assert.match(ava, /if \(!tracked\.current\.visit\) \{\s*tracked\.current\.visit = true;\s*trackLeadFormSubmit\("ava_visit"/);
  assert.match(ava, /trackGA4Event\("chat_open"/);
  assert.match(ava, /trackGA4Event\("chat_message"/);
});

test("the landing page view comes from the GA bootstrap and the route hook skips its first run", () => {
  assert.match(gaConsent, /send_page_view:true/, "send_page_view:false would drop every landing page view: the route hook runs before gtag.js exists");
  const hook = analytics.slice(analytics.indexOf("export function usePageTracking()"));
  const body = hook.slice(0, hook.indexOf("\n}\n"));
  assert.match(body, /if \(previous === null \|\| previous === url\) return;/);
});
