import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

// Facts checked against public sources on 2026-11-17: City of Angola
// (angola.in.gov): Building Safety Department on North Public Square,
// Economic Development & Planning and its permitting process, About Angola
// (2020 population); Angola Municipal Code (Code Publishing): Title 18 Unified
// Development Ordinance, ch. 18.68 MH district, s. 18.160.280 manufactured
// housing and lease-lot standards, ch. 15.10 improvement location permits;
// Indiana State Board of Accounts audits of the city's water and wastewater
// utilities and of the Steuben Lakes Regional Waste District; INDOT
// interchange book (I-69 exits 348 and 354). US 20 and SR 127 at the Public
// Square from the routes' Wikipedia articles. Electric provider inside the
// city deliberately omitted: no official source settles it. Distance is from
// the vetted table in ../page.tsx.

export const metadata = genMeta({
  title: "Mobile & Manufactured Homes in Angola, IN",
  description:
    "Placing a Champion home in Angola, IN: the city's own development ordinance and MH district, city water and sewer, the lakes district and I-69 exits.",
  keywords: [
    "manufactured homes angola indiana",
    "modular homes angola in",
    "mobile homes steuben county",
    "manufactured homes steuben county indiana",
    "champion homes angola in",
  ],
  url: "/locations/angola",
});

const data: CityLocationData = {
  city: "Angola",
  county: "Steuben County",
  slug: "angola",
  heroImage: "/images/paramount/belvidere-exterior.webp",
  distanceMi: 25,
  driveMin: 30,
  lat: 41.635,
  lng: -84.9994,
  tagline:
    "Angola is Steuben County's only city, with its own development ordinance, building department and utilities. Here is who answers for a lot inside the city.",
  intro: [
    "Angola, about 9,300 people around the roundabout on the Public Square where US 20 meets State Road 127, is the Steuben County seat and the county's only city, home to Trine University. Inside the limits the city writes its own development rules and runs its own water and sewer; around the lakes beyond it, other offices answer. We sell the home, quote it line by line and arrange delivery; the permits, the hook-ups and the site work are yours, and the offices below are the ones that answer.",
  ],
  facts: [
    { label: "Population (2020 census)", value: "9,340" },
    { label: "Zoning and planning", value: "City Economic Development & Planning" },
    { label: "Building permits", value: "City Building Safety Dept." },
    { label: "Water and sewer", value: "City of Angola utilities" },
    { label: "Schools", value: "MSD of Steuben County" },
  ],
  sections: [
    {
      heading: "The city's own development ordinance",
      paragraphs: [
        "Angola has its own Unified Development Ordinance, Title 18 of the city code, and its own improvement location permit, in chapter 15.10. Planning and the Plan Commission sit in the city's Economic Development & Planning department, which publishes its permitting process, and building permits come from the Building Safety Department on the Public Square, whose building commissioner is also the city's fire marshal.",
      ],
    },
    {
      heading: "What the ordinance says about manufactured homes",
      paragraphs: [
        "The ordinance has a Manufactured Home Residential (MH) district, chapter 18.68, meant for lease-lot developments of single- and double-section homes, and section 18.160.280 sets the standards there: among them a separate foundation for each home and an improvement location permit for each before it is installed. The ordinance also bars using a manufactured home as an accessory dwelling.",
        "What the ordinance asks of a manufactured home on a lot in another residential district is a question for the planning department; this page does not answer it either way. A modular home built to the state code is a different case again. Ask the department about your lot and your chosen home before you buy.",
      ],
    },
    {
      heading: "City utilities, and the lakes outside the city",
      paragraphs: [
        "Inside the limits, the City of Angola runs municipal water and wastewater utilities, each with its own superintendent. Ask the city what a tap and sewer connection for a new home need.",
        "Outside the city, around the lakes, the Steuben Lakes Regional Waste District, a separate district based near Angola, has extended sewers to lake areas. If your lot is in lake country, ask the district whether it is served before planning a septic system. The Steuben County page covers the county side.",
      ],
    },
    {
      heading: "Two I-69 exits",
      paragraphs: [
        "I-69 passes Angola with exits at US 20 (exit 348) and State Road 127 (exit 354), and the Indiana Toll Road is reached by SR 127 near Fremont. Inside the city, an oversize load still has to work around the Public Square roundabout. Tell us your street and how the lot is reached when we quote, and have your site contractor grade a firm, wide approach.",
      ],
    },
  ],
  contacts: [
    {
      name: "City of Angola Economic Development & Planning",
      role: "Zoning, the Unified Development Ordinance and improvement location permits.",
      href: "https://www.angola.in.gov/departments/economic_development_planning/permitting_process.php",
    },
    {
      name: "City of Angola Building Safety Department",
      role: "Building permits and inspections inside the city.",
      href: "https://www.angola.in.gov/departments/building_safety/index.php",
    },
    {
      name: "Steuben Lakes Regional Waste District",
      role: "Sewer service around the lakes outside the city.",
    },
  ],
  nearby: [
    { name: "Steuben County", href: "/locations/steuben-county" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "Butler", href: "/locations/butler" },
    { name: "Waterloo", href: "/locations/waterloo" },
    { name: "LaGrange County", href: "/locations/lagrange-county" },
    { name: "Fremont" },
    { name: "Orland" },
  ],
  faqs: [
    {
      question: "Who issues permits for a home inside Angola?",
      answer:
        "The city. Planning and improvement location permits go through Economic Development & Planning under the city's Unified Development Ordinance, and building permits through the Building Safety Department.",
    },
    {
      question: "Does Angola have a manufactured home district?",
      answer:
        "Yes, the MH district in chapter 18.68, intended for lease-lot developments, with standards in section 18.160.280. For a home on a lot in another district, ask the planning department.",
    },
    {
      question: "Is there sewer at the lakes near Angola?",
      answer:
        "In places. The Steuben Lakes Regional Waste District has extended sewers to lake areas outside the city. Ask the district about your lot before planning a septic system.",
    },
    {
      question: "Do you deliver to Angola?",
      answer:
        "Yes. Freight is quoted per route as its own line on your quote. You hire your own licensed contractors for the foundation, set-up and utility connections.",
    },
  ],
};

export default function AngolaLocationPage() {
  return <CityLocationTemplate data={data} />;
}
