import Link from "next/link";
import Image from "next/image";
import { getFeaturedHomes, type ApiFloorPlan } from "@/lib/api-content";
import { FeaturedHomes } from "@/components/FeaturedHomes";
import { HomeSearchBar } from "@/components/HomeSearchBar";
import { H2 } from "@/components/Heading";
import { AnimatedHomeSections, TrustAndProcess } from "./HomeSections";

// Server-rendered homepage: everything static (hero, search, featured cards,
// FAQ, schema) ships as HTML with zero hydration cost; only the animated
// middle sections and trust/process strips are client islands. Featured homes
// are fetched here (ISR) so the LCP-candidate cards are in the initial HTML.
export const revalidate = 300;

export default async function Home() {
  const featuredHomes: ApiFloorPlan[] = await getFeaturedHomes();

  return (
    <>
      {/* Hero */}
      <ParallaxHeroSection />

      {/* Search Bar - Separate from hero */}
      <section className="bg-[var(--color-teal)] py-4">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <HomeSearchBar />
        </div>
      </section>

      {/* Featured Floor Plans */}
      <section className="py-12 lg:py-16 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <H2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              Featured Floor Plans
            </H2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
          </div>

          <FeaturedHomes homes={featuredHomes} />

          <div className="text-center mt-10">
            <Link href="/floor-plans" className="btn-primary inline-flex items-center gap-2 bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors duration-300">
              View All Floor Plans
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <AnimatedHomeSections />

      {/* FAQ Section with Schema */}
      <section className="py-20 lg:py-28 bg-[var(--color-cream-dark)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <H2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              Frequently Asked Questions
            </H2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
            <p className="text-base text-[var(--color-gray)] mt-4 max-w-2xl mx-auto">
              Everything you need to know about buying a manufactured home in Indiana, Ohio, and Michigan.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is the difference between manufactured and modular homes?",
                a: "Manufactured homes are built to federal HUD standards on a permanent chassis, making them more affordable and faster to deliver. Modular homes are built to state IRC codes like site-built homes, placed on permanent foundations, and qualify for conventional mortgages. Both are built in factories with quality control that exceeds site-built construction."
              },
              {
                q: "How much does a manufactured home cost in Indiana?",
                a: "Pricing depends on the size, series, and options you choose, so Factory Direct quotes every home line by line — the home, each option, and delivery priced separately with no hidden markups. Factory-direct buying keeps these among the most affordable new homes in Indiana. Call (260) 308-1457 or request a quote online for current pricing on any floor plan."
              },
              {
                q: "Do you offer financing for manufactured homes?",
                a: "Yes, we work with multiple lenders including 21st Mortgage, Triad Financial, Credit Human, and Lake Michigan Credit Union. We specialize in chattel loans for home-only purchases and can also arrange land-home packages. Cash buyers receive preferred pricing discounts."
              },
              {
                q: "How long does it take to get a manufactured home delivered?",
                a: "From order to move-in typically takes 8-12 weeks. Manufacturing takes 6-8 weeks at our Topeka, IN factory just 20 miles away. Site preparation and permitting add 2-4 weeks. Because we're local, our delivery times are faster than dealers located farther from the factory."
              },
              {
                q: "Can I put a manufactured home on my own land?",
                a: "Yes, manufactured homes can be placed on private land in most areas of Indiana, Ohio, and Michigan. Rural counties like Noble, DeKalb, and Whitley have zoning-friendly regulations. We can help you check zoning compliance for your specific property, and you or your contractor pull the permits."
              },
              {
                q: "What areas do you serve?",
                a: "We deliver manufactured and modular homes throughout Indiana, Ohio, and Michigan. Our Auburn, Indiana location is centrally located just 20 miles from the Champion factory, allowing us to serve the entire region with lower delivery costs."
              },
              {
                q: "Do manufactured homes hold their value?",
                a: "Modern manufactured homes built to HUD or IRC codes hold value well, especially when placed on permanent foundations. Modular homes appreciate similarly to site-built homes. Key factors include location, foundation type, and home quality. Champion homes come with comprehensive warranties."
              },
              {
                q: "What is included in the price of a manufactured home?",
                a: "Our line-item pricing shows exactly what you're paying for: the home itself, delivery from the factory, setup and installation, and site work. Unlike dealers who bundle everything, you can choose your own contractors for site work and save thousands."
              }
            ].map((faq, idx) => (
              <details key={idx} className="bg-white rounded-lg border border-[var(--color-charcoal)]/5 overflow-hidden group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-[var(--color-cream)] transition-colors">
                  <span className="font-semibold text-[var(--color-charcoal)] pr-8">{faq.q}</span>
                  <span className="text-[var(--color-teal)] text-xl transition-transform group-open:rotate-180">+</span>
                </summary>
                <div className="px-6 pb-6 text-[var(--color-gray)] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/guides" className="inline-flex items-center gap-2 text-[var(--color-teal)] font-semibold hover:underline">
              View All Guides
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the difference between manufactured and modular homes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Manufactured homes are built to federal HUD standards on a permanent chassis, making them more affordable and faster to deliver. Modular homes are built to state IRC codes like site-built homes, placed on permanent foundations, and qualify for conventional mortgages. Both are built in factories with quality control that exceeds site-built construction."
                }
              },
              {
                "@type": "Question",
                "name": "How much does a manufactured home cost in Indiana?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pricing depends on the size, series, and options you choose, so Factory Direct quotes every home line by line — the home, each option, and delivery priced separately with no hidden markups. Factory-direct buying keeps these among the most affordable new homes in Indiana. Call (260) 308-1457 or request a quote online for current pricing on any floor plan."
                }
              },
              {
                "@type": "Question",
                "name": "Do you offer financing for manufactured homes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we work with multiple lenders including 21st Mortgage, Triad Financial, Credit Human, and Lake Michigan Credit Union. We specialize in chattel loans for home-only purchases and can also arrange land-home packages. Cash buyers receive preferred pricing discounts."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to get a manufactured home delivered?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "From order to move-in typically takes 8-12 weeks. Manufacturing takes 6-8 weeks at our Topeka, IN factory just 20 miles away. Site preparation and permitting add 2-4 weeks. Because we're local, our delivery times are faster than dealers located farther from the factory."
                }
              },
              {
                "@type": "Question",
                "name": "Can I put a manufactured home on my own land?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, manufactured homes can be placed on private land in most areas of Indiana, Ohio, and Michigan. Rural counties like Noble, DeKalb, and Whitley have zoning-friendly regulations. We can help you check zoning compliance for your specific property, and you or your contractor pull the permits."
                }
              },
              {
                "@type": "Question",
                "name": "What areas do you serve?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We deliver manufactured and modular homes throughout Indiana, Ohio, and Michigan. Our Auburn, Indiana location is centrally located just 20 miles from the Champion factory, allowing us to serve the entire region with lower delivery costs."
                }
              },
              {
                "@type": "Question",
                "name": "Do manufactured homes hold their value?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Modern manufactured homes built to HUD or IRC codes hold value well, especially when placed on permanent foundations. Modular homes appreciate similarly to site-built homes. Key factors include location, foundation type, and home quality. Champion homes come with comprehensive warranties."
                }
              },
              {
                "@type": "Question",
                "name": "What is included in the price of a manufactured home?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our line-item pricing shows exactly what you're paying for: the home itself, delivery from the factory, setup and installation, and site work. Unlike dealers who bundle everything, you can choose your own contractors for site work and save thousands."
                }
              }
            ]
          })
        }}
      />

      {/* LocalBusiness schema comes from the root layout (structuredData.localBusiness) — not duplicated here */}

      {/* ImageObject Schema for Hero */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageObject",
            "contentUrl": "https://factorydirecthomescenter.com/images/hero-home.jpg",
            "name": "Modern Manufactured Home Exterior",
            "description": "Modern manufactured home with white siding and black trim on foundation with professional landscaping",
            "width": 1920,
            "height": 1071,
            "author": {
              "@type": "Organization",
              "name": "Factory Direct Homes Center"
            }
          })
        }}
      />

      <TrustAndProcess />
    </>
  );
}

