import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Financing Partners | Factory Direct Homes Center",
  description: "Factory Direct Homes Center works with 21st Mortgage, Triad Financial, Credit Human, Lake Michigan Credit Union, and local lenders. Chattel loans, land-home packages, and cash discounts available.",
};

const lendingPartners = [
  {
    name: "21st Mortgage",
    type: "Chattel & Land-Home",
    description: "One of the nation's largest manufactured home lenders. Specializes in chattel loans and land-home packages with competitive rates and flexible terms.",
    bestFor: "Home-only purchases, buyers without land",
    features: ["Chattel loans available", "Land-home packages", "Flexible credit requirements", "Fast approval process"],
  },
  {
    name: "Triad Financial Services",
    type: "Chattel Loans",
    description: "Industry leader in manufactured home financing. Offers chattel loans with competitive rates and terms up to 23 years for qualified buyers.",
    bestFor: "Home-only financing, quick closings",
    features: ["Specialized in chattel lending", "Competitive rates", "Various term options", "Streamlined process"],
  },
  {
    name: "Credit Human",
    type: "Chattel & Mortgages",
    description: "Member-owned financial cooperative with manufactured home expertise. Offers both chattel loans and traditional mortgages for manufactured homes.",
    bestFor: "Credit union members, competitive rates",
    features: ["Member-owned cooperative", "Competitive chattel rates", "Personalized service", "Financial education resources"],
  },
  {
    name: "Lake Michigan Credit Union",
    type: "Land-Home Mortgages",
    description: "Regional credit union serving Indiana and Michigan. Offers land-home packages with mortgage rates typically lower than chattel loans.",
    bestFor: "Land-home packages, Michigan buyers",
    features: ["Regional expertise", "Land-home mortgages", "Competitive rates", "Local decision-making"],
  },
  {
    name: "Local Lenders & Credit Unions",
    type: "Various",
    description: "We maintain relationships with community banks and credit unions throughout Indiana, Ohio, and Michigan. These local lenders often offer personalized service and competitive terms.",
    bestFor: "Local buyers, established relationships",
    features: ["Personalized service", "Local decision-making", "Community focus", "Flexible terms"],
  },
];

const discounts = [
  {
    name: "Multi-Unit Discount",
    description: "Buying more than one home? We offer discounts on multi-unit purchases for investors, developers, or families building together.",
    savings: "Contact for pricing",
  },
  {
    name: "Preferred Payment Discount",
    description: "Cash buyers or those with preferred payment methods receive a discount off the home price.",
    savings: "Available",
  },
  {
    name: "Documentation Fee",
    description: "Standard documentation fee for all purchases.",
    amount: "$251",
  },
];

