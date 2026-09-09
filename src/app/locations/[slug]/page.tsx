import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { H2, H3 } from "@/components/Heading";
import { generateMetadata as genMeta } from "@/lib/seo";
import { countyPages, getCountyPage } from "@/lib/county-pages";

// Programmatic county landing pages. Data lives in src/lib/county-pages.ts.
// A county that also has its own folder under src/app/locations/ is served by
// that folder (static routes win), so only the remaining slugs are generated.

export const dynamicParams = false;

const STATIC_LOCATION_SLUGS = new Set(["dekalb-county", "noble-county"]);

export function generateStaticParams() {
  return countyPages
    .filter((c) => !STATIC_LOCATION_SLUGS.has(c.slug))
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCountyPage(slug);
  if (!c) return {};
  return genMeta({
    title: `Manufactured Homes in ${c.county}, IN`,
    description: `Champion manufactured and modular homes delivered to ${c.county}, Indiana. Serving ${c.towns.slice(0, 4).join(", ")} with factory-direct pricing and line-item transparency from Auburn, IN.`,
    url: `/locations/${c.slug}`,
    type: "article",
  });
}

export default async function CountyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCountyPage(slug);
  if (!c) notFound();

  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">{c.eyebrow}</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Manufactured Homes<br />
              <span className="italic text-[var(--color-teal-light)]">in {c.county}</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">{c.intro}</p>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="decorative-line mb-6" />
              <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-8">
                Why {c.county} Buyers<br />
                <span className="italic text-[var(--color-teal)]">Order Factory Direct</span>
              </H2>
              <div className="space-y-6 text-[var(--color-gray)] leading-relaxed">
                <p>{c.driveNote}</p>
                <ul className="space-y-3">
                  {c.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3">
                      <span className="text-[var(--color-lime)] mt-1">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[var(--color-charcoal)]/8 p-8 lg:p-10">
              <H3 className="font-serif text-2xl font-semibold mb-4">Communities we deliver to</H3>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[var(--color-charcoal)] mb-8">
                {c.towns.map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal)]" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-[var(--color-gray)] mb-2">
                <strong className="text-[var(--color-charcoal)]">Distance from our Auburn lot:</strong> {c.milesFromAuburn}
              </p>
              <p className="text-sm text-[var(--color-gray)]">
                Delivery and set-up are quoted line by line for your exact site. See{" "}
                <Link href="/guides/delivery-and-setup" className="text-[var(--color-teal)] font-semibold underline underline-offset-4">
                  what to expect on delivery day
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-y border-[var(--color-charcoal)]/8">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-6">
            Zoning &amp; permits in <span className="italic text-[var(--color-teal)]">{c.county}</span>
          </H2>
          <p className="text-[var(--color-gray)] leading-relaxed mb-6">{c.zoningNote}</p>
          <p className="text-[var(--color-gray)] leading-relaxed">
            Read our{" "}
            <Link href="/guides/zoning" className="text-[var(--color-teal)] font-semibold underline underline-offset-4">
              zoning guide
            </Link>{" "}
            and{" "}
            <Link href="/guides/site-work" className="text-[var(--color-teal)] font-semibold underline underline-offset-4">
              site-work checklist
            </Link>{" "}
            for what a typical {c.county} set-up involves.
          </p>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <H2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Get a line-item quote for<br />
            <span className="italic text-[var(--color-teal-light)]">your {c.county} site</span>
          </H2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Pick a floor plan, tell us the parcel, and we&rsquo;ll price the home, delivery and set-up separately so you can see every dollar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/floor-plans"
              className="inline-flex items-center justify-center bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-4 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-lime-dark)] hover:text-white transition-colors"
            >
              Browse Floor Plans
            </Link>
            <a
              href="tel:+12603081457"
              className="inline-flex items-center justify-center border-2 border-white/30 text-white px-8 py-4 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-white/10 transition-colors"
            >
              Call (260) 308-1457
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
