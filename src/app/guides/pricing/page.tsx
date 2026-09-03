import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import Link from "next/link";
import { H2, H3 } from "@/components/Heading";
import { GuideMeta } from "@/components/GuideMeta";
import { SHOW_SALE_PRICES } from "@/lib/price-visibility";

export const metadata = genMeta({
  title: "How Our Pricing Works",
  description: "Learn how Factory Direct Homes Center's line-item pricing works. See exactly what you're paying for — home, delivery, setup, and site work. No hidden markups, total transparency.",
  url: "/guides/pricing",
  type: "article",
});

const pricingFAQs = [
  {
    question: "Can I really use my own contractors?",
    answer: "Absolutely — in fact, that's how it works here. You hire your own excavator, concrete crew, and electrician, and many of our customers save real money doing it. If you need a starting point, ask for our referral list of licensed and insured contractors past customers have used.",
  },
  {
    question: "What if I don't know any contractors?",
    answer: "No problem. Ask us for our referral list of licensed and insured contractors that past customers have used. You hire and pay them directly — and you'll still see every line item.",
  },
  {
    question: "Is the home price really factory-direct plus a fair margin?",
    answer: "Yes. Our pricing is factory-direct with a transparent dealer margin (typically 10-15%, not the 20-40% you'll find elsewhere). No games, no hidden fees.",
  },
  {
    question: "What costs are fixed vs. variable?",
    answer: "The home price is fixed once you choose your model and options. Delivery is fixed based on your distance. Setup and site work vary based on your property and choices — that's where you have the most control over total cost.",
  },
];

const comparisonData = [
  {
    item: "Home (Base Price)",
    factoryDirect: "$89,900",
    traditional: "$95,000 - $105,000",
    notes: "Factory-direct + fair margin vs. 20-40% markup",
  },
  {
    item: "Delivery",
    factoryDirect: "$3,500",
    traditional: "Bundled (hidden)",
    notes: "Itemized separately vs. hidden in 'total price'",
  },
  {
    item: "Setup & Installation",
    factoryDirect: "$8,000",
    traditional: "Bundled (hidden)",
    notes: "Your choice of crews vs. forced vendor",
  },
  {
    item: "Site Work (est)",
    factoryDirect: "$10,000",
    traditional: "Bundled (hidden)",
    notes: "Use any contractor vs. marked-up bundled cost",
  },
  {
    item: "Total",
    factoryDirect: "$111,400",
    traditional: "$125,000 - $140,000",
    notes: "Save $13,600 - $28,600 with transparency",
  },
];

const lineItems = [
  {
    title: "The Home",
    description: "Your manufactured or modular home from Champion's factory. We add only a fair margin on our factory-direct cost. Most dealers markup 20-40% here.",
    example: "$89,900",
    details: ["Factory-direct base pricing", "Customization costs itemized", "Fair dealer margin (not 20-40%)", "No 'destination charges' or hidden fees"],
  },
  {
    title: "Delivery",
    description: "Transporting your home from Decatur, IN to your site. Depends on distance, home size, and route complexity.",
    example: "$2,500 - $8,000",
    details: ["Distance-based pricing", "Oversize load permits included", "Escort vehicles if required", "Insurance during transport"],
  },
  {
    title: "Setup & Installation",
    description: "Performed by the setup crew you hire: placing the home on the foundation, leveling, securing, and connecting utilities. Critical work that affects your home's longevity.",
    example: "$5,000 - $15,000",
    details: ["Foundation placement", "Leveling and anchoring", "Utility connections", "Final inspection prep"],
  },
  {
    title: "Site Work",
    description: "Everything before delivery, handled by your own contractors: land clearing, foundation, driveway, utilities, landscaping. Most variable cost.",
    example: "$5,000 - $50,000+",
    details: ["Land clearing and grading", "Foundation (concrete/block/pier)", "Well/septic or utility hookups", "Driveway and landscaping"],
  },
];

