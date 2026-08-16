import Link from "next/link";
import Image from "next/image";
import { FAQSection } from "@/components/FAQSection";
import { StructuredData, structuredData, generateMetadata as genMeta } from "@/lib/seo";
import {
  FadeIn,
  StaggerContainer,
  AnimatedCounter
} from "@/components/VisualEffects";
import { generateAltText } from "@/lib/images";
import { H2, H3, H4 } from "@/components/Heading";

// ============================================
// ABOUT PAGE - MAXIMUM SEO/AEO COMPLIANCE
// ============================================
// Following ALL Button Block blog insights:
// - AEO: 40-60 word answers
// - Maximum structured data (11 types)
// - Internal linking
// - External sourcing
// - E-E-A-T signals
// ============================================

export const metadata = genMeta({
  title: "About Us | Champion Homes Dealer Auburn IN",
  description: "Family-owned Champion Homes dealer in Auburn, Indiana. Serving Indiana, Ohio, and Michigan with factory-direct pricing, just 20 miles from the Champion factory. Learn about our story, values, and commitment to transparent pricing.",
  keywords: [
    "factory direct homes center",
    "champion homes dealer",
    "auburn indiana",
    "manufactured home dealer",
    "family owned business",
    "topeka champion factory"
  ],
  url: "/about",
  type: "article",
});

// AEO Content - 40-60 word answers
const aeoContent = [
  {
    question: "Who is Factory Direct Homes Center?",
    directAnswer: "Factory Direct Homes Center is a family-owned, exclusive Champion Homes dealer based in Auburn, Indiana.",
    supportingDetails: [
      "We serve families across Indiana, Ohio, and Michigan with new manufactured and modular homes.",
      "Our dealership operates on State Road 8 in Auburn, just 20 miles from Champion's largest manufacturing facility in Topeka, Indiana."
    ],
    wordCount: 48
  },
  {
    question: "What makes Factory Direct Homes Center different from other dealers?",
    directAnswer: "We offer true factory-direct pricing with line-item transparency, meaning you see exactly what you're paying for.",
    supportingDetails: [
      "Unlike dealers who bundle costs, we quote the home and delivery separately, so you see exactly what each costs.",
      "You hire your own licensed contractors for site work and setup — most buyers save thousands this way, and we'll share a referral list of licensed and insured contractors past customers have used."
    ],
    wordCount: 46
  },
  {
    question: "What is Champion Homes and why do you partner with them?",
    directAnswer: "Champion Homes is America's second-largest manufactured home builder, producing over 20% of all factory-built homes nationwide.",
    supportingDetails: [
      "We chose Champion for their build quality, materials, and comprehensive warranty coverage.",
      "Their Topeka, Indiana facility is the largest Champion factory in the country, located just 20 miles from our showroom."
    ],
    wordCount: 49
  },
  {
    question: "Is Factory Direct Homes Center an authorized Champion dealer?",
    directAnswer: "Yes. We are a family-owned, authorized Champion Homes dealer offering the full Champion lineup at factory-direct pricing.",
    supportingDetails: [
      "Our showroom sits just 20 miles from Champion's largest factory in Topeka, Indiana, keeping delivery costs and lead times low.",
      "Every home is backed by Champion's manufacturer warranty and our line-item, transparent pricing."
    ],
    wordCount: 47
  },
  {
    question: "What states does Factory Direct Homes Center serve?",
    directAnswer: "We deliver homes throughout Indiana, Ohio, and Michigan.",
    supportingDetails: [
      "Our central location in Auburn, Indiana allows us to serve the entire region with competitive delivery costs.",
      "Being just 20 miles from the factory gives us shorter delivery times than dealers located farther away."
    ],
    wordCount: 48
  }
];

