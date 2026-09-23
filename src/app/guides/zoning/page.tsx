import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import Link from "next/link";
import { H2, H3, H4 } from "@/components/Heading";
import { GuideMeta } from "@/components/GuideMeta";

export const metadata = genMeta({
  title: "Manufactured Home Zoning Laws",
  description: "How manufactured home placement is decided in Indiana, Ohio and Michigan: what the state controls, what your township or county controls, and the five questions to ask the zoning office before you buy land.",
  url: "/guides/zoning",
  type: "article",
});

// WHAT THIS PAGE MAY AND MAY NOT SAY
//
// Until 2026-09-22 this page asserted specifics no one can source: permit
// turnarounds per state ("Indiana typically 2-6 weeks, Ohio 3-8, Michigan
// 4-10"), setbacks "typically 25-50 feet", rural minimum lot sizes of "1+
// acres", and — the dangerous one — "Can a municipality ban manufactured
// homes completely? Generally no." A buyer who reads that, buys a parcel and
// then discovers their township allows HUD-code homes only inside a licensed
// community has lost real money on our say-so.
//
// No state authority publishes permit turnarounds, and setbacks and lot
// minimums are written per district by the county, township or city — there
// is no state-level number to quote. So this page no longer quotes any.
//
// The rule from here: describe the STRUCTURE of the process (who sets
// construction standards, who decides placement, which permits exist) and
// tell the buyer exactly what to ask and whom. Do not characterize what any
// statute grants or forbids, and do not add a number that is not published by
// the authority that enforces it. Where a fact is genuinely per-parcel, the
// honest answer is "your zoning office, in writing, before you buy".

const states = [
  {
    name: "Indiana",
    overview:
      "The state sets construction and installation standards. WHERE a home may go is decided locally — by the county, township or city that writes the zoning ordinance for your parcel.",
    keyPoints: [
      "State standards govern how the home is built and installed",
      "Your zoning district decides whether a home may be placed at all",
      "Modular homes are usually treated like site-built housing",
      "HUD-code homes are more often restricted by district",
    ],
    permits:
      "Local building permit. Septic or well permits where there is no public utility. A written zoning verification for the parcel, before you buy it.",
    authority: {
      label: "Indiana Department of Homeland Security — modular and mobile structures",
      url: "https://www.in.gov/dhs/fire-and-building-safety/code-enforcement/industrialized-building-systems-modularmobile-structures/",
    },
    askLocally: "County or city plan commission / building department",
    restrictions: [
      "Which districts admit a HUD-code home, and on what terms",
      "Minimum lot size and width for that district",
      "Front, side and rear setbacks",
      "Foundation, skirting and attached-structure requirements",
    ],
  },
  {
    name: "Ohio",
    overview:
      "Installation standards come from the Ohio Department of Commerce. Placement is a local question, and it varies sharply between townships, villages and cities.",
    keyPoints: [
      "State standards govern installation",
      "Townships, villages and cities write their own placement rules",
      "Some jurisdictions admit HUD-code homes only in named districts",
      "Agricultural and rural districts are often the most permissive",
    ],
    permits:
      "Installation permit under the state program. Local building permit. Septic or well permits where applicable. Written zoning verification for the parcel.",
    authority: {
      label: "Ohio Department of Commerce — Manufactured Homes Program",
      url: "https://com.ohio.gov/divisions-and-programs/manufactured-homes-program",
    },
    askLocally: "Township trustees or municipal zoning inspector, plus the county building department",
    restrictions: [
      "Whether the district admits a HUD-code home, a modular home, or both",
      "Minimum lot size and width",
      "Setbacks and maximum lot coverage",
      "Permanent-foundation and skirting requirements",
    ],
  },
  {
    name: "Michigan",
    overview:
      "Licensing and installation standards come from LARA. Placement is decided by the township, city or village — Michigan townships differ from one another more than most buyers expect.",
    keyPoints: [
      "State standards govern licensing and installation",
      "Townships and municipalities write the placement rules",
      "Some admit HUD-code homes only inside licensed communities",
      "Confirm your township's ordinance before committing to a parcel",
    ],
    permits:
      "State installation requirements. Local building permit. Septic or well permits where applicable. Written zoning verification for the parcel.",
    authority: {
      label: "Michigan LARA — Bureau of Construction Codes",
      url: "https://www.michigan.gov/lara/bureau-list/bcc",
    },
    askLocally: "Township or city zoning administrator, plus the county building department",
    restrictions: [
      "Whether the district admits a HUD-code home outside a licensed community",
      "Minimum floor area, lot size and width",
      "Setbacks and roof-pitch or exterior-material standards",
      "Foundation and skirting requirements",
    ],
  },
];

