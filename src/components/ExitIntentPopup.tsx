"use client";

import { useState, useEffect, useCallback } from "react";
import { H3, H4 } from "./Heading";
import { FadeIn } from "./VisualEffects";
import { trackFormSubmit } from "@/lib/analytics";

interface ExitIntentPopupProps {
  offer?: string;
  delay?: number;
}

export function ExitIntentPopup({ offer = "Save up to 25% off select Champion floor plans!", delay = 5000 }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY < 10 && !hasShown) {
      setIsVisible(true);
      setHasShown(true);
      localStorage.setItem("exitIntentShown", "true");
    }
  }, [hasShown]);

  useEffect(() => {
    // Check if already shown
    const alreadyShown = localStorage.getItem("exitIntentShown");
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    // Delay before enabling exit intent
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, delay);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [delay, handleMouseLeave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    trackFormSubmit("exit_intent", { source: "popup", type: "email_capture" });
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    
    // Close after showing success
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
      <FadeIn direction="up">
        <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-[var(--color-gray)] hover:text-[var(--color-charcoal)] z-10"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header Image */}
          <div className="bg-[var(--color-teal)] p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <H3 className="font-serif text-2xl font-light mb-2">Wait! Don't Miss Out</H3>
            <p className="text-white/80 text-lg font-semibold">{offer}</p>
            <p className="text-yellow-300 text-sm mt-1">Ends July 31, 2026</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {isSubmitted ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--color-lime)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <H4 className="font-serif text-xl font-semibold mb-2">You're In!</H4>
                <p className="text-[var(--color-gray)]">
                  A home specialist will contact you within 24 hours with your savings details.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--color-lime-dark)]">✓</span>
                    <span className="text-sm text-[var(--color-charcoal)]"><strong>Up to 25% off MSRP</strong> base price</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--color-lime-dark)]">✓</span>
                    <span className="text-sm text-[var(--color-charcoal)]">Save thousands on your new home</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--color-lime-dark)]">✓</span>
                    <span className="text-sm text-[var(--color-charcoal)]">Free site evaluation included</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-[var(--color-lime)] text-[var(--color-charcoal)] font-bold rounded-lg hover:bg-[var(--color-lime-dark)] transition-colors"
                  >
                    Claim My Savings
                  </button>
                </form>

                <p className="text-xs text-center text-[var(--color-gray)] mt-4">
                  *Save up to 25% off MSRP base price on select new Champion floor plans. Excludes delivery, setup, taxes &amp; fees.
                  Not valid with other specials or discounts. New purchases only; order must be authorized for production in July 2026. Valid through July 31, 2026.
                </p>
              </>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
