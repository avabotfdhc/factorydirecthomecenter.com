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
// INDIANAPOLIS LOCATION PAGE - MAXIMUM SEO/AEO
// ============================================

export const metadata = genMeta({
  title: "Manufactured Homes Indianapolis IN | Champion Dealer",
  description: "Champion manufactured & modular homes delivered to Indianapolis, Indiana. 110 miles from Auburn. Serving Marion, Hamilton, Johnson counties. Factory-direct pricing.",
  keywords: [
    "manufactured homes indianapolis",
    "modular homes indianapolis indiana",
    "mobile homes indianapolis",
    "champion homes indianapolis",
    "marion county manufactured homes"
  ],
  url: "/locations/indianapolis",
  type: "article",
});

const aeoContent = [
  {
    question: "Can I get a manufactured home delivered to Indianapolis?",
    directAnswer: "Yes, Factory Direct Homes Center delivers manufactured and modular homes throughout Indianapolis and central Indiana.",
    supportingDetails: [
      "We serve Marion County and surrounding areas including Hamilton, Johnson, Hendricks, and Boone counties.",
      "While we're 110 miles from Indianapolis, our factory-direct pricing often beats local dealers even with delivery costs."
    ],
    wordCount: 49
  },
  {
    question: "How much does delivery cost to Indianapolis?",
    directAnswer: "Delivery to Indianapolis costs approximately $4,200 for the 110-mile transport from our Auburn showroom.",
    supportingDetails: [
      "This covers transportation of the home to your site; setup is handled by the contractor you hire.",
      "Even with delivery, our factory-direct pricing is often competitive with Indianapolis-area dealers."
    ],
    wordCount: 45
  },
  {
    question: "What areas near Indianapolis do you serve?",
    directAnswer: "We serve Indianapolis and surrounding communities including Carmel, Fishers, Noblesville, Greenwood, and Avon.",
    supportingDetails: [
      "Our service area covers all of central Indiana within a reasonable distance of Indianapolis.",
      "Rural properties outside Marion County often have more favorable zoning for manufactured homes."
    ],
    wordCount: 47
  },
  {
    question: "Are manufactured homes allowed in Indianapolis?",
    directAnswer: "Manufactured homes face restrictions within Indianapolis city limits but are permitted in many surrounding townships and counties.",
    supportingDetails: [
      "Hamilton County, Johnson County, and rural Marion County typically have more permissive zoning.",
      "We help verify zoning compliance for your specific property before purchase."
    ],
    wordCount: 46
  },
  {
    question: "Why choose Factory Direct over Indianapolis dealers?",
    directAnswer: "Factory Direct offers true factory-direct pricing from Champion's largest manufacturing facility, often offsetting delivery costs.",
    supportingDetails: [
      "Our line-item transparency lets you see exactly what you're paying for.",
      "You can use your own contractors for site work, potentially saving thousands."
    ],
    wordCount: 48
  }
];

