import { generateMetadata as genMeta } from "@/lib/seo";
import Link from "next/link";
import { H2, H3, H4 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Site Work & Preparation Guide",
  description: "Everything you need to know about preparing your land for a manufactured home. Foundations, utilities, permits, and site work costs explained.",
  url: "/guides/site-work",
  type: "article",
});

const siteWorkItems = [
  {
    category: "Land Clearing & Grading",
    description: "Preparing the building site by removing vegetation, leveling the ground, and ensuring proper drainage.",
    costRange: "$1,500 - $10,000",
    factors: ["Lot size", "Tree density", "Slope/grade", "Soil type", "Access difficulty"],
    timeline: "1-3 days",
  },
  {
    category: "Foundation",
    description: "The base your home sits on. Type depends on soil, climate, financing requirements, and local codes.",
    costRange: "$3,000 - $25,000",
    factors: ["Foundation type", "Soil conditions", "Home size", "Local codes", "Frost line depth"],
    timeline: "2-7 days",
  },
  {
    category: "Utilities",
    description: "Connecting or installing water, sewer/septic, electric, and gas lines to your home.",
    costRange: "$3,000 - $30,000",
    factors: ["Distance to connections", "Septic vs sewer", "Well vs city water", "Electrical panel size", "Gas availability"],
    timeline: "3-10 days",
  },
  {
    category: "Driveway & Access",
    description: "Creating vehicle access to your home site and parking areas.",
    costRange: "$2,000 - $15,000",
    factors: ["Length of driveway", "Material (gravel/asphalt/concrete)", "Base preparation", "Culvert needs"],
    timeline: "1-3 days",
  },
  {
    category: "Permits & Inspections",
    description: "Legal requirements including building permits, zoning approval, and required inspections.",
    costRange: "$500 - $5,000",
    factors: ["Jurisdiction fees", "Number of permits", "Inspection requirements", "Zoning variances"],
    timeline: "1-4 weeks (before work)",
  },
];

const foundationTypes = [
  {
    name: "Pier & Beam",
    description: "Concrete or block piers support the home's frame, with a crawl space underneath. Most common and economical option.",
    cost: "$3,000 - $8,000",
    bestFor: "Manufactured homes, level lots, moderate climates",
    pros: ["Most affordable", "Easy access to utilities", "Good ventilation", "Works on most soils"],
    cons: ["Less stable in flood zones", "Requires skirting", "Not permanent foundation"],
  },
  {
    name: "Concrete Block Crawl Space",
    description: "Block walls create a raised foundation with crawl space. More stable than piers, better for sloped lots.",
    cost: "$8,000 - $15,000",
    bestFor: "Sloped lots, areas with frost heave, better resale",
    pros: ["More stable than piers", "Better for sloped lots", "Improved resale value", "Easier to enclose"],
    cons: ["More expensive than piers", "Requires proper drainage", "Still needs skirting"],
  },
  {
    name: "Basement",
    description: "Full or partial basement foundation. Most expensive but adds living space and maximum stability.",
    cost: "$20,000 - $50,000+",
    bestFor: "Cold climates, adding living space, maximum resale value",
    pros: ["Adds living space", "Best resale value", "Protection from weather", "Storage space"],
    cons: ["Most expensive", "Requires excavation", "Waterproofing critical", "Longer timeline"],
  },
  {
    name: "Slab-on-Grade",
    description: "Concrete slab poured at ground level. Common in southern states, less common in Midwest due to frost.",
    cost: "$10,000 - $20,000",
    bestFor: "Warm climates, modular homes, no flood risk",
    pros: ["No steps into home", "Pest resistant", "Durable", "Good for accessibility"],
    cons: ["Not ideal for frost areas", "No storage underneath", "Cracks if soil shifts", "Harder to access utilities"],
  },
];

