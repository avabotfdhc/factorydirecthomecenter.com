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
  /**
   * True when the discount applies to every new Champion floor plan we sell,
   * at exactly `discountPercent`. Omitted (false) means "up to N% off select
   * floor plans", which is how every campaign before October 2026 was worded.
   * The ad copy and the disclaimer both read this, so they can never disagree
   * about which homes the offer covers.
   */
  allHomes?: boolean;
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
    discountPercent: 20,
    startDate: "2026-09-01",
    endDate: "2026-09-15",
    productionMonth: "September 2026",
  },
  {
    name: "Fall into Savings Sales Event",
    discountPercent: 20,
    startDate: "2026-09-16",
    endDate: "2026-09-16",
    productionMonth: "September 2026",
  },
  // Kyle raised the Fall event to 25% off for the rest of September
  // (2026-09-17). The 20% rows above are left as they ran — repricing them
  // would rewrite terms already quoted — so the increase starts today and
  // carries to the end of the month.
  {
    name: "Fall into Savings Sales Event",
    discountPercent: 25,
    startDate: "2026-09-17",
    endDate: "2026-09-30",
    productionMonth: "September 2026",
  },
  // Kyle, 2026-10-02: 20% off MSRP base price on every new Champion home, for
  // a purchase agreement signed and deposited by October 31 with the order
  // authorized for October 2026 production. Advertised Oct 2–3 at 20%.
  {
    name: "Fall into Savings Sales Event",
    discountPercent: 20,
    startDate: "2026-10-01",
    endDate: "2026-10-03",
    productionMonth: "October 2026",
    allHomes: true,
  },
  // Kyle raised October to 25% off (2026-10-04). As with September's raise, the
  // 20% row above is left as it ran, so the increase starts today and carries
  // to the end of the month on the same terms.
  {
    name: "Fall into Savings Sales Event",
    discountPercent: 25,
    startDate: "2026-10-04",
    endDate: "2026-10-31",
    productionMonth: "October 2026",
    allHomes: true,
  },
];

// Auburn, Indiana keeps Eastern time, and the offers are written as calendar
// days ("through September 15"), not instants. Comparing days in the dealer's
// own zone is what makes a phase change land at local midnight rather than 8pm
// the evening before — which matters most where two phases meet back to back.
const SALE_TIME_ZONE = "America/New_York";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Today's calendar date in the dealership's time zone, as "YYYY-MM-DD". */
export function todayInSaleZone(now: Date = new Date()): string {
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
  /** True when the discount covers every new floor plan at the full rate. */
  allHomes: boolean;
  /** "September 15, 2026" — the running phase's last day (or the last one that ran). */
  endDateLabel: string;
  /** Days remaining in the running phase, counting today. 0 when inactive. */
  daysLeft: number;
  /** True on the final three days of a phase. */
  endingSoon: boolean;
  /**
   * The next phase, and only when its discount actually differs — the cue for
   * "20% through Sept 15, then 15% through Sept 30". Adjacent phases at the
   * same rate are one offer as far as a shopper is concerned, so they are
   * merged into the dates above rather than announced as a change.
   */
  nextPhase: SalePhase | null;
}

/**
 * Campaign state as of `now`. Safe to call from both server and client: the
 * comparison is on calendar dates in a fixed time zone, so a server render and
 * a browser render agree regardless of where the visitor is.
 */
export function getSaleStatus(now: Date = new Date()): SaleStatus {
  return saleStatusForDay(todayInSaleZone(now));
}

/**
 * The sale status for one calendar day, as "YYYY-MM-DD" in the dealership's
 * time zone.
 *
 * Split out from `getSaleStatus` because the status is a pure function of the
 * day and nothing else: a client component can then snapshot the day — a
 * stable, comparable string — and recompute only when it actually rolls over,
 * instead of re-deriving a fresh object on every render. See AnnouncementBar.
 */
export function saleStatusForDay(today: string): SaleStatus {
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
      allHomes: false,
      endDateLabel: "",
      daysLeft: 0,
      endingSoon: false,
      nextPhase: null,
    };
  }

  // An event may be split into rows that carry the same discount — two halves
  // of one promotion, kept separate so either can be repriced later. Those read
  // to a shopper as a single offer, so walk forward through any contiguous run
  // at the same rate and treat the end of that run as the deadline. Without
  // this, a 20%-then-20% campaign would announce "Ends today" on the 15th while
  // the identical discount carried on to the 30th.
  const runEnd = phase ? endOfSameRateRun(phase) : reference;
  const daysLeft = phase ? daysBetween(today, runEnd.endDate) + 1 : 0;
  const nextPhase = phase ? phaseAfter(runEnd) : null;

  return {
    active: Boolean(phase),
    phase,
    name: reference.name,
    discountPercent: reference.discountPercent,
    productionMonth: reference.productionMonth,
    allHomes: Boolean(reference.allHomes),
    endDateLabel: formatSaleDate(phase ? runEnd.endDate : reference.endDate),
    daysLeft,
    endingSoon: Boolean(phase) && daysLeft <= 3,
    nextPhase,
  };
}

