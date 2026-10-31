import { generateLocationMetadata } from "../locationMetadata";
import { LocationPageTemplate } from "../LocationPageTemplate";

// Facts checked against public sources on 2026-10-23: LaGrange County's
// Improvement Location/Building Permit form (site plan, health approval, L-1
// survey, 3-5 business-day review), the health department's in.gov page,
// LaGrange County EDC utilities page (NIPSCO in the towns, LaGrange County REMC
// rural), EPA's CWSRF case study of the LaGrange County Regional Utility
// District, the Young Center's Amish settlement counts, MHI's 2026 plant list
// (Champion, Topeka IN), Census 2020. Distance is from the vetted table in
// ../page.tsx.
const locationData = {
  city: "LaGrange County",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "30 miles",
  description:
    "Champion builds homes in Topeka, inside LaGrange County, so a home bought here may travel only a few country miles. Here is the county permit, the septic step and what to plan for on rural and lake land.",
  counties: ["LaGrange"],
  facts: [
    { label: "County seat", value: "LaGrange" },
    { label: "Permits and zoning", value: "LaGrange County Plan Commission" },
    { label: "Septic and well approval", value: "LaGrange County Health Dept." },
    { label: "Built in the county", value: "Champion's Topeka, IN plant" },
  ],
  localSections: [
    {
      heading: "The plant is in the county",
      paragraphs: [
        "Champion's Topeka plant, where Aspire and Redman homes are built, is in western LaGrange County. For a buyer here that is the shortest delivery trip we quote anywhere. Every home is built to order, so the time saved is on the road, not at the factory, but it does mean a home bought in LaGrange, Shipshewana, Topeka or Wolcottville comes a short way on county roads. Prime homes come from Champion's Decatur plant instead.",
      ],
    },
    {
      heading: "What the county permit asks for",
      paragraphs: [
        "In the unincorporated county, a new home needs an Improvement Location and Building Permit from the county plan commission, whose offices are in the County Office Building on West Michigan Street in LaGrange. The application wants a site plan showing the home, the septic system and the well or wells, with distances to the lot lines — and a health department approval before it is issued. On land in the county's Lake (L-1) district, a recent survey is required too. The county quotes three to five business days for review once the file is complete.",
        "Because the health approval comes first, the septic design really sets your schedule. Start the soil work as soon as you own the land.",
      ],
    },
    {
      heading: "Lakes and the regional utility district",
      paragraphs: [
        "Several of the county's lake areas are served by the LaGrange County Regional Utility District, which has built sewers that took hundreds of lake homes off septic systems. If you are looking at a lake parcel, ask the district whether it is on, or near, a sewer line before you plan a septic field.",
        "Electricity in the four towns comes from NIPSCO; the rural county, and part of the utility district's lake areas, is LaGrange County REMC. Ask the provider for your parcel what it costs to bring service to the building site.",
      ],
    },
    {
      heading: "Country roads and a slower pace",
      paragraphs: [
        "LaGrange County is home to a large share of one of the biggest Amish settlements in the country — the Elkhart-LaGrange settlement — and its county roads carry horse-drawn buggies, farm equipment and bicycles alongside cars. On delivery day an oversize load moves slowly and carefully here. Tell us about narrow bridges, tight corners and the lane into your lot when we quote, and have your site contractor grade a firm, wide approach.",
        "US 20 crosses the middle of the county, the Indiana Toll Road runs along the north with an exit serving Howe and LaGrange, and State Roads 3, 5, 9 and 120 reach the rest.",
      ],
    },
  ],
  nearbyTowns: ["LaGrange", "Shipshewana", "Topeka", "Wolcottville", "Howe", "Mongo"],
  contacts: [
    {
      name: "LaGrange County Plan Commission",
      role: "Improvement Location and Building Permits and zoning in the unincorporated county.",
      href: "https://www.lagrangecounty.org/",
    },
    {
      name: "LaGrange County Health Department",
      role: "Septic and well approval required before the county permit is issued.",
      href: "https://www.in.gov/localhealth/lagrangecounty/contact-us",
    },
    {
      name: "LaGrange County Regional Utility District",
      role: "Sewer service around the county's lakes.",
    },
  ],
  faqs: [
    {
      question: "What do I need for a building permit in LaGrange County?",
      answer:
        "An Improvement Location and Building Permit application with a site plan showing the home, septic system and wells and their distances to the lot lines, plus health department approval. Land in the Lake (L-1) district also needs a recent survey. The county quotes three to five business days for review.",
    },
    {
      question: "Are your homes built in LaGrange County?",
      answer:
        "Aspire and Redman homes are built at Champion's plant in Topeka, which is in LaGrange County. Prime homes are built at Champion's Decatur plant. Every home is built to order.",
    },
    {
      question: "Who provides electricity to a rural home in LaGrange County?",
      answer:
        "LaGrange County REMC serves most of the unincorporated county; NIPSCO serves the towns of LaGrange, Shipshewana, Topeka and Wolcottville. Ask the provider for your parcel about the cost of service to the site.",
    },
    {
      question: "Is there sewer at the lakes in LaGrange County?",
      answer:
        "In places. The LaGrange County Regional Utility District has extended sewers around several lakes. Ask the district about your parcel before planning a septic system.",
    },
  ],
};

export const metadata = generateLocationMetadata({
  city: locationData.city,
  state: locationData.state,
  description:
    "Placing a Champion home in LaGrange County, IN, home of Champion's Topeka plant: the county permit, septic approval, lake sewers and rural delivery.",
});

export default function LaGrangeCountyPage() {
  return <LocationPageTemplate countySlug="lagrange-county" {...locationData} />;
}
