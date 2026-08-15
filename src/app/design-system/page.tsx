"use client";

import Link from "next/link";
import { useState } from "react";
import { H2, H3 } from "@/components/Heading";

const colors = [
  { name: "Teal", var: "--color-teal", hex: "#1B6B7D" },
  { name: "Teal Light", var: "--color-teal-light", hex: "#238A9F" },
  { name: "Teal Dark", var: "--color-teal-dark", hex: "#155768" },
  { name: "Orange", var: "--color-orange", hex: "#E8922A" },
  { name: "Orange Light", var: "--color-orange-light", hex: "#F0A94E" },
  { name: "Lime", var: "--color-lime", hex: "#8AC540" },
  { name: "Lime Light", var: "--color-lime-light", hex: "#9FD45C" },
  { name: "Lime Dark", var: "--color-lime-dark", hex: "#74A835" },
  { name: "Charcoal", var: "--color-charcoal", hex: "#2A2A2A" },
  { name: "Charcoal Light", var: "--color-charcoal-light", hex: "#3D3D3D" },
  { name: "Cream", var: "--color-cream", hex: "#F8F7F4" },
  { name: "Cream Dark", var: "--color-cream-dark", hex: "#EDECEA" },
  { name: "Gray", var: "--color-gray", hex: "#888888" },
  { name: "Gray Light", var: "--color-gray-light", hex: "#BBBBBB" },
];

