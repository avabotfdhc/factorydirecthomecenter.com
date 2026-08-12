import Link from "next/link";
import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import { getApiFloorPlans } from "@/lib/api-content";
import { CTABlock } from "@/components/CTABlock";
import { H2 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Available Homes | Factory Direct Homes Center — Auburn, IN",
  description: "A selection of popular Champion manufactured & modular homes available to order from Factory Direct Homes Center. Call to confirm current lot availability and delivery timelines.",
  keywords: ["available manufactured homes", "champion homes for sale", "manufactured homes auburn indiana", "modular homes near me"],
  url: "/inventory",
});

// ISR: availability refreshes from the CMS every 5 min without a redeploy, while
// the API is hit at most once per window and stays served if it briefly fails.
export const revalidate = 300;

export default async function InventoryPage() {
  const availableHomes = (await getApiFloorPlans()).slice(0, 6);

  return (
    <>
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
              Featured Homes
            </span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
            Available <span className="italic text-[var(--color-teal-light)]">Homes</span>
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mb-8">
            A selection of our most popular Champion manufactured and modular homes.
            Call <a href="tel:+12603081457" className="text-[var(--color-teal-light)] underline">(260) 308-1457</a> to
            confirm current lot availability and delivery timelines.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {availableHomes.length === 0 ? (
            <p className="text-[var(--color-gray)] py-12 text-center">
              Our lineup changes often — please{" "}
              <Link href="/contact-us" className="text-[var(--color-teal)] font-semibold">contact us</Link>{" "}
              for currently available homes.
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
                    {home.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={home.image}
                        alt={`${home.name} — ${home.beds} bed ${home.baths} bath ${home.homeType || "manufactured home"}`}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[var(--color-gray-light)] text-sm">No photo</div>
                    )}
                    {home.homeType && (
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="badge bg-white/90 text-[var(--color-charcoal)] text-[10px]">{home.homeType}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <H2 className="font-serif text-2xl font-semibold tracking-tight mb-2 group-hover:text-[var(--color-teal)] transition-colors">
                      {home.name}
                    </H2>
                    <p className="text-sm text-[var(--color-teal)] font-medium mb-3">{home.brand}</p>
                    <div className="flex gap-4 text-xs tracking-wider uppercase text-[var(--color-gray)] mb-4">
                      <span>{home.sqft ? home.sqft.toLocaleString() : "—"} sq ft</span>
                      <span className="text-[var(--color-gray-light)]">|</span>
                      <span>{home.beds} Bed</span>
                      <span className="text-[var(--color-gray-light)]">|</span>
                      <span>{home.baths} Bath</span>
                    </div>
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
            text="Don't see exactly what you want? We can order any Champion floor plan for you."
            href="/contact-us"
            label="Contact Sales"
            variant="primary"
          />
        </div>
      </section>
    </>
  );
}