// Parallax Hero Section Component
function ParallaxHeroSection() {
  return (
    <section className="relative h-[320px] sm:h-[360px] lg:h-[420px]" aria-label="Hero section">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-home.jpg"
          alt="Modern manufactured home"
          fill
          fetchPriority="high"
          loading="eager"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-charcoal)]/80 to-[var(--color-charcoal)]/40" />
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex flex-col justify-center px-4 lg:px-8 pt-4">
        <div className="max-w-7xl mx-auto w-full">
          {/* Sale Badge */}
          <Link href="/special-plans" className="inline-flex items-center gap-2 bg-[var(--color-lime)] text-[var(--color-charcoal)] px-4 py-2 rounded-full text-sm font-bold mb-4 hover:bg-[var(--color-lime-dark)] transition-colors">
            <span className="animate-pulse">🎉</span>
            <span>Save up to 25% off select new Champion floor plans!</span>
            <span className="hidden sm:inline text-xs bg-white/30 px-2 py-0.5 rounded-full">Ends August 31</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[var(--color-lime)] mb-2">
            Factory Direct Homes Center — Auburn, Indiana
          </p>
          <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-light text-white leading-tight">
            Manufactured & Modular Homes<br className="hidden sm:block" /> in Indiana, Ohio & Michigan
          </h1>
        </div>
      </div>
    </section>
  );
}
