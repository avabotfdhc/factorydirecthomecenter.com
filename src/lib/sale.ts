// Single source of truth for the current promotional campaign.
//
// Before this file the campaign's discount, production month, and end date were
// retyped into the sale page, the clearance page, the detail pages, the sale
// disclaimer, and the page registry — five places that had to be edited in
// lockstep or the site would advertise terms it no longer honoured. Worse, an
// expired campaign kept rendering "LIMITED TIME OFFER … Ends <past date>" with
// live prices, because nothing compared the end date to today.
//
// Everything about the campaign now lives here, and `getSaleStatus()` decides
// what the pages render. When a campaign ends the pages fall back to an honest
// "this offer has ended" state on their own — no deploy required.

export interface SaleCampaign {
  /** Headline discount, as a percentage off MSRP base price. */
  discountPercent: number;
  /** Inclusive last day of the offer, as a local calendar date (YYYY-MM-DD). */
  endDate: string;
  /** Month an order must be authorized for production in, e.g. "August 2026". */
  productionMonth: string;
}

// ── The live campaign ───────────────────────────────────────────────────────
// To run the next promotion, edit these three values (and the sale homes in
// src/app/homes-on-sale/saleHomes.ts). Nothing else needs to change.
export const SALE: SaleCampaign = {
  discountPercent: 25,
  endDate: "2026-08-31",
  productionMonth: "August 2026",
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** "2026-08-31" → "August 31, 2026". Parsed as a plain calendar date (no TZ shift). */
export function formatSaleDate(iso: string = SALE.endDate): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export interface SaleStatus {
  /** True while the offer is still honoured (through the end of `endDate`). */
  active: boolean;
  /** Whole days remaining, counting today. 0 once the offer has expired. */
  daysLeft: number;
  /** True on the final three days — pages show a sharper urgency line. */
  endingSoon: boolean;
  /** "August 31, 2026" */
  endDateLabel: string;
}

/**
 * Campaign state as of `now`. Dates are compared in UTC calendar days so the
 * server-rendered page and the visitor's browser can't disagree about whether
 * the last day has passed — a mismatch there would hydrate-error the page.
 */
export function getSaleStatus(now: Date = new Date()): SaleStatus {
  const [y, m, d] = SALE.endDate.split("-").map(Number);
  const end = Date.UTC(y, m - 1, d);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const daysLeft = Math.round((end - today) / DAY_MS);
  const active = daysLeft >= 0;

  return {
    active,
    daysLeft: active ? daysLeft + 1 : 0, // inclusive of the final day
    endingSoon: active && daysLeft <= 2,
    endDateLabel: formatSaleDate(),
  };
}

/** "Ends August 31, 2026" / "Ends tomorrow" / "Ended August 31, 2026". */
export function saleDeadlineLabel(status: SaleStatus = getSaleStatus()): string {
  if (!status.active) return `Ended ${status.endDateLabel}`;
  if (status.daysLeft === 1) return "Ends today";
  if (status.daysLeft === 2) return "Ends tomorrow";
  return `Ends ${status.endDateLabel}`;
}
