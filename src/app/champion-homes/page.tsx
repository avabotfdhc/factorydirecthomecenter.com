import Link from "next/link";
import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import { FAQSection } from "@/components/FAQSection";
import { H2, H3 } from "@/components/Heading";
import { GuideMeta } from "@/components/GuideMeta";

export const metadata = genMeta({
  title: "Champion Homes & Our Series — Aspire, Prime & Paramount",
  description:
    "Meet Champion Homes and the series we sell at Factory Direct Homes Center: Aspire, Prime, and Paramount. How factory-built homes are made, HUD vs. IRC code, quality, warranty, and which Champion series fits you — built 20 miles from our Auburn, IN showroom.",
  keywords: [
    "Champion Homes",
    "Champion Aspire series",
    "Champion Prime series",
    "Champion Paramount series",
    "Champion manufactured homes Indiana",
    "who makes Champion homes",
  ],
  url: "/champion-homes",
  type: "article",
});

const series = [
  {
    name: "Aspire",
    plant: "Topeka, Indiana",
    tag: "The value leader — our most popular line",
    body: "Aspire is the heart of our lineup and the broadest selection we carry — single wides for first-time buyers and downsizers, and multi-section homes with full family layouts. Built to the federal HUD code at Champion's Topeka, Indiana plant just 20 miles from our showroom, Aspire pairs smart, livable floor plans with genuine factory-direct value. Many plans offer factory layout options — 2-bedroom conversions, added studies, optional kitchens and islands.",
  },
  {
    name: "Paramount",
    plant: "Topeka, Indiana",
    tag: "Elevated finishes on a multi-section home",
    body: "Paramount is Champion's step-up multi-section series, also built in Topeka — the same short-freight advantage, with an emphasis on upgraded interior selections and finishes. If you want the room and presence of a sectional home with a more finished, custom feel, Paramount is where to look.",
  },
  {
    name: "Prime",
    plant: "Decatur, Indiana",
    tag: "Champion quality from a second Indiana plant",
    body: "Prime is Champion's series built at the Decatur, Indiana facility — a well-rounded range of efficient single-section and family floor plans. It rounds out our catalog with additional layouts and price points so more buyers find the right fit.",
  },
];

const championFAQs = [
  {
    question: "Who makes Champion Homes?",
    answer:
      "Champion Homes (Champion Home Builders) is one of the largest producers of factory-built housing in North America, with plants across the country. The homes we sell are built at Champion's Indiana facilities — Aspire and Paramount in Topeka, about 20 miles from our Auburn showroom, and Prime in Decatur. Building close to us keeps freight costs and delivery times low.",
  },
  {
    question: "What's the difference between the Aspire, Prime, and Paramount series?",
    answer:
      "All three are Champion-built. Aspire is our broadest, most popular line and the best value, built in Topeka. Paramount is a step-up multi-section series with elevated finishes, also from Topeka. Prime is Champion's series from the Decatur, Indiana plant. Which is right for you comes down to home type, layout, and the finishes you want — we're glad to help you compare.",
  },
  {
    question: "Are Champion manufactured homes good quality?",
    answer:
      "Yes. Every Champion home is built indoors under a federal quality-control code (HUD) or state residential code (modular/IRC), with the same name-brand components — drywall, cabinetry, appliances, and roofing — you'd find in a site-built home, and it arrives with a manufacturer warranty. Building in a climate-controlled plant means no weather delays and consistent construction.",
  },
  {
    question: "What is the HUD code?",
    answer:
      "The HUD Code is the federal construction and safety standard every manufactured home is built to (in force since 1976). It governs structure, energy efficiency, fire safety, and more, and is enforced through third-party inspection at the factory. Modular homes are instead built to the state's IRC residential code — the same code as site-built houses. Our manufactured-vs-modular guide explains the difference in plain English.",
  },
];

