import Link from "next/link";
import Image from "next/image";
import { FAQSection } from "@/components/FAQSection";
import { StructuredData, structuredData, generateMetadata as genMeta } from "@/lib/seo";
import { FadeIn, StaggerContainer, AnimatedCounter } from "@/components/VisualEffects";
import { H2, H3 } from "@/components/Heading";

// ============================================
// AUBURN, IN — FLAGSHIP LOCAL SEO PAGE
// ============================================
// This is the home-turf page (our physical showroom is in Auburn, DeKalb County).
// Strongest LocalBusiness signal on the site: exact NAP + Auburn geo + local FAQ.
// ============================================

export const metadata = genMeta({
  title: "Manufactured & Modular Homes in Auburn, IN | Factory Direct Homes Center",
  description:
    "Champion manufactured and modular homes in Auburn, Indiana. Visit our DeKalb County showroom at 1211 State Road 8 — factory-direct pricing, single wides, double wides & modular homes. Serving Auburn, Garrett, Waterloo, Butler & Fort Wayne.",
  keywords: [
    "manufactured homes auburn indiana",
    "modular homes auburn in",
    "mobile homes auburn indiana",
    "manufactured homes dekalb county",
    "champion homes auburn in",
    "mobile home dealer auburn indiana",
    "manufactured homes near fort wayne",
  ],
  url: "/locations/auburn",
});

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Locations", url: "/locations" },
  { name: "Auburn, IN", url: "/locations/auburn" },
];

const locationFAQs = [
  {
    question: "Where is Factory Direct Homes Center located in Auburn?",
    answer:
      "Our showroom is at 1211 State Road 8, Auburn, IN 46706, in DeKalb County — about 25 minutes north of Fort Wayne and just 20 miles from the Champion factory in Topeka. Stop by to walk through model homes or call (260) 308-1457.",
  },
  {
    question: "Can I visit a showroom to see manufactured homes in Auburn?",
    answer:
      "Yes. You can tour model homes at our Auburn showroom before you buy. Seeing the quality, layouts, and finishes in person is the best way to choose your floor plan. Call ahead at (260) 308-1457 so we can have a specialist ready to help.",
  },
  {
    question: "What towns near Auburn do you serve?",
    answer:
      "From our Auburn location we serve all of DeKalb County and the surrounding area, including Garrett, Waterloo, Butler, St. Joe, Corunna, Ashley, Hamilton, Spencerville, Kendallville, and the greater Fort Wayne region.",
  },
  {
    question: "Can I put a manufactured home on my own land in DeKalb County?",
    answer:
      "Yes. Manufactured and modular homes can be placed on private land in most of DeKalb County and surrounding rural areas. You or your contractor verify zoning and setback requirements for your specific parcel and pull the permits — and because we're local, we can point you to the right DeKalb County offices.",
  },
  {
    question: "How much does home delivery cost in the Auburn area?",
    answer:
      "Because our showroom and the Champion factory are both nearby, Auburn-area delivery costs are among the lowest in our service region. Exact delivery costs depend on your site and distance — we provide clear, line-item pricing with your quote. Setup costs are separate and paid to the contractor you hire.",
  },
  {
    question: "How far is your showroom from the Champion factory?",
    answer:
      "About 20 miles. The Champion plant in Topeka, Indiana is the largest Champion factory in the country, and being this close means shorter delivery times and lower freight costs passed directly to you.",
  },
];

