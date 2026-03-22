"use client";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export const metadata: Metadata = {
  title: "Emerald Sky | 3 Bed 2 Bath Modular Home | Factory Direct Homes Center",
  description: "The Emerald Sky by Champion Homes — 1,680 sq ft modular home with 3 bedrooms, 2 baths, fireplace, kitchen island, and office/flex room. Built at the largest Champion factory in Topeka, IN. Factory-direct pricing from Auburn dealer.",
};

const homeDetails = {
  name: "Emerald Sky",
  series: "Champion Homes",
  type: "Modular",
  sqft: 1680,
  beds: 3,
  baths: 2,
  sections: "Multi-Section",
  code: "IRC (State Building Code)",
  price: "Contact for Pricing",
  description: "The Emerald Sky offers modern modular living with site-built quality. This 1,680 square foot home features an open-concept layout with fireplace, gourmet kitchen with island, and a versatile office/flex room. Built to IRC codes for permanent foundation placement.",
  features: [
    "Fireplace",
    "Garage Ready",
    "Walk-in Pantry",
    "Endwall Entry",
    "Kitchen Island",
    "Freestanding Bathtub",
    "Office/Flex Room",
    "Porch/Outdoor Living Area",
    "Utility Room",
    "Walk-in Shower",
  ],
  specs: {
    width: "28-32 ft",
    length: "56-76 ft",
    ceiling: "9' ceilings",
    bedrooms: "3 (split design)",
    bathrooms: "2 full",
    kitchen: "Island with pantry",
    living: "Open concept with fireplace",
    foundation: "Permanent (required)",
    construction: "IRC Modular Code",
  },
};

const similarHomes = [
  {
    name: "Aspire 3260",
    sqft: 1820,
    beds: 3,
    baths: 2,
    highlight: "Larger footprint, optional study",
    slug: "#",
  },
  {
    name: "Brighton 2856",
    sqft: 1493,
    beds: 3,
    baths: 2,
    highlight: "Split bedroom design",
    slug: "#",
  },
  {
    name: "Paramount 3272",
    sqft: 2184,
    beds: 3,
    baths: 2,
    highlight: "Luxury master suite",
    slug: "#",
  },
];

