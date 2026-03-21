"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const homeTypes = [
  {
    title: "Single Wide",
    subtitle: "Efficient Living",
    sqft: "500 – 1,200 sq ft",
    beds: "1–3 Bed",
    baths: "1–2 Bath",
    startingAt: "$50,000",
    description: "Thoughtfully designed for smart, comfortable living. Perfect for first-time buyers, downsizers, or anyone who values quality over excess.",
    features: ["14–18 ft wide", "Up to 80 ft long", "Open floor plans"],
    image: "/images/homepage/single-wides.webp",
  },
  {
    title: "Double Wide",
    subtitle: "Room to Breathe",
    sqft: "1,000 – 2,400 sq ft",
    beds: "2–4 Bed",
    baths: "2–3 Bath",
    startingAt: "$80,000",
    description: "Spacious sectional homes that rival site-built quality. The Brighton and Silverton series offer generous layouts for growing families.",
    features: ["24–32 ft wide", "Multiple living areas", "Walk-in closets"],
    image: "/images/homepage/double-wides.webp",
  },
  {
    title: "Modular",
    subtitle: "Built to Code",
    sqft: "1,000 – 2,500+ sq ft",
    beds: "2–5 Bed",
    baths: "2+ Bath",
    startingAt: "$100,000",
    description: "IRC-code compliant homes placed on permanent foundations. Indistinguishable from site-built, with factory precision and pricing.",
    features: ["Permanent foundation", "IRC building codes", "Fully customizable"],
    image: "/images/homepage/feature-find-home.webp",
  },
];

const testimonials = [
  { quote: "Buying our home was the best decision we ever made. The team walked us through every step and we saved thousands compared to site-built.", name: "David B.", location: "Fort Wayne, IN" },
  { quote: "We were priced out of the traditional market. Our double wide gives us everything we wanted at half the price.", name: "Sarah M.", location: "Indianapolis, IN" },
  { quote: "As a veteran, the VA financing with no money down was incredible. The process was smooth and our home is beautiful.", name: "James T.", location: "South Bend, IN" },
];

const featuredPlans = [
  { name: "Brighton 2856", type: "Double Wide", sqft: "1,493", beds: 3, baths: 2, price: "$89,900", highlight: "Split bedroom, island kitchen", image: "/images/homepage/brighton-2852.png" },
  { name: "Aspire 1672", type: "Single Wide", sqft: "1,152", beds: 3, baths: 2, price: "$62,500", highlight: "Master suite with walk-in", image: "/images/homepage/single-wides.webp" },
  { name: "Silverton 2876", type: "Double Wide", sqft: "1,493", beds: 4, baths: 2, price: "$94,500", highlight: "Dual living areas", image: "/images/homepage/silverton-2856.png" },
  { name: "Aspire Modular 3268", type: "Modular", sqft: "2,176", beds: 4, baths: 3, price: "$149,900", highlight: "Luxury en-suite master", image: "/images/homepage/georgetown-2864.png" },
];

