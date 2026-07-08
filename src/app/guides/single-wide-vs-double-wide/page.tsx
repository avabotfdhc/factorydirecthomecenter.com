import Link from "next/link";
import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import { FAQSection } from "@/components/FAQSection";
import { H2, H3 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Single Wide vs. Double Wide: Which Manufactured Home Is Right for You?",
  description:
    "Single wide vs. double wide manufactured homes compared — size, layout, price, land needs, and best uses. Learn which Champion home fits your budget and property in Indiana.",
  keywords: [
    "single wide vs double wide",
    "difference between single wide and double wide",
    "single wide manufactured home",
    "double wide manufactured home",
    "single wide vs double wide cost",
  ],
  url: "/guides/single-wide-vs-double-wide",
  type: "article",
});

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Guides", url: "/guides" },
  { name: "Single Wide vs. Double Wide", url: "/guides/single-wide-vs-double-wide" },
];

const faqs = [
  {
    question: "What is the difference between a single wide and a double wide?",
    answer:
      "A single wide is one section, typically 14–18 feet wide and up to about 80 feet long, delivered in one piece. A double wide is two sections joined on site to create a wider, more house-like home — usually 24–32 feet wide with more square footage, multiple living areas, and larger bedrooms.",
  },
  {
    question: "Is a double wide more expensive than a single wide?",
    answer:
      "Yes. Double wides have more square footage and require two transports and a larger setup, so they cost more than a comparable single wide. Single wides are the most affordable new-home option; double wides offer more space and a more traditional feel for a higher price. We provide line-item pricing on both.",
  },
  {
    question: "Do I need more land for a double wide?",
    answer:
      "A double wide needs a wider, well-prepared pad and enough room to bring in and join two sections, so it requires a bit more usable land than a single wide. Both can go on private land, leased lots, or in a community — we verify your site's requirements before delivery.",
  },
  {
    question: "Which is better for resale value?",
    answer:
      "Double wides often appeal to a broader range of buyers and can hold value well, especially on owned land with a permanent foundation. That said, a well-maintained single wide on your own land is also a solid investment. Location, foundation, and upkeep matter more than section count.",
  },
  {
    question: "Can a single wide fit a family?",
    answer:
      "Yes. Many single wides offer 2–3 bedrooms and thoughtful, efficient layouts that work well for couples, small families, first-time buyers, and downsizers. If you need multiple living areas or larger bedrooms, a double wide may be the better fit.",
  },
];

export default function SingleVsDoubleWidePage() {
  return (
    <>
      <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      <StructuredData data={structuredData.faqPage(faqs)} />
      <StructuredData
        data={structuredData.article({
          headline: "Single Wide vs. Double Wide: Which Manufactured Home Is Right for You?",
          description:
            "Single wide vs. double wide manufactured homes compared by size, layout, price, and land needs.",
          image: "/images/hero-home.jpg",
          datePublished: "2024-01-01",
          dateModified: new Date().toISOString(),
          author: "Factory Direct Homes Center",
          url: "/guides/single-wide-vs-double-wide",
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

      {/* Hero + direct answer */}
      <section className="relative pt-24 pb-14 lg:pt-32 lg:pb-16 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">Buyer Guide</span>
          <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mt-4 mb-6">
            Single Wide vs. <span className="italic text-[var(--color-teal-light)]">Double Wide</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            A <strong className="text-white">single wide</strong> is one section (about 14–18 ft wide) delivered in one
            piece — the most affordable new home. A <strong className="text-white">double wide</strong> is two sections
            joined on site (about 24–32 ft wide) for more space, multiple living areas, and a house-like feel. The right
            choice comes down to your budget, land, and how much room you need.
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
                  <th className="p-3 font-semibold">Single Wide</th>
                  <th className="p-3 font-semibold">Double Wide</th>
                </tr>
              </thead>
              <tbody className="[&_td]:p-3 [&_td]:border-t [&_td]:border-[var(--color-charcoal)]/10 text-[var(--color-gray)]">
                <tr><td className="font-medium text-[var(--color-charcoal)]">Sections</td><td>One</td><td>Two (joined on site)</td></tr>
                <tr><td className="font-medium text-[var(--color-charcoal)]">Typical width</td><td>14–18 ft</td><td>24–32 ft</td></tr>
                <tr><td className="font-medium text-[var(--color-charcoal)]">Typical size</td><td>~500–1,200 sq ft</td><td>~1,000–2,400 sq ft</td></tr>
                <tr><td className="font-medium text-[var(--color-charcoal)]">Bedrooms</td><td>1–3</td><td>2–4</td></tr>
                <tr><td className="font-medium text-[var(--color-charcoal)]">Layout</td><td>Efficient, linear</td><td>Open, multiple living areas</td></tr>
                <tr><td className="font-medium text-[var(--color-charcoal)]">Land needed</td><td>Less</td><td>More (wider pad)</td></tr>
                <tr><td className="font-medium text-[var(--color-charcoal)]">Relative cost</td><td>Most affordable</td><td>Higher</td></tr>
                <tr><td className="font-medium text-[var(--color-charcoal)]">Best for</td><td>Singles, couples, first-time buyers, downsizers</td><td>Families, more space, house-like feel</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Explanations */}
      <section className="py-6 lg:py-10 bg-white border-b border-[var(--color-charcoal)]/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-8">
          <div>
            <H3 className="font-serif text-2xl font-light mb-3">When a Single Wide Makes Sense</H3>
            <p className="text-[var(--color-gray)] leading-relaxed">
              Single wides are the most budget-friendly path to a brand-new home. They deliver in one piece, need less
              site prep and land, and modern layouts make smart use of every square foot. They&rsquo;re a great fit for
              first-time buyers, couples, downsizers, rental properties, or a home on a smaller lot or leased space.
            </p>
          </div>
          <div>
            <H3 className="font-serif text-2xl font-light mb-3">When a Double Wide Is Worth It</H3>
            <p className="text-[var(--color-gray)] leading-relaxed">
              Double wides feel much more like a traditional site-built house — open-concept living, larger kitchens,
              split-bedroom layouts, and room to grow. If you have a family, entertain often, or want a primary residence
              with more space and resale appeal, the extra investment in a double wide usually pays off in comfort and
              value.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection title="Common Questions" subtitle="Single wide vs. double wide" faqs={faqs} />

      {/* CTA */}
      <section className="py-16 bg-[var(--color-charcoal)] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-3xl font-light mb-4">Compare Real Floor Plans</H2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            Browse Champion single wides and double wides side by side, then get a factory-direct quote for the layout
            that fits your land and budget.
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