export default function PricingPage() {
  return (
    <>
      <StructuredData data={structuredData.faqPage(pricingFAQs)} />

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                Our Difference
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Line-Item<br />
              <span className="italic text-[var(--color-teal-light)]">Transparency</span>
            </h1>
            <GuideMeta href="/guides/pricing" />
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              Most dealers give you one mysterious number. We itemize every cost 
              so you know exactly what you're paying for — and where you can save.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="decorative-line mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                The Problem With<br />
                <span className="italic text-[var(--color-teal)]">Bundled Pricing</span>
              </H2>
              <div className="space-y-6 text-[var(--color-gray)] leading-relaxed">
                <p>
                  Traditional dealers bundle everything into one price: home, delivery, setup, site work. 
                  Sounds simple, right? But here's what they don't tell you:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>You can't see where your money goes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>Hidden markups on delivery and site work</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>Forced to use their contractors (more markup)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>No way to save by doing some work yourself</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[var(--color-cream-dark)] rounded-lg p-8 lg:p-12">
              <H3 className="font-serif text-2xl font-semibold mb-6">Typical Dealer Quote</H3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[var(--color-charcoal)]/10">
                  <span className="text-[var(--color-gray)]">Your Home</span>
                  <span className="font-semibold text-lg">
                    {SHOW_SALE_PRICES ? "$125,000" : "One bundled number"}
                  </span>
                </div>
                <div className="text-sm text-[var(--color-gray)] italic">
                  "Includes everything!" (But what does that mean?)
                </div>
                <div className="bg-[var(--color-orange)]/10 rounded-lg p-4 mt-6">
                  <p className="text-sm text-[var(--color-orange)]">
                    <strong>Reality:</strong> You're paying for hidden markups on delivery, 
                    setup, and site work. And you have no choice in contractors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Our <span className="italic text-[var(--color-teal)]">Line-Item</span> Approach
            </H2>
            <p className="text-[var(--color-gray)] mt-4 max-w-2xl mx-auto">
              Every cost is separate. Every choice is yours. See exactly what you're paying for.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {lineItems.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-8 border border-[var(--color-charcoal)]/5">
                <div className="flex items-start justify-between mb-4">
                  <H3 className="font-serif text-2xl font-semibold">{item.title}</H3>
                  <span className="text-[var(--color-teal)] font-bold text-lg">
                    {SHOW_SALE_PRICES ? item.example : "Call for pricing"}
                  </span>
                </div>
                <p className="text-[var(--color-gray)] mb-6">{item.description}</p>
                <ul className="space-y-2">
                  {item.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-[var(--color-lime)] rounded-full" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="decorative-line mb-6" />
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-12">
            Side-by-Side <span className="italic text-[var(--color-teal)]">Comparison</span>
          </H2>

          {/* The comparison rests on a worked example built from a home price
              and ends in a savings figure, so it comes down with every other
              published number — see src/lib/price-visibility.ts. The argument
              it makes (itemised vs bundled) is made in prose either way. */}
          {SHOW_SALE_PRICES ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[var(--color-charcoal)]">
                      <th className="text-left py-4 font-semibold">Cost Item</th>
                      <th className="text-left py-4 font-semibold text-[var(--color-teal)]">Factory Direct</th>
                      <th className="text-left py-4 font-semibold text-[var(--color-gray)]">Traditional Dealer</th>
                      <th className="text-left py-4 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, idx) => (
                      <tr key={idx} className="border-b border-[var(--color-charcoal)]/10">
                        <td className="py-4 font-medium">{row.item}</td>
                        <td className="py-4 text-[var(--color-teal)] font-semibold">{row.factoryDirect}</td>
                        <td className="py-4 text-[var(--color-gray)]">{row.traditional}</td>
                        <td className="py-4 text-sm text-[var(--color-gray)]">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 bg-[var(--color-lime)]/10 rounded-lg p-6 flex items-center justify-between">
                <div>
                  <span className="text-sm text-[var(--color-gray)]">Your Potential Savings</span>
                  <div className="font-serif text-3xl font-semibold text-[var(--color-lime-dark)]">$13,600 - $28,600</div>
                </div>
                <div className="text-right text-sm text-[var(--color-gray)] max-w-xs">
                  Through line-item transparency and contractor freedom
                </div>
              </div>
            </>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[var(--color-charcoal)]">
                    <th className="text-left py-4 font-semibold">Cost Item</th>
                    <th className="text-left py-4 font-semibold text-[var(--color-teal)]">Factory Direct</th>
                    <th className="text-left py-4 font-semibold">How it differs</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData
                    // The total row's note is itself a savings figure, so it
                    // comes out with the numbers rather than standing alone.
                    .filter((row) => !/total/i.test(row.item))
                    .map((row, idx) => (
                      <tr key={idx} className="border-b border-[var(--color-charcoal)]/10">
                        <td className="py-4 font-medium">{row.item}</td>
                        <td className="py-4 text-[var(--color-teal)] font-semibold">Quoted separately</td>
                        <td className="py-4 text-sm text-[var(--color-gray)]">{row.notes}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <p className="mt-8 text-[var(--color-gray)] max-w-2xl">
                Every one of these is a separate line on your quotation, and you hire your own
                contractors wherever it saves you money. Call{" "}
                <a href="tel:+12603081457" className="text-[var(--color-teal)] font-semibold underline underline-offset-4">
                  (260) 308-1457
                </a>{" "}
                and we&rsquo;ll put real numbers against every line, in writing.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Your Choice */}
      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Your Choice on <span className="italic text-[var(--color-teal-light)]">Every Line</span>
            </H2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 rounded-lg p-8 border border-white/10">
              <H3 className="font-serif text-xl font-semibold mb-4 text-[var(--color-lime)]">Option A: Use Our Referral List</H3>
              <p className="text-white/60 text-sm mb-6">
                Start with our referral list of licensed and insured contractors past customers
                have used for setup and site work. You hire them directly — no dealer markup.
              </p>
              <span className="text-xs font-bold uppercase tracking-wider text-white/40">Best for: Busy families</span>
            </div>

            <div className="bg-white/5 rounded-lg p-8 border border-white/10">
              <H3 className="font-serif text-xl font-semibold mb-4 text-[var(--color-lime)]">Option B: You Pick Contractors</H3>
              <p className="text-white/60 text-sm mb-6">
                Use any licensed, insured contractor you choose and manage the work yourself.
                Buyers often save 10-20% this way.
              </p>
              <span className="text-xs font-bold uppercase tracking-wider text-white/40">Best for: Hands-on buyers</span>
            </div>

            <div className="bg-white/5 rounded-lg p-8 border border-white/10">
              <H3 className="font-serif text-xl font-semibold mb-4 text-[var(--color-lime)]">Option C: Mix & Match</H3>
              <p className="text-white/60 text-sm mb-6">
                We arrange delivery — that's our part. You pick your setup crew and site-work
                contractors from our referral list, your own contacts, or both.
              </p>
              <span className="text-xs font-bold uppercase tracking-wider text-white/40">Best for: Custom needs</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Common <span className="italic text-[var(--color-teal)]">Questions</span>
            </H2>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-8">
              <H3 className="font-serif text-xl font-semibold mb-3">Can I really use my own contractors?</H3>
              <p className="text-[var(--color-gray)]">
                Absolutely — in fact, that's how it works here. You hire your own excavator,
                concrete crew, and electrician, and many of our customers save real money
                doing it. If you need a starting point, ask for our referral list of licensed
                and insured contractors past customers have used.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8">
              <H3 className="font-serif text-xl font-semibold mb-3">What if I don't know any contractors?</H3>
              <p className="text-[var(--color-gray)]">
                No problem. Ask us for our referral list of licensed and insured contractors
                that past customers have used. You hire and pay them directly — and you'll
                still see every line item.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8">
              <H3 className="font-serif text-xl font-semibold mb-3">Is the home price really factory-direct plus a fair margin?</H3>
              <p className="text-[var(--color-gray)]">
                Yes. Our pricing is factory-direct with a transparent dealer margin
                (typically 10-15%, not the 20-40% you'll find elsewhere). No games, no hidden fees.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8">
              <H3 className="font-serif text-xl font-semibold mb-3">What costs are fixed vs. variable?</H3>
              <p className="text-[var(--color-gray)]">
                The home price is fixed once you choose your model and options. Delivery is 
                fixed based on your distance. Setup and site work vary based on your property 
                and choices — that's where you have the most control over total cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            See It For <span className="italic text-[var(--color-teal)]">Yourself</span>
          </H2>
          <p className="text-lg text-[var(--color-gray)] leading-relaxed mb-10 max-w-2xl mx-auto">
            Browse our floor plans and request a custom quote. You'll see line-item pricing 
            for your specific home, location, and preferences — no obligation, no pressure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/floor-plans"
              className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            >
              Browse Floor Plans
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)] px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-charcoal)]/5 transition-colors duration-300"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
