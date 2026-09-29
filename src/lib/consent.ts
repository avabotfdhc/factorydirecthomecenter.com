// Tracking consent.
//
// The privacy policy tells visitors this site runs GA4, Google Tag Manager, the
// Meta Pixel, and Microsoft Clarity, and that they can opt out — but there was
// no control anywhere on the site to opt out with. This module is that control.
//
// Model: notice-and-opt-out, which is what Indiana and the other US state
// privacy laws that apply here require, rather than the EU's opt-in. Analytics
// load by default; a visitor who declines has every tag suppressed from that
// point on, on this and every later visit. Two things are honoured ahead of any
// stored choice:
//
//   • Global Privacy Control (navigator.globalPrivacyControl) — a legally
//     recognised opt-out signal under several state laws. If the browser sends
//     it, we treat the visitor as opted out and never show the banner.
//   • An existing stored choice — asked once, remembered for a year.

export type ConsentChoice = "granted" | "denied";

const STORAGE_KEY = "fdhc_tracking_consent";
const VERSION = 1;
/** Re-ask a year after the last answer. */
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

/** Fired on the window whenever the choice changes, so listeners can react. */
export const CONSENT_EVENT = "fdhc:consent-change";

interface StoredConsent {
  v: number;
  choice: ConsentChoice;
  at: number;
}

/** True when the browser is broadcasting Global Privacy Control. */
export function hasGlobalPrivacyControl(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

/**
 * The visitor's stored choice, or null if they haven't answered (or the answer
 * has aged out). Storage access is wrapped because Safari private mode and
 * "block all cookies" settings make localStorage throw rather than return null.
 */
export function readStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.v !== VERSION) return null;
    if (!parsed.at || Date.now() - parsed.at > MAX_AGE_MS) return null;
    return parsed.choice === "denied" ? "denied" : "granted";
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredConsent = { v: VERSION, choice, at: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* storage unavailable — the in-memory choice still applies to this visit */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}

/** Clears the stored answer so the banner is shown again. */
export function resetConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to clear */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}

export interface ConsentState {
  /** Whether tracking scripts may load right now. */
  allowed: boolean;
  /** Whether to show the banner (no stored answer, and no GPC signal). */
  needsPrompt: boolean;
}

export function resolveConsent(): ConsentState {
  if (hasGlobalPrivacyControl()) return { allowed: false, needsPrompt: false };
  const stored = readStoredConsent();
  if (stored === "denied") return { allowed: false, needsPrompt: false };
  if (stored === "granted") return { allowed: true, needsPrompt: false };
  // No answer yet: analytics run (opt-out model) while we ask.
  return { allowed: true, needsPrompt: true };
}

// ── React binding ───────────────────────────────────────────────────────────
// Consent lives outside React (localStorage plus a browser signal), so it is
// exposed as an external store rather than mirrored into state inside an
// effect. The snapshots below return booleans, not objects, because
// useSyncExternalStore compares snapshots by identity — a fresh object each
// call would re-render forever.

/** Subscribes to consent changes, including ones made in another tab. */
export function subscribeConsent(onChange: () => void): () => void {
  const handle = () => {
    syncAnsweredAttr();
    onChange();
  };
  window.addEventListener(CONSENT_EVENT, handle);
  window.addEventListener("storage", handle);
  return () => {
    window.removeEventListener(CONSENT_EVENT, handle);
    window.removeEventListener("storage", handle);
  };
}

/**
 * Keeps CONSENT_ANSWERED_ATTR in step with the stored choice after page load.
 * Without this, "Cookie preferences" in the footer (resetConsent) would re-open
 * the banner in React while the attribute set before paint kept it hidden.
 */
function syncAnsweredAttr(): void {
  const root = document.documentElement;
  if (resolveConsent().needsPrompt) root.removeAttribute(CONSENT_ANSWERED_ATTR);
  else root.setAttribute(CONSENT_ANSWERED_ATTR, "");
}

export function getTrackingAllowedSnapshot(): boolean {
  return resolveConsent().allowed;
}

export function getNeedsPromptSnapshot(): boolean {
  return resolveConsent().needsPrompt;
}

/**
 * Server snapshot for both of the above. Rendering "no tracking, no banner" on
 * the server is the safe default: the real answer is only knowable in the
 * browser, and this way nothing about a visitor's choice can leak into cached
 * HTML.
 */
export function getServerConsentSnapshot(): boolean {
  return false;
}

/**
 * Server snapshot for the banner only: `true`, so the notice is in the static
 * HTML and paints with the first frame instead of after hydration. On the
 * homepage the notice is the largest thing on a phone screen, so gating it on
 * hydration made it the LCP element at ~4 s on a mobile Lighthouse run
 * (2026-09-29). The cached HTML still carries nothing visitor-specific: every
 * visitor gets the same markup, and CONSENT_PREPAINT_SCRIPT hides it before
 * first paint for anyone who has already answered or sends GPC.
 */
export function getServerNeedsPromptSnapshot(): boolean {
  return true;
}

/** Set on <html> by CONSENT_PREPAINT_SCRIPT when the banner must not show. */
export const CONSENT_ANSWERED_ATTR = "data-consent-answered";

/**
 * Inline <head> script that runs before the body paints. It repeats
 * resolveConsent()'s "no prompt" test (GPC, or a current stored answer) with
 * the same key, version and age limit, and marks <html> so globals.css hides
 * the server-rendered banner. Without it, a returning visitor would see the
 * notice flash until hydration removed it.
 */
export const CONSENT_PREPAINT_SCRIPT = `(function(){try{var d=document.documentElement;if(navigator.globalPrivacyControl===true){d.setAttribute(${JSON.stringify(
  CONSENT_ANSWERED_ATTR,
)},"");return}var r=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});if(!r)return;var p=JSON.parse(r);if(p&&p.v===${VERSION}&&p.at&&Date.now()-p.at<=${MAX_AGE_MS})d.setAttribute(${JSON.stringify(
  CONSENT_ANSWERED_ATTR,
)},"")}catch(e){}})();`;
