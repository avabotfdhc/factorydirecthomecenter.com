import Link from "next/link";
import Image from "next/image";
import { FAQSection } from "@/components/FAQSection";
import { StructuredData, structuredData, generateMetadata as genMeta } from "@/lib/seo";
import { FadeIn, StaggerContainer, AnimatedCounter, useScrollTracking } from "@/components/VisualEffects";
import { generateAltText } from "@/lib/images";
import { H2, H3, H4 } from "@/components/Heading";

export const metadata = genMeta({
  title: "Manufactured Homes Kalamazoo MI | Champion Dealer",
  description: "Champion manufactured & modular homes delivered to Kalamazoo, Michigan. 95 miles from Auburn. Serving Kalamazoo, Calhoun, Branch counties. Factory-direct pricing.",
  keywords: ["manufactured homes kalamazoo", "modular homes kalamazoo michigan", "mobile homes kalamazoo", "champion homes kalamazoo", "kalamazoo county manufactured homes"],
  url: "/locations/kalamazoo",
  type: "article",
});

const aeoContent = [
  { question: "Do you deliver manufactured homes to Kalamazoo, Michigan?", directAnswer: "Yes, Factory Direct Homes Center delivers manufactured and modular homes throughout Kalamazoo and southwest Michigan.", supportingDetails: ["We serve Kalamazoo County and surrounding areas including Calhoun, Branch, and St. Joseph counties.", "Our Auburn showroom is 95 miles from Kalamazoo, with regular deliveries across the Michigan border."], wordCount: 47 },
  { question: "What is the cost to deliver a manufactured home to Kalamazoo?", directAnswer: "Delivery to Kalamazoo costs approximately $3,800 for the 95-mile transport from our Auburn showroom.", supportingDetails: ["This covers interstate transportation of the home to your site; setup is handled by the contractor you hire.", "We regularly deliver to Michigan and handle the cross-border transport requirements."], wordCount: 44 },
  { question: "Can I buy a manufactured home in Michigan from an Indiana dealer?", directAnswer: "Yes, we regularly deliver to Michigan and handle the interstate transport logistics.", supportingDetails: ["Champion homes meet Michigan building codes and standards.", "Your contractor handles local permits and inspections with Michigan authorities."], wordCount: 45 }
];

const locationFAQs = [
  { question: "Do you deliver to Kalamazoo city limits?", answer: "Yes, we deliver throughout Kalamazoo and surrounding communities including Portage, Battle Creek, and Marshall. Our 95-mile service radius from Auburn covers southwest Michigan including Kalamazoo, Calhoun, and Branch counties." },
  { question: "What Michigan counties do you serve?", answer: "We serve Kalamazoo County (Kalamazoo, Portage), Calhoun County (Battle Creek, Marshall), Branch County (Coldwater), St. Joseph County (Sturgis), Cass County (Dowagiac), and Van Buren County (South Haven). We regularly deliver throughout southwest Michigan." },
  { question: "Are there extra costs for Michigan delivery?", answer: "Michigan delivery has the same transparent pricing as Indiana. The $3,800 delivery cost to Kalamazoo includes transportation and the required transport permits. Setup is arranged separately with the contractor you hire. There are no hidden interstate fees. We handle Michigan sales tax and registration requirements." }
];

const breadcrumbs = [{ name: "Home", url: "/" }, { name: "Locations", url: "/locations" }, { name: "Kalamazoo", url: "/locations/kalamazoo" }];
const relatedPages = [{ title: "Floor Plans", url: "/floor-plans", description: "Browse homes for Michigan delivery" }, { title: "Financing", url: "/financing", description: "Financing for Michigan buyers" }, { title: "Fort Wayne", url: "/locations/fort-wayne", description: "Our location near Michigan border" }];