export default function EmeraldSkyPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [showForm, setShowForm] = useState(false);

  // Placeholder images - replace with real photos when available
  const images = [
    { src: "/images/hero-home.jpg", alt: "Emerald Sky Exterior" },
    { src: "/images/home-white-black-landscape.png", alt: "Modern Exterior Design" },
    { src: "/images/home-white-black-front.png", alt: "Front Elevation" },
    { src: "/images/home-white-black-side.png", alt: "Side View" },
  ];

  return (
    <>
      {/* Hero Gallery */}
      <section className="relative pt-32 pb-12 lg:pt-40 bg-[var(--color-charcoal)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Image */}
            <div className="relative aspect-video lg:aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={images[activeImage].src}
                alt={images[activeImage].alt}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4">
                <span className="bg-[var(--color-lime)] text-[var(--color-charcoal)] px-4 py-2 text-sm font-bold uppercase tracking-wider rounded">
                  Modular Home
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-[var(--color-charcoal)] px-4 py-2 text-sm font-medium rounded">
                  {activeImage + 1} / {images.length}
                </span>
              </div>
            </div>

            {/* Thumbnails & Quick Info */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="font-serif text-4xl lg:text-5xl font-light text-white mb-2">
                  {homeDetails.name}
                </h1>
                <p className="text-white/60">
                  by {homeDetails.series} — Built in Topeka, IN
                </p>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="font-serif text-2xl font-semibold text-[var(--color-lime)]">{homeDetails.sqft}</div>
                  <div className="text-white/60 text-sm">Sq Ft</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="font-serif text-2xl font-semibold text-[var(--color-lime)]">{homeDetails.beds}</div>
                  <div className="text-white/60 text-sm">Beds</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="font-serif text-2xl font-semibold text-[var(--color-lime)]">{homeDetails.baths}</div>
                  <div className="text-white/60 text-sm">Baths</div>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx ? "border-[var(--color-lime)]" : "border-transparent opacity-60"
                    }`}
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" />
                  </button>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary w-full bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300 rounded-lg"
              >
                Get Local Pricing
              </button>
              <p className="text-white/40 text-xs text-center">
                Factory-direct pricing. No obligation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2">
              <div className="decorative-line mb-6" />
              <h2 className="font-serif text-3xl lg:text-4xl font-light mb-6">
                About the <span className="italic text-[var(--color-teal)]">{homeDetails.name}</span>
              </h2>
              <p className="text-[var(--color-gray)] leading-relaxed text-lg mb-8">
                {homeDetails.description}
              </p>

              {/* Features */}
              <h3 className="font-serif text-2xl font-semibold mb-6">Home Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {homeDetails.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[var(--color-lime)] rounded-full" />
                    <span className="text-[var(--color-gray)]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specs Sidebar */}
            <div className="bg-[var(--color-cream-dark)] rounded-lg p-8">
              <h3 className="font-serif text-xl font-semibold mb-6">Specifications</h3>
              <div className="space-y-4">
                {Object.entries(homeDetails.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start pb-4 border-b border-[var(--color-charcoal)]/10 last:border-0">
                    <span className="text-[var(--color-gray)] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--color-charcoal)]/10">
                <div className="flex items-center gap-2 text-sm text-[var(--color-teal)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Built in Topeka, IN — 20 miles away</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financing Info */}
      <section className="py-16 lg:py-24 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="decorative-line mx-auto mb-6" />
            <h2 className="font-serif text-3xl lg:text-4xl font-light">
              Financing the <span className="italic text-[var(--color-teal)]">{homeDetails.name}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 text-center">
              <h3 className="font-serif text-xl font-semibold mb-4">Conventional Mortgage</h3>
              <p className="text-[var(--color-gray)] text-sm mb-4">
                As an IRC-code modular home, the Emerald Sky qualifies for traditional mortgages with competitive rates.
              </p>
              <span className="text-[var(--color-teal)] font-bold text-sm">Best for: Land-home packages</span>
            </div>
            <div className="bg-white rounded-lg p-8 text-center">
              <h3 className="font-serif text-xl font-semibold mb-4">FHA Loan</h3>
              <p className="text-[var(--color-gray)] text-sm mb-4">
                FHA Title II loans available with as little as 3.5% down for qualified buyers.
              </p>
              <span className="text-[var(--color-teal)] font-bold text-sm">Best for: First-time buyers</span>
            </div>
            <div className="bg-white rounded-lg p-8 text-center">
              <h3 className="font-serif text-xl font-semibold mb-4">VA Loan</h3>
              <p className="text-[var(--color-gray)] text-sm mb-4">
                Veterans can finance with 0% down, no mortgage insurance, and competitive rates.
              </p>
              <span className="text-[var(--color-teal)] font-bold text-sm">Best for: Veterans</span>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Homes */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="decorative-line mx-auto mb-6" />
            <h2 className="font-serif text-3xl lg:text-4xl font-light">
              Similar <span className="italic text-[var(--color-teal)]">Homes</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarHomes.map((home, idx) => (
              <Link
                key={idx}
                href={home.slug}
                className="group bg-white rounded-lg border border-[var(--color-charcoal)]/5 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-[var(--color-cream-dark)] relative">
                  <Image
                    src="/images/hero-home.jpg"
                    alt={home.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-[var(--color-teal)] transition-colors">
                    {home.name}
                  </h3>
                  <p className="text-[var(--color-gray)] text-sm mb-4">
                    {home.sqft} sq ft • {home.beds} bed • {home.baths} bath
                  </p>
                  <p className="text-[var(--color-teal)] text-sm font-medium">{home.highlight}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Ready to See the <span className="italic text-[var(--color-teal-light)]">{homeDetails.name}?</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
            Visit our Auburn showroom to tour this home, or request a custom quote. 
            Built at the largest Champion factory in the country, just 20 miles away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            >
              Get Local Pricing
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300"
            >
              Schedule a Tour
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--color-charcoal)]/10 flex items-center justify-between">
              <h3 className="font-serif text-xl font-semibold">Request Pricing: {homeDetails.name}</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-[var(--color-gray)] hover:text-[var(--color-charcoal)]"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input type="text" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded-lg focus:outline-none focus:border-[var(--color-teal)]" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input type="tel" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded-lg focus:outline-none focus:border-[var(--color-teal)]" placeholder="(260) 555-0123" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded-lg focus:outline-none focus:border-[var(--color-teal)]" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Do you own land?</label>
                <select className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded-lg focus:outline-none focus:border-[var(--color-teal)]">
                  <option>Select an option</option>
                  <option>Yes, I own land</option>
                  <option>I'm looking for land</option>
                  <option>I plan to lease/rent land</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Financing preference</label>
                <select className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded-lg focus:outline-none focus:border-[var(--color-teal)]">
                  <option>Select an option</option>
                  <option>Cash purchase</option>
                  <option>Need financing</option>
                  <option>Pre-approved</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Timeline</label>
                <select className="w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded-lg focus:outline-none focus:border-[var(--color-teal)]">
                  <option>Select an option</option>
                  <option>Ready to buy now</option>
                  <option>1-3 months</option>
                  <option>3-6 months</option>
                  <option>6+ months</option>
                  <option>Just researching</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300 rounded-lg"
              >
                Request Pricing
              </button>
              <p className="text-xs text-[var(--color-gray)] text-center">
                We'll respond within 24 hours. No spam, ever.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
