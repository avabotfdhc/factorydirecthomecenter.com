import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import { getFloorPlanBySlug, getAllFloorPlanSlugs, getRelatedFloorPlans } from "@/lib/floor-plans";
import { getPricingDisplay, calculatePricing } from "@/lib/pricing";
import { FAQSection } from "@/components/FAQSection";
import { CTABlock } from "@/components/CTABlock";
import { H2, H3 } from "@/components/Heading";
import { FloorPlanTracker } from "./FloorPlanTracker";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { FadeIn } from "@/components/VisualEffects";

export function generateStaticParams() {
  return getAllFloorPlanSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = getFloorPlanBySlug(slug);
  if (!plan) return {};
  return genMeta({
    title: `${plan.name} | ${plan.beds} Bed ${plan.baths} Bath ${plan.type}`,
    description: plan.description,
    url: `/floor-plans/${plan.slug}`,
    image: plan.heroImage,
    imageAlt: plan.heroImageAlt,
    keywords: [
      `${plan.name.toLowerCase()} floor plan`,
      `${plan.type.toLowerCase()} manufactured home`,
      `${plan.beds} bedroom ${plan.type.toLowerCase()}`,
    ],
  });
}

// Pricing is now handled by the pricing engine in @/lib/pricing

export default async function FloorPlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = getFloorPlanBySlug(slug);
  if (!plan) notFound();

  const related = getRelatedFloorPlans(plan.slug);
  const pricing = getPricingDisplay(plan.sku);
  const detailedPricing = calculatePricing(plan.sku);

  return (
    <>
      <FloorPlanTracker plan={plan} />
      
      {/* ============================================
          COMPREHENSIVE SCHEMA MARKUP
          ============================================ */}
      
      {/* 1. Product Schema */}
      <StructuredData
        data={structuredData.product({
          name: plan.name,
          description: plan.description,
          image: plan.heroImage,
          sku: plan.sku,
          brand: "Champion Homes",
          price: detailedPricing?.fdhcPrice.toString() || plan.priceNumeric,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        })}
      />
      
      {/* 2. BreadcrumbList Schema */}
      <StructuredData
        data={structuredData.breadcrumb([
          { name: "Home", url: "/" },
          { name: "Floor Plans", url: "/floor-plans" },
          { name: plan.name, url: `/floor-plans/${plan.slug}` },
        ])}
      />
      
      {/* 3. ImageObject Schema for Hero */}
      <StructuredData
        data={structuredData.imageObject({
          url: plan.heroImage,
          name: `${plan.name} - ${plan.beds} Bed ${plan.baths} Bath ${plan.type}`,
          description: `${plan.name} manufactured home by Champion Homes. ${plan.sqft} sq ft, ${plan.beds} bedrooms, ${plan.baths} bathrooms. ${plan.description}`,
          width: 1200,
          height: 630,
        })}
      />
      
      {/* 4. ImageObject Schema for Gallery Images */}
      {plan.galleryImages?.map((img, idx) => (
        <StructuredData
          key={img}
          data={structuredData.imageObject({
            url: img,
            name: `${plan.name} Interior View ${idx + 1}`,
            description: `${plan.name} interior photo showing detailed craftsmanship and design`,
            width: 800,
            height: 600,
          })}
        />
      ))}
      
      {/* 5. LocalBusiness Schema */}
      <StructuredData data={structuredData.localBusiness()} />
      
      {/* 6. WebSite Schema */}
      <StructuredData data={structuredData.website()} />

      {/* ============================================
          BREADCRUMB NAVIGATION
          ============================================ */}
      <nav aria-label="Breadcrumb" className="bg-[var(--color-cream-dark)] py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm text-[var(--color-gray)]">
            <li className="flex items-center gap-2">
              <Link href="/" className="hover:text-[var(--color-teal)]">Home</Link>
              <span>/</span>
            </li>
            <li className="flex items-center gap-2">
              <Link href="/floor-plans" className="hover:text-[var(--color-teal)]">Floor Plans</Link>
              <span>/</span>
            </li>
            <li className="font-semibold text-[var(--color-charcoal)]">{plan.name}</li>
          </ol>
        </div>
      </nav>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-[var(--color-charcoal)] grain-overlay text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={plan.heroImage}
            alt={plan.heroImageAlt}
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/80 via-[var(--color-charcoal)]/60 to-[var(--color-charcoal)]/90" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <FadeIn direction="up">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-[var(--color-teal)] text-white text-xs font-bold tracking-wider uppercase rounded-full">
                    {plan.type}
                  </span>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold tracking-wider uppercase rounded-full">
                    {plan.code} Code
                  </span>
                </div>
                
                <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight mb-6">
                  {plan.name}
                </h1>
                
                <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-xl">
                  {plan.description}
                </p>
                
                {/* Key Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white/5 rounded-lg p-4">
                    <span className="text-white/50 block text-xs uppercase tracking-wider mb-1">Square Feet</span>
                    <span className="text-2xl font-light text-white">{plan.sqft.toLocaleString()}</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <span className="text-white/50 block text-xs uppercase tracking-wider mb-1">Bedrooms</span>
                    <span className="text-2xl font-light text-white">{plan.beds}</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <span className="text-white/50 block text-xs uppercase tracking-wider mb-1">Bathrooms</span>
                    <span className="text-2xl font-light text-white">{plan.baths}</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <span className="text-white/50 block text-xs uppercase tracking-wider mb-1">Sections</span>
                    <span className="text-2xl font-light text-white">{plan.sections}</span>
                  </div>
                </div>
                
                {/* Was/Now Pricing with Savings */}
                <div className="bg-white/10 rounded-xl p-6 inline-block">
                  {pricing ? (
                    <>
                      {/* Sale Badge */}
                      {pricing.badge && (
                        <div className="mb-3">
                          <span className="px-3 py-1 bg-[var(--color-lime)] text-[var(--color-charcoal)] text-xs font-bold tracking-wider uppercase rounded-full">
                            {pricing.badge}
                          </span>
                          {pricing.campaignName && (
                            <span className="ml-2 text-xs text-white/70">{pricing.campaignName}</span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-white/50 block text-xs uppercase tracking-wider mb-1">MSRP</span>
                          <span className="text-xl text-white/60 line-through">{pricing.wasPrice}</span>
                        </div>
                        <div className="w-px h-12 bg-white/20" />
                        <div>
                          <span className="text-[var(--color-lime)] block text-xs uppercase tracking-wider mb-1">
                            {pricing.badge ? 'Sale Price' : 'Factory Direct Price'}
                          </span>
                          <span className="text-3xl font-light text-[var(--color-lime)]">{pricing.nowPrice}</span>
                        </div>
                      </div>
                      
                      {/* Savings Display */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-[var(--color-lime)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[var(--color-lime)] font-semibold">Save {pricing.savings}</span>
                          <span className="text-white/60 text-sm">({pricing.savingsPercent}% off MSRP)</span>
                        </div>
                        {pricing.campaignEnds && (
                          <p className="text-xs text-white/50 mt-1">
                            Sale ends {new Date(pricing.campaignEnds).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    /* Fallback pricing when SKU not in pricing engine */
                    <>
                      <div>
                        <span className="text-[var(--color-lime)] block text-xs uppercase tracking-wider mb-1">
                          Factory Direct Price
                        </span>
                        <span className="text-3xl font-light text-[var(--color-lime)]">{plan.price}</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-sm text-white/60">
                          Call for detailed pricing and current promotions
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </FadeIn>
            
            {/* Right: Lead Capture Form */}
            <FadeIn direction="up" delay={200}>
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-[var(--color-teal)] text-white p-6">
                  <h2 className="font-serif text-xl font-light mb-1">Get Your Personalized Quote</h2>
                  <p className="text-sm text-white/80">For the {plan.name} - takes 2 minutes</p>
                </div>
                <div className="p-6">
                  <LeadCaptureForm source={`floor_plan_${plan.slug}`} />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============================================
          GALLERY SECTION
          ============================================ */}
      {plan.galleryImages && plan.galleryImages.length > 0 && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <FadeIn direction="up">
              <div className="text-center mb-12">
                <div className="decorative-line mx-auto mb-6" />
                <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-4">
                  Take a Look <span className="italic text-[var(--color-teal)]">Inside</span>
                </H2>
                <p className="text-[var(--color-gray)] max-w-2xl mx-auto">
                  Quality craftsmanship and thoughtful design in every detail of the {plan.name}
                </p>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plan.galleryImages.map((img, idx) => (
                <FadeIn key={img} direction="up" delay={idx * 100}>
                  <div className="relative aspect-[4/3] bg-[var(--color-cream-dark)] rounded-xl overflow-hidden group shadow-sm">
                    <Image 
                      src={img} 
                      alt={`${plan.name} interior view ${idx + 1} - ${plan.beds} bed ${plan.baths} bath ${plan.type.toLowerCase()}`} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      sizes="(max-width: 768px) 100vw, 33vw" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          MID-PAGE CTA
          ============================================ */}
      <section className="py-12 bg-[var(--color-cream-dark)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <CTABlock
              text={`Interested in the ${plan.name}? Get a personalized quote with our transparent line-item pricing. See exactly what you pay for — home, delivery, setup, and site work.`}
              href="/contact-us"
              label="Get a Quote"
              variant="secondary"
            />
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          FEATURES & SPECS SECTION
          ============================================ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Features */}
            <FadeIn direction="up">
              <div>
                <div className="decorative-line mb-6" />
                <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-8">
                  Features & <span className="italic text-[var(--color-teal)]">Highlights</span>
                </H2>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={feature} className="flex items-start gap-3 p-4 bg-[var(--color-cream-dark)] rounded-lg">
                      <div className="w-6 h-6 bg-[var(--color-lime)] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[var(--color-charcoal)] font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Specs */}
            <FadeIn direction="up" delay={150}>
              <div>
                <div className="decorative-line mb-6" />
                <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-8">
                  Technical <span className="italic text-[var(--color-teal)]">Specifications</span>
                </H2>
                <div className="bg-[var(--color-cream-dark)] rounded-xl p-6">
                  <div className="space-y-3">
                    {Object.entries(plan.specs).map(([key, value], idx) => (
                      <div key={key} className={`flex justify-between items-center py-3 ${idx !== Object.entries(plan.specs).length - 1 ? 'border-b border-[var(--color-charcoal)]/10' : ''}`}>
                        <span className="text-sm font-medium text-[var(--color-gray)] capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span className="text-sm font-semibold text-[var(--color-charcoal)]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {plan.pdfUrl && (
                  <div className="mt-6">
                    <a 
                      href={plan.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center justify-center gap-2 bg-[var(--color-teal)] text-white px-6 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors rounded-lg w-full"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Floor Plan PDF
                    </a>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============================================
          WHY CHAMPION SECTION
          ============================================ */}
      <section className="py-16 lg:py-24 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-12">
              <div className="decorative-line mx-auto mb-6" />
              <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-4">
                Why Choose a <span className="italic text-[var(--color-teal)]">Champion Home</span>?
              </H2>
              <p className="text-[var(--color-gray)] max-w-2xl mx-auto">
                Built in Topeka, Indiana — just 30 miles from our showroom
              </p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn direction="up" delay={0}>
              <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[var(--color-teal)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-light text-[var(--color-teal)]">30</span>
                </div>
                <H3 className="font-semibold text-lg mb-2">Miles From Factory</H3>
                <p className="text-sm text-[var(--color-gray)]">Built at Champion&apos;s Topeka, IN factory — just 30 miles from our showroom. Lower delivery costs and easy factory visits.</p>
              </div>
            </FadeIn>
            
            <FadeIn direction="up" delay={100}>
              <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[var(--color-lime)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-light text-[var(--color-lime-dark)]">100%</span>
                </div>
                <H3 className="font-semibold text-lg mb-2">Transparent Pricing</H3>
                <p className="text-sm text-[var(--color-gray)]">Line-item pricing on every quote. See exactly what you pay for — home, delivery, setup, and site work. No hidden fees.</p>
              </div>
            </FadeIn>
            
            <FadeIn direction="up" delay={200}>
              <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[var(--color-teal)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-light text-[var(--color-teal)]">500+</span>
                </div>
                <H3 className="font-semibold text-lg mb-2">Homes Delivered</H3>
                <p className="text-sm text-[var(--color-gray)]">Across Indiana, Ohio, Michigan, Wisconsin, Illinois, and Kentucky. We handle the entire process from order to move-in.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============================================
          FAQ SECTION WITH SCHEMA
          ============================================ */}
      {plan.faqs.length > 0 && (
        <>
          <FAQSection
            title={`${plan.name} Questions`}
            subtitle={`Common questions about the ${plan.name} ${plan.type.toLowerCase()}`}
            faqs={plan.faqs}
            showSchema={true}
          />
          
          {/* Additional FAQPage Schema for enhanced SEO */}
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": plan.faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer,
                },
              })),
            }}
          />
        </>
      )}

      {/* ============================================
          BOTTOM CTA SECTION
          ============================================ */}
      <section className="py-16 lg:py-24 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn direction="up">
            <div className="decorative-line mx-auto mb-6" />
            <h2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-6">
              Ready to See the <span className="italic text-[var(--color-teal-light)]">{plan.name}</span>?
            </h2>
            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-2xl mx-auto">
              Visit our Auburn showroom to walk through this floor plan in person, or request a custom quote with line-item pricing. Our team is ready to help you find your perfect home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+12603081457"
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call (260) 308-1457
              </a>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors rounded-lg"
              >
                Request a Quote
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          RELATED FLOOR PLANS SECTION
          ============================================ */}
      {related.length > 0 && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <FadeIn direction="up">
              <div className="text-center mb-12">
                <div className="decorative-line mx-auto mb-6" />
                <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-4">
                  Similar <span className="italic text-[var(--color-teal)]">Floor Plans</span>
                </H2>
                <p className="text-[var(--color-gray)] max-w-2xl mx-auto">
                  Explore other {plan.type.toLowerCase()} homes similar to the {plan.name}
                </p>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((model, idx) => (
                <FadeIn key={model.slug} direction="up" delay={idx * 100}>
                  <Link
                    href={`/floor-plans/${model.slug}`}
                    className="group block bg-[var(--color-cream-dark)] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] bg-gradient-to-br from-[var(--color-cream)] to-[var(--color-cream-dark)] overflow-hidden">
                      <Image
                        src={model.heroImage}
                        alt={`${model.name} - ${model.beds} bed ${model.baths} bath ${model.type.toLowerCase()}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-[var(--color-teal)] text-white text-xs font-bold tracking-wider uppercase rounded-full">
                          {model.type}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <H3 className="font-serif text-xl font-semibold tracking-tight mb-2 group-hover:text-[var(--color-teal)] transition-colors">
                        {model.name}
                      </H3>
                      <div className="flex gap-3 text-sm text-[var(--color-gray)] mb-3">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          {model.sqft.toLocaleString()} sq ft
                        </span>
                        <span className="text-[var(--color-gray-light)]">|</span>
                        <span>{model.beds} bed</span>
                        <span className="text-[var(--color-gray-light)]">|</span>
                        <span>{model.baths} bath</span>
                      </div>
                      <p className="text-lg font-semibold text-[var(--color-lime-dark)]">
                        {(() => {
                          const p = getPricingDisplay(model.sku);
                          return p ? p.nowPrice : model.price;
                        })()}
                      </p>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
            
            {/* View All Link */}
            <FadeIn direction="up" delay={300}>
              <div className="text-center mt-12">
                <Link
                  href="/floor-plans"
                  className="inline-flex items-center gap-2 text-[var(--color-teal)] font-semibold hover:text-[var(--color-teal-dark)] transition-colors"
                >
                  View All Floor Plans
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}
    </>
  );
}
