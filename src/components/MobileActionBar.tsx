"use client";

import { useState, useEffect, useRef } from "react";
import { trackPhoneClick, trackEvent } from "@/lib/analytics";
import { useBottomBarHeight } from "@/lib/bottom-bars";
import PriceQuoteModal from "@/components/PriceQuoteModal";

// Sticky call / text / quote bar on phones (hidden at lg and up).
//
// - Call and Text are real tel: and sms: links: one tap opens the phone or
//   messaging app with our number (the old Text button showed a fake "message
//   sent" form that went nowhere).
// - Get Quote opens the instant-quote modal in place instead of bouncing the
//   visitor to /contact-us.
// Publishes --mobile-bar-h so the compare bar and chat bubble stack above it.

const SMS_HREF =
  "sms:+12603081457?body=" +
  encodeURIComponent("Hi Factory Direct, I'm interested in pricing and info on a Champion home.");

export function MobileActionBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show after scrolling down a bit
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useBottomBarHeight("--mobile-bar-h", barRef, isVisible);

  return (
    <>
      {isVisible && (
        <nav
          ref={barRef}
          aria-label="Mobile actions"
          style={{ bottom: "var(--consent-h, 0px)" }}
          className="fixed left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[var(--color-charcoal)]/10 shadow-lg lg:hidden"
        >
          <div className="flex items-center justify-around p-2">
            <a
              href="tel:+12603081457"
              onClick={() => trackPhoneClick("mobile_action_bar", "call")}
              className="flex flex-col items-center gap-1 px-4 py-2 text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-xs font-medium">Call</span>
            </a>

            <a
              href={SMS_HREF}
              onClick={() => trackEvent("sms_click", { location: "mobile_action_bar" })}
              className="flex flex-col items-center gap-1 px-4 py-2 text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs font-medium">Text</span>
            </a>

            <button
              type="button"
              onClick={() => setQuoteOpen(true)}
              className="flex flex-col items-center gap-1 px-6 py-2 bg-[var(--color-teal)] text-white rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-bold">Get Quote</span>
            </button>
          </div>
        </nav>
      )}

      <PriceQuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} modelName="Direct Inquiry" />
    </>
  );
}
