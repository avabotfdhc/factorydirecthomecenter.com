"use client";

import { useState, useEffect } from "react";
import { H3, H4 } from "./Heading";
import { FadeIn } from "./VisualEffects";

interface CalculatorState {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  creditTier: "excellent" | "good" | "fair" | "poor";
  loanType: "chattel" | "land-home" | "conventional";
}

const creditTierRates: Record<string, Record<string, number>> = {
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

const loanTypeInfo = {
  chattel: {
    name: "Chattel Loan",
    description: "For homes on leased land. Higher rates, shorter terms, faster approval.",
    maxTerm: 20,
    minDown: 5,
  },
  "land-home": {
    name: "Land-Home Package",
    description: "Finances the home and land together. Longer terms, competitive rates.",
    maxTerm: 30,
    minDown: 5,
  },
  conventional: {
    name: "Conventional",
    description: "For modular homes on permanent foundations. Best rates.",
    maxTerm: 30,
    minDown: 5,
  },
};

export function PaymentCalculator() {
  const [state, setState] = useState<CalculatorState>({
    homePrice: 85000,
    downPayment: 8500,
    downPaymentPercent: 10,
    interestRate: 9.99,
    loanTerm: 20,
    creditTier: "good",
    loanType: "chattel",
  });

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const rate = creditTierRates[state.loanType][state.creditTier];
    setState((prev) => ({ ...prev, interestRate: rate }));
  }, [state.creditTier, state.loanType]);

  useEffect(() => {
    const principal = state.homePrice - state.downPayment;
    const monthlyRate = state.interestRate / 100 / 12;
    const numberOfPayments = state.loanTerm * 12;

    if (principal <= 0) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      setTotalCost(state.downPayment);
      return;
    }

    const monthlyPaymentCalc =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalCostCalc = monthlyPaymentCalc * numberOfPayments + state.downPayment;
    const totalInterestCalc = totalCostCalc - state.homePrice;

    setMonthlyPayment(monthlyPaymentCalc);
    setTotalInterest(totalInterestCalc);
    setTotalCost(totalCostCalc);
  }, [state]);

  const handleHomePriceChange = (value: number) => {
    const downPayment = (value * state.downPaymentPercent) / 100;
    setState((prev) => ({ ...prev, homePrice: value, downPayment }));
  };

  const handleDownPaymentPercentChange = (percent: number) => {
    const downPayment = (state.homePrice * percent) / 100;
    setState((prev) => ({ ...prev, downPaymentPercent: percent, downPayment }));
  };

  const handleDownPaymentChange = (value: number) => {
    const percent = (value / state.homePrice) * 100;
    setState((prev) => ({ ...prev, downPayment: value, downPaymentPercent: percent }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <FadeIn direction="up">
      <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-charcoal)]/5 overflow-hidden">
        <div className="bg-[var(--color-teal)] text-white p-6 lg:p-8">
          <H3 className="font-serif text-2xl lg:text-3xl font-light mb-2">
            Monthly Payment Calculator
          </H3>
          <p className="text-white/80">
            Estimate your monthly payment based on home price, down payment, and financing options.
          </p>
        </div>

        <div className="p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Loan Type */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">
                  Loan Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(loanTypeInfo) as Array<keyof typeof loanTypeInfo>).map((type) => (
                    <button
                      key={type}
                      onClick={() => setState((prev) => ({ ...prev, loanType: type }))}
                      className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        state.loanType === type
                          ? "bg-[var(--color-teal)] text-white"
                          : "bg-[var(--color-cream-dark)] text-[var(--color-charcoal)] hover:bg-[var(--color-teal)]/10"
                      }`}
                    >
                      {loanTypeInfo[type].name}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-gray)] mt-2">
                  {loanTypeInfo[state.loanType].description}
                </p>
              </div>

              {/* Home Price */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">
                  Home Price
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-[var(--color-charcoal)]">$</span>
                  <input
                    type="number"
                    value={state.homePrice}
                    onChange={(e) => handleHomePriceChange(Number(e.target.value))}
                    className="flex-1 px-4 py-3 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] font-semibold focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
                    min="30000"
                    max="500000"
                    step="1000"
                  />
                </div>
                <input
                  type="range"
                  value={state.homePrice}
                  onChange={(e) => handleHomePriceChange(Number(e.target.value))}
                  className="w-full mt-3 accent-[var(--color-teal)]"
                  min="30000"
                  max="300000"
                  step="5000"
                />
                <div className="flex justify-between text-xs text-[var(--color-gray)] mt-1">
                  <span>$30k</span>
                  <span>$300k</span>
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">
                  Down Payment ({state.downPaymentPercent.toFixed(0)}%)
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-[var(--color-charcoal)]">$</span>
                  <input
                    type="number"
                    value={state.downPayment}
                    onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                    className="flex-1 px-4 py-3 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] font-semibold focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
                    min="0"
                    max={state.homePrice}
                    step="1000"
                  />
                </div>
                <input
                  type="range"
                  value={state.downPaymentPercent}
                  onChange={(e) => handleDownPaymentPercentChange(Number(e.target.value))}
                  className="w-full mt-3 accent-[var(--color-teal)]"
                  min={loanTypeInfo[state.loanType].minDown}
                  max="50"
                  step="1"
                />
                <div className="flex justify-between text-xs text-[var(--color-gray)] mt-1">
                  <span>{loanTypeInfo[state.loanType].minDown}% min</span>
                  <span>50%</span>
                </div>
              </div>

              {/* Credit Tier */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">
                  Credit Score
                </label>
                <select
                  value={state.creditTier}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, creditTier: e.target.value as CalculatorState["creditTier"] }))
                  }
                  className="w-full px-4 py-3 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
                >
                  <option value="excellent">Excellent (750+)</option>
                  <option value="good">Good (700-749)</option>
                  <option value="fair">Fair (650-699)</option>
                  <option value="poor">Poor (600-649)</option>
                </select>
              </div>

              {/* Loan Term */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">
                  Loan Term
                </label>
                <div className="flex gap-2">
                  {[10, 15, 20, 25, 30]
                    .filter((term) => term <= loanTypeInfo[state.loanType].maxTerm)
                    .map((term) => (
                      <button
                        key={term}
                        onClick={() => setState((prev) => ({ ...prev, loanTerm: term }))}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          state.loanTerm === term
                            ? "bg-[var(--color-teal)] text-white"
                            : "bg-[var(--color-cream-dark)] text-[var(--color-charcoal)] hover:bg-[var(--color-teal)]/10"
                        }`}
                      >
                        {term} yr
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-[var(--color-cream-dark)] rounded-xl p-6 lg:p-8 flex flex-col justify-center">
              <div className="text-center mb-8">
                <p className="text-sm text-[var(--color-gray)] mb-2">Estimated Monthly Payment</p>
                <div className="text-5xl lg:text-6xl font-serif font-bold text-[var(--color-charcoal)]">
                  {formatCurrency(monthlyPayment)}
                </div>
                <p className="text-sm text-[var(--color-gray)] mt-2">
                  at {state.interestRate}% APR
                </p>
              </div>

              <div className="space-y-4 border-t border-[var(--color-charcoal)]/10 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-gray)]">Home Price</span>
                  <span className="font-semibold">{formatCurrency(state.homePrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-gray)]">Down Payment</span>
                  <span className="font-semibold text-[var(--color-lime-dark)]">
                    -{formatCurrency(state.downPayment)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-gray)]">Loan Amount</span>
                  <span className="font-semibold">
                    {formatCurrency(state.homePrice - state.downPayment)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[var(--color-charcoal)]/10">
                  <span className="text-[var(--color-gray)]">Total Interest</span>
                  <span className="font-semibold">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-[var(--color-charcoal)]">Total Cost</span>
                  <span className="font-bold text-[var(--color-charcoal)]">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <a
                  href="tel:+12603081457"
                  className="block w-full text-center bg-[var(--color-teal)] text-white px-6 py-4 text-sm font-bold tracking-widest uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
                >
                  Get Pre-Qualified
                </a>
                <p className="text-xs text-center text-[var(--color-gray)]">
                  This is an estimate. Actual rates and terms may vary based on credit approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
