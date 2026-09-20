"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE_SECONDS,
  decodeAttribution,
  encodeAttribution,
  mergeAttribution,
  parseTouch,
} from "@/lib/attribution";
import { CONSENT_EVENT, getTrackingAllowedSnapshot } from "@/lib/consent";

// Writes the first-party attribution cookie that src/lib/attribution.ts
// defines, so every lead POST carries its origin without a single form having
// to know about it.
//
// Consent: the cookie is written only while tracking is allowed. A visitor who
// declined, or whose browser broadcasts Global Privacy Control, gets no cookie
// — and if they decline after one was written, it is deleted on the spot
// rather than left to expire. Attribution is marketing measurement; it lives
// under the same choice as GA4 and the Meta Pixel, not beside it.

function writeCookie(value: string) {
  // Lax: the cookie must survive a top-level click in from Google or Facebook,
  // which is exactly the arrival we are trying to record. It is deliberately
  // NOT httpOnly — the client writes it — and carries no personal data, only
  // campaign parameters the ad platform already put in the URL.
  document.cookie = `${ATTRIBUTION_COOKIE}=${value}; Max-Age=${ATTRIBUTION_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${
    location.protocol === "https:" ? "; Secure" : ""
  }`;
}

function deleteCookie() {
  document.cookie = `${ATTRIBUTION_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function readCookie(): string | null {
  for (const part of document.cookie.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() !== ATTRIBUTION_COOKIE) continue;
    return part.slice(eq + 1).trim();
  }
  return null;
}

export function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const record = () => {
      if (!getTrackingAllowedSnapshot()) {
        deleteCookie();
        return;
      }
      try {
        const existing = decodeAttribution(readCookie());
        // document.referrer is the referrer of the ORIGINAL page load and
        // survives client-side navigation, so it is only meaningful for the
        // arrival itself. After that the merge rule ignores it anyway: an
        // internal click produces no attributed touch.
        const touch = parseTouch({ url: window.location.href, referrer: document.referrer });
        const next = mergeAttribution(existing, touch);
        // Re-writing an unchanged value still refreshes Max-Age, which keeps a
        // returning visitor's first touch alive for another 90 days.
        writeCookie(encodeAttribution(next));
      } catch {
        /* Cookies blocked, or storage disabled — attribution is best-effort
           and must never break a page render or a form submit. */
      }
    };

    record();
    window.addEventListener(CONSENT_EVENT, record);
    return () => window.removeEventListener(CONSENT_EVENT, record);
  }, [pathname, searchParams]);

  return null;
}
