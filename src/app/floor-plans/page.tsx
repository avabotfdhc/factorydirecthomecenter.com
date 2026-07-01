import Link from "next/link";
import type { Metadata } from "next";
import { getApiFloorPlans } from "@/lib/api-content";
import { StructuredData, structuredData } from "@/lib/seo";
import { FAQSection } from "@/components/FAQSection";
import { commonFAQs } from "@/lib/faqs";

const SITE = "https://factorydirecthomescenter.com";

export const metadata: Metadata = {
  title: "Manufactured & Modular Home Floor Plans | Champion — Auburn, IN",
  description:
    "Browse Champion single wide, double wide, and modular home floor plans with factory-direct pricing from Factory Direct Homes Center in Auburn, Indiana. Serving IN, OH, MI, WI, IL & KY.",
  alternates: { canonical: `${SITE}/floor-plans` },
  keywords: [
    "manufactured home floor plans",
    "champion homes floor plans",
    "single wide floor plans",
    "double wide floor plans",
    "modular home floor plans",
  ],
};

// Rendered live from the CMS so new/edited homes appear without a redeploy.
export const dynamic = "force-dynamic";

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
            {" "}— factory-direct pricing from Auburn, Indiana, serving IN, OH, MI, WI, IL &amp; KY.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((p) => (
              <Link
                key={p.slug}
                href={`/floor-plans/${p.slug}`}
                className="group block border border-[var(--color-charcoal)]/8 hover:border-[var(--color-teal)]/30 bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-[var(--color-cream-dark)] to-[var(--color-cream)] relative overflow-hidden border-b border-[var(--color-charcoal)]/5">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={`${p.name} — ${p.beds} bed ${p.baths} bath manufactured home floor plan`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[var(--color-gray-light)] text-sm">
                      No photo
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h2 className="font-serif text-xl font-semibold group-hover:text-[var(--color-teal)] transition-colors">
                      {p.name}
                    </h2>
                    <span className="text-sm font-bold text-[var(--color-lime-dark)] whitespace-nowrap">
                      {p.price}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-teal)] font-medium mb-4">{p.brand}</p>
                  <div className="flex gap-4 text-xs tracking-wider uppercase text-[var(--color-gray)]">
                    <span>{p.sqft.toLocaleString()} sq ft</span>
                    <span className="text-[var(--color-gray-light)]">|</span>
                    <span>{p.beds} Bed</span>
                    <span className="text-[var(--color-gray-light)]">|</span>
                    <span>{p.baths} Bath</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
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
