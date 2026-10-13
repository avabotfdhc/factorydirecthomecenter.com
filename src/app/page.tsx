import Link from "next/link";
import { SpecsDisclaimer } from "@/components/SpecsDisclaimer";
import Image from "next/image";
import { getFeaturedHomes, type ApiFloorPlan } from "@/lib/api-content";
import { FeaturedHomes } from "@/components/FeaturedHomes";
import { HomeSearchBar } from "@/components/HomeSearchBar";
import { H2 } from "@/components/Heading";
import { AnimatedHomeSections, TrustAndProcess } from "./HomeSections";
import { getSaleStatus, saleAmount, saleDeadlineLabel, saleScope } from "@/lib/sale";
import { FaqJsonLd, type FaqItem } from "@/components/JsonLd";
import { HeroCopy } from "@/components/HeroCopy";
import { HomeVideo } from "@/components/HomeVideo";
import { OwnerIntro } from "@/components/OwnerIntro";
import type { Metadata } from "next";
import { jsonLdScript } from "@/lib/json-ld";
import { businessRef } from "@/lib/business";
import { MORE_SERVICE_AREA_LINKS, SERVICE_AREA_LINKS } from "@/lib/service-area-links";
import { FACTORY_DIRECT_FAQ, FACTORY_DIRECT_STEPS } from "@/lib/factory-direct";
import { ShowroomVisitButton } from "@/components/QuoteModal";

// Server-rendered homepage: everything static (hero, search, featured cards,
// FAQ, schema) ships as HTML with zero hydration cost; only the animated
// middle sections and trust/process strips are client islands. Featured homes
// are fetched here (ISR) so the LCP-candidate cards are in the initial HTML.
export const revalidate = 300;

// Homepage <title> and meta description, declared here as well as in the root
// layout so the landing page always emits its own tags (Semrush's Site Audit
// flagged them missing on 2026-08-20; see `htmlLimitedBots` in next.config.ts
// for the crawler-side cause). `absolute` skips the layout's "%s | …" template.
export const metadata: Metadata = {
  title: { absolute: "Factory Direct Homes Center | Manufactured Homes in Auburn, IN" },
  description:
    "Factory-direct Champion mobile & manufactured homes: an authorized dealer orders yours from Champion’s Indiana plants and it ships straight to your land.",
  keywords: [
    "factory direct homes",
    "factory direct mobile homes",
    "factory select homes",
    "modular homes direct",
    "modular homes Indiana",
    "mobile homes for sale direct from factory",
    "Champion homes Auburn Indiana",
  ],
  alternates: {
    canonical: "/",
  },
};

