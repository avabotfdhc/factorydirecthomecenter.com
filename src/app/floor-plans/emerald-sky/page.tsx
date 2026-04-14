import Link from "next/link";
import Image from "next/image";
import { StructuredData, structuredData, generateMetadata as genMeta } from "@/lib/seo";
import { FAQSection } from "@/components/FAQSection";
import { H2, H3 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Emerald Sky | 3 Bed 2 Bath Modular Home",
  description: "The Emerald Sky by Champion Homes — 1,680 sq ft modular home with 3 bedrooms, 2 baths, fireplace, kitchen island, and office/flex room. Built at the largest Champion factory in Topeka, IN. Factory-direct pricing from Auburn dealer.",
  url: "/floor-plans/emerald-sky",
});

const homeDetails = {
  name: "Emerald Sky",
  series: "Champion Homes",
  type: "Modular",
  sqft: 1680,
  beds: 3,
  baths: 2,
  sections: "Multi-Section",
  code: "IRC (State Building Code)",
  price: "Contact for Pricing",
  description: "The Emerald Sky offers modern modular living with site-built quality. This 1,680 square foot home features an open-concept layout with fireplace, gourmet kitchen with island, and a versatile office/flex room. Built to IRC codes for permanent foundation placement.",
  features: [
    "Fireplace",
    "Garage Ready",
    "Walk-in Pantry",
    "Endwall Entry",
    "Kitchen Island",
    "Freestanding Bathtub",
    "Office/Flex Room",
    "Porch/Outdoor Living Area",
    "Utility Room",
    "Walk-in Shower",
  ],
  specs: {
    width: "28-32 ft",
    length: "56-76 ft",
    ceiling: "9' ceilings",
    bedrooms: "3 (split design)",
    bathrooms: "2 full",
    kitchen: "Island with pantry",
    living: "Open concept with fireplace",
    foundation: "Permanent (required)",
    construction: "IRC Modular Code",
  },
};

const similarHomes = [
  { name: "Aspire 3260", sqft: 1820, beds: 3, baths: 2, highlight: "Larger footprint, optional study", slug: "#" },
  { name: "Brighton 2856", sqft: 1493, beds: 3, baths: 2, highlight: "Split bedroom design", slug: "#" },
  { name: "Paramount 3272", sqft: 2184, beds: 3, baths: 2, highlight: "Luxury master suite", slug: "#" },
];

const homeFAQs = [
  { question: "What is the Emerald Sky home?", answer: "The Emerald Sky is a 1,680 square foot modular home by Champion Homes featuring 3 bedrooms, 2 bathrooms, an open-concept living area with fireplace, gourmet kitchen with island, and a versatile office/flex room. It's built to IRC (International Residential Code) standards for permanent foundation placement, making it comparable to site-built homes in quality and financing options." },
  { question: "How much does the Emerald Sky cost?", answer: "Pricing for the Emerald Sky varies based on options, delivery location, and site work requirements. As a modular home, it typically ranges from $120,000 to $180,000+ including delivery and basic setup. Contact us for a custom quote based on your specific location and needs. We provide transparent, line-item pricing so you know exactly what you're paying for." },
  { question: "What financing options are available for the Emerald Sky?", answer: "Because the Emerald Sky is built to IRC modular codes, it qualifies for conventional mortgages, FHA loans, VA loans for veterans, and other traditional financing options. This is a significant advantage over HUD-code manufactured homes. We work with multiple lenders to find the best financing solution for your situation, including land-home packages if you need both land and home financing." },
  { question: "How long does it take to build and deliver the Emerald Sky?", answer: "From order to move-in typically takes 10-14 weeks for the Emerald Sky. Manufacturing takes 6-8 weeks at Champion's Topeka, IN factory. Site preparation (foundation, utilities) takes 2-4 weeks. Delivery and setup takes 1-3 days. Because we're only 20 miles from the factory, delivery to northeast Indiana properties is efficient and cost-effective." },
  { question: "What foundation does the Emerald Sky require?", answer: "The Emerald Sky requires a permanent foundation such as a basement, crawl space, or slab foundation. This is required because it's built to IRC modular codes. The foundation must be prepared before delivery and must meet local building codes. We can coordinate foundation work or you can use your own contractor with our line-item pricing approach." },
  { question: "Can I customize the Emerald Sky floor plan?", answer: "Yes, Champion Homes offers customization options for the Emerald Sky including exterior finishes, interior materials, appliance packages, and some layout modifications. Popular upgrades include upgraded countertops, flooring options, fireplace styles, and exterior siding choices. We'll walk you through available options during your showroom visit or consultation." },
  { question: "Is the Emerald Sky energy efficient?", answer: "Yes, the Emerald Sky exceeds HUD energy standards and includes features like high-efficiency HVAC systems, quality insulation, and energy-efficient windows. Modular homes often perform better than site-built homes in energy efficiency because they're built in a controlled factory environment with precision construction techniques. This translates to lower utility bills year-round." },
  { question: "Where is the Emerald Sky built?", answer: "The Emerald Sky is built at Champion Homes' manufacturing facility in Topeka, Indiana — the largest Champion factory in the country. Being just 20 miles from our Auburn showroom means lower delivery costs for northeast Indiana buyers and the ability to visit the factory during the building process. This proximity is a significant advantage for our customers." },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Floor Plans", url: "/floor-plans" },
  { name: "Emerald Sky", url: "/floor-plans/emerald-sky" }
];

