import Link from "next/link";

// One place that decides how a price may appear anywhere on the site.
//
// The rule, per Kyle: a home either shows all three figures — MSRP, sale price,
// and the savings between them — or it shows "Call for pricing". A lone number
// with no context is what invites the "your quote is higher than your website"
// conversation, so a partial price is never published.
//
// PricingDisclaimer carries the terms that must accompany any published figure.

export const SALES_PHONE = "(260) 308-1457";
export const SALES_PHONE_HREF = "tel:+12603081457";

export function formatUsd(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

/** The only thing shown when the full MSRP / sale price / savings set isn't available. */
export function CallForPricing({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={className}>
      <a
        href={SALES_PHONE_HREF}
        className={`font-bold ${tone === "light" ? "text-white hover:underline" : "text-[#2c7a7b] hover:underline"}`}
      >
        Call for pricing
      </a>
    </span>
  );
}

/**
 * MSRP, sale price and savings, all three labelled — or CallForPricing when a
 * discount isn't running or the numbers don't make a complete set.
 *
 * `size` only changes type scale; the three lines and their labels are fixed so
 * the same information appears on a card, a table row and a detail page.
 */
export function PriceTriple({
  msrp,
  salePrice,
  size = "md",
  className = "",
}: {
  msrp: number;
  salePrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const complete =
    Number.isFinite(msrp) && msrp > 0 &&
    typeof salePrice === "number" && Number.isFinite(salePrice) &&
    salePrice > 0 && salePrice < msrp;

  if (!complete) {
    return (
      <div className={className}>
        <CallForPricing className={size === "lg" ? "text-3xl" : size === "md" ? "text-2xl" : "text-base"} />
        <p className="text-xs text-gray-500 mt-1">
          We quote every home line by line — call and we&rsquo;ll price the plan and options you want.
        </p>
      </div>
    );
  }

  const savings = msrp - salePrice;
  const priceCls = size === "lg" ? "text-4xl" : size === "md" ? "text-2xl" : "text-lg";

  return (
    <dl className={className}>
      <div className="flex items-baseline gap-2">
        <dt className="text-sm text-gray-500">MSRP</dt>
        <dd className="text-sm text-gray-500">
          <s>{formatUsd(msrp)}</s>
        </dd>
      </div>
      <div className="flex items-baseline gap-2">
        <dt className="text-sm font-semibold text-gray-700">Sale price</dt>
        <dd className={`${priceCls} font-bold text-[#2c7a7b]`}>{formatUsd(salePrice)}</dd>
      </div>
      <div className="flex items-baseline gap-2">
        <dt className="text-sm font-semibold text-gray-700">You save</dt>
        <dd className="text-sm font-bold text-[#65a30d]">{formatUsd(savings)}</dd>
      </div>
    </dl>
  );
}

/**
 * Terms that accompany every published price.
 *
 * Written to cover the four exposures Kyle named — clerical and pricing errors,
 * manufacturer price increases, and prior purchases — plus the usual ones for a
 * built-to-order home: what the figure excludes, availability, and the fact
 * that no price is binding until a signed purchase agreement.
 *
 * This is commercial copy, not legal advice; it should be reviewed by counsel
 * before it is relied on.
 */
export function PricingDisclaimer({
  variant = "full",
  className = "",
}: {
  variant?: "full" | "short";
  className?: string;
}) {
  if (variant === "short") {
    return (
      <p className={`text-xs leading-relaxed text-gray-500 ${className}`}>
        Prices shown are for the home only and are subject to change without notice. They exclude
        delivery, setup, site work, options, taxes, title and fees. Errors are subject to
        correction; no price is binding until a signed purchase agreement.{" "}
        <Link href="/terms#pricing" className="underline hover:text-[#2c7a7b]">
          Full pricing terms
        </Link>
        .
      </p>
    );
  }

  return (
    <div
      id="pricing-terms"
      className={`bg-white rounded-xl p-6 shadow-md border border-gray-200 scroll-mt-24 ${className}`}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Pricing Terms &amp; Conditions
      </h3>
      <div className="text-sm text-gray-600 space-y-3">
        <p>
          <strong>Prices are estimates and subject to change without notice.</strong> Every home is
          built to order. No price, discount, quotation or figure shown on this website is an offer
          or a binding commitment, and none is final until set out in a written purchase agreement
          signed by both the buyer and Factory Direct Homes Center LLC and, where applicable,
          accepted by the manufacturer for production.
        </p>
        <p>
          <strong>Errors and omissions.</strong> Prices, specifications, dimensions, square
          footages, features, availability and photographs on this site are provided for general
          information and may contain typographical, clerical, data-entry, calculation, display or
          photographic errors, and may become out of date. We reserve the right to correct any such
          error at any time, and to refuse, cancel or rescind any order, quotation or purchase based
          on an erroneous, omitted or misstated price — including after an order has been submitted
          or acknowledged — and to notify you and give you the choice of proceeding at the corrected
          price or cancelling. Nothing here waives our right to correct an error.
        </p>
        <p>
          <strong>Manufacturer price increases and surcharges.</strong> Prices depend on the
          manufacturer&rsquo;s current published cost, which we do not control. Champion Home
          Builders may change base prices, option prices, freight, or apply material, tariff, energy
          or other surcharges at any time. Where a price increase, surcharge or specification change
          takes effect before your home is authorized for production, the increase may be passed
          through to you, and we will tell you before proceeding. Quoted prices are valid only for
          the period stated on the quotation.
        </p>
        <p>
          <strong>Previous purchases and prior sales.</strong> Advertised prices and promotional
          discounts apply to new orders placed during the promotional period only. They are not
          retroactive, cannot be applied to a home already ordered, purchased, delivered or under a
          signed agreement, and no price adjustment, credit, rebate or refund will be made on a
          prior purchase. Offers cannot be combined with any other offer, discount, rebate or prior
          sale, and all homes are subject to prior sale.
        </p>
        <p>
          <strong>What a price includes.</strong> Figures shown are for the base home only at
          factory-direct pricing. They exclude delivery, setup and installation, site work,
          foundation, skirting, steps, utility connections, permits, options and upgrades, sales and
          other taxes, title and documentary fees, insurance, and land. MSRP means the
          manufacturer&rsquo;s suggested retail price and is a reference figure; it is not
          necessarily a price at which homes have been sold. Savings are calculated against MSRP.
        </p>
        <p>
          <strong>Availability and financing.</strong> Models, floor plans, options, colours and
          finishes are subject to availability and change without notice, and may be discontinued by
          the manufacturer. Financing, where mentioned, is subject to credit approval by a
          third-party lender; we do not guarantee approval, rates or terms. Pricing applies only
          within our normal Indiana, Ohio and Michigan market area.
        </p>
        <p>
          <strong>Please confirm before you rely on a price.</strong> Call{" "}
          <a href={SALES_PHONE_HREF} className="text-[#2c7a7b] font-semibold">
            {SALES_PHONE}
          </a>{" "}
          or visit the showroom for a current, written, line-item quotation for the exact home and
          options you want. In the event of any conflict between this website and a signed purchase
          agreement, the purchase agreement controls.
        </p>
        <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
          Factory Direct Homes Center LLC | 1211 State Road 8, Auburn, IN 46706 | {SALES_PHONE}
        </p>
      </div>
    </div>
  );
}
