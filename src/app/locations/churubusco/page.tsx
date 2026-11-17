import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

// Facts checked against public sources on 2026-11-17: Columbia City/Whitley
// County Joint Planning and Building Department (staffs Churubusco's plan
// commission and BZA; the town's own zoning jurisdictional area; the 2022
// annual report on the town contracting for county planning), Town of
// Churubusco Utility Department and Ordinance 2025-11 (water and sewer
// utilities), Ordinance 2024-06 (sewer use), Ordinance 2025-04 (road and
// right-of-way work permits), Smith-Green Community Schools (Smith Township,
// Whitley County, and Green Township, Noble County), Census 2020. US 33 and
// SR 205 from the routes' Wikipedia articles and HMdb. Electric provider deliberately omitted: no
// official source settles it. Distance is from the vetted table in ../page.tsx.

export const metadata = genMeta({
  title: "Mobile & Manufactured Homes in Churubusco, IN",
  description:
    "Placing a Champion home in Churubusco, IN: the town's own zoning area, town water and sewer, the right-of-way permit for a driveway, and US 33.",
  keywords: [
    "manufactured homes churubusco indiana",
    "modular homes churubusco in",
    "mobile homes whitley county",
    "manufactured homes near churubusco",
    "champion homes churubusco",
  ],
  url: "/locations/churubusco",
});

const data: CityLocationData = {
  city: "Churubusco",
  county: "Whitley County",
  slug: "churubusco",
  heroImage: "/images/paramount/lincoln-exterior.webp",
  distanceMi: 22,
  driveMin: 30,
  lat: 41.2306,
  lng: -85.3197,
  tagline:
    "Churubusco is a small town with its own zoning area, its own water and sewer, and a permit for any work in its streets. Here is who answers for a lot there.",
  intro: [
    "Churubusco is a town of about 1,900 in Smith Township, Whitley County, where US 33 meets State Road 205. It is small, but it keeps its own zoning jurisdiction and runs its own utilities, so a lot in town answers to more than one office. We sell the home, quote it line by line and arrange delivery; the permits, the hook-ups and the site work are yours, and the offices below are the ones that answer.",
  ],
  facts: [
    { label: "Population (2020 census)", value: "1,870" },
    { label: "Planning and zoning", value: "Joint Planning & Building Dept." },
    { label: "Water and sewer", value: "Town of Churubusco Utility Dept." },
    { label: "Schools", value: "Smith-Green Community Schools" },
  ],
  sections: [
    {
      heading: "The town's own zoning area, staffed by the county",
      paragraphs: [
        "Churubusco has had a planning arrangement with the county since the late 1960s. The town has its own plan commission, board of zoning appeals and zoning jurisdictional area, and the Columbia City/Whitley County Joint Planning and Building Department staffs them. In practice that means one office in Columbia City handles the paperwork, and the rules applied are the ones for Churubusco's jurisdiction.",
        "Ask the department, before you buy, what the zoning on your lot allows and what the location and building permits need.",
      ],
    },
    {
      heading: "Town water and town sewer",
      paragraphs: [
        "The town runs both its water and sewer utilities through its Utility Department; a 2025 ordinance names the Town Manager as agent for both, with a superintendent for each, and the sewer use ordinance was restated in 2024. For a lot in town, ask the Utility Department what a water tap and sewer connection need and what the sewer ordinance asks of a new hook-up. Outside town, ask whether the lot can be served before planning a septic system or well.",
      ],
    },
    {
      heading: "Digging in the street takes a town permit",
      paragraphs: [
        "In 2025 Churubusco adopted an ordinance requiring a permit for work in town roads and rights-of-way. A new driveway cut, or water and sewer lines run from the street to your home, can fall under it, so your site contractor should ask the town before anyone digs near the road.",
      ],
    },
    {
      heading: "US 33 and SR 205",
      paragraphs: [
        "US 33, the old Lincoln Highway, and State Road 205 meet in town, and SR 205 runs southwest to Columbia City. Smith-Green Community Schools serves Smith Township and Green Township across the line in Noble County, with its schools on one campus in Churubusco. Tell us your street and how the lot is reached when we quote, and have your site contractor grade a firm, wide approach.",
      ],
    },
  ],
  contacts: [
    {
      name: "Columbia City/Whitley County Joint Planning and Building Department",
      role: "Staffs Churubusco's plan commission and BZA; zoning and permits in the town's jurisdiction.",
      href: "https://www.whitleycounty.in.gov/department/?fDD=19-0",
    },
    {
      name: "Town of Churubusco Utility Department",
      role: "Water and sewer connections, and road and right-of-way work permits.",
      href: "https://www.townofchurubusco.com/departments/utility-department",
    },
  ],
  nearby: [
    { name: "Columbia City", href: "/locations/columbia-city" },
    { name: "Huntertown", href: "/locations/huntertown" },
    { name: "Whitley County", href: "/locations/whitley-county" },
    { name: "Fort Wayne", href: "/locations/fort-wayne" },
    { name: "Albion", href: "/locations/albion" },
    { name: "Auburn", href: "/locations/auburn" },
  ],
  faqs: [
    {
      question: "Who handles zoning in Churubusco?",
      answer:
        "Churubusco has its own plan commission, board of zoning appeals and zoning area, staffed by the Columbia City/Whitley County Joint Planning and Building Department.",
    },
    {
      question: "Does Churubusco have town water and sewer?",
      answer:
        "Yes. The town runs both through its Utility Department. Ask it what a connection for a new home needs.",
    },
    {
      question: "Do I need a town permit for a driveway in Churubusco?",
      answer:
        "Work in town roads and rights-of-way needs a town permit under a 2025 ordinance, which can include a driveway cut or utility lines from the street. Ask the town before work starts.",
    },
    {
      question: "Do you deliver to Churubusco?",
      answer:
        "Yes. Freight is quoted per route as its own line on your quote. You hire your own licensed contractors for the foundation, set-up and utility connections.",
    },
  ],
};

export default function ChurubuscoLocationPage() {
  return <CityLocationTemplate data={data} />;
}