// Homepage FAQs: rendered as the accordion AND emitted as FAQPage JSON-LD.
const HOME_FAQS: FaqItem[] = [
              {
                q: "What is the difference between manufactured and modular homes?",
                a: "Manufactured homes are built to federal HUD standards on a permanent chassis. That makes them more affordable and faster to deliver. Modular homes are built to state IRC codes, the same codes as site-built homes. They sit on permanent foundations and qualify for conventional mortgages. Both are built in a factory with quality control that exceeds site-built construction."
              },
              FACTORY_DIRECT_FAQ,
              {
                q: "How much does a manufactured home cost in Indiana?",
                a: "Pricing depends on the size, series, and options you choose. Factory Direct quotes every home line by line: the home, each option, and delivery are priced separately, with no hidden markups. Buying factory direct keeps these among the most affordable new homes in Indiana. Call (260) 308-1457 or request a quote online for current pricing on any floor plan."
              },
              {
                q: "Do you offer financing for manufactured homes?",
                a: "No. We are not a lender, we do not arrange or broker financing, and we do not pull credit. You choose your own lender. What we hand you is the list of lenders our customers have used before, with no recommendation attached — chattel loans for home-only purchases, land-home packages and conventional mortgages are all routes buyers take. Cash buyers receive preferred pricing discounts."
              },
              {
                q: "How long does it take to get a manufactured home delivered?",
                a: "From order to move-in usually takes 8 to 12 weeks. The home is built in 6 to 8 weeks at a Champion factory in Indiana: Topeka, just 30 miles away, for Aspire and Redman, or Decatur for Prime. Site preparation and permits add 2 to 4 weeks. Because we are close to the factory, our delivery times beat dealers located farther away."
              },
              {
                q: "Can I put a manufactured home on my own land?",
                a: "Yes. Manufactured homes can go on private land in most areas of Indiana, Ohio, and Michigan. Rural counties like Noble, DeKalb, and Whitley have zoning-friendly rules. You or your contractor confirms the zoning for your parcel and pulls the permits; we can tell you which office to call."
              },
              {
                q: "What areas do you serve?",
                a: "We sell and arrange delivery of manufactured and modular homes throughout Indiana, Ohio, and Michigan, from our Auburn, Indiana showroom 30 miles from Champion's Topeka plant. Most of our buyers are in northeast Indiana: Auburn, Garrett, Fort Wayne, Kendallville, Angola, Columbia City, Warsaw, Goshen and the towns around them."
              },
              {
                q: "Is a manufactured home the same as a mobile home?",
                a: "Mostly, yes. \u201cMobile home\u201d is the everyday name, and most people still search for it that way. Strictly, \u201cmobile home\u201d means a home built before June 15, 1976, when the federal HUD code took effect. Every home built since then to that code is a \u201cmanufactured home\u201d. The new single wides and double wides we sell are HUD-code manufactured homes, so if you are shopping for a new mobile home, this is it. We also sell modular homes, which are built to the state building code instead."
              },
              {
                q: "Do manufactured homes hold their value?",
                a: "Modern manufactured homes built to HUD or IRC codes hold value well, especially on a permanent foundation. Modular homes appreciate much like site-built homes. Location, foundation type, and home quality matter most. Champion homes come with comprehensive warranties."
              },
              {
                q: "What is included in the price of a manufactured home?",
                a: "Our quote lists the home, each factory option, and delivery as separate lines, so you can see what every item costs. Site work, the foundation, and setup are not part of our price: you hire and pay your own licensed contractors for those, and our pricing guide lists typical contractor ranges so you can budget for them."
              }
            ];

