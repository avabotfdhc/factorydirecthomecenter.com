import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { H2, H3 } from "@/components/Heading";
import { FloorPlanCard } from "@/components/FloorPlanCard";
import { generateMetadata as genMeta } from "@/lib/seo";
import { getApiFloorPlans, type ApiFloorPlan } from "@/lib/api-content";
import { seriesHubs, getSeriesHub } from "@/lib/series-hubs";

// Series hub pages: what the series is, who it suits, and every matching
// home from the live catalogue. Content in src/lib/series-hubs.ts.

export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return seriesHubs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hub = getSeriesHub(slug);
  if (!hub) return {};
  return genMeta({
    title: `${hub.fullName} Floor Plans & Pricing`,
    description: `${hub.tagline} Browse ${hub.name} series manufactured homes from Factory Direct Homes Center in Auburn, IN, with factory-direct, line-item pricing.`,
    url: `/series/${hub.slug}`,
  });
}

const bedsLabel = (p: ApiFloorPlan) => {
  const lo = Math.min(p.bedsMin ?? p.beds, p.beds);
  const hi = Math.max(p.bedsMax ?? p.beds, p.beds);
  return lo < hi ? `${lo}–${hi}` : String(p.beds);
};

export default async function SeriesHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = getSeriesHub(slug);
  if (!hub) notFound();

  const all = await getApiFloorPlans();
  const plans = all.filter(
    (p) => hub.catalogSeries.includes(p.series) && (!hub.slugPrefix || p.slug.startsWith(hub.slugPrefix)),
  );

  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">{hub.eyebrow}</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              {hub.fullName.split(" Series")[0]}<br />
              <span className="italic text-[var(--color-teal-light)]">{hub.tagline}</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">{hub.intro}</p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="decorative-line mb-6" />
            <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-6">
              What you get with <span className="italic text-[var(--color-teal)]">{hub.name}</span>
            </H2>
            <ul className="space-y-3 text-[var(--color-gray)]">
              {hub.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <span className="text-[var(--color-lime)] mt-1">✓</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-[var(--color-charcoal)]/8 p-8">
            <H3 className="font-serif text-xl font-semibold mb-4">Best for</H3>
            <ul className="space-y-2 text-sm text-[var(--color-charcoal)] mb-6">
              {hub.bestFor.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal)]" />
                  {b}
                </li>
              ))}
            </ul>
            <p className="text-xs tracking-wider uppercase text-[var(--color-gray)]">Building code: {hub.code}</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-y border-[var(--color-charcoal)]/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight">
              {hub.name} floor plans <span className="text-[var(--color-gray)] text-lg align-middle">({plans.length})</span>
            </H2>
            <Link href="/floor-plans" className="text-sm font-semibold text-[var(--color-teal)] hover:underline">
              See every series →
            </Link>
          </div>
          {plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((p) => (
                <FloorPlanCard
                  key={p.slug}
                  plan={p}
                  bedsLabel={bedsLabel(p)}
                  bedsFlex={(p.bedsMin ?? p.beds) < (p.bedsMax ?? p.beds)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-[var(--color-cream)] p-8 lg:p-10 max-w-2xl">
              <p className="text-[var(--color-charcoal)] font-semibold mb-2">We order {hub.name} homes to spec.</p>
              <p className="text-[var(--color-gray)] mb-6">
                None are published on the site yet. Tell us the plan you have in mind, or the size and bedrooms you need, and we&rsquo;ll send Champion&rsquo;s spec sheet and a line-item quote.
              </p>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center bg-[var(--color-lime)] text-white px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-lime-dark)] hover:text-white transition-colors"
              >
                Request a {hub.name} quote
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] mb-4">Other series</p>
          <div className="flex flex-wrap gap-3">
            {seriesHubs.filter((s) => s.slug !== hub.slug).map((s) => (
              <Link
                key={s.slug}
                href={`/series/${s.slug}`}
                className="px-5 py-2.5 rounded-full border border-[var(--color-charcoal)]/15 text-sm font-semibold text-[var(--color-charcoal)] hover:border-[var(--color-teal)]/40 hover:text-[var(--color-teal)] transition-colors"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