export default function FinancingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                Financing
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Our Lending<br />
              <span className="italic text-[var(--color-teal-light)]">Partners</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              We work with the nation's top manufactured home lenders and local credit unions 
              to find the best financing option for your situation. Chattel loans, land-home 
              packages, and cash discounts available.
            </p>
          </div>
        </div>
      </section>

      {/* Our Focus */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="decorative-line mb-6" />
              <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                Chattel Loan<br />
                <span className="italic text-[var(--color-teal)]">Specialists</span>
              </h2>
              <div className="space-y-6 text-[var(--color-gray)] leading-relaxed">
                <p>
                  Our primary focus is chattel loans — financing for the home itself, whether 
                  you own the land, lease it, or haven't found your perfect property yet. 
                  Chattel loans offer flexibility and faster approval than traditional mortgages.
                </p>
                <p>
                  We partner with 21st Mortgage, Triad Financial, and Credit Human — three of 
                  the nation's largest and most experienced manufactured home lenders. For 
                  land-home packages, we also work with Lake Michigan Credit Union and local 
                  lenders throughout Indiana, Ohio, and Michigan.
                </p>
              </div>
            </div>

            <div className="bg-[var(--color-cream-dark)] rounded-lg p-8 lg:p-12">
              <h3 className="font-serif text-2xl font-semibold mb-6">Why Chattel Loans?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-lime)] mt-1">✓</span>
                  <span><strong>No land required</strong> — Finance the home only</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-lime)] mt-1">✓</span>
                  <span><strong>Faster approval</strong> — Close in weeks, not months</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-lime)] mt-1">✓</span>
                  <span><strong>Flexible credit</strong> — Options for various credit profiles</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-lime)] mt-1">✓</span>
                  <span><strong>Lower closing costs</strong> — Less expensive than mortgages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-lime)] mt-1">✓</span>
                  <span><strong>Refinance later</strong> — Convert to mortgage after land purchase</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Lending Partners */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Our <span className="italic text-[var(--color-teal)]">Lending Partners</span>
            </h2>
          </div>

          <div className="space-y-8">
            {lendingPartners.map((partner, idx) => (
              <div key={idx} className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold mb-2">{partner.name}</h3>
                    <span className="inline-block bg-[var(--color-teal)]/10 text-[var(--color-teal)] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                      {partner.type}
                    </span>
                    <p className="text-sm text-[var(--color-gray)] mt-4">
                      <strong>Best for:</strong> {partner.bestFor}
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <p className="text-[var(--color-gray)] mb-4">{partner.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {partner.features.map((feature, i) => (
                        <span
                          key={i}
                          className="bg-[var(--color-cream-dark)] rounded-full px-4 py-2 text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discounts */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Discounts & <span className="italic text-[var(--color-teal)]">Special Pricing</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {discounts.map((discount, idx) => (
              <div key={idx} className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
                <h3 className="font-serif text-xl font-semibold mb-4">{discount.name}</h3>
                <p className="text-[var(--color-gray)] mb-6">{discount.description}</p>
                <div className="pt-6 border-t border-[var(--color-charcoal)]/5">
                  {discount.savings ? (
                    <span className="text-[var(--color-teal)] font-bold">{discount.savings}</span>
                  ) : (
                    <span className="font-serif text-2xl font-semibold text-[var(--color-teal)]">{discount.amount}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              The Financing <span className="italic text-[var(--color-teal-light)]">Process</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-teal)] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Choose Your Home</h3>
              <p className="text-white/60 text-sm">Select your floor plan and options</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-teal)] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Apply for Financing</h3>
              <p className="text-white/60 text-sm">We connect you with the best lender</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-teal)] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Get Approved</h3>
              <p className="text-white/60 text-sm">Fast approval, often within days</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-teal)] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
              <h3 className="font-semibold mb-2">Close & Build</h3>
              <p className="text-white/60 text-sm">Sign papers, factory builds your home</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Common <span className="italic text-[var(--color-teal)]">Questions</span>
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-8">
              <h3 className="font-serif text-xl font-semibold mb-3">What credit score do I need?</h3>
              <p className="text-[var(--color-gray)]">
                Our partners work with a range of credit profiles. Generally, 575+ for chattel loans, 
                but we have options for various situations. The best rates go to buyers with 650+ credit scores.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8">
              <h3 className="font-serif text-xl font-semibold mb-3">How much down payment is required?</h3>
              <p className="text-[var(--color-gray)]">
                Chattel loans typically require 5-10% down. Land-home packages may require more. 
                We also offer preferred payment discounts for cash buyers.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8">
              <h3 className="font-serif text-xl font-semibold mb-3">Can I finance just the home without land?</h3>
              <p className="text-[var(--color-gray)]">
                Yes! That's what chattel loans are for. 21st Mortgage and Triad Financial specialize 
                in home-only financing. You can place the home on your land, leased land, or in a community.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8">
              <h3 className="font-serif text-xl font-semibold mb-3">How long does approval take?</h3>
              <p className="text-[var(--color-gray)]">
                Pre-qualification can happen in minutes. Full approval typically takes 3-7 business days 
                once all documentation is submitted. Much faster than traditional mortgages.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8">
              <h3 className="font-serif text-xl font-semibold mb-3">What if I buy land later?</h3>
              <p className="text-[var(--color-gray)]">
                Many buyers start with a chattel loan on leased or family land, then refinance to a 
                land-home mortgage after purchasing their own property. We can help with both.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Ready to Get <span className="italic text-[var(--color-teal)]">Pre-Qualified?</span>
          </h2>
          <p className="text-lg text-[var(--color-gray)] leading-relaxed mb-10 max-w-2xl mx-auto">
            We'll connect you with the right lender for your situation. No obligation, 
            no pressure — just honest information about your financing options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            >
              Start Pre-Qualification
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
