import Link from "next/link";
import Image from "next/image";
import { FAQSection } from "@/components/FAQSection";
import { StructuredData, structuredData, generateMetadata as genMeta } from "@/lib/seo";
import { FadeIn, StaggerContainer, AnimatedCounter, useScrollTracking } from "@/components/VisualEffects";
import { generateAltText } from "@/lib/images";
import { H2, H3, H4 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Manufactured Homes Rural Indiana | Noble, DeKalb, Whitley, Steuben",
  description: "Champion manufactured homes for rural Indiana. Noble, DeKalb, Whitley, Steuben, LaGrange, Wells, Adams counties. Zoning-friendly, affordable acreage. Factory-direct pricing.",
  keywords: ["manufactured homes rural indiana", "mobile homes noble county", "modular homes dekalb county", "manufactured homes whitley county", "affordable acreage indiana"],
  url: "/locations/rural-indiana",
  type: "article",
});

const aeoContent = [
  { question: "Why are rural Indiana counties ideal for manufactured homes?", directAnswer: "Rural Indiana counties offer zoning-friendly regulations, affordable land, and welcoming communities for manufactured homes.", supportingDetails: ["Agricultural zones typically allow manufactured homes by right with minimal restrictions.", "Counties like Noble, DeKalb, and Whitley have progressive zoning that welcomes affordable housing options."], wordCount: 47 },
  { question: "How much does land cost in rural Indiana for a manufactured home?", directAnswer: "Rural land in northeast Indiana typically ranges from $3,000 to $10,000 per acre, significantly less than urban areas.", supportingDetails: ["A 1-5 acre lot is often sufficient for a manufactured home with space to spare.", "This affordability makes homeownership accessible for many families who couldn't afford urban prices."], wordCount: 46 },
  { question: "What counties in rural Indiana does Factory Direct serve?", directAnswer: "We serve Noble, DeKalb, Whitley, Steuben, LaGrange, Wells, and Adams counties in rural northeast Indiana.", supportingDetails: ["Our Auburn location is centrally located to serve all these counties efficiently.", "We're just 20 miles from the Champion factory, keeping delivery costs low for rural buyers."], wordCount: 45 },
  { question: "Are there restrictions on manufactured homes in rural Indiana?", directAnswer: "Rural counties typically have fewer restrictions than cities, with agricultural zones welcoming manufactured homes.", supportingDetails: ["Most rural townships require only building permits and setback compliance.", "We help verify zoning for your specific property before purchase."], wordCount: 44 },
  { question: "Can I put a manufactured home on agricultural land in Indiana?", directAnswer: "Yes, agricultural zones in Indiana typically allow manufactured homes as accessory dwellings or primary residences.", supportingDetails: ["Many rural buyers place homes on family farmland or newly purchased acreage.", "This option provides affordable housing while maintaining rural character and lifestyle."], wordCount: 46 }
];

const locationFAQs = [
  { question: "Which rural Indiana counties are most zoning-friendly for manufactured homes?", answer: "Noble, DeKalb, Whitley, Steuben, and LaGrange counties are particularly welcoming to manufactured homes. Agricultural zones in these counties typically allow manufactured homes with minimal restrictions. Rural townships generally have simpler permitting processes than cities, making it easier to place your home on acreage." },
  { question: "How much acreage do I need for a manufactured home in rural Indiana?", answer: "Most rural Indiana properties for manufactured homes range from 1 to 10 acres. While you can place a home on as little as 1 acre, many buyers prefer 2-5 acres for privacy and space. There's typically no maximum acreage requirement, and agricultural zones often have generous allowances for residential structures." },
  { question: "What utilities are available in rural Indiana for manufactured homes?", answer: "Rural properties may use well water, septic systems, and propane or electric heating. Your own contractors handle well drilling, septic installation, and electric service — ask us for our referral list of licensed and insured contractors past customers have used. Many rural Indiana properties already have utility access, or we can help you understand the costs of bringing utilities to undeveloped land." },
  { question: "Are there financing options for rural Indiana manufactured home buyers?", answer: "Yes, rural buyers have access to all our financing options. Chattel loans work well for homes on leased or family land. Land-home packages and conventional financing are available when you own or are buying the land, and we work with local credit unions familiar with rural Indiana lending." },
  { question: "How does Factory Direct serve rural Indiana buyers differently?", answer: "We understand rural needs: longer driveways, wells and septic systems, and flexible site work timing. Our line-item pricing lets you use local rural contractors you trust for site preparation. Being just 20 miles from the factory means lower delivery costs even to remote rural properties. We regularly deliver to farms and rural acreage throughout northeast Indiana." }
];

