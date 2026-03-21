import Link from "next/link";

const homeTypes = [
  {
    title: "Single Wide",
    subtitle: "Efficient Living",
    sqft: "500 – 1,200 sq ft",
    beds: "1–3 Bed",
    baths: "1–2 Bath",
    startingAt: "$50,000",
    description:
      "Thoughtfully designed for smart, comfortable living. Perfect for first-time buyers, downsizers, or anyone who values quality over excess.",
    features: ["14–18 ft wide", "Up to 80 ft long", "Open floor plans"],
  },
  {
    title: "Double Wide",
    subtitle: "Room to Breathe",
    sqft: "1,000 – 2,400 sq ft",
    beds: "2–4 Bed",
    baths: "2–3 Bath",
    startingAt: "$80,000",
    description:
      "Spacious sectional homes that rival site-built quality. The Brighton and Silverton series offer generous layouts for growing families.",
    features: ["24–32 ft wide", "Multiple living areas", "Walk-in closets"],
  },
  {
    title: "Modular",
    subtitle: "Built to Code",
    sqft: "1,000 – 2,500+ sq ft",
    beds: "2–5 Bed",
    baths: "2+ Bath",
    startingAt: "$100,000",
    description:
      "IRC-code compliant homes placed on permanent foundations. Indistinguishable from site-built, with factory precision and pricing.",
    features: ["Permanent foundation", "IRC building codes", "Fully customizable"],
  },
];

const testimonials = [
  {
    quote:
      "Buying our home was the best decision we ever made. The team walked us through every step and we saved thousands compared to site-built.",
    name: "David B.",
    location: "Fort Wayne, IN",
  },
  {
    quote:
      "We were priced out of the traditional market. Our double wide gives us everything we wanted at half the price.",
    name: "Sarah M.",
    location: "Indianapolis, IN",
  },
  {
    quote:
      "As a veteran, the VA financing with no money down was incredible. The process was smooth and our home is beautiful.",
    name: "James T.",
    location: "South Bend, IN",
  },
];

