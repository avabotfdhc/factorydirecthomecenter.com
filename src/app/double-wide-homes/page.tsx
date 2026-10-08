import { generateMetadata as genMeta } from "@/lib/seo";
import { getApiFloorPlans } from "@/lib/api-content";
import { isMultiSectionHud } from "@/lib/grid-plan";
import { HomeTypeLanding, homeTypeFacts } from "@/components/HomeTypeLanding";

export const metadata = genMeta({
  title: "Double Wide Homes for Sale in Indiana | Champion",
  description:
    "Champion double wide manufactured homes for sale in Indiana. Compare multi-section floor plans, sizes and bedrooms, then get a line-item quote from our Auburn, IN showroom.",
  keywords: [
    "double wide homes for sale indiana",
    "double wide manufactured homes indiana",
    "double wide mobile homes fort wayne",
    "champion double wide homes",
    "multi-section manufactured homes",
  ],
  url: "/double-wide-homes",
});

// Same five-minute window as /floor-plans, so a plan added in the CMS appears here too.
export const revalidate = 300;

export default async function DoubleWideHomesPage() {
  const plans = (await getApiFloorPlans()).filter(isMultiSectionHud);
  const facts = homeTypeFacts(plans);

  // HomeTypeLanding renders the specs and pricing disclaimers under the grid.
  return (
      <HomeTypeLanding
        eyebrow="Champion Multi-Section Homes · Auburn, Indiana"
        heading="Double Wide Homes for Sale"
        headingAccent="in Indiana"
        intro={`Every Champion double wide and multi-section HUD-code home we sell, ordered from Champion's Topeka, IN plant about 30 miles from our Auburn showroom. Filter by size and bedrooms, compare up to three, and ask for a line-item quote on any plan.`}
        plans={plans}
        points={[
          {
            title: "What makes a home a double wide",
            body: "A double wide is built as two sections in the factory, shipped separately and joined on your foundation along the marriage line. The extra width makes room for a full-size living room and kitchen, a primary suite away from the other bedrooms, and two bathrooms in most plans.",
          },
          {
            title: "Built to the HUD code",
            body: "These are manufactured homes built to the federal HUD code, and each section carries a red HUD label. Zoning for manufactured homes varies by town and county, so check with the local office before you buy land or order a home.",
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
            question: "How wide is a double wide home?",
            answer: facts.widths
              ? `The double wides we sell today are ${facts.widths} feet wide once the two sections are joined. Length varies by plan; each plan page lists its size.`
              : "Most double wides are 24 to 32 feet wide once the two sections are joined. Each plan page lists its exact size.",
          },
          {
            question: "Is a double wide a manufactured home or a modular home?",
            answer: "The homes on this page are manufactured homes built to the federal HUD code. Champion also builds modular homes to local building codes; our manufactured vs. modular guide explains the difference.",
          },
          {
            question: "Do you set up the home or do the site work?",
            answer: "No. We sell and deliver the home. You hire your own contractors for site work, the foundation and set-up.",
          },
          {
            question: "How much does a double wide cost?",
            answer: "It depends on the plan, the options you choose and your site. We quote every home line by line, so ask for a quote on the plans you like, and see the homes on sale for current offers.",
          },
        ]}
        related={[
          { href: "/guides/single-wide-vs-double-wide", label: "Single wide vs. double wide" },
          { href: "/single-wide-homes", label: "Single wide homes" },
          { href: "/guides/manufactured-vs-modular", label: "Manufactured vs. modular" },
          { href: "/homes-on-sale", label: "Homes on sale" },
          { href: "/floor-plans", label: "All floor plans" },
          { href: "/contact-us", label: "Ask for a quote" },
        ]}
      />
  );
}
