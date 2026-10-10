// The consent banner is server-rendered for every visitor so it paints with the
// first frame — waiting for hydration made it the homepage's mobile LCP element
// at 4.0 s (2026-09-29). An inline <head> script hides it before paint for a
// visitor who has already answered. That script repeats resolveConsent()'s
// "no prompt" test as a string, so the two can drift: if they disagree, a
// returning visitor sees the banner flash, or a new one never sees it painted.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import vm from "node:vm";
import { CONSENT_ANSWERED_ATTR, CONSENT_PREPAINT_SCRIPT } from "../src/lib/consent";

const DAY = 24 * 60 * 60 * 1000;

/** Runs the pre-paint script against a fake browser; true = banner hidden. */
function hidesBanner(stored: string | null, gpc = false, storageThrows = false): boolean {
  const attrs = new Set<string>();
  vm.runInNewContext(CONSENT_PREPAINT_SCRIPT, {
    document: { documentElement: { setAttribute: (name: string) => attrs.add(name) } },
    navigator: gpc ? { globalPrivacyControl: true } : {},
    localStorage: {
      getItem: () => {
        if (storageThrows) throw new Error("SecurityError");
        return stored;
      },
    },
    Date,
    JSON,
  });
  return attrs.has(CONSENT_ANSWERED_ATTR);
}

const answer = (choice: string, ageMs = 0, v = 1) =>
  JSON.stringify({ v, choice, at: Date.now() - ageMs });

test("a new visitor keeps the server-rendered banner", () => {
  assert.equal(hidesBanner(null), false);
});

test("a current answer, either way, hides it before paint", () => {
  assert.equal(hidesBanner(answer("granted")), true);
  assert.equal(hidesBanner(answer("denied")), true);
});

test("Global Privacy Control hides it, as resolveConsent() does", () => {
  assert.equal(hidesBanner(null, true), true);
});

test("an answer resolveConsent() would re-ask about does not hide it", () => {
  assert.equal(hidesBanner(answer("granted", 366 * DAY)), false, "older than a year");
  assert.equal(hidesBanner(answer("granted", 0, 2)), false, "different version");
  assert.equal(hidesBanner("{not json"), false, "corrupt entry");
  assert.equal(hidesBanner(null, false, true), false, "storage blocked");
});

test("the banner renders on the server, the layout runs the script, and CSS hides it", () => {
  const banner = readFileSync("src/components/ConsentBanner.tsx", "utf8");
  assert.match(banner, /getServerNeedsPromptSnapshot/);
  assert.match(banner, /id="consent-banner"/);
  const layout = readFileSync("src/app/layout.tsx", "utf8");
  assert.match(layout, /__html: CONSENT_PREPAINT_SCRIPT/);
  const css = readFileSync("src/app/globals.css", "utf8");
  assert.match(css, new RegExp(`html\\[${CONSENT_ANSWERED_ATTR}\\] #consent-banner\\s*\\{\\s*display: none;`));
});

// ---------------------------------------------------------------------------
// The Google Maps embed is an iframe on google.com, so it sets Google's own
// cookies the moment it renders — a production Lighthouse run on /contact-us
// (2026-10-10) counted 30, including NID, __Secure-3PSID and
// __Secure-3PAPISID: advertising and identity cookies, not map state. Both
// maps (/ and /contact-us) were server-rendered unconditionally, so every
// visitor got all thirty on first paint while the consent banner was still
// asking. LocationMap now waits for an affirmative acceptance or a click.
//
// Only LocationMap may embed the map. A raw iframe dropped back into a page
// would restore the old behaviour silently, and no test that reads consent
// state would notice.
// ---------------------------------------------------------------------------

test("only LocationMap embeds the Google Maps iframe", () => {
  const allowed = new Set(["src/components/LocationMap.tsx"]);
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith(".tsx") && !entry.name.endsWith(".ts")) continue;
      const rel = relative(process.cwd(), full).split(sep).join("/");
      if (allowed.has(rel)) continue;
      const source = readFileSync(full, "utf8");
      // An <iframe> whose src is a Google Maps embed, however it is spelled.
      if (/<iframe[^>]*google\.com\/maps/s.test(source) || /google\.com\/maps[^"'`]*output=embed/.test(source)) {
        offenders.push(rel);
      }
    }
  };
  walk(resolve(process.cwd(), "src"));
  assert.deepEqual(
    offenders,
    [],
    "these files embed Google Maps directly — use <LocationMap>, which waits for consent or a click",
  );
});

test("LocationMap gates on affirmative consent, not the opt-out snapshot", () => {
  // getTrackingAllowedSnapshot returns true for a visitor who has not answered
  // the banner (opt-out model), so gating on it renders the iframe for
  // everyone. That was the first version of this fix and it did nothing.
  const source = readFileSync(
    resolve(process.cwd(), "src/components/LocationMap.tsx"),
    "utf8",
  );
  assert.match(source, /getConsentGrantedSnapshot/, "LocationMap must read the affirmative-consent snapshot");
  assert.doesNotMatch(
    source,
    /getTrackingAllowedSnapshot\s*,/,
    "getTrackingAllowedSnapshot is the opt-out answer — it is true before the visitor replies",
  );
});

test("affirmative consent is stricter than the opt-out answer", () => {
  // Pinning the distinction the fix depends on: with no stored choice the
  // opt-out answer allows tracking, and the affirmative one does not.
  const consent = readFileSync(resolve(process.cwd(), "src/lib/consent.ts"), "utf8");
  assert.match(
    consent,
    /export function getConsentGrantedSnapshot\(\)[\s\S]{0,200}readStoredConsent\(\)\s*===\s*"granted"/,
    "getConsentGrantedSnapshot must require a stored \"granted\", not merely the absence of a refusal",
  );
  assert.match(
    consent,
    /export function getConsentGrantedSnapshot\(\)[\s\S]{0,200}hasGlobalPrivacyControl\(\)/,
    "a Global Privacy Control signal must still win over a stored acceptance",
  );
});
