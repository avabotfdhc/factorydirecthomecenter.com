import { generateLocationMetadata } from "../locationMetadata";
import { LocationPageTemplate } from "../LocationPageTemplate";

// Facts checked against public sources on 2026-10-23: wellscounty.org (Area Plan
// Commission; health department septic permitting process and soil-scientist
// list, including the Wabash Recessional Moraine note), Bluffton's Building
// Permits page (APC land-use permit first), the IURC on Bluffton's municipal
// electric utility, Purdue-hosted copies of the county zoning ordinance
// (Article 13, Manufactured Homes; 2019 amendment), Indiana DNR's Ouabache
// State Park page, Census 2020, Wells County EDC (schools). Distance is from
// the vetted table in ../page.tsx.
const locationData = {
  city: "Wells County",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "50 miles",
  description:
    "Wells County has one plan commission for the whole county, a zoning chapter written just for manufactured homes, and a soil-scientist step before any septic permit. Here is the order things happen in.",
  counties: ["Wells"],
  facts: [
    { label: "County seat", value: "Bluffton" },
    { label: "Land-use permits", value: "Wells County Area Plan Commission" },
    { label: "Septic permits", value: "Wells County Health Dept." },
    { label: "Manufactured-home rules", value: "Article 13 of the county ordinance" },
  ],
  localSections: [
    {
      heading: "One area plan commission, then the building permit",
      paragraphs: [
        "Wells County runs planning through an area plan commission based in Bluffton, on West Washington Street, which hears rezonings, development plans and subdivisions, with its own board of zoning appeals for variances. The City of Bluffton's building department spells out the order for new construction in the city: first a land-use and development permit from the area plan commission, then the city's building permits.",
        "Outside Bluffton the starting point is the same commission. Ask it which district your parcel is in before you buy it.",
      ],
    },
    {
      heading: "A zoning chapter just for manufactured homes",
      paragraphs: [
        "The county's zoning ordinance gives manufactured homes their own article, with sections on exterior appearance, placement outside subdivisions, where they are allowed and how they are installed. It was amended in 2019 to change the rules on the age of a home. A new Champion home meets any age rule by definition, but the appearance and installation standards still apply — roof, siding, skirting or foundation, and the like.",
        "Ask the area plan commission for the current text of that article before you choose a floor plan and foundation, and give it to your set-up contractor. It is the document your permit will be checked against.",
      ],
    },
    {
      heading: "Soil scientist first, septic permit second",
      paragraphs: [
        "In Wells County a septic permit is required before construction starts, and the building permit depends on it. The health department's process begins with a soil report from a certified soil scientist — the department keeps a list of those who agree to work in the county — and a site evaluation form from the owner. Land on the Wabash Recessional Moraine, a ridge of glacial soils that crosses the county, has to be flagged to the soil scientist, because it changes how the ground handles a septic field.",
        "Book the soil work early. Until the septic permit is issued, nothing else on the site can be permitted.",
      ],
    },
    {
      heading: "Power, gas and the Wabash",
      paragraphs: [
        "Bluffton has its own municipal electric utility. Much of the rural county is served by Heartland REMC, headquartered in Markle, with Indiana Michigan Power in other areas. NIPSCO provides gas in Bluffton; on a rural parcel, check whether a gas line is anywhere near before you plan on it.",
        "The Wabash River runs through Bluffton and Ouabache State Park on the east side of the city. If your land is near the river or a creek, have your surveyor check the flood maps before you set the home's height and foundation.",
      ],
    },
    {
      heading: "Schools and the route south",
      paragraphs: [
        "Three districts cover the county: Bluffton-Harrison, Norwell Community Schools (formerly Northern Wells, around Ossian) and Southern Wells. Confirm the attendance area for your address. State Road 1 runs through Ossian and Bluffton, State Roads 116 and 124 cross the county, and US 224 links it to Huntington and Decatur. Freight to Wells County is a longer run than our home counties, and it is priced on its own line so you can see it.",
      ],
    },
  ],
  nearbyTowns: ["Bluffton", "Ossian", "Markle", "Zanesville", "Uniondale", "Poneto", "Vera Cruz"],
  contacts: [
    {
      name: "Wells County Area Plan Commission",
      role: "Land-use and development permits, rezonings, subdivisions; its board of zoning appeals hears variances.",
      href: "https://wellscounty.org/?p=519",
    },
    {
      name: "Wells County Health Department",
      role: "Septic permits, starting with a soil scientist's report and site evaluation.",
      href: "https://wellscounty.org/health-department/",
    },
    {
      name: "City of Bluffton Building Department",
      role: "Building permits inside Bluffton, after the area plan commission's permit.",
      href: "https://blufftonindiana.net/331/Building-Permits",
    },
  ],
  faqs: [
    {
      question: "Does Wells County have special rules for manufactured homes?",
      answer:
        "Yes. The county zoning ordinance has an article on manufactured homes covering exterior appearance, placement outside subdivisions and installation standards. Ask the Wells County Area Plan Commission for the current text before you choose a plan and foundation.",
    },
    {
      question: "How do I get a septic permit in Wells County?",
      answer:
        "Start with a soil report from a certified soil scientist — the health department keeps a list — and the owner's site evaluation form. The septic permit must be issued before the building permit.",
    },
    {
      question: "Who issues permits for a home in Bluffton?",
      answer:
        "First the Wells County Area Plan Commission issues a land-use and development permit; then the City of Bluffton issues the building permits.",
    },
    {
      question: "Do you deliver to Bluffton and Ossian?",
      answer:
        "Yes. Wells County is about 50 miles from our Auburn lot, and freight is quoted as its own line, so you can see exactly what the trip adds.",
    },
  ],
};

export const metadata = generateLocationMetadata({
  city: locationData.city,
  state: locationData.state,
  description:
    "Placing a Champion home in Wells County, IN: the area plan commission, the county's manufactured-home article, the soil-scientist septic step and Bluffton power.",
});

export default function WellsCountyPage() {
  return <LocationPageTemplate {...locationData} />;
}
