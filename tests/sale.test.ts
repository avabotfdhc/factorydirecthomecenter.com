import { test } from "node:test";
import assert from "node:assert/strict";
import { saleAmount, saleScope, saleStatusForDay, saleTerms } from "../src/lib/sale";

// October 2026 (Kyle, 2026-10-02): 20% off MSRP base price on every new
// Champion home, signed and deposited by October 31, October production.
test("October 2026 runs 20% off every home through October 31", () => {
  for (const day of ["2026-10-01", "2026-10-15", "2026-10-31"]) {
    const s = saleStatusForDay(day);
    assert.equal(s.active, true, day);
    assert.equal(s.discountPercent, 20);
    assert.equal(s.allHomes, true);
    assert.equal(s.productionMonth, "October 2026");
    assert.equal(s.endDateLabel, "October 31, 2026");
  }
  assert.equal(saleStatusForDay("2026-11-01").active, false);
  assert.equal(saleStatusForDay("2026-10-29").endingSoon, true);
});

test("an every-home offer is not worded as 'up to' or 'select'", () => {
  const oct = saleStatusForDay("2026-10-10");
  assert.equal(saleAmount(oct), "20%");
  assert.equal(saleScope(oct), "every new Champion floor plan");
  const sep = saleStatusForDay("2026-09-20");
  assert.equal(saleAmount(sep), "up to 25%");
  assert.equal(saleScope(sep), "select new Champion floor plans");
});

test("the terms carry the deadline, production month and the no-financing line", () => {
  const terms = saleTerms(saleStatusForDay("2026-10-10")).join(" ");
  assert.match(terms, /20% off the MSRP base price on every new Champion/);
  assert.match(terms, /deposit received by October 31, 2026/);
  assert.match(terms, /authorized for production in October 2026/);
  assert.match(terms, /does not provide, arrange or broker financing/);
  assert.match(terms, /signed purchase agreement governs/);
  assert.doesNotMatch(terms, /credit approval/i);
});
