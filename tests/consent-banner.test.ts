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
import { readFileSync } from "node:fs";
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
