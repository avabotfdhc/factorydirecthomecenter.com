import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import { getFloorPlanBySlug, getAllFloorPlanSlugs, getRelatedFloorPlans } from "@/lib/floor-plans";
import { FAQSection } from "@/components/FAQSection";
import { CTABlock } from "@/components/CTABlock";
import { H2, H3 } from "@/components/Heading";
import { FloorPlanTracker } from "./FloorPlanTracker";

export function generateStaticParams() {
  return getAllFloorPlanSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = getFloorPlanBySlug(slug);
  if (!plan) return {};
  return genMeta({
    title: `${plan.name} | ${plan.beds} Bed ${plan.baths} Bath ${plan.type}`,
    description: plan.description,
    url: `/floor-plans/${plan.slug}`,
    image: plan.heroImage,
    imageAlt: plan.heroImageAlt,
    keywords: [
      `${plan.name.toLowerCase()} floor plan`,
      `${plan.type.toLowerCase()} manufactured home`,
      `${plan.beds} bedroom ${plan.type.toLowerCase()}`,
    ],
  });
}

export default async function FloorPlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = getFloorPlanBySlug(slug);
  if (!plan) notFound();

  const related = getRelatedFloorPlans(plan.slug);

  return (
    <>
      <FloorPlanTracker plan={plan} />
      {/* Structured Data */}
      <StructuredData
        data={structuredData.product({
          name: plan.name,
          description: plan.description,
          image: plan.heroImage,
          sku: plan.sku,
          brand: "Champion Homes",
          price: plan.priceNumeric,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        })}
      />
      <StructuredData
        data={structuredData.breadcrumb([
          { name: "Home", url: "/" },
          { name: "Floor Plans", url: "/floor-plans" },
          { name: plan.name, url: `/floor-plans/${plan.slug}` },
        ])}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="absolute inset-0">
          <Image
            src={plan.heroImage}
            alt={plan.heroImageAlt}
            fill
            priority
            className="object-cover opacity-20"
            sizes="100vw"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="badge badge-teal text-[10px]">{plan.type}</span>
            <span className="badge text-[10px] bg-white/10 text-white">{plan.code} Code</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
            {plan.name}
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mb-8">
            {plan.description}
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-white/40 block text-xs uppercase tracking-wider">Sq Ft</span>
              <span className="text-xl font-light">{plan.sqft.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-white/40 block text-xs uppercase tracking-wider">Beds</span>
              <span className="text-xl font-light">{plan.beds}</span>
            </div>
            <div>
              <span className="text-white/40 block text-xs uppercase tracking-wider">Baths</span>
              <span className="text-xl font-light">{plan.baths}</span>
            </div>
            <div>
              <span className="text-white/40 block text-xs uppercase tracking-wider">Starting At</span>
              <span className="text-xl font-light text-[var(--color-lime)]">{plan.price}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <CTABlock
            text={`Interested in the ${plan.name}? Get a personalized quote with our line-item pricing.`}
            href="/contact"
            label="Get a Quote"
            variant="secondary"
          />
        </div>
      </section>

      {/* Features & Specs */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Features */}
            <div>
              <div className="decorative-line mb-6" />
              <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-8">
                Features & Highlights
              </H2>
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[var(--color-teal)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[var(--color-charcoal)]/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specs */}
            <div>
              <div className="decorative-line mb-6" />
              <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-8">
                Specifications
              </H2>
              <div className="space-y-4">
                {Object.entries(plan.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-[var(--color-charcoal)]/5">
                    <span className="text-sm font-medium text-[var(--color-gray)] capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="text-sm font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Champion */}
      <section className="py-16 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight text-center mb-12">
            Why Choose a Champion Home?
          </H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-3">30 mi</div>
              <H3 className="font-semibold text-sm mb-2">Factory Proximity</H3>
              <p className="text-xs text-[var(--color-gray)]">Built at Champion&apos;s Topeka, IN factory — just 30 miles from our showroom. Lower delivery costs and easy factory visits.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">100%</div>
              <H3 className="font-semibold text-sm mb-2">Transparent Pricing</H3>
              <p className="text-xs text-[var(--color-gray)]">Line-item pricing on every quote. See exactly what you pay for — home, delivery, setup, and site work. No hidden fees.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">500+</div>
              <H3 className="font-semibold text-sm mb-2">Homes Delivered</H3>
              <p className="text-xs text-[var(--color-gray)]">Across Indiana, Ohio, Michigan, Wisconsin, Illinois, and Kentucky. We handle the entire process from order to move-in.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {plan.faqs.length > 0 && (
        <FAQSection
          title={`${plan.name} Questions`}
          subtitle={`Common questions about the ${plan.name}`}
          faqs={plan.faqs}
          showSchema={true}
        />
      )}

      {/* Bottom CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <CTABlock
            text={`Ready to see the ${plan.name} in person? Visit our Auburn showroom or request a custom quote.`}
            href="/contact"
            label="Schedule a Visit"
            variant="primary"
          />
        </div>
      </section>

      {/* Related Floor Plans */}
      {related.length > 0 && (
        <section className="py-16 bg-[var(--color-cream-dark)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mb-8">
              Similar Floor Plans
            </H2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((model) => (
                <Link
                  key={model.slug}
                  href={`/floor-plans/${model.slug}`}
                  className="bg-white rounded-lg p-6 border border-[var(--color-charcoal)]/5 hover:shadow-md transition-shadow group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-teal)]">{model.type}</span>
                  <H3 className="font-serif text-xl font-semibold tracking-tight mt-1 mb-2 group-hover:text-[var(--color-teal)] transition-colors">
                    {model.name}
                  </H3>
                  <div className="flex gap-4 text-xs text-[var(--color-gray)] mb-3">
                    <span>{model.sqft.toLocaleString()} sq ft</span>
                    <span>{model.beds} bed</span>
                    <span>{model.baths} bath</span>
                  </div>
                  <p className="text-sm text-[var(--color-lime-dark)] font-semibold">{model.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
