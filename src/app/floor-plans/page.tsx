import Link from "next/link";
import Image from "next/image";
import { FAQSection } from "@/components/FAQSection";
import { StructuredData, structuredData, generateMetadata as genMeta } from "@/lib/seo";
import {
  FadeIn,
  StaggerContainer,
  useScrollTracking
} from "@/components/VisualEffects";
import { generateAltText } from "@/lib/images";
import { H2, H3, H4 } from "@/components/Heading";
import { FloorPlanComparison } from "@/components/FloorPlanComparison";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

// ============================================
// FLOOR PLANS PAGE - MAXIMUM SEO/AEO
// ============================================
// Product schema for each home
// AEO content with 40-60 word answers
// FAQ schema
// Internal linking
// ============================================

export const metadata = genMeta({
  title: "Manufactured Home Floor Plans | Champion Single Wide, Double Wide, Modular",
  description: "Browse 20+ Champion floor plans. Single wide from $50K, double wide from $80K, modular from $100K. All customizable. Factory-direct pricing from Auburn, IN.",
  keywords: [
    "manufactured home floor plans",
    "champion homes floor plans",
    "single wide floor plans",
    "double wide floor plans",
    "modular home floor plans",
    "3 bedroom manufactured home",
    "4 bedroom modular home"
  ],
  url: "/floor-plans",
});

// AEO Content - 40-60 word answers
const aeoContent = [
  {
    question: "What types of floor plans does Factory Direct Homes Center offer?",
    directAnswer: "We offer three categories: single wide homes (500-1,200 sq ft), double wide homes (1,000-2,400+ sq ft), and modular homes (1,000-2,500+ sq ft).",
    supportingDetails: [
      "Single wides are ideal for first-time buyers and downsizers.",
      "Double wides provide spacious family living with multiple bedrooms.",
      "Modular homes offer site-built quality with full customization options."
    ],
    wordCount: 48
  },
  {
    question: "How much do manufactured home floor plans cost?",
    directAnswer: "Single wide homes start at $50,000, double wides at $80,000, and modular homes at $100,000.",
    supportingDetails: [
      "Final price depends on size, features, and customization choices.",
      "We provide line-item pricing so you see exactly what you're paying for."
    ],
    wordCount: 42
  },
  {
    question: "Can I customize a floor plan to fit my needs?",
    directAnswer: "Yes, every Champion floor plan is fully customizable including flooring, cabinetry, countertops, appliances, and exterior finishes.",
    supportingDetails: [
      "Our design team helps you select options that match your lifestyle and budget.",
      "Virtual tours let you visualize your choices before construction begins."
    ],
    wordCount: 45
  },
  {
    question: "What is the difference between single wide and double wide homes?",
    directAnswer: "Single wide homes are one continuous section, typically 14-18 feet wide. Double wide homes are two sections joined together, usually 24-32 feet wide.",
    supportingDetails: [
      "Double wides offer more square footage and wider interior spaces.",
      "Both types are built to HUD standards and can be placed on various foundation types."
    ],
    wordCount: 49
  },
  {
    question: "Are modular homes better than manufactured homes?",
    directAnswer: "Modular homes are built to IRC codes like site-built homes and can qualify for conventional mortgages, while manufactured homes follow HUD standards.",
    supportingDetails: [
      "Modular homes typically appreciate like site-built homes.",
      "Manufactured homes offer more affordable entry points and faster delivery."
    ],
    wordCount: 47
  }
];

