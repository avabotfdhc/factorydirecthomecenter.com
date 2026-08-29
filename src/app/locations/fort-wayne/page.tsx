import Link from "next/link";
import Image from "next/image";
import { FAQSection } from "@/components/FAQSection";
import { StructuredData, structuredData, generateMetadata as genMeta } from "@/lib/seo";
import {
  FadeIn,
  StaggerContainer,
  AnimatedCounter,
  useScrollTracking
} from "@/components/VisualEffects";
import { generateAltText } from "@/lib/images";
import { H2, H3, H4 } from "@/components/Heading";

// ============================================
// FORT WAYNE LOCATION PAGE - MAXIMUM SEO/AEO
// ============================================
// LocalBusiness + Service schema
// Hyperlocal content
// AEO with 40-60 word answers
// FAQ schema
// ============================================

export const metadata = genMeta({
  title: "Manufactured Homes in Fort Wayne, IN",
  description: "Champion manufactured & modular homes delivered to Fort Wayne, Indiana. 30 miles from Auburn showroom. Serving Allen, Whitley, Noble counties. Factory-direct pricing, line-item transparency.",
  keywords: [
    "manufactured homes fort wayne",
    "modular homes fort wayne indiana",
    "mobile homes fort wayne",
    "champion homes fort wayne",
    "factory direct homes fort wayne",
    "allen county manufactured homes"
  ],
  url: "/locations/fort-wayne",
  type: "article",
});

// AEO Content - 40-60 word answers with hyperlocal context
const aeoContent = [
  {
    question: "Where can I buy a manufactured home in Fort Wayne, Indiana?",
    directAnswer: "Factory Direct Homes Center delivers manufactured and modular homes throughout Fort Wayne and Allen County from our Auburn showroom, just 30 miles away.",
    supportingDetails: [
      "We serve all Fort Wayne neighborhoods including Aboite, Southwest Allen, and New Haven.",
      "Our central location means short delivery times and low freight costs on every Fort Wayne delivery."
    ],
    wordCount: 48
  },
  {
    question: "How much does it cost to deliver a manufactured home to Fort Wayne?",
    directAnswer: "Delivery to Fort Wayne costs approximately $2,800 due to our proximity—just 30 miles from our Auburn showroom.",
    supportingDetails: [
      "That short 30-mile haul from our Auburn showroom keeps your freight cost low.",
      "Total cost covers transportation of the home to your site; setup on your foundation is handled by the contractor you hire."
    ],
    wordCount: 45
  },
  {
    question: "Are manufactured homes allowed in Fort Wayne and Allen County?",
    directAnswer: "Manufactured homes are permitted in many areas of Allen County, though Fort Wayne city limits have specific zoning restrictions.",
    supportingDetails: [
      "Rural areas and townships like Aboite and Perry typically have more permissive zoning.",
      "We help verify zoning compliance for your specific property before purchase."
    ],
    wordCount: 47
  },
  {
    question: "What is the best manufactured home dealer near Fort Wayne?",
    directAnswer: "Factory Direct Homes Center is the closest Champion dealer to Fort Wayne, located just 30 miles away in Auburn.",
    supportingDetails: [
      "We're a family-owned, authorized Champion dealer serving Indiana, Ohio, and Michigan.",
      "Our line-item pricing and contractor freedom mean real transparency and savings on every home."
    ],
    wordCount: 46
  },
  {
    question: "How long does it take to get a manufactured home delivered to Fort Wayne?",
    directAnswer: "From order to move-in typically takes 8-12 weeks for Fort Wayne deliveries.",
    supportingDetails: [
      "Manufacturing takes 6-8 weeks at the Topeka factory, just 20 miles from our showroom.",
      "Our proximity means fast delivery — the home travels a short distance to your site."
    ],
    wordCount: 45
  }
];

