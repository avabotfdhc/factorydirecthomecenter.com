import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

// Facts checked against public sources on 2026-11-17: Columbia City/Whitley
// County Joint Planning and Building Department (whitleycounty.in.gov), City of
// Columbia City Code ch. 154 (zoning; manufactured housing outside manufactured
// home developments; flood regulations), Indiana State Board of Accounts audits
// of the City of Columbia City Municipal Utilities (electric, water, wastewater,
// stormwater), the city's Electric Department page (IMPA member), the city's
// Stormwater page and Flood Map Explanation Document (FEMA study profiles of
// the Blue River and Phillips Ditch), INDOT's State Road 205 Improvement
// Project, Census 2020 (QuickFacts). Distance is from the vetted table in
// ../page.tsx.

export const metadata = genMeta({
  title: "Mobile & Manufactured Homes in Columbia City, IN",
  description:
    "Placing a Champion home in Columbia City, IN: what the city code asks of a manufactured home, city electric and water, and the Blue River flood maps.",
  keywords: [
    "manufactured homes columbia city indiana",
    "modular homes columbia city in",
    "mobile homes whitley county",
    "manufactured homes whitley county indiana",
    "champion homes columbia city",
  ],
  url: "/locations/columbia-city",
});

const data: CityLocationData = {
  city: "Columbia City",
  county: "Whitley County",
  slug: "columbia-city",
  heroImage: "/images/paramount/myrtle-exterior.webp",
  distanceMi: 30,
  driveMin: 40,
  lat: 41.1573,
  lng: -85.4886,
  tagline:
    "Columbia City writes manufactured homes into its zoning code, runs its own electric and water, and maps the Blue River. Here is what that means for a lot in town.",
  intro: [
    "Columbia City is the Whitley County seat and the county's only city, about 9,900 people on US 30. Inside its limits the city runs its own electric, water, wastewater and stormwater utilities, and its zoning code says in so many words where a manufactured home may go. We sell the home, quote it line by line and arrange delivery; the permits, the hook-ups and the site work are yours, and the offices below are the ones that answer.",
  ],
  facts: [
    { label: "Population (2020 census)", value: "9,892" },
    { label: "Planning, zoning and building", value: "Joint Planning & Building Dept." },
    { label: "Electric, water and sewer", value: "Columbia City Utilities" },
    { label: "Mapped flooding", value: "Blue River, Phillips Ditch" },
    { label: "Schools", value: "Whitley County Consolidated Schools" },
  ],
  sections: [
    {
      heading: "What the city code asks of a manufactured home",
      paragraphs: [
        "Columbia City's zoning code, Chapter 154, allows manufactured housing that meets its listed criteria outside manufactured-home developments, in any district where other homes are allowed. Among those criteria: utilities connected under the Indiana One and Two Family Dwelling Code, a permanent perimeter enclosure that meets the same code, and every required permit and inspection. Parks and developments have their own section.",
        "The full list is in Chapter 154, and the joint planning and building department, which serves the city and the county from one office, applies it. Ask the department to walk through the list for your home and lot before you order.",
      ],
    },
    {
      heading: "City electric, city water",
      paragraphs: [
        "Columbia City is one of the Indiana towns that runs its own electric utility; it is a member of the Indiana Municipal Power Agency. The same municipal utilities provide water from the city's wells and treatment plant, wastewater and stormwater. Inside the limits, that is one utility office to ask about every connection.",
        "Outside the limits the city's lines may not reach, and the electric provider depends on the address. Ask the provider for your parcel what it takes to bring service to the building site.",
      ],
    },
    {
      heading: "The Blue River and Phillips Ditch",
      paragraphs: [
        "The FEMA flood study for Whitley County profiles the Blue River and Phillips Ditch where they run through Columbia City, and the city code sets its regulatory flood elevation from that study. The city's stormwater page links its flood maps by quadrant and the Indiana Floodplain Information Portal. Look your lot up before you buy, and ask the planning department about anything in or near a mapped flood zone.",
      ],
    },
    {
      heading: "US 30 and the state roads",
      paragraphs: [
        "US 30 crosses the city with signalled intersections at State Roads 109, 9 and 205, and State Road 205 runs from South Whitley through Columbia City toward Garrett. INDOT has an improvement project on SR 205 just south of US 30. Tell us your street and how the lot is reached when we quote, and have your site contractor grade a firm, wide approach.",
      ],
    },
  ],
  contacts: [
    {
      name: "Columbia City/Whitley County Joint Planning and Building Department",
      role: "Zoning, location and building permits, and floodplain questions for Columbia City.",
      href: "https://www.whitleycounty.in.gov/department/?fDD=19-0",
    },
    {
      name: "Columbia City Utilities",
      role: "City electric, water, wastewater and stormwater connections.",
      href: "https://columbiacity.net/",
    },
    {
      name: "Whitley County Health Department",
      role: "Septic and well permits for land the city's sewer and water do not serve.",
    },
  ],
  nearby: [
    { name: "Whitley County", href: "/locations/whitley-county" },
    { name: "Churubusco", href: "/locations/churubusco" },
    { name: "Fort Wayne", href: "/locations/fort-wayne" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "South Whitley" },
    { name: "Larwill" },
  ],
  faqs: [
    {
      question: "Can I place a manufactured home in Columbia City?",
      answer:
        "The city code allows manufactured housing that meets its listed criteria in any district where other homes are allowed, outside manufactured-home developments. The joint planning and building department applies the list; ask it about your home and lot.",
    },
    {
      question: "Who provides electricity in Columbia City?",
      answer:
        "Inside the city limits, the city's own municipal electric utility. Outside the limits, it depends on the address; ask the provider for your parcel.",
    },
    {
      question: "Is my lot near the Blue River in a flood zone?",
      answer:
        "Check the city's flood maps and the Indiana Floodplain Information Portal, both linked from the city's stormwater page, and ask the planning department about anything they show.",
    },
    {
      question: "Do you deliver to Columbia City?",
      answer:
        "Yes. Freight is quoted per route as its own line on your quote. You hire your own licensed contractors for the foundation, set-up and utility connections.",
    },
  ],
};

export default function ColumbiaCityLocationPage() {
  return <CityLocationTemplate data={data} />;
}
