import { generateMetadata as genMeta } from "@/lib/seo";
import Link from "next/link";
import { H2 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Guides & Resources",
  description: "Educational guides for manufactured home buyers. Learn about financing, pricing, the buying process, and more from Factory Direct Homes Center.",
  url: "/guides",
});

const guides = [
  {
    title: "Manufactured vs. Modular vs. Mobile",
    description: "The real difference between the three — building codes (HUD vs. IRC), foundations, financing, and which factory-built home is right for you.",
    href: "/guides/manufactured-vs-modular",
    icon: "🏠",
    readTime: "6 min",
  },
  {
    title: "Single Wide vs. Double Wide",
    description: "Size, layout, price, and land needs compared — plus which one fits your budget, family, and property.",
    href: "/guides/single-wide-vs-double-wide",
    icon: "📐",
    readTime: "6 min",
  },
  {
    title: "Delivery & Setup: What to Expect",
    description: "From order to move-in in 8–12 weeks — factory build, site prep, permitting, delivery day, and installation, step by step.",
    href: "/guides/delivery-and-setup",
    icon: "🚚",
    readTime: "6 min",
  },
  {
    title: "Complete Buyer's Guide",
    description: "Everything you need to know about buying a manufactured or modular home. Types of homes, financing options, costs, and timeline.",
    href: "/guides/buyers-guide",
    icon: "📖",
    readTime: "15 min",
  },
  {
    title: "How Our Pricing Works",
    description: "Understanding line-item transparency. See exactly what you're paying for and how you can save by choosing your own contractors.",
    href: "/guides/pricing",
    icon: "💰",
    readTime: "10 min",
  },
  {
    title: "Financing Options Explained",
    description: "Chattel, land-home, and conventional loans. Which is right for you? Requirements, pros, cons, and how to qualify.",
    href: "/guides/financing",
    icon: "🏦",
    readTime: "12 min",
  },
  {
    title: "Site Work & Preparation",
    description: "Land clearing, foundations, utilities, and permits. What needs to happen before your home arrives.",
    href: "/guides/site-work",
    icon: "🏗️",
    readTime: "10 min",
  },
  {
    title: "Zoning Laws by State",
    description: "Manufactured home regulations in Indiana, Ohio, and Michigan. What you need to know before you buy.",
    href: "/guides/zoning",
    icon: "📋",
    readTime: "15 min",
  },
  {
    title: "Champion Homes & Our Series",
    description: "Who builds the homes we sell, and how the Aspire, Prime, and Paramount series differ — plus how factory-built quality and the HUD code work.",
    href: "/champion-homes",
    icon: "🏆",
    readTime: "7 min",
  },
];

export default function GuidesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                Learn
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Guides &<br />
              <span className="italic text-[var(--color-teal-light)]">Resources</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              Everything you need to make an informed decision about buying a manufactured 
              or modular home. No sales pitch, just honest information.
            </p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group bg-white rounded-lg border border-[var(--color-charcoal)]/5 p-8 hover:shadow-lg hover:border-[var(--color-teal)]/30 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{guide.icon}</div>
                <H2 className="font-serif text-xl font-semibold mb-3 group-hover:text-[var(--color-teal)] transition-colors">
                  {guide.title}
                </H2>
                <p className="text-[var(--color-gray)] text-sm mb-4 leading-relaxed">
                  {guide.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-lime-dark)] group-hover:text-[var(--color-teal)] transition-colors">
                    Read Guide →
                  </span>
                  <span className="text-xs text-[var(--color-gray-light)]">{guide.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Have a <span className="italic text-[var(--color-teal)]">Specific Question?</span>
          </H2>
          <p className="text-lg text-[var(--color-gray)] leading-relaxed mb-10 max-w-2xl mx-auto">
            Our team is here to help. No pressure, no sales tactics — just honest answers 
            to help you make the best decision for your family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us"
              className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            >
              Contact Us
            </Link>
            <a
              href="tel:+12603081457"
              className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)] px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-charcoal)]/5 transition-colors duration-300"
            >
              Call (260) 308-1457
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
