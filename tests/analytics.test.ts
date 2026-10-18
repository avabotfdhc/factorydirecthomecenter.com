// Meta Pixel bootstrap guard (2026-10-18).
//
// The pixel went live from a committed default ID, like GA4 and Clarity. The
// previous (never-enabled) bootstrap fired `InitiateCheckout` on every page
// view and sent the showroom's own city/state/zip as every visitor's
// advanced-matching data. Had the pixel been switched on with that in place,
// Meta's optimiser would have been told that every visitor converts. A source
// scan is enough here: analytics.tsx is a client component and the string it
// hands to <Script> is what the browser runs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const src = readFileSync(resolve(import.meta.dirname, "../src/lib/analytics.tsx"), "utf8");

function pixelBootstrap(): string {
  const start = src.indexOf("export function FacebookPixel()");
  assert.ok(start >= 0, "FacebookPixel() is no longer in analytics.tsx");
  const end = src.indexOf("</Script>", start);
  assert.ok(end > start, "FacebookPixel() no longer renders a <Script>");
  return src.slice(start, end);
}

test("the Meta Pixel has a committed numeric default and an env override, like GA4 and Clarity", () => {
  const m = src.match(/export const FB_PIXEL_ID = process\.env\.NEXT_PUBLIC_FB_PIXEL_ID \|\| "(\d*)";/);
  assert.ok(m, "FB_PIXEL_ID is not declared as `process.env.NEXT_PUBLIC_FB_PIXEL_ID || \"<id>\"`");
  assert.match(m[1], /^\d{10,20}$/, "the committed default must be a Meta Pixel ID (a long number)");
});

test("the pixel bootstrap fires PageView and nothing else", () => {
  const boot = pixelBootstrap();
  const tracks = [...boot.matchAll(/fbq\(\s*'track(?:Custom)?'\s*,\s*'([^']+)'/g)].map((x) => x[1]);
  assert.deepEqual(tracks, ["PageView"], `bootstrap fires ${JSON.stringify(tracks)}; only PageView belongs on page load`);
  for (const conversion of ["InitiateCheckout", "Lead", "Contact", "Purchase", "CompleteRegistration"]) {
    assert.ok(!boot.includes(`'${conversion}'`), `${conversion} must not fire on page load`);
  }
});

test("the pixel init carries no hard-coded visitor matching data", () => {
  const boot = pixelBootstrap();
  assert.match(boot, /fbq\('init', '\$\{FB_PIXEL_ID\}'\);/, "init must be the plain two-argument form");
  for (const field of ["ct:", "st:", "zp:", "em:", "ph:", "'Auburn'", "'46706'"]) {
    assert.ok(!boot.includes(field), `advanced-matching field ${field} must not be hard-coded into the bootstrap`);
  }
});

test("every lead form reports a Lead to Meta through trackLeadFormSubmit", () => {
  const fn = src.slice(src.indexOf("export function trackLeadFormSubmit("));
  const body = fn.slice(0, fn.indexOf("\n}\n") + 3);
  assert.match(body, /FacebookEvents\.lead\(/, "trackLeadFormSubmit no longer fires the Meta Lead event");
});
