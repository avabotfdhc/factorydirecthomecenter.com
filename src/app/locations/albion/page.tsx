import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

// Facts checked against public sources on 2026-11-17: Noble County Building
// Department (Albion among the towns that issue their own building permits)
// and Plan Commission pages (incorporated towns are outside the county
// ordinance; the county's Unified Development Ordinance took effect January
// 2024), the Town of Albion Zoning Ordinance (adopted under IC 36-7-4-600;
// Improvement Location Permit, s. 11.4), EPA public water system IN5257001
// (Albion Water & Sewer), Indiana DNR's Chain O'Lakes State Park page,
// AARoads (SR 8 and SR 9; the 1888 courthouse), INDOT's table of 2020 census
// populations. Electric provider deliberately omitted: no official source
// settles it. Distance is from the vetted table in ../page.tsx.

export const metadata = genMeta({
  title: "Mobile & Manufactured Homes in Albion, IN",
  description:
    "Placing a Champion home in Albion, IN, the Noble County seat: the town's own permit, the county offices that are not yours, town water, and Chain O'Lakes.",
  keywords: [
    "manufactured homes albion indiana",
    "modular homes albion in",
    "mobile homes noble county",
    "manufactured homes near chain o'lakes",
    "champion homes albion",
  ],
  url: "/locations/albion",
});

const data: CityLocationData = {
  city: "Albion",
  county: "Noble County",
  slug: "albion",
  heroImage: "/images/paramount/alberta-exterior.webp",
  distanceMi: 25,
  driveMin: 32,
  lat: 41.3945,
  lng: -85.4247,
  tagline:
    "Albion is the Noble County seat, which puts the county's offices in town, but a lot inside Albion answers to the town. Here is who to ask.",
  intro: [
    "Albion is a town of about 2,200 around the 1888 Noble County Courthouse, where State Roads 8 and 9 meet, with Chain O'Lakes State Park just to the south. Because it is the county seat, the county plan commission and building department are in town, and that is the trap: they handle the unincorporated county, not lots inside Albion. We sell the home, quote it line by line and arrange delivery; the permits, the hook-ups and the site work are yours, and the offices below are the ones that answer.",
  ],
  facts: [
    { label: "Population (2020 census)", value: "2,222" },
    { label: "Inside town limits", value: "Town of Albion zoning and permits" },
    { label: "Outside town limits", value: "Noble County Plan Commission" },
    { label: "Water and sewer", value: "Albion Water & Sewer (town)" },
    { label: "Schools", value: "Central Noble Community Schools" },
  ],
  sections: [
    {
      heading: "In town, the town's ordinance; outside, the county's",
      paragraphs: [
        "The Town of Albion has its own zoning ordinance, adopted under Indiana's planning law, covering land within the town's jurisdiction, with its own improvement location permit. Noble County's building department lists Albion among the five towns that issue their own building permits, and the county's zoning page says incorporated towns sit outside the county ordinance.",
        "The county plan commission on North York Street and the county building department are a short walk from the courthouse, and they work under the county's Unified Development Ordinance, in effect since January 2024. They are the right office for a parcel outside the town limits, and the wrong one for a lot inside them. Ask the town first, and confirm which side of the line your parcel is on.",
      ],
    },
    {
      heading: "Town water and sewer",
      paragraphs: [
        "Inside the limits, Albion Water & Sewer is the town's own utility, and the town has been investing in its water system. Ask the town what a tap and sewer connection for a new home need. Outside the limits, ask whether a lot can be served at all, and ask the Noble County Health Department about septic and well permits if it cannot.",
      ],
    },
    {
      heading: "Chain O'Lakes country",
      paragraphs: [
        "Chain O'Lakes State Park, 2,718 acres of glacial kettle lakes, lies south of town, with its gatehouse off State Road 9. Land around lakes and wetlands can carry flood-zone, shoreline and septic limits that a dry lot does not, so look a lake-area parcel up on the state's floodplain map and ask the county health department about septic before you buy.",
      ],
    },
    {
      heading: "State Roads 8 and 9",
      paragraphs: [
        "State Road 8 ends at State Road 9 by the courthouse square, so most deliveries reach Albion on one of those two roads. A downtown square and its corners are tighter than an open county road. Tell us your street and how the lot is reached when we quote, and have your site contractor grade a firm, wide approach.",
      ],
    },
  ],
  contacts: [
    {
      name: "Town of Albion",
      role: "Zoning, improvement location and building permits, and water and sewer inside the town limits.",
      href: "https://www.albion-in.org",
    },
    {
      name: "Noble County Plan Commission",
      role: "Zoning for parcels outside the town limits, under the county's 2024 ordinance.",
      href: "https://secure.in.gov/counties/noble/plan-commission/zoning-enforcement",
    },
    {
      name: "Indiana DNR, Chain O'Lakes State Park",
      role: "The state park south of town.",
      href: "https://in.gov/dnr/state-parks/parks-lakes/chain-o-lakes-state-park",
    },
  ],
  nearby: [
    { name: "Noble County", href: "/locations/noble-county" },
    { name: "Kendallville", href: "/locations/kendallville" },
    { name: "Ligonier", href: "/locations/ligonier" },
    { name: "Churubusco", href: "/locations/churubusco" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "Rome City" },
  ],
  faqs: [
    {
      question: "Who issues permits for a lot inside Albion?",
      answer:
        "The Town of Albion, under its own zoning ordinance. The Noble County offices in town handle parcels outside the town limits.",
    },
    {
      question: "My land is just outside Albion. Who do I ask?",
      answer:
        "The Noble County Plan Commission, under the county's Unified Development Ordinance, and the county health department for septic and well. Confirm first which side of the town line your parcel is on.",
    },
    {
      question: "Does Albion have town water and sewer?",
      answer: "Yes, Albion Water & Sewer inside the town limits. Ask the town what a new connection needs.",
    },
    {
      question: "Do you deliver to Albion?",
      answer:
        "Yes. Freight is quoted per route as its own line on your quote. You hire your own licensed contractors for the foundation, set-up and utility connections.",
    },
  ],
};

export default function AlbionLocationPage() {
  return <CityLocationTemplate data={data} />;
}
