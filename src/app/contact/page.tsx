"use client";

import type { FormEvent } from "react";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-terracotta-light)]">Get in Touch</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Let&rsquo;s Talk <span className="italic text-[var(--color-terracotta-light)]">Home</span>
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
              <h2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-8">Visit Our Showroom</h2>

              <div className="space-y-8 mb-12">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <address className="not-italic text-sm text-[var(--color-warm-gray)] leading-relaxed">1211 State Road 8<br />Auburn, IN 46706</address>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:+12603081457" className="text-sm text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] transition-colors">(260) 308-1457</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:sales@factorydirecthomescenter.com" className="text-sm text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] transition-colors">sales@factorydirecthomescenter.com</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Hours</h3>
                    <div className="text-sm text-[var(--color-warm-gray)] space-y-0.5">
                      <p>Monday – Friday: 9:00 AM – 5:00 PM</p>
                      <p>Saturday: 10:00 AM – 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="aspect-[4/3] bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/5">
                <iframe title="Factory Direct Homes Center location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3003.5!2d-85.0583!3d41.3668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDIyJzAwLjUiTiA4NcKwMDMnMjkuOSJX!5e0!3m2!1sen!2sus!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>

            <div>
              <div className="bg-white border border-[var(--color-charcoal)]/5 p-8 lg:p-10">
                <h2 className="font-serif text-2xl font-semibold mb-2">Send Us a Message</h2>
                <p className="text-sm text-[var(--color-warm-gray)] mb-8">Tell us what you&rsquo;re looking for and we&rsquo;ll get back to you within one business day.</p>

                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[var(--color-sage)]/10 text-[var(--color-sage)]">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <h3 className="font-serif text-2xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-sm text-[var(--color-warm-gray)]">We&rsquo;ll be in touch within one business day.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-warm-gray)] mb-2">First Name</label>
                        <input type="text" id="firstName" name="firstName" required className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 bg-[var(--color-cream)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors" />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-warm-gray)] mb-2">Last Name</label>
                        <input type="text" id="lastName" name="lastName" required className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 bg-[var(--color-cream)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-warm-gray)] mb-2">Email</label>
                      <input type="email" id="email" name="email" required className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 bg-[var(--color-cream)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-warm-gray)] mb-2">Phone</label>
                      <input type="tel" id="phone" name="phone" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 bg-[var(--color-cream)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors" />
                    </div>
                    <div>
                      <label htmlFor="interest" className="block text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-warm-gray)] mb-2">I&rsquo;m Interested In</label>
                      <select id="interest" name="interest" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 bg-[var(--color-cream)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors">
                        <option value="">Select an option...</option>
                        <option value="single-wide">Single Wide Homes</option>
                        <option value="double-wide">Double Wide Homes</option>
                        <option value="modular">Modular Homes</option>
                        <option value="financing">Financing Information</option>
                        <option value="tour">Schedule a Tour</option>
                        <option value="general">General Inquiry</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-warm-gray)] mb-2">Message</label>
                      <textarea id="message" name="message" rows={5} className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 bg-[var(--color-cream)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors resize-none" />
                    </div>
                    <button type="submit" className="btn-primary w-full bg-[var(--color-terracotta)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-terracotta-dark)] transition-colors duration-300">
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