export default async function Home() {
  const featuredHomes: ApiFloorPlan[] = await getFeaturedHomes();

  return (
    <>
      {/* Hero */}
      <ParallaxHeroSection />

      {/* Search Bar - Separate from hero */}
      <section className="bg-[var(--color-teal)] py-4">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <HomeSearchBar />
        </div>
      </section>

      {/* Featured Floor Plans */}
      <section className="py-12 lg:py-16 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <H2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              Featured Floor Plans
            </H2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
            <p className="text-base text-[var(--color-gray)] mt-4 max-w-2xl mx-auto">
              These are our factory select homes: Champion floor plans we hand-pick from the Topeka plant for
              layout, value, and popularity with Indiana buyers. Every home ships factory direct with line-item pricing.
            </p>
          </div>

          <FeaturedHomes homes={featuredHomes} />

          {/* Champion's specifications disclaimer belongs with the renderings
              it qualifies. It used to sit inside the hero, laid over the
              photograph in grey — unreadable, which is the one thing a
              required notice may not be. */}
          <SpecsDisclaimer className="mt-14 max-w-3xl mx-auto text-center" />

          <div className="text-center mt-10">
            <Link href="/floor-plans" className="btn-primary inline-flex items-center gap-2 bg-[var(--color-lime)] text-white px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors duration-300">
              View All Floor Plans
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* What "factory direct" means here. Champion sells only to dealers, so
          the honest version is: we are the dealer, we buy the home from
          Champion for the buyer, and it ships straight from the plant to their
          land. Wording lives in src/lib/factory-direct.ts. */}
      <section className="py-16 lg:py-20 bg-white" aria-labelledby="factory-direct">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <H2 id="factory-direct" className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              Factory Direct Mobile &amp; Manufactured Homes
            </H2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
            <p className="text-base text-[var(--color-gray)] mt-4 max-w-2xl mx-auto">
              What factory direct means when you buy from us.
            </p>
          </div>
          <ol className="grid gap-6 md:grid-cols-3">
            {FACTORY_DIRECT_STEPS.map((step, i) => (
              <li key={step.title} className="rounded border border-[var(--color-charcoal)]/10 bg-[var(--color-cream)] p-6">
                <p className="text-sm font-bold text-[var(--color-teal)]">Step {i + 1}</p>
                <h3 className="mt-1 text-lg font-bold text-[var(--color-charcoal)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-charcoal)]/80">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Showroom invitation. Kyle's 2026-10-13 goal is more calls and lot
          visits; the lot has walk-through models, appointments preferred. */}
      <section className="py-14 bg-[var(--color-charcoal)] text-white" aria-labelledby="visit-showroom">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex-1">
            <H2 id="visit-showroom" className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3 text-white">
              Walk Through Our Model Homes
            </H2>
            <p className="text-white/80 leading-relaxed max-w-2xl">
              See Champion homes in person on our Auburn lot, just off I-69 at State Road 8. Book a time so
              someone is free to show you around.{" "}
              <Link href="/showroom" className="underline underline-offset-4 text-white">
                Hours &amp; directions
              </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <ShowroomVisitButton
              location="homepage_band"
              className="inline-flex items-center justify-center bg-[var(--color-lime)] text-white px-8 py-4 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-lime-dark)] transition-colors"
            />
            <a
              href="tel:+12603081457"
              className="inline-flex items-center justify-center border-2 border-white/40 px-8 py-4 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-white/10 transition-colors"
            >
              Call (260) 308-1457
            </a>
          </div>
        </div>
      </section>

      {/* Video tour — renders only once a video is configured (src/lib/home-video.ts) */}
      <HomeVideo />

      {/* Options & upgrades: what a base price includes vs. what the photos show */}
      <OptionsAndUpgradesSection />

      <AnimatedHomeSections />

      {/* Areas we serve: the homepage is the strongest page on the site and,
          until 2026-10-13, linked none of the town pages. See
          src/lib/service-area-links.ts. */}
      <section className="py-16 lg:py-20 bg-white" aria-labelledby="areas-we-serve">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <H2 id="areas-we-serve" className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
            Manufactured &amp; Mobile Homes Near You
          </H2>
          <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
          <p className="text-base text-[var(--color-gray)] mt-4 max-w-2xl mx-auto">
            New Champion single wides and double wides for buyers across northeast Indiana, from our Auburn showroom on State Road 8.
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {[...SERVICE_AREA_LINKS.filter((a) => a.href !== "/locations"), ...MORE_SERVICE_AREA_LINKS, ...SERVICE_AREA_LINKS.filter((a) => a.href === "/locations")].map((area) => (
              <li key={area.href}>
                <Link
                  href={area.href}
                  className="inline-flex min-h-11 items-center rounded border border-[var(--color-charcoal)]/15 px-4 text-sm font-semibold text-[var(--color-teal)] hover:bg-[var(--color-cream)] transition-colors"
                >
                  {area.href === "/locations" ? area.label : `Manufactured homes in ${area.label}`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ Section with Schema */}
      <section className="py-20 lg:py-28 bg-[var(--color-cream-dark)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <H2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              Frequently Asked Questions
            </H2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
            <p className="text-base text-[var(--color-gray)] mt-4 max-w-2xl mx-auto">
              Everything you need to know about buying a manufactured home in Indiana, Ohio, and Michigan.
            </p>
          </div>

          <div className="space-y-4">
            {HOME_FAQS.map((faq, idx) => (
              <details key={idx} className="bg-white rounded-lg border border-[var(--color-charcoal)]/5 overflow-hidden group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-[var(--color-cream)] transition-colors">
                  <span className="font-semibold text-[var(--color-charcoal)] pr-8">{faq.q}</span>
                  <span className="text-[var(--color-teal)] text-xl transition-transform group-open:rotate-180">+</span>
                </summary>
                <div className="px-6 pb-6 text-[var(--color-gray)] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/guides" className="inline-flex items-center gap-2 text-[var(--color-teal)] font-semibold hover:underline">
              View All Guides
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <FaqJsonLd faqs={HOME_FAQS} />

      {/* LocalBusiness schema comes from the root layout (structuredData.localBusiness) — not duplicated here */}

      {/* ImageObject Schema for Hero */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // `author` used to be a hand-written Organization stub carrying our
          // name and no @id — a second business node beside the canonical one,
          // which is exactly what businessRef() exists to prevent.
          __html: jsonLdScript({
            "@context": "https://schema.org",
            "@type": "ImageObject",
            "contentUrl": "https://factorydirecthomescenter.com/images/hero-home.jpg",
            "name": "Modern Manufactured Home Exterior",
            "description": "New manufactured home with cream siding, teal trim, green shutters and a wooden front porch on a rural lot",
            "width": 1920,
            "height": 1071,
            "author": businessRef()
          })
        }}
      />

      <OwnerIntro />

      <TrustAndProcess />
    </>
  );
}

// Parallax Hero Section Component
function ParallaxHeroSection() {
  const sale = getSaleStatus();

  return (
    <section className="relative min-h-[320px] sm:min-h-[360px] lg:min-h-[420px]" aria-label="Hero section">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-home.jpg"
          alt="New Champion manufactured home exterior — Factory Direct Homes Center, Auburn, Indiana"
          fill
          preload
          fetchPriority="high"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-charcoal)]/80 to-[var(--color-charcoal)]/40" />
      </div>

      {/* Hero Content */}
      <div className="relative min-h-[320px] sm:min-h-[360px] lg:min-h-[420px] flex flex-col justify-center px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Sale badge — only while the campaign is live (src/lib/sale.ts). It
              previously hardcoded the discount and "Ends August 31", so it kept
              promoting the offer after it expired. */}
          {sale.active && (
            <Link href="/homes-on-sale" className="inline-flex items-center gap-2 bg-[var(--color-lime)] text-white px-4 py-2 rounded-full text-sm font-bold mb-4 hover:bg-[var(--color-lime-dark)] transition-colors">
              <span aria-hidden="true">🎉</span>
              <span>{sale.name}: save {saleAmount(sale)} off {saleScope(sale)}!</span>
              <span className="hidden sm:inline text-xs bg-white/30 px-2 py-0.5 rounded-full">{saleDeadlineLabel(sale)}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
          
          <HeroCopy />
        </div>
      </div>
    </section>
  );
}

// Options, upgrades and photo disclosure. Server-rendered plain text: buyers
// ask what the base price covers, and Champion's own literature spells out
// that photos can show extras (decor, landscaping, window treatments, alarm
// systems, furnishings) that are not included. Links to the options catalogue
// and the configurator.
function OptionsAndUpgradesSection() {
  const included = [
    "Published floor plans, square footages, and elevations for every Champion series",
    "Standard features listed on each model's factory sales sheet",
    "Delivery from the Topeka, Indiana factory, priced as its own line",
  ];
  const upgrades = [
    "Floor coverings, wall coverings, and cabinet and countertop selections",
    "Specialty light fixtures, custom paint colors, and interior design features",
    "Appliances, exterior elevations, dormers, and window packages",
  ];

  return (
    <section className="py-20 lg:py-28 bg-white" aria-labelledby="options-and-upgrades">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <H2 id="options-and-upgrades" className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
            Options, Upgrades &amp; What the Photos Show
          </H2>
          <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto mb-6" />
          <p className="text-base text-[var(--color-gray)] max-w-2xl mx-auto">
            Every Champion floor plan starts with a standard specification. From there you choose the options and
            upgrades you want. We price each one as its own line, so you see what every extra costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[var(--color-cream)] rounded-lg p-8 border border-[var(--color-charcoal)]/5">
            <h3 className="font-semibold text-lg mb-4">Included with every home</h3>
            <ul className="space-y-3 text-sm text-[var(--color-gray)] leading-relaxed">
              {included.map((item) => (
                <li key={item} className="flex gap-3">
                  <svg className="w-5 h-5 shrink-0 text-[var(--color-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[var(--color-cream)] rounded-lg p-8 border border-[var(--color-charcoal)]/5">
            <h3 className="font-semibold text-lg mb-4">Popular options and upgrades</h3>
            <ul className="space-y-3 text-sm text-[var(--color-gray)] leading-relaxed">
              {upgrades.map((item) => (
                <li key={item} className="flex gap-3">
                  <svg className="w-5 h-5 shrink-0 text-[var(--color-lime-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-sm text-[var(--color-gray)] leading-relaxed mt-8 max-w-3xl mx-auto text-center">
          Photos and renderings on this site may show decorations, furnishings, window treatments, landscaping,
          sound and alarm systems, and other extra design features that are not part of the base price. Ask us for
          the current standards sheet for any floor plan before you order.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link href="/options" className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-teal-dark)] transition-colors duration-300">
            See Options &amp; Upgrades
          </Link>
          <Link href="/design-your-home" className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-charcoal)]/5 transition-colors duration-300">
            Design Your Home
          </Link>
        </div>
      </div>
    </section>
  );
}
