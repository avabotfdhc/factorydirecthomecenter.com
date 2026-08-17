import type { Metadata } from "next";
import { getApiFloorPlans } from "@/lib/api-content";
import { HomeDesigner, type DesignerPlan } from "@/components/HomeDesigner";
import { generateMetadata as genMeta } from "@/lib/seo";

export const metadata: Metadata = genMeta({
  title: "Design Your Home — Build & Request a Quote",
  description:
    "Design your Champion manufactured or modular home online: pick a floor plan, choose layout options, colors, and upgrades, and get a personalized factory-direct quote from Factory Direct Homes Center in Auburn, IN.",
  keywords: [
    "design a manufactured home",
    "build your manufactured home online",
    "manufactured home configurator",
    "customize modular home",
    "Champion home options",
  ],
  url: "/design-your-home",
});

// ISR: the home list comes from the live catalog; refresh every 5 min.
export const revalidate = 300;

// The picker must never take down the page. getApiFloorPlans throws on a CMS
// network failure (by design, to protect ISR elsewhere) — here we'd rather
// render the designer with the repo-published catalog than 500, so we fall
// back to the local floor plans if the live fetch fails.
async function getDesignerPlans(): Promise<DesignerPlan[]> {
  try {
    const plans = await getApiFloorPlans();
    if (plans.length) {
      return plans.map((p) => ({
        slug: p.slug,
        name: p.name,
        series: p.series || "",
        homeType: p.homeType || "Home",
      }));
    }
  } catch {
    /* fall through to the repo catalog */
  }
  const { localFloorPlans, PRIME_SERIES, PRIME_HOME_TYPE } = await import("@/lib/local-floor-plans");
  return localFloorPlans
    .filter((p) => !p.hidden)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      series: p.series || PRIME_SERIES,
      homeType: p.homeType || PRIME_HOME_TYPE,
    }));
}

export default async function DesignYourHomePage({
  searchParams,
}: {
  searchParams: Promise<{ home?: string }>;
}) {
  const { home } = await searchParams;
  const designerPlans = await getDesignerPlans();

  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      <section className="relative pt-28 pb-14 lg:pt-36 lg:pb-16 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-5">
            <div className="decorative-line" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">Design Your Home</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mb-5">
            Build it your way, then <span className="italic text-[var(--color-teal-light)]">get a quote</span>
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
            Choose a Champion floor plan, pick your layout options, colors, and upgrades, and answer a
            couple quick questions. We&rsquo;ll follow up with a personalized, line-item factory-direct
            quote — no obligation.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <HomeDesigner plans={designerPlans} initialHome={home} />
      </section>
    </main>
  );
}
