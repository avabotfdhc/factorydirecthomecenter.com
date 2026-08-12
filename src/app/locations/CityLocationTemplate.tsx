import Link from "next/link";
import Image from "next/image";
import { FAQSection } from "@/components/FAQSection";
import { StructuredData, structuredData } from "@/lib/seo";
import { FadeIn, StaggerContainer, AnimatedCounter } from "@/components/VisualEffects";
import { H2, H3 } from "@/components/Heading";

// Reusable, SSR (server component) local-SEO city page. Renders full schema
// (LocalBusiness + geo, Website, Breadcrumb, Article, Service, FAQPage) plus
// hero, info bar, hyperlocal content, FAQ, and CTA — so every city page is
// schema-complete, not a thin duplicate. Each page supplies real local data.

export interface CityLocationData {
  city: string;
  county: string; // e.g. "Steuben County"
  slug: string;
  distanceMi: number; // miles from the Auburn showroom
  driveMin: number; // approx drive time from Auburn
  lat: number;
  lng: number;
  /** One-line hero subheading. */
  tagline: string;
  /** Body paragraphs of genuine local content (can include JSX for links). */
  intro: React.ReactNode[];
  nearby: { name: string; href?: string }[];
  faqs: { question: string; answer: string }[];
}

export function CityLocationTemplate({ data }: { data: CityLocationData }) {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Locations", url: "/locations" },
    { name: `${data.city}, IN`, url: `/locations/${data.slug}` },
  ];

  return (
    <>
      {/* ===== STRUCTURED DATA ===== */}
      <StructuredData
        data={{
          ...structuredData.localBusiness(),
          areaServed: {
            "@type": "City",
            name: data.city,
            containedInPlace: { "@type": "AdministrativeArea", name: `${data.county}, Indiana` },
          },
          hasMap: `https://maps.google.com/?q=${encodeURIComponent(data.city + " IN")}`,
          serviceArea: {
            "@type": "GeoCircle",
            geoMidpoint: { "@type": "GeoCoordinates", latitude: data.lat, longitude: data.lng },
            geoRadius: "40 miles",
          },
        }}
      />
      <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      <StructuredData
        data={structuredData.article({
          headline: `Manufactured & Modular Homes in ${data.city}, IN`,
          description: `Champion manufactured and modular homes delivered to ${data.city} and ${data.county}, Indiana from Factory Direct Homes Center in Auburn.`,
          image: "/images/hero-home.jpg",
          datePublished: "2024-01-01",
          dateModified: new Date().toISOString(),
          author: "Factory Direct Homes Center",
          url: `/locations/${data.slug}`,
        })}
      />
      <StructuredData
        data={structuredData.service({
          name: `Manufactured Home Sales & Delivery — ${data.city}, IN`,
          description: `Factory-direct manufactured and modular home sales with delivery to ${data.city} and ${data.county}, Indiana.`,
          provider: "Factory Direct Homes Center",
          areaServed: `${data.city}, Indiana`,
        })}
      />
      <StructuredData data={structuredData.faqPage(data.faqs)} />

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
            alt={`Manufactured and modular homes delivered to ${data.city}, Indiana`}
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            fetchPriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/80 via-[var(--color-charcoal)]/60 to-[var(--color-charcoal)]/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="decorative-line" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                  {data.county}, Indiana
                </span>
              </div>
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
                Manufactured Homes in{" "}
                <span className="italic text-[var(--color-teal-light)]">{data.city}</span>
              </h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-xl mb-8">{data.tagline}</p>
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
              <div className="font-serif text-3xl font-bold"><AnimatedCounter end={data.distanceMi} suffix=" mi" /></div>
              <div className="text-sm text-white/70">From Our Showroom</div>
            </FadeIn>
            <FadeIn direction="up" delay={150}>
              <div className="font-serif text-3xl font-bold"><AnimatedCounter end={data.driveMin} suffix=" min" /></div>
              <div className="text-sm text-white/70">Drive from Auburn</div>
            </FadeIn>
            <FadeIn direction="up" delay={300}>
              <div className="font-serif text-3xl font-bold"><AnimatedCounter end={8} suffix="-12" /></div>
              <div className="text-sm text-white/70">Weeks Delivery</div>
            </FadeIn>
            <FadeIn direction="up" delay={450}>
              <div className="font-serif text-3xl font-bold">Direct</div>
              <div className="text-sm text-white/70">Factory Pricing</div>
            </FadeIn>
          </StaggerContainer>
        </div>
      </section>

      {/* ===== LOCAL CONTENT ===== */}
      <section className="py-16 lg:py-20 bg-white border-b border-[var(--color-charcoal)]/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <H2 className="font-serif text-3xl font-light mb-4">
              Champion Homes for {data.city} &amp; {data.county}
            </H2>
            {data.intro.map((para, i) => (
              <p key={i} className="text-[var(--color-gray)] leading-relaxed mb-4">
                {para}
              </p>
            ))}
          </FadeIn>

          <FadeIn direction="up">
            <div className="mt-10 p-6 rounded-xl bg-[var(--color-cream-dark)]">
              <H3 className="font-serif text-xl font-semibold mb-3">Also Serving Nearby</H3>
              <div className="flex flex-wrap gap-2 text-sm">
                {data.nearby.map((t) =>
                  t.href ? (
                    <Link
                      key={t.name}
                      href={t.href}
                      className="px-3 py-1.5 bg-white rounded-full border border-[var(--color-charcoal)]/10 hover:border-[var(--color-teal)]/40 hover:text-[var(--color-teal)] transition-colors"
                    >
                      {t.name}
                    </Link>
                  ) : (
                    <span key={t.name} className="px-3 py-1.5 bg-white rounded-full border border-[var(--color-charcoal)]/10">
                      {t.name}
                    </span>
                  ),
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== FAQ (FAQPage schema) ===== */}
      <FAQSection title={`${data.city} Manufactured Home FAQs`} subtitle="Delivery, land, and local questions" faqs={data.faqs} />

      {/* ===== CTA ===== */}
      <section className="py-16 bg-[var(--color-charcoal)] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-3xl font-light mb-4">Get a Factory-Direct Quote for {data.city}</H2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            We deliver Champion manufactured and modular homes throughout {data.county} from our Auburn
            showroom — with transparent, line-item pricing and a referral list of licensed
            and insured local contractors for setup.
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
