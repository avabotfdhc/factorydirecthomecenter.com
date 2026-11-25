import Link from "next/link";
import Image from "next/image";
import {
  FadeIn,
  StaggerContainer,
  AnimatedCounter,
  MagneticButton,
} from "@/components/VisualEffects";
import { H2, H3 } from "@/components/Heading";
import { SectionHeading } from "@/components/SectionHeading";
import { GetPricingButton, TrackedPhoneLink } from "./HomeSectionIslands";
import { REVIEWS as reviews, GOOGLE_REVIEWS_URL } from "@/lib/reviews";
import { NoRecommendationNotice } from "@/components/NoRecommendationNotice";
import { LocationMap } from "@/components/LocationMap";

const homeTypes = [
  {
    title: "Single Wide",
    subtitle: "Efficient Living",
    sqft: "500 – 1,200 sq ft",
    beds: "1–3 Bed",
    baths: "1–2 Bath",
    startingAt: "Contact for pricing",
    description: "Thoughtfully designed for smart, comfortable living. Champion\u2019s Prime and Aspire single-wides are perfect for first-time buyers, downsizers, or anyone who values quality over excess.",
    features: ["14–18 ft wide", "Up to 80 ft long", "Open floor plans"],
    image: "/images/homepage/single-wides.webp",
  },
  {
    title: "Multi-Section",
    subtitle: "Room to Breathe",
    sqft: "1,000 – 2,400 sq ft",
    beds: "3–5 Bed",
    baths: "2–3 Bath",
    startingAt: "Contact for pricing",
    description: "Spacious sectional homes that rival site-built quality. Champion\u2019s Redman and Dutch lines from the Topeka plant offer kitchen islands, big primary suites and generous layouts for growing families.",
    features: ["24–32 ft wide", "Multiple living areas", "Walk-in closets"],
    image: "/images/homepage/double-wide-exterior.webp",
  },
  {
    title: "Modular",
    subtitle: "Built to Code",
    sqft: "1,000 – 2,500+ sq ft",
    beds: "2–5 Bed",
    baths: "2+ Bath",
    startingAt: "Contact for pricing",
    description: "IRC-code Dutch modular homes placed on permanent foundations. Finished drywall and a higher roof pitch make them indistinguishable from site-built, with factory precision and pricing.",
    features: ["Permanent foundation", "IRC building codes", "Fully customizable"],
    image: "/images/homepage/feature-find-home.webp",
  },
];

// Reviews come from src/lib/reviews.ts and nowhere else. Until a real customer
// has written one we show what a buyer can verify instead of quotes they
// cannot — see the note at the top of that file.
const checkable = [
  {
    title: "An authorized Champion dealer",
    body: "Every home we sell is built by Champion Homes. Ask us for the dealer agreement, or look us up on Champion\u2019s own dealer locator.",
    href: "/champion-homes",
    cta: "About Champion",
  },
  {
    title: "Line-item pricing, in writing",
    body: "You get the home, the options, delivery and set-up broken out separately \u2014 not one bundled number \u2014 so you can take it to another dealer and compare.",
    href: "/guides/pricing",
    cta: "How pricing works",
  },
  {
    title: "A showroom you can walk into",
    body: "We are at 1211 IN-8 in Auburn, six days a week. Walk the homes, open the cabinets, and meet the person who will handle your order.",
    href: "/contact-us",
    cta: "Plan a visit",
  },
];

