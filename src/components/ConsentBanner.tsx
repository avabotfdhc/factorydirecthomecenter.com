"use client";

import { useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useBottomBarHeight } from "@/lib/bottom-bars";
import {
  getNeedsPromptSnapshot,
  getServerConsentSnapshot,
  subscribeConsent,
  writeConsent,
} from "@/lib/consent";

// The tracking notice. Appears once for a visitor who hasn't answered, is
// suppressed entirely for a browser sending Global Privacy Control, and is
// re-openable from the footer's "Cookie preferences" link.
//
// The server snapshot is `false`, so the banner is absent from the cached HTML
// and appears on hydration only if this particular visitor still needs to be
// asked — no hydration mismatch, and no visitor's choice baked into a shared
// cached page.
export function ConsentBanner() {
  const visible = useSyncExternalStore(
    subscribeConsent,
    getNeedsPromptSnapshot,
    getServerConsentSnapshot,
  );
  const ref = useRef<HTMLDivElement>(null);
  // The notice sits at the very bottom of the screen; everything else pinned
  // there offsets above it by --consent-h so nothing gets covered.
  useBottomBarHeight("--consent-h", ref, visible);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Tracking preferences"
      className="fixed bottom-0 inset-x-0 z-[60] bg-[var(--color-charcoal)] text-white shadow-2xl border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col lg:flex-row lg:items-center gap-4">
        <p className="text-sm leading-relaxed text-white/80 flex-1">
          We use cookies and similar technologies (Google Analytics, Google Tag Manager, the Meta
          Pixel, and Microsoft Clarity) to understand how visitors use this site and to measure our
          advertising. You can turn this off — the site works exactly the same either way. See our{" "}
          <Link href="/privacy" className="underline hover:text-[var(--color-lime)]">
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
            className="min-h-12 px-6 bg-[var(--color-lime)] text-[var(--color-charcoal)] text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-lime-dark)] hover:text-white transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
