"use client";

/**
 * The showroom map, which does not phone Google until it is allowed to.
 *
 * The Google Maps embed is an iframe on google.com, so the moment it renders
 * Google sets its own cookies on the visitor — a Lighthouse run on production
 * /contact-us (2026-10-10) counted **30**, among them `NID`,
 * `__Secure-3PSID`, `__Secure-3PAPISID` and `__Secure-3PSIDCC`: advertising
 * and identity cookies, not map state. Both maps (`/` and `/contact-us`) were
 * server-rendered unconditionally, so every visitor got all thirty on first
 * paint.
 *
 * That is not only a Best-Practices score. This site defers GA4 and Clarity
 * until the visitor accepts cookies (see AnalyticsProvider) and deletes the
 * attribution cookie the moment they opt out — and then handed Google a full
 * set regardless of what they chose, from the two highest-traffic pages. A
 * consent banner that the page works around is worse than no banner, because
 * it tells the visitor something untrue.
 *
 * So the iframe mounts only when one of two things is true:
 *   1. the visitor has accepted cookies — the map appears with no extra click;
 *   2. the visitor presses "Show map" — an explicit action for this one embed,
 *      which is what makes it lawful without a blanket acceptance.
 *
 * Until then the panel shows the address as real text, which is what a crawler
 * and an answer engine read anyway (the map is an image to them), plus the
 * directions links, which are plain anchors and set nothing.
 *
 * The consent value is read with `useSyncExternalStore` and a **false** server
 * snapshot, per "Browser values are snapshotted, never written in from an
 * effect" in AGENTS.md. Two consequences, both wanted: the cached HTML never
 * contains the iframe (so nothing visitor-specific is in it and the pages stay
 * static), and React swaps the map in on hydration without a mismatch.
 */

import * as React from "react";
import { BUSINESS } from "@/lib/business";
import {
  subscribeConsent,
  getConsentGrantedSnapshot,
  getServerConsentSnapshot,
} from "@/lib/consent";

const MAP_QUERY = `${BUSINESS.name}, ${BUSINESS.streetAddress}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postalCode}`;
const EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;

export function LocationMap({
  title,
  className = "",
}: {
  /** The iframe's accessible name. Say which place it shows. */
  title: string;
  /** Sizing for the map/placeholder box. Both states fill it identically. */
  className?: string;
}) {
  // Affirmative acceptance only, NOT getTrackingAllowedSnapshot: that is the
  // opt-out answer and returns true for a visitor who has not replied to the
  // banner, which made the first version of this component a silent no-op —
  // the iframe rendered for everyone, one hydration tick later than before.
  // A boolean, so React's Object.is comparison is stable — returning a fresh
  // object here is the infinite-render-loop trap in use-browser-value.ts.
  const consentGranted = React.useSyncExternalStore(
    subscribeConsent,
    getConsentGrantedSnapshot,
    getServerConsentSnapshot,
  );
  const [requested, setRequested] = React.useState(false);

  if (consentGranted || requested) {
    return (
      <iframe
        title={title}
        src={EMBED_SRC}
        className={`border-0 ${className}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 bg-[var(--color-cream-dark)] px-6 py-8 text-center ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 text-[var(--color-teal)]" fill="currentColor">
        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
      </svg>
      <address className="not-italic text-sm font-semibold text-[var(--color-charcoal)]">
        {BUSINESS.streetAddress}
        <br />
        {BUSINESS.city}, {BUSINESS.region} {BUSINESS.postalCode}
      </address>
      <button
        type="button"
        onClick={() => setRequested(true)}
        className="inline-flex items-center justify-center rounded-lg bg-[var(--color-teal)] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[var(--color-teal-dark)]"
      >
        Show map
      </button>
      <p className="max-w-xs text-xs text-[var(--color-gray)]">
        The map loads from Google, which sets its own cookies. We leave it off until you ask for it.
      </p>
    </div>
  );
}
