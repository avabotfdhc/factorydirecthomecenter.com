"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import { useAntiSpam } from "@/lib/use-anti-spam";
import { LeadConsent, LeadUrgency } from "./LeadConsent";
import Link from "next/link";
import { trackCTAClick, trackLeadFormStart, trackLeadFormSubmit, trackPhoneClick } from "@/lib/analytics";

type Mode = "quote" | "visit";

// Inline lead capture used on floor-plan detail pages. Opening a modal keeps the
// buyer on the home they're looking at (instead of bouncing them to /contact-us)
// and posts straight to /api/leads, which fans the lead out to the admin CMS,
// DealerTide CRM, email, and Google Sheets.
export interface FloorPlanActionsProps {
  homeName: string;
  /** Slug, for the "design this home" deep link. */
  slug: string;
  virtualTour?: string;
  floorPlanUrl?: string;
  brochureUrl?: string;
}

/**
 * The action block on a floor-plan page.
 *
 * It used to be seven buttons in one wrapped row, all roughly the same size:
 * Design This Home, Get a Quote, Schedule a Lot Visit, Call, 3D Virtual Tour,
 * Floor Plan (PDF) and Download brochure. Two of them were solid-filled in
 * different brand colours, so nothing read as *the* next step — and three of
 * the seven led away from the page entirely.
 *
 * Now there is one primary action, two secondary ones, and the assets are
 * quiet links under a label:
 *
 *   • "Get My Price" is the thing a first-time visitor came for. Prices are
 *     hidden site-wide, so this is the whole reason the page has a CTA at all.
 *   • Booking a visit and designing a home are real conversion paths, but they
 *     ask for more commitment than a price does, so they sit one rung down.
 *   • The tour, the plan sheet and the brochure are reference material a
 *     shopper opens mid-decision. They stay freely available and ungated —
 *     gating spec sheets kills discovery-stage engagement — but they no longer
 *     compete with the ask.
 *   • The phone number is a line of text, not a button. On a phone the sticky
 *     MobileActionBar already carries a tap-to-call; on a desktop nobody taps
 *     a tel: link, they read the number.
 *
 * Every option reports `cta_click` to GA4 with its own name, so which one
 * actually earns the click is a question the analytics can answer rather than
 * a matter of opinion.
 */
