import type { Metadata } from "next";
import { FAQSection } from "@/components/FAQSection";
import { SpecsDisclaimer } from "@/components/SpecsDisclaimer";
import { forBrowser, getDesignerPlans } from "@/lib/designer-plans";
import { designCopyConfigured } from "@/lib/design-summary-send";
import { HomeDesigner } from "@/components/HomeDesigner";
import { generateMetadata as genMeta } from "@/lib/seo";
import { exteriorCatalog } from "@/lib/exterior-options";
import { sidingByLabel } from "@/lib/elevation-defaults";
import type { DesignerSource } from "@/lib/designer-link";
import { SITE_URL, businessRef } from "@/lib/business";
import { jsonLdScript } from "@/lib/json-ld";

const DESIGN_PAGE_DESCRIPTION =
  "Design a Champion manufactured home online: pick a floor plan, see it full screen in your siding, shingle and shutter colors, and get a line-item quote.";

export const metadata: Metadata = genMeta({
  title: "Design Your Manufactured Home Online",
  description: DESIGN_PAGE_DESCRIPTION,
  keywords: [
    "build your own manufactured home online",
    "mobile home design tool",
    "manufactured home floor plan designer",
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

// Always true of the tool, so always asked.
const FULL_SCREEN_FAQ = {
  question: "Can I use the designer full screen?",
  answer:
    "Yes. Tap the picture of your home or the Open full screen button and the whole designer fills your screen, on a phone or a computer. Close it, press Escape or use your Back button to return to the page — every choice you made stays as you left it.",
};

// Asked only where this deployment can actually send a copy, so the page and
// its FAQPage schema never promise an email or a text the site cannot send.
function copyFaq(channels: { email: boolean; sms: boolean }) {
  const how = channels.email && channels.sms ? "by email, by text, or both" : channels.email ? "by email" : "by text";
  return {
    question: "Can I get a copy of my design?",
    answer: `Yes. In the last step, choose to have your design sent to you ${how}. Once every question is answered and you submit, we send the picture of your home, its floor plan and every choice you made, with our address and phone number, so you can share it or bring it to the lot. Texts are sent only if you tick the text consent box.`,
  };
}

const SOURCES: DesignerSource[] = ["plan_page", "plan_page_swatch", "plan_card", "promo_band", "quote_modal", "header", "footer", "home"];

export default async function DesignYourHomePage({
  searchParams,
}: {
  searchParams: Promise<{ home?: string; siding?: string; src?: string }>;
}) {
  const { home, siding, src } = await searchParams;
  const designerPlans = forBrowser(await getDesignerPlans());
  // Offer only the copies this deployment can send. Preview deployments show
  // both so the form can be reviewed before email and texting are set up.
  const canSend = designCopyConfigured();
  const preview = process.env.VERCEL_ENV !== "production";
  const copyChannels = { email: canSend.email || preview, sms: canSend.sms || preview };
  const offersCopy = copyChannels.email || copyChannels.sms;
  const faqs = [...DESIGNER_FAQS, FULL_SCREEN_FAQ, ...(offersCopy ? [copyFaq(copyChannels)] : [])];
  // `home`, `siding` and `src` arrive from the plan pages' teasers and the
  // other entry points (src/lib/designer-link.ts). The siding label is only
  // honoured when the chosen plan's catalogue actually carries it, and the
  // source only when it is one of ours, so the URL cannot put anything in
  // the designer that the boards do not offer.
  const chosen = home ? designerPlans.find((p) => p.slug === home) : undefined;
  const initialSiding = chosen && siding ? sidingByLabel(exteriorCatalog(chosen.series, chosen.homeType, chosen.widthFt), siding)?.label : undefined;
  const source = (SOURCES as string[]).includes(src || "") ? (src as DesignerSource) : undefined;

  return (
    <div className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      {/* The designer itself, as a free web app the dealership provides. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "@id": `${SITE_URL}/design-your-home#designer`,
            name: "Design Your Home — Champion manufactured home designer",
            url: `${SITE_URL}/design-your-home`,
            description: DESIGN_PAGE_DESCRIPTION,
            applicationCategory: "DesignApplication",
            operatingSystem: "Any",
            browserRequirements: "Requires JavaScript",
            isAccessibleForFree: true,
            featureList: [
              "Every Champion floor plan we sell",
              "Exterior drawn from Champion's floor plan sheets in your siding, shingle, shutter and door choices",
              "Front, rear and end views",
              "Full-screen view",
              "Line-item factory-direct quote request",
              ...(offersCopy ? ["A copy of your design, with its floor plan, by email or text"] : []),
            ],
            provider: businessRef(),
          }),
        }}
      />
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
            Choose a Champion floor plan, pick your layout options, colors, and upgrades, and watch the
            exterior redraw in your colors as you go. Answer a couple quick questions and we&rsquo;ll follow
            up with a personalized, line-item factory-direct quote — no obligation.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <HomeDesigner plans={designerPlans} initialHome={chosen?.slug} initialSiding={initialSiding} source={source} copyChannels={copyChannels} />

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
        faqs={faqs}
      />
    </div>
  );
}
