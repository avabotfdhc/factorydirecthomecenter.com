import Link from "next/link";

// Reinstated lead-form disclaimers, shared across every form so the language
// stays consistent:
//   • LeadConsent  — the "permission to contact" (TCPA-style) consent notice.
//   • LeadUrgency  — the promptness call-to-action.

export function LeadConsent({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-[var(--color-gray)] ${className}`}>
      By submitting this form, you give Factory Direct Homes Center permission to
      contact you by phone, text, and email at the number and address you provide
      — including by automated technology — about your inquiry and our homes.
      Consent is not a condition of any purchase, and message and data rates may
      apply. Your information is never sold or shared. See our{" "}
      <Link href="/privacy" className="underline hover:text-[var(--color-teal)]">
        Privacy Policy
      </Link>
      .
    </p>
  );
}

export function LeadUrgency({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-start gap-2 text-sm font-medium text-[var(--color-charcoal)] ${className}`}
    >
      <span aria-hidden="true" className="mt-0.5 text-[var(--color-lime-dark)]">⚡</span>
      <span>
        We respond within one business day. Reach out now — the sooner we hear
        from you, the sooner we can lock in current pricing and your delivery
        timeline.
      </span>
    </p>
  );
}
