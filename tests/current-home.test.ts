// The sticky mobile bar asks for a quote from every page on the site. On a
// floor-plan page that quote has to carry the plan, or the lead reaches
// DealerTide, Supabase and Kyle's inbox as "Direct Inquiry" with no home on
// it — from the one page where the buyer's interest is least ambiguous.
//
// What is worth guarding is the handover, not the string formatting: a page
// registers a home, a layout-level component reads it, and a client navigation
// between two plan pages must never leave the bar reading nothing.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readCurrentHome, registerCurrentHome } from "../src/lib/current-home";

test("no page has declared a home, so the bar has nothing to attach", () => {
  assert.equal(readCurrentHome(), null);
});

test("a registered home round-trips, series and all", () => {
  const release = registerCurrentHome({ name: "Dutch Aspire 1444H11023", series: "Aspire" });
  assert.deepEqual(readCurrentHome(), { name: "Dutch Aspire 1444H11023", series: "Aspire" });
  release();
  assert.equal(readCurrentHome(), null);
});

test("a plan with no series registers the name alone, not an empty string", () => {
  const release = registerCurrentHome({ name: "Prime Peak" });
  assert.deepEqual(readCurrentHome(), { name: "Prime Peak", series: undefined });
  release();
});

test("plan names survive the characters Champion actually uses", () => {
  // The encoding splits on one control character, so the only names it could
  // mangle are ones containing a control character. Champion's are model
  // codes, spaces, hyphens, apostrophes and quotes for feet and inches.
  for (const name of [
    "Dutch Aspire 1444H11023",
    "Bayfield 28'4\" x 44'",
    "The Anniversary — 3 Bed",
    "Prime Peak / Ridge",
  ]) {
    const release = registerCurrentHome({ name, series: "Aspire" });
    assert.deepEqual(readCurrentHome(), { name, series: "Aspire" });
    release();
  }
});

// React does not promise an order between the departing page's effect cleanup
// and the arriving page's effect. Both orders have to end with the arriving
// page's home registered — the failure mode is silent, and it lands on exactly
// the navigation a shopper makes most: plan to plan.
test("navigation with cleanup LAST still leaves the arriving home registered", () => {
  const releaseOld = registerCurrentHome({ name: "Old Plan", series: "Prime" });
  const releaseNew = registerCurrentHome({ name: "New Plan", series: "Paramount" });

  releaseOld(); // the departing page unmounts after the arriving page mounted

  assert.deepEqual(readCurrentHome(), { name: "New Plan", series: "Paramount" });
  releaseNew();
  assert.equal(readCurrentHome(), null);
});

test("navigation with cleanup FIRST leaves the arriving home registered", () => {
  const releaseOld = registerCurrentHome({ name: "Old Plan", series: "Prime" });
  releaseOld();
  const releaseNew = registerCurrentHome({ name: "New Plan", series: "Paramount" });

  assert.deepEqual(readCurrentHome(), { name: "New Plan", series: "Paramount" });
  releaseNew();
});

test("releasing twice does not clear a home some other page registered", () => {
  const releaseOld = registerCurrentHome({ name: "Old Plan" });
  releaseOld();
  const releaseNew = registerCurrentHome({ name: "New Plan" });
  releaseOld();

  assert.deepEqual(readCurrentHome(), { name: "New Plan", series: undefined });
  releaseNew();
});

test("leaving a plan page for a page with no home clears it", () => {
  const release = registerCurrentHome({ name: "Dutch Aspire 1660H22212", series: "Aspire" });
  release();
  assert.equal(readCurrentHome(), null);
});