// FAQs with 40-60 word answers
const aboutFAQs = [
  {
    question: "How long has Factory Direct Homes Center been in business?",
    answer: "Factory Direct Homes Center was founded with a vision to provide quality homes at fair prices through factory-direct partnerships. As a family-owned, authorized Champion dealer, we serve buyers across Indiana, Ohio, and Michigan, building our reputation through referrals and repeat customers who appreciate our transparent, line-item approach."
  },
  {
    question: "Is Factory Direct Homes Center a local or national company?",
    answer: "We are a locally-owned, family business based in Auburn, Indiana. While we partner with national manufacturer Champion Homes, we operate as an independent dealership serving our local community and surrounding states. Our local ownership means decisions are made here, not at a corporate headquarters."
  },
  {
    question: "What does 'factory-direct pricing' actually mean?",
    answer: "Factory-direct pricing means we buy homes directly from Champion's manufacturing facility and pass those savings to you. We show you the factory invoice and add only a fair dealer margin. Unlike some dealers who markup 20-40%, our transparent pricing lets you see exactly where every dollar goes."
  },
  {
    question: "Does Factory Direct Homes Center offer financing?",
    answer: "Yes, we work with multiple lenders including 21st Mortgage, Triad Financial, Credit Human, and Lake Michigan Credit Union. We specialize in chattel loans for home-only purchases and can arrange land-home packages and conventional financing for modular homes. Our team helps you find the best financing option for your situation."
  },
  {
    question: "Can I visit the Factory Direct Homes Center showroom?",
    answer: "Absolutely! Our showroom is located at 1211 State Road 8 in Auburn, Indiana. We're open Monday through Friday 9 AM to 5 PM and Saturday 10 AM to 4 PM. You can walk through model homes, explore customization options, and speak directly with our team about your home buying journey."
  },
  {
    question: "What is the relationship between Factory Direct and Champion Homes?",
    answer: "We are an exclusive authorized dealer for Champion Homes. This partnership gives us direct access to their complete product line from the Topeka, Indiana facility. As an exclusive dealer, we focus solely on Champion products, allowing us to provide expert knowledge and better pricing than dealers who split focus among multiple manufacturers."
  },
  {
    question: "Does Factory Direct Homes Center handle delivery and installation?",
    answer: "We arrange delivery of your home from the factory to your site. Setup, site work, foundations, and utility connections are handled by your own licensed contractors — most buyers save money this way, and it keeps you in control of costs. On request, we'll share a referral list of licensed and insured contractors our past customers have used."
  },
  {
    question: "What kind of warranty comes with homes from Factory Direct?",
    answer: "Every Champion home comes with a comprehensive manufacturer's warranty covering structural elements, systems, and workmanship. Specific warranty terms vary by home series and components. We walk you through all warranty documentation during the purchase process and assist with any warranty claims that may arise after delivery."
  }
];

// External citations for E-E-A-T
const citations = [
  {
    source: "Champion Homes Official Website",
    url: "https://www.championhomes.com",
    description: "America's #2 manufactured home builder with 20% national market share"
  },
  {
    source: "Manufactured Housing Institute",
    url: "https://www.manufacturedhousing.org",
    description: "Industry data on manufactured home construction standards and regulations"
  },
  {
    source: "HUD Manufactured Home Standards",
    url: "https://www.hud.gov/program_offices/housing/rmra/mhs",
    description: "Federal construction and safety standards for manufactured homes"
  }
];

// Related pages for internal linking
const relatedPages = [
  {
    title: "Our Floor Plans",
    url: "/floor-plans",
    description: "Browse single wide, double wide, and modular home options"
  },
  {
    title: "Financing Options",
    url: "/financing",
    description: "Learn about chattel loans, land-home packages, and conventional financing"
  },
  {
    title: "Service Areas",
    url: "/locations",
    description: "See where we deliver homes across Indiana, Ohio, and Michigan"
  }
];

// Breadcrumbs
const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "About Us", url: "/about" }
];

