import { LocationPageTemplate } from "../LocationPageTemplate";
import { generateLocationMetadata } from "../locationMetadata";

const locationData = {
  city: "Garrett",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "5 miles",
  deliveryCost: "$1,800",
  description:
    "Garrett sits just five miles from our Auburn showroom — about as close as a Champion Homes dealer gets. We deliver factory-direct manufactured and modular homes throughout Garrett and rural DeKalb County, with short freight and fast timelines.",
  counties: ["DeKalb"],
  nearbyTowns: ["Auburn", "Altona", "Corunna", "Waterloo", "Ashley", "St. Joe"],
  localSections: [
    {
      heading: "Buying a manufactured home in Garrett",
      paragraphs: [
        "Garrett is one of the closest towns to our Auburn lot, which makes it some of the most affordable delivery territory we serve — the shorter the trip from Champion's Topeka plant to your site, the lower the freight line on your quote. If you live in Garrett or the surrounding DeKalb County countryside, that proximity is money in your pocket.",
        "Most of the land around Garrett — the rural townships of DeKalb County outside the city limits — permits manufactured and modular homes on private property. Zoning and setback rules are set parcel by parcel, so you or your contractor confirm the requirements and pull the permits with DeKalb County before delivery. Inside Garrett's city limits, rules are stricter and often favor modular homes on permanent foundations or placement in an established community.",
        "What we bring to the table is simple: we're an independent, family-run Champion dealer, we quote every home line by line so you see exactly what you're paying for, and you stay in control of your own site work with your own licensed contractors — where many buyers save the most. We're glad to walk you through every number so you can decide with total confidence.",
      ],
    },
    {
      heading: "Champion homes built 20 miles away",
      paragraphs: [
        "Every home we sell is built at Champion's Indiana plants — the Aspire and Paramount series in Topeka, about 20 miles from Garrett, and the Prime series in Decatur. Building close means lower delivery costs, fewer weather delays, and a faster path from order to move-in, typically 8–12 weeks. Browse the full Champion lineup online, then visit our Auburn showroom to walk through real models before you decide.",
      ],
    },
  ],
  faqs: [
    {
      question: "Do you deliver manufactured homes to Garrett, Indiana?",
      answer:
        "Yes — Garrett is about 5 miles from our Auburn showroom, squarely in our core delivery area and among the lowest freight costs we quote. We deliver Champion manufactured and modular homes throughout Garrett and DeKalb County.",
    },
    {
      question: "Can I put a manufactured home on land near Garrett?",
      answer:
        "In most rural parts of DeKalb County outside Garrett's city limits, manufactured and modular homes are permitted on private land, though zoning and setbacks vary by parcel. You or your contractor verify the rules and pull permits with DeKalb County. Inside city limits, modular homes on permanent foundations or placement in a community are usually the path — we can help you check your parcel.",
    },
    {
      question: "What makes Factory Direct Homes Center different from other Garrett-area dealers?",
      answer:
        "We're an independent, family-owned Champion dealer. We quote line-item (home, options, and delivery priced separately), work with multiple lenders so you can compare financing, and let you hire your own contractors for site work to save money. You get a local partner 5 miles away who answers the phone after the sale.",
    },
  ],
};

export const metadata = generateLocationMetadata({ city: locationData.city, state: locationData.state });

export default function GarrettPage() {
  return <LocationPageTemplate {...locationData} />;
}
