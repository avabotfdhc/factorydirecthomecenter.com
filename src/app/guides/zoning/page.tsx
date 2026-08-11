import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import Link from "next/link";
import { H2, H3, H4 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Zoning Laws for Manufactured Homes | Indiana, Ohio, Michigan",
  description: "Manufactured home zoning regulations explained for Indiana, Ohio, and Michigan. What you need to know about placement, permits, and local restrictions.",
  url: "/guides/zoning",
  type: "article",
});

const states = [
  {
    name: "Indiana",
    overview: "Indiana has progressive manufactured housing laws. State law prohibits local governments from banning manufactured homes outright, but zoning restrictions vary by county and municipality.",
    keyPoints: [
      "State law protects manufactured home placement rights",
      "Local zoning can restrict by district, not ban completely",
      "Modular homes treated same as site-built in most areas",
      "HUD-code homes allowed in most residential zones",
    ],
    permits: "Building permit required. Septic/well permits if applicable. Zoning compliance letter recommended.",
    timeline: "2-6 weeks depending on county",
    restrictions: [
      "Minimum lot sizes vary by county (typically 1+ acres in rural, smaller in developments)",
      "Setback requirements: typically 25-50 feet from property lines",
      "Foundation requirements vary by financing type",
      "Some historic districts have additional restrictions",
    ],
    counties: ["Allen", "Whitley", "Noble", "DeKalb", "Steuben", "LaGrange", "Huntington", "Wells", "Adams", "Marion", "Hamilton", "St. Joseph", "Elkhart", "Kosciusko"],
  },
  {
    name: "Ohio",
    overview: "Ohio has a manufactured home installation program administered by the Ohio Department of Commerce. Local zoning varies significantly between rural and urban areas.",
    keyPoints: [
      "State installation standards required",
      "Local zoning varies significantly by municipality",
      "Some cities restrict manufactured homes to specific zones",
      "Rural areas generally more permissive",
    ],
    permits: "Installation permit from Ohio Division of Industrial Compliance. Local building permit. Septic/well permits.",
    timeline: "3-8 weeks for permits",
    restrictions: [
      "Installation must comply with Ohio Administrative Code",
      "Some municipalities restrict manufactured homes to certain districts",
      "Foundation requirements for permanent placement",
      "Agricultural districts typically most permissive",
    ],
    counties: ["Lucas", "Wood", "Fulton", "Williams", "Henry", "Defiance", "Paulding", "Putnam", "Hancock", "Seneca", "Wyandot", "Crawford"],
  },
  {
    name: "Michigan",
    overview: "Michigan regulates manufactured homes through the Michigan Department of Licensing and Regulatory Affairs. Local zoning can be restrictive in some areas.",
    keyPoints: [
      "State installation code required",
      "Local zoning varies widely",
      "Some townships have restrictive ordinances",
      "Manufactured home communities common alternative",
    ],
    permits: "State installation permit. Local building permit. Zoning compliance. Septic/well permits.",
    timeline: "4-10 weeks depending on township",
    restrictions: [
      "Installation must meet Michigan Construction Code",
      "Some townships restrict by minimum square footage",
      "Age restrictions in some communities (new homes only)",
      "Foundation and skirting requirements",
    ],
    counties: ["Kalamazoo", "Calhoun", "Branch", "St. Joseph", "Cass", "Van Buren", "Allegan", "Barry", "Eaton", "Jackson", "Hillsdale", "Lenawee"],
  },
];

const commonQuestions = [
  {
    question: "Can I put a manufactured home on any property?",
    answer: "Not necessarily. While state laws protect your right to place manufactured homes, local zoning can restrict by district, lot size, and other factors. Always check with your local zoning office before purchasing land.",
  },
  {
    question: "Do I need a permit for a manufactured home?",
    answer: "Yes. All three states require permits. Indiana and Ohio have state-level installation programs, while Michigan requires state and local permits. You'll also need local building permits and possibly septic/well permits.",
  },
  {
    question: "What's the difference between manufactured and modular for zoning?",
    answer: "Modular homes are typically treated the same as site-built homes in zoning codes. Manufactured (HUD-code) homes may have additional restrictions in some areas, though state laws generally protect placement rights.",
  },
  {
    question: "How long does the permitting process take?",
    answer: "Varies by location: Indiana typically 2-6 weeks, Ohio 3-8 weeks, Michigan 4-10 weeks. Rural areas are usually faster than municipalities. You or your contractor pull the permits — we can point you to the right local offices.",
  },
  {
    question: "Can a municipality ban manufactured homes completely?",
    answer: "Generally no. State laws in Indiana, Ohio, and Michigan protect the right to place manufactured homes. However, local zoning can restrict by district, minimum lot size, setbacks, and aesthetic requirements.",
  },
  {
    question: "What about homeowners associations (HOAs)?",
    answer: "HOAs can restrict manufactured homes through covenants, even where zoning allows them. Always review HOA documents before purchasing in a subdivision. We can help you find HOA-friendly communities.",
  },
];

