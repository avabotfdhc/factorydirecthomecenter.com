import { generateMetadata as genMeta } from "@/lib/seo";
import { CityLocationTemplate, type CityLocationData } from "../CityLocationTemplate";

// Facts checked against public sources on 2026-11-17: Allen County Department
// of Planning Services (Zoning FAQ, 2024: DPS staffs planning for unincorporated
// Allen County and Huntertown, Grabill, Monroeville and Woodburn; the shared
// "All In Allen" comprehensive plan, 2023), Huntertown Town Code (amlegal:
// Planning and Development, ch. 152; the sewer utility's exclusive service-area
// licence), Indiana Office of Utility Consumer Counselor, "Huntertown vs. Fort
// Wayne" (the 1988 agreement, its 2013 end, IURC Cause 44519, the 2016
// settlement), Water & Wastes Digest plant profile (town treatment plant opened
// 2018), IDEM public water system IN5202007 (Huntertown Water Works), NIRCC
// Huntertown sub-area transportation study, Census 2000/2010/2020. Electric
// provider deliberately omitted: no official source settles it. Distance is
// from the vetted table in ../page.tsx.

export const metadata = genMeta({
  title: "Mobile & Manufactured Homes in Huntertown, IN",
  description:
    "Placing a Champion home in Huntertown, IN: Allen County planners act for the town, Huntertown runs its own sewer and water, and Lima Road brings it in.",
  keywords: [
    "manufactured homes huntertown indiana",
    "modular homes huntertown in",
    "mobile homes northern allen county",
    "manufactured homes allen county indiana",
    "champion homes huntertown",
  ],
  url: "/locations/huntertown",
});

const data: CityLocationData = {
  city: "Huntertown",
  county: "Allen County",
  slug: "huntertown",
  heroImage: "/images/paramount/timberlake-exterior.webp",
  distanceMi: 18,
  driveMin: 25,
  lat: 41.2314,
  lng: -85.1719,
  tagline:
    "Huntertown has more than doubled twice since 2000, keeps its own sewer and water utilities, and borrows Allen County's planners. Here is who answers for a lot in town.",
  intro: [
    "Huntertown is a town of about 9,100 on Lima Road, just north of Fort Wayne's Carroll Road edge, and it is one of the fastest-growing places in the county: 1,771 people in 2000, 4,810 in 2010, 9,141 in 2020. Growth that fast means most lots are in new subdivisions, and most new subdivisions come with restrictions. We sell the home, quote it line by line and arrange delivery; the permits, the hook-ups and the site work are yours, and the offices below are the ones that answer.",
  ],
  facts: [
    { label: "Population (2020 census)", value: "9,141" },
    { label: "Zoning and plan commission", value: "Allen County Dept. of Planning Services" },
    { label: "Sanitary sewer", value: "Huntertown Sewer Utility" },
    { label: "Public water", value: "Huntertown Water Works" },
    { label: "Schools", value: "Northwest Allen County Schools" },
  ],
  sections: [
    {
      heading: "The town's rules, the county's planners",
      paragraphs: [
        "Huntertown has its own zoning ordinance, plan commission and board of zoning appeals, but it does not staff them itself. Allen County's Department of Planning Services, the joint Fort Wayne–Allen County office, administers planning for Huntertown as it does for Grabill, Monroeville and Woodburn. So the application goes to the county office, and it is judged against Huntertown's ordinance. Rezonings go to the Town Council for a vote.",
        "Ask Planning Services, before you buy, what the zoning on your lot allows and which building permits and inspections apply.",
      ],
    },
    {
      heading: "Read the subdivision's covenants first",
      paragraphs: [
        "With the population doubling twice in twenty years, many Huntertown lots sit in subdivisions recorded with their own covenants. Those can set the type of home, its size, roof pitch, garage or foundation, and they bind the lot whatever the zoning says. Ask for the recorded plat and covenants with the purchase paperwork, and read them before you pick a floor plan.",
      ],
    },
    {
      heading: "Huntertown runs its own sewer",
      paragraphs: [
        "For years Fort Wayne treated Huntertown's sewage under an agreement signed in 1988. That agreement ended in 2013, the rate dispute that followed went to the Indiana Utility Regulatory Commission and was settled in 2016, and the town opened its own wastewater treatment plant in 2018. Today the Huntertown Sewer Utility holds an exclusive licence for sanitary sewer service in its service area, apart from customers Fort Wayne already served in 2013.",
        "Water in town comes from Huntertown Water Works. For a lot in or near town, ask Town Hall whether it is in the sewer and water service areas and what a connection needs before you plan a septic system or a well.",
      ],
    },
    {
      heading: "Lima Road in, I-69 nearby",
      paragraphs: [
        "State Road 3, Lima Road, runs through Huntertown as a four-lane expressway, and I-69 has an interchange at Union Chapel Road to the south. The regional planning council began a transportation study of the Huntertown area because of the development there, so expect new roads and turn lanes around newer subdivisions. Tell us how your street and lot are reached when we quote, and have your site contractor grade a firm, wide approach.",
      ],
    },
  ],
  contacts: [
    {
      name: "Allen County Department of Planning Services",
      role: "Zoning, plan commission and board of zoning appeals for the town of Huntertown.",
      href: "https://www.allencounty.in.gov/281/Department-of-Planning-Services",
    },
    {
      name: "Town of Huntertown, Town Hall",
      role: "Sewer and water service areas and connections; 15617 Lima Road.",
    },
  ],
  nearby: [
    { name: "Fort Wayne", href: "/locations/fort-wayne" },
    { name: "Churubusco", href: "/locations/churubusco" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "New Haven", href: "/locations/new-haven" },
    { name: "Leo-Cedarville" },
    { name: "Garrett", href: "/locations/garrett" },
  ],
  faqs: [
    {
      question: "Who handles zoning for a lot in Huntertown?",
      answer:
        "Allen County's Department of Planning Services administers Huntertown's own zoning ordinance and staffs its plan commission and board of zoning appeals. The Town Council votes on rezonings.",
    },
    {
      question: "Does Fort Wayne still treat Huntertown's sewage?",
      answer:
        "No. The 1988 agreement ended in 2013, and the town opened its own treatment plant in 2018. The Huntertown Sewer Utility holds the licence for its service area. Ask Town Hall whether your lot is in it.",
    },
    {
      question: "Can my subdivision's covenants rule out a home?",
      answer:
        "They can. Recorded covenants can set home type, size and foundation regardless of zoning, so read them before you choose a floor plan.",
    },
    {
      question: "Do you deliver to Huntertown?",
      answer:
        "Yes. Freight is quoted per route as its own line on your quote. You hire your own licensed contractors for the foundation, set-up and utility connections.",
    },
  ],
};

export default function HuntertownLocationPage() {
  return <CityLocationTemplate data={data} />;
}
