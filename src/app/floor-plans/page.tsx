import type { Metadata } from "next";
import { getApiFloorPlans } from "@/lib/api-content";
import { StructuredData, structuredData } from "@/lib/seo";
import { FAQSection } from "@/components/FAQSection";
import { commonFAQs } from "@/lib/faqs";
import { FloorPlansGrid } from "./FloorPlansGrid";
import { SpecsDisclaimer } from "@/components/SpecsDisclaimer";
import { anchorPriceFor } from "@/lib/price-sheet";

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

      {/* What the "From $X" figures on the cards mean. Shoppers comparing
          dealers need a number to anchor on, but an unqualified one invites
          "why was my quote higher?" — so say up front what is and isn't in it. */}
      <section className="bg-white border-b border-[var(--color-charcoal)]/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <h2 className="font-serif text-2xl font-light mb-3">What these prices include</h2>
          <p className="text-[var(--color-charcoal)]/70 max-w-3xl mb-6">
            The <strong>&ldquo;From&rdquo;</strong> figure on each card is a starting point for that
            type of home — the base home at factory-direct pricing, before options. Delivery, setup,
            and site work are quoted separately, line by line, so you can see every number and hire
            your own contractors where it saves you money.
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-sm">
            {[
              { term: "Single wide", detail: `From $${anchorPriceFor("single")?.toLocaleString("en-US")} — base home` },
              { term: "Double wide / multi-section", detail: `From $${anchorPriceFor("multi")?.toLocaleString("en-US")} — base home` },
              { term: "Delivery + setup", detail: "$2,500–$8,000 and $5,000–$15,000, quoted per site" },
              { term: "Options & upgrades", detail: "Quoted line by line — ask for the models you're considering" },
            ].map((row) => (
              <div key={row.term} className="bg-[var(--color-cream)] rounded-lg p-4">
                <dt className="font-semibold text-[var(--color-charcoal)]">{row.term}</dt>
                <dd className="text-[var(--color-charcoal)]/70 mt-1">{row.detail}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-[var(--color-charcoal)]/60 mt-5">
            Options, upgrades, taxes, and site work vary by home and property.{" "}
            <a href="/guides/pricing" className="text-[var(--color-teal)] font-semibold underline underline-offset-4">
              See exactly how our line-item pricing works
            </a>{" "}
            — or{" "}
            <a href="/contact-us" className="text-[var(--color-teal)] font-semibold underline underline-offset-4">
              ask for a line-item quote
            </a>{" "}
            on any plan below.
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
