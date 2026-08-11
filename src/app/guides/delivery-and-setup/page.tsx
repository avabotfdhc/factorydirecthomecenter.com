import Link from "next/link";
import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import { FAQSection } from "@/components/FAQSection";
import { H2, H3 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Manufactured Home Delivery & Setup: What to Expect | Factory Direct Homes Center",
  description:
    "How manufactured and modular home delivery and setup works — from order to move-in. Timeline, site prep, delivery day, installation, and final walkthrough, explained step by step.",
  keywords: [
    "manufactured home delivery",
    "manufactured home setup process",
    "how is a manufactured home installed",
    "manufactured home delivery timeline",
    "modular home setup",
  ],
  url: "/guides/delivery-and-setup",
  type: "article",
});

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Guides", url: "/guides" },
  { name: "Delivery & Setup", url: "/guides/delivery-and-setup" },
];

const steps = [
  {
    n: "1",
    title: "Order & Build (6–8 weeks)",
    body:
      "Once you choose your floor plan and options, your home is built at the Champion factory in Topeka, IN — about 20 miles from our showroom. Factory construction is fast and weather-protected, so timelines are far more predictable than site-built.",
  },
  {
    n: "2",
    title: "Site Preparation (in parallel)",
    body:
      "While your home is being built, your site is prepared: clearing and grading, the foundation or pad, and utility connections (water, sewer or septic, and electric). You hire your own licensed contractors for this work — most buyers save money that way, and we'll share a referral list of licensed and insured contractors past customers have used.",
  },
  {
    n: "3",
    title: "Permitting & Zoning",
    body:
      "You (or your contractor) verify local zoning and pull the permits required for your county and parcel. Rural counties like DeKalb, Noble, and Whitley are generally manufactured-home friendly, and we're happy to point you to the right county offices to ask.",
  },
  {
    n: "4",
    title: "Delivery Day",
    body:
      "We arrange transport of your home from the factory to your site. A single wide arrives in one piece; a double wide arrives in two sections. Your setup contractor positions the home on the foundation and, for multi-section homes, joins the sections.",
  },
  {
    n: "5",
    title: "Setup & Installation (1–3 days)",
    body:
      "Your setup crew levels and anchors the home, connects utilities, completes the marriage line and finish work on multi-section homes, and installs skirting and steps as ordered. Timing depends on the home size and site.",
  },
  {
    n: "6",
    title: "Final Walkthrough & Move-In",
    body:
      "You walk the finished home with your contractor to confirm everything is right, and we're always available to answer questions about your warranty and care. Then it's yours — typically 8–12 weeks from order to move-in.",
  },
];

const faqs = [
  {
    question: "How long does it take to get a manufactured home delivered?",
    answer:
      "From order to move-in typically takes 8–12 weeks. Factory construction runs about 6–8 weeks, and site prep and permitting happen in parallel. Because our showroom and the Champion factory are close by, our delivery times are faster than dealers located farther away.",
  },
  {
    question: "What site work do I need before delivery?",
    answer:
      "You'll need a prepared site: cleared and graded land, a foundation or pad appropriate for your home, and utility connections for water, sewer or septic, and electric. You hire your own licensed contractors for this work — most buyers save money that way, and we'll share a referral list of licensed and insured contractors past customers have used.",
  },
  {
    question: "What happens on delivery day?",
    answer:
      "We arrange transport of your home from the factory to your site. A single wide arrives in one piece; a double wide arrives in two sections that are joined on site. Your setup contractor positions the home on the foundation, and then setup and installation begins.",
  },
  {
    question: "How long does setup take once the home arrives?",
    answer:
      "Setup and installation typically take 1–3 days, depending on the size and complexity of the home and the site. This includes leveling and anchoring, connecting utilities, finishing the marriage line on multi-section homes, and installing skirting and steps.",
  },
  {
    question: "Do you handle permits and installation, or do I?",
    answer:
      "You do — through your own licensed contractors, and that's by design: it saves most buyers money and keeps you in control of costs. We sell the home factory-direct and arrange delivery to your site. For permits, site work, and installation, ask us for our referral list of licensed and insured contractors past customers have used.",
  },
];

export default function DeliveryAndSetupPage() {
  return (
    <>
      <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      <StructuredData data={structuredData.faqPage(faqs)} />
      <StructuredData
        data={structuredData.article({
          headline: "Manufactured Home Delivery & Setup: What to Expect",
          description: "Step-by-step: how manufactured and modular home delivery and setup works, from order to move-in.",
          image: "/images/hero-home.jpg",
          datePublished: "2024-01-01",
          dateModified: new Date().toISOString(),
          author: "Factory Direct Homes Center",
          url: "/guides/delivery-and-setup",
        })}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How a Manufactured Home Is Delivered and Set Up",
          description: "The steps from ordering a manufactured or modular home to move-in.",
          totalTime: "P84D",
          step: steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.body,
          })),
        }}
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

      {/* Hero */}
      <section className="relative pt-24 pb-14 lg:pt-32 lg:pb-16 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">Buyer Guide</span>
          <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mt-4 mb-6">
            Delivery &amp; <span className="italic text-[var(--color-teal-light)]">Setup</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            From the day you order to the day you move in is typically <strong className="text-white">8–12 weeks</strong>.
            Here&rsquo;s exactly what happens at each step — factory build, site prep, permitting, delivery, installation,
            and your final walkthrough.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <H2 className="font-serif text-3xl font-light mb-8">From Order to Move-In</H2>
          <ol className="space-y-6">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-teal)] text-white font-serif text-lg font-semibold flex items-center justify-center">
                  {s.n}
                </span>
                <div>
                  <H3 className="font-serif text-xl font-semibold mb-1">{s.title}</H3>
                  <p className="text-[var(--color-gray)] leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection title="Delivery & Setup FAQs" subtitle="Timeline, site work, and installation" faqs={faqs} />

      {/* CTA */}
      <section className="py-16 bg-[var(--color-charcoal)] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-3xl font-light mb-4">Ready to Start the Clock?</H2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            Pick your floor plan and we&rsquo;ll walk you through site prep, permitting, delivery, and setup —
            factory-direct from our Auburn, Indiana showroom.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/floor-plans" className="bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-4 text-sm font-bold tracking-widest uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors">
              Browse Floor Plans
            </Link>
            <Link href="/contact-us" className="border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase rounded hover:bg-white/5 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