export default function ZoningPage() {
  return (
    <>
      <StructuredData data={structuredData.faqPage(commonQuestions)} />

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                Regulations
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Zoning Laws &<br />
              <span className="italic text-[var(--color-teal-light)]">Regulations</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              What you need to know about manufactured home placement in Indiana, Ohio, 
              and Michigan. State laws, local restrictions, and permit requirements.
            </p>
          </div>
        </div>
      </section>

      {/* State-by-State */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              State-by-State <span className="italic text-[var(--color-teal)]">Guide</span>
            </H2>
          </div>

          <div className="space-y-16">
            {states.map((state, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-[var(--color-charcoal)]/5 overflow-hidden">
                <div className="bg-[var(--color-charcoal)] text-white p-8">
                  <H3 className="font-serif text-3xl font-semibold mb-4">{state.name}</H3>
                  <p className="text-white/60 max-w-3xl">{state.overview}</p>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div>
                      <H4 className="font-bold text-sm uppercase tracking-wider text-[var(--color-teal)] mb-4">Key Points</H4>
                      <ul className="space-y-2">
                        {state.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-[var(--color-lime)] mt-1">✓</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <H4 className="font-bold text-sm uppercase tracking-wider text-[var(--color-teal)] mb-4">Permits Required</H4>
                      <p className="text-sm text-[var(--color-gray)] mb-4">{state.permits}</p>
                      <div className="bg-[var(--color-cream-dark)] rounded-lg p-4">
                        <span className="text-xs uppercase tracking-wider text-[var(--color-gray)]">Timeline</span>
                        <div className="font-semibold">{state.timeline}</div>
                      </div>
                    </div>

                    <div>
                      <H4 className="font-bold text-sm uppercase tracking-wider text-[var(--color-teal)] mb-4">Common Restrictions</H4>
                      <ul className="space-y-2">
                        {state.restrictions.map((restriction, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-[var(--color-orange)] mt-1">•</span>
                            {restriction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-[var(--color-charcoal)]/5">
                    <H4 className="font-bold text-sm uppercase tracking-wider text-[var(--color-gray)] mb-4">
                      Counties We Serve in {state.name}
                    </H4>
                    <div className="flex flex-wrap gap-2">
                      {state.counties.map((county) => (
                        <span
                          key={county}
                          className="bg-[var(--color-cream-dark)] rounded-full px-4 py-2 text-sm"
                        >
                          {county}
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

      {/* FAQ */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              Common <span className="italic text-[var(--color-teal)]">Questions</span>
            </H2>
          </div>

          <div className="space-y-6">
            {commonQuestions.map((qa, idx) => (
              <div key={idx} className="bg-white rounded-lg p-8">
                <H3 className="font-serif text-xl font-semibold mb-4">{qa.question}</H3>
                <p className="text-[var(--color-gray)]">{qa.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Check Before You Buy */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="decorative-line mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                Check Before You <span className="italic text-[var(--color-teal)]">Buy Land</span>
              </H2>
              <div className="space-y-6 text-[var(--color-gray)]">
                <p>
                  Before purchasing land for your manufactured home, verify these items 
                  with the local zoning office:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[var(--color-lime)]/20 text-[var(--color-lime)] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <span>Zoning district allows manufactured homes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[var(--color-lime)]/20 text-[var(--color-lime)] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <span>Lot meets minimum size requirements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[var(--color-lime)]/20 text-[var(--color-lime)] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                    <span>Setbacks allow home placement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[var(--color-lime)]/20 text-[var(--color-lime)] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                    <span>Utility access (water, sewer/septic, electric)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[var(--color-lime)]/20 text-[var(--color-lime)] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                    <span>No HOA restrictions against manufactured homes</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[var(--color-charcoal)] text-white rounded-lg p-8 lg:p-12">
              <H3 className="font-serif text-2xl font-semibold mb-6">We Can Help</H3>
              <p className="text-white/60 mb-8">
                Not sure if your land is suitable? We offer free zoning checks for customers 
                in our service area. We'll contact the local zoning office and verify:
              </p>
              <ul className="space-y-3 text-white/60">
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-lime)]">✓</span>
                  Zoning compliance
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-lime)]">✓</span>
                  Permit requirements
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-lime)]">✓</span>
                  Setback calculations
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-lime)]">✓</span>
                  Utility availability
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Questions About <span className="italic text-[var(--color-teal-light)]">Your Property?</span>
          </H2>
          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
            We can check zoning for your specific property, explain local requirements, 
            and help you navigate the permitting process. Free for customers in our service area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us"
              className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            >
              Request Zoning Check
            </Link>
            <a
              href="tel:+12603081457"
              className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300"
            >
              Call (260) 308-1457
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
