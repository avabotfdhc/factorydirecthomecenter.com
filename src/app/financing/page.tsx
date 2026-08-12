import Link from "next/link";
import Image from "next/image";
import { FAQSection } from "@/components/FAQSection";
import { StructuredData, structuredData, generateMetadata as genMeta } from "@/lib/seo";
import {
  FadeIn,
  StaggerContainer
} from "@/components/VisualEffects";
import { generateAltText } from "@/lib/images";
import { H2, H3, H4 } from "@/components/Heading";
import { PaymentCalculator } from "@/components/PaymentCalculator";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

// ============================================
// FINANCING PAGE - MAXIMUM SEO/AEO
// ============================================
// Service schema for financing
// AEO content with 40-60 word answers
// FAQ schema
// HowTo schema for process
// ============================================

export const metadata = genMeta({
  title: "Manufactured Home Financing & Chattel Loans",
  description: "Financing options for manufactured homes in Indiana, Ohio, Michigan. Chattel loans, land-home packages, and conventional financing through partners like 21st Mortgage, Triad, and Credit Human. Pre-qualify today.",
  keywords: [
    "manufactured home financing",
    "chattel loans",
    "manufactured home loans indiana",
    "21st mortgage",
    "triad financial",
    "land home packages"
  ],
  url: "/financing",
  type: "article",
});

// AEO Content - 40-60 word answers
const aeoContent = [
  {
    question: "What financing options are available for manufactured homes?",
    directAnswer: "We offer chattel (home-only) loans, land-home packages, and conventional financing through our lending partners.",
    supportingDetails: [
      "Our primary lenders include 21st Mortgage, Triad Financial Services, Credit Human, and Lake Michigan Credit Union.",
      "Each option has different requirements, rates, and terms depending on your situation."
    ],
    wordCount: 48
  },
  {
    question: "What is a chattel loan and how does it work?",
    directAnswer: "A chattel loan treats your manufactured home as personal property, similar to a car loan, rather than real estate.",
    supportingDetails: [
      "This means you can finance the home without owning the land, making it ideal for leased lots or family property.",
      "Chattel loans typically have higher rates than mortgages but offer easier qualification and faster approval."
    ],
    wordCount: 50
  },
  {
    question: "What credit score is needed to finance a manufactured home?",
    directAnswer: "Our lenders work with credit scores as low as 575 for chattel loans, though 620+ gets better rates.",
    supportingDetails: [
      "We have options for a range of credit situations and can help you understand your best path forward.",
      "Pre-qualification is free and helps you see what you can afford before choosing a home."
    ],
    wordCount: 47
  },
  {
    question: "How much down payment is required for a manufactured home?",
    directAnswer: "Down payments typically range from 5-10% for chattel loans, depending on your financing option and credit.",
    supportingDetails: [
      "Conventional land-home packages may require 10-20% down.",
      "Cash buyers receive preferred pricing discounts on the home purchase."
    ],
    wordCount: 45
  }
];

