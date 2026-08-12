import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FAQSection } from "@/components/FAQSection";
import { StructuredData, structuredData } from "@/lib/seo";
import { aeo } from "@/lib/aeo";
import { generateAltText } from "@/lib/images";
import { H2, H3, H4 } from "@/components/Heading";
import { 
  FadeIn, 
  StaggerContainer,
  useScrollTracking 
} from "@/components/VisualEffects";

// ============================================
// BUTTON BLOCK MAXIMUM SEO/AEO PAGE TEMPLATE
// ============================================
// This template includes ALL insights from Button Block blogs:
// - AEO (40-60 word answers, question headers)
// - Maximum structured data (10+ schema types)
// - Internal linking (topic clusters)
// - External sourcing (citations)
// - FAQ Schema on every page
// - E-E-A-T signals
// ============================================

interface PageTemplateProps {
  // Page Metadata
  title: string;
  description: string;
  keywords: string[];
  url: string;
  
  // Content
  h1: string;
  heroImage: string;
  heroImageAlt: string;
  
  // AEO Content - 40-60 word answers
  mainContent: {
    question: string;
    directAnswer: string; // 1 sentence, core answer
    supportingDetails: string[]; // 2-3 sentences
    additionalContext?: string;
  }[];
  
  // FAQs for Schema (minimum 5)
  faqs: Array<{
    question: string;
    answer: string; // 40-60 words
  }>;
  
  // Structured Data Types
  schemas: {
    localBusiness?: boolean;
    article?: boolean;
    product?: boolean;
    service?: boolean;
    faq?: boolean;
    breadcrumb?: boolean;
    imageObject?: boolean;
    videoObject?: boolean;
    howTo?: boolean;
    review?: boolean;
  };
  
  // Internal Linking
  breadcrumbs: Array<{ name: string; url: string }>;
  relatedPages: Array<{ title: string; url: string; description: string }>;
  pillarPage?: { title: string; url: string };
  
  // External Sources (E-E-A-T)
  citations: Array<{
    source: string;
    url: string;
    description: string;
  }>;
  
  // Visual Content
  images: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
  }>;
  
  // Location Data (for Local SEO)
  location?: {
    city: string;
    state: string;
    county?: string;
    landmarks?: string[];
  };
}

