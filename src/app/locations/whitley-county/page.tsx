import { generateLocationMetadata } from "../locationMetadata";
import { LocationPageTemplate } from "../LocationPageTemplate";

// Facts on this page were checked against public sources on 2026-10-23:
// the joint planning department and health department pages on
// whitleycounty.in.gov, the county permit form (site-plan requirement), the
// Whitley County EDC notice of the Regional Sewer District (IDEM order,
// 13 Sep 2018), Indiana DNR's floodway notice for South Whitley and IC 14-28-1,
// Census 2020 counts, and the three school corporations. Distance is from the
// vetted table in ../page.tsx. Anything that could not be confirmed — a gas
// provider, single-lot manufactured-home rules — is deliberately absent.
const locationData = {
  city: "Whitley County",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "35 miles",
  description:
    "One planning office, one health department and a countywide sewer district: here is who a buyer deals with when placing a Champion home in Whitley County, from the Tri-Lakes to South Whitley.",
  counties: ["Whitley"],
  facts: [
    { label: "County seat", value: "Columbia City" },
    { label: "Permits and zoning", value: "Joint Planning & Building Dept." },
    { label: "Septic and well permits", value: "Whitley County Health Dept." },
  ],
  localSections: [
    {
      heading: "One planning office for the whole county",
      paragraphs: [
        "Whitley County is unusual in northeast Indiana: planning, zoning and building permits for the county and for Columbia City, Churubusco and South Whitley all run through one office, the Columbia City/Whitley County Joint Planning and Building Department. It staffs a separate plan commission and board of zoning appeals for each jurisdiction, so the rules still depend on which side of a town line your land sits — but the counter you walk up to is the same one.",
        "That makes the first question simple. Before you buy a parcel or order a home, ask that department which jurisdiction the land falls under, what zoning district it is in, and what it requires for a single home on its own lot. Its zoning ordinance has a separate chapter for manufactured home parks; the rules for a home on private land are in the district standards, and the department is the one to read them to you for your parcel.",
      ],
    },
    {
      heading: "The site plan asks about drains and tiles",
      paragraphs: [
        "The county's permit application asks for a site plan showing the distances from the home to the property lines, to any well and septic system, and to county-maintained drains and field tiles. In farm country that last one matters: a regulated drain or an old tile line running through the back forty can decide where the house, the septic field and the driveway can go.",
        "Get that sketch right before the foundation contractor stakes the pad. Your surveyor or contractor draws it; we can give you the footprint of the floor plan you choose so the home is drawn at its real size.",
      ],
    },
    {
      heading: "Septic, wells and the Regional Sewer District",
      paragraphs: [
        "Well and septic permits come from the Whitley County Health Department in Columbia City, which also inspects residential septic installations. Budget time for a soil evaluation before the septic design, and size the system to the bedroom count of the home you pick — a four-bedroom plan needs a bigger field than a two-bedroom one.",
        "Since 2018 the county has also had a countywide Regional Sewer District, formed to deal with failing septic systems. If you are buying in an older lake neighborhood or a cluster of homes on small lots, ask whether the area is in, or planned for, a sewer project. It can change whether you install a septic system at all.",
      ],
    },
    {
      heading: "Lakes in the north, the Eel River in the south",
      paragraphs: [
        "The Tri-Lakes area in Thorncreek and Smith townships — Big Cedar, Little Cedar, Round and Shriner lakes — plus Blue Lake and Crooked Lake draw a lot of the buyers we talk to. Lake lots tend to be narrow, so a single-section home or a double-wide set lengthwise to the road often fits where a wider plan will not. Measure the buildable width after setbacks before you fall for a floor plan.",
        "In the south of the county the Eel River runs past South Whitley. Indiana law requires written approval from the Department of Natural Resources before building in a floodway, so check the flood maps for any river-bottom parcel early. A home in a flood fringe may need to sit higher, which changes the foundation and the steps.",
      ],
    },
    {
      heading: "Getting the home there",
      paragraphs: [
        "US 30 and US 33 cross the county, with State Roads 5, 9, 14 and 205 reaching the smaller towns and lakes. Every floor is built to order at Champion's Indiana plants — Aspire and Redman in Topeka, Prime in Decatur — and travels on oversize permits, so the last mile matters more than the highway. Tell us about tight turns, low wires, soft ground or a long lane when we quote, and your site contractor should have a firm, graded path ready on delivery day.",
      ],
    },
  ],
  nearbyTowns: ["Columbia City", "Churubusco", "South Whitley", "Larwill", "Tri-Lakes"],
  contacts: [
    {
      name: "Columbia City/Whitley County Joint Planning and Building Department",
      role: "Zoning, plan commission, board of zoning appeals and building permits for the county, Columbia City, Churubusco and South Whitley.",
      href: "https://www.whitleycounty.in.gov/department/?fDD=19-0",
    },
    {
      name: "Whitley County Health Department",
      role: "Well and septic permit applications and residential septic inspections.",
      href: "https://www.whitleycounty.in.gov/department/?fDD=9-0",
    },
    {
      name: "Whitley County Regional Sewer District",
      role: "Countywide district formed in 2018 for areas with failing septic systems — ask whether your parcel is in a project area.",
    },
    {
      name: "Indiana DNR, Division of Water",
      role: "Floodway approvals for land along the Eel River and other streams.",
      href: "https://www.in.gov/dnr/water/",
    },
  ],
  faqs: [
    {
      question: "Who issues building permits for a manufactured home in Whitley County?",
      answer:
        "The Columbia City/Whitley County Joint Planning and Building Department handles zoning and building permits for unincorporated Whitley County and for Columbia City, Churubusco and South Whitley. Each has its own plan commission, so ask which one your parcel falls under.",
    },
    {
      question: "Do I need a septic permit for a home near the Tri-Lakes?",
      answer:
        "Unless the lot is on a sewer, yes — septic and well permits come from the Whitley County Health Department. Ask the county's Regional Sewer District too, because older lake neighborhoods are where sewer projects are most likely.",
    },
    {
      question: "Can I put a home on land along the Eel River?",
      answer:
        "Possibly, but check the flood maps first. Building in a floodway in Indiana needs written approval from the DNR, and land in the flood fringe may need the home raised. Your surveyor can tell you which zone the building site is in.",
    },
    {
      question: "Which school district would a home near Larwill or South Whitley be in?",
      answer:
        "Whitko Community Schools, which covers southwest Whitley County and part of Kosciusko County. Columbia City is Whitley County Consolidated Schools and Churubusco is Smith-Green. District lines do not always follow town lines, so confirm the address with the district.",
    },
  ],
};

export const metadata = generateLocationMetadata({
  city: locationData.city,
  state: locationData.state,
  description:
    "Placing a Champion home in Whitley County, IN: the joint planning office, septic and well permits, the Regional Sewer District, Tri-Lakes lots and Eel River flood rules.",
});

export default function WhitleyCountyPage() {
  return <LocationPageTemplate countySlug="whitley-county" {...locationData} />;
}
