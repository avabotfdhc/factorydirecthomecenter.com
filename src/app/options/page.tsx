import type { Metadata } from "next";
import { StructuredData, structuredData } from "@/lib/seo";
import { LightboxGallery } from "@/components/ImageLightbox";

const SITE = "https://factorydirecthomescenter.com";

export const metadata: Metadata = {
  title: "Factory Options & Selections — Champion Homes",
  description:
    "Browse Champion's factory options for your new manufactured or modular home: interior and exterior selections, fireplaces, kitchen islands, optional cabinets, exterior styles, and full series brochures — from Factory Direct Homes Center in Auburn, Indiana.",
  alternates: { canonical: `${SITE}/options` },
  keywords: [
    "manufactured home options",
    "champion homes options",
    "manufactured home upgrades",
    "modular home options",
    "champion homes brochure",
  ],
};

// All content on this page is static repo-published Champion literature.
export const revalidate = 3600;

// Champion's 2026 factory option drawings (Box: 2026 Sales Options),
// rendered to site images. Each group becomes a lightbox gallery.
const drawingGroups: Array<{ title: string; blurb: string; prefix: string; pages: number }> = [
  {
    title: "Fireplace options",
    blurb: "Electric and gas fireplace configurations, including entertainment-center and corner installs.",
    prefix: "fireplaces",
    pages: 1,
  },
  {
    title: "Kitchen islands",
    blurb: "Optional island layouts and sizes for open-kitchen floor plans.",
    prefix: "islands",
    pages: 6,
  },
  {
    title: "Optional cabinets",
    blurb: "Overhead, pantry, and buffet cabinet upgrades in Champion's overlay style.",
    prefix: "opt-cabs",
    pages: 4,
  },
  {
    title: "Study desk",
    blurb: "The built-in Summit study desk option.",
    prefix: "study-desk",
    pages: 1,
  },
  {
    title: "Single-wide exteriors (HUD)",
    blurb: "Exterior elevation styles for HUD-code homes — dormers, window packages, and trim options.",
    prefix: "hud-exteriors",
    pages: 9,
  },
  {
    title: "Modular exteriors",
    blurb: "Exterior elevation styles for modular homes.",
    prefix: "mod-exteriors",
    pages: 5,
  },
];

// Series brochures: small ones are hosted on this site; the full-resolution
// series brochures link to Champion's own published Box copies.
const brochures: Array<{ name: string; desc: string; href: string; external?: boolean }> = [
  {
    name: "Perfect Options 2026",
    desc: "Champion's full options catalog — exteriors, kitchens, baths, and built-ins.",
    href: "/brochures/perfect-options-2026.pdf",
  },
  {
    name: "Odyssey by Champion",
    desc: "The Odyssey flagship double wide: photos, floor plans, and options.",
    href: "/brochures/odyssey-by-champion.pdf",
  },
  {
    name: "Aspire Sectional Brochure",
    desc: "Champion's Aspire Series double wides, published by Champion Homes.",
    href: "https://championh.box.com/s/v7u9pu1qsi0tpmt4gxvo2qxcrzf5je5z",
    external: true,
  },
  {
    name: "Aspire Single Wide Brochure",
    desc: "Champion's Aspire Series single wides, published by Champion Homes.",
    href: "https://championh.box.com/s/19m1o4gwanj21h8rryhwb065axzimqpx",
    external: true,
  },
  {
    name: "Aspire Modular Brochure",
    desc: "Champion's Aspire Series modular homes, published by Champion Homes.",
    href: "https://championh.box.com/s/gibc21e0juupef6pm98gs40kki6g6r4v",
    external: true,
  },
];