export default function AuburnLocationPage() {
  return (
    <>
      {/* ===== STRUCTURED DATA ===== */}
      <StructuredData
        data={{
          ...structuredData.localBusiness(),
          areaServed: {
            "@type": "City",
            name: "Auburn",
            containedInPlace: { "@type": "AdministrativeArea", name: "DeKalb County, Indiana" },
          },
          hasMap: "https://maps.google.com/?q=1211+State+Road+8+Auburn+IN+46706",
          serviceArea: {
            "@type": "GeoCircle",
            geoMidpoint: { "@type": "GeoCoordinates", latitude: 41.3675, longitude: -85.0586 },
            geoRadius: "50 miles",
          },
        }}
      />
      <StructuredData data={structuredData.website()} />
      <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      <StructuredData
        data={structuredData.article({
          headline: "Manufactured & Modular Homes in Auburn, IN",
          description:
            "Champion manufactured and modular homes at our Auburn, DeKalb County showroom. Factory-direct pricing, local service.",
          image: "/images/hero-home.jpg",
          datePublished: "2024-01-01",
          dateModified: new Date().toISOString(),
          author: "Factory Direct Homes Center",
          url: "/locations/auburn",
        })}
      />
      <StructuredData
        data={structuredData.service({
          name: "Manufactured Home Sales & Delivery — Auburn, IN",
          description:
            "Factory-direct manufactured and modular home sales with delivery to Auburn and DeKalb County, Indiana.",
          provider: "Factory Direct Homes Center",
          areaServed: "Auburn, Indiana",
        })}
      />
      <StructuredData data={structuredData.faqPage(locationFAQs)} />

      {/* ===== BREADCRUMB ===== */}
      <nav aria-label="Breadcrumb" className="bg-[var(--color-cream-dark)] py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm text-[var(--color-gray)]">
            {breadcrumbs.map((crumb, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {idx > 0 && <span>/</span>}
                <Link
                  href={crumb.url}
                  className={idx === breadcrumbs.length - 1 ? "font-semibold text-[var(--color-charcoal)]" : "hover:text-[var(--color-teal)]"}
                >
                  {crumb.name}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-home.jpg"
            alt="Manufactured and modular homes at the Factory Direct Homes Center showroom in Auburn, Indiana"
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            preload
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/80 via-[var(--color-charcoal)]/60 to-[var(--color-charcoal)]/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="decorative-line" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                  Auburn · DeKalb County, Indiana
                </span>
              </div>
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
                Manufactured &amp; Modular Homes in{" "}
                <span className="italic text-[var(--color-teal-light)]">Auburn, IN</span>
              </h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-xl mb-8">
                Our showroom is right here in Auburn, at 1211 State Road 8. Walk through Champion
                single wides, double wides, and modular homes, then buy factory-direct — just 20
                miles from the Champion factory in Topeka.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/floor-plans"
                  className="btn-primary inline-flex items-center justify-center bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-lime-dark)] transition-colors duration-300"
                >
                  Browse Floor Plans
                </Link>
                <a
                  href="tel:+12603081457"
                  className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300"
                >
                  Call (260) 308-1457
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== INFO BAR ===== */}
      <section className="py-8 bg-[var(--color-teal)] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer staggerDelay={150} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <FadeIn direction="up" delay={0}>
              <div className="font-serif text-3xl font-bold">Auburn</div>
              <div className="text-sm text-white/70">Our Showroom</div>
            </FadeIn>
            <FadeIn direction="up" delay={150}>
              <div className="font-serif text-3xl font-bold"><AnimatedCounter end={20} suffix=" mi" /></div>
              <div className="text-sm text-white/70">From the Factory</div>
            </FadeIn>
            <FadeIn direction="up" delay={300}>
              <div className="font-serif text-3xl font-bold"><AnimatedCounter end={8} suffix="-12" /></div>
              <div className="text-sm text-white/70">Weeks Delivery</div>
            </FadeIn>
            <FadeIn direction="up" delay={450}>
              <div className="font-serif text-3xl font-bold"><AnimatedCounter end={25} suffix=" min" /></div>
              <div className="text-sm text-white/70">North of Fort Wayne</div>
            </FadeIn>
          </StaggerContainer>
        </div>
      </section>

      {/* ===== LOCAL CONTENT ===== */}
      <section className="py-16 lg:py-20 bg-white border-b border-[var(--color-charcoal)]/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <H2 className="font-serif text-3xl font-light mb-4">Your Local Manufactured Home Dealer in Auburn</H2>
            <p className="text-[var(--color-gray)] leading-relaxed mb-4">
              Factory Direct Homes Center is based right in Auburn, Indiana — the county seat of DeKalb
              County. Unlike online-only sellers or dealers located hours away, we&rsquo;re local: you can
              visit our showroom at 1211 State Road 8, walk through real Champion homes, and work
              face-to-face with a team that knows DeKalb County zoning, permitting, and site work.
            </p>
            <p className="text-[var(--color-gray)] leading-relaxed mb-4">
              Because we&rsquo;re only 20 miles from the Champion factory in Topeka — the largest Champion
              plant in the country — Auburn-area buyers get some of the shortest delivery times and
              lowest freight costs anywhere in our region. That&rsquo;s the factory-direct advantage:
              fewer middlemen, transparent line-item pricing, and homes delivered fast.
            </p>
            <p className="text-[var(--color-gray)] leading-relaxed">
              From single wides to spacious double wides and IRC-code modular homes, we help Auburn
              families find the right home for their land and budget. Explore our{" "}
              <Link href="/floor-plans" className="text-[var(--color-teal)] underline">floor plans</Link>,
              learn about{" "}
              <Link href="/financing" className="text-[var(--color-teal)] underline">financing options</Link>,
              or <Link href="/contact-us" className="text-[var(--color-teal)] underline">contact us</Link> to
              schedule a showroom visit.
            </p>
          </FadeIn>

          <FadeIn direction="up">
            <div className="mt-10 p-6 rounded-xl bg-[var(--color-cream-dark)]">
              <H3 className="font-serif text-xl font-semibold mb-3">Serving Auburn &amp; Nearby Communities</H3>
              <div className="flex flex-wrap gap-2 text-sm">
                {[
                  { name: "Garrett", href: "/locations/garrett" },
                  { name: "Waterloo", href: "/locations/waterloo" },
                  { name: "Butler", href: "/locations/butler" },
                  { name: "Fort Wayne", href: "/locations/fort-wayne" },
                  { name: "DeKalb County", href: "/locations/dekalb-county" },
                  { name: "Kendallville", href: "/locations/noble-county" },
                ].map((t) => (
                  <Link
                    key={t.name}
                    href={t.href}
                    className="px-3 py-1.5 bg-white rounded-full border border-[var(--color-charcoal)]/10 hover:border-[var(--color-teal)]/40 hover:text-[var(--color-teal)] transition-colors"
                  >
                    {t.name}
                  </Link>
                ))}
                <span className="px-3 py-1.5 text-[var(--color-gray)]">St. Joe · Corunna · Ashley · Hamilton · Spencerville</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== FAQ (FAQPage schema) ===== */}
      <FAQSection
        title="Auburn Manufactured Home FAQs"
        subtitle="Showroom, delivery, land, and DeKalb County questions"
        faqs={locationFAQs}
      />

      {/* ===== CTA ===== */}
      <section className="py-16 bg-[var(--color-charcoal)] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-3xl font-light mb-4">Visit Our Auburn Showroom</H2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            1211 State Road 8, Auburn, IN 46706. Walk through model homes and get a factory-direct
            quote from a local team that walks you through everything from floor plan to move-in —
            including referrals to licensed and insured contractors for setup.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact-us"
              className="bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-4 text-sm font-bold tracking-widest uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors"
            >
              Get a Quote
            </Link>
            <a
              href="tel:+12603081457"
              className="border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase rounded hover:bg-white/5 transition-colors"
            >
              Call (260) 308-1457
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
