"use client";

import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import { H2, H3 } from "@/components/Heading";
import { DeliveryChecker } from "@/components/DeliveryChecker";
import {
  trackLeadFormStart,
  trackLeadFormError, 
  trackLeadFormSubmit,
  trackPhoneClick,
  trackEmailClick,
  FacebookEvents
} from "@/lib/analytics";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formStarted, setFormStarted] = useState(false);
  // Deep-link prefill: detail pages link here with ?home=<name> (Get a Quote)
  // and &visit=1 (Schedule a Lot Visit), so the message arrives pre-written.
  const [prefill, setPrefill] = useState<{ home: string; visit: boolean }>({ home: "", visit: false });

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const home = q.get("home") || "";
    const visit = q.get("visit") === "1" || q.get("tour") === "1";
    if (home || visit) setPrefill({ home, visit });
  }, []);

  // Track when user starts interacting with form
  useEffect(() => {
    const handleFormStart = () => {
      if (!formStarted) {
        setFormStarted(true);
        trackLeadFormStart("contact_page_main");
        FacebookEvents.getQuote();
      }
    };

    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('focusin', handleFormStart, { once: true });
    }

    return () => {
      if (form) {
        form.removeEventListener('focusin', handleFormStart);
      }
    };
  }, [formStarted]);

  function validate(form: HTMLFormElement): FormErrors {
    const data = new FormData(form);
    const errs: FormErrors = {};
    if (!data.get("firstName")?.toString().trim()) errs.firstName = "First name is required.";
    if (!data.get("lastName")?.toString().trim()) errs.lastName = "Last name is required.";
    const email = data.get("email")?.toString().trim() || "";
    if (!email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please enter a valid email address.";
    return errs;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(e.currentTarget);
    setErrors(errs);
    
    if (Object.keys(errs).length === 0) {
      const data = new FormData(e.currentTarget);
      const interest = data.get("interest")?.toString() || "not_specified";
      const firstName = data.get("firstName")?.toString() || "";
      const lastName = data.get("lastName")?.toString() || "";
      const email = data.get("email")?.toString() || "";
      const phone = data.get("phone")?.toString() || "";
      const landStatus = data.get("landStatus")?.toString() || "not_specified";
      const timeframe = data.get("timeframe")?.toString() || "not_specified";
      const financingStatus = data.get("financingStatus")?.toString() || "not_specified";
      const deliveryState = data.get("deliveryState")?.toString() || "";
      const bedrooms = data.get("bedrooms")?.toString() || "";
      // Lot-visit preferences ride inside the message so every lead channel
      // (CRM, email, CMS list) sees them without schema changes.
      const visitDate = data.get("visitDate")?.toString() || "";
      const visitTime = data.get("visitTime")?.toString() || "";
      const message = [
        data.get("message")?.toString() || "",
        visitDate || visitTime
          ? `[Lot visit requested — preferred: ${[visitDate, visitTime].filter(Boolean).join(", ")}]`
          : "",
      ].filter(Boolean).join("\n\n");

      try {
        // Submit to API
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone,
            interest,
            deliveryState,
            bedrooms,
            landStatus,
            timeframe,
            financingStatus,
            message,
            source: "Contact Form",
            pageUrl: window.location.href,
          }),
        });

        if (response.ok) {
          // Track lead submission with full data
          trackLeadFormSubmit("contact_page_main", {
            id: `lead_${Date.now()}`,
            name: `${firstName} ${lastName}`.trim(),
            email: email,
            phone: phone,
            interest: interest,
            landStatus: landStatus,
            timeframe: timeframe,
            financingStatus: financingStatus,
            value: 50000,
            currency: "USD",
          });
          
          setSubmitted(true);
        } else {
          const error = await response.json();
          console.error("Lead submission failed:", error);
          trackLeadFormError("contact_page_main", ["submission_failed"]);
          alert("There was an error submitting your message. Please try again or call us directly.");
        }
      } catch (error) {
        console.error("Lead submission error:", error);
        trackLeadFormError("contact_page_main", ["network_error"]);
        alert("There was an error submitting your message. Please try again or call us directly.");
      }
    } else {
      trackLeadFormError("contact_page_main", Object.keys(errs));
    }
  }

  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">Get in Touch</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Let&rsquo;s Talk <span className="italic text-[var(--color-teal-light)]">Home</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              Whether you&rsquo;re ready to buy or just starting to explore, we&rsquo;re here to answer your questions. No pressure, no gimmicks — just honest guidance.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="decorative-line mb-6" />
              <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-8">Visit Our Showroom</H2>

              <div className="space-y-8 mb-12">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[var(--color-teal)]/10 text-[var(--color-teal)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  </div>
                  <div>
                    <H3 className="font-semibold mb-1">Address</H3>
                    <address className="not-italic text-sm text-[var(--color-gray)] leading-relaxed">1211 State Road 8<br />Auburn, IN 46706</address>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[var(--color-teal)]/10 text-[var(--color-teal)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  </div>
                  <div>
                    <H3 className="font-semibold mb-1">Phone</H3>
                    <a 
                      href="tel:+12603081457"
                      onClick={() => trackPhoneClick("contact_page_showroom", "contact")}
                      className="inline-flex min-h-12 items-center text-sm text-[var(--color-teal)] hover:underline"
                    >(260) 308-1457</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[var(--color-teal)]/10 text-[var(--color-teal)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  </div>
                  <div>
                    <H3 className="font-semibold mb-1">Email</H3>
                    <a 
                      href="mailto:sales@factorydirecthomescenter.com"
                      onClick={() => trackEmailClick("contact_page_showroom", "contact")}
                      className="inline-flex min-h-12 items-center text-sm text-[var(--color-teal)] hover:underline"
                    >sales@factorydirecthomescenter.com</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[var(--color-teal)]/10 text-[var(--color-teal)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <H3 className="font-semibold mb-1">Hours</H3>
                    <p className="text-sm text-[var(--color-gray)]">Monday – Friday: 9:00 AM – 5:00 PM<br />Saturday: 10:00 AM – 4:00 PM<br />Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Google Map — matches the Google Business Profile location */}
              <div className="rounded-lg overflow-hidden border border-[var(--color-charcoal)]/10">
                <iframe
                  title="Factory Direct Homes Center — 1211 State Road 8, Auburn, IN 46706 on Google Maps"
                  src="https://www.google.com/maps?q=Factory+Direct+Homes+Center,+1211+State+Road+8,+Auburn,+IN+46706&output=embed"
                  className="w-full h-72 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Factory+Direct+Homes+Center,+1211+State+Road+8,+Auburn,+IN+46706"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-6 py-3 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
                >
                  Get Directions
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Factory+Direct+Homes+Center+Auburn+IN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)]/15 px-6 py-3 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-charcoal)]/5 transition-colors"
                >
                  Find Us on Google
                </a>
              </div>

              <div className="mt-8">
                <DeliveryChecker />
              </div>
            </div>

            <div className="bg-[var(--color-cream-dark)] rounded-lg p-8 lg:p-10">
              <div className="decorative-line mb-6" />
              <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-6">Send Us a Message</H2>
              <p className="text-[var(--color-gray)] mb-8">Tell us what you&rsquo;re looking for and we&rsquo;ll get back to you within one business day.</p>

              {submitted ? (
                <div className="bg-[var(--color-lime)]/10 border border-[var(--color-lime)] rounded-lg p-6 text-center">
                  <p className="text-[var(--color-charcoal)] font-semibold mb-2">Thank you for reaching out!</p>
                  <p className="text-sm text-[var(--color-gray)]">We&rsquo;ve received your message and will respond within one business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {Object.keys(errors).length > 0 && (
                    <div role="alert" aria-live="polite" className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                      Please fix the errors below to continue.
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2">First Name <span aria-hidden="true" className="text-red-500">*</span></label>
                      <input type="text" id="firstName" name="firstName" aria-required="true" aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? "firstName-error" : undefined} className={`w-full px-4 py-3 border rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors ${errors.firstName ? "border-red-400" : "border-[var(--color-charcoal)]/10"}`} />
                      {errors.firstName && <p id="firstName-error" className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2">Last Name <span aria-hidden="true" className="text-red-500">*</span></label>
                      <input type="text" id="lastName" name="lastName" aria-required="true" aria-invalid={!!errors.lastName} aria-describedby={errors.lastName ? "lastName-error" : undefined} className={`w-full px-4 py-3 border rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors ${errors.lastName ? "border-red-400" : "border-[var(--color-charcoal)]/10"}`} />
                      {errors.lastName && <p id="lastName-error" className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email <span aria-hidden="true" className="text-red-500">*</span></label>
                    <input type="email" id="email" name="email" aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={`w-full px-4 py-3 border rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors ${errors.email ? "border-red-400" : "border-[var(--color-charcoal)]/10"}`} />
                    {errors.email && <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
                    <input type="tel" id="phone" name="phone" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors" />
                  </div>

                  <div>
                    <label htmlFor="interest" className="block text-sm font-medium mb-2">I&rsquo;m Interested In</label>
                    <select id="interest" name="interest" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors bg-white">
                      <option value="">Select an option...</option>
                      <option value="single-wide">Single Wide Home</option>
                      <option value="double-wide">Multi-Section Home</option>
                      <option value="modular">Modular Home</option>
                      <option value="financing">Financing Information</option>
                      <option value="general">General Information</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="deliveryState" className="block text-sm font-medium mb-2">Delivery State</label>
                      <select id="deliveryState" name="deliveryState" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors bg-white">
                        <option value="">Select state...</option>
                        <option value="Indiana">Indiana</option>
                        <option value="Ohio">Ohio</option>
                        <option value="Michigan">Michigan</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="bedrooms" className="block text-sm font-medium mb-2">Bedrooms</label>
                      <select id="bedrooms" name="bedrooms" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors bg-white">
                        <option value="">Any</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="landStatus" className="block text-sm font-medium mb-2">Do you have land for the home?</label>
                    <select id="landStatus" name="landStatus" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors bg-white">
                      <option value="">Select an option...</option>
                      <option value="yes-owned">Yes, I own land</option>
                      <option value="yes-purchasing">Yes, in the process of buying</option>
                      <option value="no-need-land">No, I need to find land</option>
                      <option value="park">Placing in a manufactured home community / park</option>
                      <option value="unsure">Not sure yet</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="timeframe" className="block text-sm font-medium mb-2">Expected Timeframe</label>
                      <select id="timeframe" name="timeframe" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors bg-white">
                        <option value="">Select timeframe...</option>
                        <option value="asap">ASAP (0-3 Months)</option>
                        <option value="3-6-months">3-6 Months</option>
                        <option value="6-12-months">6-12 Months</option>
                        <option value="1-year-plus">1+ Year out</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="financingStatus" className="block text-sm font-medium mb-2">Financing Status</label>
                      <select id="financingStatus" name="financingStatus" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors bg-white">
                        <option value="">Select status...</option>
                        <option value="cash">Cash Buyer</option>
                        <option value="pre-approved">Pre-approved</option>
                        <option value="need-financing">Need to apply for financing</option>
                        <option value="unsure">Not sure / Exploring options</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Preferred Communication Method</label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="contactMethod" value="phone" className="w-4 h-4 text-[var(--color-teal)] border-[var(--color-charcoal)]/20 rounded focus:ring-[var(--color-teal)]" />
                        <span className="text-sm">Phone</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="contactMethod" value="text" className="w-4 h-4 text-[var(--color-teal)] border-[var(--color-charcoal)]/20 rounded focus:ring-[var(--color-teal)]" />
                        <span className="text-sm">Text</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="contactMethod" value="email" className="w-4 h-4 text-[var(--color-teal)] border-[var(--color-charcoal)]/20 rounded focus:ring-[var(--color-teal)]" />
                        <span className="text-sm">Email</span>
                      </label>
                    </div>
                  </div>

                  <fieldset className="border border-[var(--color-charcoal)]/10 rounded-lg p-4">
                    <legend className="text-sm font-medium px-2">Want to see homes in person? Schedule a lot visit <span className="text-[var(--color-gray)] font-normal">(optional)</span></legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-1">
                      <div>
                        <label htmlFor="visitDate" className="block text-sm font-medium mb-2">Preferred Day</label>
                        <input type="date" id="visitDate" name="visitDate" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors bg-white" />
                      </div>
                      <div>
                        <label htmlFor="visitTime" className="block text-sm font-medium mb-2">Preferred Time</label>
                        <select id="visitTime" name="visitTime" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors bg-white">
                          <option value="">No preference</option>
                          <option value="Morning (9 AM - 12 PM)">Morning (9 AM – 12 PM)</option>
                          <option value="Afternoon (12 - 5 PM)">Afternoon (12 – 5 PM)</option>
                          <option value="Saturday (10 AM - 4 PM)">Saturday (10 AM – 4 PM)</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--color-gray)] mt-3">We&rsquo;ll confirm your visit by phone or email — walk-ins are always welcome too.</p>
                  </fieldset>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      // Remount when the deep-link prefill resolves so defaultValue applies.
                      key={`${prefill.home}|${prefill.visit}`}
                      defaultValue={
                        prefill.visit
                          ? `I'd like to schedule a lot visit${prefill.home ? ` to see the ${prefill.home}` : ""}.`
                          : prefill.home
                            ? `I'm interested in the ${prefill.home}.`
                            : ""
                      }
                      className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary w-full bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300 rounded">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