export default function Home() {
  const [homeType, setHomeType] = useState("");
  const [sqft, setSqft] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");

  return (
    <>
      {/* Hero with Search */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background image placeholder with overlay */}
        <div className="absolute inset-0 bg-[var(--color-charcoal)]">
          <div className="absolute inset-0 bg-[url('/images/homepage/hero-banner.webp')] bg-cover bg-center opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/60 via-transparent to-[var(--color-charcoal)]/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 lg:py-40 w-full">
          {/* Headline */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-tight tracking-tight mb-4">
              Single Wides, Double Wides and<br className="hidden lg:block" /> Modular Homes for sale
            </h1>
          </div>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-3 flex flex-col md:flex-row gap-3">
              <select
                value={homeType}
                onChange={(e) => setHomeType(e.target.value)}
                className="flex-1 px-4 py-3.5 border border-[var(--color-charcoal)]/10 rounded text-sm text-[var(--color-charcoal)] bg-white focus:outline-none focus:border-[var(--color-teal)] transition-colors"
              >
                <option value="">Select Type</option>
                <option value="single-wide">Single Wide</option>
                <option value="double-wide">Double Wide</option>
                <option value="modular">Modular</option>
              </select>
              <select
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                className="flex-1 px-4 py-3.5 border border-[var(--color-charcoal)]/10 rounded text-sm text-[var(--color-charcoal)] bg-white focus:outline-none focus:border-[var(--color-teal)] transition-colors"
              >
                <option value="">Any Sq. Ft.</option>
                <option value="under-800">Under 800</option>
                <option value="800-1200">800 – 1,200</option>
                <option value="1200-1800">1,200 – 1,800</option>
                <option value="1800-plus">1,800+</option>
              </select>
              <select
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="flex-1 px-4 py-3.5 border border-[var(--color-charcoal)]/10 rounded text-sm text-[var(--color-charcoal)] bg-white focus:outline-none focus:border-[var(--color-teal)] transition-colors"
              >
                <option value="">Any Bedroom</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
              <select
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                className="flex-1 px-4 py-3.5 border border-[var(--color-charcoal)]/10 rounded text-sm text-[var(--color-charcoal)] bg-white focus:outline-none focus:border-[var(--color-teal)] transition-colors"
              >
                <option value="">Any Bathroom</option>
                <option value="1">1 Bathroom</option>
                <option value="2">2 Bathrooms</option>
                <option value="3">3+ Bathrooms</option>
              </select>
              <Link
                href={`/floor-plans${homeType ? `#${homeType}` : ""}`}
                className="btn-primary flex items-center justify-center gap-2 bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors duration-300 whitespace-nowrap"
              >
                SEARCH
              </Link>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="max-w-4xl mx-auto mt-10">
            <div className="bg-[var(--color-charcoal)]/70 backdrop-blur-sm rounded-lg px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-white text-lg font-medium">
                We make the home buying process easy!
              </p>
              <Link
                href="/contact"
                className="btn-primary bg-[var(--color-lime)] text-[var(--color-charcoal)] px-6 py-3 text-sm font-bold rounded hover:bg-[var(--color-lime-dark)] transition-colors whitespace-nowrap"
              >
                Schedule a meeting
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Floor Plans */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              Featured Floor Plans
            </h2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlans.map((plan) => (
              <div key={plan.name} className="group bg-white rounded-lg border border-[var(--color-charcoal)]/8 overflow-hidden hover:shadow-lg hover:border-[var(--color-teal)]/30 transition-all duration-400">
                <div className="aspect-[16/11] bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
                  <Image
                    src={plan.image}
                    alt={plan.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <span className="absolute top-3 left-3 bg-[var(--color-teal)] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded z-10">
                    {plan.type}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-base mb-1">{plan.name}</h3>
                  <p className="text-xs text-[var(--color-teal)] font-medium mb-3">{plan.highlight}</p>

                  <div className="flex gap-3 text-xs text-[var(--color-gray)] mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
                      {plan.sqft} ft²
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                      {plan.beds} Bed
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {plan.baths} Bath
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--color-charcoal)]/5">
                    <span className="font-serif text-xl font-semibold text-[var(--color-teal)]">{plan.price}</span>
                    <Link href="/floor-plans" className="text-xs font-bold uppercase tracking-wider text-[var(--color-lime-dark)] hover:text-[var(--color-teal)] transition-colors">
                      View Plan →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/floor-plans" className="btn-primary inline-flex items-center gap-2 bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors duration-300">
              View All Floor Plans
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Factory Direct */}
      <section className="py-20 lg:py-28 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              Why Choose Factory Direct?
            </h2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto mb-6" />
            <p className="text-base text-[var(--color-gray)] max-w-2xl mx-auto">
              We&rsquo;re a family-owned business that believes everyone deserves a quality home at an honest price.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Factory-Direct Pricing", desc: "No middlemen. We buy directly from Champion\u2019s Decatur, IN plant \u2014 shorter delivery, lower costs, passed on to you.", icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { title: "Champion Exclusive", desc: "America\u2019s #2 home builder, with 20% national market share. Full lineup \u2014 Aspire, Brighton, Silverton, and more.", icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" },
              { title: "Full-Service", desc: "From selection to setup \u2014 site prep, delivery, installation, and utility connections. We handle it all.", icon: "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" },
              { title: "Tri-State Delivery", desc: "Serving Indiana, Michigan, and Ohio. Proximity to Champion\u2019s plant means faster delivery and lower costs.", icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-lg p-8 text-center border border-[var(--color-charcoal)]/5 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-full bg-[var(--color-teal)]/10 text-[var(--color-teal)]">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-gray)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Home Types */}
      <section className="py-20 lg:py-28 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              Browse by Home Type
            </h2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {homeTypes.map((home) => (
              <div key={home.title} className="group bg-white/5 border border-white/10 rounded-lg hover:border-[var(--color-teal)]/40 transition-all duration-500 overflow-hidden">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={home.image}
                    alt={home.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <div className="p-8 pb-6 border-b border-white/10">
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-lime)]">{home.subtitle}</span>
                  <h3 className="font-serif text-3xl font-semibold mt-2 mb-4">{home.title}</h3>
                  <div className="flex gap-4 text-xs tracking-wider uppercase text-white/50">
                    <span>{home.sqft}</span>
                    <span className="text-white/20">|</span>
                    <span>{home.beds}</span>
                    <span className="text-white/20">|</span>
                    <span>{home.baths}</span>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-sm text-white/60 leading-relaxed mb-6">{home.description}</p>
                  <ul className="space-y-2 mb-8">
                    {home.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                        <div className="w-1.5 h-1.5 bg-[var(--color-lime)] rounded-full flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs text-white/40 uppercase tracking-wider">Starting at</span>
                      <div className="font-serif text-2xl font-semibold text-[var(--color-lime)]">{home.startingAt}</div>
                    </div>
                    <Link href="/floor-plans" className="text-sm font-semibold text-white/60 hover:text-[var(--color-lime)] transition-colors flex items-center gap-1">
                      Explore
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[var(--color-teal)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "500+", label: "Happy Homeowners" },
              { value: "4.8\u2605", label: "Customer Rating" },
              { value: "3", label: "States Served" },
              { value: "$50K", label: "Starting Price" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-3xl lg:text-4xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              What Our Homeowners Say
            </h2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="relative bg-white rounded-lg border border-[var(--color-charcoal)]/5 p-8 hover:shadow-md transition-shadow">
                <div className="mb-3">
                  <Image src="/images/homepage/quote.svg" alt="" width={24} height={24} className="opacity-20" />
                </div>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-[var(--color-orange)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote>
                  <p className="text-sm leading-relaxed text-[var(--color-charcoal)]/70 mb-5">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-teal)]/10 flex items-center justify-center text-[var(--color-teal)] font-bold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-[var(--color-gray)]">{t.location}</div>
                    </div>
                  </footer>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing CTA */}
      <section className="py-20 lg:py-28 bg-[var(--color-cream-dark)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <Image
            src="/images/homepage/about-2.webp"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
            Affordable Financing Options
          </h2>
          <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto mb-6" />
          <p className="text-base text-[var(--color-gray)] leading-relaxed mb-8 max-w-2xl mx-auto">
            FHA, VA, conventional, and chattel loans available. As low as 0% down for veterans.
            We&rsquo;ll connect you with trusted lenders and guide you through pre-qualification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/financing" className="btn-primary inline-flex items-center justify-center bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors duration-300">
              Explore Financing
            </Link>
            <a href="tel:+12603081457" className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-charcoal)]/5 transition-colors duration-300">
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
                Visit Our Auburn Location
              </h2>
              <div className="w-16 h-1 bg-[var(--color-lime)] mb-6" />
              <p className="text-base text-[var(--color-gray)] leading-relaxed mb-8">
                See our model homes in person. Walk through floor plans, explore customization
                options, and talk with our team about making your dream home a reality.
              </p>
              <address className="not-italic space-y-3 mb-8">
                <p className="font-semibold">1211 State Road 8, Auburn, IN 46706</p>
                <p className="text-sm text-[var(--color-gray)]">Mon–Fri: 9 AM – 5 PM &nbsp;|&nbsp; Sat: 10 AM – 4 PM</p>
              </address>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://maps.google.com/?q=1211+State+Road+8+Auburn+IN+46706" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-teal-dark)] transition-colors duration-300">
                  Get Directions
                </a>
                <Link href="/contact" className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-charcoal)]/5 transition-colors duration-300">
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="aspect-square lg:aspect-[4/3] bg-gray-100 rounded-lg border border-[var(--color-charcoal)]/5 overflow-hidden">
              <iframe title="Factory Direct Homes Center location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3003.5!2d-85.0583!3d41.3668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDIyJzAwLjUiTiA4NcKwMDMnMjkuOSJX!5e0!3m2!1sen!2sus!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
