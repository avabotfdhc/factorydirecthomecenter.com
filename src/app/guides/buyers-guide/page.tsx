import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import { StructuredData, structuredData } from "@/lib/seo";
import { FadeIn, StaggerContainer, useScrollTracking } from "@/components/VisualEffects";

export const metadata: Metadata = {
  title: "Complete Manufactured Home Buyer's Guide | Factory Direct Homes Center",
  description: "Everything you need to know about buying a manufactured home. Types, financing, costs, timeline, and process. Free guide from Factory Direct Homes Center.",
  keywords: ["manufactured home buyers guide", "how to buy manufactured home", "manufactured home buying process", "first time manufactured home buyer"],
};

const guideFAQs = [
  { question: "What is the first step in buying a manufactured home?", answer: "The first step is determining your budget and getting pre-qualified for financing. This helps you understand what you can afford and shows sellers you're serious. Next, research floor plans and manufacturers to find homes that meet your needs. Visiting showrooms to walk through actual homes is highly recommended before making a decision." },
  { question: "How long does it take to buy and move into a manufactured home?", answer: "The typical timeline from order to move-in is 8-12 weeks. Manufacturing takes 6-8 weeks at the factory. Site preparation and permitting add 2-4 weeks. Delivery and setup takes 1-3 days. However, if you need to prepare land (clearing, foundation, utilities), add 4-8 weeks for site work. Starting financing early helps keep the process moving smoothly." },
  { question: "What is the difference between manufactured and modular homes?", answer: "Manufactured homes are built to federal HUD standards on a permanent chassis, making them more affordable and faster to deliver. They're transported in one or more sections and can be placed on various foundations. Modular homes are built to state IRC codes like site-built homes, placed on permanent foundations, and qualify for conventional mortgages. Both are built in factories with quality control." },
  { question: "How much does a manufactured home really cost?", answer: "Single wide homes typically cost $50,000-$80,000, double wides $80,000-$150,000, and modular homes $100,000-$200,000+. However, the total cost includes delivery ($2,500-$8,000), setup ($5,000-$15,000), and site work ($5,000-$50,000+). We provide line-item pricing so you see exactly what you're paying for. Financing options can make monthly payments comparable to apartment rent." },
  { question: "Can I put a manufactured home on my own land?", answer: "Yes, manufactured homes can be placed on private land in most areas, though zoning restrictions vary. Rural counties typically have fewer restrictions than cities. You'll need to verify zoning compliance, obtain permits, prepare the site (clearing, foundation, utilities), and ensure road access for delivery. We help coordinate all these steps and can verify your property's suitability before purchase." },
  { question: "What financing options are available for manufactured homes?", answer: "Several financing options exist: Chattel loans (home-only, no land required), VA loans for veterans (0% down), FHA Title I and II loans (3.5% down), conventional mortgages for modular homes, and land-home packages. Credit requirements vary, with options available for scores as low as 575. We work with multiple lenders to find the best option for your situation." },
  { question: "Do manufactured homes hold their value?", answer: "Modern manufactured homes built to HUD or IRC codes can hold value well, especially when placed on permanent foundations. Like any home, value depends on location, condition, and market factors. Modular homes typically appreciate similarly to site-built homes. Key factors for value retention include: quality construction, permanent foundation, good location, and proper maintenance. Champion homes come with warranties that protect your investment." },
  { question: "What should I look for when choosing a manufactured home dealer?", answer: "Look for: authorized dealer status with reputable manufacturers, transparent pricing (line-item, not bundled), local knowledge and service area, financing options and lender relationships, customer reviews and testimonials, warranty support, and post-sale service. Be wary of dealers who pressure you, won't provide detailed pricing, or lack local presence. Factory Direct is an authorized Champion dealer with 500+ homes delivered." }
];

const breadcrumbs = [{ name: "Home", url: "/" }, { name: "Guides", url: "/guides" }, { name: "Buyer's Guide", url: "/guides/buyers-guide" }];

