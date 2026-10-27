import type { Metadata } from "next";
import { FAQSection } from "@/components/FAQSection";
import { SpecsDisclaimer } from "@/components/SpecsDisclaimer";
import { getApiFloorPlans } from "@/lib/api-content";
import { HomeDesigner, type DesignerPlan } from "@/components/HomeDesigner";
import { generateMetadata as genMeta } from "@/lib/seo";

export const metadata: Metadata = genMeta({
  title: "Design Your Manufactured Home Online",
  description:
    "Pick a Champion floor plan, see it drawn in your siding, shingle, shutter and door choices, and request a line-item factory-direct quote. Auburn, IN.",
  keywords: [
    "design a manufactured home online",
    "manufactured home exterior color visualizer",
    "mobile home siding colors",
    "manufactured home configurator",
    "Champion home options",
    "customize modular home",
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
        ...(p.modelNumber ? { modelNumber: p.modelNumber } : {}),
        ...(p.lengthFt ? { lengthFt: p.lengthFt } : {}),
        ...(p.widthFt ? { widthFt: p.widthFt } : {}),
        ...(p.beds ? { beds: p.beds } : {}),
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
      modelNumber: p.modelNumber,
      lengthFt: parseInt(p.length, 10) || undefined,
      widthFt: parseInt(p.width, 10) || undefined,
      beds: p.beds,
    }));
}

const HOW_IT_WORKS = [
  {
    title: "Choose a Champion floor plan",
    body:
      "Every Champion plan we sell is in the list. Pick one and the page draws its exterior — front, rear and both ends — with the windows and doors where Champion's floor plan sheet puts them.",
  },
  {
    title: "Pick colors and options",
    body:
      "Siding, shingles, shutters or lineals, the front door and a shake gable accent come from Champion's 2026 selection boards for that series, so what you see is what the factory offers. The home redraws as you click.",
  },
  {
    title: "Get a line-item quote",
    body:
      "Your choices go to our Auburn, Indiana showroom as one design. We price it line by line — the home, the options you picked and delivery — with no pressure and nothing hidden. Site work, foundation and setup are quoted by your own contractor.",
  },
];

const DESIGNER_FAQS = [
  {
    question: "Is the picture what my home will look like?",
    answer:
      "It is an illustration drawn from Champion's floor plan sheet for the model you pick, so the window and door placement matches the plan and the colors come from Champion's current selection boards. Shingle texture, trim details, the foundation, steps and landscaping are shown for illustration only — the foundation, steps and skirting are site work your own contractor does.",
  },
  {
    question: "Why does a Prime home show fewer choices than an Aspire home?",
    answer:
      "Prime is Champion's value series, built in Decatur, Indiana, with a fixed set of standard features: its own five siding colors, five shutter colors, black 3-tab shingles and 6-panel doors. Aspire homes, built in Topeka, Indiana, have the larger 2026 selections board plus optional doors, a Black Exterior package, lineals, shake gables, porches and dormers.",
  },
  {
    question: "Does designing my home online commit me to anything?",
    answer:
      "No. Submitting a design sends your choices to our sales team so the quote we prepare already reflects what you want. There is no obligation, we do not pull credit, and we show every line of the price so you can compare it with any other dealer's.",
  },
];

export default async function DesignYourHomePage({
  searchParams,
}: {
  searchParams: Promise<{ home?: string }>;
}) {
  const { home } = await searchParams;
  const designerPlans = await getDesignerPlans();

  return (
    <div className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">      <section className="relative pt-28 pb-14 lg:pt-36 lg:pb-16 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-5">
            <div className="decorative-line" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">Design Your Home</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mb-5">
            Build it your way, then <span className="italic text-[var(--color-teal-light)]">get a quote</span>
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
            Choose a Champion floor plan, pick your layout options, colors, and upgrades, and watch the
            exterior redraw in your colors as you go. Answer a couple quick questions and we&rsquo;ll follow
            up with a personalized, line-item factory-direct quote — no obligation.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <HomeDesigner plans={designerPlans} initialHome={home} />

        {/* Server-rendered copy a crawler can read: what the tool does and where its colors come from. */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item, i) => (
            <div key={item.title} className="bg-white border border-[var(--color-charcoal)]/8 rounded-2xl p-6">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-lime-dark)] mb-2">Step {i + 1}</p>
              <h2 className="font-serif text-xl font-light mb-2">{item.title}</h2>
              <p className="text-sm text-[var(--color-gray)] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <SpecsDisclaimer className="mt-12" />
      </section>

      <FAQSection
        title="Designing your home online"
        subtitle="Straight answers about the picture, the colors and what happens after you submit."
        faqs={DESIGNER_FAQS}
      />
    </div>
  );
}
