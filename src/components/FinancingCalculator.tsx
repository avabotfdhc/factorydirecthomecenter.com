"use client";

import { useMemo, useState } from "react";
import { trackPhoneClick } from "@/lib/analytics";

// Chattel vs land-home payment estimator for /financing.
//
// Rates are illustrative market estimates for the loan types our lenders
// write (chattel ≈ 9.5% over 20 years, land-home ≈ 7.25% over 30 years); the
// Regulation Z disclosure below the result is mandatory and must stay with it.

type LoanType = "chattel" | "landHome";

const LOANS: Record<LoanType, { label: string; sub: string; years: number; apr: number }> = {
  chattel: { label: "Chattel Loan", sub: "Home only · 20-year term · ~9.5% APR", years: 20, apr: 9.5 },
  landHome: { label: "Land-Home Loan", sub: "Home + land · 30-year term · ~7.25% APR", years: 30, apr: 7.25 },
};

const PRICE = { min: 50_000, max: 250_000, step: 1_000 };
const DOWN = { min: 5_000, max: 75_000, step: 500 };

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function monthlyPI(principal: number, apr: number, years: number): number {
  if (principal <= 0) return 0;
  const r = apr / 100 / 12;
  const n = years * 12;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

export function FinancingCalculator() {
  const [price, setPrice] = useState(120_000);
  const [down, setDown] = useState(10_000);
  const [loan, setLoan] = useState<LoanType>("chattel");

  const cfg = LOANS[loan];
  const principal = Math.max(price - Math.min(down, price), 0);
  const payment = useMemo(() => monthlyPI(principal, cfg.apr, cfg.years), [principal, cfg]);
  const totalInterest = payment * cfg.years * 12 - principal;

  const sliderCls = "w-full accent-[var(--color-teal)] h-2 cursor-pointer";

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-charcoal)]/8 shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Inputs */}
        <div className="lg:col-span-3 p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--color-cream-dark)] rounded-xl" role="radiogroup" aria-label="Loan type">
            {(Object.keys(LOANS) as LoanType[]).map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={loan === k}
                onClick={() => setLoan(k)}
                className={`rounded-lg px-3 py-3 text-left transition-colors ${
                  loan === k ? "bg-[var(--color-teal)] text-white shadow" : "text-[var(--color-charcoal)] hover:bg-white"
                }`}
              >
                <span className="block text-sm font-bold">{LOANS[k].label}</span>
                <span className={`block text-[11px] mt-0.5 ${loan === k ? "text-white/80" : "text-[var(--color-gray)]"}`}>
                  {LOANS[k].sub}
                </span>
              </button>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="fc-price" className="text-sm font-semibold text-[var(--color-charcoal)]">
                Home &amp; options price
              </label>
              <span className="font-serif text-xl font-semibold text-[var(--color-teal)]">{money(price)}</span>
            </div>
            <input
              id="fc-price"
              type="range"
              min={PRICE.min}
              max={PRICE.max}
              step={PRICE.step}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className={sliderCls}
            />
            <div className="flex justify-between text-[11px] text-[var(--color-gray)] mt-1">
              <span>{money(PRICE.min)}</span>
              <span>{money(PRICE.max)}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="fc-down" className="text-sm font-semibold text-[var(--color-charcoal)]">
                Down payment
              </label>
              <span className="font-serif text-xl font-semibold text-[var(--color-teal)]">
                {money(down)} <span className="text-sm text-[var(--color-gray)] font-sans">({Math.round((down / price) * 100)}%)</span>
              </span>
            </div>
            <input
              id="fc-down"
              type="range"
              min={DOWN.min}
              max={DOWN.max}
              step={DOWN.step}
              value={down}
              onChange={(e) => setDown(Number(e.target.value))}
              className={sliderCls}
            />
            <div className="flex justify-between text-[11px] text-[var(--color-gray)] mt-1">
              <span>{money(DOWN.min)}</span>
              <span>{money(DOWN.max)}</span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-teal)]/30 bg-[var(--color-teal)]/5 p-4 sm:p-5">
            <p className="text-sm font-bold text-[var(--color-charcoal)]">
              Paying Cash or Utilizing Land Equity? Ask About Factory Direct Preferred Cash Discounts.
            </p>
            <p className="text-xs text-[var(--color-gray)] mt-1">
              Cash and land-equity buyers skip lender fees and qualify for our preferred pricing on select floor plans.
            </p>
          </div>
        </div>

        {/* Result */}
        <div className="lg:col-span-2 bg-[var(--color-charcoal)] text-white p-6 sm:p-8 flex flex-col">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-300">Estimated monthly payment</p>
          <p className="font-serif text-5xl font-semibold mt-3">
            {money(Math.round(payment))}
            <span className="text-base font-sans font-normal text-slate-300">/mo</span>
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Principal &amp; interest · {cfg.years}-year term at {cfg.apr}% APR (estimate)
          </p>
          <dl className="mt-6 space-y-2 text-sm border-t border-white/10 pt-5">
            <div className="flex justify-between"><dt className="text-slate-300">Amount financed</dt><dd className="font-semibold">{money(principal)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-300">Total interest</dt><dd className="font-semibold">{money(Math.round(Math.max(totalInterest, 0)))}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-300">Payments</dt><dd className="font-semibold">{cfg.years * 12}</dd></div>
          </dl>
          <a
            href="tel:2603081457"
            onClick={() => trackPhoneClick("financing_calculator")}
            className="mt-auto pt-6 block"
          >
            <span className="flex items-center justify-center gap-2 w-full bg-[var(--color-teal)] hover:bg-[var(--color-teal-dark)] text-white rounded-lg py-3.5 text-sm font-bold tracking-widest uppercase transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us · (260) 308-1457
            </span>
          </a>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-5 border-t border-[var(--color-charcoal)]/8 bg-[var(--color-cream)]">
        <p className="text-[11px] leading-relaxed text-[var(--color-gray)]">
          <strong>Truth in Lending / Regulation Z disclosure.</strong> Monthly payment estimates are provided for
          illustrative purposes only and do not constitute an offer of credit, a loan commitment, or a rate lock.
          Actual terms, interest rates, and loan availability depend on individual borrower credit qualification
          through third-party lenders (including 21st Mortgage, Triad Financial Services, and Credit Human). Taxes,
          insurance, site prep, and fees are not included.
        </p>
      </div>
    </div>
  );
}