export function generateMaxMetadata({ title, description, keywords, url }: PageTemplateProps): Metadata {
  return {
    title: `${title} | Factory Direct Homes Center`,
    description: `${description} Serving Indiana, Ohio, Michigan & more from Auburn, IN. Factory-direct pricing with line-item transparency.`,
    keywords: [
      "manufactured homes",
      "modular homes",
      "champion homes",
      "factory direct",
      "indiana",
      "ohio",
      "michigan",
      ...keywords,
    ],
    openGraph: {
      title: `${title} | Factory Direct Homes Center`,
      description,
      url: `https://factorydirecthomescenter.com${url}`,
      siteName: "Factory Direct Homes Center",
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Factory Direct Homes Center`,
      description,
    },
    alternates: {
      canonical: `https://factorydirecthomescenter.com${url}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// ============================================
// MAXIMUM STRUCTURED DATA COMPONENT
// ============================================
export function MaximumStructuredData({ 
  pageData, 
  pageType = "article" 
}: { 
  pageData: PageTemplateProps; 
  pageType?: "article" | "product" | "service" | "location";
}) {
  const schemas = [];
  
  // 1. LocalBusiness (on EVERY page)
  schemas.push(structuredData.localBusiness());
  
  // 2. WebSite
  schemas.push(structuredData.website());
  
  // 3. BreadcrumbList
  if (pageData.breadcrumbs.length > 0) {
    schemas.push(structuredData.breadcrumb(pageData.breadcrumbs));
  }
  
  // 4. Article (for content pages)
  if (pageType === "article" || pageData.schemas.article) {
    schemas.push(structuredData.article({
      headline: pageData.title,
      description: pageData.description,
      image: pageData.heroImage,
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      author: "Factory Direct Homes Center",
      url: pageData.url,
    }));
  }
  
  // 5. FAQPage (minimum 5 FAQs on EVERY page)
  if (pageData.faqs.length >= 5) {
    schemas.push(structuredData.faqPage(pageData.faqs));
  }
  
  // 6. Product (for home detail pages)
  if (pageType === "product" || pageData.schemas.product) {
    schemas.push(structuredData.product({
      name: pageData.title,
      description: pageData.description,
      image: pageData.heroImage,
      brand: "Champion Homes",
    }));
  }
  
  // 7. Service (for service pages)
  if (pageType === "service" || pageData.schemas.service) {
    schemas.push(structuredData.service({
      name: pageData.title,
      description: pageData.description,
      provider: "Factory Direct Homes Center",
      areaServed: pageData.location?.state || "Indiana",
    }));
  }
  
  // 8. ImageObject (for hero image)
  schemas.push(structuredData.imageObject({
    url: pageData.heroImage,
    name: pageData.title,
    description: pageData.heroImageAlt,
    width: 1200,
    height: 630,
  }));
  
  // 9. ImageObjects for all images
  pageData.images.forEach((img) => {
    schemas.push(structuredData.imageObject({
      url: img.src,
      name: img.alt,
      description: img.caption || img.alt,
      width: img.width,
      height: img.height,
    }));
  });
  
  // 10. HowTo (for guide pages)
  if (pageData.schemas.howTo) {
    // Add HowTo schema for process content
  }
  
  // 11. Review/AggregateRating — intentionally not emitted. Fabricated ratings
  // violate Google's review-snippet policy; only add this back with a real,
  // verified rating value and review count from an approved source.
  
  return (
    <>
      {schemas.map((schema, idx) => (
        <StructuredData key={idx} data={schema} />
      ))}
    </>
  );
}

// ============================================
// AEO CONTENT SECTION
// ============================================
// Renders content with 40-60 word answers
export function AEOContent({ 
  content 
}: { 
  content: PageTemplateProps["mainContent"]; 
}) {
  return (
    <div className="space-y-12">
      {content.map((section, idx) => {
        // Validate 40-60 word count
        const wordCount = section.directAnswer.split(/\s+/).length + 
                         section.supportingDetails.join(" ").split(/\s+/).length;
        
        return (
          <section key={idx} className="aeo-section">
            {/* Question as H2 */}
            <H2 className="font-serif text-2xl lg:text-3xl font-semibold mb-4">
              {section.question}
            </H2>
            
            {/* Direct Answer (40-60 words) */}
            <div className="bg-[var(--color-cream-dark)] rounded-lg p-6 mb-4">
              <p className="text-lg leading-relaxed">
                <strong>{section.directAnswer}</strong>{" "}
                {section.supportingDetails.join(" ")}
              </p>
              {wordCount < 40 && (
                <span className="text-xs text-orange-500">⚠️ Answer too short ({wordCount} words)</span>
              )}
              {wordCount > 60 && (
                <span className="text-xs text-orange-500">⚠️ Answer too long ({wordCount} words)</span>
              )}
            </div>
            
            {/* Additional Context */}
            {section.additionalContext && (
              <p className="text-[var(--color-gray)] leading-relaxed">
                {section.additionalContext}
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}

// ============================================
// INTERNAL LINKING COMPONENT
// ============================================
export function InternalLinking({ 
  breadcrumbs, 
  relatedPages, 
  pillarPage 
}: { 
  breadcrumbs: PageTemplateProps["breadcrumbs"];
  relatedPages: PageTemplateProps["relatedPages"];
  pillarPage?: PageTemplateProps["pillarPage"];
}) {
  return (
    <>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="py-4">
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
      </nav>
      
      {/* Related Pages */}
      {relatedPages.length > 0 && (
        <section className="py-12 bg-[var(--color-cream-dark)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <H3 className="font-serif text-xl font-semibold mb-6">Related Articles</H3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPages.map((page) => (
                <Link 
                  key={page.url}
                  href={page.url}
                  className="bg-white rounded-lg p-6 border border-[var(--color-charcoal)]/5 hover:shadow-md transition-shadow"
                >
                  <H4 className="font-semibold text-[var(--color-teal)] mb-2">{page.title}</H4>
                  <p className="text-sm text-[var(--color-gray)]">{page.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Pillar Page Link */}
      {pillarPage && (
        <div className="py-8 text-center">
          <p className="text-sm text-[var(--color-gray)] mb-2">Part of our comprehensive guide:</p>
          <Link 
            href={pillarPage.url}
            className="inline-flex items-center gap-2 text-[var(--color-teal)] font-semibold hover:underline"
          >
            {pillarPage.title}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </>
  );
}

// ============================================
// EXTERNAL SOURCES / CITATIONS
// ============================================
export function ExternalSources({ citations }: { citations: PageTemplateProps["citations"] }) {
  if (citations.length === 0) return null;
  
  return (
    <section className="py-8 border-t border-[var(--color-charcoal)]/10">
      <H3 className="font-semibold text-sm uppercase tracking-wider text-[var(--color-gray)] mb-4">
        Sources & References
      </H3>
      <ul className="space-y-2">
        {citations.map((cite, idx) => (
          <li key={idx} className="text-sm">
            <a 
              href={cite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-teal)] hover:underline"
            >
              {cite.source}
            </a>
            {" — "}{cite.description}
          </li>
        ))}
      </ul>
    </section>
  );
}

// ============================================
// HYPERLOCAL CONTENT
// ============================================
export function HyperlocalContent({ location }: { location: PageTemplateProps["location"] }) {
  if (!location) return null;
  
  return (
    <section className="py-8 bg-[var(--color-teal)]/5 rounded-lg p-6">
      <H3 className="font-serif text-xl font-semibold mb-4">
        Serving {location.city}, {location.state}
      </H3>
      
      {location.county && (
        <p className="text-sm text-[var(--color-gray)] mb-4">
          Including all of {location.county} County and surrounding areas.
        </p>
      )}
      
      {location.landmarks && location.landmarks.length > 0 && (
        <>
          <p className="text-sm font-medium mb-2">Near:</p>
          <ul className="flex flex-wrap gap-2">
            {location.landmarks.map((landmark) => (
              <li 
                key={landmark}
                className="text-xs bg-white px-3 py-1 rounded-full border border-[var(--color-charcoal)]/10"
              >
                {landmark}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

// ============================================
// E-E-A-T SIGNALS
// ============================================
export function EEATSignals() {
  return (
    <section className="py-12 border-t border-[var(--color-charcoal)]/10">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <H3 className="font-serif text-xl font-semibold mb-6 text-center">Why Trust Factory Direct Homes Center</H3>
        
        <StaggerContainer staggerDelay={150} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FadeIn direction="up" delay={0}>
            <div className="text-center">
              <div className="text-3xl mb-2">🏆</div>
              <H4 className="font-semibold text-sm mb-1">Selection</H4>
              <p className="text-xs text-[var(--color-gray)]">70+ floor plans across 6 states</p>
            </div>
          </FadeIn>
          
          <FadeIn direction="up" delay={150}>
            <div className="text-center">
              <div className="text-3xl mb-2">🎓</div>
              <H4 className="font-semibold text-sm mb-1">Expertise</H4>
              <p className="text-xs text-[var(--color-gray)]">Champion Homes authorized dealer</p>
            </div>
          </FadeIn>
          
          <FadeIn direction="up" delay={300}>
            <div className="text-center">
              <div className="text-3xl mb-2">⭐</div>
              <H4 className="font-semibold text-sm mb-1">Authoritativeness</H4>
              <p className="text-xs text-[var(--color-gray)]">4.8★ rating from verified customers</p>
            </div>
          </FadeIn>
          
          <FadeIn direction="up" delay={450}>
            <div className="text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <H4 className="font-semibold text-sm mb-1">Trustworthiness</H4>
              <p className="text-xs text-[var(--color-gray)]">Line-item pricing, no hidden fees</p>
            </div>
          </FadeIn>
        </StaggerContainer>
      </div>
    </section>
  );
}

// ============================================
// MAIN PAGE TEMPLATE EXPORT
// ============================================
export function MaxSEOPageTemplate(pageData: PageTemplateProps) {
  useScrollTracking();
  
  return (
    <>
      {/* 1. Maximum Structured Data */}
      <MaximumStructuredData pageData={pageData} />
      
      {/* 2. Breadcrumbs & Navigation */}
      <InternalLinking 
        breadcrumbs={pageData.breadcrumbs}
        relatedPages={pageData.relatedPages}
        pillarPage={pageData.pillarPage}
      />
      
      {/* 3. Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={pageData.heroImage}
            alt={pageData.heroImageAlt}
            fill
            preload
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/70 to-[var(--color-charcoal)]/50" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <FadeIn direction="up">
            <h1 className="font-serif text-4xl lg:text-6xl font-light text-white mb-6">
              {pageData.h1}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              {pageData.description}
            </p>
          </FadeIn>
        </div>
      </section>
      
      {/* 4. Hyperlocal Content */}
      {pageData.location && <HyperlocalContent location={pageData.location} />}
      
      {/* 5. AEO Main Content (40-60 word answers) */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <AEOContent content={pageData.mainContent} />
        </div>
      </section>
      
      {/* 6. Images with Schema */}
      {pageData.images.length > 0 && (
        <section className="py-16 bg-[var(--color-cream-dark)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <StaggerContainer staggerDelay={200} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pageData.images.map((img, idx) => (
                <FadeIn key={idx} direction="up" delay={idx * 200}>
                  <figure className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {img.caption && (
                      <figcaption className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm p-3">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                </FadeIn>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}
      
      {/* 7. FAQ Section with Schema */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle={`Common questions about ${pageData.title.toLowerCase()}`}
        faqs={pageData.faqs}
        showSchema={true}
      />
      
      {/* 8. E-E-A-T Signals */}
      <EEATSignals />
      
      {/* 9. External Sources */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <ExternalSources citations={pageData.citations} />
      </div>
      
      {/* 10. Related Pages (Internal Linking) */}
      <InternalLinking 
        breadcrumbs={[]}
        relatedPages={pageData.relatedPages}
        pillarPage={pageData.pillarPage}
      />
    </>
  );
}
