"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FAQSection, commonFAQs } from "@/components/FAQSection";
import { StructuredData, structuredData } from "@/lib/seo";
import { 
  FadeIn, 
  StaggerContainer, 
  AnimatedCounter, 
  useScrollTracking, 
  useTimeOnPageTracking,
  MagneticButton,
  ZoomImage,
  useParallax,
  TextReveal,
  Skeleton
} from "@/components/VisualEffects";
import { trackPhoneClick, trackEmailClick } from "@/lib/analytics";

const homeTypes = [
  {
    title: "Single Wide",
    subtitle: "Efficient Living",
    sqft: "500 – 1,200 sq ft",
    beds: "1–3 Bed",
    baths: "1–2 Bath",
    startingAt: "$50,000",
    description: "Thoughtfully designed for smart, comfortable living. Perfect for first-time buyers, downsizers, or anyone who values quality over excess.",
    features: ["14–18 ft wide", "Up to 80 ft long", "Open floor plans"],
    image: "/images/homepage/single-wides.webp",
  },
  {
    title: "Double Wide",
    subtitle: "Room to Breathe",
    sqft: "1,000 – 2,400 sq ft",
    beds: "2–4 Bed",
    baths: "2–3 Bath",
    startingAt: "$80,000",
    description: "Spacious sectional homes that rival site-built quality. The Brighton and Silverton series offer generous layouts for growing families.",
    features: ["24–32 ft wide", "Multiple living areas", "Walk-in closets"],
    image: "/images/homepage/double-wides.webp",
  },
  {
    title: "Modular",
    subtitle: "Built to Code",
    sqft: "1,000 – 2,500+ sq ft",
    beds: "2–5 Bed",
    baths: "2+ Bath",
    startingAt: "$100,000",
    description: "IRC-code compliant homes placed on permanent foundations. Indistinguishable from site-built, with factory precision and pricing.",
    features: ["Permanent foundation", "IRC building codes", "Fully customizable"],
    image: "/images/homepage/feature-find-home.webp",
  },
];

const testimonials = [
  { quote: "Buying our home was the best decision we ever made. The team walked us through every step and we saved thousands compared to site-built.", name: "David B.", location: "Fort Wayne, IN" },
  { quote: "We were priced out of the traditional market. Our double wide gives us everything we wanted at half the price.", name: "Sarah M.", location: "Indianapolis, IN" },
  { quote: "As a veteran, the VA financing with no money down was incredible. The process was smooth and our home is beautiful.", name: "James T.", location: "South Bend, IN" },
];

const featuredPlans = [
  { name: "Brighton 2856", type: "Double Wide", sqft: "1,493", beds: 3, baths: 2, price: "$89,900", highlight: "Split bedroom, island kitchen", image: "/images/homepage/brighton-2852.png" },
  { name: "Aspire 1672", type: "Single Wide", sqft: "1,152", beds: 3, baths: 2, price: "$62,500", highlight: "Master suite with walk-in", image: "/images/homepage/single-wides.webp" },
  { name: "Silverton 2876", type: "Double Wide", sqft: "1,493", beds: 4, baths: 2, price: "$94,500", highlight: "Dual living areas", image: "/images/homepage/silverton-2856.png" },
  { name: "Aspire Modular 3268", type: "Modular", sqft: "2,176", beds: 4, baths: 3, price: "$149,900", highlight: "Luxury en-suite master", image: "/images/homepage/georgetown-2864.png" },
];

