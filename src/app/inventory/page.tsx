import Link from "next/link";
import Image from "next/image";
import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import { getFloorPlanBySlug } from "@/lib/floor-plans";
import { CTABlock } from "@/components/CTABlock";
import { H3 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Available Homes & Quick Move-In Inventory | Auburn, IN",
  description: "Browse our current inventory of factory-built homes available for quick delivery. Skip the factory wait time with these ready-to-move-in Champion homes.",
  keywords: ["available manufactured homes", "quick move in homes", "inventory homes in stock", "champion homes lot models"],
  url: "/inventory",
});

export default function InventoryPage() {
  // Pull a few floor plans to act as "inventory"
  const inventorySlugs = ["1456", "brighton-2856", "summit-2864"];
  const availableHomes = inventorySlugs
    .map(slug => getFloorPlanBySlug(slug))
    .filter((home): home is NonNullable<typeof home> => home !== undefined);

  return (
    <>
      <StructuredData data={structuredData.website()} />
      <StructuredData
        data={structuredData.breadcrumb([
          { name: "Home", url: "/" },
          { name: "Available Homes", url: "/inventory" },
        ])}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="decorative-line" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
              Quick Move-In
            </span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
            Available <span className="italic text-[var(--color-teal-light)]">Homes</span>
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mb-8">
            Skip the 8-12 week factory build time. These homes are built, on our lot, and ready for immediate delivery to your site. Give us a call to secure yours today.
          </p>
        </div>
      </section>

      {/* Inventory Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {availableHomes.length === 0 ? (
            <p className="text-[var(--color-gray)] py-12 text-center">
              Our inventory changes rapidly. Please contact us for currently available lot models.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableHomes.map((home) => (
                <Link
                  key={home.slug}
                  href={`/floor-plans/${home.slug}`}
                  className="bg-white rounded-lg overflow-hidden border border-[var(--color-charcoal)]/5 hover:shadow-lg transition-shadow group flex flex-col"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-cream-dark)]">
                    <Image
                      src={home.heroImage}
                      alt={home.heroImageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="badge badge-teal text-[10px]">In Stock</span>
                      <span className="badge bg-white/90 text-[var(--color-charcoal)] text-[10px]">{home.type}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <H3 className="font-serif text-2xl font-semibold tracking-tight mb-2 group-hover:text-[var(--color-teal)] transition-colors">
                      {home.name}
                    </H3>
                    <div className="flex gap-4 text-xs tracking-wider uppercase text-[var(--color-gray)] mb-4">
                      <span>{home.sqft.toLocaleString()} sq ft</span>
                      <span className="text-[var(--color-gray-light)]">|</span>
                      <span>{home.beds} Bed</span>
                      <span className="text-[var(--color-gray-light)]">|</span>
                      <span>{home.baths} Bath</span>
                    </div>
                    <p className="text-[var(--color-gray)] text-sm mb-6 flex-grow">
                      {home.description.length > 100 ? `${home.description.substring(0, 100)}...` : home.description}
                    </p>
                    <div className="pt-4 border-t border-[var(--color-charcoal)]/5 flex justify-between items-center mt-auto">
                      <span className="text-sm font-bold text-[var(--color-charcoal)]">Starting At</span>
                      <span className="text-xl font-bold text-[var(--color-lime-dark)]">{home.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[var(--color-cream-dark)] border-t border-[var(--color-charcoal)]/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 flex justify-center">
          <CTABlock
            text="Don't see exactly what you want? We have incoming inventory arriving weekly."
            href="/contact"
            label="Contact Sales"
            variant="primary"
          />
        </div>
      </section>
    </>
  );
}
