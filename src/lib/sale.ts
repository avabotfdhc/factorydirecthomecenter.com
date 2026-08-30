// Single source of truth for promotional campaigns.
//
// Campaigns are declared as a list of dated phases. `getSaleStatus()` picks the
// phase covering today, so a new campaign takes over on its start date with no
// deploy, no cron job, and no one remembering to flip a switch — and when the
// last phase ends the pages fall back to an honest "this offer has ended" state
// on their own.
//
// This replaced a scheme where the discount, production month, and end date
// were retyped into the sale page, the clearance page, the detail pages, the
// sale disclaimer, and the page registry — five places that had to be edited in
// lockstep or the site would advertise terms it no longer honoured.

export interface SalePhase {
  /** Event name, shown to shoppers. Phases of one event share a name. */
  name: string;
  /** Headline discount, as a percentage off MSRP base price. */
  discountPercent: number;
  /** First day the phase is honoured (inclusive), as a calendar date. */
  startDate: string;
  /** Last day the phase is honoured (inclusive). */
  endDate: string;
  /** Month an order must be authorized for production in, e.g. "September 2026". */
  productionMonth: string;
}

// ── The campaign calendar ───────────────────────────────────────────────────
// Ordered by start date, non-overlapping. To schedule the next promotion, add
// a phase here — it goes live on its own start date. Sale home MSRPs live in
// src/lib/sale-homes.ts; each home's sale price is derived from the running
// phase's discount, so it can never be left showing a previous campaign's
// numbers.
export const SALE_PHASES: SalePhase[] = [
  {
    name: "Summer Savings Event",
    discountPercent: 25,
    startDate: "2026-06-13",
    endDate: "2026-08-31",
    productionMonth: "August 2026",
  },
  {
    name: "Fall into Savings Sales Event",
    discountPercent: 22,
    startDate: "2026-09-01",
    endDate: "2026-09-15",
    productionMonth: "September 2026",
  },
  {
    name: "Fall into Savings Sales Event",
    discountPercent: 18,
    startDate: "2026-09-16",
    endDate: "2026-09-30",
    productionMonth: "September 2026",
  },
];

// Auburn, Indiana keeps Eastern time, and the offers are written as calendar
// days ("through September 15"), not instants. Comparing days in the dealer's
// own zone is what makes a phase change land at local midnight rather than 8pm
// the evening before — which matters most where two phases meet back to back.
const SALE_TIME_ZONE = "America/New_York";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Today's calendar date in the dealership's time zone, as "YYYY-MM-DD". */
function todayInSaleZone(now: Date): string {
  // en-CA formats as YYYY-MM-DD, which is also lexicographically sortable —
  // so phase windows can be compared as plain strings, with no date math and
  // no chance of a UTC-vs-local off-by-one.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SALE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** "2026-09-15" → "September 15, 2026". Parsed as a plain calendar date. */
export function formatSaleDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Whole days from `from` to `to`, both plain "YYYY-MM-DD" calendar dates. */
function daysBetween(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / DAY_MS);
}

export interface SaleStatus {
  /** True while a phase is running and its discount is honoured. */
  active: boolean;
  /** The running phase, or null outside any phase. */
  phase: SalePhase | null;
  /** Event name for display. Falls back to the nearest phase when inactive. */
  name: string;
  /** Discount to advertise right now. */
  discountPercent: number;
  /** Production month for the terms. */
  productionMonth: string;
  /** "September 15, 2026" — the running phase's last day (or the last one that ran). */
  endDateLabel: string;
  /** Days remaining in the running phase, counting today. 0 when inactive. */
  daysLeft: number;
  /** True on the final three days of a phase. */
  endingSoon: boolean;
  /**
   * The phase that starts the day after this one ends. Lets the page say
   * "22% through Sept 15, then 18% through Sept 30" instead of implying the
   * whole event ends when the first phase does.
   */
  nextPhase: SalePhase | null;
}

/**
 * Campaign state as of `now`. Safe to call from both server and client: the
 * comparison is on calendar dates in a fixed time zone, so a server render and
 * a browser render agree regardless of where the visitor is.
 */
export function getSaleStatus(now: Date = new Date()): SaleStatus {
  const today = todayInSaleZone(now);

  const phase = SALE_PHASES.find((p) => today >= p.startDate && today <= p.endDate) ?? null;

  // Outside any phase, fall back to whichever phase is nearest in time so the
  // "this offer has ended" (or pre-launch) copy still names real terms.
  const reference =
    phase ??
    [...SALE_PHASES].reverse().find((p) => today > p.endDate) ??
    SALE_PHASES.find((p) => today < p.startDate) ??
    null;

  if (!reference) {
    // No campaigns declared at all — render everything in the "no offer" state.
    return {
      active: false,
      phase: null,
      name: "",
      discountPercent: 0,
      productionMonth: "",
      endDateLabel: "",
      daysLeft: 0,
      endingSoon: false,
      nextPhase: null,
    };
  }

  const daysLeft = phase ? daysBetween(today, phase.endDate) + 1 : 0;
  const nextPhase = phase
    ? SALE_PHASES.find((p) => daysBetween(phase.endDate, p.startDate) === 1) ?? null
    : null;

  return {
    active: Boolean(phase),
    phase,
    name: reference.name,
    discountPercent: reference.discountPercent,
    productionMonth: reference.productionMonth,
    endDateLabel: formatSaleDate(reference.endDate),
    daysLeft,
    endingSoon: Boolean(phase) && daysLeft <= 3,
    nextPhase,
  };
}

/** "Ends September 15, 2026" / "Ends tomorrow" / "Ended September 30, 2026". */
export function saleDeadlineLabel(status: SaleStatus = getSaleStatus()): string {
  if (!status.active) return status.endDateLabel ? `Ended ${status.endDateLabel}` : "";
  if (status.daysLeft === 1) return "Ends today";
  if (status.daysLeft === 2) return "Ends tomorrow";
  return `Ends ${status.endDateLabel}`;
}

/**
 * What a home sells for under a given discount. Sale prices are computed from
 * MSRP rather than stored, so a new campaign can never leave the previous
 * campaign's prices on the page.
 */
export function salePriceFor(msrp: number, discountPercent: number): number {
  return Math.round(msrp * (1 - discountPercent / 100));
}