// FAQs with hyperlocal focus
const locationFAQs = [
  {
    question: "Does Factory Direct Homes Center deliver to Fort Wayne city limits?",
    answer: "Yes, we deliver throughout Fort Wayne and the surrounding areas. However, Fort Wayne city limits have specific zoning requirements for manufactured homes. We recommend checking with the Fort Wayne Planning and Zoning Department before purchasing. Many of our Fort Wayne customers choose locations in surrounding townships like Aboite, Perry, or Washington townships where zoning is more permissive."
  },
  {
    question: "What areas near Fort Wayne do you serve?",
    answer: "We serve all of Allen County including Fort Wayne, New Haven, Huntertown, Leo-Cedarville, Grabill, and Monroeville. We also deliver to adjacent counties including Whitley (Columbia City), Noble (Kendallville), DeKalb (Auburn), and Huntington. Our 30-mile radius from Auburn covers most of Northeast Indiana."
  },
  {
    question: "Can I put a manufactured home on my land in Allen County?",
    answer: "Manufactured homes are permitted on private land in many parts of Allen County, particularly in rural townships. Fort Wayne city limits have more restrictions. Agricultural zones and rural residential districts typically welcome manufactured homes. You or your contractor verify your specific property's zoning and pull permits through the Allen County Building Department — we can point you in the right direction."
  },
  {
    question: "How does Fort Wayne's climate affect manufactured homes?",
    answer: "Fort Wayne's four-season climate with cold winters and humid summers is well-suited for modern manufactured homes. Champion homes built for Indiana include enhanced insulation, energy-efficient windows, and HVAC systems designed for our climate. The homes exceed HUD energy standards, making them comfortable year-round while keeping utility costs manageable."
  },
  {
    question: "Are there manufactured home communities near Fort Wayne?",
    answer: "Yes, several manufactured home communities exist in and around Fort Wayne. These range from age-restricted 55+ communities to family-friendly parks. We can deliver to leased lots in these communities using chattel financing, or help you place a home on your own land. We work with community managers to ensure smooth delivery, and the setup crew you hire handles the rest."
  },
  {
    question: "What financing options are available for Fort Wayne buyers?",
    answer: "Fort Wayne buyers have access to all our financing options including chattel loans, land-home packages, and conventional financing for modular homes. We work with local credit unions like 3Rivers Federal Credit Union and national lenders like 21st Mortgage. Many Fort Wayne customers appreciate our line-item pricing that lets them use their own contractors for site work."
  },
  {
    question: "Do you offer site work and foundation services in Fort Wayne?",
    answer: "No — and that's by design. You hire your own licensed contractors for land clearing, foundation installation, utility connections, and driveway preparation, which is how most buyers save money. We'll share a referral list of licensed and insured local contractors past customers have used, and our line-item pricing on the home and delivery means you know exactly what you're paying for."
  },
  {
    question: "How do I get started buying a manufactured home in Fort Wayne?",
    answer: "Start by browsing our floor plans online or visiting our Auburn showroom, just 30 minutes from Fort Wayne. Get pre-qualified for financing so you know your budget. We'll help you choose a home, and you or your contractor verify zoning for your property and handle the permitting. From order to move-in typically takes 8-12 weeks."
  }
];

// Hyperlocal landmarks
const localLandmarks = [
 "Parkview Field",
  "Foellinger-Freimann Botanical Conservatory",
  "Fort Wayne Children's Zoo",
  "Allen County War Memorial Coliseum",
  "Science Central",
  "Headwaters Park",
  "Lakeside Park & Rose Garden",
  "Aboite Township",
  "Southwest Allen County",
  "New Haven"
];

// Nearby cities
const nearbyCities = [
  { name: "New Haven", distance: "15 miles" },
  { name: "Huntertown", distance: "20 miles" },
  { name: "Leo-Cedarville", distance: "22 miles" },
  { name: "Columbia City", distance: "35 miles" },
  { name: "Kendallville", distance: "40 miles" },
  { name: "Auburn", distance: "30 miles" }
];

// Counties served
const countiesServed = [
  "Allen",
  "Whitley",
  "Noble",
  "DeKalb",
  "Huntington",
  "Wells",
  "Adams"
];

// Breadcrumbs
const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Locations", url: "/locations" },
  { name: "Fort Wayne", url: "/locations/fort-wayne" }
];

// Related pages
const relatedPages = [
  {
    title: "Floor Plans",
    url: "/floor-plans",
    description: "Browse homes available for delivery to Fort Wayne"
  },
  {
    title: "Financing Options",
    url: "/financing",
    description: "Learn about loans for Fort Wayne buyers"
  },
  {
    title: "Our Showroom",
    url: "/about",
    description: "Visit us in Auburn, just 30 minutes away"
  }
];

