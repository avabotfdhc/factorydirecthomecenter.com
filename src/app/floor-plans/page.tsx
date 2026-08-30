import type { Metadata } from "next";
import { getApiFloorPlans } from "@/lib/api-content";
import { StructuredData, structuredData } from "@/lib/seo";
import { FAQSection } from "@/components/FAQSection";
import { commonFAQs } from "@/lib/faqs";
import { FloorPlansGrid } from "./FloorPlansGrid";
import { SpecsDisclaimer } from "@/components/SpecsDisclaimer";

const SITE = "https://factorydirecthomescenter.com";

export const metadata: Metadata = {
  title: "Champion Floor Plans & Home Models",
  description:
    "Browse Champion single wide, double wide, and modular home floor plans with factory-direct pricing from Factory Direct Homes Center in Auburn, Indiana. Serving Indiana, Ohio, and Michigan.",
  alternates: { canonical: `${SITE}/floor-plans` },
  keywords: [
    "manufactured home floor plans",
    "champion homes floor plans",
    "single wide floor plans",
    "double wide floor plans",
    "modular home floor plans",
  ],
};

// ISR: refreshed from the CMS every 5 min, so new/edited homes appear without a
// redeploy — but the API is hit at most once per window (not once per visitor),
// and Next serves the last-good copy if the API is briefly unavailable.
export const revalidate = 300;

export default async function FloorPlansPage() {
  const plans = await getApiFloorPlans();

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: plans.slice(0, 100).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}/floor-plans/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      <StructuredData data={itemListLd} />
      <StructuredData
        data={structuredData.breadcrumb([
          { name: "Home", url: "/" },
          { name: "Floor Plans", url: "/floor-plans" },
        ])}
      />

      {/* Hero */}
      <section className="bg-[var(--color-charcoal)] text-[var(--color-cream)] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-lime)] mb-4">
            Champion Home Builders Dealer
          </p>
          <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mb-5">
            Manufactured &amp; Modular <span className="italic text-[var(--color-teal-light)]">Home Floor Plans</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
            Explore {plans.length}{" "}Champion single wide, double wide, and modular floor plans
            {" "}— factory-direct pricing from Auburn, Indiana, serving IN, OH &amp; MI. Every home
            is built to order:{" "}
            <a href="/options" className="text-[var(--color-teal-light)] underline underline-offset-4">
              browse factory options &amp; selections
            </a>.
          </p>
        </div>
      </section>

      {/* Prices are not published per home here. Every model's MSRP and sale
          price is on /homes-on-sale, from the master price sheet; a single
          "from" figure standing in for a whole home type only set an
          expectation the line-item quote had to climb away from. */}
      <section className="bg-white border-b border-[var(--color-charcoal)]/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <h2 className="font-serif text-2xl font-light mb-3">What a home costs</h2>
          <p className="text-[var(--color-charcoal)]/70 max-w-3xl mb-5">
            We quote line by line — the home, delivery, setup, and site work as separate numbers,
            so you can see every one and hire your own contractors where it saves you money. That
            means the price depends on the plan and options you choose and on your property, which
            is why you won&apos;t find a single headline figure on these cards.
          </p>
          <p className="text-sm text-[var(--color-charcoal)]/60">
            <a href="/homes-on-sale" className="text-[var(--color-teal)] font-semibold underline underline-offset-4">
              See current prices on every floor plan
            </a>
            {" · "}
            <a href="/guides/pricing" className="text-[var(--color-teal)] font-semibold underline underline-offset-4">
              How our line-item pricing works
            </a>
            {" · "}
            <a href="/contact-us" className="text-[var(--color-teal)] font-semibold underline underline-offset-4">
              Ask for a quote on any plan
            </a>
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        {plans.length === 0 ? (
          <p className="text-center text-[var(--color-gray)]">
            Our floor plans are being updated — please call{" "}
            <a href="tel:+12603081457" className="text-[var(--color-teal)] font-semibold">(260) 308-1457</a>{" "}
            and we&apos;ll help you find the right home.
          </p>
        ) : (
          <FloorPlansGrid plans={plans} />
        )}
        <SpecsDisclaimer className="mt-12" />
      </section>

      {/* FAQ (adds FAQPage schema) */}
      <FAQSection
        title="Floor Plan Questions"
        subtitle="Sizes, customization, pricing, and delivery"
        faqs={commonFAQs.homepage.slice(0, 6)}
      />
    </main>
  );
}
