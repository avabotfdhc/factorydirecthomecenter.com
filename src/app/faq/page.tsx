// One page that answers the questions buyers ask most, grouped by stage. The
// answers are the same `commonFAQs` the homepage, /financing and the guides
// already use, so there is still one source for each answer; this page gathers
// them under one URL with a single FAQPage node.
import Link from "next/link";
import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import { commonFAQs } from "@/lib/faqs";
import { NoRecommendationNotice } from "@/components/NoRecommendationNotice";

export const metadata = genMeta({
  title: "Manufactured Home FAQs | Buying in Indiana",
  description:
    "Answers to the questions Indiana buyers ask about new Champion manufactured homes: cost, delivery, land, lenders and what happens on delivery day.",
  keywords: [
    "manufactured home faq",
    "buying a manufactured home in indiana",
    "manufactured home questions",
    "mobile home buying questions",
  ],
  url: "/faq",
});

const GROUPS = [
  { id: "buying", title: "Buying a home", faqs: commonFAQs.homepage },
  { id: "process", title: "The process and delivery", faqs: commonFAQs.process },
  { id: "lenders", title: "Paying for the home", faqs: commonFAQs.financing },
];

export default function FAQPage() {
  const all = GROUPS.flatMap((g) => g.faqs);

  return (
    <div className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      <StructuredData data={structuredData.faqPage(all)} />

      <section className="bg-[var(--color-charcoal)] text-[var(--color-cream)] py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-lime-on-dark)] mb-4">Questions &amp; Answers</p>
          <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mb-5">
            Manufactured Home <span className="italic text-[var(--color-teal-light)]">FAQs</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            The questions buyers ask us most, from what a home costs to what happens on delivery day.
            Don&apos;t see yours? <Link href="/contact-us" className="underline underline-offset-4">Ask us</Link>.
          </p>
          <nav aria-label="FAQ topics" className="mt-8 flex flex-wrap gap-3 text-sm">
            {GROUPS.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="rounded-full border border-white/30 px-4 py-2 hover:bg-white/10">
                {g.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 space-y-14">
        {GROUPS.map((g) => (
          <section key={g.id} id={g.id} aria-labelledby={`${g.id}-heading`}>
            <h2 id={`${g.id}-heading`} className="font-serif text-3xl font-light mb-6">{g.title}</h2>
            <div className="space-y-4">
              {g.faqs.map((f) => (
                <details key={f.question} className="bg-white rounded-lg border border-[var(--color-charcoal)]/5">
                  <summary className="p-6 cursor-pointer font-semibold">{f.question}</summary>
                  <div className="px-6 pb-6 text-[var(--color-gray)] leading-relaxed">{f.answer}</div>
                </details>
              ))}
            </div>
            {g.id === "lenders" && <NoRecommendationNotice subject="lenders" className="mt-6" />}
          </section>
        ))}

        <section className="border-t border-[var(--color-charcoal)]/10 pt-10">
          <h2 className="font-serif text-2xl font-light mb-4">More answers</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {[
              { href: "/guides", label: "Buyer guides" },
              { href: "/guides/pricing", label: "How our pricing works" },
              { href: "/single-wide-homes", label: "Single wide homes" },
              { href: "/double-wide-homes", label: "Double wide homes" },
              { href: "/financing", label: "Lenders our customers have used" },
              { href: "/locations", label: "Delivery areas" },
            ].map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="text-[var(--color-teal)] font-semibold underline underline-offset-4">{r.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