const advantages = [
  {
    title: "Factory-Direct Pricing",
    description:
      "No middlemen. We buy directly from Champion's Decatur, IN plant — shorter delivery, lower costs, passed on to you.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Champion Exclusive",
    description:
      "America's #2 home builder, with 20% national market share. We carry their full lineup — Aspire, Brighton, Silverton, and more.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    title: "Full-Service Experience",
    description:
      "From selection to setup — we coordinate site prep, delivery, installation, and utility connections so you don't have to.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384-3.19A.6.6 0 015.7 11.4l5.384-3.19a.6.6 0 01.916.509v6.382a.6.6 0 01-.58.578zM17.114 11.4l5.384-3.19a.6.6 0 00-.336-.58l-5.384-3.19a.6.6 0 00-.916.509v6.382a.6.6 0 00.252.46z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
      </svg>
    ),
  },
  {
    title: "Tri-State Delivery",
    description:
      "Serving Indiana, Michigan, and Ohio. Our proximity to Champion's Indiana plant means faster delivery and lower transport costs.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center grain-overlay overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-charcoal)] via-[var(--color-charcoal-light)] to-[#4A3F35]" />

        {/* Decorative geometric elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.04]">
          <div className="absolute top-20 right-20 w-96 h-96 border border-white rotate-12" />
          <div className="absolute bottom-40 right-40 w-64 h-64 border border-white -rotate-6" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 lg:py-40 w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-8 animate-on-load animate-fade-up">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-terracotta-light)]">
                Champion Homes Exclusive Dealer
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-[0.95] tracking-tight mb-8 animate-on-load animate-fade-up animation-delay-100">
              Your Home,{" "}
              <span className="italic text-[var(--color-terracotta-light)]">
                Built Right.
              </span>
              <br />
              Priced Fair.
            </h1>

            {/* Subhead */}
            <p className="text-lg lg:text-xl text-white/60 leading-relaxed max-w-xl mb-12 animate-on-load animate-fade-up animation-delay-200">
              New manufactured and modular homes with factory-direct pricing.
              Serving Indiana, Michigan &amp; Ohio from Auburn, IN.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-on-load animate-fade-up animation-delay-300">
              <Link
                href="/floor-plans"
                className="btn-primary inline-flex items-center justify-center gap-3 bg-[var(--color-terracotta)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-terracotta-dark)] transition-colors duration-300"
              >
                Browse Floor Plans
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
              <a
                href="tel:+12603081457"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300"
              >
                Call Us Today
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 pt-10 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-8 animate-on-load animate-fade-up animation-delay-400">
            {[
              { value: "500+", label: "Happy Homeowners" },
              { value: "4.8★", label: "Customer Rating" },
              { value: "3", label: "States Served" },
              { value: "$50K+", label: "Starting Price" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-3xl lg:text-4xl font-semibold text-[var(--color-terracotta-light)]">
                  {stat.value}
                </div>
                <div className="text-xs tracking-widest uppercase text-white/40 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Factory Direct */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <div className="decorative-line mb-6" />
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
              Why Choose{" "}
              <span className="italic text-[var(--color-terracotta)]">
                Factory Direct?
              </span>
            </h2>
            <p className="text-lg text-[var(--color-warm-gray)] leading-relaxed">
              We&rsquo;re not a big-box dealer. We&rsquo;re a family-owned business
              that believes everyone deserves a quality home at an honest price.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
            {advantages.map((item, i) => (
              <div key={item.title} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)]">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--color-warm-gray)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Home Types */}
      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
            <div>
              <div className="decorative-line mb-6" />
              <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
                Find Your{" "}
                <span className="italic text-[var(--color-terracotta-light)]">
                  Perfect Home
                </span>
              </h2>
            </div>
            <Link
              href="/floor-plans"
              className="text-sm font-semibold tracking-widest uppercase text-[var(--color-terracotta-light)] hover:text-white transition-colors flex items-center gap-2"
            >
              View All Floor Plans
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {homeTypes.map((home) => (
              <div
                key={home.title}
                className="group bg-white/5 border border-white/10 hover:border-[var(--color-terracotta)]/40 transition-all duration-500"
              >
                {/* Card header */}
                <div className="p-8 pb-6 border-b border-white/10">
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-terracotta-light)]">
                    {home.subtitle}
                  </span>
                  <h3 className="font-serif text-3xl font-semibold mt-2 mb-4">
                    {home.title}
                  </h3>
                  <div className="flex gap-4 text-xs tracking-wider uppercase text-white/50">
                    <span>{home.sqft}</span>
                    <span className="text-white/20">|</span>
                    <span>{home.beds}</span>
                    <span className="text-white/20">|</span>
                    <span>{home.baths}</span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-8">
                  <p className="text-sm text-white/60 leading-relaxed mb-6">
                    {home.description}
                  </p>
                  <ul className="space-y-2 mb-8">
                    {home.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                        <div className="w-1 h-1 bg-[var(--color-terracotta-light)] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs text-white/40 uppercase tracking-wider">
                        Starting at
                      </span>
                      <div className="font-serif text-2xl font-semibold text-[var(--color-terracotta-light)]">
                        {home.startingAt}
                      </div>
                    </div>
                    <Link
                      href="/floor-plans"
                      className="text-sm font-semibold text-white/60 hover:text-[var(--color-terracotta-light)] transition-colors group-hover:translate-x-1 duration-300 flex items-center gap-1"
                    >
                      Explore
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="decorative-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
              What Our{" "}
              <span className="italic text-[var(--color-terracotta)]">
                Homeowners
              </span>{" "}
              Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="relative bg-white border border-[var(--color-charcoal)]/5 p-8 lg:p-10"
              >
                {/* Quote mark */}
                <span className="font-serif text-6xl text-[var(--color-terracotta)]/15 leading-none absolute top-4 left-6">
                  &ldquo;
                </span>
                <blockquote className="relative pt-8">
                  <p className="text-sm leading-relaxed text-[var(--color-charcoal)]/70 mb-6">
                    {t.quote}
                  </p>
                  <footer>
                    <div className="font-serif text-lg font-semibold">{t.name}</div>
                    <div className="text-xs text-[var(--color-warm-gray)] tracking-wider uppercase">
                      {t.location}
                    </div>
                  </footer>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing CTA */}
      <section className="py-24 lg:py-32 bg-[var(--color-cream-dark)] relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-terracotta)]">
              Financing Options
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mt-4 mb-6">
              Your Dream Home is More{" "}
              <span className="italic text-[var(--color-terracotta)]">
                Affordable
              </span>{" "}
              Than You Think
            </h2>
            <p className="text-lg text-[var(--color-warm-gray)] leading-relaxed mb-10 max-w-2xl mx-auto">
              FHA, VA, conventional, and chattel loans available. As low as 0% down
              for veterans. We&rsquo;ll connect you with trusted lenders and guide you
              through pre-qualification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/financing"
                className="btn-primary inline-flex items-center justify-center gap-3 bg-[var(--color-terracotta)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-terracotta-dark)] transition-colors duration-300"
              >
                Explore Financing
              </Link>
              <a
                href="tel:+12603081457"
                className="inline-flex items-center justify-center gap-2 border border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)] px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-charcoal)]/5 transition-colors duration-300"
              >
                Talk to Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Location / CTA */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="decorative-line mb-6" />
              <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
                Come Visit Our{" "}
                <span className="italic text-[var(--color-terracotta)]">
                  Auburn
                </span>{" "}
                Location
              </h2>
              <p className="text-lg text-[var(--color-warm-gray)] leading-relaxed mb-8">
                See our model homes in person. Walk through floor plans, explore
                customization options, and talk with our team about making your dream
                home a reality.
              </p>
              <address className="not-italic space-y-3 mb-8">
                <p className="text-base font-semibold">1211 State Road 8, Auburn, IN 46706</p>
                <p className="text-sm text-[var(--color-warm-gray)]">
                  Mon–Fri: 9 AM – 5 PM &nbsp;|&nbsp; Sat: 10 AM – 4 PM
                </p>
              </address>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://maps.google.com/?q=1211+State+Road+8+Auburn+IN+46706"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-2 bg-[var(--color-charcoal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-charcoal-light)] transition-colors duration-300"
                >
                  Get Directions
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)] px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-charcoal)]/5 transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Map embed placeholder */}
            <div className="aspect-square lg:aspect-[4/3] bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/5 flex items-center justify-center">
              <iframe
                title="Factory Direct Homes Center location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3003.5!2d-85.0583!3d41.3668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDIyJzAwLjUiTiA4NcKwMDMnMjkuOSJX!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
