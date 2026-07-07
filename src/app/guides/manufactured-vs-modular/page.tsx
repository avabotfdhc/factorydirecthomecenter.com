import Link from "next/link";
import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import { FAQSection } from "@/components/FAQSection";
import { H2, H3 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Manufactured vs. Modular vs. Mobile Homes: What's the Difference?",
  description:
    "Manufactured, modular, and mobile homes explained. Learn how building codes (HUD vs. IRC), foundations, financing, and appreciation differ — and which factory-built home is right for you in Indiana.",
  keywords: [
    "manufactured vs modular home",
    "difference between manufactured and modular homes",
    "mobile home vs manufactured home",
    "what is a modular home",
    "hud code vs irc home",
  ],
  url: "/guides/manufactured-vs-modular",
  type: "article",
});

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Guides", url: "/guides" },
  { name: "Manufactured vs. Modular vs. Mobile", url: "/guides/manufactured-vs-modular" },
];

const faqs = [
  {
    question: "What is the difference between a manufactured home and a modular home?",
    answer:
      "A manufactured home is built to the federal HUD Code on a permanent steel chassis and delivered ready to place. A modular home is built to the same state and local (IRC) building codes as a site-built house, delivered in sections, and set on a permanent foundation. Modular homes are financed and appraised like site-built homes; manufactured homes are often financed with chattel loans.",
  },
  {
    question: "Is a mobile home the same as a manufactured home?",
    answer:
      "Legally, \"mobile home\" refers to factory-built homes made before June 15, 1976, when the federal HUD Code took effect. Homes built after that date are called manufactured homes. Most people still use \"mobile home\" casually, but if you're buying new, you're buying a manufactured or modular home.",
  },
  {
    question: "Which holds its value better, manufactured or modular?",
    answer:
      "Modular homes generally appreciate similarly to site-built homes because they use the same building codes and sit on permanent foundations. Manufactured homes hold value well too — especially on owned land with a permanent foundation — though appreciation depends on location, foundation type, and upkeep.",
  },
  {
    question: "Are modular homes more expensive than manufactured homes?",
    answer:
      "Usually, yes. Modular homes are built to IRC codes with heavier materials and permanent foundations, so they typically cost more than a comparable manufactured home — but still far less than site-built construction. Manufactured homes are the most affordable factory-built option.",
  },
  {
    question: "Can you tell the difference once the home is finished?",
    answer:
      "Often you can't. Modern manufactured and modular homes offer the same finishes, layouts, and curb appeal as site-built homes. The differences are mostly in the building code, foundation, and how the home is financed and titled — not in how it looks or feels to live in.",
  },
];