const ruralCounties = [
  { name: "Noble County", cities: "Kendallville, Ligonier, Albion", distance: "35 miles", highlight: "Strong agricultural zoning" },
  { name: "DeKalb County", cities: "Auburn, Butler, Garrett", distance: "Local", highlight: "Our home county" },
  { name: "Whitley County", cities: "Columbia City, South Whitley", distance: "25 miles", highlight: "Close to Fort Wayne" },
  { name: "Steuben County", cities: "Angola, Fremont", distance: "45 miles", highlight: "Lake James area" },
  { name: "LaGrange County", cities: "LaGrange, Shipshewana", distance: "35 miles", highlight: "Amish country" },
  { name: "Wells County", cities: "Bluffton, Ossian", distance: "30 miles", highlight: "Small-town charm" },
  { name: "Adams County", cities: "Decatur, Berne", distance: "25 miles", highlight: "Swiss heritage" }
];

const breadcrumbs = [{ name: "Home", url: "/" }, { name: "Locations", url: "/locations" }, { name: "Rural Indiana", url: "/locations/rural-indiana" }];
const relatedPages = [{ title: "Noble County", url: "/locations/noble-county", description: "Detailed info for Noble County buyers" }, { title: "DeKalb County", url: "/locations/dekalb-county", description: "Our local county expertise" }, { title: "Financing", url: "/financing", description: "Rural buyer financing options" }];

