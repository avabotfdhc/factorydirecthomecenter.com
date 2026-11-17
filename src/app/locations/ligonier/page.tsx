import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

// Facts checked against public sources on 2026-11-17: City of Ligonier
// (in.gov/cities/ligonier): Building and Zoning office on South Cavin Street,
// Plan Commission page and its January 2026 minutes (revised ordinances to
// follow the new comprehensive plan), Water Department (Ligonier Waterworks),
// Wastewater Department (about 49% of the sewer service area combined),
// "Utilities in Ligonier" (Indiana Michigan Power), About Ligonier (founded
// 1835 on the Elkhart River); Ligonier city code on American Legal (R5
// district and s. 156.129 for manufactured homes); National Park Service
// NRHP record 87001798 (Ligonier Historic District); Noble County Building
// Department (Ligonier issues its own permits); Census 2020. US 6 and US 33
// from the routes' Wikipedia articles. Distance is from the vetted table in
// ../page.tsx.

export const metadata = genMeta({
  title: "Mobile & Manufactured Homes in Ligonier, IN",
  description:
    "Placing a Champion home in Ligonier, IN: the city's own permits, where its code puts manufactured homes, city water and sewer, and the historic district.",
  keywords: [
    "manufactured homes ligonier indiana",
    "modular homes ligonier in",
    "mobile homes western noble county",
    "manufactured homes noble county indiana",
    "champion homes ligonier",
  ],
  url: "/locations/ligonier",
});

const data: CityLocationData = {
  city: "Ligonier",
  county: "Noble County",
  slug: "ligonier",
  heroImage: "/images/paramount/odyssey-exterior-b.webp",
  distanceMi: 32,
  driveMin: 42,
  lat: 41.467,
  lng: -85.5875,
  tagline:
    "Ligonier issues its own permits, says in its code where manufactured homes go, and is rewriting that code now. Here is who to ask before you buy a lot.",
  intro: [
    "Ligonier is a city of about 4,600 on the Elkhart River in western Noble County, founded in 1835, where US 6 and US 33 come in together from the west. It issues its own permits and runs its own water and sewer, and its zoning code is specific about manufactured homes, so a lot inside the city has more to check than one out in the township. We sell the home, quote it line by line and arrange delivery; the permits, the hook-ups and the site work are yours, and the offices below are the ones that answer.",
  ],
  facts: [
    { label: "Population (2020 census)", value: "4,568" },
    { label: "Zoning and building permits", value: "City Building and Zoning office" },
    { label: "Water and sewer", value: "Ligonier Waterworks and city wastewater" },
    { label: "Electric (city's utilities page)", value: "Indiana Michigan Power" },
    { label: "Schools", value: "West Noble School Corporation" },
  ],
  sections: [
    {
      heading: "Where the city code puts manufactured homes",
      paragraphs: [
        "Ligonier's zoning code sorts homes into types. A home built to the Indiana One and Two Family Dwelling Code is Type I; a HUD-code manufactured home is Type II. The code restricts Type II and Type III manufactured homes to its R5 district, and section 156.129 sets the R5 standards, among them a permanent perimeter enclosure meeting the state dwelling code, wheels, axles and hitch removed, and a minimum lot size.",
        "That makes the zoning of your lot the first question, and the kind of home the second: a modular home built to the state code is treated differently from a HUD-code home. Ask the Building and Zoning office how your lot is zoned and which type your chosen home counts as before you buy either.",
      ],
    },
    {
      heading: "A code being rewritten",
      paragraphs: [
        "The Ligonier Plan Commission writes the city's comprehensive plan and its zoning and subdivision ordinances, and its January 2026 minutes record revised ordinances pending to follow a new comprehensive plan. The rules described above may change. Check the current text with the city when you are ready to buy, not from a page written earlier, this one included.",
      ],
    },
    {
      heading: "City water, city sewer, I&M power",
      paragraphs: [
        "Ligonier Waterworks is owned and run by the city, and water and sewer come on one monthly bill. The city estimates that about half of its sewer service area is combined sewers, carrying storm water and sewage together, so ask the wastewater department what a connection for a new home needs and where storm water from the lot may go. The city's utilities page names Indiana Michigan Power for electricity.",
      ],
    },
    {
      heading: "The historic district and the river",
      paragraphs: [
        "The Ligonier Historic District has been on the National Register of Historic Places since 1987, with 253 contributing buildings in the blocks between Smith, College, Grand and Union streets and the railway. The city was laid out on the banks of the Elkhart River, so check FEMA's flood map for any lot near the water, and ask the city about anything in or near a mapped zone.",
      ],
    },
  ],
  contacts: [
    {
      name: "City of Ligonier Building and Zoning",
      role: "Zoning, building permits and the R5 standards for manufactured homes.",
      href: "https://www.in.gov/cities/ligonier/government/city-departments/building-and-zoning",
    },
    {
      name: "Ligonier Plan Commission",
      role: "The comprehensive plan and the zoning and subdivision ordinances now being revised.",
      href: "https://www.in.gov/cities/ligonier/government/local-boards/plan-commission",
    },
    {
      name: "Ligonier Water and Wastewater Departments",
      role: "Water taps and sewer connections inside the city.",
      href: "https://www.in.gov/cities/ligonier/government/city-departments/water-department",
    },
  ],
  nearby: [
    { name: "Noble County", href: "/locations/noble-county" },
    { name: "Albion", href: "/locations/albion" },
    { name: "Kendallville", href: "/locations/kendallville" },
    { name: "Elkhart County", href: "/locations/elkhart-county" },
    { name: "LaGrange County", href: "/locations/lagrange-county" },
    { name: "Cromwell" },
  ],
  faqs: [
    {
      question: "Where can a manufactured home go in Ligonier?",
      answer:
        "The city code restricts Type II and Type III manufactured homes to its R5 district, with standards in section 156.129. The code is being revised, so ask the Building and Zoning office for the current rules for your lot.",
    },
    {
      question: "Is a modular home treated the same as a HUD-code home in Ligonier?",
      answer:
        "No. The code calls a home built to the Indiana One and Two Family Dwelling Code Type I, and a HUD-code home Type II. Ask the city which type your chosen home counts as.",
    },
    {
      question: "Who provides utilities in Ligonier?",
      answer:
        "The city runs water and sewer, billed together, and its utilities page names Indiana Michigan Power for electricity.",
    },
    {
      question: "Do you deliver to Ligonier?",
      answer:
        "Yes. Freight is quoted per route as its own line on your quote. You hire your own licensed contractors for the foundation, set-up and utility connections.",
    },
  ],
};

export default function LigonierLocationPage() {
  return <CityLocationTemplate data={data} />;
}
