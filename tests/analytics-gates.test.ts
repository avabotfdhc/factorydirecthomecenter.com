// GA4 must count the visit, and a decline must stop the tags.
//
// 2026-10-17: GA4 showed traffic "tanking" from mid-August while the site was
// healthy. Every tag sat behind a first-interaction gate (6 s idle fallback)
// AND next/script's `lazyOnload`, so an idle visit did not even request
// gtag.js until 6.3 s after navigation (measured in Chromium). Visits shorter
// than that with no scroll or tap were never counted. These tests hold the
// repair: GA4 loads as soon as consent allows, with Consent Mode v2 declared,
// and a mid-visit Decline revokes consent and disables the property. The
// heavier tags (Clarity, GTM, Meta) may still wait for the first interaction.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  GA_CONSENT_DENIED,
  GA_CONSENT_GRANTED,
  GA_CONSENT_TYPES,
  gaBootstrapScript,
  gaDisableKey,
  revokeTracking,
  type TrackingWindow,
} from "../src/lib/ga-consent";

const analyticsSrc = readFileSync("src/lib/analytics.tsx", "utf8");

/** The body of one top-level `export function Name() { … }` in analytics.tsx. */
function componentSource(name: string): string {
  const start = analyticsSrc.indexOf(`export function ${name}(`);
  assert.ok(start >= 0, `${name} is exported from analytics.tsx`);
  const next = analyticsSrc.indexOf("\nexport function ", start + 1);
  const end = next === -1 ? analyticsSrc.length : next;
  return analyticsSrc.slice(start, end);
}

test("the GA4 bootstrap makes one config call, after a Consent Mode default", () => {
  const script = gaBootstrapScript("G-TEST123");
  assert.equal(script.match(/gtag\('config'/g)?.length, 1, "exactly one config call");
  assert.ok(script.includes("gtag('config','G-TEST123'"), "config names the measurement id");
  const consentAt = script.indexOf("gtag('consent','default'");
  const configAt = script.indexOf("gtag('config'");
  assert.ok(consentAt >= 0 && consentAt < configAt, "consent default is queued before config");
  for (const type of GA_CONSENT_TYPES) assert.ok(script.includes(`${type}:'granted'`), `${type} declared`);
  assert.ok(!script.includes("custom_map"), "no Universal Analytics custom_map");
  assert.ok(script.includes("send_page_view:true"), "the config call sends the page_view");
  // The id is interpolated into JavaScript; anything that is not an id must be refused.
  assert.throws(() => gaBootstrapScript("G-1');alert(1);//"));
});

test("GA4 loads as soon as consent allows, not after the first interaction", () => {
  const ga = componentSource("GoogleAnalytics");
  assert.ok(!ga.includes('strategy="lazyOnload"'), "GA4 scripts are not lazyOnload");
  assert.equal(ga.match(/strategy="afterInteractive"/g)?.length, 2, "both GA4 scripts are afterInteractive");
  assert.ok(ga.includes("gaBootstrapScript(GA_MEASUREMENT_ID)"), "the inline script comes from ga-consent.ts");

  const provider = componentSource("AnalyticsProvider");
  assert.ok(provider.includes("if (!allowed) return null;"), "consent is the only gate on the whole provider");
  const gaAt = provider.indexOf("<GoogleAnalytics />");
  const readyAt = provider.indexOf("{ready && (");
  assert.ok(gaAt >= 0, "the provider renders GoogleAnalytics");
  assert.ok(readyAt >= 0, "the heavier tags still wait for the interaction gate");
  assert.ok(gaAt < readyAt, "GoogleAnalytics renders outside the `ready` gate");
  assert.ok(!/if \(!ready\b/.test(provider), "nothing returns null on `ready` alone");
  assert.ok(provider.includes("useRevokeOnDecline(allowed)"), "a decline mid-visit is handled");
});

test("a decline mid-visit revokes consent and disables the property", () => {
  const calls: unknown[][] = [];
  const win: TrackingWindow = {
    gtag: (...args) => calls.push(["gtag", ...args]),
    clarity: (...args) => calls.push(["clarity", ...args]),
  };
  revokeTracking(win, "G-TEST123");
  assert.equal((win as Record<string, unknown>)[gaDisableKey("G-TEST123")], true, "window['ga-disable-G-TEST123'] is set");
  assert.deepEqual(calls[0], ["gtag", "consent", "update", GA_CONSENT_DENIED]);
  assert.ok(calls.some((c) => c[0] === "clarity" && c[1] === "stop"), "Clarity is told to stop recording");
  for (const type of GA_CONSENT_TYPES) {
    assert.equal(GA_CONSENT_DENIED[type], "denied");
    assert.equal(GA_CONSENT_GRANTED[type], "granted");
  }
});

test("revoking on a page where no tag ever loaded is a no-op, not a crash", () => {
  const win: TrackingWindow = {};
  assert.doesNotThrow(() => revokeTracking(win, "G-TEST123"));
  assert.equal((win as Record<string, unknown>)["ga-disable-G-TEST123"], true);
});

test("the consent gate itself is untouched: GPC and a stored decline still withhold every tag", () => {
  // The repair must not loosen privacy. useTrackingAllowed() still drives the
  // provider, and consent.ts still treats Global Privacy Control and a stored
  // "denied" as not allowed (tests/consent-banner.test.ts covers the rest).
  assert.ok(componentSource("AnalyticsProvider").includes("useTrackingAllowed()"));
  const consentSrc = readFileSync("src/lib/consent.ts", "utf8");
  assert.ok(consentSrc.includes("if (hasGlobalPrivacyControl()) return { allowed: false, needsPrompt: false };"));
  assert.ok(consentSrc.includes('if (stored === "denied") return { allowed: false, needsPrompt: false };'));
});