export default function ManufacturedVsModularPage() {
  return (
    <>
      <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      <StructuredData data={structuredData.faqPage(faqs)} />
      <StructuredData
        data={structuredData.article({
          headline: "Manufactured vs. Modular vs. Mobile Homes: What's the Difference?",
          description:
            "How manufactured, modular, and mobile homes differ by building code, foundation, financing, and appreciation.",
          image: "/images/hero-home.jpg",
          datePublished: "2024-01-01",
          dateModified: new Date().toISOString(),
          author: "Factory Direct Homes Center",
          url: "/guides/manufactured-vs-modular",
        })}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-[var(--color-cream-dark)] py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-gray)]">
            {breadcrumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                <Link href={c.url} className={i === breadcrumbs.length - 1 ? "font-semibold text-[var(--color-charcoal)]" : "hover:text-[var(--color-teal)]"}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* Hero + direct answer (AEO / featured-snippet target) */}
      <section className="relative pt-24 pb-14 lg:pt-32 lg:pb-16 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">Buyer Guide</span>
          <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mt-4 mb-6">
            Manufactured vs. Modular vs. <span className="italic text-[var(--color-teal-light)]">Mobile Homes</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            The short version: <strong className="text-white">manufactured homes</strong> are built to the federal HUD
            Code on a steel chassis; <strong className="text-white">modular homes</strong> are built to the same local
            (IRC) codes as site-built houses and set on a permanent foundation; and{" "}
            <strong className="text-white">&ldquo;mobile home&rdquo;</strong> technically means a factory-built home made
            before June 15, 1976. All three are built in a factory — the differences are in code, foundation, and
            financing.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <H2 className="font-serif text-3xl font-light mb-6">Side-by-Side Comparison</H2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-[var(--color-charcoal)]/10 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[var(--color-cream-dark)] text-left">
                  <th className="p-3 font-semibold"> </th>
                  <th className="p-3 font-semibold">Manufactured</th>
                  <th className="p-3 font-semibold">Modular</th>
                  <th className="p-3 font-semibold">Mobile (pre-1976)</th>
                </tr>
              </thead>
              <tbody className="[&_td]:p-3 [&_td]:border-t [&_td]:border-[var(--color-charcoal)]/10 text-[var(--color-gray)]">
                <tr><td className="font-medium text-[var(--color-charcoal)]">Building code</td><td>Federal HUD Code</td><td>State/local IRC (same as site-built)</td><td>None (pre-HUD)</td></tr>
                <tr><td className="font-medium text-[var(--color-charcoal)]">Chassis</td><td>Permanent steel chassis</td><td>No permanent chassis</td><td>Permanent chassis</td></tr>
                <tr><td className="font-medium text-[var(--color-charcoal)]">Foundation</td><td>Pier/blocking or permanent</td><td>Permanent foundation</td><td>Typically pier/blocking</td></tr>
                <tr><td className="font-medium text-[var(--color-charcoal)]">Financing</td><td>Chattel or land-home</td><td>Conventional / land-home mortgage</td><td>Hard to finance; often cash</td></tr>
                <tr><td className="font-medium text-[var(--color-charcoal)]">Appreciation</td><td>Good, esp. on owned land</td><td>Like site-built</td><td>Limited</td></tr>
                <tr><td className="font-medium text-[var(--color-charcoal)]">Relative cost</td><td>Most affordable</td><td>Higher, still below site-built</td><td>N/A (used/older)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--color-gray)] mt-3">All new homes we sell are manufactured or modular — built to current HUD or IRC codes.</p>
        </div>
      </section>

      {/* Explanations */}
      <section className="py-6 lg:py-10 bg-white border-b border-[var(--color-charcoal)]/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-8">
          <div>
            <H3 className="font-serif text-2xl font-light mb-3">Manufactured Homes (HUD Code)</H3>
            <p className="text-[var(--color-gray)] leading-relaxed">
              Manufactured homes are built entirely in a factory to the federal HUD Code and transported to your site on a
              permanent steel chassis. They come as single wides, double wides, and triple wides, and they&rsquo;re the most
              affordable path to new home ownership. Placed on owned land with a permanent foundation, they hold value well
              and are commonly financed with chattel or land-home loans.
            </p>
          </div>
          <div>
            <H3 className="font-serif text-2xl font-light mb-3">Modular Homes (IRC Code)</H3>
            <p className="text-[var(--color-gray)] leading-relaxed">
              Modular homes are built in sections to the same state and local (IRC) building codes as site-built houses,
              then assembled on a permanent foundation. Because they meet the same codes and sit on a permanent foundation,
              modular homes are appraised, financed, and titled like site-built homes and appreciate similarly — with the
              speed, precision, and savings of factory construction.
            </p>
          </div>
          <div>
            <H3 className="font-serif text-2xl font-light mb-3">Mobile Homes (Pre-1976)</H3>
            <p className="text-[var(--color-gray)] leading-relaxed">
              &ldquo;Mobile home&rdquo; is the legal term for factory-built homes made before the HUD Code took effect on
              June 15, 1976. Anything built after that date is a manufactured home. People still say &ldquo;mobile
              home&rdquo; out of habit, but if you&rsquo;re buying new today, you&rsquo;re choosing between a manufactured
              or a modular home.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ (FAQPage schema) */}
      <FAQSection title="Common Questions" subtitle="Manufactured, modular, and mobile homes" faqs={faqs} />

      {/* CTA */}
      <section className="py-16 bg-[var(--color-charcoal)] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-3xl font-light mb-4">Not Sure Which Is Right for You?</H2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            We&rsquo;ll help you compare manufactured and modular options based on your land, budget, and financing —
            factory-direct, from our Auburn, Indiana showroom.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/floor-plans" className="bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-4 text-sm font-bold tracking-widest uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors">
              Browse Floor Plans
            </Link>
            <Link href="/contact-us" className="border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase rounded hover:bg-white/5 transition-colors">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
