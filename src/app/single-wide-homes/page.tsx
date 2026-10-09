import { generateMetadata as genMeta } from "@/lib/seo";
import { getApiFloorPlans } from "@/lib/api-content";
import { isSingleSectionHud } from "@/lib/grid-plan";
import { HomeTypeLanding, homeTypeFacts } from "@/components/HomeTypeLanding";

export const metadata = genMeta({
  title: "Single Wide Homes for Sale in Indiana | Champion",
  description:
    "Champion single wide manufactured homes for sale in Indiana. Compare single-section floor plans by size and bedrooms, then get a line-item quote from our Auburn, IN showroom.",
  keywords: [
    "single wide homes for sale indiana",
    "single wide manufactured homes indiana",
    "single wide mobile homes fort wayne",
    "champion single wide homes",
    "new single wide mobile homes",
  ],
  url: "/single-wide-homes",
});

// Same five-minute window as /floor-plans, so a plan added in the CMS appears here too.
export const revalidate = 300;

export default async function SingleWideHomesPage() {
  const plans = (await getApiFloorPlans()).filter(isSingleSectionHud);
  const facts = homeTypeFacts(plans);

  // HomeTypeLanding renders the specs and pricing disclaimers under the grid.
  return (
    <HomeTypeLanding
      eyebrow="Champion Single-Section Homes · Auburn, Indiana"
      heading="Single Wide Homes for Sale"
      headingAccent="in Indiana"
      intro={`Every Champion single wide HUD-code home we sell, ordered from Champion's Topeka, IN plant about 30 miles from our Auburn showroom. Filter by size and bedrooms, compare up to three, and ask for a line-item quote on any plan.`}
      plans={plans}
      points={[
        {
          title: "What makes a home a single wide",
          body: "A single wide is built and shipped as one section, so it arrives in one piece and needs less joining work on site than a multi-section home. Its narrower footprint suits smaller and narrower lots, and many plans put a bedroom at each end.",
        },
        {
          title: "Built to the HUD code",
          body: "These are manufactured homes built to the federal HUD code, and each one carries a red HUD label. Zoning for manufactured homes varies by town and county, so check with the local office before you buy land or order a home.",
        },
        {
          title: "Sizes on this page",
          body: `The plans here run ${facts.widths ? `${facts.widths} feet wide, ` : ""}${facts.sqft ? `${facts.sqft} square feet, ` : ""}${facts.beds ? `with ${facts.beds} bedrooms` : "in a range of layouts"}. Sizes come from Champion's plan data; check the plan page for each home's exact dimensions.`,
        },
        {
          title: "What we do and what you arrange",
          body: "We sell the home, quote it line by line and arrange delivery. You hire your own contractors for site work, the foundation and set-up, and you choose your own lender.",
        },
      ]}
      faqs={[
        {
          question: "How wide is a single wide home?",
          answer: facts.widths
            ? `The single wides we sell today are ${facts.widths} feet wide. Length varies by plan; each plan page lists its size.`
            : "Most single wides are 14 to 18 feet wide. Each plan page lists its exact size.",
        },
        {
          question: "Will a single wide fit my lot?",
          answer: "Many narrow or small lots that cannot take a double wide can take a single wide, but setbacks, zoning and delivery access decide it. Check with the county or town before you order.",
        },
        {
          question: "Do you set up the home or do the site work?",
          answer: "No. We sell and deliver the home. You hire your own contractors for site work, the foundation and set-up.",
        },
        {
          question: "How much does a single wide cost?",
          answer: "It depends on the plan, the options you choose and your site. We quote every home line by line, so ask for a quote on the plans you like, and see the homes on sale for current offers.",
        },
      ]}
      related={[
        { href: "/guides/single-wide-vs-double-wide", label: "Single wide vs. double wide" },
        { href: "/double-wide-homes", label: "Double wide homes" },
        { href: "/homes-on-sale", label: "Homes on sale" },
        { href: "/floor-plans", label: "All floor plans" },
        { href: "/contact-us", label: "Ask for a quote" },
      ]}
    />
  );
}
