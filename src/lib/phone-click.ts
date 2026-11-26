// Site-wide phone-click measurement, kept free of React and gtag so the rules
// can be unit-tested in node.
//
// Until 2026-11-25 a call was only counted where a component remembered to add
// `onClick={() => trackPhoneClick(...)}`: the header, the footer, the mobile
// action bar and a handful of pages. Every other `tel:` link on the site — the
// location pages, the guides, Ava's replies, the showroom page — was invisible
// to GA4 and Meta. One document-level listener now covers all of them, present
// and future, and the hand-labelled calls keep their own labels.

/** A second report inside this window is the same tap, not a second call. */
export const PHONE_CLICK_DEDUPE_MS = 1000;

/**
 * Remembers when a phone click was last reported. React 17+ delegates onClick
 * to the root container, so a component's own `trackPhoneClick("header_nav")`
 * runs BEFORE a bubble-phase listener on `document`; the listener then asks
 * this gate and stands down, which is what keeps one tap at one event.
 */
export function createPhoneClickGate(now: () => number = Date.now) {
  let last = Number.NEGATIVE_INFINITY;
  return {
    /** Record a report made by a component's own handler. */
    mark() {
      last = now();
    },
    /** True (and records the report) unless one was made moments ago. */
    shouldReport() {
      const t = now();
      if (t - last < PHONE_CLICK_DEDUPE_MS) return false;
      last = t;
      return true;
    },
  };
}

/** The minimum of an element this module needs; lets tests pass plain objects. */
export interface ClosestCapable {
  closest(selector: string): unknown;
}

/**
 * Where on the page the link sits. An explicit `data-track-location` wins;
 * otherwise the nearest landmark. Never the link text or the number itself.
 */
export function phoneClickLocation(link: ClosestCapable & { getAttribute(name: string): string | null }): string {
  const explicit = link.getAttribute("data-track-location");
  if (explicit) return explicit;
  if (link.closest("header")) return "header";
  if (link.closest("footer")) return "footer";
  if (link.closest("[role='dialog']")) return "dialog";
  if (link.closest("aside")) return "aside";
  return "page_body";
}

/** "/locations/fort-wayne" → "locations"; "/" → "home". A coarse page type for reports. */
export function pageTypeFromPath(pathname: string): string {
  const first = pathname.split("/").filter(Boolean)[0];
  return first ? first.toLowerCase() : "home";
}