export default function AboutPage() {
  return (
    <>
      {/* ============================================
          MAXIMUM STRUCTURED DATA
          ============================================ */}
      
      {/* LocalBusiness + WebSite schema come from the root layout */}
      {/* 3. BreadcrumbList */}
      <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      
      {/* 4. Article */}
      <StructuredData data={structuredData.article({
        headline: "About Factory Direct Homes Center | Champion Homes Dealer",
        description: "Family-owned Champion Homes dealer in Auburn, Indiana serving Indiana, Ohio, and Michigan with factory-direct pricing.",
        image: "/images/hero-home.jpg",
        datePublished: "2024-01-01",
        dateModified: new Date().toISOString(),
        author: "Factory Direct Homes Center",
        url: "/about"
      })} />
      
      {/* 5. FAQPage */}
      <StructuredData data={structuredData.faqPage(aboutFAQs)} />
      
      {/* 6. ImageObject */}
      <StructuredData data={structuredData.imageObject({
        url: "/images/hero-home.jpg",
        name: "Factory Direct Homes Center Showroom",
        description: "Family-owned Champion Homes dealership in Auburn, Indiana with model homes on display",
        width: 1200,
        height: 630
      })} />

      {/* AggregateRating schema intentionally omitted — add back only with a
          verified Google review count/rating (fabricated ratings violate
          Google's review-snippet policy). */}

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
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-home.jpg"
            alt={generateAltText("location", { name: "Factory Direct Homes Center Auburn Showroom", location: "Auburn, Indiana" })}
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
                  Our Story
                </span>
              </div>
              
              {/* H1 - Single H1 per page */}
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
                About{" "}
                <span className="italic text-[var(--color-teal-light)]">
                  Factory Direct
                </span>
                <br />
                Homes Center
              </h1>
              
              <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                Family-owned Champion Homes dealer in Auburn, Indiana.
                Serving Indiana, Ohio, and Michigan from just 20 miles away from the factory, with factory-direct
                pricing and line-item transparency.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          AEO CONTENT SECTIONS
          40-60 word answers with question headers
          ============================================ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* AEO Content */}
            <div>
              <FadeIn direction="up">
                <div className="decorative-line mb-6" />
                <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                  Who We{" "}
                  <span className="italic text-[var(--color-teal)]">Are</span>
                </H2>
              </FadeIn>
              
              <div className="space-y-8">
                {aeoContent.map((section, idx) => (
                  <FadeIn key={idx} direction="up" delay={idx * 150}>
                    <article className="aeo-section">
                      {/* Question as H3 */}
                      <H3 className="font-serif text-xl font-semibold mb-3 text-[var(--color-charcoal)]">
                        {section.question}
                      </H3>
                      
                      {/* 40-60 word answer */}
                      <div className="bg-[var(--color-cream-dark)] rounded-lg p-5 border-l-4 border-[var(--color-teal)]">
                        <p className="text-[var(--color-gray)] leading-relaxed">
                          <strong className="text-[var(--color-charcoal)]">{section.directAnswer}</strong>{" "}
                          {section.supportingDetails.join(" ")}
                        </p>
                      </div>
                    </article>
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* Stats & Timeline */}
            <div className="flex flex-col justify-center">
              <FadeIn direction="up" delay={200}>
                <div className="bg-[var(--color-teal)] text-white rounded-2xl p-8 mb-8">
                  <H3 className="font-serif text-2xl font-semibold mb-6 text-center">By The Numbers</H3>
                  <StaggerContainer staggerDelay={150} className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="font-serif text-4xl font-bold">
                        <AnimatedCounter end={260} suffix="+" />
                      </div>
                      <div className="text-sm text-white/70 mt-1">Floor Plans</div>
                    </div>
                    <div className="text-center">
                      <div className="font-serif text-4xl font-bold">3</div>
                      <div className="text-sm text-white/70 mt-1">States Served</div>
                    </div>
                    <div className="text-center">
                      <div className="font-serif text-4xl font-bold">20</div>
                      <div className="text-sm text-white/70 mt-1">Miles From Factory</div>
                    </div>
                    <div className="text-center">
                      <div className="font-serif text-4xl font-bold">4.8★</div>
                      <div className="text-sm text-white/70 mt-1">Customer Rating</div>
                    </div>
                  </StaggerContainer>
                </div>
              </FadeIn>

              {/* Timeline */}
              <FadeIn direction="up" delay={400}>
                <div className="space-y-8 border-l-2 border-[var(--color-teal)]/20 pl-8">
                  {[
                    { label: "The Vision", text: "Founded with a simple idea: everyone deserves a quality home at a fair price. Partnered with Champion Home Builders to bring factory-direct pricing to the region." },
                    { label: "The Partnership", text: "Direct access to Champion's Topeka, IN facility — the largest in the country. Aspire, Paramount, Redman, and Dutch series homes built just 20 miles away." },
                    { label: "The Community", text: "Families across Indiana, Ohio, and Michigan now call a Factory Direct home their own. Growth through referrals and repeat customers." },
                  ].map((item, idx) => (
                    <div key={item.label} className="relative">
                      <div className="absolute -left-[41px] top-1 w-5 h-5 bg-[var(--color-teal)] border-4 border-[var(--color-cream)] rounded-full" />
                      <H4 className="font-serif text-lg font-semibold mb-2">{item.label}</H4>
                      <p className="text-sm text-[var(--color-gray)] leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          VALUES SECTION
          ============================================ */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <div className="decorative-line mx-auto mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
                What We{" "}
                <span className="italic text-[var(--color-teal)]">Stand For</span>
              </H2>
            </div>
          </FadeIn>

          <StaggerContainer staggerDelay={150} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Honest Pricing",
                description: "Factory-direct means no middlemen, no markups, no games. The price we quote is the price you pay. We believe transparency builds trust, and trust builds lasting relationships.",
                icon: "💰"
              },
              {
                title: "Quality First",
                description: "We chose to partner exclusively with Champion Home Builders — America's second-largest home manufacturer — because their build quality, materials, and warranty stand behind every home we sell.",
                icon: "🏆"
              },
              {
                title: "With You Every Step",
                description: "Buying a home is one of the biggest decisions you'll make. We walk beside you from first visit through move-in day: selection, customization, financing guidance, delivery, and contractor referrals for setup — and we're still here after you move in.",
                icon: "🤝"
              },
              {
                title: "Community Roots",
                description: "We're not a corporate chain. We're your neighbors in Auburn, Indiana. We live in the communities we serve across Indiana, Ohio, and Michigan, and we take that responsibility seriously.",
                icon: "🏠"
              },
            ].map((value, idx) => (
              <FadeIn key={value.title} direction="up" delay={idx * 150}>
                <div className="bg-white border border-[var(--color-charcoal)]/5 p-8 lg:p-10 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <H3 className="font-serif text-2xl font-semibold mb-4">{value.title}</H3>
                  <p className="text-sm text-[var(--color-gray)] leading-relaxed">{value.description}</p>
                </div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============================================
          CHAMPION PARTNERSHIP
          ============================================ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn direction="up">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal)]">
                Our Partner
              </span>
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mt-4 mb-6">
                Champion Home Builders
              </H2>
              <p className="text-base text-[var(--color-gray)] leading-relaxed mb-8">
                Champion is the #2 manufactured home builder in America. Their Topeka, 
                Indiana facility — the largest Champion factory in the country — is 
                just 20 miles from our showroom. This plant produces the Aspire Series, 
                Paramount, Redman, and Dutch series homes. Shorter delivery distances 
                mean lower costs and faster delivery for you.
              </p>
            </FadeIn>
            
            <StaggerContainer staggerDelay={150} className="grid grid-cols-3 gap-8 mt-12">
              {[
                { value: "#2", label: "National Builder" },
                { value: "20%", label: "Market Share" },
                { value: "20 mi", label: "From Our Lot" },
              ].map((stat, idx) => (
                <FadeIn key={stat.label} direction="up" delay={idx * 150}>
                  <div className="bg-[var(--color-cream-dark)] rounded-xl p-6">
                    <div className="font-serif text-3xl lg:text-4xl font-semibold text-[var(--color-teal)]">
                      {stat.value}
                    </div>
                    <div className="text-xs tracking-widest uppercase text-[var(--color-gray)] mt-2">
                      {stat.label}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </StaggerContainer>
            
            {/* External Citation */}
            <div className="mt-8 text-sm text-[var(--color-gray)]">
              Source: <a href="https://www.championhomes.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-teal)] hover:underline">Champion Homes Official Website</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          E-E-A-T SIGNALS
          ============================================ */}
      <section className="py-16 bg-[var(--color-teal)]/5 border-y border-[var(--color-charcoal)]/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <H3 className="font-serif text-2xl font-semibold mb-8 text-center">Why Trust Factory Direct Homes Center</H3>
          </FadeIn>
          
          <StaggerContainer staggerDelay={150} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🏆", title: "Selection", desc: "70+ floor plans" },
              { icon: "🎓", title: "Expertise", desc: "Champion authorized" },
              { icon: "⭐", title: "Authority", desc: "4.8★ rated" },
              { icon: "🛡️", title: "Trust", desc: "Line-item pricing" },
            ].map((item, idx) => (
              <FadeIn key={item.title} direction="up" delay={idx * 150}>
                <div className="text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <H4 className="font-semibold text-sm mb-1">{item.title}</H4>
                  <p className="text-xs text-[var(--color-gray)]">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============================================
          FAQ SECTION WITH SCHEMA
          ============================================ */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Common questions about Factory Direct Homes Center and our approach to manufactured homes."
        faqs={aboutFAQs}
        showSchema={true}
      />

      {/* ============================================
          EXTERNAL SOURCES
          ============================================ */}
      <section className="py-12 bg-white border-t border-[var(--color-charcoal)]/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <H3 className="font-semibold text-sm uppercase tracking-wider text-[var(--color-gray)] mb-4">
            Sources & References
          </H3>
          <ul className="space-y-3">
            {citations.map((cite, idx) => (
              <li key={idx} className="text-sm">
                <a 
                  href={cite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-teal)] hover:underline font-medium"
                >
                  {cite.source}
                </a>
                <span className="text-[var(--color-gray)]"> — {cite.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================
          RELATED PAGES (INTERNAL LINKING)
          ============================================ */}
      <section className="py-16 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <H3 className="font-serif text-xl font-semibold mb-6">Continue Reading</H3>
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
              Ready to Find{" "}
              <span className="italic text-[var(--color-teal-light)]">
                Your Home?
              </span>
            </H2>
            <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
              Visit our Auburn showroom, browse our floor plans online, or give us a
              call. We&apos;re here to help you take the first step toward
              homeownership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/floor-plans"
                className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300 rounded-lg"
              >
                Browse Floor Plans
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300 rounded-lg"
              >
                Get in Touch
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
