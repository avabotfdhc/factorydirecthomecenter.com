import { generateMetadata as genMeta } from "@/lib/seo";
import Link from "next/link";
import { H2, H3, H4 } from "@/components/Heading";
import { GuideMeta } from "@/components/GuideMeta";

export const metadata = genMeta({
  title: "Financing Options for Manufactured Homes",
  description: "Chattel loans, land-home packages, and conventional financing explained. Compare financing options for manufactured homes in Indiana, Ohio, and Michigan. Find the best loan for your situation.",
  url: "/guides/financing",
  type: "article",
});

const loanTypes = [
  {
    name: "Land-Home Package",
    type: "Home & Land",
    downPayment: "5-20%",
    creditScore: "620+",
    bestFor: "Buyers with land or buying land together",
    description: "Land-home packages finance both the manufactured home and the land it sits on in a single loan. This works like a traditional mortgage for homes placed on a permanent foundation.",
    pros: [
      "Finances home and land together",
      "Competitive interest rates",
      "Longer terms available",
      "Builds equity like site-built home",
    ],
    cons: [
      "Must own or be buying the land",
      "Home must be on permanent foundation",
      "Stricter property standards",
      "Larger down payment than chattel",
    ],
    requirements: [
      "Land included in purchase",
      "Home on permanent foundation",
      "Debt-to-income ratio under 43%",
      "Stable employment history",
      "Home must be primary residence",
    ],
  },
  {
    name: "Conventional",
    type: "Modular Homes",
    downPayment: "5-20%",
    creditScore: "620+",
    bestFor: "Modular homes with good credit",
    description: "Conventional mortgages work for modular homes on permanent foundations, just like site-built homes. Best rates go to buyers with strong credit and larger down payments.",
    pros: [
      "Best interest rates",
      "No mortgage insurance with 20% down",
      "Flexible terms (15-30 years)",
      "No government fees",
      "Can be used for investment properties",
    ],
    cons: [
      "Higher credit requirements",
      "Larger down payment needed",
      "Modular homes only (typically)",
      "Stricter appraisal standards",
      "Private mortgage insurance under 20%",
    ],
    requirements: [
      "Minimum 620 credit score",
      "5% down minimum (20% avoids PMI)",
      "Debt-to-income ratio under 36-43%",
      "Stable employment history",
      "Home on permanent foundation",
    ],
  },
  {
    name: "Chattel Loan",
    type: "Personal Property",
    downPayment: "5-10%",
    creditScore: "575+",
    bestFor: "Buyers without land, easier qualification",
    description: "Chattel loans treat your manufactured home as personal property (like a car), not real estate. Easier to qualify, but higher rates. Many buyers use chattel temporarily, then refinance to a mortgage after buying land.",
    pros: [
      "Easier qualification",
      "Faster approval process",
      "No land required",
      "Lower closing costs",
      "Can refinance later",
    ],
    cons: [
      "Higher interest rates (7-12%)",
      "Shorter terms (15-20 years)",
      "May not build equity as fast",
      "Fewer lender options",
      "Interest not tax deductible",
    ],
    requirements: [
      "Minimum 575 credit score",
      "5-10% down payment",
      "Proof of income",
      "Home must be primary residence",
      "Home must be new or near-new",
    ],
  },
];