export default function OptionsPage() {
  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      <StructuredData
        data={structuredData.breadcrumb([
          { name: "Home", url: "/" },
          { name: "Factory Options & Selections", url: "/options" },
        ])}
      />

      {/* Hero */}
      <section className="bg-[var(--color-charcoal)] text-[var(--color-cream)] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-lime)] mb-4">
            Built to Your Order
          </p>
          <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mb-5">
            Factory Options &amp; <span className="italic text-[var(--color-teal-light)]">Selections</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed mb-8">
            Every home we sell is built to order at Champion&apos;s Indiana plants — which means colors,
            finishes, fireplaces, islands, cabinets, and exterior styling are your call. Browse
            Champion&apos;s factory literature below, then{" "}
            <a href="/contact-us" className="text-[var(--color-teal-light)] underline underline-offset-4">ask us to price the options you want</a>.
          </p>
          <a
            href="/design-your-home"
            className="inline-flex items-center gap-2 bg-[var(--color-lime)] text-[var(--color-charcoal)] px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-lime-dark)] hover:text-white transition-colors"
          >
            Design Your Home Online
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </a>
        </div>
      </section>

      {/* 2026 selections */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <h2 className="font-serif text-3xl font-light mb-3">2026 Interior &amp; Exterior Selections</h2>
        <p className="text-[var(--color-charcoal)]/70 max-w-3xl mb-8">
          Champion&apos;s current palette: countertops, cabinet styles, vinyl flooring, ceramic tile,
          siding colors, shingles, and shutters. Every combination is chosen at order time at no
          change to the base floor plan.
        </p>
        <LightboxGallery
          images={[{ src: "/images/paramount/2026-selections.webp", alt: "Champion Homes 2026 interior and exterior selections chart" }]}
          gridClassName="max-w-3xl"
          imgClassName="w-full rounded-xl border border-[var(--color-charcoal)]/8 bg-white cursor-zoom-in"
        />
      </section>

      {/* Brochures */}
      <section className="bg-white border-y border-[var(--color-charcoal)]/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <h2 className="font-serif text-3xl font-light mb-3">Brochures</h2>
          <p className="text-[var(--color-charcoal)]/70 max-w-3xl mb-8">
            Champion&apos;s series brochures — photography, floor plans, and the options each series offers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brochures.map((b) => (
              <a
                key={b.name}
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-[var(--color-charcoal)]/8 hover:border-[var(--color-teal)]/30 rounded-xl p-6 transition-all hover:shadow-lg bg-[var(--color-cream)]"
              >
                <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-[var(--color-teal)] transition-colors">
                  {b.name}
                </h3>
                <p className="text-sm text-[var(--color-charcoal)]/70 mb-4">{b.desc}</p>
                <span className="text-xs font-bold tracking-wider uppercase text-[var(--color-teal)]">
                  {b.external ? "View on Champion's site ↗" : "Download PDF"}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Option drawings */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <h2 className="font-serif text-3xl font-light mb-3">Factory Option Drawings</h2>
        <p className="text-[var(--color-charcoal)]/70 max-w-3xl mb-10">
          Champion&apos;s 2026 factory drawings for popular upgrades. These are the actual spec sheets
          the plant builds from — tap any drawing to zoom. Availability varies by floor plan; we&apos;ll
          confirm what fits the home you&apos;re considering.
        </p>
        <div className="space-y-12">
          {drawingGroups.map((g) => (
            <div key={g.prefix}>
              <h3 className="font-serif text-2xl font-light mb-1">{g.title}</h3>
              <p className="text-sm text-[var(--color-charcoal)]/60 mb-5">{g.blurb}</p>
              <LightboxGallery
                images={Array.from({ length: g.pages }, (_, i) => ({
                  src: `/images/options/${g.prefix}-${i + 1}.webp`,
                  alt: `${g.title} — Champion factory drawing ${i + 1} of ${g.pages}`,
                }))}
                gridClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                imgClassName="w-full aspect-[4/3] rounded-lg border border-[var(--color-charcoal)]/8 bg-white object-contain cursor-zoom-in"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-teal)] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl font-light mb-2">Want line-item pricing on options?</h2>
            <p className="text-white/80 max-w-xl">
              Tell us the floor plan and the options you&apos;re considering — we quote every line
              separately so you can see exactly what each upgrade costs.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a
              href="/contact-us"
              className="inline-flex items-center justify-center bg-white text-[var(--color-teal)] px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-cream)] transition-colors"
            >
              Get a Quote
            </a>
            <a
              href="tel:+12603081457"
              className="inline-flex items-center justify-center border-2 border-white/40 px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-white/10 transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