/** The phase that picks up the day after `phase` ends, if any. */
function phaseAfter(phase: SalePhase): SalePhase | null {
  return SALE_PHASES.find((p) => daysBetween(phase.endDate, p.startDate) === 1) ?? null;
}

/**
 * The last phase in the unbroken run of same-name, same-discount phases that
 * starts at `phase`. Returns `phase` itself when the next one differs.
 */
function endOfSameRateRun(phase: SalePhase): SalePhase {
  let last = phase;
  for (;;) {
    const next = phaseAfter(last);
    if (!next || next.discountPercent !== last.discountPercent || next.name !== last.name) return last;
    last = next;
  }
}

/** "Ends September 15, 2026" / "Ends tomorrow" / "Ended September 30, 2026". */
export function saleDeadlineLabel(status: SaleStatus = getSaleStatus()): string {
  if (!status.active) return status.endDateLabel ? `Ended ${status.endDateLabel}` : "";
  if (status.daysLeft === 1) return "Ends today";
  if (status.daysLeft === 2) return "Ends tomorrow";
  return `Ends ${status.endDateLabel}`;
}

/** "20%" for an every-home offer, "up to 25%" for a select-plans one. */
export function saleAmount(status: Pick<SaleStatus, "allHomes" | "discountPercent">): string {
  return status.allHomes ? `${status.discountPercent}%` : `up to ${status.discountPercent}%`;
}

/** Which homes the offer covers, phrased to follow "off MSRP base price on". */
export function saleScope(status: Pick<SaleStatus, "allHomes">): string {
  return status.allHomes ? "every new Champion floor plan" : "select new Champion floor plans";
}

/**
 * The full terms of the running (or most recent) offer, one sentence per
 * entry. `SaleDisclaimer` renders these on the site, and the campaign kit in
 * docs/campaigns copies the same sentences into every ad, so the terms a buyer
 * reads on Facebook are the terms on the sale page. Edit them here.
 */
export function saleTerms(status: SaleStatus = getSaleStatus()): string[] {
  const pct = `${status.discountPercent}%`;
  const deadline = status.endDateLabel;
  const covers = status.allHomes
    ? `every new Champion manufactured and modular floor plan ordered through Factory Direct Homes Center`
    : `select new Champion manufactured and modular floor plans ordered through Factory Direct Homes Center; the discount varies by plan, up to ${pct}`;
  return [
    `Offer: ${status.allHomes ? pct : `up to ${pct}`} off the MSRP base price on ${covers}.`,
    `MSRP means the Manufacturer's Suggested Retail Price set by Champion Home Builders for the base home on the date of order. The discount applies to the MSRP base price of the home only.`,
    `To qualify, a purchase agreement must be signed and the required deposit received by ${deadline}, and the order must be authorized for production in ${status.productionMonth}. Production and delivery dates are set by the manufacturer and are not guaranteed.`,
    `Excludes factory options and upgrades, freight and delivery, installation and set-up, foundation, site work, skirting, steps, air conditioning, utility connections, permits, taxes, title and other fees.`,
    `New purchases only. Not valid on prior purchases or orders already placed, not combinable with any other special, discount or promotion, has no cash value, and is non-transferable.`,
    `Factory Direct Homes Center does not provide, arrange or broker financing. Any financing is between the buyer and a lender of the buyer's own choosing and is subject to that lender's approval and terms.`,
    `The buyer is responsible for zoning, permits and all site work, foundation and set-up, performed by contractors the buyer hires.`,
    `Prices, specifications, features and availability are set by the manufacturer and may change without notice. Photos and renderings may show optional features not included in the base price. Not responsible for typographical or pictorial errors.`,
    `Factory Direct Homes Center may modify or end this promotion for orders not yet signed. The signed purchase agreement governs every sale and controls over any advertisement. Void where prohibited. See dealer for complete details.`,
  ];
}

/**
 * What a home sells for under a given discount. Sale prices are computed from
 * MSRP rather than stored, so a new campaign can never leave the previous
 * campaign's prices on the page.
 */
export function salePriceFor(msrp: number, discountPercent: number): number {
  return Math.round(msrp * (1 - discountPercent / 100));
}
