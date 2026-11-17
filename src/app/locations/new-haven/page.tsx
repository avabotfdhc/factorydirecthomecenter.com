import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

// Facts checked against public sources on 2026-11-17: City of New Haven
// Planning Department (Residential and Commercial Permits; Plan Commission and
// BZA; Ordinances & Plans; FAQ: covenants, Zoning and Floodplain Map Viewer),
// City of New Haven Utilities (Water/Sewer/Stormwater; Water Quality Report:
// water bought from Fort Wayne), the city's Utility Providers page (Indiana
// Michigan Power) and Truck Routes map, IDEM NPDES notice for INM020346
// (combined sewers treated at Fort Wayne's P.L. Brunner plant), FEMA's 2021
// preliminary Allen County flood maps (community 180004), Census 2020
// (QuickFacts). The Maumee and I-469 from the city's own maps. Distance is
// from the vetted table in ../page.tsx.

export const metadata = genMeta({
  title: "Mobile & Manufactured Homes in New Haven, IN",
  description:
    "Placing a Champion home in New Haven, IN: the city's own location permit, Maumee River flood maps, city water and sewer, and truck routes in.",
  keywords: [
    "manufactured homes new haven indiana",
    "modular homes new haven in",
    "mobile homes allen county",
    "manufactured homes allen county indiana",
    "champion homes new haven",
  ],
  url: "/locations/new-haven",
});

const data: CityLocationData = {
  city: "New Haven",
  county: "Allen County",
  slug: "new-haven",
  heroImage: "/images/options/mod-exteriors-1.webp",
  distanceMi: 28,
  driveMin: 35,
  lat: 41.07,
  lng: -85.0147,
  tagline:
    "New Haven issues its own permits, runs its own utilities and sits on the Maumee. Here is who to ask, and what to check, before a Champion home goes on a New Haven lot.",
  intro: [
    "New Haven is a city of about 15,600 on Fort Wayne's east side, and it does much of its own government: its own planning department, plan commission, zoning board and development ordinance, and its own water, sewer and stormwater utility. A lot inside the city limits answers to City Hall on Lincoln Highway East, not to the county. We sell the home, quote it line by line and arrange delivery; the permits and the site work are yours, and the offices below are the ones that answer.",
  ],
  facts: [
    { label: "Population (2020 census)", value: "15,583" },
    { label: "Zoning and location permits", value: "City of New Haven Planning Dept." },
    { label: "Water, sewer and stormwater", value: "City of New Haven Utilities" },
    { label: "Electric (city's provider list)", value: "Indiana Michigan Power" },
    { label: "Schools", value: "East Allen County Schools" },
  ],
  sections: [
    {
      heading: "The city, not the county, issues your location permit",
      paragraphs: [
        "Inside the limits, a new home needs an Improvement Location Permit from the New Haven Planning Department, which also issues Certificates of Compliance. The city has its own Plan Commission, Board of Zoning Appeals and Unified Development Ordinance, so the rules that apply are New Haven's. Land just outside the city is Allen County's, through the county's Department of Planning Services.",
        "The planning department says plainly that it does not enforce private covenants. Many subdivisions carry deed restrictions on home type, size or foundation, so read the plat and any HOA rules for your lot yourself before you order.",
      ],
    },
    {
      heading: "On the Maumee: look at the flood map first",
      paragraphs: [
        "Most of New Haven lies along the south bank of the Maumee River, and the river's floodplain reaches into parts of the city. New Haven publishes a Zoning and Floodplain Map Viewer for looking up a parcel, and FEMA's preliminary flood maps for Allen County, issued in 2021, cover the city. A lot in a mapped flood zone can change where the home may sit and how high it must be set, so check the map before you buy the land, and ask the planning department about anything the map shows.",
      ],
    },
    {
      heading: "City water and sewer, treated in Fort Wayne",
      paragraphs: [
        "New Haven's utilities department runs water, sewer and stormwater for the city. The water itself is bought from Fort Wayne, and New Haven's wastewater flows to Fort Wayne's P.L. Brunner treatment plant; the city has none of its own. For a buyer that means one office to ask about a tap and a sewer connection, and the city's rules for connecting. Outside the limits, ask whether the lot can be served at all before you plan a septic system or well.",
        "The city's list of utility providers names Indiana Michigan Power for electricity. Ask the provider for your address what it takes to bring service to the building site.",
      ],
    },
    {
      heading: "Getting a home in: I-469 and the truck routes",
      paragraphs: [
        "I-469 runs north and south through New Haven and ties into US 24 and US 30, so most deliveries reach the city on the interstate. Inside the city, New Haven publishes a truck route map, and an oversize load follows it as far as it can. Tell us the street, any tight turns or low wires, and how the lot is reached when we quote, and have your site contractor grade a firm, wide approach.",
      ],
    },
  ],
  contacts: [
    {
      name: "City of New Haven Planning Department",
      role: "Improvement Location Permits, zoning and the floodplain map viewer for lots inside the city.",
      href: "https://www.newhaven.in.gov/619/Residential-and-Commercial-Permits",
    },
    {
      name: "City of New Haven Utilities",
      role: "Water, sewer and stormwater connections inside the city.",
      href: "https://www.newhaven.in.gov/612/Water-Sewer-Stormwater",
    },
    {
      name: "Allen County Department of Planning Services",
      role: "Zoning and permits for land outside the city limits.",
      href: "https://www.allencounty.in.gov/281/Department-of-Planning-Services",
    },
  ],
  nearby: [
    { name: "Fort Wayne", href: "/locations/fort-wayne" },
    { name: "Huntertown", href: "/locations/huntertown" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "Woodburn" },
    { name: "Monroeville" },
    { name: "Harlan" },
  ],
  faqs: [
    {
      question: "Who issues the permit for a home in New Haven, Indiana?",
      answer:
        "Inside the city limits, the New Haven Planning Department issues the Improvement Location Permit under the city's own development ordinance. Outside the limits, Allen County's Department of Planning Services does.",
    },
    {
      question: "Is my New Haven lot in the Maumee River floodplain?",
      answer:
        "Look it up in the city's Zoning and Floodplain Map Viewer, and check FEMA's flood maps for Allen County. If the lot is in a mapped flood zone, ask the planning department what that means for placing a home there before you buy.",
    },
    {
      question: "Does the city check my subdivision's covenants?",
      answer:
        "No. The planning department says it does not enforce private covenants, so read your plat and any HOA rules yourself before you order a home.",
    },
    {
      question: "Do you deliver to New Haven?",
      answer:
        "Yes. Freight is quoted per route as its own line on your quote. You hire your own licensed contractors for the foundation, set-up and utility hook-ups.",
    },
  ],
};

export default function NewHavenLocationPage() {
  return <CityLocationTemplate data={data} />;
}
