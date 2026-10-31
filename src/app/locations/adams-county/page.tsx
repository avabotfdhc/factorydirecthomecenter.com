import { generateLocationMetadata } from "../locationMetadata";
import { LocationPageTemplate } from "../LocationPageTemplate";

// Facts checked against public sources on 2026-10-23: the City of Decatur's
// Building & Zoning page, the Indiana Department of Health's listing for the
// Adams County Health Department, the Decatur Chamber listing and Champion's
// 2026 builder brochure (Champion plant in Decatur), news coverage of the 2015
// St. Marys and Wabash floods, Census 2020/INDOT county populations, and the
// three school corporations. Distance is the county figure from the vetted
// table in ../page.tsx — the plant itself has no vetted mileage, so none is
// given. The county's manufactured-home rules and gas provider could not be
// confirmed and are deliberately absent.
const locationData = {
  city: "Adams County",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "55 miles",
  description:
    "Champion builds its Prime homes in Decatur, the Adams County seat. Here is who issues permits in Decatur and the countryside, what two rivers mean for low ground, and how the county's Amish roads shape delivery.",
  counties: ["Adams"],
  facts: [
    { label: "County seat", value: "Decatur" },
    { label: "Permits in Decatur", value: "City Building & Zoning" },
    { label: "Permits elsewhere", value: "Adams County Building & Planning" },
    { label: "Built in the county", value: "Champion's Decatur, IN plant (Prime)" },
  ],
  localSections: [
    {
      heading: "Prime homes are built in Decatur",
      paragraphs: [
        "Champion opened a plant in Decatur, the county seat, and that is where every Prime series home is built. Aspire and Redman homes come from Champion's Topeka plant in LaGrange County. If you are in Adams County and like a Prime floor plan, the home is built in your own county seat — and you can still walk Champion models on our Auburn lot before you decide.",
      ],
    },
    {
      heading: "City permits and county permits",
      paragraphs: [
        "Inside Decatur, the city runs its own Building & Zoning office, which issues building permits, does the inspections and takes petitions to the board of zoning appeals. In the unincorporated county, permits go through the Adams County Building & Planning Department in the county building on West Jefferson Street. Berne, Geneva and Monroe each sit inside that county picture in their own way, so ask the county office first which body has your parcel.",
        "For a rural lot, the Adams County Health Department's environmental office, in the same building, is where the septic and well questions start. Ask what it needs before you order, and size the septic system to the bedroom count of the plan you choose.",
      ],
    },
    {
      heading: "Two rivers and the low ground",
      paragraphs: [
        "The St. Marys River runs through Decatur and the Wabash River through the south of the county near Geneva. Both flooded in 2015, badly enough that Decatur and Geneva declared disasters. If you are looking at land near either river or a creek, have your surveyor check the flood maps before you buy, because a home in a flood zone may need to sit higher, which changes the foundation, the steps and sometimes the insurance.",
        "Away from the rivers the county is flat, open farmland. Flat ground is easy to set a home on, but it can drain slowly — talk to your site contractor about grading and gutters so water moves away from the foundation.",
      ],
    },
    {
      heading: "Amish country roads",
      paragraphs: [
        "The Berne area is home to one of the largest Swiss Amish settlements in the country, and the county's roads carry buggies and farm equipment every day. Oversize loads move slowly and carefully here. When we quote, tell us about the road your land is on, any narrow bridges and the lane into the site, and plan with your contractor for a firm, wide approach on delivery day.",
        "US 27 is the spine of the county, running through Decatur, Monroe, Berne and Geneva, with US 33 and US 224 meeting it in Decatur and State Roads 116 and 124 crossing to the west.",
      ],
    },
    {
      heading: "Power and schools",
      paragraphs: [
        "Indiana Michigan Power serves Decatur. The countryside is split among several electric cooperatives, including Heartland REMC, Jay County REMC and Paulding-Putnam Electric, along with Indiana Michigan Power, so ask which one has your parcel and what it costs to bring service to the building site. The county has three school corporations — North Adams around Decatur, Adams Central at Monroe and South Adams at Berne.",
      ],
    },
  ],
  nearbyTowns: ["Decatur", "Berne", "Geneva", "Monroe", "Linn Grove"],
  contacts: [
    {
      name: "City of Decatur — Building & Zoning",
      role: "Building permits, inspections and board of zoning appeals inside Decatur.",
      href: "https://cityofdecatur.in.gov/city-boards/building-zoning/4",
    },
    {
      name: "Adams County Building & Planning Department",
      role: "Permits and zoning in the unincorporated county.",
    },
    {
      name: "Adams County Health Department (Environmental)",
      role: "Septic and well questions for rural parcels.",
      href: "https://secure.in.gov/health/reports/LHDs/counties/adams.html",
    },
  ],
  faqs: [
    {
      question: "Are Champion homes built in Adams County?",
      answer:
        "Yes. Champion's Prime series is built at its plant in Decatur. Aspire and Redman homes are built at Champion's Topeka plant. Every home is built to order.",
    },
    {
      question: "Who issues the permit for a manufactured home in Decatur?",
      answer:
        "Inside city limits, the City of Decatur's Building & Zoning office. In the unincorporated county, the Adams County Building & Planning Department.",
    },
    {
      question: "Is land near the St. Marys or Wabash River a problem?",
      answer:
        "It can be. Both rivers flooded in 2015. Have your surveyor check whether the building site is in a flood zone; if it is, the home may need to be raised, which affects the foundation and the cost of the site work.",
    },
    {
      question: "Do you deliver to Berne and Geneva?",
      answer:
        "Yes. Adams County is about 55 miles from our Auburn lot, and freight is quoted as its own line. Tell us about the road and lane to your site so the delivery is planned around it.",
    },
  ],
};

export const metadata = generateLocationMetadata({
  city: locationData.city,
  state: locationData.state,
  description:
    "Placing a Champion home in Adams County, IN, where Prime homes are built: Decatur and county permits, St. Marys and Wabash flood ground, and Amish-road delivery.",
});

export default function AdamsCountyPage() {
  return <LocationPageTemplate countySlug="adams-county" {...locationData} />;
}