export default function KalamazooPage() {
  return (
    <>
      <StructuredData data={structuredData.localBusiness()} />
      <StructuredData data={structuredData.website()} />
      <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      <StructuredData data={structuredData.article({ headline: "Manufactured Homes Kalamazoo MI", description: "Champion homes delivered to Kalamazoo, Michigan", image: "/images/hero-home.jpg", datePublished: "2024-01-01", dateModified: new Date().toISOString(), author: "Factory Direct Homes Center", url: "/locations/kalamazoo" })} />
      <StructuredData data={structuredData.service({ name: "Manufactured Home Delivery Kalamazoo", description: "Manufactured home delivery to Kalamazoo and southwest Michigan", provider: "Factory Direct Homes Center", areaServed: "Kalamazoo, Michigan" })} />
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
          <Image src="/images/hero-home.jpg" alt={generateAltText("location", { name: "Manufactured Homes Kalamazoo Michigan", location: "Kalamazoo, MI" })} fill className="object-cover opacity-30" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/80 via-[var(--color-charcoal)]/60 to-[var(--color-charcoal)]/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="decorative-line" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">Southwest Michigan</span>
              </div>
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">Manufactured Homes <span className="italic text-[var(--color-teal-light)]">Kalamazoo</span></h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-xl">Champion manufactured & modular homes delivered to Kalamazoo and southwest Michigan. Serving Kalamazoo, Calhoun, and Branch counties.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-8 bg-[var(--color-teal)] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer staggerDelay={150} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <FadeIn direction="up" delay={0}><div className="font-serif text-3xl font-bold"><AnimatedCounter end={95} suffix=" mi" /></div><div className="text-sm text-white/70">From Showroom</div></FadeIn>
            <FadeIn direction="up" delay={150}><div className="font-serif text-3xl font-bold">$3,800</div><div className="text-sm text-white/70">Est. Delivery</div></FadeIn>
            <FadeIn direction="up" delay={300}><div className="font-serif text-3xl font-bold"><AnimatedCounter end={6} /></div><div className="text-sm text-white/70">MI Counties</div></FadeIn>
            <FadeIn direction="up" delay={450}><div className="font-serif text-3xl font-bold"><AnimatedCounter end={8} suffix="-12" /></div><div className="text-sm text-white/70">Weeks Delivery</div></FadeIn>
          </StaggerContainer>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-[var(--color-charcoal)]/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-10">
              <H2 className="font-serif text-3xl font-light mb-4">Manufactured Homes in Kalamazoo</H2>
              <p className="text-[var(--color-gray)]">Everything you need to know about buying in southwest Michigan</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <FadeIn direction="up">
              <div>
                <div className="decorative-line mb-6" />
                <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">Serving <span className="italic text-[var(--color-teal)]">Kalamazoo</span> & SW Michigan</H2>
                <p className="text-[var(--color-gray)] leading-relaxed mb-8">Kalamazoo is home to Western Michigan University and major employers like Pfizer and Stryker. From the vibrant downtown to suburban Portage, we deliver throughout the region.</p>
                <div className="mb-8">
                  <H3 className="font-semibold mb-4">Michigan Counties Served:</H3>
                  <div className="flex flex-wrap gap-2">
                    {["Kalamazoo", "Calhoun", "Branch", "St. Joseph", "Cass", "Van Buren"].map((county) => (
                      <span key={county} className="text-xs bg-[var(--color-teal)]/10 text-[var(--color-teal)] px-3 py-1.5 rounded-full font-medium">{county} County</span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={200}>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <H3 className="font-serif text-2xl font-semibold mb-6">Nearby Michigan Cities</H3>
                <div className="space-y-4">
                  {["Battle Creek (85 mi)", "Portage (90 mi)", "Coldwater (80 mi)", "Jackson (120 mi)"].map((city) => (
                    <div key={city} className="flex justify-between items-center py-3 border-b border-[var(--color-charcoal)]/5 last:border-0">
                      <span className="font-medium">{city.split(" (")[0]}</span>
                      <span className="text-sm text-[var(--color-gray)]">{city.match(/\((.*)\)/)?.[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <FAQSection title="Kalamazoo Michigan FAQs" subtitle="Common questions about manufactured homes in Kalamazoo and southwest Michigan" faqs={locationFAQs} showSchema={true} />

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
            <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">Ready for Your <span className="italic text-[var(--color-teal-light)]">Kalamazoo Home?</span></H2>
            <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">Browse our floor plans or call to discuss delivery to your Michigan property. Factory-direct pricing across state lines.</p>
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