export default function EmeraldSkyPage() {
  const images = [
    { src: "/images/hero-home.jpg", alt: "Emerald Sky Exterior" },
    { src: "/images/home-white-black-landscape.png", alt: "Modern Exterior Design" },
    { src: "/images/home-white-black-front.png", alt: "Front Elevation" },
    { src: "/images/home-white-black-side.png", alt: "Side View" },
  ];

  return (
    <>
      <StructuredData data={structuredData.localBusiness()} />
      <StructuredData data={structuredData.website()} />
      <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      <StructuredData data={structuredData.product({
        name: homeDetails.name,
        description: homeDetails.description,
        image: "/images/hero-home.jpg",
        brand: "Champion Homes",
        sku: "emerald-sky"
      })} />
      <StructuredData data={structuredData.faqPage(homeFAQs)} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-[var(--color-cream-dark)] py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm text-[var(--color-gray)]">
            {breadcrumbs.map((crumb, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {idx > 0 && <span>/</span>}
                <Link href={crumb.url} className={idx === breadcrumbs.length - 1 ? "font-semibold text-[var(--color-charcoal)]" : "hover:text-[var(--color-teal)]"}>{crumb.name}</Link>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* Hero Gallery */}
      <section className="relative pt-32 pb-12 lg:pt-40 bg-[var(--color-charcoal)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Image */}
            <div className="relative aspect-video lg:aspect-[4/3] rounded-lg overflow-hidden">
              <Image src={images[0].src} alt={images[0].alt} fill className="object-cover" priority />
              <div className="absolute top-4 left-4">
                <span className="bg-[var(--color-lime)] text-[var(--color-charcoal)] px-4 py-2 text-sm font-bold uppercase tracking-wider rounded">Modular Home</span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="font-serif text-4xl lg:text-5xl font-light text-white mb-2">{homeDetails.name}</h1>
                <p className="text-white/60">by {homeDetails.series} — Built in Topeka, IN</p>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="font-serif text-2xl font-semibold text-[var(--color-lime)]">{homeDetails.sqft}</div>
                  <div className="text-white/60 text-sm">Sq Ft</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="font-serif text-2xl font-semibold text-[var(--color-lime)]">{homeDetails.beds}</div>
                  <div className="text-white/60 text-sm">Beds</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="font-serif text-2xl font-semibold text-[var(--color-lime)]">{homeDetails.baths}</div>
                  <div className="text-white/60 text-sm">Baths</div>
                </div>
              </div>

              {/* CTA */}
              <Link href="/contact-us" className="btn-primary w-full bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300 rounded-lg text-center">
                Get Local Pricing
              </Link>
              <p className="text-white/40 text-xs text-center">Factory-direct pricing. No obligation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2">
              <div className="decorative-line mb-6" />
              <H2 className="font-serif text-3xl lg:text-4xl font-light mb-6">About the <span className="italic text-[var(--color-teal)]">{homeDetails.name}</span></H2>
              <p className="text-[var(--color-gray)] leading-relaxed text-lg mb-8">{homeDetails.description}</p>

              <H3 className="font-serif text-2xl font-semibold mb-6">Home Features</H3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {homeDetails.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[var(--color-lime)] rounded-full" />
                    <span className="text-[var(--color-gray)]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specs Sidebar */}
            <div className="bg-[var(--color-cream-dark)] rounded-lg p-8">
              <H3 className="font-serif text-xl font-semibold mb-6">Specifications</H3>
              <div className="space-y-4">
                {Object.entries(homeDetails.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start pb-4 border-b border-[var(--color-charcoal)]/10 last:border-0">
                    <span className="text-[var(--color-gray)] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-[var(--color-charcoal)]/10">
                <div className="flex items-center gap-2 text-sm text-[var(--color-teal)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Built in Topeka, IN — 20 miles away</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financing Info */}
      <section className="py-16 lg:py-24 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-3xl lg:text-4xl font-light">Financing the <span className="italic text-[var(--color-teal)]">{homeDetails.name}</span></H2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 text-center">
              <H3 className="font-serif text-xl font-semibold mb-4">Conventional Mortgage</H3>
              <p className="text-[var(--color-gray)] text-sm mb-4">As an IRC-code modular home, the Emerald Sky qualifies for traditional mortgages with competitive rates.</p>
              <span className="text-[var(--color-teal)] font-bold text-sm">Best for: Land-home packages</span>
            </div>
            <div className="bg-white rounded-lg p-8 text-center">
              <H3 className="font-serif text-xl font-semibold mb-4">FHA Loan</H3>
              <p className="text-[var(--color-gray)] text-sm mb-4">FHA Title II loans available with as little as 3.5% down for qualified buyers.</p>
              <span className="text-[var(--color-teal)] font-bold text-sm">Best for: First-time buyers</span>
            </div>
            <div className="bg-white rounded-lg p-8 text-center">
              <H3 className="font-serif text-xl font-semibold mb-4">VA Loan</H3>
              <p className="text-[var(--color-gray)] text-sm mb-4">Veterans can finance with 0% down, no mortgage insurance, and competitive rates.</p>
              <span className="text-[var(--color-teal)] font-bold text-sm">Best for: Veterans</span>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Homes */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-3xl lg:text-4xl font-light">Similar <span className="italic text-[var(--color-teal)]">Homes</span></H2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarHomes.map((home, idx) => (
              <Link key={idx} href={home.slug} className="group bg-white rounded-lg border border-[var(--color-charcoal)]/5 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-[var(--color-cream-dark)] relative">
                  <Image src="/images/hero-home.jpg" alt={home.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <H3 className="font-serif text-xl font-semibold mb-2 group-hover:text-[var(--color-teal)] transition-colors">{home.name}</H3>
                  <p className="text-[var(--color-gray)] text-sm mb-4">{home.sqft} sq ft • {home.beds} bed • {home.baths} bath</p>
                  <p className="text-[var(--color-teal)] text-sm font-medium">{home.highlight}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">Ready to See the <span className="italic text-[var(--color-teal-light)]">{homeDetails.name}?</span></H2>
          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">Visit our Auburn showroom to tour this home, or request a custom quote. Built at the largest Champion factory in the country, just 20 miles away.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-us" className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300">Get Local Pricing</Link>
            <Link href="/contact-us" className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300">Schedule a Tour</Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FAQSection title="Emerald Sky FAQs" subtitle="Common questions about the Emerald Sky modular home" faqs={homeFAQs} showSchema={true} />
    </>
  );
}