const commonQuestions = [
  {
    question: "Can I put a manufactured home on any property?",
    answer:
      "No — and this is the question to settle before you buy land, not after. Whether a home may be placed on a given parcel is decided by the zoning district that parcel sits in, and districts differ street by street. Ask the county, township or city office that writes the ordinance, and ask about your exact parcel number.",
  },
  {
    question: "Can a township or city refuse to allow a manufactured home?",
    answer:
      "Local zoning decides where a HUD-code home may go, and the answer genuinely varies — some districts admit them on any conforming lot, some admit them only in named districts, and some admit them only inside a licensed manufactured home community. Never assume a parcel qualifies because a neighboring one does. Get the answer in writing from the zoning office, for that parcel, before money changes hands.",
  },
  {
    question: "What should I ask the zoning office?",
    answer:
      "Give them the parcel number and ask five things: which zoning district it is in; whether that district permits a HUD-code manufactured home, a modular home, or both; the minimum lot size, width and setbacks; what foundation, skirting or exterior standards apply; and which permits you will need and who pulls them. Ask for the answer in writing or by email — a phone call is not something you can rely on later.",
  },
  {
    question: "Do I need a permit for a manufactured home?",
    answer:
      "Yes. Expect a local building permit, the state installation requirements for your state, and septic or well permits where there is no public utility. You or your contractor pull them — we are not the permit holder. We can point you to the right office for your county.",
  },
  {
    question: "What's the difference between manufactured and modular for zoning?",
    answer:
      "A modular home is built to the same state residential code as a site-built house and is usually treated like one in a zoning ordinance. A manufactured home is built to the federal HUD code and is more often restricted by district. Where a district admits one but not the other, that difference decides which of our homes fits your land — so confirm which your district permits before choosing a floor plan.",
  },
  {
    question: "How long does the permitting process take?",
    answer:
      "It depends entirely on the office, and no state publishes a figure we could honestly quote. A rural county building department may issue in days; a municipality with a plan commission review can take considerably longer. Ask the office for their current turnaround when you ask the zoning questions above, and build your schedule from what they tell you.",
  },
  {
    question: "What about homeowners associations (HOAs)?",
    answer:
      "An HOA can restrict manufactured homes through its covenants even where zoning allows them, and covenants are a private contract the zoning office knows nothing about. Read the recorded covenants before purchasing in a subdivision.",
  },
];

export default function ZoningPage() {
  return (
    <>      <StructuredData data={structuredData.faqPage(commonQuestions)} />

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
            <GuideMeta href="/guides/zoning" />
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

          {/* The one thing a buyer must take away. Placement is local, always,
              and nothing on this page substitutes for the parcel's own answer. */}
          <div className="max-w-3xl mx-auto -mt-8 mb-16 rounded-lg border border-[var(--color-orange)]/30 bg-[var(--color-orange)]/5 px-6 py-5">
            <p className="text-sm text-[var(--color-charcoal)]/80 leading-relaxed">
              <strong>Orientation, not an answer for your land.</strong> Each state sets how a
              home is built and installed. Whether one may be placed on a given parcel is decided
              locally, and it changes from one township to the next. Before you buy land, get the
              answer for that parcel in writing from the office named below — and treat anything
              on this page that disagrees with them as wrong.
            </p>
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
                        <span className="text-xs uppercase tracking-wider text-[var(--color-gray)]">Who answers for your parcel</span>
                        <div className="font-semibold">{state.askLocally}</div>
                        <a
                          href={state.authority.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-xs text-[var(--color-teal)] underline underline-offset-4"
                        >
                          {state.authority.label}
                        </a>
                      </div>
                    </div>

                    <div>
                      <H4 className="font-bold text-sm uppercase tracking-wider text-[var(--color-teal)] mb-4">What local code controls</H4>
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
              <H3 className="font-serif text-2xl font-semibold mb-6">Where we fit</H3>
              <p className="text-white/70 mb-8">
                We sell the home factory-direct and arrange delivery to your site. Everything
                that happens to the land is yours:
              </p>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-lime-light)] mt-0.5">•</span>
                  You or your contractor confirms zoning and pulls the permits
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-lime-light)] mt-0.5">•</span>
                  Your licensed contractors do the site work, foundation and setup
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-lime-light)] mt-0.5">•</span>
                  Utilities, septic and well are arranged by you
                </li>
              </ul>
              <p className="text-white/70 mt-8">
                That is why your quote is not padded with any of it. Ask us for the referral list
                of licensed and insured contractors past customers have used, and we will point
                you to the right office for your county.
              </p>
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
            Tell us the county and we will point you to the office that answers for your parcel,
            and send the referral list of licensed and insured contractors past customers have used
            for site work, foundations and setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us"
              className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            >
              Ask Us a Question
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
