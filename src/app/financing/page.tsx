import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Financing",
  description: "Affordable financing for manufactured and modular homes. FHA, VA, conventional, and chattel loans available. As low as 0% down for veterans.",
};

const loanTypes = [
  { title: "FHA Title I", downPayment: "5% down", maxAmount: "Up to $92,892 – $138,762", description: "The most popular option for manufactured home buyers. Available for homes on owned or leased land. Lower credit requirements than conventional loans.", ideal: "First-time buyers, credit-building" },
  { title: "FHA Title II", downPayment: "3.5% down", maxAmount: "Varies by county", description: "For manufactured homes on permanent foundations. Functions like a traditional mortgage with competitive rates and terms up to 30 years.", ideal: "Permanent foundation, lower rates" },
  { title: "VA Loans", downPayment: "0% down", maxAmount: "County limits apply", description: "Exclusive to veterans and active military. Zero down payment, no PMI, and competitive interest rates.", ideal: "Veterans & active military" },
  { title: "Conventional", downPayment: "5–20% down", maxAmount: "Varies by lender", description: "Traditional mortgage options for modular homes on permanent foundations. Best rates for strong credit profiles.", ideal: "Modular homes, strong credit" },
  { title: "Chattel Loans", downPayment: "Varies", maxAmount: "Home value", description: "Personal property loans for homes in manufactured home communities or leased land. Faster approval with flexible terms.", ideal: "Community placement, quick close" },
];

const budgetExamples = [
  { label: "Budget Single Wide", home: "$55,000", delivery: "$8,000", foundation: "$5,000", utilities: "$4,000", total: "~$85,000", note: "Affordable entry into homeownership" },
  { label: "Mid-Range Double Wide", home: "$105,000", delivery: "$12,000", foundation: "$10,000", utilities: "$6,000", total: "~$150,000", note: "Most popular family choice" },
  { label: "Premium Modular", home: "$165,000", delivery: "$15,000", foundation: "$15,000", utilities: "$8,000", total: "~$232,000", note: "Site-built quality, factory price" },
];

export default function FinancingPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-terracotta-light)]">Loans &amp; Lenders</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Financing That <span className="italic text-[var(--color-terracotta-light)]">Works</span><br />for You
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              We work with multiple lenders to find the best rates and terms for your situation. From 0% down VA loans to FHA options with flexible credit requirements.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <div className="decorative-line mb-6" />
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
              Loan <span className="italic text-[var(--color-terracotta)]">Options</span>
            </h2>
            <p className="text-base text-[var(--color-warm-gray)] leading-relaxed">
              Every buyer&rsquo;s situation is different. Here are the most common financing paths for manufactured and modular homes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loanTypes.map((loan) => (
              <div key={loan.title} className="border border-[var(--color-charcoal)]/8 bg-white hover:border-[var(--color-terracotta)]/30 transition-all duration-500 flex flex-col">
                <div className="p-8 border-b border-[var(--color-charcoal)]/5">
                  <h3 className="font-serif text-2xl font-semibold mb-1">{loan.title}</h3>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="inline-block bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)] text-xs font-bold tracking-wider uppercase px-3 py-1">{loan.downPayment}</span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <p className="text-sm text-[var(--color-warm-gray)] leading-relaxed mb-4 flex-1">{loan.description}</p>
                  <div>
                    <div className="text-xs tracking-wider uppercase text-[var(--color-warm-gray-light)] mb-0.5">Max Amount</div>
                    <div className="text-sm font-semibold">{loan.maxAmount}</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[var(--color-charcoal)]/5">
                    <div className="text-xs tracking-wider uppercase text-[var(--color-warm-gray-light)] mb-0.5">Best For</div>
                    <div className="text-sm font-medium text-[var(--color-terracotta)]">{loan.ideal}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
              Total Project <span className="italic text-[var(--color-terracotta)]">Budgets</span>
            </h2>
            <p className="text-base text-[var(--color-warm-gray)] leading-relaxed max-w-2xl mx-auto">
              The home price is just one part of the equation. Here&rsquo;s what a complete project typically looks like.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {budgetExamples.map((b, i) => (
              <div key={b.label} className={`bg-white border p-8 lg:p-10 ${i === 1 ? "border-[var(--color-terracotta)]/30 ring-1 ring-[var(--color-terracotta)]/10" : "border-[var(--color-charcoal)]/5"}`}>
                {i === 1 && <span className="inline-block bg-[var(--color-terracotta)] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 mb-4">Most Popular</span>}
                <h3 className="font-serif text-xl font-semibold mb-6">{b.label}</h3>
                <div className="space-y-3 mb-6">
                  {[["Home", b.home], ["Delivery & Setup", b.delivery], ["Foundation", b.foundation], ["Utility Connections", b.utilities]].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-[var(--color-warm-gray)]">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-[var(--color-charcoal)]/10 flex justify-between items-end">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[var(--color-warm-gray)]">Total Budget</div>
                    <div className="font-serif text-2xl font-semibold text-[var(--color-terracotta)]">{b.total}</div>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-warm-gray)] mt-4 italic">{b.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              How It <span className="italic text-[var(--color-terracotta)]">Works</span>
            </h2>
          </div>
          <div className="space-y-12">
            {[
              { step: "01", title: "Get Pre-Qualified", text: "We\u2019ll connect you with our trusted lending partners. They\u2019ll review your finances and let you know what you can afford \u2014 with no obligation." },
              { step: "02", title: "Choose Your Home", text: "Browse our floor plans, walk through model homes, and customize your selections. We\u2019ll give you a complete, transparent price breakdown." },
              { step: "03", title: "Finalize Financing", text: "Your lender handles the paperwork while we coordinate site prep, permits, and scheduling. We keep you informed at every stage." },
              { step: "04", title: "Move In", text: "Your home is delivered, installed, and connected. We do a final walkthrough together to make sure everything is perfect." },
            ].map((item) => (
              <div key={item.step} className="flex gap-8">
                <div className="flex-shrink-0">
                  <span className="font-serif text-4xl font-light text-[var(--color-terracotta)]/30">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--color-warm-gray)] leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Ready to Get <span className="italic text-[var(--color-terracotta-light)]">Pre-Qualified?</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
            Call us or stop by our Auburn showroom. No pressure, no obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+12603081457" className="btn-primary inline-flex items-center justify-center gap-2 bg-[var(--color-terracotta)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-terracotta-dark)] transition-colors duration-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call (260) 308-1457
            </a>
            <Link href="/contact" className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300">Send a Message</Link>
          </div>
        </div>
      </section>
    </>
  );
}
