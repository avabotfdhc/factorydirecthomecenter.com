import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Factory Direct Homes Center is a family-owned Champion Homes exclusive dealer in Auburn, IN. Serving Indiana, Illinois, Michigan, Ohio, Wisconsin & Kentucky with factory-direct pricing on manufactured and modular homes.",
};

const values = [
  {
    title: "Honest Pricing",
    description:
      "Factory-direct means no middlemen, no markups, no games. The price we quote is the price you pay. We believe transparency builds trust, and trust builds lasting relationships.",
  },
  {
    title: "Quality First",
    description:
      "We chose to partner exclusively with Champion Home Builders — America's second-largest home manufacturer — because their build quality, materials, and warranty stand behind every home we sell.",
  },
  {
    title: "Full-Service Care",
    description:
      "Buying a home is one of the biggest decisions you'll make. We walk beside you from first visit through move-in day: selection, customization, financing, delivery, installation, and beyond.",
  },
  {
    title: "Community Roots",
    description:
      "We're not a corporate chain. We're your neighbors in Auburn, Indiana. We live in the communities we serve across Indiana, Illinois, Michigan, Ohio, Wisconsin, and Kentucky, and we take that responsibility seriously.",
  },
];

const timeline = [
  {
    label: "The Vision",
    text: "Founded with a simple idea: everyone deserves a quality home at a fair price. We partnered with Champion Home Builders to bring factory-direct pricing to the region.",
  },
  {
    label: "The Partnership",
    text: "As a Champion Homes exclusive dealer, we have direct access to their Topeka, IN manufacturing plant — the largest Champion factory in the country. Just 20 miles from our Auburn showroom, this facility builds the Aspire Series, Paramount, Redman, and Dutch series homes. Shorter supply chains mean lower costs and faster delivery.",
  },
  {
    label: "The Community",
    text: "Over 500 families across Indiana, Illinois, Michigan, Ohio, Wisconsin, and Kentucky now call a Factory Direct home their own. We've grown through referrals and repeat customers — the best kind of growth.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                Our Story
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Built on{" "}
              <span className="italic text-[var(--color-teal-light)]">
                Trust,
              </span>
              <br />
              Not Markup
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              We&rsquo;re a family-owned manufactured home dealer in Auburn, Indiana,
              serving Indiana, Illinois, Michigan, Ohio, Wisconsin, and Kentucky.
              We believe the path to homeownership shouldn&rsquo;t be paved with hidden
              fees and fine print.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="decorative-line mb-6" />
              <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                Who We{" "}
                <span className="italic text-[var(--color-teal)]">Are</span>
              </h2>
              <div className="space-y-6 text-base text-[var(--color-gray)] leading-relaxed">
                <p>
                  Factory Direct Homes Center is an exclusive Champion Home Builders
                  retailer located on State Road 8 in Auburn, Indiana. We serve
                  families across Indiana, Illinois, Michigan, Ohio, Wisconsin, and Kentucky
                  with new manufactured and modular homes at factory-direct pricing.
                </p>
                <p>
                  Our partnership with Champion — the nation&rsquo;s second-largest home
                  manufacturer — gives us access to their complete lineup from the 
                  Topeka, IN facility, the largest Champion factory in the country. 
                  This plant builds the Aspire Series, Paramount, Redman, and Dutch 
                  series homes, all just 20 miles from our showroom.
                </p>
                <p>
                  What sets us apart isn&rsquo;t just pricing. It&rsquo;s our
                  full-service approach. From the moment you walk through our doors
                  to the day you get your keys, our team handles everything:
                  design consultation, financing guidance, site coordination,
                  delivery, and professional installation.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex flex-col justify-center">
              <div className="space-y-12 border-l-2 border-[var(--color-teal)]/20 pl-8">
                {timeline.map((item) => (
                  <div key={item.label} className="relative">
                    <div className="absolute -left-[41px] top-1 w-4 h-4 bg-[var(--color-teal)] border-4 border-[var(--color-cream)]" />
                    <h3 className="font-serif text-xl font-semibold mb-2">
                      {item.label}
                    </h3>
                    <p className="text-sm text-[var(--color-gray)] leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              What We{" "}
              <span className="italic text-[var(--color-teal)]">
                Stand For
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white border border-[var(--color-charcoal)]/5 p-8 lg:p-10"
              >
                <h3 className="font-serif text-2xl font-semibold mb-4">
                  {v.title}
                </h3>
                <p className="text-sm text-[var(--color-gray)] leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Champion Partnership */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal)]">
              Our Partner
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mt-4 mb-6">
              Champion Home Builders
            </h2>
            <p className="text-base text-[var(--color-gray)] leading-relaxed mb-8">
              Champion is the #2 manufactured home builder in America. Their Topeka, 
              Indiana facility — the largest Champion factory in the country — is 
              just 20 miles from our showroom. This plant produces the Aspire Series, 
              Paramount, Redman, and Dutch series homes. Shorter delivery distances 
              mean lower costs and faster delivery for you. Every Champion home is 
              HUD or IRC-certified, energy-efficient, and backed by a comprehensive 
              warranty.
            </p>
            <div className="grid grid-cols-3 gap-8 mt-12">
              {[
                { value: "#2", label: "National Builder" },
                { value: "20%", label: "Market Share" },
                { value: "20 mi", label: "From Our Lot" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-3xl lg:text-4xl font-semibold text-[var(--color-teal)]">
                    {stat.value}
                  </div>
                  <div className="text-xs tracking-widest uppercase text-[var(--color-gray)] mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Ready to Find{" "}
            <span className="italic text-[var(--color-teal-light)]">
              Your Home?
            </span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
            Visit our Auburn showroom, browse our floor plans online, or give us a
            call. We&rsquo;re here to help you take the first step toward
            homeownership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/floor-plans"
              className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            >
              Browse Floor Plans
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