// FAQs with 40-60 word answers
const financingFAQs = [
  {
    question: "What is the difference between a chattel loan and a mortgage?",
    answer: "A chattel loan treats the home as personal property, like a vehicle, while a mortgage treats it as real estate. Chattel loans don't require land ownership, have faster approval, but typically higher rates. Mortgages require permanent foundations and land ownership but offer better rates and longer terms."
  },
  {
    question: "How long does loan approval take for a manufactured home?",
    answer: "Pre-qualification can be completed in minutes online or over the phone. Full loan approval typically takes 3-7 business days once all documentation is submitted. This is significantly faster than traditional site-built home mortgages, which often take 30-45 days."
  },
  {
    question: "Can I refinance my manufactured home later?",
    answer: "Yes, many homeowners refinance their manufactured homes after improving their credit or paying down the loan. If you purchase land later, you may be able to refinance from a chattel loan to a traditional mortgage, potentially lowering your interest rate and monthly payment."
  },
  {
    question: "What documents do I need to apply for manufactured home financing?",
    answer: "You'll typically need proof of income (pay stubs, tax returns), bank statements, identification, and information about the home you want to purchase. For land-home packages, you'll also need property information. Our lenders guide you through the specific requirements for your loan type."
  },
  {
    question: "Does Factory Direct Homes Center offer in-house financing?",
    answer: "We don't provide in-house financing, but we partner with the nation's top manufactured home lenders. This gives you access to competitive rates and terms from 21st Mortgage, Triad Financial, Credit Human, and local credit unions. We help you compare options and choose the best fit."
  },
  {
    question: "What interest rates can I expect for a manufactured home loan?",
    answer: "Interest rates vary by loan type and credit profile. Chattel (home-only) loans typically range from 7-12%, while land-home mortgages are usually lower. Your specific rate depends on credit score, down payment, loan term, and current market conditions. We help you compare offers from our lending partners to find the best available rate."
  },
  {
    question: "Can I get pre-qualified before choosing a home?",
    answer: "Absolutely, and we recommend it. Pre-qualification shows you exactly how much home you can afford, strengthens your negotiating position, and speeds up the purchase process once you find your perfect floor plan. Most of our lenders offer free pre-qualification with no obligation."
  },
  {
    question: "Are there special programs for first-time manufactured home buyers?",
    answer: "Yes. Our lending partners offer chattel loans with flexible credit standards that work well for first-time buyers, and some states offer first-time buyer assistance programs. We help you explore all available options to make homeownership affordable and accessible."
  }
];

// Lending partners
const lendingPartners = [
  {
    name: "21st Mortgage",
    type: "Chattel & Land-Home",
    description: "One of the nation's largest manufactured home lenders specializing in chattel loans and land-home packages with competitive rates.",
    features: ["Chattel loans available", "Land-home packages", "Flexible credit requirements", "Fast approval process"],
    bestFor: "Home-only purchases, buyers without land"
  },
  {
    name: "Triad Financial Services",
    type: "Chattel Loans",
    description: "Industry leader in manufactured home financing with decades of experience in chattel lending.",
    features: ["Specialized in chattel lending", "Competitive rates", "Various term options", "Streamlined process"],
    bestFor: "Home-only financing, quick closings"
  },
  {
    name: "Credit Human",
    type: "Chattel & Mortgages",
    description: "Member-owned financial cooperative with manufactured home expertise and personalized service.",
    features: ["Member-owned cooperative", "Competitive chattel rates", "Personalized service", "Financial education resources"],
    bestFor: "Credit union members, competitive rates"
  },
  {
    name: "Lake Michigan Credit Union",
    type: "Land-Home Mortgages",
    description: "Regional credit union serving Indiana and Michigan with land-home package mortgages.",
    features: ["Regional expertise", "Land-home mortgages", "Competitive rates", "Local decision-making"],
    bestFor: "Land-home packages, Michigan buyers"
  },
  {
    name: "Local Lenders & Credit Unions",
    type: "Various",
    description: "We maintain relationships with community banks and credit unions throughout our service area.",
    features: ["Personalized service", "Local decision-making", "Community focus", "Flexible terms"],
    bestFor: "Local buyers, established relationships"
  }
];

// Loan types comparison
const loanTypes = [
  {
    name: "Chattel Loan",
    downPayment: "5-10%",
    creditScore: "575+",
    bestFor: "Home-only purchases, no land required",
    pros: ["No land required", "Faster approval", "Flexible qualification"],
    cons: ["Higher rates than mortgages", "Shorter terms (15-20 years)"]
  },
  {
    name: "Land-Home Package",
    downPayment: "5-10%",
    creditScore: "600+",
    bestFor: "Buyers who own or are buying land",
    pros: ["Longer terms", "Lower rates than chattel", "Finances home + land together"],
    cons: ["Requires land ownership", "Longer approval than chattel"]
  },
  {
    name: "Conventional",
    downPayment: "10-20%",
    creditScore: "620+",
    bestFor: "Modular homes with good credit",
    pros: ["Best interest rates", "No mortgage insurance with 20% down", "Longest terms"],
    cons: ["Higher credit requirements", "Larger down payment needed"]
  }
];