const locationFAQs = [
  {
    question: "Does Factory Direct deliver to Indianapolis city limits?",
    answer: "Yes, we can deliver to Indianapolis city limits, though zoning restrictions apply. Many of our Indianapolis customers choose properties in surrounding counties like Hamilton, Johnson, or Hendricks where zoning is more permissive for manufactured homes. We help navigate zoning requirements for your specific location."
  },
  {
    question: "What counties around Indianapolis do you serve?",
    answer: "We serve Marion County (Indianapolis) and surrounding counties including Hamilton (Carmel, Fishers, Noblesville), Johnson (Greenwood, Franklin), Hendricks (Avon, Plainfield), Boone (Lebanon, Zionsville), and Shelby. Our 110-mile service radius from Auburn covers the entire Indianapolis metropolitan area."
  },
  {
    question: "Is it worth buying from Factory Direct if I'm in Indianapolis?",
    answer: "Many Indianapolis buyers find our factory-direct pricing competitive even with delivery costs. We're 110 miles away, but we source directly from Champion's largest factory with no middleman markups. Our line-item pricing and contractor flexibility often result in total costs comparable to or better than local dealers, plus you get our transparent, no-pressure approach."
  },
  {
    question: "What is the best location for a manufactured home near Indianapolis?",
    answer: "Rural areas and townships surrounding Indianapolis often offer the best opportunities for manufactured homes. Hamilton County, Johnson County, and rural Marion County typically have more permissive zoning. Areas outside the I-465 loop generally have fewer restrictions than downtown Indianapolis. We can help you evaluate specific properties for zoning compliance."
  },
  {
    question: "How does Indianapolis weather affect manufactured homes?",
    answer: "Indianapolis's humid continental climate with hot summers and cold winters is well-suited for modern manufactured homes. Champion homes built for Indiana include enhanced insulation, energy-efficient windows, and HVAC systems designed for temperature extremes. Our homes exceed HUD energy standards and perform well in Indiana's four-season climate."
  },
  {
    question: "Can I get financing for a manufactured home in Indianapolis?",
    answer: "Yes, Indianapolis buyers have access to all our financing options including chattel loans, land-home packages, and conventional financing for modular homes. We work with national lenders who serve Indiana buyers. Many Indianapolis customers appreciate our line-item pricing that lets them use local contractors for site work."
  },
  {
    question: "How long does delivery take to Indianapolis?",
    answer: "From order to move-in typically takes 8-12 weeks for Indianapolis deliveries. Manufacturing takes 6-8 weeks at the Topeka factory. Delivery and setup add 2-4 weeks depending on site preparation and permitting. While we're 110 miles away, our efficient process ensures timely delivery to Indianapolis-area properties."
  },
  {
    question: "Do you offer site work services in the Indianapolis area?",
    answer: "No — and that's by design. You hire your own licensed contractors for land clearing, foundation installation, utility connections, and driveway preparation, which is how most buyers save money. We'll share a referral list of licensed and insured contractors past customers have used, and our line-item pricing on the home and delivery gives Indianapolis buyers full transparency on all costs."
  }
];

const localLandmarks = [
  "Indianapolis Motor Speedway",
  "Children's Museum of Indianapolis",
  "Indianapolis Zoo",
  "White River State Park",
  "Monument Circle",
  "Mass Ave Arts District",
  "Broad Ripple Village",
  "Fountain Square",
  "Garfield Park",
  "Eagle Creek Park"
];

const nearbyCities = [
  { name: "Carmel", distance: "115 miles" },
  { name: "Fishers", distance: "120 miles" },
  { name: "Noblesville", distance: "125 miles" },
  { name: "Greenwood", distance: "110 miles" },
  { name: "Avon", distance: "115 miles" },
  { name: "Franklin", distance: "105 miles" }
];

const countiesServed = [
  "Marion",
  "Hamilton",
  "Johnson",
  "Hendricks",
  "Boone",
  "Shelby",
  "Morgan",
  "Hancock"
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Locations", url: "/locations" },
  { name: "Indianapolis", url: "/locations/indianapolis" }
];

const relatedPages = [
  {
    title: "Floor Plans",
    url: "/floor-plans",
    description: "Browse homes available for Indianapolis delivery"
  },
  {
    title: "Financing Options",
    url: "/financing",
    description: "Learn about loans for Indianapolis buyers"
  },
  {
    title: "Fort Wayne",
    url: "/locations/fort-wayne",
    description: "Our closest location to Indianapolis"
  }
];

