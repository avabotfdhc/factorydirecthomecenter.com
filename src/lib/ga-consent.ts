// GA4 bootstrap and Consent Mode v2, kept free of React and DOM imports so the
// strings and the opt-out handshake can be unit-tested in node.
//
// Why this exists (2026-10-17): GA4 reported "traffic tanked" from mid-August,
// while the site itself was healthy. Two August changes had put every tag
// behind BOTH a first-interaction gate (6 s idle fallback) AND `lazyOnload`,
// so a visitor who read the page for five seconds and left was never counted
// — measured in a real browser: gtag.js was not even *requested* until 6.3 s
// after navigation on an idle visit. The consent model (src/lib/consent.ts) is
// notice-and-opt-out and was never the main loss; it only withholds tags from
// decliners and Global Privacy Control browsers, which it must keep doing.
//
// The fix: GA4 loads as soon as the visitor is *allowed* (no interaction
// gate), declares Consent Mode defaults, and a later Decline revokes consent
// and disables the property for the rest of the page instead of leaving the
// tag running until the next navigation.

/** The four Consent Mode v2 signals Google reads. */
export const GA_CONSENT_TYPES = [
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
  "analytics_storage",
] as const;

export type GaConsentType = (typeof GA_CONSENT_TYPES)[number];
export type GaConsentState = Record<GaConsentType, "granted" | "denied">;

const stateOf = (value: "granted" | "denied"): GaConsentState =>
  Object.fromEntries(GA_CONSENT_TYPES.map((k) => [k, value])) as GaConsentState;

/**
 * Consent defaults for a visitor the opt-out model allows. Everything is
 * `granted` because that is honestly what happens today: the tags run with
 * cookies until the visitor says no. Declaring it (rather than loading with no
 * consent command at all) is what makes a later `update` to `denied` take
 * effect mid-page, and it stamps every hit with a consent state (`gcs`) so GA
 * can tell consented traffic from modelled traffic if the model ever changes.
 */
export const GA_CONSENT_GRANTED: GaConsentState = stateOf("granted");
export const GA_CONSENT_DENIED: GaConsentState = stateOf("denied");

/** The `window` flag Google's gtag.js checks before sending any hit for an ID. */
export function gaDisableKey(measurementId: string): string {
  return `ga-disable-${measurementId}`;
}

const jsObject = (state: GaConsentState) =>
  `{${GA_CONSENT_TYPES.map((k) => `${k}:'${state[k]}'`).join(",")}}`;

/**
 * The inline script that runs alongside gtag.js. One `config` call (the old
 * version made two, one of them only to set `allow_enhanced_conversions`),
 * preceded by the Consent Mode default — Google requires the default to be
 * queued before `config`. `custom_map` is gone: it was a Universal Analytics
 * feature that GA4 ignores.
 */
export function gaBootstrapScript(measurementId: string): string {
  if (!/^[A-Z0-9-]+$/i.test(measurementId)) throw new Error(`bad GA measurement id: ${measurementId}`);
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    `gtag('consent','default',${jsObject(GA_CONSENT_GRANTED)});`,
    "gtag('js',new Date());",
    `gtag('config','${measurementId}',{send_page_view:true,cookie_flags:'SameSite=None;Secure',allow_enhanced_conversions:true});`,
  ].join("");
}

/** The parts of `window` the opt-out handshake touches. */
export interface TrackingWindow {
  gtag?: (command: string, ...args: unknown[]) => void;
  clarity?: (command: string, ...args: unknown[]) => void;
}

/**
 * What happens when a visitor who already has tags running clicks Decline.
 * Scripts cannot be unloaded, but they can be told to stop:
 *
 *   - Consent Mode `update` to all-denied, so gtag stops reading and writing
 *     its cookies at once.
 *   - `window['ga-disable-<ID>'] = true`, Google's documented opt-out switch,
 *     so gtag sends **no further hit at all** for this property — not even the
 *     cookieless pings Consent Mode would otherwise keep sending.
 *   - Clarity is asked to stop recording and to withdraw cookie consent.
 *
 * Before this, a decline mid-visit left every tag running normally until the
 * next navigation. Every call is optional: on a page where a tag never loaded
 * there is nothing to stop.
 */
export function revokeTracking(win: TrackingWindow, measurementId: string): void {
  (win as Record<string, unknown>)[gaDisableKey(measurementId)] = true;
  try {
    win.gtag?.("consent", "update", GA_CONSENT_DENIED);
  } catch {
    /* a tag that has not finished loading has nothing to update */
  }
  try {
    win.clarity?.("consent", false);
    win.clarity?.("stop");
  } catch {
    /* same */
  }
}