export default function DesignSystemPage() {
  const [accordionOpen, setAccordionOpen] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-16">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal)]">Internal Reference</span>
          <h1 className="font-serif text-5xl lg:text-6xl font-light tracking-tight mt-2 mb-4">Design System</h1>
          <p className="text-base text-[var(--color-gray)] max-w-2xl">
            All UI components, patterns, and design tokens for the Factory Direct Homes Center website. Review and approve components here before using throughout the site.
          </p>
        </div>

        {/* ── COLORS ── */}
        <section className="mb-20">
          <H2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-3 border-b-2 border-[var(--color-charcoal)]/10">Color Palette</H2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {colors.map((c) => (
              <div key={c.var} className="group">
                <div className="aspect-square rounded-lg mb-2 border border-[var(--color-charcoal)]/5" style={{ backgroundColor: c.hex }} />
                <p className="text-xs font-semibold">{c.name}</p>
                <p className="text-[10px] text-[var(--color-gray)] font-mono">{c.hex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TYPOGRAPHY ── */}
        <section className="mb-20">
          <H2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-3 border-b-2 border-[var(--color-charcoal)]/10">Typography</H2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <H3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] mb-4">Display / Serif (Cormorant Garamond)</H3>
              <div className="space-y-4 bg-white rounded-lg p-6 border border-[var(--color-charcoal)]/5">
                <p className="font-serif text-5xl font-light">Heading 1</p>
                <p className="font-serif text-4xl font-light">Heading 2</p>
                <p className="font-serif text-3xl font-semibold">Heading 3</p>
                <p className="font-serif text-2xl font-semibold">Heading 4</p>
                <p className="font-serif text-xl italic text-[var(--color-teal)]">Accent / Tagline</p>
              </div>
            </div>
            <div>
              <H3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] mb-4">Body / Sans (Plus Jakarta Sans)</H3>
              <div className="space-y-4 bg-white rounded-lg p-6 border border-[var(--color-charcoal)]/5">
                <p className="text-lg font-light">Body Large — Light 300</p>
                <p className="text-base">Body Regular — Normal 400</p>
                <p className="text-base font-medium">Body Medium — 500</p>
                <p className="text-sm font-semibold">Body Small Semibold — 600</p>
                <p className="text-xs font-bold tracking-[0.2em] uppercase">Label / Overline — 700</p>
                <p className="text-xs text-[var(--color-gray)]">Caption text — for metadata and fine print</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── BUTTONS ── */}
        <section className="mb-20">
          <H2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-3 border-b-2 border-[var(--color-charcoal)]/10">Buttons</H2>
          <div className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
            <H3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] mb-4">Primary (Lime)</H3>
            <div className="flex flex-wrap gap-4 mb-8">
              <button className="btn-primary bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors">Primary Button</button>
              <button className="btn-primary bg-[var(--color-lime)] text-[var(--color-charcoal)] px-6 py-2.5 text-xs font-bold tracking-wider uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors">Small</button>
              <button className="bg-[var(--color-lime)]/50 text-[var(--color-charcoal)]/50 px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded cursor-not-allowed">Disabled</button>
            </div>

            <H3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] mb-4">Secondary (Teal)</H3>
            <div className="flex flex-wrap gap-4 mb-8">
              <button className="btn-primary bg-[var(--color-teal)] text-white px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-teal-dark)] transition-colors">Teal Button</button>
              <button className="btn-primary bg-[var(--color-teal)] text-white px-6 py-2.5 text-xs font-bold tracking-wider uppercase rounded hover:bg-[var(--color-teal-dark)] transition-colors">Small</button>
            </div>

            <H3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] mb-4">Outline</H3>
            <div className="flex flex-wrap gap-4 mb-8">
              <button className="border-2 border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-charcoal)]/5 transition-colors">Outline</button>
              <button className="border-2 border-[var(--color-teal)] text-[var(--color-teal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-teal)]/5 transition-colors">Teal Outline</button>
            </div>

            <H3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] mb-4">Dark Background</H3>
            <div className="bg-[var(--color-charcoal)] rounded-lg p-6 flex flex-wrap gap-4">
              <button className="btn-primary bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors">Primary on Dark</button>
              <button className="border-2 border-white/20 text-white px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-white/5 transition-colors">Outline on Dark</button>
            </div>
          </div>
        </section>

        {/* ── NAVIGATION ── */}
        <section className="mb-20">
          <H2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-3 border-b-2 border-[var(--color-charcoal)]/10">Navigation</H2>
          <div className="bg-white rounded-lg border border-[var(--color-charcoal)]/5 overflow-hidden">
            <H3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] p-6 pb-3">Breadcrumbs</H3>
            <div className="px-6 pb-6">
              <nav className="flex items-center gap-2 text-sm">
                <Link href="/" className="text-[var(--color-teal)] hover:underline">Home</Link>
                <span className="text-[var(--color-gray-light)]">/</span>
                <Link href="/floor-plans" className="text-[var(--color-teal)] hover:underline">Floor Plans</Link>
                <span className="text-[var(--color-gray-light)]">/</span>
                <span className="text-[var(--color-gray)]">Brighton 2856</span>
              </nav>
            </div>

            <H3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] p-6 pb-3">Pagination</H3>
            <div className="px-6 pb-6 flex gap-1">
              <button className="w-10 h-10 flex items-center justify-center rounded text-sm text-[var(--color-gray)] hover:bg-[var(--color-cream-dark)] transition-colors">&larr;</button>
              <button className="w-10 h-10 flex items-center justify-center rounded bg-[var(--color-teal)] text-white text-sm font-bold">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded text-sm text-[var(--color-charcoal)] hover:bg-[var(--color-cream-dark)] transition-colors">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded text-sm text-[var(--color-charcoal)] hover:bg-[var(--color-cream-dark)] transition-colors">3</button>
              <button className="w-10 h-10 flex items-center justify-center rounded text-sm text-[var(--color-gray)] hover:bg-[var(--color-cream-dark)] transition-colors">&rarr;</button>
            </div>
          </div>
        </section>

        {/* ── TABS ── */}
        <section className="mb-20">
          <H2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-3 border-b-2 border-[var(--color-charcoal)]/10">Tabs</H2>
          <div className="bg-white rounded-lg p-6 border border-[var(--color-charcoal)]/5">
            <div className="flex border-b border-[var(--color-charcoal)]/10">
              {["Single Wides", "Double Wides", "Modular"].map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                    activeTab === i
                      ? "border-[var(--color-teal)] text-[var(--color-teal)]"
                      : "border-transparent text-[var(--color-gray)] hover:text-[var(--color-charcoal)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="pt-6">
              <p className="text-sm text-[var(--color-gray)]">
                {activeTab === 0 && "Content for Single Wides tab — 14–18 ft wide, 500–1,200 sq ft, starting at $50,000."}
                {activeTab === 1 && "Content for Double Wides tab — 24–32 ft wide, 1,000–2,400 sq ft, starting at $80,000."}
                {activeTab === 2 && "Content for Modular tab — IRC-code compliant, permanent foundation, starting at $100,000."}
              </p>
            </div>
          </div>
        </section>

        {/* ── ACCORDION ── */}
        <section className="mb-20">
          <H2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-3 border-b-2 border-[var(--color-charcoal)]/10">Accordion / FAQ</H2>
          <div className="bg-white rounded-lg border border-[var(--color-charcoal)]/5 divide-y divide-[var(--color-charcoal)]/5">
            {[
              { q: "What is the difference between manufactured and modular homes?", a: "Manufactured homes are built to HUD federal code and can be placed on various foundations. Modular homes are built to IRC state/local building codes and must be placed on permanent foundations." },
              { q: "How long does delivery take?", a: "Manufactured homes typically take 8–16 weeks from order to delivery. Modular homes take 12–20 weeks due to additional code compliance requirements." },
              { q: "Do you offer financing?", a: "Yes! We work with multiple lenders offering chattel loans, land-home packages, and conventional mortgages. We'll help you get pre-qualified." },
              { q: "What areas do you serve?", a: "We serve Indiana, Michigan, and Ohio. Our proximity to Champion's Decatur, IN plant means competitive delivery rates across all three states." },
            ].map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setAccordionOpen(accordionOpen === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-sm pr-4">{item.q}</span>
                  <svg className={`w-5 h-5 flex-shrink-0 text-[var(--color-teal)] transition-transform ${accordionOpen === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {accordionOpen === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-[var(--color-gray)] leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CARDS ── */}
        <section className="mb-20">
          <H2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-3 border-b-2 border-[var(--color-charcoal)]/10">Cards</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Floor plan card */}
            <div className="bg-white rounded-lg border border-[var(--color-charcoal)]/8 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[16/11] bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center relative">
                <span className="text-xs text-[var(--color-gray-light)] uppercase tracking-wider">Image</span>
                <span className="absolute top-3 left-3 bg-[var(--color-teal)] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">Multi-Section</span>
              </div>
              <div className="p-5">
                <H3 className="font-semibold mb-1">Brighton 2856</H3>
                <p className="text-xs text-[var(--color-teal)] font-medium mb-3">Split bedroom, island kitchen</p>
                <div className="flex gap-3 text-xs text-[var(--color-gray)] mb-4">
                  <span>1,493 ft²</span><span>|</span><span>3 Bed</span><span>|</span><span>2 Bath</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-charcoal)]/5">
                  <span className="font-serif text-xl font-semibold text-[var(--color-teal)]">$89,900</span>
                  <span className="text-xs font-bold uppercase text-[var(--color-lime-dark)]">View →</span>
                </div>
              </div>
            </div>

            {/* Feature card */}
            <div className="bg-white rounded-lg p-8 text-center border border-[var(--color-charcoal)]/5">
              <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-full bg-[var(--color-teal)]/10 text-[var(--color-teal)]">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <H3 className="font-semibold mb-2">Feature Card</H3>
              <p className="text-sm text-[var(--color-gray)]">Centered layout for benefits and features sections.</p>
            </div>

            {/* Testimonial card */}
            <div className="bg-white rounded-lg border border-[var(--color-charcoal)]/5 p-6">
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} className="w-4 h-4 text-[var(--color-orange)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ))}
              </div>
              <p className="text-sm text-[var(--color-charcoal)]/70 mb-4">&ldquo;Great experience buying our home. Highly recommend!&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-teal)]/10 flex items-center justify-center text-[var(--color-teal)] font-bold text-sm">J</div>
                <div>
                  <div className="font-semibold text-sm">Jane D.</div>
                  <div className="text-xs text-[var(--color-gray)]">Auburn, IN</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ALERTS / BADGES ── */}
        <section className="mb-20">
          <H2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-3 border-b-2 border-[var(--color-charcoal)]/10">Alerts &amp; Badges</H2>
          <div className="space-y-4 mb-8">
            {alertVisible && (
              <div className="flex items-center justify-between bg-[var(--color-teal)]/10 border border-[var(--color-teal)]/20 rounded-lg px-5 py-4">
                <p className="text-sm text-[var(--color-teal-dark)] font-medium">Info: New Champion floor plans are now available!</p>
                <button onClick={() => setAlertVisible(false)} className="text-[var(--color-teal)] ml-4">&times;</button>
              </div>
            )}
            <div className="bg-[var(--color-lime)]/10 border border-[var(--color-lime)]/20 rounded-lg px-5 py-4">
              <p className="text-sm text-[var(--color-lime-dark)] font-medium">Success: Your inquiry has been submitted.</p>
            </div>
            <div className="bg-[var(--color-orange)]/10 border border-[var(--color-orange)]/20 rounded-lg px-5 py-4">
              <p className="text-sm text-[var(--color-orange-dark)] font-medium">Warning: Limited-time pricing on select models.</p>
            </div>
          </div>

          <H3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] mb-4">Badges</H3>
          <div className="flex flex-wrap gap-3">
            <span className="bg-[var(--color-teal)] text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded">Single Wide</span>
            <span className="bg-[var(--color-lime)] text-[var(--color-charcoal)] text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded">On Sale</span>
            <span className="bg-[var(--color-orange)] text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded">Featured</span>
            <span className="bg-[var(--color-charcoal)] text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded">New</span>
            <span className="border border-[var(--color-teal)] text-[var(--color-teal)] text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded">Modular</span>
          </div>
        </section>

        {/* ── FORM ELEMENTS ── */}
        <section className="mb-20">
          <H2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-3 border-b-2 border-[var(--color-charcoal)]/10">Form Elements</H2>
          <div className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5 max-w-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-gray)] mb-2">Text Input</label>
                <input type="text" placeholder="Enter your name" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 bg-[var(--color-cream)] text-sm rounded focus:outline-none focus:border-[var(--color-teal)] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-gray)] mb-2">Select / Dropdown</label>
                <select className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 bg-[var(--color-cream)] text-sm rounded focus:outline-none focus:border-[var(--color-teal)] transition-colors">
                  <option>Select an option...</option>
                  <option>Single Wide</option>
                  <option>Multi-Section</option>
                  <option>Modular</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-gray)] mb-2">Textarea</label>
                <textarea rows={3} placeholder="Your message..." className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 bg-[var(--color-cream)] text-sm rounded focus:outline-none focus:border-[var(--color-teal)] transition-colors resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="check-demo" className="w-4 h-4 accent-[var(--color-teal)]" />
                <label htmlFor="check-demo" className="text-sm">Checkbox label</label>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <input type="radio" name="radio-demo" id="r1" className="w-4 h-4 accent-[var(--color-teal)]" defaultChecked />
                  <label htmlFor="r1" className="text-sm">Option A</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="radio-demo" id="r2" className="w-4 h-4 accent-[var(--color-teal)]" />
                  <label htmlFor="r2" className="text-sm">Option B</label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MODAL ── */}
        <section className="mb-20">
          <H2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-3 border-b-2 border-[var(--color-charcoal)]/10">Modal / Dialog</H2>
          <button onClick={() => setModalOpen(true)} className="btn-primary bg-[var(--color-teal)] text-white px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-teal-dark)] transition-colors">
            Open Modal
          </button>
          {modalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
              <div className="relative bg-white rounded-lg max-w-md w-full p-8 shadow-2xl">
                <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-[var(--color-gray)] hover:text-[var(--color-charcoal)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <H3 className="font-serif text-2xl font-semibold mb-3">Schedule a Visit</H3>
                <p className="text-sm text-[var(--color-gray)] mb-6">Come see our model homes in person at our Auburn, IN showroom.</p>
                <div className="flex gap-3">
                  <a href="tel:+12603081457" className="btn-primary flex-1 text-center bg-[var(--color-lime)] text-[var(--color-charcoal)] px-6 py-3 text-sm font-bold rounded hover:bg-[var(--color-lime-dark)] transition-colors">Call Now</a>
                  <button onClick={() => setModalOpen(false)} className="flex-1 border-2 border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)] px-6 py-3 text-sm font-bold rounded hover:bg-[var(--color-charcoal)]/5 transition-colors">Close</button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── GALLERY / IMAGE GRID ── */}
        <section className="mb-20">
          <H2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-3 border-b-2 border-[var(--color-charcoal)]/10">Gallery Grid</H2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1,2,3,4,5,6,7,8].map((n) => (
              <div key={n} className={`bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center border border-[var(--color-charcoal)]/5 hover:shadow-md transition-shadow cursor-pointer ${n === 1 ? "col-span-2 row-span-2 aspect-square" : "aspect-[4/3]"}`}>
                <span className="text-xs text-[var(--color-gray-light)] uppercase tracking-wider">Photo {n}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="mb-20">
          <H2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-3 border-b-2 border-[var(--color-charcoal)]/10">Stats Bar</H2>
          <div className="bg-[var(--color-teal)] rounded-lg py-10 px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
              {[
                { value: "70+", label: "Floor Plans" },
                { value: "4.8\u2605", label: "Customer Rating" },
                { value: "6", label: "States Served" },
                { value: "$50K", label: "Starting Price" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-serif text-3xl font-bold">{s.value}</div>
                  <div className="text-sm text-white/70 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEARCH BAR ── */}
        <section className="mb-20">
          <H2 className="text-xl font-bold uppercase tracking-wider mb-6 pb-3 border-b-2 border-[var(--color-charcoal)]/10">Search / Filter Bar</H2>
          <div className="bg-[var(--color-charcoal)] rounded-lg p-8">
            <div className="bg-white/95 rounded-lg p-3 flex flex-col md:flex-row gap-3">
              <select className="flex-1 px-4 py-3.5 border border-[var(--color-charcoal)]/10 rounded text-sm bg-white focus:outline-none focus:border-[var(--color-teal)]">
                <option>Select Type</option>
              </select>
              <select className="flex-1 px-4 py-3.5 border border-[var(--color-charcoal)]/10 rounded text-sm bg-white focus:outline-none focus:border-[var(--color-teal)]">
                <option>Any Sq. Ft.</option>
              </select>
              <select className="flex-1 px-4 py-3.5 border border-[var(--color-charcoal)]/10 rounded text-sm bg-white focus:outline-none focus:border-[var(--color-teal)]">
                <option>Any Bedroom</option>
              </select>
              <select className="flex-1 px-4 py-3.5 border border-[var(--color-charcoal)]/10 rounded text-sm bg-white focus:outline-none focus:border-[var(--color-teal)]">
                <option>Any Bathroom</option>
              </select>
              <button className="btn-primary bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors whitespace-nowrap">
                SEARCH
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