export default function SiteWorkPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                Preparation
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Site Work &<br />
              <span className="italic text-[var(--color-teal-light)]">Preparation</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              Everything that needs to happen before your home arrives. Foundations, 
              utilities, permits, and site work — explained with real costs.
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="decorative-line mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                What Is <span className="italic text-[var(--color-teal)]">Site Work?</span>
              </H2>
              <div className="space-y-6 text-[var(--color-gray)] leading-relaxed">
                <p>
                  Site work is everything that happens on your property before your manufactured 
                  home arrives. It's the foundation your home sits on, the driveway you park on, 
                  the water you drink, and the permits that make it legal.
                </p>
                <p>
                  This is where you have the most control over your total project cost. You hire
                  your own licensed contractors — and can even do some work yourself — which is
                  how most buyers keep the total project cost down. Ask us for our referral list
                  of licensed and insured contractors past customers have used.
                </p>
              </div>
            </div>

            <div className="bg-[var(--color-cream-dark)] rounded-lg p-8 lg:p-12">
              <H3 className="font-serif text-2xl font-semibold mb-6">Typical Site Work Costs</H3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-[var(--color-charcoal)]/10">
                  <span className="text-[var(--color-gray)]">Basic (developed lot)</span>
                  <span className="font-semibold">$8,000 - $15,000</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[var(--color-charcoal)]/10">
                  <span className="text-[var(--color-gray)]">Moderate (rural lot)</span>
                  <span className="font-semibold">$15,000 - $30,000</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[var(--color-charcoal)]/10">
                  <span className="text-[var(--color-gray)]">Extensive (raw land)</span>
                  <span className="font-semibold">$30,000 - $60,000+</span>
                </div>
              </div>
              <p className="text-sm text-[var(--color-gray)] mt-6">
                *Costs vary dramatically by location, soil, and existing infrastructure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Site Work Categories */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Site Work <span className="italic text-[var(--color-teal)]">Breakdown</span>
            </H2>
          </div>

          <div className="space-y-8">
            {siteWorkItems.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-2">
                    <H3 className="font-serif text-2xl font-semibold mb-3">{item.category}</H3>
                    <p className="text-[var(--color-gray)]">{item.description}</p>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[var(--color-gray)] mb-1">Typical Cost</div>
                    <div className="font-serif text-2xl font-semibold text-[var(--color-teal)]">{item.costRange}</div>
                    <div className="text-sm text-[var(--color-gray)] mt-2">{item.timeline}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[var(--color-gray)] mb-2">Cost Factors</div>
                    <ul className="space-y-1">
                      {item.factors.map((factor, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 bg-[var(--color-lime)] rounded-full" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Foundation Types */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Foundation <span className="italic text-[var(--color-teal)]">Options</span>
            </H2>
            <p className="text-[var(--color-gray)] mt-4 max-w-2xl mx-auto">
              The foundation affects your home's stability, financing options, and resale value. 
              Choose based on your budget, soil, climate, and long-term plans.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {foundationTypes.map((foundation, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-[var(--color-charcoal)]/5 overflow-hidden">
                <div className="bg-[var(--color-charcoal)] text-white p-6">
                  <H3 className="font-serif text-2xl font-semibold mb-2">{foundation.name}</H3>
                  <p className="text-white/60 text-sm">{foundation.bestFor}</p>
                </div>
                <div className="p-6">
                  <p className="text-[var(--color-gray)] mb-6">{foundation.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-xs uppercase tracking-wider text-[var(--color-gray)]">Typical Cost</span>
                    <div className="font-serif text-2xl font-semibold text-[var(--color-teal)]">{foundation.cost}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <H4 className="font-bold text-sm uppercase tracking-wider text-[var(--color-lime-dark)] mb-2">Pros</H4>
                      <ul className="space-y-1">
                        {foundation.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            <span className="text-[var(--color-lime)]">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <H4 className="font-bold text-sm uppercase tracking-wider text-[var(--color-orange)] mb-2">Considerations</H4>
                      <ul className="space-y-1">
                        {foundation.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            <span className="text-[var(--color-orange)]">•</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIY vs Contractor */}
      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              DIY vs. <span className="italic text-[var(--color-teal-light)]">Hiring Contractors</span>
            </H2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 rounded-lg p-8 border border-white/10">
              <H3 className="font-serif text-xl font-semibold mb-4 text-[var(--color-lime)]">Use Our Referral List</H3>
              <p className="text-white/60 text-sm mb-6">
                Ask for our referral list of licensed and insured contractors that past
                customers have used. You hire and pay them directly.
              </p>
              <ul className="space-y-2 text-sm text-white/60">
                <li>✓ Licensed &amp; insured referrals</li>
                <li>✓ Used by past customers</li>
                <li>✓ You negotiate directly</li>
                <li>✓ A head start on your search</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-8 border border-white/10">
              <H3 className="font-serif text-xl font-semibold mb-4 text-[var(--color-lime)]">Pick Your Own</H3>
              <p className="text-white/60 text-sm mb-6">
                You choose and hire every contractor yourself. We&apos;ll time the home&apos;s
                delivery around your crew&apos;s schedule. Maximum flexibility, potential savings.
              </p>
              <ul className="space-y-2 text-sm text-white/60">
                <li>✓ Use contractors you trust</li>
                <li>✓ Negotiate your own rates</li>
                <li>✓ Potential 10-20% savings</li>
                <li>✓ Full control over quality</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-8 border border-white/10">
              <H3 className="font-serif text-xl font-semibold mb-4 text-[var(--color-lime)]">Hybrid Approach</H3>
              <p className="text-white/60 text-sm mb-6">
                Mix and match. Hire contractors for the critical items (foundation, utilities)
                and do the optional work yourself (driveway, landscaping). Best of both worlds.
              </p>
              <ul className="space-y-2 text-sm text-white/60">
                <li>✓ Expertise where needed</li>
                <li>✓ Savings where possible</li>
                <li>✓ Flexible by project</li>
                <li>✓ Customized to you</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Need Help With <span className="italic text-[var(--color-teal)]">Site Work?</span>
          </H2>
          <p className="text-lg text-[var(--color-gray)] leading-relaxed mb-10 max-w-2xl mx-auto">
            Ask us for our referral list of licensed and insured contractors past customers
            have used — a solid head start on gathering bids for your site work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us"
              className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            >
              Request Referral List
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)] px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-charcoal)]/5 transition-colors duration-300"
            >
              More Guides
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
