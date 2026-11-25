"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { H3, H4 } from "./Heading";
import { FadeIn } from "./VisualEffects";
import { trackLeadFormSubmit } from "@/lib/analytics";
import { useAntiSpam } from "@/lib/use-anti-spam";
import { getSaleStatus, saleAmount, saleDeadlineLabel, saleScope } from "@/lib/sale";

interface ExitIntentPopupProps {
  offer?: string;
  delay?: number;
}

export function ExitIntentPopup({ offer, delay = 5000 }: ExitIntentPopupProps) {
  // Every sale claim below is gated on the campaign still running — otherwise
  // this popup would keep pitching an expired discount to every visitor.
  const sale = getSaleStatus();
  const headline =
    offer ??
    (sale.active
      ? `${sale.name}: save ${saleAmount(sale)} off ${saleScope(sale)}!`
      : "Get a free, line-item factory-direct quote");
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const antiSpam = useAntiSpam();

  // "Already shown" is a ref, not state: nothing renders from it, only the
  // mouseleave handler reads it. As state it forced a re-render nobody saw,
  // and because it was a useCallback dependency, flipping it rebuilt the
  // handler and re-bound the document listener. The mount effect also wrote it
  // synchronously from localStorage, which is a render cascade on every page.
  const hasShown = useRef(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY < 10 && !hasShown.current) {
      hasShown.current = true;
      setIsVisible(true);
      try {
        localStorage.setItem("exitIntentShown", "true");
      } catch {
        /* storage blocked — the popup still behaves for this visit */
      }
    }
  }, []);

  useEffect(() => {
    // Shown on an earlier visit? Then never arm the listener at all.
    let alreadyShown: string | null = null;
    try {
      alreadyShown = localStorage.getItem("exitIntentShown");
    } catch {
      /* storage blocked — treat as not yet shown */
    }
    if (alreadyShown) {
      hasShown.current = true;
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

    const address = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);
    try {
      // Real email-only lead to the same pipeline as every other form
      // (Supabase + email/CRM fan-out). /api/leads accepts a lead with just an
      // email as long as a name is present, so the popup sends a clear
      // placeholder name that tells the sales team this came in email-only from
      // the exit-intent offer — the follow-up collects the rest.
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...antiSpam.payload(),
          firstName: "Exit-intent",
          lastName: "lead (email only)",
          email: address,
          interest: sale.active ? sale.name : "Factory-direct quote",
          message:
            "Email captured by the exit-intent offer popup. Email only — follow up to collect name, phone and home interest.",
          source: "Exit-Intent Popup",
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error(`lead post failed: ${res.status}`);

      // Track only after the save actually succeeds — a failed/discarded submit
      // must not report a lead.
      trackLeadFormSubmit("exit_intent", {
        email: address,
        interest: sale.active ? sale.name : "Factory-direct quote",
        location: window.location.pathname,
      });

      setIsSubmitted(true);
      // Close after showing success
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } catch {
      setErrorMsg("Something went wrong. Please try again, or call (260) 308-1457.");
    } finally {
      setIsSubmitting(false);
    }
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
            <H3 className="font-serif text-2xl font-light mb-2">Wait! Don’t Miss Out</H3>
            <p className="text-white/80 text-lg font-semibold">{headline}</p>
            {sale.active && (
              <p className="text-yellow-300 text-sm mt-1">{saleDeadlineLabel(sale)}</p>
            )}
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
                <H4 className="font-serif text-xl font-semibold mb-2">You’re In!</H4>
                <p className="text-[var(--color-gray)]">
                  A home specialist will contact you within 24 hours with your savings details.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--color-lime-dark)]">✓</span>
                    <span className="text-sm text-[var(--color-charcoal)]">
                      {sale.active ? (
                        <><strong>{sale.allHomes ? "" : "Up to "}{sale.discountPercent}% off MSRP</strong> base price</>
                      ) : (
                        <><strong>Line-item pricing</strong> — home, delivery, setup and site work priced separately</>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--color-lime-dark)]">✓</span>
                    <span className="text-sm text-[var(--color-charcoal)]">Save thousands on your new home</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--color-lime-dark)]">✓</span>
                    <span className="text-sm text-[var(--color-charcoal)]">Line-item quote on every home</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {antiSpam.fields}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[var(--color-lime)] text-white font-bold rounded-lg hover:bg-[var(--color-lime-dark)] transition-colors disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending…" : sale.active ? "Claim My Savings" : "Get My Quote"}
                  </button>
                  {errorMsg && (
                    <p role="alert" className="text-sm text-red-600">
                      {errorMsg}
                    </p>
                  )}
                </form>

                {sale.active && (
                  <p className="text-xs text-center text-[var(--color-gray)] mt-4">
                    *Save {saleAmount(sale)} off MSRP base price on {saleScope(sale)}. Excludes delivery, setup, taxes &amp; fees.
                    Not valid with other specials or discounts. New purchases only; order must be authorized for production in {sale.productionMonth}. Valid through {sale.endDateLabel}.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