export default function ChampionHomesPage() {
  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      <StructuredData
        data={structuredData.breadcrumb([
          { name: "Home", url: "/" },
          { name: "Champion Homes", url: "/champion-homes" },
        ])}
      />

      {/* Hero */}
      <section className="relative pt-28 pb-14 lg:pt-36 lg:pb-16 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-5">
            <div className="decorative-line" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">The Homes We Sell</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mb-5">
            Champion Homes, built <span className="italic text-[var(--color-teal-light)]">20 miles away</span>
          </h1>
          <GuideMeta href="/champion-homes" />
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
            Factory Direct Homes Center is an authorized Champion Homes dealer. Every home we sell is
            built by one of North America&rsquo;s largest factory-built home makers — most of them at
            Champion&rsquo;s Indiana plants, just up the road. Here&rsquo;s who Champion is, how these homes
            are built, and the three series we carry.
          </p>
        </div>
      </section>

      {/* Who is Champion */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        <H2 className="font-serif text-3xl font-light mb-5">Who is Champion Homes?</H2>
        <div className="prose-fdhc text-[var(--color-charcoal)]/80 leading-relaxed space-y-4 max-w-3xl">
          <p>
            Champion Homes — long known as Champion Home Builders — is one of the largest producers of
            factory-built housing in North America, with a network of plants that have been building homes
            for decades. When you buy from us, your home is built at one of Champion&rsquo;s Indiana
            facilities: the <strong>Topeka, Indiana</strong> plant (about 20 miles from our Auburn
            showroom) or the <strong>Decatur, Indiana</strong> plant. That proximity is a real advantage —
            shorter freight distance means lower delivery cost and faster time to your site.
          </p>
          <p>
            Because these homes are built indoors on a controlled production line, construction never stops
            for weather, materials aren&rsquo;t left out in the rain, and every home is inspected against a
            strict code before it ships. The result is consistent quality at a price site-built construction
            simply can&rsquo;t match.
          </p>
        </div>
      </section>

      {/* The series */}
      <section className="bg-white border-y border-[var(--color-charcoal)]/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
          <H2 className="font-serif text-3xl font-light mb-3">The Champion series we carry</H2>
          <p className="text-[var(--color-charcoal)]/70 max-w-3xl mb-10">
            We stock and order three Champion series. All are built to the same standards — they differ in
            layout range, finishes, and which Indiana plant builds them.
          </p>
          <div className="space-y-6">
            {series.map((s) => (
              <div key={s.name} className="border border-[var(--color-charcoal)]/8 rounded-2xl p-6 lg:p-8 bg-[var(--color-cream)]">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                  <H3 className="font-serif text-2xl font-semibold text-[var(--color-teal)]">{s.name} Series</H3>
                  <span className="text-xs font-bold tracking-wider uppercase text-[var(--color-lime-dark)]">{s.tag}</span>
                </div>
                <p className="text-xs tracking-wider uppercase text-[var(--color-gray)] mb-4">Built in {s.plant}</p>
                <p className="text-[var(--color-charcoal)]/80 leading-relaxed mb-5">{s.body}</p>
                <Link
                  href="/floor-plans"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-teal)] hover:underline underline-offset-4"
                >
                  Browse floor plans &amp; filter by {s.name} Series
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality / construction */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        <H2 className="font-serif text-3xl font-light mb-6">How a Champion home is built — and to what standard</H2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { h: "Built to code, inspected at the factory", p: "Manufactured homes are built to the federal HUD Code; modular homes to the state IRC code (the same as site-built). Every home is third-party inspected before it leaves the plant." },
            { h: "Real, name-brand materials", p: "Drywall interiors, residential cabinetry and fixtures, name-brand appliances, and pitched, shingled roofs — the same components as a site-built home." },
            { h: "Weather never stops the build", p: "Indoor assembly means no rain-soaked lumber and no weather delays, so quality stays consistent and timelines stay predictable." },
            { h: "Backed by a manufacturer warranty", p: "Your new Champion home comes with a manufacturer's warranty — factory-built doesn't mean any less protected." },
          ].map((c) => (
            <div key={c.h} className="bg-white rounded-xl border border-[var(--color-charcoal)]/8 p-6">
              <H3 className="font-semibold mb-2">{c.h}</H3>
              <p className="text-sm text-[var(--color-charcoal)]/75 leading-relaxed">{c.p}</p>
            </div>
          ))}
        </div>
        <p className="text-[var(--color-charcoal)]/70 mt-8 max-w-3xl">
          Want the deeper explanation? Our{" "}
          <Link href="/guides/manufactured-vs-modular" className="text-[var(--color-teal)] underline underline-offset-4">manufactured vs. modular guide</Link>{" "}
          breaks down HUD vs. IRC code, foundations, and financing, and the{" "}
          <Link href="/guides/buyers-guide" className="text-[var(--color-teal)] underline underline-offset-4">complete buyer&rsquo;s guide</Link>{" "}
          walks the whole process end to end.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-teal)] text-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <H2 className="font-serif text-3xl font-light mb-2">Ready to find your Champion home?</H2>
            <p className="text-white/80 max-w-xl">Browse the full lineup, or design yours online and get a factory-direct quote.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/floor-plans" className="bg-white text-[var(--color-teal)] px-6 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-cream)] transition-colors">
              Browse Floor Plans
            </Link>
            <Link href="/design-your-home" className="bg-[var(--color-lime)] text-[var(--color-charcoal)] px-6 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-lime-dark)] hover:text-white transition-colors">
              Design Your Home
            </Link>
          </div>
        </div>
      </section>

      <FAQSection title="Champion Homes — Common Questions" subtitle="Who builds them, the series, and how they're made" faqs={championFAQs} />
    </main>
  );
}
