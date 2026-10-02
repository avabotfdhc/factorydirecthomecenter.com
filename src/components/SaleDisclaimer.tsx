"use client";

import { useState } from "react";
import { getSaleStatus, saleAmount, saleScope, saleTerms } from "@/lib/sale";

interface SaleDisclaimerProps {
  variant?: "compact" | "full" | "inline";
  className?: string;
}

// Sale terms. The discount, production month, and expiry all come from
// src/lib/sale.ts — they used to be typed into each of the three variants by
// hand, so a campaign change meant editing six separate strings and the terms
// would silently disagree with the prices the page was showing.
export function SaleDisclaimer({ variant = "full", className = "" }: SaleDisclaimerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Terms follow whichever campaign phase is running, so a stepped campaign's
  // second tier never inherits the first tier's percentage or production month.
  const sale = getSaleStatus();
  const { active, endDateLabel, productionMonth } = sale;
  const headline = `*Save ${saleAmount(sale)} off MSRP base price on ${saleScope(sale)}.`;
  // Past tense once the offer is over, so an archived page doesn't read as a
  // live offer to a visitor who lands on it later.
  const expiry = active
    ? `Offer expires ${endDateLabel}`
    : `Offer expired ${endDateLabel}`;

  if (variant === "compact") {
    return (
      <div className={`bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 ${className}`}>
        <p className="font-medium">
          {headline} Excludes options, delivery, setup, site work, taxes &amp; fees.
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="underline hover:text-amber-900 ml-1"
          >
            {isExpanded ? "Show less" : "See details"}
          </button>
        </p>
        {isExpanded && (
          <div className="mt-2 text-amber-700 space-y-1 border-t border-amber-200 pt-2">
            <p>New purchases only. Purchase agreement and deposit required by {endDateLabel}; order must be authorized for production in {productionMonth}. {expiry}.</p>
            <p>MSRP = Manufacturer&rsquo;s Suggested Retail Price. We do not provide financing; any loan is between you and a lender of your choosing.</p>
            <p>Not valid with any other specials or discounts and cannot be used in combination with other specials or discounts. The signed purchase agreement governs. See dealer for complete details.</p>
          </div>
        )}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <p className={`text-xs text-gray-500 ${className}`}>
        {headline} Excludes options and upgrades, delivery, setup, foundation, site work, skirting, taxes, title and fees.
        Not valid with any other specials or discounts and cannot be used in combination with other specials or discounts. Good on new purchases only;
        purchase agreement and deposit required by {endDateLabel}, and order must be authorized for production in {productionMonth}. {expiry}.
        We do not provide financing. The signed purchase agreement governs. See dealer for details.
      </p>
    );
  }

  // Full variant (default)
  return (
    <div className={`bg-white rounded-xl p-6 shadow-md border border-gray-200 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
        Sale Terms &amp; Conditions
      </h3>
      <div className="text-sm text-gray-600 space-y-3">
        {!active && (
          <p className="font-semibold text-gray-900">
            This promotion ended {endDateLabel}. The terms below describe that offer; call
            (260) 308-1457 for the discounts running today.
          </p>
        )}
        <p>
          <strong>*{saleAmount(sale).toUpperCase()} OFF MSRP BASE PRICE DISCLOSURE.</strong> {expiry}.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          {saleTerms(sale).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
          Factory Direct Homes Center LLC | 1211 State Road 8, Auburn, IN 46706 | (260) 308-1457
        </p>
      </div>
    </div>
  );
}