// FAQs with 40-60 word answers
const floorPlanFAQs = [
  {
    question: "How many floor plans does Factory Direct Homes Center offer?",
    answer: "We offer over 20 floor plans across three categories: single wide, double wide, and modular homes. Each category includes multiple layouts ranging from 2-bedroom starter homes to 5-bedroom family homes. All plans are customizable to meet your specific needs and preferences."
  },
  {
    question: "What is the smallest home floor plan available?",
    answer: "Our smallest floor plans are in the single wide category, starting at approximately 500 square feet. The Dutch 1460 offers 840 square feet with 2 bedrooms and 1 bathroom, making it an ideal starter home or downsizing option. Despite the compact size, these homes feature smart, efficient layouts."
  },
  {
    question: "What is the largest home floor plan available?",
    answer: "Our largest floor plan is the Aspire Modular 3276, offering 2,432 square feet with 5 bedrooms and 3 bathrooms. This multi-generational design includes spacious living areas, a large kitchen, and flexible space configurations. It's designed for large families or those needing room for home offices."
  },
  {
    question: "Can I make changes to a floor plan layout?",
    answer: "While major structural changes to floor plans are limited by manufacturing constraints, you have extensive customization options. You can choose flooring types, cabinetry styles, countertop materials, appliance packages, exterior colors, and interior finishes. Our design team helps you personalize within the available options."
  },
  {
    question: "Do you offer open concept floor plans?",
    answer: "Yes, many of our floor plans feature open concept designs, particularly in the double wide and modular categories. The Brighton 2856 and Aspire Modular series are popular for their open kitchen and living areas. These designs create spacious, modern living environments perfect for family gatherings."
  },
  {
    question: "What floor plans work best for families with children?",
    answer: "For families, we recommend double wide or modular floor plans with 3-4 bedrooms. The Silverton 2876 offers 4 bedrooms with dual living areas, giving kids their own space. The Brighton series provides split bedroom designs that separate the master suite from children's rooms for privacy."
  },
  {
    question: "Are there floor plans suitable for retirees or empty nesters?",
    answer: "Yes, single wide homes like the Aspire 1456 (2 bed, 2 bath, 1,008 sq ft) are perfect for retirees. These homes offer manageable space with modern amenities, single-level living, and lower maintenance requirements. Many retirees appreciate the affordability and efficiency of these well-designed smaller homes."
  },
  {
    question: "How do I choose the right floor plan for my needs?",
    answer: "Start by considering your family size, lifestyle, and budget. Visit our Auburn showroom to walk through model homes and visualize the space. Our team helps you compare options, understand customization possibilities, and select a floor plan that fits your current needs with room for future changes."
  }
];

// Product data for structured data
const homeProducts = [
  {
    name: "Aspire 1456",
    description: "2 bedroom, 2 bathroom single wide home with 1,008 sq ft. Open-concept kitchen and living area.",
    image: "/images/hero-home.jpg",
    sku: "ASP-1456",
    brand: "Champion Homes",
    price: "55000",
    category: "Single Wide"
  },
  {
    name: "Aspire 1672",
    description: "3 bedroom, 2 bathroom single wide home with 1,152 sq ft. Master suite with walk-in closet.",
    image: "/images/hero-home.jpg",
    sku: "ASP-1672",
    brand: "Champion Homes",
    price: "62000",
    category: "Single Wide"
  },
  {
    name: "Brighton 2856",
    description: "3 bedroom, 2 bathroom double wide home with 1,493 sq ft. Split bedroom design with island kitchen.",
    image: "/images/hero-home.jpg",
    sku: "BRI-2856",
    brand: "Champion Homes",
    price: "89900",
    category: "Double Wide"
  },
  {
    name: "Silverton 2876",
    description: "4 bedroom, 2 bathroom double wide home with 1,493 sq ft. Four bedrooms with dual living areas.",
    image: "/images/hero-home.jpg",
    sku: "SIL-2876",
    brand: "Champion Homes",
    price: "95000",
    category: "Double Wide"
  },
  {
    name: "Aspire Modular 2860",
    description: "3 bedroom, 2 bathroom modular home with 1,680 sq ft. Open floor plan with mudroom entry.",
    image: "/images/hero-home.jpg",
    sku: "ASM-2860",
    brand: "Champion Homes",
    price: "110000",
    category: "Modular"
  },
  {
    name: "Aspire Modular 3276",
    description: "5 bedroom, 3 bathroom modular home with 2,432 sq ft. Multi-generational design with basement option.",
    image: "/images/hero-home.jpg",
    sku: "ASM-3276",
    brand: "Champion Homes",
    price: "145000",
    category: "Modular"
  }
];

