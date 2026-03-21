import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Floor Plans",
  description:
    "Browse Champion single wide, double wide, and modular home floor plans. Factory-direct pricing from $50,000. Customizable layouts for every family.",
};

const categories = [
  {
    id: "single-wide",
    title: "Single Wide Homes",
    tagline: "Efficient Living, Exceptional Value",
    description:
      "Our single wide homes pack smart design into an efficient footprint. Ideal for first-time buyers, downsizers, or anyone who values quality craftsmanship without the excess square footage. Every inch is thoughtfully planned.",
    specs: {
      width: "14–18 ft",
      length: "40–80 ft",
      sqft: "500 – 1,200",
      beds: "1–3",
      baths: "1–2",
      price: "From $50,000",
    },
    models: [
      {
        name: "Aspire 1456",
        sqft: "1,008",
        beds: 2,
        baths: 2,
        highlight: "Open-concept kitchen & living",
      },
      {
        name: "Aspire 1672",
        sqft: "1,152",
        beds: 3,
        baths: 2,
        highlight: "Master suite with walk-in closet",
      },
      {
        name: "Dutch 1460",
        sqft: "840",
        beds: 2,
        baths: 1,
        highlight: "Compact & affordable starter home",
      },
    ],
  },
  {
    id: "double-wide",
    title: "Double Wide Homes",
    tagline: "Room to Breathe, Built to Last",
    description:
      "Sectional homes that rival site-built quality with factory precision. The Brighton and Silverton series offer generous living spaces, multiple bedrooms, and the kind of open floor plans families love coming home to.",
    specs: {
      width: "24–32 ft",
      length: "40–76 ft",
      sqft: "1,000 – 2,400+",
      beds: "2–4",
      baths: "2–3",
      price: "From $80,000",
    },
    models: [
      {
        name: "Brighton 2856",
        sqft: "1,493",
        beds: 3,
        baths: 2,
        highlight: "Split bedroom design with island kitchen",
      },
      {
        name: "Brighton 2852",
        sqft: "1,386",
        beds: 3,
        baths: 2,
        highlight: "Spacious family room with vaulted ceilings",
      },
      {
        name: "Silverton 2876",
        sqft: "1,493",
        beds: 4,
        baths: 2,
        highlight: "Four bedrooms with dual living areas",
      },
    ],
  },
  {
    id: "modular",
    title: "Modular Homes",
    tagline: "Site-Built Quality, Factory Precision",
    description:
      "Built to IRC residential building codes and placed on permanent foundations, our modular homes are indistinguishable from traditional construction — but delivered faster, with less waste, and at a better price. Fully customizable to your vision.",
    specs: {
      width: "24–36 ft",
      length: "40–76+ ft",
      sqft: "1,000 – 2,500+",
      beds: "2–5",
      baths: "2+",
      price: "From $100,000",
    },
    models: [
      {
        name: "Aspire Modular 2860",
        sqft: "1,680",
        beds: 3,
        baths: 2,
        highlight: "Open floor plan with mudroom entry",
      },
      {
        name: "Aspire Modular 3268",
        sqft: "2,176",
        beds: 4,
        baths: 3,
        highlight: "Luxury master with en-suite & walk-in",
      },
      {
        name: "Aspire Modular 3276",
        sqft: "2,432",
        beds: 5,
        baths: 3,
        highlight: "Full basement-ready, multi-generational design",
      },
    ],
  },
];

export default function FloorPlansPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-terracotta-light)]">
                Champion Home Builders
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Floor{" "}
              <span className="italic text-[var(--color-terracotta-light)]">
                Plans
              </span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              Explore our full lineup of Champion manufactured and modular homes.
              Every plan is customizable — flooring, cabinetry, countertops,
              appliances, and exterior finishes are all your choice.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.map((cat, catIdx) => (
        <section
          key={cat.id}
          id={cat.id}
          className={`py-24 lg:py-32 ${catIdx % 2 === 1 ? "bg-[var(--color-cream-dark)]" : ""}`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Category header */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div>
                <div className="decorative-line mb-6" />
                <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-4">
                  {cat.title}
                </h2>
                <p className="font-serif text-xl italic text-[var(--color-terracotta)]">
                  {cat.tagline}
                </p>
              </div>
              <div className="flex items-end">
                <p className="text-base text-[var(--color-warm-gray)] leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>

            {/* Specs bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16 p-8 bg-white border border-[var(--color-charcoal)]/5">
              {Object.entries(cat.specs).map(([key, value]) => (
                <div key={key}>
                  <div className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-warm-gray)] mb-1">
                    {key === "sqft"
                      ? "Sq. Footage"
                      : key.charAt(0).toUpperCase() + key.slice(1)}
                  </div>
                  <div className="font-serif text-lg font-semibold">{value}</div>
                </div>
              ))}
            </div>

            {/* Models */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {cat.models.map((model) => (
                <div
                  key={model.name}
                  className="group border border-[var(--color-charcoal)]/8 hover:border-[var(--color-terracotta)]/30 bg-white transition-all duration-500"
                >
                  {/* Model image placeholder */}
                  <div className="aspect-[16/10] bg-gradient-to-br from-[var(--color-cream-dark)] to-[var(--color-cream)] flex items-center justify-center border-b border-[var(--color-charcoal)]/5">
                    <div className="text-center">
                      <svg className="w-10 h-10 mx-auto text-[var(--color-warm-gray-light)] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                      </svg>
                      <span className="text-xs text-[var(--color-warm-gray-light)] tracking-wider uppercase">
                        Floor Plan
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold mb-1">
                      {model.name}
                    </h3>
                    <p className="text-sm text-[var(--color-terracotta)] font-medium mb-4">
                      {model.highlight}
                    </p>
                    <div className="flex gap-4 text-xs tracking-wider uppercase text-[var(--color-warm-gray)]">
                      <span>{model.sqft} sq ft</span>
                      <span className="text-[var(--color-warm-gray-light)]">|</span>
                      <span>{model.beds} Bed</span>
                      <span className="text-[var(--color-warm-gray-light)]">|</span>
                      <span>{model.baths} Bath</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Customization CTA */}
      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Every Home is{" "}
            <span className="italic text-[var(--color-terracotta-light)]">
              Yours to Customize
            </span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
            Choose your flooring, cabinetry, countertops, appliances, and exterior
            colors. Walk through 360&deg; virtual tours before you buy. We&rsquo;ll
            help you design the home that fits your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+12603081457"
              className="btn-primary inline-flex items-center justify-center gap-2 bg-[var(--color-terracotta)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-terracotta-dark)] transition-colors duration-300"
            >
              Schedule a Tour
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300"
            >
              Request Info
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