export default function FortWaynePage() {
  
  return (
    <>
      {/* ============================================
          MAXIMUM STRUCTURED DATA
          ============================================ */}
      
      {/* 1. LocalBusiness with Fort Wayne focus */}
      <StructuredData data={{
        ...structuredData.localBusiness(),
        areaServed: {
          "@type": "City",
          name: "Fort Wayne",
          containedInPlace: {
            "@type": "State",
            name: "Indiana"
          }
        },
        hasMap: "https://maps.google.com/?q=Fort+Wayne+IN",
        serviceArea: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: 41.0793,
            longitude: -85.1394
          },
          geoRadius: "50 miles"
        }
      }} />
      
      {/* WebSite schema comes from the root layout */}
      {/* 3. BreadcrumbList */}
      <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      
      {/* 4. Article */}
      <StructuredData data={structuredData.article({
        headline: "Manufactured Homes Fort Wayne IN | Champion Homes Dealer",
        description: "Champion manufactured and modular homes delivered to Fort Wayne, Indiana. 30 miles from Auburn showroom.",
        image: "/images/homepage/double-wide-exterior.webp",
        datePublished: "2024-01-01",
        dateModified: new Date().toISOString(),
        author: "Factory Direct Homes Center",
        url: "/locations/fort-wayne"
      })} />
      
      {/* 5. Service for Fort Wayne area */}
      <StructuredData data={structuredData.service({
        name: "Manufactured Home Delivery Fort Wayne",
        description: "Factory-direct manufactured and modular home sales with delivery to Fort Wayne and Allen County, Indiana.",
        provider: "Factory Direct Homes Center",
        areaServed: "Fort Wayne, Indiana"
      })} />
      
      {/* 6. FAQPage */}
      <StructuredData data={structuredData.faqPage(locationFAQs)} />
      
      {/* 7. ImageObject */}
      <StructuredData data={structuredData.imageObject({
        url: "/images/homepage/double-wide-exterior.webp",
        name: "Manufactured Homes Delivered to Fort Wayne Indiana",
        description: "Champion manufactured homes delivered to Fort Wayne, Allen County, Indiana from Factory Direct Homes Center",
        width: 1200,
        height: 630
      })} />

      {/* ============================================
          BREADCRUMB NAVIGATION
          ============================================ */}
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

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/homepage/double-wide-exterior.webp"
            alt={generateAltText("location", { name: "Manufactured Homes Fort Wayne Indiana", location: "Fort Wayne, IN" })}
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
                  Allen County, Indiana
                </span>
              </div>
              
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
                Manufactured Homes{" "}
                <span className="italic text-[var(--color-teal-light)]">
                  Fort Wayne
                </span>
              </h1>
              
              <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                Champion manufactured & modular homes delivered to Fort Wayne 
                and Allen County. Just 30 miles from our Auburn showroom. 
                Factory-direct pricing with local service.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          DELIVERY INFO BAR
          ============================================ */}
      <section className="py-8 bg-[var(--color-teal)] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer staggerDelay={150} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <FadeIn direction="up" delay={0}>
              <div className="font-serif text-3xl font-bold">
                <AnimatedCounter end={30} suffix=" mi" />
              </div>
              <div className="text-sm text-white/70">From Our Showroom</div>
            </FadeIn>
            <FadeIn direction="up" delay={150}>
              <div className="font-serif text-3xl font-bold">$2,800</div>
              <div className="text-sm text-white/70">Est. Delivery Cost</div>
            </FadeIn>
            <FadeIn direction="up" delay={300}>
              <div className="font-serif text-3xl font-bold">
                <AnimatedCounter end={8} suffix="-12" />
              </div>
              <div className="text-sm text-white/70">Weeks Delivery</div>
            </FadeIn>
            <FadeIn direction="up" delay={450}>
              <div className="font-serif text-3xl font-bold">
                <AnimatedCounter end={7} />
              </div>
              <div className="text-sm text-white/70">Counties Served</div>
            </FadeIn>
          </StaggerContainer>
        </div>
      </section>

      {/* ============================================
          AEO CONTENT SECTION
          ============================================ */}
      <section className="py-16 bg-white border-b border-[var(--color-charcoal)]/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-10">
              <H2 className="font-serif text-3xl font-light mb-4">
                Manufactured Homes in Fort Wayne
              </H2>
              <p className="text-[var(--color-gray)]">
                Everything you need to know about buying a manufactured home in the Fort Wayne area
              </p>
            </div>
          </FadeIn>
          
          <div className="space-y-6">
            {aeoContent.map((section, idx) => (
              <FadeIn key={idx} direction="up" delay={idx * 100}>
                <div className="bg-[var(--color-cream-dark)] rounded-lg p-6 border-l-4 border-[var(--color-teal)]">
                  <H3 className="font-semibold text-lg mb-3">{section.question}</H3>
                  <p className="text-[var(--color-gray)] leading-relaxed">
                    <strong className="text-[var(--color-charcoal)]">{section.directAnswer}</strong>{" "}
                    {section.supportingDetails.join(" ")}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          HYPERLOCAL CONTENT
          ============================================ */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Local Info */}
            <FadeIn direction="up">
              <div>
                <div className="decorative-line mb-6" />
                <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                  Serving <span className="italic text-[var(--color-teal)]">Fort Wayne</span><br />
                  & Allen County
                </H2>
                
                <p className="text-[var(--color-gray)] leading-relaxed mb-8">
                  Fort Wayne is Indiana's second-largest city with over 270,000 residents 
                  in the city and 400,000+ in the metro area. From the vibrant downtown 
                  near Parkview Field to the growing suburbs of Aboite and Southwest Allen, 
                  we deliver Champion homes throughout the region.
                </p>

                {/* Landmarks */}
                <div className="mb-8">
                  <H3 className="font-semibold mb-4">Near Fort Wayne Landmarks:</H3>
                  <div className="flex flex-wrap gap-2">
                    {localLandmarks.map((landmark) => (
                      <span 
                        key={landmark}
                        className="text-xs bg-white px-3 py-1.5 rounded-full border border-[var(--color-charcoal)]/10"
                      >
                        {landmark}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Counties */}
                <div>
                  <H3 className="font-semibold mb-4">Counties We Serve:</H3>
                  <div className="flex flex-wrap gap-2">
                    {countiesServed.map((county) => (
                      <span 
                        key={county}
                        className="text-xs bg-[var(--color-teal)]/10 text-[var(--color-teal)] px-3 py-1.5 rounded-full font-medium"
                      >
                        {county} County
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Nearby Cities */}
            <FadeIn direction="up" delay={200}>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <H3 className="font-serif text-2xl font-semibold mb-6">Nearby Cities</H3>
                <div className="space-y-4">
                  {nearbyCities.map((city) => (
                    <div key={city.name} className="flex justify-between items-center py-3 border-b border-[var(--color-charcoal)]/5 last:border-0">
                      <span className="font-medium">{city.name}</span>
                      <span className="text-sm text-[var(--color-gray)]">{city.distance}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-[var(--color-cream-dark)] rounded-lg">
                  <p className="text-sm text-[var(--color-gray)]">
                    <strong>Local advantage:</strong> Being just 30 miles from Fort Wayne
                    means low delivery costs and fast, local service you can count on.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============================================
          ZONING INFO
          ============================================ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <div className="decorative-line mx-auto mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
                Zoning in <span className="italic text-[var(--color-teal)]">Allen County</span>
              </H2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn direction="up" delay={0}>
              <div className="bg-[var(--color-lime)]/10 rounded-xl p-8">
                <H3 className="font-serif text-xl font-semibold mb-4 text-[var(--color-lime-dark)]">Zoning-Friendly Areas</H3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Aboite Township - Agricultural/residential zoning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Perry Township - Rural residential</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Washington Township - Large lot requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Wayne Township - Mixed zoning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Scipio Township - Rural areas</span>
                  </li>
                </ul>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={150}>
              <div className="bg-[var(--color-orange)]/10 rounded-xl p-8">
                <H3 className="font-serif text-xl font-semibold mb-4 text-[var(--color-orange)]">Considerations</H3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>Fort Wayne city limits have restrictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>Minimum lot sizes vary by township</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>Setback requirements apply</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>Building permits required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>We verify zoning before purchase</span>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============================================
          FAQ SECTION
          ============================================ */}
      <FAQSection
        title="Fort Wayne Area FAQs"
        subtitle="Common questions about manufactured homes in Fort Wayne and Allen County"
        faqs={locationFAQs}
        showSchema={true}
      />

      {/* ============================================
          RELATED PAGES
          ============================================ */}
      <section className="py-16 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <H3 className="font-serif text-xl font-semibold mb-6">Continue Exploring</H3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPages.map((page) => (
              <Link 
                key={page.url}
                href={page.url}
                className="bg-white rounded-xl p-6 border border-[var(--color-charcoal)]/5 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <H4 className="font-semibold text-[var(--color-teal)] mb-2">{page.title}</H4>
                <p className="text-sm text-[var(--color-gray)]">{page.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn direction="up">
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
              Ready for Your{" "}
              <span className="italic text-[var(--color-teal-light)]">
                Fort Wayne Home?
              </span>
            </H2>
            <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
              Browse our floor plans or visit our Auburn showroom, just 30 minutes 
              from Fort Wayne. We&apos;ll help you find the perfect home for your 
              Allen County property.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+12603081457"
                
                className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300 rounded-lg"
              >
                Call (260) 308-1457
              </a>
              <Link
                href="/floor-plans"
                className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300 rounded-lg"
              >
                Browse Floor Plans
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
