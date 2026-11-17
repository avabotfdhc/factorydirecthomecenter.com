import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

// Facts checked against public sources on 2026-11-17: Noble County Building
// Department (Albion, Avilla, Kendallville, Ligonier and Rome City issue their
// own building permits) and Plan Commission zoning-enforcement page (towns are
// outside the county ordinance), City of Kendallville Building, Planning &
// Zoning (services: improvement location and building permits, plan review,
// inspections, Plan Commission and BZA), the city's Water Department, 2024
// drinking water report (groundwater from nine wells) and Wellhead Protection
// Rule page, its CSO page and IDEM permit IN0020656 (combined sewers), Indiana
// Code 36-7-4-1106 (Justia), Northeast Indiana Regional Partnership (US 6 and
// SR 3), Census 2020 (QuickFacts). Electric provider deliberately omitted: no
// official source settles it. Distance is from the vetted table in ../page.tsx.

export const metadata = genMeta({
  title: "Factory Direct Mobile & Manufactured Homes, Kendallville IN",
  description:
    "Placing a Champion home in Kendallville, IN: the city's own permits, city water from nine wells, combined sewers, and what Indiana law says about zoning.",
  keywords: [
    "manufactured homes kendallville indiana",
    "modular homes kendallville in",
    "mobile homes noble county",
    "manufactured homes noble county indiana",
    "champion homes kendallville",
  ],
  url: "/locations/kendallville",
});

const data: CityLocationData = {
  city: "Kendallville",
  county: "Noble County",
  slug: "kendallville",
  heroImage: "/images/paramount/summit-exterior.webp",
  distanceMi: 20,
  driveMin: 25,
  lat: 41.4414,
  lng: -85.2655,
  tagline:
    "Kendallville is Noble County's largest city, west of our Auburn showroom, and it issues its own permits and runs its own water. Here is who answers for a lot in town.",
  intro: [
    "Kendallville, about 10,300 people where US 6 crosses State Road 3, is the largest city in Noble County, though Albion is the county seat. It is one of five Noble County towns that issue their own building permits, and inside its limits the county's zoning ordinance does not apply at all. We sell the home, quote it line by line and arrange delivery; the permits, the hook-ups and the site work are yours, and the offices below are the ones that answer.",
  ],
  facts: [
    { label: "Population (2020 census)", value: "10,271" },
    { label: "Zoning and building permits", value: "City Building, Planning & Zoning" },
    { label: "Water", value: "City water, from nine wells" },
    { label: "Sewer", value: "City wastewater (combined system)" },
    { label: "Schools", value: "East Noble School Corporation" },
  ],
  sections: [
    {
      heading: "City hall, not the county, issues your permits",
      paragraphs: [
        "Inside the limits, Kendallville's Building, Planning & Zoning department on South Main Street issues improvement location and building permits, reviews plans, inspects the work, and takes applications to the city Plan Commission and Board of Zoning Appeals. Noble County's own building department lists Kendallville among the towns with their own jurisdiction, so a lot in the city does not go to Albion.",
        "If your plan needs a variance or special exception, note that the city's zoning code voids one when no permit follows within six months of approval. Line the order up with the permit, not the other way round.",
      ],
    },
    {
      heading: "What Indiana law says about manufactured homes and zoning",
      paragraphs: [
        "Indiana Code 36-7-4-1106 limits how far a local zoning ordinance can keep out a manufactured home that meets the state's size and foundation standards, on a lot where another kind of home is allowed. It does not settle whether a particular home and lot qualify; that is the plan commission's call, under the city's own ordinance. Ask the department which rules apply to your home and your lot before you order.",
      ],
    },
    {
      heading: "City water from nine wells",
      paragraphs: [
        "Kendallville's water is groundwater pumped from nine city wells, and the city keeps a wellhead protection plan under Indiana's wellhead protection rule, which maps the area around those wells. Building near a well field can bring its own conditions, so if your lot is close to one, ask the water department what applies.",
        "The city's wastewater system is a combined sewer, carrying storm water and sewage together, with an overflow control programme. Ask the wastewater department what a connection for a new home needs and where storm water from the lot may go.",
      ],
    },
    {
      heading: "Around Bixler Lake and on US 6",
      paragraphs: [
        "US 6 and State Road 3 meet in Kendallville and share North Street for a stretch, so most deliveries come in on one of the two. East Noble School Corporation, the county's largest, has its high school on Garden Street near Bixler Lake and its city park. Tell us your street and how the lot is reached when we quote, and have your site contractor grade a firm, wide approach.",
      ],
    },
  ],
  contacts: [
    {
      name: "City of Kendallville Building, Planning & Zoning",
      role: "Improvement location and building permits, inspections, Plan Commission and BZA applications.",
      href: "https://www.kendallvillein.gov/departments/BuildingPlanningandZoning/Functions/Services",
    },
    {
      name: "Kendallville Water Department",
      role: "Water taps and the city's wellhead protection area.",
      href: "https://www.kendallvillein.gov/directory/Water",
    },
    {
      name: "Kendallville Wastewater Department",
      role: "Sewer connections on the city's combined system.",
      href: "https://www.kendallvillein.gov/directory/Wastewater",
    },
  ],
  nearby: [
    { name: "Noble County", href: "/locations/noble-county" },
    { name: "Albion", href: "/locations/albion" },
    { name: "Ligonier", href: "/locations/ligonier" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "Garrett", href: "/locations/garrett" },
    { name: "Avilla" },
    { name: "Rome City" },
  ],
  faqs: [
    {
      question: "Who issues the building permit for a home in Kendallville?",
      answer:
        "Inside the city limits, Kendallville's Building, Planning & Zoning department. Noble County lists Kendallville among the towns with their own building jurisdiction, and the county's zoning ordinance does not apply inside the city.",
    },
    {
      question: "Can Kendallville's zoning keep out a manufactured home?",
      answer:
        "Indiana Code 36-7-4-1106 limits how far local zoning can exclude a manufactured home that meets the state's size and foundation standards. Whether a given home and lot qualify is the plan commission's decision; ask the city's planning department.",
    },
    {
      question: "Where does Kendallville's water come from?",
      answer:
        "Groundwater from nine city wells, protected under a wellhead protection plan. Ask the water department about a tap for a new home.",
    },
    {
      question: "Do you deliver to Kendallville?",
      answer:
        "Yes. Freight is quoted per route as its own line on your quote. You hire your own licensed contractors for the foundation, set-up and utility connections.",
    },
  ],
};

export default function KendallvilleLocationPage() {
  return <CityLocationTemplate data={data} />;
}