export function FloorPlanActions({
  homeName,
  slug,
  virtualTour,
  floorPlanUrl,
  brochureUrl,
}: FloorPlanActionsProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("quote");

  const openWith = (m: Mode, ctaName: string) => {
    trackCTAClick(ctaName, "floor_plan_detail", m === "quote" ? "quote_modal" : "visit_modal");
    setMode(m);
    setOpen(true);
  };

  const assets = [
    virtualTour ? { label: "3D virtual tour", href: virtualTour, name: "virtual_tour" } : null,
    floorPlanUrl ? { label: "Floor plan (PDF)", href: floorPlanUrl, name: "floor_plan_pdf" } : null,
    brochureUrl ? { label: "Brochure (PDF)", href: brochureUrl, name: "brochure_pdf" } : null,
  ].filter((a): a is { label: string; href: string; name: string } => a !== null);

  return (
    <>
      {/* Primary — one action, unmistakable, full width on a phone. The
          plan page's right-hand column is a flex column, so `sm:self-start`
          is what actually sizes the button to its text on a desktop;
          `sm:w-auto` alone is overridden by align-items: stretch. */}
      <button
        type="button"
        onClick={() => openWith("quote", "get_my_price")}
        className="w-full sm:w-auto sm:self-start inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-9 py-4 text-base font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
      >
        Get My Price
      </button>
      <p className="text-xs text-[var(--color-gray)] mt-2">
        Line-item quote for this home — no obligation, usually same day.
      </p>

      {/* Secondary — equal weight to each other, clearly below the primary. */}
      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <button
          type="button"
          onClick={() => openWith("visit", "schedule_visit")}
          className="inline-flex items-center justify-center border-2 border-[var(--color-teal)]/40 text-[var(--color-teal)] px-7 py-3 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal)]/5 transition-colors"
        >
          Schedule a Lot Visit
        </button>
        <Link
          href={`/design-your-home?home=${encodeURIComponent(slug)}`}
          onClick={() => trackCTAClick("design_this_home", "floor_plan_detail", "/design-your-home")}
          className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)]/15 px-7 py-3 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-charcoal)]/5 transition-colors"
        >
          Design This Home
        </Link>
      </div>

      {/* Tertiary — the number is information as much as an action. */}
      <p className="text-sm text-[var(--color-gray)] mt-4">
        Prefer to talk?{" "}
        <a
          href="tel:+12603081457"
          onClick={() => trackPhoneClick("floor_plan_detail", "floor_plan")}
          className="font-semibold text-[var(--color-teal)] underline underline-offset-4"
        >
          Call (260) 308-1457
        </a>
      </p>

      {/* Reference material. Ungated on purpose — see the note above. */}
      {assets.length > 0 && (
        <div className="mt-6 pt-5 border-t border-[var(--color-charcoal)]/10">
          <h2 className="text-xs font-bold tracking-widest uppercase text-[var(--color-gray)] mb-2">
            Look closer
          </h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {assets.map((asset) => (
              <li key={asset.name}>
                <a
                  href={asset.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCTAClick(asset.name, "floor_plan_detail", asset.href)}
                  className="text-[var(--color-teal)] underline underline-offset-4 hover:text-[var(--color-teal-dark)]"
                >
                  {asset.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {open && <QuoteDialog homeName={homeName} mode={mode} onClose={() => setOpen(false)} />}
    </>
  );
}

function QuoteDialog({
  homeName,
  mode,
  onClose,
}: {
  homeName: string;
  mode: Mode;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [started, setStarted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const heading = mode === "visit" ? `Schedule a visit — ${homeName}` : `Get a quote — ${homeName}`;
  const cta = mode === "visit" ? "Request My Visit" : "Get My Quote";

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [close]);

  const onFirstInput = () => {
    if (!started) {
      setStarted(true);
      trackLeadFormStart(`floor_plan_${mode}`);
    }
  };

  const antiSpam = useAntiSpam();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const fullName = (data.get("name")?.toString() || "").trim();
    const email = (data.get("email")?.toString() || "").trim();
    const phone = (data.get("phone")?.toString() || "").trim();
    const timeframe = data.get("timeframe")?.toString() || "";
    const note = (data.get("message")?.toString() || "").trim();

    if (!fullName || !email || phone.replace(/\D/g, "").length < 10) {
      setStatus("error");
      return;
    }
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ") || "—";

    const message = [
      mode === "visit"
        ? `Lot-visit request for ${homeName}.`
        : `Quote request for ${homeName}.`,
      note,
    ]
      .filter(Boolean)
      .join("\n\n");

    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...antiSpam.payload(),
          firstName,
          lastName,
          email,
          phone,
          interest: homeName,
          timeframe,
          message,
          source: mode === "visit" ? "Floor Plan — Lot Visit" : "Floor Plan — Get a Quote",
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error(`lead post failed: ${res.status}`);
      trackLeadFormSubmit(`floor_plan_${mode}`, { name: fullName, email, phone, interest: homeName });
      setStatus("done");
    } catch {
      // The API returns 200 even when optional channels are unconfigured, so a
      // failure here is a real network/validation error — let them retry or call.
      setStatus("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={heading}
    >
      <div className="absolute inset-0 bg-[var(--color-charcoal)]/60 backdrop-blur-sm" onClick={close} />
      <div
        ref={dialogRef}
        className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 bg-[var(--color-teal)] text-white p-5 sm:rounded-t-2xl">
          <h2 className="font-serif text-xl font-light leading-snug">{heading}</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex-none -mr-1 -mt-1 p-1 text-white/80 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {status === "done" ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-[var(--color-lime)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-semibold mb-2">Thank you!</h3>
            <p className="text-[var(--color-gray)] mb-4">
              We&rsquo;ve got your request for the {homeName} and a home specialist will
              reach out within one business day.
            </p>
            <p className="text-sm text-[var(--color-gray)]">
              Need it sooner? Call{" "}
              <a href="tel:+12603081457" className="text-[var(--color-teal)] font-semibold">
                (260) 308-1457
              </a>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4" onFocus={onFirstInput}>
            {antiSpam.fields}
            <LeadUrgency className="bg-[var(--color-lime)]/10 border border-[var(--color-lime)]/40 rounded-lg px-3 py-2.5" />

            <Field label="Full name" required>
              <input
                ref={firstFieldRef}
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full px-3.5 py-2.5 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] focus:outline-none focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30"
                placeholder="Jane Smith"
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email" required>
                <input name="email" type="email" required autoComplete="email" className="w-full px-3.5 py-2.5 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] focus:outline-none focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30" placeholder="you@email.com" />
              </Field>
              <Field label="Phone" required>
                <input name="phone" type="tel" required autoComplete="tel" className="w-full px-3.5 py-2.5 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] focus:outline-none focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30" placeholder="(260) 000-0000" />
              </Field>
            </div>
            <Field label={mode === "visit" ? "Preferred timing" : "When do you need your home?"}>
              <select name="timeframe" className="w-full px-3.5 py-2.5 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] focus:outline-none focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30" defaultValue="">
                <option value="">Select…</option>
                <option>ASAP — ready to buy now</option>
                <option>Within 3 months</option>
                <option>3–6 months</option>
                <option>6+ months</option>
                <option>Just researching</option>
              </select>
            </Field>
            <Field label={mode === "visit" ? "Anything we should know?" : "Questions or details (optional)"}>
              <textarea
                name="message"
                rows={2}
                className="w-full px-3.5 py-2.5 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] focus:outline-none focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 resize-none"
                placeholder={mode === "visit" ? "A day/time that works for you…" : "Tell us what you're looking for…"}
              />
            </Field>

            {status === "error" && (
              <p className="text-sm text-red-600">
                Please add your name, a valid email, and a phone number, or call us at (260) 308-1457.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full px-6 py-3.5 bg-[var(--color-lime)] text-white font-bold tracking-wide rounded-lg hover:bg-[var(--color-lime-dark)] hover:text-white transition-colors disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : cta}
            </button>

            <LeadConsent />
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-[var(--color-charcoal)] mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
