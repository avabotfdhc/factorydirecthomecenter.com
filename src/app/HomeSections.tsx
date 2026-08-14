"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FadeIn,
  StaggerContainer,
  AnimatedCounter,
  useScrollTracking,
  useTimeOnPageTracking,
  MagneticButton,
} from "@/components/VisualEffects";
import { trackPhoneClick } from "@/lib/analytics";
import { H2, H3 } from "@/components/Heading";

const homeTypes = [
  {
    title: "Single Wide",
    subtitle: "Efficient Living",
    sqft: "500 – 1,200 sq ft",
    beds: "1–3 Bed",
    baths: "1–2 Bath",
    startingAt: "Contact for pricing",
    description: "Thoughtfully designed for smart, comfortable living. Perfect for first-time buyers, downsizers, or anyone who values quality over excess.",
    features: ["14–18 ft wide", "Up to 80 ft long", "Open floor plans"],
    image: "/images/homepage/single-wides.webp",
  },
  {
    title: "Double Wide",
    subtitle: "Room to Breathe",
    sqft: "1,000 – 2,400 sq ft",
    beds: "3–5 Bed",
    baths: "2–3 Bath",
    startingAt: "Contact for pricing",
    description: "Spacious sectional homes that rival site-built quality. The Brighton and Silverton series offer generous layouts for growing families.",
    features: ["24–32 ft wide", "Multiple living areas", "Walk-in closets"],
    image: "/images/homepage/double-wide-exterior.webp",
  },
  {
    title: "Modular",
    subtitle: "Built to Code",
    sqft: "1,000 – 2,500+ sq ft",
    beds: "2–5 Bed",
    baths: "2+ Bath",
    startingAt: "Contact for pricing",
    description: "IRC-code compliant homes placed on permanent foundations. Indistinguishable from site-built, with factory precision and pricing.",
    features: ["Permanent foundation", "IRC building codes", "Fully customizable"],
    image: "/images/homepage/feature-find-home.webp",
  },
];

const testimonials = [
  { quote: "Buying our home was the best decision we ever made. The team walked us through every step and we saved thousands compared to site-built.", name: "David B.", location: "Fort Wayne, IN" },
  { quote: "We were priced out of the traditional market. Our double wide gives us everything we wanted at half the price.", name: "Sarah M.", location: "Indianapolis, IN" },
  { quote: "The factory-direct pricing was exactly as promised — no hidden fees, no surprises. We got more home for our budget than anywhere else we looked.", name: "James T.", location: "South Bend, IN" },
];

// Client islands for the homepage: only the sections that animate or track
// interactions hydrate. Everything else is server-rendered in app/page.tsx.
export function AnimatedHomeSections() {
  useScrollTracking();
  useTimeOnPageTracking();

  return (
    <>
      {/* Why Factory Direct */}
      <section className="py-20 lg:py-28 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <H2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              Why Choose Factory Direct?
            </H2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto mb-6" />
            <p className="text-base text-[var(--color-gray)] max-w-2xl mx-auto">
              We&rsquo;re a family-owned business that believes everyone deserves a quality home at an honest price.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Largest Champion Factory", desc: "Topeka, IN — the largest Champion plant in the country. Aspire, Prime, Paramount, Redman, and Dutch series, all built 20 miles away.", icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { title: "Factory-Direct Pricing", desc: "No middlemen. We buy directly from the factory — shorter delivery, lower costs, passed on to you with line-item transparency.", icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" },
              { title: "You Stay in Control", desc: "We sell the home and arrange delivery. You hire your own contractors for site work and setup \u2014 most buyers save money this way, and we\u2019ll share a referral list of licensed and insured contractors past customers have used.", icon: "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" },
              { title: "Tri-State Delivery", desc: "Serving Indiana, Michigan, and Ohio. Proximity to Champion\u2019s plant means faster delivery and lower costs.", icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-lg p-8 text-center border border-[var(--color-charcoal)]/5 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-full bg-[var(--color-teal)]/10 text-[var(--color-teal)]">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <H3 className="font-semibold text-base mb-2">{item.title}</H3>
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
            <H2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
              Browse by Home Type
            </H2>
            <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {homeTypes.map((home) => (
              <div key={home.title} className="group bg-white/5 border border-white/10 rounded-lg hover:border-[var(--color-teal)]/40 transition-all duration-500 overflow-hidden">
                <figure className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={home.image}
                    alt={`${home.title} manufactured home - ${home.sqft}, ${home.beds}, ${home.baths}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <figcaption className="sr-only">{home.title} - {home.description}</figcaption>
                </figure>
                <div className="p-8 pb-6 border-b border-white/10">
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-lime)]">{home.subtitle}</span>
                  <H3 className="font-serif text-3xl font-semibold mt-2 mb-4">{home.title}</H3>
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
                      <div className="font-serif text-xl font-semibold text-[var(--color-lime)]">{home.startingAt}</div>
                    </div>
                    <Link href="/floor-plans" className="text-sm font-semibold text-white/60 hover:text-[var(--color-lime)] transition-colors flex items-center gap-1">
                      Explore
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
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
                <AnimatedCounter end={70} suffix="+" />
              </div>
              <div className="text-sm text-white/70 mt-1">Floor Plans</div>
            </FadeIn>
            <FadeIn direction="up" delay={150}>
              <div className="font-serif text-3xl lg:text-4xl font-bold">20mi</div>
              <div className="text-sm text-white/70 mt-1">From the Factory</div>
            </FadeIn>
            <FadeIn direction="up" delay={300}>
              <div className="font-serif text-3xl lg:text-4xl font-bold">
                <AnimatedCounter end={3} />
              </div>
              <div className="text-sm text-white/70 mt-1">States Served</div>
            </FadeIn>
            <FadeIn direction="up" delay={450}>
              <div className="font-serif text-3xl lg:text-4xl font-bold">100%</div>
              <div className="text-sm text-white/70 mt-1">Factory Direct</div>
            </FadeIn>
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials with Fade In */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-14">
              <H2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
                What Our Homeowners Say
              </H2>
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
          <H2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
            Affordable Financing Options
          </H2>
          <div className="w-16 h-1 bg-[var(--color-lime)] mx-auto mb-6" />
          <p className="text-base text-[var(--color-gray)] leading-relaxed mb-8 max-w-2xl mx-auto">
            Chattel loans and land-home financing available through our trusted lending partners.
            We&rsquo;ll guide you through pre-qualification and help you find the right option.
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
              <H2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
                Visit Our Auburn Location
              </H2>
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
                    href="/contact-us" 
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

    </>
  );
}

export function TrustAndProcess() {
  return (
    <>
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
              <H2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
                How It Works
              </H2>
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
                  <H3 className="font-serif text-xl font-semibold mb-2">{item.title}</H3>
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

    </>
  );
}