// Client islands for the homepage: only the sections that animate or track
// interactions hydrate. Everything else is server-rendered in app/page.tsx.
// Restyled in the 2026-11 elegant redesign: serif section titles with an
// eyebrow (SectionHeading), hairlines instead of boxed cards, one evergreen
// dark band. Every heading, sentence and link is the same as before.
export function AnimatedHomeSections({ planCount }: { planCount?: number }) {
  // The "Floor Plans" stat read a hard-coded "260+" until 2026-11-11 while the
  // sale page said 147 and the catalogue held ~215: three answers to "how many
  // homes do they sell", which is exactly the kind of fact an answer engine
  // repeats. It is counted from the live catalogue now and rounded down to the
  // ten; a degraded read (under 120, see sitemap-catalogue.ts) falls back to
  // the price sheet's 147 models, rounded the same way.
  const shownPlans = planCount && planCount >= 120 ? Math.floor(planCount / 10) * 10 : 140;
  // Which home type's pricing modal is open ("" = none).

  return (
    <>
      {/* Why Factory Direct */}
      <section className="py-16 lg:py-24 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why buy from us"
            title="Why Choose Factory Direct?"
            lede={<>We&rsquo;re a family-owned dealer. We believe everyone deserves a quality home at an honest price.</>}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
            {[
              { title: "Champion's Indiana Plants", desc: "Aspire, Redman and Dutch series homes are built at Champion's plant in Topeka, IN, 30 miles from our showroom; Prime at its plant in Decatur, IN.", icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { title: "Factory-Direct Pricing", desc: "We order straight from Champion's Indiana plants, with Topeka 30 miles away — shorter delivery, lower freight, and line-item transparency on every quote.", icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" },
              { title: "You Stay in Control", desc: "We sell the home and arrange delivery. You hire your own contractors for site work and setup. Most buyers save money this way. We’ll share a list of licensed and insured contractors past customers have used.", icon: "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" },
              { title: "Tri-State Delivery", desc: "Serving Indiana, Michigan, and Ohio. Proximity to Champion’s plant means faster delivery and lower costs.", icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" },
            ].map((item) => (
              <div key={item.title} className="border-t border-[var(--color-charcoal)]/15 pt-6">
                <svg className="w-7 h-7 text-[var(--color-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25} aria-hidden="true" focusable="false">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <H3 className="mt-5 font-serif text-2xl font-medium leading-snug mb-3">{item.title}</H3>
                <p className="text-[0.95rem] text-[var(--color-gray)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Home Types */}
      <section className="lux-dark py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            eyebrow="Find your fit"
            title="Browse by Home Type"
            aside={
              <Link href="/floor-plans" className="lux-link">
                All floor plans
                <span aria-hidden="true">&rarr;</span>
              </Link>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
            {homeTypes.map((home) => (
              <div key={home.title} className="group flex flex-col">
                <figure className="aspect-[4/3] relative overflow-hidden rounded-[4px]">
                  <Image
                    src={home.image}
                    alt={`${home.title === "Modular" ? "Modular home" : `${home.title} manufactured home`} - ${home.sqft}, ${home.beds}, ${home.baths}`}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <figcaption className="sr-only">{home.title} - {home.description}</figcaption>
                </figure>
                <div className="pt-7 pb-5 border-b border-white/15">
                  <span className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[var(--color-orange-light)]">{home.subtitle}</span>
                  <H3 className="font-serif text-4xl font-medium mt-2 mb-4 text-white">{home.title}</H3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs tracking-wider uppercase text-white/80">
                    <span>{home.sqft}</span>
                    <span className="text-white/35" aria-hidden="true">/</span>
                    <span>{home.beds}</span>
                    <span className="text-white/35" aria-hidden="true">/</span>
                    <span>{home.baths}</span>
                  </div>
                </div>
                <div className="pt-5 flex flex-col flex-1">
                  <p className="text-[0.95rem] text-white/80 leading-relaxed mb-5">{home.description}</p>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2 mb-8" aria-label={`${home.title} features`}>
                    {home.features.map((f) => (
                      <li key={f} className="inline-flex items-center gap-1.5 text-white/85 text-sm">
                        <svg className="w-3.5 h-3.5 text-[var(--color-lime-on-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center gap-5">
                    <GetPricingButton
                      modelName={`${home.title} home`}
                      className="lux-btn bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-dark)] transition-colors"
                    />
                    <Link href="/floor-plans" className="lux-link min-h-11">
                      Explore
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats with Animated Counters */}
      <section className="py-14 lg:py-16 bg-white border-b border-[var(--color-charcoal)]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer staggerDelay={150} className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 text-center lg:divide-x lg:divide-[var(--color-charcoal)]/10">
            <FadeIn direction="up" delay={0}>
              <div className="lux-numeral text-5xl lg:text-6xl">
                <AnimatedCounter end={shownPlans} suffix="+" />
              </div>
              <div className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--color-gray)] mt-3">Floor Plans</div>
            </FadeIn>
            <FadeIn direction="up" delay={150}>
              <div className="lux-numeral text-5xl lg:text-6xl">30mi</div>
              <div className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--color-gray)] mt-3">From the Factory</div>
            </FadeIn>
            <FadeIn direction="up" delay={300}>
              <div className="lux-numeral text-5xl lg:text-6xl">
                <AnimatedCounter end={3} />
              </div>
              <div className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--color-gray)] mt-3">States Served</div>
            </FadeIn>
            <FadeIn direction="up" delay={450}>
              <div className="lux-numeral text-5xl lg:text-6xl">Line-Item</div>
              <div className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--color-gray)] mt-3">Quotes on Every Home</div>
            </FadeIn>
          </StaggerContainer>
        </div>
      </section>

      {/* What a buyer can verify. Real reviews replace this block the moment
          src/lib/reviews.ts has any — see REVIEWS there. */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow={reviews.length > 0 ? "Reviews" : "Check us out"}
              title={reviews.length > 0 ? "What Our Homeowners Say" : "Don’t Take Our Word For It"}
              lede={
                reviews.length === 0
                  ? "We opened in November 2024, so our review history is still short. Rather than fill this space with quotes you cannot check, here is what you can verify yourself before you ever put money down."
                  : undefined
              }
            />
          </FadeIn>

          {reviews.length > 0 ? (
            <StaggerContainer staggerDelay={200} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((t, idx) => (
                <FadeIn key={`${t.name}-${t.date}`} direction="up" delay={idx * 200}>
                  <div className="relative bg-white rounded-[6px] border border-[var(--color-charcoal)]/10 p-8">
                    <div className="mb-3">
                      <Image src="/images/homepage/quote.svg" alt="" width={24} height={24} className="opacity-20" />
                    </div>
                    <div className="flex gap-1 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                      {Array.from({ length: t.rating }, (_, i) => (
                        <svg key={i} className="w-4 h-4 text-[var(--color-orange)]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote>
                      <p className="font-serif text-xl leading-relaxed text-[var(--color-charcoal)] mb-5">&ldquo;{t.quote}&rdquo;</p>
                      <footer className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--color-teal)]/10 flex items-center justify-center text-[var(--color-teal)] font-bold text-sm">
                          {t.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{t.name}</div>
                          <div className="text-xs text-[var(--color-gray)]">
                            {t.location ? `${t.location} · ` : ""}
                            {new Date(t.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                          </div>
                        </div>
                      </footer>
                    </blockquote>
                  </div>
                </FadeIn>
              ))}
            </StaggerContainer>
          ) : (
            <StaggerContainer staggerDelay={200} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {checkable.map((c, idx) => (
                <FadeIn key={c.title} direction="up" delay={idx * 200}>
                  <div className="h-full bg-white rounded-[6px] border border-[var(--color-charcoal)]/10 p-8 lg:p-10 flex flex-col">
                    <H3 className="font-serif text-2xl font-medium leading-snug mb-3">{c.title}</H3>
                    <p className="text-[0.95rem] leading-relaxed text-[var(--color-gray)] mb-6">{c.body}</p>
                    <Link href={c.href} className="lux-link mt-auto self-start">
                      {c.cta} <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </FadeIn>
              ))}
            </StaggerContainer>
          )}

          <FadeIn direction="up">
            <p className="mt-10">
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-teal-dark)] hover:underline underline-offset-4"
              >
                <svg className="w-4 h-4 text-[var(--color-orange)]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {reviews.length > 0
                  ? "Read every review on Google →"
                  : "Read our Google listing — and leave a review if we have worked together →"}
              </a>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Financing CTA */}
      <section className="py-16 lg:py-24 bg-[var(--color-cream-dark)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <Image
            src="/images/homepage/about-2.webp"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeading
            align="center"
            eyebrow="Financing"
            title="Affordable Financing Options"
            lede={
              <>
                Chattel loans and land-home financing are both common for manufactured homes.
                We are not a lender and make no recommendation &mdash; you choose your own, from a list of lenders our customers have used.
              </>
            }
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <MagneticButton>
              <Link
                href="/financing"
                className="lux-btn bg-[var(--color-lime)] text-white hover:bg-[var(--color-lime-dark)] transition-colors duration-300"
              >
                Explore Financing
              </Link>
            </MagneticButton>
            <MagneticButton>
              <TrackedPhoneLink
                href="tel:+12603081457"
                location="financing_cta"
                className="lux-btn lux-btn-quiet"
              >
                Call Us
              </TrackedPhoneLink>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="lux-eyebrow">Showroom</p>
              <H2 className="lux-title mt-4">
                Visit Our Auburn Location
              </H2>
              <p className="lux-lede mt-5 mb-8">
                See our model homes in person. Walk through floor plans, explore customization
                options, and talk with our team about making your dream home a reality.
              </p>
              <address className="not-italic mb-8 border-t border-[var(--color-charcoal)]/15 pt-5 space-y-2">
                <p className="font-serif text-2xl font-medium">1211 IN-8, Auburn, IN 46706</p>
                <p className="text-sm text-[var(--color-gray)]">Mon–Fri: 9 AM – 5 PM &nbsp;|&nbsp; Sat: 10 AM – 4 PM</p>
              </address>
              <div className="flex flex-col sm:flex-row gap-3">
                <MagneticButton>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=1211+IN-8+Auburn+IN+46706"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lux-btn bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
                  >
                    Get Directions
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <Link
                    href="/contact-us"
                    className="lux-btn lux-btn-quiet"
                  >
                    Contact Us
                  </Link>
                </MagneticButton>
              </div>
            </div>

            <div className="aspect-square lg:aspect-[4/3] bg-gray-100 rounded-[6px] border border-[var(--color-charcoal)]/10 overflow-hidden">
              <LocationMap title="Factory Direct Homes Center location on Google Maps" className="h-full w-full" />
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

// Line icons for the trust strip. They replaced emoji, which render
// differently on every platform and read as casual next to the serif.
const TRUST_ICONS: Record<string, string> = {
  award: "M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0",
  pin: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
  shield: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  truck: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
};

export function TrustAndProcess() {
  return (
    <>
      {/* Trust Badges Section */}
      <section className="py-12 bg-white border-y border-[var(--color-charcoal)]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer staggerDelay={100} className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[
              { icon: "award", label: "Champion Authorized" },
              { icon: "pin", label: "Auburn Showroom" },
              { icon: "shield", label: "Full Warranty" },
              { icon: "truck", label: "30 Miles From Topeka" },
            ].map((b, idx) => (
              <FadeIn key={b.label} direction="up" delay={idx * 100}>
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-3 text-[var(--color-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25} aria-hidden="true" focusable="false">
                    <path strokeLinecap="round" strokeLinejoin="round" d={TRUST_ICONS[b.icon]} />
                  </svg>
                  <div className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-charcoal)]">{b.label}</div>
                </div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="py-16 lg:py-24 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <SectionHeading
              eyebrow="The process"
              title="How It Works"
              lede="From browsing to move-in, we make the process simple and transparent"
            />
          </FadeIn>

          <StaggerContainer staggerDelay={200} className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            {[
              { step: "1", title: "Browse", desc: "Explore floor plans online or visit our showroom" },
              { step: "2", title: "Customize", desc: "Choose your options and get a detailed quote" },
              { step: "3", title: "Finance", desc: "Choose your own lender from a list our customers have used" },
              { step: "4", title: "Build & Deliver", desc: "Your home is built and delivered in 8-12 weeks" },
            ].map((item, idx) => (
              <FadeIn key={item.step} direction="up" delay={idx * 200}>
                <div className="border-t border-[var(--color-charcoal)]/15 pt-6">
                  <div className="lux-numeral text-5xl">{item.step.padStart(2, "0")}</div>
                  <H3 className="mt-4 font-serif text-2xl font-medium mb-2">{item.title}</H3>
                  <p className="text-[0.95rem] text-[var(--color-gray)] leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>


      {/* The contractor list is information, never a recommendation — see src/lib/referrals.ts */}
      <section className="pb-16 px-6 lg:px-8 bg-[var(--color-cream-dark)]">
        <div className="max-w-4xl mx-auto">
          <NoRecommendationNotice subject="contractors" />
        </div>
      </section>
    </>
  );
}