export default function BuyersGuidePage() {
  return (
    <>
      <StructuredData data={structuredData.localBusiness()} />
      <StructuredData data={structuredData.website()} />
      <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      <StructuredData data={structuredData.article({ headline: "Complete Manufactured Home Buyer's Guide", description: "Everything you need to know about buying a manufactured home", image: "/images/hero-home.jpg", datePublished: "2024-01-01", dateModified: new Date().toISOString(), author: "Factory Direct Homes Center", url: "/guides/buyers-guide" })} />
      <StructuredData data={structuredData.faqPage(guideFAQs)} />


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

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="decorative-line" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">Free Guide</span>
              </div>
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">Complete Buyer's <span className="italic text-[var(--color-teal-light)]">Guide</span></h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-xl">Everything you need to know about buying a manufactured home. From types and financing to costs and timeline.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-3xl font-light mb-6">Introduction</h2>
              <p className="text-[var(--color-gray)] leading-relaxed mb-6">Buying a manufactured home is one of the most significant decisions you'll make. This guide walks you through everything you need to know—from understanding home types to financing options to the complete buying process.</p>
              
              <h2 className="font-serif text-3xl font-light mb-6 mt-12">Types of Factory-Built Homes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="bg-[var(--color-cream-dark)] p-6 rounded-lg">
                  <h3 className="font-semibold text-xl mb-3">Single Wide</h3>
                  <p className="text-sm text-[var(--color-gray)]">500-1,200 sq ft • 1-3 beds • Most affordable • Faster delivery</p>
                </div>
                <div className="bg-[var(--color-cream-dark)] p-6 rounded-lg">
                  <h3 className="font-semibold text-xl mb-3">Double Wide</h3>
                  <p className="text-sm text-[var(--color-gray)]">1,000-2,400 sq ft • 2-4 beds • Spacious living • Family favorite</p>
                </div>
                <div className="bg-[var(--color-cream-dark)] p-6 rounded-lg">
                  <h3 className="font-semibold text-xl mb-3">Modular</h3>
                  <p className="text-sm text-[var(--color-gray)]">1,000-2,500+ sq ft • 2-5 beds • Site-built quality • IRC code</p>
                </div>
              </div>

              <h2 className="font-serif text-3xl font-light mb-6 mt-12">The Buying Process</h2>
              <ol className="space-y-4 list-decimal list-inside">
                <li><strong>Determine Budget</strong> — Include home, delivery, setup, and site work</li>
                <li><strong>Get Pre-Qualified</strong> — Understand your financing options</li>
                <li><strong>Research Homes</strong> — Browse floor plans and manufacturers</li>
                <li><strong>Visit Showrooms</strong> — Walk through actual homes</li>
                <li><strong>Choose & Customize</strong> — Select options and features</li>
                <li><strong>Finalize Financing</strong> — Complete loan application</li>
                <li><strong>Prepare Site</strong> — Foundation, utilities, access</li>
                <li><strong>Order & Build</strong> — 6-8 weeks manufacturing</li>
                <li><strong>Delivery & Setup</strong> — 1-3 days placement</li>
                <li><strong>Move In</strong> — Final inspection and keys</li>
              </ol>

              <h2 className="font-serif text-3xl font-light mb-6 mt-12">Understanding Costs</h2>
              <div className="bg-[var(--color-cream-dark)] p-6 rounded-lg my-6">
                <h3 className="font-semibold mb-4">Typical Cost Breakdown</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between"><span>Home (single wide)</span><span>$50,000 - $80,000</span></li>
                  <li className="flex justify-between"><span>Home (double wide)</span><span>$80,000 - $150,000</span></li>
                  <li className="flex justify-between"><span>Delivery</span><span>$2,500 - $8,000</span></li>
                  <li className="flex justify-between"><span>Setup & Installation</span><span>$5,000 - $15,000</span></li>
                  <li className="flex justify-between"><span>Site Work</span><span>$5,000 - $50,000+</span></li>
                </ul>
              </div>

              <h2 className="font-serif text-3xl font-light mb-6 mt-12">Financing Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div>
                  <h4 className="font-semibold mb-2">Chattel Loans</h4>
                  <p className="text-sm text-[var(--color-gray)]">Home-only financing. No land required. Faster approval. 5-10% down.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">VA Loans</h4>
                  <p className="text-sm text-[var(--color-gray)]">For veterans. 0% down. Best rates. No mortgage insurance.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">FHA Loans</h4>
                  <p className="text-sm text-[var(--color-gray)]">3.5% down. Government-backed. Flexible credit.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Conventional</h4>
                  <p className="text-sm text-[var(--color-gray)]">For modular homes. Best rates with good credit. 10-20% down.</p>
                </div>
              </div>

              <h2 className="font-serif text-3xl font-light mb-6 mt-12">Timeline Expectations</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 text-right font-semibold text-[var(--color-teal)]">Week 1</div>
                  <div><strong>Pre-Qualification</strong> — Get financing pre-approved</div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-16 text-right font-semibold text-[var(--color-teal)]">Week 2</div>
                  <div><strong>Selection</strong> — Choose home and options</div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-16 text-right font-semibold text-[var(--color-teal)]">Weeks 3-10</div>
                  <div><strong>Manufacturing</strong> — Home built at factory</div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-16 text-right font-semibold text-[var(--color-teal)]">Week 11</div>
                  <div><strong>Site Prep</strong> — Foundation and utilities</div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-16 text-right font-semibold text-[var(--color-teal)]">Week 12</div>
                  <div><strong>Delivery</strong> — Home placed and set up</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <FAQSection title="Buyer's Guide FAQs" subtitle="Common questions from first-time manufactured home buyers" faqs={guideFAQs} showSchema={true} />

      <section className="py-16 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h3 className="font-serif text-2xl font-semibold mb-6">Ready to Take the Next Step?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/floor-plans" className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors rounded-lg">Browse Floor Plans</Link>
            <Link href="/financing" className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)] text-[var(--color-charcoal)] px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-charcoal)]/5 transition-colors rounded-lg">Explore Financing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