export default function IndianapolisPage() {
  
  return (
    <>
      <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      <StructuredData data={structuredData.article({
        headline: "Manufactured Homes Indianapolis IN | Champion Dealer",
        description: "Champion manufactured and modular homes delivered to Indianapolis, Indiana.",
        image: "/images/hero-home.jpg",
        datePublished: "2024-01-01",
        dateModified: new Date().toISOString(),
        author: "Factory Direct Homes Center",
        url: "/locations/indianapolis"
      })} />
      <StructuredData data={structuredData.service({
        name: "Manufactured Home Delivery Indianapolis",
        description: "Manufactured and modular home delivery to Indianapolis and central Indiana.",
        provider: "Factory Direct Homes Center",
        areaServed: "Indianapolis, Indiana"
      })} />
      <StructuredData data={structuredData.faqPage(locationFAQs)} />
      <StructuredData data={structuredData.imageObject({
        url: "/images/hero-home.jpg",
        name: "Manufactured Homes Indianapolis Indiana",
        description: "Champion manufactured homes delivered to Indianapolis and central Indiana",
        width: 1200,
        height: 630
      })} />

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

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-home.jpg"
            alt={generateAltText("location", { name: "Manufactured Homes Indianapolis Indiana", location: "Indianapolis, IN" })}
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
                  Central Indiana
                </span>
              </div>
              
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
                Manufactured Homes{" "}
                <span className="italic text-[var(--color-teal-light)]">
                  Indianapolis
                </span>
              </h1>
              
              <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                Champion manufactured & modular homes delivered to Indianapolis 
                and central Indiana. Serving Marion, Hamilton, and Johnson counties 
                with factory-direct pricing.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-8 bg-[var(--color-teal)] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer staggerDelay={150} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <FadeIn direction="up" delay={0}>
              <div className="font-serif text-3xl font-bold">
                <AnimatedCounter end={110} suffix=" mi" />
              </div>
              <div className="text-sm text-white/70">From Our Showroom</div>
            </FadeIn>
            <FadeIn direction="up" delay={150}>
              <div className="font-serif text-3xl font-bold">$4,200</div>
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
                <AnimatedCounter end={8} />
              </div>
              <div className="text-sm text-white/70">Counties Served</div>
            </FadeIn>
          </StaggerContainer>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-[var(--color-charcoal)]/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-10">
              <H2 className="font-serif text-3xl font-light mb-4">
                Manufactured Homes in Indianapolis
              </H2>
              <p className="text-[var(--color-gray)]">
                Everything you need to know about buying a manufactured home in central Indiana
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

      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <FadeIn direction="up">
              <div>
                <div className="decorative-line mb-6" />
                <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                  Serving <span className="italic text-[var(--color-teal)]">Indianapolis</span><br />
                  & Central Indiana
                </H2>
                
                <p className="text-[var(--color-gray)] leading-relaxed mb-8">
                  Indianapolis is Indiana's capital and largest city with over 880,000 residents 
                  in the city and 2 million+ in the metro area. From downtown near Monument Circle 
                  to the suburbs of Carmel and Fishers, we deliver Champion homes throughout the region.
                </p>

                <div className="mb-8">
                  <H3 className="font-semibold mb-4">Near Indianapolis Landmarks:</H3>
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
                    <strong>Why Indianapolis buyers choose us:</strong> Factory-direct 
                    pricing from Champion's largest facility often offsets delivery costs, 
                    plus you get our transparent, no-pressure approach.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <div className="decorative-line mx-auto mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
                Zoning in <span className="italic text-[var(--color-teal)]">Central Indiana</span>
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
                    <span>Hamilton County (Carmel, Fishers, Noblesville)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Johnson County (Greenwood, Franklin)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Hendricks County (Avon, Plainfield)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Rural Marion County</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Boone County (Lebanon, Zionsville)</span>
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
                    <span>Indianapolis city limits have restrictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>HOAs may prohibit manufactured homes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>Minimum lot sizes vary by township</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>Building permits required in all areas</span>
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

      <FAQSection
        title="Indianapolis Area FAQs"
        subtitle="Common questions about manufactured homes in Indianapolis and central Indiana"
        faqs={locationFAQs}
        showSchema={true}
      />

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

      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn direction="up">
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
              Ready for Your{" "}
              <span className="italic text-[var(--color-teal-light)]">
                Indianapolis Home?
              </span>
            </H2>
            <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
              Browse our floor plans or call us to discuss delivery to your 
              Indianapolis-area property. Factory-direct pricing with transparent, 
              line-item costs.
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
