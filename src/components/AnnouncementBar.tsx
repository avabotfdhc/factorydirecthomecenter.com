"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { saleDeadlineLabel, saleStatusForDay, todayInSaleZone } from "@/lib/sale";

// The banner hides itself once the promo ends so it can never display an
// expired offer. Both the cut-off and the visible copy come from
// src/lib/sale.ts — they used to be two hand-maintained constants that could
// (and did) disagree with the sale page.

/** Never changes without a page load, so there is nothing to subscribe to. */
const subscribeToNothing = () => () => {};

export function AnnouncementBar() {
  const [isDismissed, setIsDismissed] = useState(false);

  // The sale clock, snapshotted as the calendar day in the dealership's time
  // zone — a plain sortable string, which is what useSyncExternalStore needs
  // (it compares snapshots with Object.is, and the status is a fresh object
  // every call). `saleStatusForDay` exists so the day really is the input.
  //
  // The server's day is whenever the cached shell was built; the browser's is
  // today. React renders the server value, hydrates against it, then swaps to
  // the client value and re-renders — no mismatch, and no effect. This used to
  // be a mount effect that re-set the sale on EVERY visit, expired or not,
  // because a new object is never equal to the old one.
  const day = useSyncExternalStore(subscribeToNothing, todayInSaleZone, todayInSaleZone);
  const sale = useMemo(() => saleStatusForDay(day), [day]);

  // An ended promo now renders nothing from the first paint rather than
  // flashing an expired offer and retracting it.
  if (isDismissed || !sale.active) return null;

  return (
    <div className="bg-gradient-to-r from-[#1a365d] via-[#2c7a7b] to-[#1a365d] text-white relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMC02di00aC00djRoNHptLTYgNmgtNHYyaDR2LTJ6bTAtNnYtNGgtNHY0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-2.5">
          <Link 
            href="/homes-on-sale" 
            className="flex items-center gap-2 text-sm font-medium hover:underline transition-all"
          >
            <span className="animate-pulse">🎉</span>
            <span className="hidden sm:inline">
              <strong>Save up to {sale.discountPercent}% off</strong> select new Champion floor plans!
            </span>
            <span className="sm:hidden">
              <strong>Up to {sale.discountPercent}% off</strong> Champion plans!
            </span>
            <span className="text-yellow-300 font-semibold whitespace-nowrap">
              {saleDeadlineLabel(sale)}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
              Shop Now
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
          
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute right-4 p-1 text-white/60 hover:text-white transition-colors"
            aria-label="Dismiss announcement"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