// Categories with full data - using actual slugs from floor-plans.ts
const categories = [
  {
    id: "single-wide",
    title: "Single Wide Homes",
    tagline: "Efficient Living, Exceptional Value",
    description: "Our single wide homes pack smart design into an efficient footprint. Ideal for first-time buyers, downsizers, or anyone who values quality craftsmanship without the excess square footage. Every inch is thoughtfully planned.",
    specs: {
      width: "14–18 ft",
      length: "40–80 ft",
      sqft: "500 – 1,200",
      beds: "1–3",
      baths: "1–2",
      price: "From $45,000",
    },
    models: [
      {
        name: "Aspire 1456",
        sqft: "747",
        beds: 2,
        baths: 1,
        highlight: "Open-concept kitchen & living",
        price: "$52,000",
        slug: "1456"
      },
      {
        name: "Aspire 1460",
        sqft: "800",
        beds: 2,
        baths: 1,
        highlight: "Spacious 2-bed, 2-bath option available",
        price: "$54,000",
        slug: "1460"
      },
      {
        name: "Aspire 1476",
        sqft: "1,013",
        beds: 3,
        baths: 2,
        highlight: "Over 1,000 sq ft in single wide",
        price: "$65,000",
        slug: "1476"
      },
    ],
  },
  {
    id: "double-wide",
    title: "Double Wide Homes",
    tagline: "Room to Breathe, Built to Last",
    description: "Sectional homes that rival site-built quality with factory precision. The Brighton and Silverton series offer generous living spaces, multiple bedrooms, and the kind of open floor plans families love coming home to.",
    specs: {
      width: "24–32 ft",
      length: "40–76 ft",
      sqft: "1,000 – 2,400+",
      beds: "2–4",
      baths: "2–3",
      price: "From $80,000",
    },
    models: [
      {
        name: "Brighton 2856",
        sqft: "1,493",
        beds: 3,
        baths: 2,
        highlight: "Split bedroom design with island kitchen",
        price: "$89,900",
        slug: "brighton-2856"
      },
      {
        name: "Brighton 2852",
        sqft: "1,386",
        beds: 3,
        baths: 2,
        highlight: "Spacious family room with vaulted ceilings",
        price: "$85,000",
        slug: "brighton-2852"
      },
      {
        name: "Silverton 2876",
        sqft: "1,493",
        beds: 4,
        baths: 2,
        highlight: "Four bedrooms with dual living areas",
        price: "$95,000",
        slug: "silverton-2876"
      },
    ],
  },
  {
    id: "modular",
    title: "Modular Homes",
    tagline: "Site-Built Quality, Factory Precision",
    description: "Built to IRC residential building codes and placed on permanent foundations, our modular homes are indistinguishable from traditional construction — but delivered faster, with less waste, and at a better price. Fully customizable to your vision.",
    specs: {
      width: "24–36 ft",
      length: "40–76+ ft",
      sqft: "1,000 – 2,500+",
      beds: "2–5",
      baths: "2+",
      price: "From $100,000",
    },
    models: [
      {
        name: "Henderson 3276",
        sqft: "2,304",
        beds: 4,
        baths: 2,
        highlight: "Spacious 4-bedroom modular design",
        price: "$125,000",
        slug: "henderson-3276"
      },
      {
        name: "Madison 3268",
        sqft: "2,176",
        beds: 4,
        baths: 3,
        highlight: "Luxury master with en-suite & walk-in",
        price: "$135,000",
        slug: "madison-3268"
      },
      {
        name: "Georgetown 2864",
        sqft: "1,792",
        beds: 3,
        baths: 2,
        highlight: "Open concept with modern finishes",
        price: "$115,000",
        slug: "georgetown-2864"
      },
    ],
  },
];

// Breadcrumbs
const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Floor Plans", url: "/floor-plans" }
];

// Related pages
const relatedPages = [
  {
    title: "Financing Options",
    url: "/financing",
    description: "Learn about chattel loans, VA loans, and land-home packages"
  },
  {
    title: "About Our Process",
    url: "/about",
    description: "How we deliver homes from factory to foundation"
  },
  {
    title: "Service Areas",
    url: "/locations",
    description: "See where we deliver across 6 states"
  }
];

