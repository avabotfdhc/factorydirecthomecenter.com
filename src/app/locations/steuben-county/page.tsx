import { generateLocationMetadata } from "../locationMetadata";
import { LocationPageTemplate } from "../LocationPageTemplate";

// Facts checked against public sources on 2026-10-23: the Steuben County Health
// Department's septic permit process (2023), Indiana DNR's Lake Preservation Act
// guidance (IC 14-26-2, 312 IAC 11), the state CWSRF list naming the Steuben
// Lakes Regional Waste District, Steuben County EDC's infrastructure page
// (utilities, NIPSCO gas capacity), Orland's own location permit, Census 2020.
// The lake count is a tourism figure, so the page says "dozens". Distance is
// from the vetted table in ../page.tsx.
const locationData = {
  city: "Steuben County",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "25 miles",
  description:
    "Lake lots, a regional sewer district and DNR shoreline rules make Steuben County different from anywhere else we deliver. Here is what to sort out before a Champion home goes on a lake or a back road.",
  counties: ["Steuben"],
  facts: [
    { label: "County seat", value: "Angola" },
    { label: "Unincorporated zoning", value: "Steuben County Plan Commission" },
    { label: "Septic permits", value: "Steuben County Health Dept." },
    { label: "Lake sewers", value: "Steuben Lakes Regional Waste District" },
  ],
  localSections: [
    {
      heading: "County or town: which plan commission",
      paragraphs: [
        "Steuben County has one city, Angola, and six towns — Ashley, Clear Lake, Fremont, Hamilton, Hudson and Orland (Ashley and Hamilton reach into DeKalb County). The county plan commission covers the unincorporated townships, and most of the towns run their own; Orland, for one, issues its own location permit. Start by asking which body has your parcel. If you are buying in Angola itself, our Angola page covers the city.",
      ],
    },
    {
      heading: "Sewer or septic on a lake lot",
      paragraphs: [
        "Around the Lake James chain, Snow Lake and the Otter lakes, the Steuben Lakes Regional Waste District has been replacing septic systems with sewers. Whether your lot is on that sewer, or on a planned extension of it, changes the whole site budget — and the county has asked new lake developments for a capacity letter from the district. Call the district before you make an offer on a lake parcel.",
        "Off the sewer, the county health department runs a set process: a soil evaluation by a soil scientist on the Indiana registry, then the residential onsite sewage application with the county form and the home's floor plan, plan approval, and an appointment to buy the permit. The property owner, not the contractor, is responsible for getting it. Pick your floor plan early, because the bedroom count sizes the system.",
      ],
    },
    {
      heading: "The shoreline belongs to the DNR's rules",
      paragraphs: [
        "Most of the big lakes here are public freshwater lakes under Indiana's Lake Preservation Act. Work below the waterline or along or lakeward of the shoreline — a seawall, a boat ramp, some retaining walls near the water — needs written approval from the Department of Natural Resources. The house itself sits back on the lot, but the steps, wall and landscaping your contractor plans toward the water may not.",
        "Lake lots are often narrow and deep. Measure the buildable width after setbacks first; a single-section home or a double-wide set end-on to the road often fits where a wider plan cannot, and a plan with the living room at one end puts the view where you want it.",
      ],
    },
    {
      heading: "Gas, electric and a winter on the lake",
      paragraphs: [
        "Electric service in the county comes from Indiana Michigan Power, NIPSCO and Steuben County REMC, depending on the parcel. Natural gas is NIPSCO, but the county's own economic development office has told state regulators that gas capacity is limited, so do not assume a line can be extended to a rural or lake lot. Many buyers plan on an all-electric heat pump or propane; decide before you order, because it changes the factory options.",
        "If the home will be a summer place, plan for leaving it empty through a northern Indiana winter — the plumbing, the heat and who checks on it.",
      ],
    },
    {
      heading: "On the road to your lot",
      paragraphs: [
        "I-69 runs down the west side of Angola and meets the Indiana Toll Road near Fremont; US 20 crosses the county east to west. The highways are the easy part. Lake roads are narrow, wind between trees and often end in a tight turnaround, and each section of the home is an oversize load. Send us the address and a photo of the approach when you ask for a quote.",
      ],
    },
  ],
  nearbyTowns: ["Angola", "Fremont", "Orland", "Hamilton", "Hudson", "Ashley", "Clear Lake"],
  contacts: [
    {
      name: "Steuben County Plan Commission",
      role: "Zoning and location permits in the unincorporated county. Towns such as Orland run their own.",
    },
    {
      name: "Steuben County Health Department",
      role: "Residential onsite sewage (septic) permits, from soil evaluation to the permit itself.",
    },
    {
      name: "Steuben Lakes Regional Waste District",
      role: "Sewer service and septic-elimination projects around the Lake James chain, Snow Lake and the Otter lakes.",
    },
    {
      name: "Indiana DNR, Division of Water",
      role: "Approvals for work at or below the shoreline of a public freshwater lake.",
      href: "https://www.in.gov/dnr/water/",
    },
  ],
  faqs: [
    {
      question: "Can I put a manufactured home on a lake lot in Steuben County?",
      answer:
        "Often, yes, but it depends on the lot's zoning, its buildable width and whether it has sewer. Ask the plan commission that has the parcel, call the Steuben Lakes Regional Waste District about sewer, and remember that shoreline work needs DNR approval.",
    },
    {
      question: "How do I get a septic permit in Steuben County?",
      answer:
        "Through the county health department: a soil evaluation by a registered soil scientist, the residential onsite sewage application with the county form and floor plans, plan approval, then an appointment to buy the permit. The owner is responsible for getting it.",
    },
    {
      question: "Is natural gas available for a new home in Steuben County?",
      answer:
        "In some places. NIPSCO provides gas, but the county's economic development office has reported limited capacity, so confirm with NIPSCO for your parcel. Many lake and rural homes plan on electric heat pumps or propane instead.",
    },
    {
      question: "Do you deliver to Angola and the lakes?",
      answer:
        "Yes. Steuben County is about 25 miles from our Auburn lot, and freight is quoted as its own line. Lake roads can be tight, so we ask about the approach to your lot when we quote.",
    },
  ],
};

export const metadata = generateLocationMetadata({
  city: locationData.city,
  state: locationData.state,
  description:
    "Placing a Champion home in Steuben County, IN: lake-lot sewer, the county septic process, DNR shoreline rules, limited gas capacity and lake-road delivery.",
});

export default function SteubenCountyPage() {
  return <LocationPageTemplate {...locationData} />;
}
