"use client";

import { useState, type FormEvent } from "react";
import { LeadConsent, LeadUrgency } from "./LeadConsent";
import { trackLeadFormStart, trackLeadFormSubmit } from "@/lib/analytics";

// Functional replacement for the previously-dead "Claim This Deal" form on the
// sale-home detail pages. The old markup had no field names, no submit handler,
// and lived in a server component — every submission was silently lost. This
// posts straight to /api/leads (CMS enquiry + CRM + email + sheet). Name, email,
// and phone are all required.
export function SaleClaimForm({ homeName }: { homeName: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [started, setStarted] = useState(false);

  const onFirstInput = () => {
    if (!started) {
      setStarted(true);
      trackLeadFormStart("sale_claim");
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const firstName = (data.get("firstName")?.toString() || "").trim();
    const lastName = (data.get("lastName")?.toString() || "").trim();
    const email = (data.get("email")?.toString() || "").trim();
    const phone = (data.get("phone")?.toString() || "").trim();
    const financing = data.get("financing")?.toString() || "";
    const placement = data.get("placement")?.toString() || "";
    const deliveryState = data.get("deliveryState")?.toString() || "";
    const note = (data.get("message")?.toString() || "").trim();

    if (!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.replace(/\D/g, "").length < 10) {
      setErrorMsg("Please add your name, a valid email, and a phone number so we can reach you.");
      setStatus("error");
      return;
    }

    const message = [
      `Claiming the sale discount on the ${homeName}.`,
      financing && `Financing: ${financing}`,
      placement && `Placement: ${placement}`,
      note,
    ]
      .filter(Boolean)
      .join("\n");

    setStatus("submitting");
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
          deliveryState,
          landStatus: placement,
          financingStatus: financing,
          message,
          source: "Homes on Sale — Claim Deal",
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error(`lead post failed: ${res.status}`);
      trackLeadFormSubmit("sale_claim", { name: `${firstName} ${lastName}`, email, phone, interest: homeName });
      setStatus("done");
    } catch {
      setErrorMsg("Something went wrong sending your request. Please try again, or call (260) 308-1457.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-[#84cc16] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Request received!</h3>
        <p className="text-gray-600">
          We&rsquo;ve got your details for the {homeName} and a home specialist will reach out within one business day to lock in your discount.
        </p>
        <p className="text-sm text-gray-500 mt-3">
          Need it sooner? Call{" "}
          <a href="tel:+12603081457" className="text-[#2c7a7b] font-semibold">(260) 308-1457</a>.
        </p>
      </div>
    );
  }

  const input =
    "w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]";

  return (
    <form className="space-y-6" onSubmit={handleSubmit} onFocus={onFirstInput}>
      <LeadUrgency className="bg-[#84cc16]/10 border border-[#84cc16]/40 rounded-lg px-3 py-2.5" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="sc-firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name <span className="text-red-500">*</span></label>
          <input id="sc-firstName" name="firstName" type="text" required autoComplete="given-name" className={input} placeholder="First name" />
        </div>
        <div>
          <label htmlFor="sc-lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name <span className="text-red-500">*</span></label>
          <input id="sc-lastName" name="lastName" type="text" required autoComplete="family-name" className={input} placeholder="Last name" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="sc-email" className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
          <input id="sc-email" name="email" type="email" required autoComplete="email" className={input} placeholder="your@email.com" />
        </div>
        <div>
          <label htmlFor="sc-phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
          <input id="sc-phone" name="phone" type="tel" required autoComplete="tel" className={input} placeholder="(260) 555-0123" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="sc-financing" className="block text-sm font-medium text-gray-700 mb-2">Finance Options</label>
          <select id="sc-financing" name="financing" className={input} defaultValue="">
            <option value="">Select finance option</option>
            <option>Cash</option>
            <option>Finance</option>
            <option>Credit</option>
          </select>
        </div>
        <div>
          <label htmlFor="sc-placement" className="block text-sm font-medium text-gray-700 mb-2">Home Placement</label>
          <select id="sc-placement" name="placement" className={input} defaultValue="">
            <option value="">Select placement option</option>
            <option>In a community</option>
            <option>I have land</option>
            <option>Still looking</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="sc-deliveryState" className="block text-sm font-medium text-gray-700 mb-2">Delivery State</label>
        <select id="sc-deliveryState" name="deliveryState" className={input} defaultValue="">
          <option value="">Select state</option>
          <option>Indiana</option>
          <option>Ohio</option>
          <option>Michigan</option>
        </select>
      </div>

      <div>
        <label htmlFor="sc-message" className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
        <textarea id="sc-message" name="message" rows={4} className={`${input} resize-none`} placeholder="Tell us about your timeline or any questions..." />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-4 bg-[#84cc16] hover:bg-[#65a30d] text-white font-bold rounded-lg transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Submit Request"}
      </button>

      <LeadConsent className="text-center" />
    </form>
  );
}