// Breadcrumbs
const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Financing", url: "/financing" }
];

// Related pages
const relatedPages = [
  {
    title: "Floor Plans",
    url: "/floor-plans",
    description: "Browse homes and get pricing to calculate your payments"
  },
  {
    title: "About Us",
    url: "/about",
    description: "Learn about our dealership and commitment to transparency"
  },
  {
    title: "Contact",
    url: "/contact-us",
    description: "Get personalized financing guidance from our team"
  }
];

// External citations
const citations = [
  {
    source: "21st Mortgage Corporation",
    url: "https://www.21stmortgage.com",
    description: "Leading manufactured home lender specializing in chattel loans"
  },
  {
    source: "Triad Financial Services",
    url: "https://www.triadfs.com",
    description: "Industry leader in manufactured home chattel financing"
  }
];

export default function FinancingPage() {
  
  return (
    <>
      {/* ============================================
          MAXIMUM STRUCTURED DATA
          ============================================ */}
      
      {/* LocalBusiness + WebSite schema come from the root layout */}
      {/* 3. BreadcrumbList */}
      <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      
      {/* 4. Service */}
      <StructuredData data={structuredData.service({
        name: "Manufactured Home Financing",
        description: "Multiple financing options for manufactured and modular homes including chattel loans, land-home packages, and conventional financing.",
        provider: "Factory Direct Homes Center",
        areaServed: "Indiana, Ohio, Michigan, Wisconsin, Illinois, Kentucky"
      })} />
      
      {/* 5. FAQPage */}
      <StructuredData data={structuredData.faqPage(financingFAQs)} />
      
      {/* 6. HowTo - Financing Process */}
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Finance a Manufactured Home",
        description: "Step-by-step guide to financing your manufactured home purchase",
        totalTime: "P7D",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Get Pre-Qualified",
            text: "Apply for pre-qualification with our lending partners to understand your budget and financing options.",
            url: "https://factorydirecthomescenter.com/financing"
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Choose Your Home",
            text: "Select your floor plan and customization options based on your pre-qualified budget.",
            url: "https://factorydirecthomescenter.com/floor-plans"
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Submit Loan Application",
            text: "Complete full loan application with required documentation.",
            url: "https://factorydirecthomescenter.com/financing"
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Loan Approval",
            text: "Lender reviews application and issues approval, typically within 3-7 business days.",
            url: "https://factorydirecthomescenter.com/financing"
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "Close and Build",
            text: "Sign final paperwork and Champion begins building your home.",
            url: "https://factorydirecthomescenter.com/financing"
          }
        ]
      }} />
      
      {/* 7. ImageObject */}
      <StructuredData data={structuredData.imageObject({
        url: "/images/hero-home.jpg",
        name: "Manufactured Home Financing Options",
        description: "Multiple financing options available including chattel loans, land-home packages, and conventional financing",
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
            src="/images/hero-home.jpg"
            alt={generateAltText("location", { name: "Financing Options at Factory Direct Homes Center", location: "Auburn, Indiana" })}
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
                  Financing Solutions
                </span>
              </div>
              
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
                Manufactured Home{" "}
                <span className="italic text-[var(--color-teal-light)]">
                  Financing
                </span>
              </h1>
              
              <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                Multiple financing options for every situation. Chattel (home-only) loans,
                land-home packages, and conventional financing. We work with the nation&rsquo;s
                top manufactured-home lenders to find your best rate.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          PAYMENT CALCULATOR
          ============================================ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-12">
              <div className="decorative-line mx-auto mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-4">
                Calculate Your <span className="italic text-[var(--color-teal)]">Monthly Payment</span>
              </H2>
              <p className="text-[var(--color-gray)] max-w-2xl mx-auto">
                Estimate your monthly payment based on home price, down payment, credit score, and loan type.
              </p>
            </div>
          </FadeIn>
          <PaymentCalculator />
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
                Understanding Your Financing Options
              </H2>
              <p className="text-[var(--color-gray)]">
                Common questions about manufactured home financing
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
          LENDING PARTNERS
          ============================================ */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <div className="decorative-line mx-auto mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
                Our <span className="italic text-[var(--color-teal)]">Lending Partners</span>
              </H2>
              <p className="text-[var(--color-gray)] mt-4 max-w-2xl mx-auto">
                We work with the nation's top manufactured home lenders to find the best option for your situation.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer staggerDelay={150} className="space-y-6">
            {lendingPartners.map((partner, idx) => (
              <FadeIn key={partner.name} direction="up" delay={idx * 150}>
                <div className="bg-white rounded-xl p-8 border border-[var(--color-charcoal)]/5 hover:shadow-lg transition-shadow">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    <div className="lg:col-span-1">
                      <H3 className="font-serif text-xl font-semibold mb-1">{partner.name}</H3>
                      <span className="inline-block bg-[var(--color-teal)]/10 text-[var(--color-teal)] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                        {partner.type}
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <p className="text-[var(--color-gray)] mb-4">{partner.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {partner.features.map((feature) => (
                          <span key={feature} className="text-xs bg-[var(--color-cream-dark)] px-3 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="lg:col-span-1 lg:text-right">
                      <p className="text-sm text-[var(--color-gray)] mb-2">Best for:</p>
                      <p className="text-sm font-medium">{partner.bestFor}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============================================
          LOAN TYPES COMPARISON
          ============================================ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <div className="decorative-line mx-auto mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
                Compare <span className="italic text-[var(--color-teal)]">Loan Types</span>
              </H2>
            </div>
          </FadeIn>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[var(--color-charcoal)]">
                  <th className="text-left py-4 font-semibold">Loan Type</th>
                  <th className="text-left py-4 font-semibold">Down Payment</th>
                  <th className="text-left py-4 font-semibold">Credit Score</th>
                  <th className="text-left py-4 font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {loanTypes.map((loan, idx) => (
                  <tr key={loan.name} className="border-b border-[var(--color-charcoal)]/10">
                    <td className="py-4">
                      <div className="font-semibold">{loan.name}</div>
                    </td>
                    <td className="py-4 text-[var(--color-teal)] font-semibold">{loan.downPayment}</td>
                    <td className="py-4">{loan.creditScore}</td>
                    <td className="py-4 text-sm">{loan.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <FadeIn direction="up" delay={0}>
              <div className="bg-[var(--color-lime)]/10 rounded-xl p-8">
                <H3 className="font-serif text-xl font-semibold mb-4 text-[var(--color-lime-dark)]">Pros of Our Financing</H3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Multiple lender options ensure competitive rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Fast approval - often within 3-7 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Options for various credit situations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>No land required for chattel loans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-lime)] mt-1">✓</span>
                    <span>Land-home packages for buyers who own land</span>
                  </li>
                </ul>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={150}>
              <div className="bg-[var(--color-orange)]/10 rounded-xl p-8">
                <H3 className="font-serif text-xl font-semibold mb-4 text-[var(--color-orange)]">What to Consider</H3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>Chattel rates higher than traditional mortgages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>Shorter loan terms (15-20 years typical)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>Credit score affects rate significantly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>Land required for best mortgage rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-orange)] mt-1">•</span>
                    <span>Pre-qualification recommended before shopping</span>
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
        title="Financing FAQs"
        subtitle="Common questions about manufactured home financing and loan options"
        faqs={financingFAQs}
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
              Ready to Get{" "}
              <span className="italic text-[var(--color-teal-light)]">
                Pre-Qualified?
              </span>
            </H2>
            <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
              We&apos;ll connect you with the right lender for your situation. 
              No obligation, no pressure — just honest information about your options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+12603081457"

                className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300 rounded-lg"
              >
                Call (260) 308-1457
              </a>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300 rounded-lg"
              >
                Request Info
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