export default function Home() {
  const [homeType, setHomeType] = useState("");
  const [sqft, setSqft] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");

  // Initialize tracking
  useScrollTracking();
  useTimeOnPageTracking();

  return (
    <>
      {/* Hero */}
      <ParallaxHeroSection />

      {/* Search Bar - Separate from hero */}
      <section className="bg-[var(--color-teal)] py-4">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col sm:flex-row gap-2">
            <select className="flex-1 px-3 py-2 bg-[var(--color-cream-dark)] border-0 rounded text-sm text-[var(--color-charcoal)]">
              <option>All Types</option>
              <option>Single Wide</option>
              <option>Double Wide</option>
              <option>Modular</option>
            </select>
            <select className="flex-1 px-3 py-2 bg-[var(--color-cream-dark)] border-0 rounded text-sm text-[var(--color-charcoal)]">
              <option>Any Size</option>
              <option>1,000+ sq ft</option>
              <option>1,500+ sq ft</option>
              <option>2,000+ sq ft</option>
            </select>
            <select className="flex-1 px-3 py-2 bg-[var(--color-cream-dark)] border-0 rounded text-sm text-[var(--color-charcoal)]">
              <option>Any Beds</option>
              <option>2+ Beds</option>
              <option>3+ Beds</option>
              <option>4+ Beds</option>
            </select>
            <Link
              href="/floor-plans"
              className="bg-[var(--color-lime)] text-[var(--color-charcoal)] px-6 py-2 text-sm font-bold uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors flex items-center justify-center"
            >
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Floor Plans */}
      <section className="py-12 lg:py-16 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              Featured Floor Plans
            </h2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlans.map((plan) => (
              <div key={plan.name} className="group bg-white rounded-lg border border-[var(--color-charcoal)]/8 overflow-hidden hover:shadow-lg hover:border-[var(--color-teal)]/30 transition-all duration-400">
                <figure className="aspect-[16/11] bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
                  <Image
                    src={plan.image}
                    alt={`${plan.name} ${plan.type} floor plan - ${plan.sqft} sq ft, ${plan.beds} bed, ${plan.baths} bath manufactured home`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                  />
                  <figcaption className="sr-only">{plan.name} - {plan.highlight}</figcaption>
                  <span className="absolute top-3 left-3 bg-[var(--color-teal)] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded z-10">
                    {plan.type}
                  </span>
                </figure>

                <div className="p-5">
                  <h3 className="font-semibold text-base mb-1">{plan.name}</h3>
                  <p className="text-xs text-[var(--color-teal)] font-medium mb-3">{plan.highlight}</p>

                  <div className="flex gap-3 text-xs text-[var(--color-gray)] mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
                      {plan.sqft} ft²
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                      {plan.beds} Bed
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {plan.baths} Bath
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--color-charcoal)]/5">
                    <span className="font-serif text-xl font-semibold text-[var(--color-teal)]">{plan.price}</span>
                    <Link href="/floor-plans" className="text-xs font-bold uppercase tracking-wider text-[var(--color-lime-dark)] hover:text-[var(--color-teal)] transition-colors">
                      View Plan →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/floor-plans" className="btn-primary inline-flex items-center gap-2 bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors duration-300">
              View All Floor Plans
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Factory Direct */}
      <section className="py-20 lg:py-28 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              Why Choose Factory Direct?
            </h2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto mb-6" />
            <p className="text-base text-[var(--color-gray)] max-w-2xl mx-auto">
              We&rsquo;re a family-owned business that believes everyone deserves a quality home at an honest price.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Largest Champion Factory", desc: "Topeka, IN — the largest Champion plant in the country. Aspire, Paramount, Redman, and Dutch series, all built 20 miles away.", icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { title: "Factory-Direct Pricing", desc: "No middlemen. We buy directly from the factory — shorter delivery, lower costs, passed on to you with line-item transparency.", icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" },
              { title: "Full-Service", desc: "From selection to setup \u2014 site prep, delivery, installation, and utility connections. We handle it all.", icon: "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" },
              { title: "Tri-State Delivery", desc: "Serving Indiana, Michigan, and Ohio. Proximity to Champion\u2019s plant means faster delivery and lower costs.", icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-lg p-8 text-center border border-[var(--color-charcoal)]/5 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-full bg-[var(--color-teal)]/10 text-[var(--color-teal)]">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-gray)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Home Types */}
      <section className="py-20 lg:py-28 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              Browse by Home Type
            </h2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {homeTypes.map((home) => (
              <div key={home.title} className="group bg-white/5 border border-white/10 rounded-lg hover:border-[var(--color-teal)]/40 transition-all duration-500 overflow-hidden">
                <figure className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={home.image}
                    alt={`${home.title} manufactured home - ${home.sqft}, ${home.beds}, ${home.baths} starting at ${home.startingAt}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <figcaption className="sr-only">{home.title} - {home.description}</figcaption>
                </figure>
                <div className="p-8 pb-6 border-b border-white/10">
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-lime)]">{home.subtitle}</span>
                  <h3 className="font-serif text-3xl font-semibold mt-2 mb-4">{home.title}</h3>
                  <div className="flex gap-4 text-xs tracking-wider uppercase text-white/50">
                    <span>{home.sqft}</span>
                    <span className="text-white/20">|</span>
                    <span>{home.beds}</span>
                    <span className="text-white/20">|</span>
                    <span>{home.baths}</span>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-sm text-white/60 leading-relaxed mb-6">{home.description}</p>
                  <ul className="space-y-2 mb-8">
                    {home.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                        <div className="w-1.5 h-1.5 bg-[var(--color-lime)] rounded-full flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs text-white/40 uppercase tracking-wider">Starting at</span>
                      <div className="font-serif text-2xl font-semibold text-[var(--color-lime)]">{home.startingAt}</div>
                    </div>
                    <Link href="/floor-plans" className="text-sm font-semibold text-white/60 hover:text-[var(--color-lime)] transition-colors flex items-center gap-1">
                      Explore
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats with Animated Counters */}
      <section className="py-16 bg-[var(--color-teal)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer staggerDelay={150} className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            <FadeIn direction="up" delay={0}>
              <div className="font-serif text-3xl lg:text-4xl font-bold">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <div className="text-sm text-white/70 mt-1">Happy Homeowners</div>
            </FadeIn>
            <FadeIn direction="up" delay={150}>
              <div className="font-serif text-3xl lg:text-4xl font-bold">4.8★</div>
              <div className="text-sm text-white/70 mt-1">Customer Rating</div>
            </FadeIn>
            <FadeIn direction="up" delay={300}>
              <div className="font-serif text-3xl lg:text-4xl font-bold">
                <AnimatedCounter end={6} />
              </div>
              <div className="text-sm text-white/70 mt-1">States Served</div>
            </FadeIn>
            <FadeIn direction="up" delay={450}>
              <div className="font-serif text-3xl lg:text-4xl font-bold">$50K</div>
              <div className="text-sm text-white/70 mt-1">Starting Price</div>
            </FadeIn>
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials with Fade In */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-14">
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
                What Our Homeowners Say
              </h2>
              <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
            </div>
          </FadeIn>

          <StaggerContainer staggerDelay={200} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <FadeIn key={t.name} direction="up" delay={idx * 200}>
                <div className="relative bg-white rounded-lg border border-[var(--color-charcoal)]/5 p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="mb-3">
                  <Image src="/images/homepage/quote.svg" alt="" width={24} height={24} className="opacity-20" />
                </div>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-[var(--color-orange)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote>
                  <p className="text-sm leading-relaxed text-[var(--color-charcoal)]/70 mb-5">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-teal)]/10 flex items-center justify-center text-[var(--color-teal)] font-bold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-[var(--color-gray)]">{t.location}</div>
                    </div>
                  </footer>
                </blockquote>
                </div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Financing CTA */}
      <section className="py-20 lg:py-28 bg-[var(--color-cream-dark)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <Image
            src="/images/homepage/about-2.webp"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
            Affordable Financing Options
          </h2>
          <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto mb-6" />
          <p className="text-base text-[var(--color-gray)] leading-relaxed mb-8 max-w-2xl mx-auto">
            FHA, VA, conventional, and chattel loans available. As low as 0% down for veterans.
            We&rsquo;ll connect you with trusted lenders and guide you through pre-qualification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton>
              <Link 
                href="/financing" 
                className="btn-primary inline-flex items-center justify-center bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-lime-dark)] transition-colors duration-300"
              >
                Explore Financing
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a 
                href="tel:+12603081457" 
                onClick={() => trackPhoneClick("financing_cta")}
                className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-charcoal)]/5 transition-colors duration-300"
              >
                Call Us
              </a>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
                Visit Our Auburn Location
              </h2>
              <div className="w-16 h-1 bg-[var(--color-lime)] mb-6" />
              <p className="text-base text-[var(--color-gray)] leading-relaxed mb-8">
                See our model homes in person. Walk through floor plans, explore customization
                options, and talk with our team about making your dream home a reality.
              </p>
              <address className="not-italic space-y-3 mb-8">
                <p className="font-semibold">1211 State Road 8, Auburn, IN 46706</p>
                <p className="text-sm text-[var(--color-gray)]">Mon–Fri: 9 AM – 5 PM &nbsp;|&nbsp; Sat: 10 AM – 4 PM</p>
              </address>
              <div className="flex flex-col sm:flex-row gap-4">
                <MagneticButton>
                  <a 
                    href="https://maps.google.com/?q=1211+State+Road+8+Auburn+IN+46706" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
                  >
                    Get Directions
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)] px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-charcoal)]/5 transition-colors duration-300"
                  >
                    Contact Us
                  </Link>
                </MagneticButton>
              </div>
            </div>

            <div className="aspect-square lg:aspect-[4/3] bg-gray-100 rounded-lg border border-[var(--color-charcoal)]/5 overflow-hidden">
              <iframe title="Factory Direct Homes Center location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3003.5!2d-85.0583!3d41.3668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDIyJzAwLjUiTiA4NcKwMDMnMjkuOSJX!5e0!3m2!1sen!2sus!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with Schema */}
      <section className="py-20 lg:py-28 bg-[var(--color-cream-dark)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
            <p className="text-base text-[var(--color-gray)] mt-4 max-w-2xl mx-auto">
              Everything you need to know about buying a manufactured home in Indiana, Ohio, and Michigan.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is the difference between manufactured and modular homes?",
                a: "Manufactured homes are built to federal HUD standards on a permanent chassis, making them more affordable and faster to deliver. Modular homes are built to state IRC codes like site-built homes, placed on permanent foundations, and qualify for conventional mortgages. Both are built in factories with quality control that exceeds site-built construction."
              },
              {
                q: "How much does a manufactured home cost in Indiana?",
                a: "Manufactured homes in Indiana typically range from $50,000 to $150,000 depending on size and features. Single wides start around $50,000, double wides from $80,000, and modular homes from $100,000. Factory Direct offers line-item pricing so you see exactly what you're paying for."
              },
              {
                q: "Do you offer financing for manufactured homes?",
                a: "Yes, we work with multiple lenders including 21st Mortgage, Triad Financial, Credit Human, and Lake Michigan Credit Union. We specialize in chattel loans for home-only purchases and can also arrange land-home packages. Cash buyers receive preferred pricing discounts."
              },
              {
                q: "How long does it take to get a manufactured home delivered?",
                a: "From order to move-in typically takes 8-12 weeks. Manufacturing takes 6-8 weeks at our Topeka, IN factory just 20 miles away. Site preparation and permitting add 2-4 weeks. Because we're local, our delivery times are faster than dealers located farther from the factory."
              },
              {
                q: "Can I put a manufactured home on my own land?",
                a: "Yes, manufactured homes can be placed on private land in most areas of Indiana, Ohio, and Michigan. Rural counties like Noble, DeKalb, and Whitley have zoning-friendly regulations. We help verify zoning compliance for your specific property and handle all permitting."
              },
              {
                q: "What areas do you serve?",
                a: "We deliver manufactured and modular homes throughout Indiana, Ohio, Michigan, Wisconsin, Illinois, and Kentucky. Our Auburn, Indiana location is centrally located just 20 miles from the Champion factory, allowing us to serve the entire region with lower delivery costs."
              },
              {
                q: "Do manufactured homes hold their value?",
                a: "Modern manufactured homes built to HUD or IRC codes hold value well, especially when placed on permanent foundations. Modular homes appreciate similarly to site-built homes. Key factors include location, foundation type, and home quality. Champion homes come with comprehensive warranties."
              },
              {
                q: "What is included in the price of a manufactured home?",
                a: "Our line-item pricing shows exactly what you're paying for: the home itself, delivery from the factory, setup and installation, and site work. Unlike dealers who bundle everything, you can choose your own contractors for site work and save thousands."
              }
            ].map((faq, idx) => (
              <details key={idx} className="bg-white rounded-lg border border-[var(--color-charcoal)]/5 overflow-hidden group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-[var(--color-cream)] transition-colors">
                  <span className="font-semibold text-[var(--color-charcoal)] pr-8">{faq.q}</span>
                  <span className="text-[var(--color-teal)] text-xl transition-transform group-open:rotate-180">+</span>
                </summary>
                <div className="px-6 pb-6 text-[var(--color-gray)] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/guides" className="inline-flex items-center gap-2 text-[var(--color-teal)] font-semibold hover:underline">
              View All Guides
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the difference between manufactured and modular homes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Manufactured homes are built to federal HUD standards on a permanent chassis, making them more affordable and faster to deliver. Modular homes are built to state IRC codes like site-built homes, placed on permanent foundations, and qualify for conventional mortgages. Both are built in factories with quality control that exceeds site-built construction."
                }
              },
              {
                "@type": "Question",
                "name": "How much does a manufactured home cost in Indiana?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Manufactured homes in Indiana typically range from $50,000 to $150,000 depending on size and features. Single wides start around $50,000, double wides from $80,000, and modular homes from $100,000. Factory Direct offers line-item pricing so you see exactly what you're paying for."
                }
              },
              {
                "@type": "Question",
                "name": "Do you offer financing for manufactured homes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we work with multiple lenders including 21st Mortgage, Triad Financial, Credit Human, and Lake Michigan Credit Union. We specialize in chattel loans for home-only purchases and can also arrange land-home packages. Cash buyers receive preferred pricing discounts."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to get a manufactured home delivered?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "From order to move-in typically takes 8-12 weeks. Manufacturing takes 6-8 weeks at our Topeka, IN factory just 20 miles away. Site preparation and permitting add 2-4 weeks. Because we're local, our delivery times are faster than dealers located farther from the factory."
                }
              },
              {
                "@type": "Question",
                "name": "Can I put a manufactured home on my own land?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, manufactured homes can be placed on private land in most areas of Indiana, Ohio, and Michigan. Rural counties like Noble, DeKalb, and Whitley have zoning-friendly regulations. We help verify zoning compliance for your specific property and handle all permitting."
                }
              },
              {
                "@type": "Question",
                "name": "What areas do you serve?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We deliver manufactured and modular homes throughout Indiana, Ohio, Michigan, Wisconsin, Illinois, and Kentucky. Our Auburn, Indiana location is centrally located just 20 miles from the Champion factory, allowing us to serve the entire region with lower delivery costs."
                }
              },
              {
                "@type": "Question",
                "name": "Do manufactured homes hold their value?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Modern manufactured homes built to HUD or IRC codes hold value well, especially when placed on permanent foundations. Modular homes appreciate similarly to site-built homes. Key factors include location, foundation type, and home quality. Champion homes come with comprehensive warranties."
                }
              },
              {
                "@type": "Question",
                "name": "What is included in the price of a manufactured home?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our line-item pricing shows exactly what you're paying for: the home itself, delivery from the factory, setup and installation, and site work. Unlike dealers who bundle everything, you can choose your own contractors for site work and save thousands."
                }
              }
            ]
          })
        }}
      />

      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Factory Direct Homes Center",
            "description": "Champion manufactured and modular homes with factory-direct pricing. Serving Indiana, Ohio, Michigan, Wisconsin, Illinois, and Kentucky.",
            "url": "https://factorydirecthomescenter.com",
            "telephone": "+1-260-308-1457",
            "email": "info@factorydirecthomescenter.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1211 State Road 8",
              "addressLocality": "Auburn",
              "addressRegion": "IN",
              "postalCode": "46706",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 41.3668,
              "longitude": -85.0583
            },
            "image": "https://factorydirecthomescenter.com/images/hero-home.jpg",
            "priceRange": "$$",
            "openingHours": [
              "Mo-Fr 09:00-17:00",
              "Sa 10:00-16:00"
            ],
            "areaServed": [
              {
                "@type": "State",
                "name": "Indiana"
              },
              {
                "@type": "State",
                "name": "Ohio"
              },
              {
                "@type": "State",
                "name": "Michigan"
              },
              {
                "@type": "State",
                "name": "Wisconsin"
              },
              {
                "@type": "State",
                "name": "Illinois"
              },
              {
                "@type": "State",
                "name": "Kentucky"
              }
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Manufactured and Modular Homes",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Single Wide Manufactured Homes",
                    "description": "500-1,200 sq ft homes starting at $50,000"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Double Wide Manufactured Homes",
                    "description": "1,000-2,400 sq ft homes starting at $80,000"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Modular Homes",
                    "description": "1,000-2,500+ sq ft IRC-code homes starting at $100,000"
                  }
                }
              ]
            }
          })
        }}
      />

      {/* ImageObject Schema for Hero */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageObject",
            "contentUrl": "https://factorydirecthomescenter.com/images/hero-home.jpg",
            "name": "Modern Manufactured Home Exterior",
            "description": "Modern manufactured home with white siding and black trim on foundation with professional landscaping",
            "width": 2752,
            "height": 1536,
            "author": {
              "@type": "Organization",
              "name": "Factory Direct Homes Center"
            }
          })
        }}
      />

      {/* Hero with Parallax - Using useParallax hook inline */}
      <ParallaxHeroSection />

      {/* Trust Badges Section */}
      <section className="py-12 bg-white border-b border-[var(--color-charcoal)]/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer staggerDelay={100} className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <FadeIn direction="up" delay={0}>
              <div className="text-center">
                <div className="text-3xl mb-2">🏆</div>
                <div className="font-semibold text-sm">Champion Authorized</div>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={100}>
              <div className="text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="font-semibold text-sm">4.8 Star Rating</div>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={200}>
              <div className="text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <div className="font-semibold text-sm">Full Warranty</div>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={300}>
              <div className="text-center">
                <div className="text-3xl mb-2">🚚</div>
                <div className="font-semibold text-sm">20 Mile Delivery</div>
              </div>
            </FadeIn>
          </StaggerContainer>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="py-20 lg:py-28 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-14">
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
                How It Works
              </h2>
              <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
              <p className="text-base text-[var(--color-gray)] mt-4 max-w-2xl mx-auto">
                From browsing to move-in, we make the process simple and transparent
              </p>
            </div>
          </FadeIn>

          <StaggerContainer staggerDelay={200} className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Browse", desc: "Explore floor plans online or visit our showroom", icon: "🔍" },
              { step: "2", title: "Customize", desc: "Choose your options and get a detailed quote", icon: "⚙️" },
              { step: "3", title: "Finance", desc: "We connect you with the best lenders for your situation", icon: "💰" },
              { step: "4", title: "Build & Deliver", desc: "Your home is built and delivered in 8-12 weeks", icon: "🏠" },
            ].map((item, idx) => (
              <FadeIn key={item.step} direction="up" delay={idx * 200}>
                <div className="relative text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-teal)] rounded-full flex items-center justify-center text-2xl text-white font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--color-gray)]">{item.desc}</p>
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-[var(--color-teal)]/20" />
                  )}
                </div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Loading Skeleton Demo - For future async content */}
      <section className="py-12 bg-white hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h3 className="text-lg font-semibold mb-4">Loading State Example</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Parallax Hero Section Component
function ParallaxHeroSection() {
  return (
    <section className="relative h-[280px] sm:h-[320px] lg:h-[380px]" aria-label="Hero section">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-home.jpg"
          alt="Modern manufactured home"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-charcoal)]/80 to-[var(--color-charcoal)]/40" />
      </div>

      {/* Hero Content - Minimal */}
      <div className="relative h-full flex flex-col justify-center px-4 lg:px-8 pt-4">
        <div className="max-w-7xl mx-auto w-full">
          <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[var(--color-lime)] mb-2">
            Factory Direct Homes Center — Auburn, Indiana
          </p>
          <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-light text-white leading-tight">
            Manufactured & Modular Homes<br className="hidden sm:block" /> in Indiana, Ohio & Michigan
          </h1>
        </div>
      </div>
    </section>
  );
}
