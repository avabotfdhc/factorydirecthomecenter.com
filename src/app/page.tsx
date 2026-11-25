import Link from "next/link";
import { SpecsDisclaimer } from "@/components/SpecsDisclaimer";
import Image from "next/image";
import { getApiFloorPlans, getFeaturedHomes, type ApiFloorPlan } from "@/lib/api-content";
import { FeaturedHomes } from "@/components/FeaturedHomes";
import { DesignerPromo, pickDesignerExample } from "@/components/DesignerPromo";
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
import { SectionHeading } from "@/components/SectionHeading";
import { TrackedPhoneLink } from "./HomeSectionIslands";

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
  const planCount = (await getApiFloorPlans()).length;

  return (
    <>
      {/* Hero */}
      <ParallaxHeroSection />

      {/* Search: a white card lifted onto the bottom edge of the hero */}
      <section className="relative z-[2] bg-[var(--color-cream-dark)] pb-4" aria-label="Search floor plans">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 -mt-9 sm:-mt-10">
          <HomeSearchBar />
        </div>
      </section>

      {/* Featured Floor Plans */}
      <section className="py-14 lg:py-20 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            eyebrow="The collection"
            title="Featured Floor Plans"
            lede="Our factory select homes: Champion floor plans with full photo sets and, where Champion offers one, a 3D walk-through tour. Every home is built to order, ships factory direct and is quoted line by line."
            aside={
              <Link href="/floor-plans" className="lux-link">
                See every floor plan
                <span aria-hidden="true">&rarr;</span>
              </Link>
            }
          />

          <FeaturedHomes homes={featuredHomes} />

          {/* Champion's specifications disclaimer belongs with the renderings
              it qualifies. It used to sit inside the hero, laid over the
              photograph in grey — unreadable, which is the one thing a
              required notice may not be. */}
          <SpecsDisclaimer className="mt-14 max-w-3xl mx-auto text-center" />

          {/* Design Your Home, with one of the featured homes drawn as the
              example (src/components/DesignerPromo.tsx). The picture is a
              lazy, CDN-cached SVG, so it costs the homepage nothing above
              the fold. */}
          {featuredHomes.length > 0 && (
            <DesignerPromo example={pickDesignerExample(featuredHomes)} location="home_featured" heading="See any of these homes in your colors" className="mt-12" />
          )}

          <div className="text-center mt-12">
            <Link href="/floor-plans" className="lux-btn bg-[var(--color-lime)] text-white hover:bg-[var(--color-lime-dark)] transition-colors duration-300">
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
      <section className="py-16 lg:py-24 bg-white" aria-labelledby="factory-direct">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <SectionHeading
            id="factory-direct"
            eyebrow="How factory direct works"
            title="Factory Direct Mobile & Manufactured Homes"
            lede="What factory direct means when you buy from us."
          />
          <ol className="grid gap-10 md:grid-cols-3 md:gap-12">
            {FACTORY_DIRECT_STEPS.map((step, i) => (
              <li key={step.title} className="border-t border-[var(--color-charcoal)]/15 pt-6">
                <p className="flex items-baseline gap-3">
                  <span className="lux-numeral text-4xl" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--color-orange-text)]">Step {i + 1}</span>
                </p>
                <h3 className="mt-4 font-serif text-2xl font-medium leading-snug text-[var(--color-charcoal)]">{step.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--color-gray)]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Showroom invitation. Kyle's 2026-10-13 goal is more calls and lot
          visits; the lot has walk-through models, appointments preferred. */}
      <section className="lux-dark py-16 lg:py-20" aria-labelledby="visit-showroom">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row lg:items-end gap-10">
          <div className="flex-1">
            <p className="lux-eyebrow">Visit the lot</p>
            <H2 id="visit-showroom" className="lux-title mt-4">
              Walk Through Our Model Homes
            </H2>
            <p className="lux-lede mt-5 max-w-2xl">
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
              className="lux-btn bg-[var(--color-lime)] text-white hover:bg-[var(--color-lime-dark)] transition-colors"
            />
            <a
              href="tel:+12603081457"
              className="lux-btn lux-btn-quiet"
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

      <AnimatedHomeSections planCount={planCount} />

      {/* Areas we serve: the homepage is the strongest page on the site and,
          until 2026-10-13, linked none of the town pages. See
          src/lib/service-area-links.ts. */}
      <section className="py-16 lg:py-24 bg-white" aria-labelledby="areas-we-serve">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <SectionHeading
            id="areas-we-serve"
            eyebrow="Where we deliver"
            title="Manufactured & Mobile Homes Near You"
            lede="New Champion single wides and double wides for buyers across northeast Indiana, from our Auburn showroom on State Road 8."
          />
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3 border-t border-[var(--color-charcoal)]/10">
            {[...SERVICE_AREA_LINKS.filter((a) => a.href !== "/locations"), ...MORE_SERVICE_AREA_LINKS, ...SERVICE_AREA_LINKS.filter((a) => a.href === "/locations")].map((area) => (
              <li key={area.href} className="border-b border-[var(--color-charcoal)]/10">
                <Link
                  href={area.href}
                  className="group flex min-h-12 items-center justify-between gap-4 py-3 text-[0.95rem] font-medium text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors"
                >
                  <span>{area.href === "/locations" ? area.label : `Manufactured homes in ${area.label}`}</span>
                  <span aria-hidden="true" className="text-[var(--color-orange)] transition-transform group-hover:translate-x-1">&rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ Section with Schema */}
      <section className="py-16 lg:py-24 bg-[var(--color-cream-dark)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <SectionHeading
            eyebrow="Questions"
            title="Frequently Asked Questions"
            lede="Everything you need to know about buying a manufactured home in Indiana, Ohio, and Michigan."
          />

          <div className="border-t border-[var(--color-charcoal)]/15">
            {HOME_FAQS.map((faq, idx) => (
              <details key={idx} className="lux-faq group border-b border-[var(--color-charcoal)]/15">
                <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none">
                  <span className="font-serif text-xl lg:text-[1.4rem] font-medium leading-snug text-[var(--color-charcoal)] group-hover:text-[var(--color-teal)] transition-colors">{faq.q}</span>
                  <span className="lux-faq-icon shrink-0 text-2xl font-light leading-none text-[var(--color-teal)]" aria-hidden="true">+</span>
                </summary>
                <div className="pb-7 pr-10 text-[var(--color-gray)] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/guides" className="lux-link">
              View All Guides
              <span aria-hidden="true">&rarr;</span>
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

// Facts set in a quiet rail under the hero buttons. Each one is said
// elsewhere on the site already; none is a new claim.
const HERO_FACTS: [string, string][] = [
  ["Dealer", "Authorized for Champion"],
  ["Factory", "30 miles to Topeka"],
  ["Quotes", "Line by line, in writing"],
  ["Delivering", "Indiana, Ohio & Michigan"],
];

// Hero: the home edge to edge, the H1 large in the serif, and the three ways
// in (browse, book a visit, call) inside the first screen.
function ParallaxHeroSection() {
  const sale = getSaleStatus();

  return (
    <section className="lux-hero" aria-label="Hero section">
      {/* Background image — still the LCP element: preloaded, high priority */}
      <div className="lux-hero-media">
        <Image
          src="/images/hero-home.jpg"
          alt="New Champion manufactured home exterior — Factory Direct Homes Center, Auburn, Indiana"
          fill
          preload
          fetchPriority="high"
          className="object-cover object-[62%_60%]"
          sizes="100vw"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-[2] w-full px-6 lg:px-8 pt-28 pb-24 sm:pb-28">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl">
            {/* Sale badge — only while the campaign is live (src/lib/sale.ts). It
                previously hardcoded the discount and "Ends August 31", so it kept
                promoting the offer after it expired. */}
            {sale.active && (
              <Link href="/homes-on-sale" className="mb-7 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl sm:rounded-full bg-[var(--color-orange-light)] px-4 py-2 text-[0.8125rem] sm:text-sm font-semibold text-[var(--color-evergreen)] hover:bg-white transition-colors">
                <span>{sale.name}: save {saleAmount(sale)} off {saleScope(sale)}!</span>
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider opacity-80">{saleDeadlineLabel(sale)}</span>
                <svg className="hidden sm:block w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}

            <HeroCopy />

            <p className="mt-6 max-w-xl text-[1.075rem] leading-relaxed text-white/90">
              An authorized Champion Homes dealer in Auburn, Indiana. Every home is built to order at
              Champion&rsquo;s Indiana plants, quoted line by line, and shipped straight to your land.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/floor-plans" className="lux-btn bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-dark)] transition-colors">
                Browse Floor Plans
              </Link>
              <ShowroomVisitButton location="hero" className="lux-btn lux-btn-glass" />
            </div>
            <p className="mt-5 text-sm text-white/80">
              Or call{" "}
              <TrackedPhoneLink href="tel:+12603081457" location="hero" className="font-semibold text-white underline decoration-[var(--color-orange-light)] underline-offset-4 hover:decoration-2">
                (260) 308-1457
              </TrackedPhoneLink>
            </p>

            <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
              {HERO_FACTS.map(([k, v]) => (
                <div key={k} className="border-t border-white/25 pt-3">
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-orange-light)]">{k}</dt>
                  <dd className="mt-1.5 text-sm font-medium leading-snug text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
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
    <section className="py-16 lg:py-24 bg-white" aria-labelledby="options-and-upgrades">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          id="options-and-upgrades"
          eyebrow="Options & upgrades"
          title="Options, Upgrades & What the Photos Show"
          lede="Every Champion floor plan starts with a standard specification. From there you choose the options and upgrades you want. We price each one as its own line, so you see what every extra costs."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-[var(--color-cream)] rounded-[6px] p-8 lg:p-10">
            <h3 className="font-serif text-2xl font-medium mb-5">Included with every home</h3>
            <ul className="divide-y divide-[var(--color-charcoal)]/10 text-[0.95rem] text-[var(--color-gray)] leading-relaxed">
              {included.map((item) => (
                <li key={item} className="flex gap-3 py-3.5">
                  <svg className="w-5 h-5 shrink-0 mt-0.5 text-[var(--color-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[var(--color-cream)] rounded-[6px] p-8 lg:p-10">
            <h3 className="font-serif text-2xl font-medium mb-5">Popular options and upgrades</h3>
            <ul className="divide-y divide-[var(--color-charcoal)]/10 text-[0.95rem] text-[var(--color-gray)] leading-relaxed">
              {upgrades.map((item) => (
                <li key={item} className="flex gap-3 py-3.5">
                  <svg className="w-5 h-5 shrink-0 mt-0.5 text-[var(--color-orange-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-sm text-[var(--color-gray)] leading-relaxed mt-8 max-w-3xl">
          Photos and renderings on this site may show decorations, furnishings, window treatments, landscaping,
          sound and alarm systems, and other extra design features that are not part of the base price. Ask us for
          the current standards sheet for any floor plan before you order.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-10">
          <Link href="/options" className="lux-btn bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-dark)] transition-colors duration-300">
            See Options &amp; Upgrades
          </Link>
          <Link href="/design-your-home" className="lux-btn lux-btn-quiet">
            Design Your Home
          </Link>
        </div>
      </div>
    </section>
  );
}
