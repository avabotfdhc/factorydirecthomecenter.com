// The amortisation behind the financing calculator.
//
// Pulled out of src/components/PaymentCalculator.tsx so the arithmetic can be
// tested without rendering anything. The component used to compute all of this
// inside two effects that wrote the results back into state — so every input
// change rendered once with stale figures and again with fresh ones, and the
// numbers a buyer saw were only ever reachable through the DOM. The formula
// below is carried across unchanged, character for character, and
// tests/payment-math.test.ts pins the outputs it produced beforehand.
//
// Nothing here is a quote. The rate table is indicative, the calculator is
// clearly labelled an estimate, and the lender list (src/lib/lenders.ts) is
// where a buyer goes for a real number.

export type LoanType = "chattel" | "land-home" | "conventional";
export type CreditTier = "excellent" | "good" | "fair" | "poor";

/** Indicative APRs by product and credit tier. Not an offer. */
export const creditTierRates: Record<LoanType, Record<CreditTier, number>> = {
  chattel: {
    excellent: 7.99,
    good: 9.99,
    fair: 12.99,
    poor: 15.99,
  },
  "land-home": {
    excellent: 6.5,
    good: 7.0,
    fair: 7.5,
    poor: 8.5,
  },
  conventional: {
    excellent: 6.75,
    good: 7.25,
    fair: 8.0,
    poor: 9.5,
  },
};

/**
 * The rate for a product and tier.
 *
 * This is the one and only source of the calculator's interest rate: it is
 * derived, never stored. It used to live in component state, written there by
 * an effect that watched the two fields it depends on, which meant changing
 * the credit tier painted the old rate first.
 */
export function rateFor(loanType: LoanType, creditTier: CreditTier): number {
  return creditTierRates[loanType][creditTier];
}

export interface AmortisationInput {
  homePrice: number;
  downPayment: number;
  /** Annual percentage rate, e.g. 9.99. */
  interestRate: number;
  /** Years. */
  loanTerm: number;
}

export interface Amortisation {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
}

/**
 * Standard fixed-rate amortisation.
 *
 * A down payment that meets or exceeds the price leaves nothing to finance, so
 * the payment is zero and the total cost is simply what was put down — the
 * same short-circuit the component had.
 */
export function amortise({
  homePrice,
  downPayment,
  interestRate,
  loanTerm,
}: AmortisationInput): Amortisation {
  const principal = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  if (principal <= 0) {
    return { monthlyPayment: 0, totalInterest: 0, totalCost: downPayment };
  }

  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalCost = monthlyPayment * numberOfPayments + downPayment;
  const totalInterest = totalCost - homePrice;

  return { monthlyPayment, totalInterest, totalCost };
}
