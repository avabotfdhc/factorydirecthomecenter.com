import Link from "next/link";
import { getApiFloorPlans } from "@/lib/api-content";

export const metadata = {
  title: "Floor Plans — Live from CMS | Factory Direct Homes Center",
  description:
    "Proof of concept: the new site design rendering live Champion manufactured & modular home floor plans straight from the admin CMS.",
  robots: { index: false, follow: false },
};

// Always render fresh from the CMS during the POC.
export const dynamic = "force-dynamic";

export default async function FloorPlansLivePage() {
  const plans = await getApiFloorPlans();

  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      {/* Hero */}
      <section className="bg-[var(--color-charcoal)] text-[var(--color-cream)] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-lime)] mb-4">
            Proof of Concept · Live CMS Data
          </p>
          <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mb-5">
            Manufactured &amp; Modular <span className="italic text-[var(--color-teal-light)]">Home Floor Plans</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
            The new site design, showing your real homes pulled live from the admin
            CMS — {plans.length} active floor plans, factory-direct from Auburn, IN.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        {plans.length === 0 ? (
          <p className="text-center text-[var(--color-gray)]">
            No floor plans returned from the API right now.
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
                    <h3 className="font-serif text-xl font-semibold group-hover:text-[var(--color-teal)] transition-colors">
                      {p.name}
                    </h3>
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

        <p className="text-center text-sm text-[var(--color-gray)] mt-12">
          {plans.length} homes — rendered live from your existing admin CMS.
        </p>
      </section>
    </main>
  );
}
