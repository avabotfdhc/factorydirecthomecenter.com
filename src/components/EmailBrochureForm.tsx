"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { trackLeadFormStart, trackLeadFormError, trackLeadFormSubmit } from "@/lib/analytics";

// One-click brochure lead magnet on home detail pages. Deliberately NOT a
// gate: the brochure/spec download link stays freely clickable next to this —
// gating spec sheets kills discovery-stage engagement. This form is the
// opt-in convenience path ("send it to my inbox") that hands sales a warm,
// home-specific lead through the normal /api/leads pipeline.
export function EmailBrochureForm({
  homeName,
  modelNumber,
}: {
  homeName: string;
  modelNumber?: string;
}) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const firstName = data.get("firstName")?.toString().trim() || "";
    const lastName = data.get("lastName")?.toString().trim() || "";
    const email = data.get("email")?.toString().trim() || "";
    const phone = data.get("phone")?.toString().trim() || "";

    if (
      !firstName ||
      !lastName ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      phone.replace(/\D/g, "").length < 10
    ) {
      setError("Please fill in your name, a valid email address, and a phone number.");
      trackLeadFormError("brochure_email_form", ["validation"]);
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          interest: homeName,
          message: `Please email me the floor plan / spec sheet for the ${homeName}${modelNumber ? ` (model ${modelNumber})` : ""}.`,
          source: "Floor Plan Email Request",
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      trackLeadFormSubmit("brochure_email_form", {
        id: `lead_${Date.now()}`,
        name: `${firstName} ${lastName}`,
        email,
        phone,
        interest: homeName,
        value: 50000,
        currency: "USD",
      });
      setSent(true);
    } catch {
      setError("Something went wrong — please try again or call (260) 308-1457.");
      trackLeadFormError("brochure_email_form", ["submission_failed"]);
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-6 bg-[var(--color-lime)]/15 border border-[var(--color-lime)]/50 rounded-lg px-5 py-4 text-sm">
        <strong>On its way!</strong> We&rsquo;ll email you the {homeName} floor plan and current
        details shortly — usually within one business day.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-teal)] hover:underline underline-offset-4"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
        Email me this floor plan
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={() => {
        if (!started) {
          setStarted(true);
          trackLeadFormStart("brochure_email_form");
        }
      }}
      className="mt-6 bg-white border border-[var(--color-charcoal)]/10 rounded-lg p-5"
      noValidate
    >
      <p className="text-sm font-semibold mb-1">Get the {homeName} floor plan by email</p>
      <p className="text-xs text-[var(--color-gray)] mb-4">
        We&rsquo;ll send the floor plan and current availability — no spam, no obligation.
      </p>
      {error && (
        <p role="alert" className="text-xs text-red-600 mb-3">{error}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          name="firstName"
          placeholder="First name *"
          aria-label="First name"
          className="px-3 py-2.5 border border-[var(--color-charcoal)]/10 rounded text-sm focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last name *"
          aria-label="Last name"
          className="px-3 py-2.5 border border-[var(--color-charcoal)]/10 rounded text-sm focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          aria-label="Email"
          className="px-3 py-2.5 border border-[var(--color-charcoal)]/10 rounded text-sm focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone *"
          aria-label="Phone"
          className="px-3 py-2.5 border border-[var(--color-charcoal)]/10 rounded text-sm focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="bg-[var(--color-teal)] text-white px-5 py-2.5 text-xs font-bold tracking-wider uppercase rounded hover:bg-[var(--color-teal-dark)] transition-colors disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send It to Me"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-[var(--color-gray)] hover:underline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
