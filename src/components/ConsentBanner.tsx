"use client";

import { useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useBottomBarHeight } from "@/lib/bottom-bars";
import {
  getNeedsPromptSnapshot,
  getServerNeedsPromptSnapshot,
  subscribeConsent,
  writeConsent,
} from "@/lib/consent";

// The tracking notice. Appears once for a visitor who hasn't answered, is
// suppressed entirely for a browser sending Global Privacy Control, and is
// re-openable from the footer's "Cookie preferences" link.
//
// The server snapshot is `true`, so the banner is in the cached HTML for every
// visitor and paints with the first frame. Waiting for hydration made it the
// homepage's LCP element at 4.0 s on mobile (Lighthouse, 2026-09-29). Nothing
// visitor-specific is baked in: CONSENT_PREPAINT_SCRIPT (root layout <head>)
// hides it before first paint for a visitor who has answered or sends GPC, and
// hydration then removes it — useSyncExternalStore hydrates against the server
// snapshot and swaps, so there is no mismatch.
export function ConsentBanner() {
  const visible = useSyncExternalStore(
    subscribeConsent,
    getNeedsPromptSnapshot,
    getServerNeedsPromptSnapshot,
  );
  const ref = useRef<HTMLDivElement>(null);
  // The notice sits at the very bottom of the screen; everything else pinned
  // there offsets above it by --consent-h so nothing gets covered.
  useBottomBarHeight("--consent-h", ref, visible);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      id="consent-banner"
      role="region"
      aria-label="Tracking preferences"
      className="fixed bottom-0 inset-x-0 z-[60] bg-[var(--color-charcoal)] text-white shadow-2xl border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col lg:flex-row lg:items-center gap-4">
        <p className="text-sm leading-relaxed text-white/80 flex-1">
          We use cookies and similar technologies (Google Analytics, Google Tag Manager, the Meta
          Pixel, and Microsoft Clarity) to understand how visitors use this site and to measure our
          advertising. You can turn this off — the site works exactly the same either way. See our{" "}
          <Link href="/privacy" className="underline hover:text-[var(--color-lime-light)]">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => writeConsent("denied")}
            className="min-h-12 px-6 border-2 border-white/25 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-white/10 transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => writeConsent("granted")}
            className="min-h-12 px-6 bg-[var(--color-lime)] text-white text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-lime-dark)] hover:text-white transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
