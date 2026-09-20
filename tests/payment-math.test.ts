// The financing calculator shows payment figures to buyers, so its arithmetic
// is pinned rather than trusted.
//
// Every expected value below was captured by running the ORIGINAL
// implementation — the two effects inside PaymentCalculator that wrote their
// results back into state — before that code was refactored to compute during
// render. If a change to payment-math.ts moves any of these numbers, it has
// changed what a buyer is told, and that is never incidental.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { amortise, creditTierRates, rateFor } from "../src/lib/payment-math";

/** Captured from the pre-refactor implementation. Do not "correct" these. */
const BASELINE = [
  {
    label: "default: 85,000 at 10% down, chattel/good (9.99%), 20 years",
    input: { homePrice: 85000, downPayment: 8500, interestRate: 9.99, loanTerm: 20 },
    monthlyPayment: 737.7347829092074,
    totalInterest: 100556.34789820979,
    totalCost: 185556.3478982098,
  },
  {
    label: "chattel/excellent (7.99%), 20 years",
    input: { homePrice: 85000, downPayment: 8500, interestRate: 7.99, loanTerm: 20 },
    monthlyPayment: 639.400632855354,
    totalInterest: 76956.15188528498,
    totalCost: 161956.15188528498,
  },
  {
    label: "chattel/poor (15.99%), 20 years",
    input: { homePrice: 85000, downPayment: 8500, interestRate: 15.99, loanTerm: 20 },
    monthlyPayment: 1063.7368958617096,
    totalInterest: 178796.85500681028,
    totalCost: 263796.8550068103,
  },
  {
    label: "land-home/excellent (6.5%), 30 years",
    input: { homePrice: 120000, downPayment: 12000, interestRate: 6.5, loanTerm: 30 },
    monthlyPayment: 682.6334653724025,
    totalInterest: 137748.0475340649,
    totalCost: 257748.0475340649,
  },
  {
    label: "conventional/fair (8.0%), 30 years",
    input: { homePrice: 150000, downPayment: 30000, interestRate: 8, loanTerm: 30 },
    monthlyPayment: 880.5174886552535,
    totalInterest: 196986.29591589124,
    totalCost: 346986.29591589124,
  },
  {
    label: "nothing down",
    input: { homePrice: 85000, downPayment: 0, interestRate: 9.99, loanTerm: 20 },
    monthlyPayment: 819.7053143435638,
    totalInterest: 111729.27544245531,
    totalCost: 196729.2754424553,
  },
  {
    label: "paid outright — nothing to finance",
    input: { homePrice: 85000, downPayment: 85000, interestRate: 9.99, loanTerm: 20 },
    monthlyPayment: 0,
    totalInterest: 0,
    totalCost: 85000,
  },
  {
    label: "down payment above the price — still nothing to finance",
    input: { homePrice: 85000, downPayment: 90000, interestRate: 9.99, loanTerm: 20 },
    monthlyPayment: 0,
    totalInterest: 0,
    totalCost: 90000,
  },
];

for (const row of BASELINE) {
  test(`amortise — ${row.label}`, () => {
    const got = amortise(row.input);
    assert.equal(got.monthlyPayment, row.monthlyPayment, "monthly payment moved");
    assert.equal(got.totalInterest, row.totalInterest, "total interest moved");
    assert.equal(got.totalCost, row.totalCost, "total cost moved");
  });
}

test("the rate table is what the calculator's UI offers", () => {
  // The component renders one button per tier and per loan type; a tier with
  // no rate would render a payment of NaN.
  const loanTypes = ["chattel", "land-home", "conventional"] as const;
  const tiers = ["excellent", "good", "fair", "poor"] as const;
  for (const loanType of loanTypes) {
    for (const tier of tiers) {
      const rate = rateFor(loanType, tier);
      assert.equal(typeof rate, "number", `${loanType}/${tier}`);
      assert.ok(Number.isFinite(rate) && rate > 0, `${loanType}/${tier} = ${rate}`);
    }
  }
  assert.deepEqual(Object.keys(creditTierRates).sort(), [...loanTypes].sort());
});

test("a worse credit tier never costs less", () => {
  // Guards the table itself: a transposed digit that made "poor" cheaper than
  // "excellent" would be invisible in the arithmetic but wrong on the page.
  const order = ["excellent", "good", "fair", "poor"] as const;
  for (const loanType of ["chattel", "land-home", "conventional"] as const) {
    for (let i = 1; i < order.length; i++) {
      assert.ok(
        rateFor(loanType, order[i]) >= rateFor(loanType, order[i - 1]),
        `${loanType}: ${order[i]} (${rateFor(loanType, order[i])}) is cheaper than ${order[i - 1]} (${rateFor(loanType, order[i - 1])})`,
      );
    }
  }
});

test("the default state the calculator opens with is the chattel/good rate", () => {
  // The component seeds interestRate: 9.99 and creditTier "good", loanType
  // "chattel". Deriving the rate instead of storing it must produce the same
  // opening figure, or the calculator changes the moment it mounts.
  assert.equal(rateFor("chattel", "good"), 9.99);
});