export default function FloorPlansPage() {
  
  return (
    <>
      {/* ============================================
          MAXIMUM STRUCTURED DATA
          ============================================ */}
      
      {/* 1. LocalBusiness */}
      <StructuredData data={structuredData.localBusiness()} />
      
      {/* 2. WebSite */}
      <StructuredData data={structuredData.website()} />
      
      {/* 3. BreadcrumbList */}
      <StructuredData data={structuredData.breadcrumb(breadcrumbs)} />
      
      {/* 4. Product Catalog (ItemList) */}
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: homeProducts.map((product, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: {
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: `https://factorydirecthomescenter.com${product.image}`,
            sku: product.sku,
            brand: {
              "@type": "Brand",
              name: product.brand
            },
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "LocalBusiness",
                name: "Factory Direct Homes Center"
              }
            },
            category: product.category
          }
        }))
      }} />
      
      {/* 5. Individual Product Schemas */}
      {homeProducts.map((product) => (
        <StructuredData 
          key={product.sku}
          data={structuredData.product({
            name: product.name,
            description: product.description,
            image: product.image,
            sku: product.sku,
            brand: product.brand,
            price: `$${parseInt(product.price).toLocaleString()}`,
            priceCurrency: "USD",
            availability: "InStock"
          })}
        />
      ))}
      
      {/* 6. FAQPage */}
      <StructuredData data={structuredData.faqPage(floorPlanFAQs)} />
      
      {/* 7. ImageObject */}
      <StructuredData data={structuredData.imageObject({
        url: "/images/hero-home.jpg",
        name: "Champion Home Floor Plans Collection",
        description: "Browse single wide, double wide, and modular home floor plans from Champion Homes",
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
          HERO SECTION - COMPACT
          ============================================ */}
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 bg-[var(--color-charcoal)] grain-overlay text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-home.jpg"
            alt={generateAltText("location", { name: "Champion Home Floor Plans Showroom", location: "Auburn, Indiana" })}
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/80 via-[var(--color-charcoal)]/60 to-[var(--color-charcoal)]/90" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="decorative-line" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                  Champion Home Builders
                </span>
              </div>
              
              <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight mb-4">
                Manufactured Home{" "}
                <span className="italic text-[var(--color-teal-light)]">
                  Floor Plans
                </span>
              </h1>
              
              <p className="text-base text-white/60 leading-relaxed max-w-xl">
                Browse 20+ customizable floor plans. Single wide from $50K, 
                double wide from $80K, modular from $100K.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          QUICK FILTER TABS
          ============================================ */}
      <section className="sticky top-0 z-30 bg-white border-b border-[var(--color-charcoal)]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-1 py-4 overflow-x-auto">
            <span className="text-sm font-medium text-[var(--color-gray)] mr-4 whitespace-nowrap">
              Filter by:
            </span>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="px-4 py-2 text-sm font-medium rounded-full bg-[var(--color-cream-dark)] text-[var(--color-charcoal)] hover:bg-[var(--color-teal)] hover:text-white transition-colors whitespace-nowrap"
              >
                {cat.title.replace(" Homes", "")}
              </a>
            ))}
            <a
              href="#all-plans"
              className="px-4 py-2 text-sm font-medium rounded-full bg-[var(--color-teal)] text-white whitespace-nowrap"
            >
              View All
            </a>
          </div>
        </div>
      </section>

      {/* ============================================
          HOME CATEGORIES - FLOOR PLANS FIRST
          ============================================ */}
      <div id="all-plans">
      {categories.map((cat, catIdx) => (
        <section
          key={cat.id}
          id={cat.id}
          className={`py-24 lg:py-32 ${catIdx % 2 === 1 ? "bg-[var(--color-cream-dark)]" : "bg-white"}`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Category header */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <FadeIn direction="up">
                <div>
                  <div className="decorative-line mb-6" />
                  <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-4">
                    {cat.title}
                  </H2>
                  <p className="font-serif text-xl italic text-[var(--color-teal)]">
                    {cat.tagline}
                  </p>
                </div>
              </FadeIn>
              <FadeIn direction="up" delay={150}>
                <div className="flex items-end">
                  <p className="text-base text-[var(--color-gray)] leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* Specs bar */}
            <FadeIn direction="up" delay={200}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16 p-8 bg-white rounded-xl shadow-sm border border-[var(--color-charcoal)]/5">
                {Object.entries(cat.specs).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-gray)] mb-1">
                      {key === "sqft"
                        ? "Sq. Footage"
                        : key.charAt(0).toUpperCase() + key.slice(1)}
                    </div>
                    <div className="font-serif text-lg font-semibold">{value}</div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Models Grid */}
            <StaggerContainer staggerDelay={150} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {cat.models.map((model, idx) => (
                <FadeIn key={model.name} direction="up" delay={idx * 150}>
                  <Link 
                    href={`/floor-plans/${model.slug}`}
                    className="group block border border-[var(--color-charcoal)]/8 hover:border-[var(--color-teal)]/30 bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Model image */}
                    <div className="aspect-[16/10] bg-gradient-to-br from-[var(--color-cream-dark)] to-[var(--color-cream)] flex items-center justify-center border-b border-[var(--color-charcoal)]/5 relative overflow-hidden">
                      <Image
                        src="/images/hero-home.jpg"
                        alt={generateAltText("home", { 
                          name: model.name, 
                          sqft: String(model.sqft), 
                          beds: String(model.beds), 
                          baths: String(model.baths) 
                        })}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <H3 className="font-serif text-xl font-semibold group-hover:text-[var(--color-teal)] transition-colors">
                          {model.name}
                        </H3>
                        <span className="text-sm font-bold text-[var(--color-lime-dark)]">{model.price}</span>
                      </div>
                      <p className="text-sm text-[var(--color-teal)] font-medium mb-4">
                        {model.highlight}
                      </p>
                      <div className="flex gap-4 text-xs tracking-wider uppercase text-[var(--color-gray)]">
                        <span>{model.sqft} sq ft</span>
                        <span className="text-[var(--color-gray-light)]">|</span>
                        <span>{model.beds} Bed</span>
                        <span className="text-[var(--color-gray-light)]">|</span>
                        <span>{model.baths} Bath</span>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ))}

      </div>

      {/* ============================================
          AEO CONTENT SECTION - MOVED BELOW FLOOR PLANS
          ============================================ */}
      <section className="py-16 bg-white border-y border-[var(--color-charcoal)]/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-10">
              <H2 className="font-serif text-3xl font-light mb-4">
                Choosing the Right Floor Plan
              </H2>
              <p className="text-[var(--color-gray)]">
                Common questions about our home floor plans and options
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
          FLOOR PLAN COMPARISON
          ============================================ */}
      <section className="py-16 lg:py-24 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-12">
              <div className="decorative-line mx-auto mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-4">
                Compare <span className="italic text-[var(--color-teal)]">Floor Plans</span>
              </H2>
              <p className="text-[var(--color-gray)] max-w-2xl mx-auto">
                Select up to 3 floor plans to compare side-by-side and find the perfect home for your needs.
              </p>
            </div>
          </FadeIn>
          <FloorPlanComparison />
        </div>
      </section>

      {/* ============================================
          FAQ SECTION
          ============================================ */}
      <FAQSection
        title="Floor Plan FAQs"
        subtitle="Common questions about choosing and customizing your home floor plan"
        faqs={floorPlanFAQs}
        showSchema={true}
      />

      {/* ============================================
          LEAD CAPTURE SECTION
          ============================================ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-12">
              <div className="decorative-line mx-auto mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-4">
                Get Your <span className="italic text-[var(--color-teal)]">Personalized Quote</span>
              </H2>
              <p className="text-[var(--color-gray)] max-w-2xl mx-auto">
                Tell us about your needs and we'll send you personalized floor plan recommendations and pricing within 24 hours.
              </p>
            </div>
          </FadeIn>
          <LeadCaptureForm source="floor_plans_page" />
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
              Every Home is{" "}
              <span className="italic text-[var(--color-teal-light)]">
                Yours to Customize
              </span>
            </H2>
            <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
              Choose your flooring, cabinetry, countertops, appliances, and exterior
              colors. Walk through our showroom or schedule a virtual tour. We&apos;ll
              help you design the home that fits your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+12603081457"
                
                className="btn-primary inline-flex items-center justify-center gap-2 bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300 rounded-lg"
              >
                Schedule a Tour
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
