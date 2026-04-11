"use client";

import Link from "next/link";
import { H2, H3 } from "@/components/Heading";
import { useEffect } from "react";
import { trackLocationView, trackCTAClick } from "@/lib/analytics";

interface LocationPageProps {
  city: string;
  state: string;
  stateAbbr: string;
  distance: string;
  deliveryCost: string;
  description: string;
  counties: string[];
}

export function LocationPageTemplate({ city, state, stateAbbr, distance, deliveryCost, description, counties }: LocationPageProps) {
  useEffect(() => {
    trackLocationView(city, state);
  }, [city, state]);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                Serving {city}, {state}
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Manufactured Homes<br />
              <span className="italic text-[var(--color-teal-light)]">Delivered to {city}</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl mb-8">
              {description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/floor-plans"
                onClick={() => trackCTAClick("browse_floor_plans", `location_${city.toLowerCase().replace(/\s+/g, '_')}`)}
                className="btn-primary inline-flex items-center justify-center bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-lime-dark)] transition-colors duration-300"
              >
                Browse Floor Plans
              </Link>
              <Link
                href="/contact"
                onClick={() => trackCTAClick("get_custom_quote", `location_${city.toLowerCase().replace(/\s+/g, '_')}`)}
                className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300"
              >
                Get a Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="decorative-line mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                Why {city} Homeowners<br />
                <span className="italic text-[var(--color-teal)]">Choose Factory Direct</span>
              </H2>
              <div className="space-y-6 text-base text-[var(--color-gray)] leading-relaxed">
                <p>
                  We&apos;re located just {distance} from {city}, making us one of the closest 
                  Champion Homes dealers serving {state}. Shorter delivery distances mean 
                  lower costs and faster move-in dates.
                </p>
                <p>
                  Unlike national chains that treat you like a number, we&apos;re a family-owned 
                  business that believes in partnership. Every contract shows line-item pricing 
                  for the home, delivery, setup, and site work. Use our trusted contractors, 
                  or bring your own and save thousands.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-[var(--color-cream-dark)] rounded-lg p-8 lg:p-12">
              <H3 className="font-serif text-2xl font-semibold mb-8">Delivery to {city}</H3>
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[var(--color-charcoal)]/10">
                  <span className="text-[var(--color-gray)]">Distance from Auburn, IN</span>
                  <span className="font-semibold text-lg">{distance}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[var(--color-charcoal)]/10">
                  <span className="text-[var(--color-gray)]">Estimated Delivery</span>
                  <span className="font-semibold text-lg">{deliveryCost}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[var(--color-charcoal)]/10">
                  <span className="text-[var(--color-gray)]">Typical Timeline</span>
                  <span className="font-semibold text-lg">8-12 weeks</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-gray)]">Service Area</span>
                  <span className="font-semibold text-lg">{counties.length} Counties</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Counties */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              We Serve <span className="italic text-[var(--color-teal)]">All of {state}</span>
            </H2>
            <p className="text-[var(--color-gray)] mt-4 max-w-2xl mx-auto">
              From {city} to every corner of {state}, we deliver Champion manufactured 
              and modular homes with factory-direct pricing.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {counties.map((county) => (
              <div
                key={county}
                className="bg-white rounded-lg px-6 py-4 text-center border border-[var(--color-charcoal)]/5"
              >
                <span className="font-medium">{county} County</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Ready to Find <span className="italic text-[var(--color-teal-light)]">Your Home?</span>
          </H2>
          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
            Browse our floor plans online, visit our Auburn showroom, or give us a call. 
            We&apos;ll create a custom quote for delivery to {city} — with every cost itemized 
            so you know exactly what you&apos;re paying for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/floor-plans"
              className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            >
              Browse Floor Plans
            </Link>
            <a
              href="tel:+12603081457"
              className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300"
            >
              Call (260) 308-1457
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
