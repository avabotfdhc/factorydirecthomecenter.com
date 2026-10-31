"use client";

import Link from "next/link";
import { H2, H3 } from "@/components/Heading";
import { useEffect } from "react";
import { trackLocationView, trackCTAClick } from "@/lib/analytics";
import { businessAreaRef } from "@/lib/business";
import { NoRecommendationNotice } from "@/components/NoRecommendationNotice";
import { jsonLdScript } from "@/lib/json-ld";
import { NeighborCounties } from "@/components/NeighborCounties";

interface LocationFAQ {
  question: string;
  answer: string;
}

interface LocationSection {
  heading: string;
  // Plain paragraphs; each string becomes its own <p>.
  paragraphs: string[];
}

// One row of the "At a glance" box. Page-specific and sourced: a value that
// cannot be checked against a public source does not go in.
interface LocationFact {
  label: string;
  value: string;
}

// A public office or utility a buyer deals with directly. Links go to the
// office's own site; we name who answers, we never answer for them.
interface LocationContact {
  name: string;
  role: string;
  href?: string;
}

interface LocationPageProps {
  city: string;
  state: string;
  stateAbbr: string;
  distance: string;
  description: string;
  counties: string[];
  // The hand-written local content is what makes each page worth its URL —
  // Google's spam policies treat pages that differ only by place name as
  // doorway pages. Every page on this template must carry its own sections
  // and FAQs; the shared copy below is kept to a few sentences on purpose.
  localSections?: LocationSection[];
  faqs?: LocationFAQ[];
  nearbyTowns?: string[];
  /** County pages only: their slug, to link the neighbouring county pages. */
  countySlug?: string;
  facts?: LocationFact[];
  contacts?: LocationContact[];
}

export function LocationPageTemplate({ city, state, distance, description, counties, localSections, faqs, nearbyTowns, facts, contacts, countySlug }: LocationPageProps) {
  useEffect(() => {
    trackLocationView(city, state);
  }, [city, state]);

  const slug = city.toLowerCase().replace(/\s+/g, "_");

  // A patch on the `#business` node the root layout already published, not a
  // copy of it: spreading `businessJsonLd()` here gave this page a second full
  // identity node, and Semrush counts the node's markup error once per node
  // (2026-10-09 crawl — five county pages and /contact-us were still doing it
  // after the location templates were fixed). `@context` is declared by the
  // enclosing @graph, so the standalone one is dropped.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { "@context": _ctx, ...businessNode } = businessAreaRef({
    description: `Authorized Champion Homes dealer serving ${city}, ${state} and the surrounding ${counties.map((c) => `${c} County`).join(", ")} area with factory-direct manufactured and modular homes.`,
    areaServed: [
      { "@type": "City", name: `${city}, ${state}` },
      ...counties.map((c) => ({ "@type": "AdministrativeArea" as const, name: `${c} County, ${state}` })),
    ],
  });
  const ldGraph: Record<string, unknown>[] = [
    businessNode,
    ...(faqs && faqs.length
      ? [{
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }]
      : []),
  ];

  const glance: LocationFact[] = [
    { label: "From our Auburn showroom", value: distance },
    ...(facts ?? []),
    { label: "Freight", value: "Quoted per route, as its own line" },
    { label: "Order to move-in", value: "Typically 8–12 weeks" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript({ "@context": "https://schema.org", "@graph": ldGraph }) }}
      />
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
            <p className="text-lg text-white/70 leading-relaxed max-w-xl mb-8">
              {description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/floor-plans"
                onClick={() => trackCTAClick("browse_floor_plans", `location_${slug}`)}
                className="btn-primary inline-flex items-center justify-center bg-[var(--color-lime)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-lime-dark)] transition-colors duration-300"
              >
                Browse Floor Plans
              </Link>
              <Link
                href="/contact-us"
                onClick={() => trackCTAClick("get_custom_quote", `location_${slug}`)}
                className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300"
              >
                Get a Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* At a glance */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <div className="decorative-line mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                {city} <span className="italic text-[var(--color-teal)]">at a glance</span>
              </H2>
              <div className="space-y-5 text-base text-[var(--color-gray)] leading-relaxed">
                <p>
                  We sell Champion homes, quote each one line by line and arrange delivery
                  from the plant. You own the land side: you hire your own licensed
                  contractors for the site, foundation and set-up, and you pull the
                  permits with the offices listed on this page.
                </p>
              </div>
            </div>

            <div className="bg-[var(--color-cream-dark)] rounded-lg p-8 lg:p-10">
              <dl className="space-y-5">
                {glance.map((f, i) => (
                  <div
                    key={f.label}
                    className={`flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-6 ${i < glance.length - 1 ? "pb-4 border-b border-[var(--color-charcoal)]/10" : ""}`}
                  >
                    <dt className="text-[var(--color-gray)]">{f.label}</dt>
                    <dd className="font-semibold sm:text-right">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* The page's own local content */}
      {localSections && localSections.length > 0 && (
        <section className="py-20 lg:py-24 border-t border-[var(--color-charcoal)]/5">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="space-y-12">
              {localSections.map((sec) => (
                <div key={sec.heading}>
                  <H2 className="font-serif text-3xl font-light mb-5">{sec.heading}</H2>
                  <div className="space-y-4 text-[var(--color-charcoal)]/80 leading-relaxed">
                    {sec.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {nearbyTowns && nearbyTowns.length > 0 && (
              <p className="text-sm text-[var(--color-gray)] mt-12">
                Also nearby: {nearbyTowns.join(", ")}.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Who answers for what — public offices, linked to their own sites */}
      {contacts && contacts.length > 0 && (
        <section className="py-20 lg:py-24 bg-[var(--color-cream-dark)]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-4">
              Who to call <span className="italic text-[var(--color-teal)]">in {city}</span>
            </H2>
            <p className="text-[var(--color-gray)] mb-8">
              These offices set the rules and issue the permits. Check with them about your
              parcel before you buy land or order a home.
            </p>
            <ul className="space-y-4">
              {contacts.map((c) => (
                <li key={c.name} className="bg-white rounded-lg px-6 py-4 border border-[var(--color-charcoal)]/5">
                  <div className="font-semibold">
                    {c.href ? (
                      <a href={c.href} rel="noopener" className="text-[var(--color-teal)] underline underline-offset-4">
                        {c.name}
                      </a>
                    ) : (
                      c.name
                    )}
                  </div>
                  <div className="text-sm text-[var(--color-gray)] mt-1">{c.role}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Location FAQ (emits FAQPage schema above) */}
      {faqs && faqs.length > 0 && (
        <section className="py-20 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-10 text-center">
              {city} Manufactured Homes — <span className="italic text-[var(--color-teal)]">Common Questions</span>
            </H2>
            <div className="space-y-6">
              {faqs.map((f) => (
                <div key={f.question} className="border-b border-[var(--color-charcoal)]/8 pb-6">
                  <H3 className="font-semibold text-lg mb-2">{f.question}</H3>
                  <p className="text-[var(--color-charcoal)]/75 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Ready to Find <span className="italic text-[var(--color-teal-light)]">Your Home?</span>
          </H2>
          <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
            Walk the model homes on our Auburn lot, or ask for a quote with delivery to {city} priced as its own line.
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
            <Link
              href="/showroom"
              className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300"
            >
              Visit the Showroom
            </Link>
          </div>
        </div>
      </section>

      {/* The contractor and lender lists are information, never a recommendation — see src/lib/referrals.ts */}
      <section className="pb-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <NoRecommendationNotice subject="both" />
        </div>
      </section>
      {countySlug && <NeighborCounties slug={countySlug} />}
    </>
  );
}
