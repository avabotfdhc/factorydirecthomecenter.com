"use client";

import { useState } from "react";
import PriceQuoteModal from "@/components/PriceQuoteModal";

// The only interactive parts of the homepage's middle sections. HomeSections
// itself is a server component, so its ~400 lines of static markup ship as
// HTML and are never hydrated; only these two islands carry JavaScript.
// (Before 2026-10-06 the whole file was "use client", which made every card,
// heading and paragraph part of the homepage's hydration work — Lighthouse
// measured 250 ms of Total Blocking Time on mobile.)

export function GetPricingButton({ modelName, className }: { modelName: string; className: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        Get Pricing
      </button>
      <PriceQuoteModal isOpen={open} onClose={() => setOpen(false)} modelName={modelName} />
    </>
  );
}

// Phone taps are tracked site-wide by the single delegated `tel:` listener in
// usePhoneClickTracking (src/lib/analytics.tsx), so this is now a plain anchor
// — the `location` prop is kept for call-site compatibility but no longer wires
// its own onClick (which would have double-counted against the site-wide one).
export function TrackedPhoneLink({
  href,
  className,
  children,
}: {
  href: string;
  location?: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