export default function RuralIndianaPage() {
  return (
    <>
      <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      <StructuredData data={structuredData.article({ headline: "Manufactured Homes Rural Indiana", description: "Champion homes for rural Indiana counties", image: "/images/hero-home.jpg", datePublished: "2024-01-01", dateModified: new Date().toISOString(), author: "Factory Direct Homes Center", url: "/locations/rural-indiana" })} />
      <StructuredData data={structuredData.service({ name: "Rural Indiana Manufactured Home Delivery", description: "Manufactured home delivery to rural counties in northeast Indiana", provider: "Factory Direct Homes Center", areaServed: "Rural Indiana" })} />
      <StructuredData data={structuredData.faqPage(locationFAQs)} />

      <nav aria-label="Breadcrumb" className="bg-[var(--color-cream-dark)] py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm text-[var(--color-gray)]">
            {breadcrumbs.map((crumb, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {idx > 0 && <span>/</span>}
                <Link href={crumb.url} className={idx === breadcrumbs.length - 1 ? "font-semibold text-[var(--color-charcoal)]" : "hover:text-[var(--color-teal)]"}>{crumb.name}</Link>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero-home.jpg" alt={generateAltText("location", { name: "Manufactured Homes Rural Indiana", location: "Northeast Indiana" })} fill className="object-cover opacity-30" sizes="100vw" fetchPriority="high" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/80 via-[var(--color-charcoal)]/60 to-[var(--color-charcoal)]/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="decorative-line" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">Northeast Indiana</span>
              </div>
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">Manufactured Homes <span className="italic text-[var(--color-teal-light)]">Rural Indiana</span></h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-xl">Zoning-friendly rural counties with affordable acreage. Noble, DeKalb, Whitley, Steuben, LaGrange, Wells, and Adams counties. Factory-direct pricing.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-8 bg-[var(--color-teal)] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer staggerDelay={150} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <FadeIn direction="up" delay={0}><div className="font-serif text-3xl font-bold"><AnimatedCounter end={7} /></div><div className="text-sm text-white/70">Rural Counties</div></FadeIn>
            <FadeIn direction="up" delay={150}><div className="font-serif text-3xl font-bold">$3-10K</div><div className="text-sm text-white/70">Per Acre</div></FadeIn>
            <FadeIn direction="up" delay={300}><div className="font-serif text-3xl font-bold"><AnimatedCounter end={20} suffix=" mi" /></div><div className="text-sm text-white/70">From Factory</div></FadeIn>
            <FadeIn direction="up" delay={450}><div className="font-serif text-3xl font-bold">Low</div><div className="text-sm text-white/70">Restrictions</div></FadeIn>
          </StaggerContainer>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-[var(--color-charcoal)]/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-10">
              <H2 className="font-serif text-3xl font-light mb-4">Rural Indiana Living</H2>
              <p className="text-[var(--color-gray)]">Why rural counties are perfect for manufactured homes</p>
            </div>
          </FadeIn>
          <div className="space-y-6">
            {aeoContent.map((section, idx) => (
              <FadeIn key={idx} direction="up" delay={idx * 100}>
                <div className="bg-[var(--color-cream-dark)] rounded-lg p-6 border-l-4 border-[var(--color-teal)]">
                  <H3 className="font-semibold text-lg mb-3">{section.question}</H3>
                  <p className="text-[var(--color-gray)] leading-relaxed"><strong className="text-[var(--color-charcoal)]">{section.directAnswer}</strong> {section.supportingDetails.join(" ")}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <div className="decorative-line mx-auto mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">Rural Counties <span className="italic text-[var(--color-teal)]">We Serve</span></H2>
            </div>
          </FadeIn>

          <StaggerContainer staggerDelay={100} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ruralCounties.map((county, idx) => (
              <FadeIn key={county.name} direction="up" delay={idx * 100}>
                <div className="bg-white rounded-xl p-6 border border-[var(--color-charcoal)]/5 hover:shadow-lg transition-all hover:-translate-y-1">
                  <H3 className="font-serif text-xl font-semibold mb-2">{county.name}</H3>
                  <p className="text-sm text-[var(--color-gray)] mb-3">{county.cities}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-teal)] font-medium">{county.distance}</span>
                    <span className="text-[var(--color-gray)]">{county.highlight}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn direction="up" delay={0}>
              <div className="bg-[var(--color-lime)]/10 rounded-xl p-8">
                <H3 className="font-serif text-xl font-semibold mb-4 text-[var(--color-lime-dark)]">Rural Advantages</H3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2"><span className="text-[var(--color-lime)] mt-1">✓</span><span>Affordable land prices</span></li>
                  <li className="flex items-start gap-2"><span className="text-[var(--color-lime)] mt-1">✓</span><span>Zoning-friendly regulations</span></li>
                  <li className="flex items-start gap-2"><span className="text-[var(--color-lime)] mt-1">✓</span><span>Lower property taxes</span></li>
                  <li className="flex items-start gap-2"><span className="text-[var(--color-lime)] mt-1">✓</span><span>Privacy and space</span></li>
                  <li className="flex items-start gap-2"><span className="text-[var(--color-lime)] mt-1">✓</span><span>Community atmosphere</span></li>
                </ul>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={150}>
              <div className="bg-[var(--color-orange)]/10 rounded-xl p-8">
                <H3 className="font-serif text-xl font-semibold mb-4 text-[var(--color-orange)]">Considerations</H3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2"><span className="text-[var(--color-orange)] mt-1">•</span><span>Well and septic needed</span></li>
                  <li className="flex items-start gap-2"><span className="text-[var(--color-orange)] mt-1">•</span><span>Longer drive to services</span></li>
                  <li className="flex items-start gap-2"><span className="text-[var(--color-orange)] mt-1">•</span><span>Road maintenance</span></li>
                  <li className="flex items-start gap-2"><span className="text-[var(--color-orange)] mt-1">•</span><span>Internet availability varies</span></li>
                  <li className="flex items-start gap-2"><span className="text-[var(--color-orange)] mt-1">•</span><span>Weather considerations</span></li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <FAQSection title="Rural Indiana FAQs" subtitle="Common questions about manufactured homes in rural Indiana counties" faqs={locationFAQs} showSchema={true} />

      <section className="py-16 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <H3 className="font-serif text-xl font-semibold mb-6">Continue Exploring</H3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPages.map((page) => (
              <Link key={page.url} href={page.url} className="bg-white rounded-xl p-6 border border-[var(--color-charcoal)]/5 hover:shadow-lg transition-all hover:-translate-y-1">
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
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">Ready for <span className="italic text-[var(--color-teal-light)]">Rural Living?</span></H2>
            <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">Browse our floor plans or call to discuss your rural Indiana property. We understand rural needs and deliver throughout northeast Indiana.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+12603081457"  className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300 rounded-lg">Call (260) 308-1457</a>
              <Link href="/floor-plans" className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300 rounded-lg">Browse Floor Plans</Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