const rateComparison = [
  { type: "Conventional", rate: "6.5% - 7.5%", bestFor: "Strong credit" },
  { type: "Land-Home", rate: "6.5% - 7.5%", bestFor: "Home + land together" },
  { type: "Chattel", rate: "8.0% - 12%", bestFor: "Easier qualification" },
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
                Complete Guide
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Financing<br />
              <span className="italic text-[var(--color-teal-light)]">Options</span>
            </h1>
            <GuideMeta href="/guides/financing" />
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              Chattel, land-home, and conventional loans — explained. Find the best financing
              option for your manufactured or modular home purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Comparison */}
      <section className="py-16 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <H2 className="font-serif text-2xl font-semibold mb-8 text-center">Quick Rate Comparison</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rateComparison.map((loan) => (
              <div key={loan.type} className="bg-white rounded-lg p-6 text-center border border-[var(--color-charcoal)]/5">
                <div className="font-semibold text-sm mb-2">{loan.type}</div>
                <div className="font-serif text-2xl font-semibold text-[var(--color-teal)] mb-2">{loan.rate}</div>
                <div className="text-xs text-[var(--color-gray)]">{loan.bestFor}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[var(--color-gray)] mt-6">
            *Rates are estimates as of 2026. Actual rates vary by lender, credit score, and market conditions.
          </p>
        </div>
      </section>

      {/* Loan Types */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Compare <span className="italic text-[var(--color-teal)]">Loan Types</span>
            </H2>
          </div>

          <div className="space-y-16">
            {loanTypes.map((loan, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-[var(--color-charcoal)]/5 overflow-hidden">
                <div className="bg-[var(--color-charcoal)] text-white p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <H3 className="font-serif text-3xl font-semibold mb-2">{loan.name}</H3>
                      <p className="text-white/60">{loan.description}</p>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-xs uppercase tracking-wider text-white/40 mb-1">Down Payment</div>
                        <div className="font-serif text-2xl font-semibold text-[var(--color-lime)]">{loan.downPayment}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs uppercase tracking-wider text-white/40 mb-1">Credit Score</div>
                        <div className="font-serif text-2xl font-semibold text-[var(--color-lime)]">{loan.creditScore}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 lg:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div>
                      <H4 className="font-bold text-sm uppercase tracking-wider text-[var(--color-lime-dark)] mb-4">Pros</H4>
                      <ul className="space-y-2">
                        {loan.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-[var(--color-lime)] mt-1">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <H4 className="font-bold text-sm uppercase tracking-wider text-[var(--color-orange)] mb-4">Considerations</H4>
                      <ul className="space-y-2">
                        {loan.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-[var(--color-orange)] mt-1">•</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <H4 className="font-bold text-sm uppercase tracking-wider text-[var(--color-gray)] mb-4">Requirements</H4>
                      <ul className="space-y-2">
                        {loan.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="w-1.5 h-1.5 bg-[var(--color-teal)] rounded-full mt-1.5" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[var(--color-charcoal)]/5">
                    <span className="text-sm text-[var(--color-gray)]">
                      <strong>Best for:</strong> {loan.bestFor}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decision Guide */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Which Loan Is <span className="italic text-[var(--color-teal)]">Right for You?</span>
            </H2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-8">
              <H3 className="font-serif text-xl font-semibold mb-4">If You Own Land...</H3>
              <p className="text-[var(--color-gray)] mb-4">
                A land-home package or conventional loan often offers the best rates. Your home
                will appreciate like site-built real estate.
              </p>
              <Link href="/contact-us" className="text-[var(--color-teal)] font-bold text-sm uppercase tracking-wider">
                Explore Land-Home Loans →
              </Link>
            </div>

            <div className="bg-white rounded-lg p-8">
              <H3 className="font-serif text-xl font-semibold mb-4">If You Don't Own Land...</H3>
              <p className="text-[var(--color-gray)] mb-4">
                Chattel loans work for home-only purchases. Buy the home now,
                add land later, then refinance.
              </p>
              <Link href="/contact-us" className="text-[var(--color-teal)] font-bold text-sm uppercase tracking-wider">
                See Home-Only Options →
              </Link>
            </div>

            <div className="bg-white rounded-lg p-8">
              <H3 className="font-serif text-xl font-semibold mb-4">If Your Credit Needs Work...</H3>
              <p className="text-[var(--color-gray)] mb-4">
                Chattel loans are more forgiving on credit.
                We work with lenders who specialize in credit challenges.
              </p>
              <Link href="/contact-us" className="text-[var(--color-teal)] font-bold text-sm uppercase tracking-wider">
                Credit-Challenged Options →
              </Link>
            </div>

            <div className="bg-white rounded-lg p-8">
              <H3 className="font-serif text-xl font-semibold mb-4">If You Want Lowest Payment...</H3>
              <p className="text-[var(--color-gray)] mb-4">
                A land-home package or conventional loan with longer terms
                keeps monthly payments manageable.
              </p>
              <Link href="/contact-us" className="text-[var(--color-teal)] font-bold text-sm uppercase tracking-wider">
                Low Payment Options →
              </Link>
            </div>

            <div className="bg-white rounded-lg p-8">
              <H3 className="font-serif text-xl font-semibold mb-4">If You're Buying Modular...</H3>
              <p className="text-[var(--color-gray)] mb-4">
                Conventional mortgages treat modular homes like site-built. Best rates, 
                no government fees, and standard mortgage terms.
              </p>
              <Link href="/contact-us" className="text-[var(--color-teal)] font-bold text-sm uppercase tracking-wider">
                Modular Financing →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Qualification */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Get <span className="italic text-[var(--color-teal)]">Pre-Qualified</span>
          </H2>
          <p className="text-lg text-[var(--color-gray)] leading-relaxed mb-10 max-w-2xl mx-auto">
            Pre-qualification shows sellers you're serious, helps you understand your budget, 
            and speeds up the buying process. We work with multiple lenders to find your best option.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us"
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
