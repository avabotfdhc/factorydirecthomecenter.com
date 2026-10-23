import { LocationPageTemplate } from "../LocationPageTemplate";
import { generateLocationMetadata } from "../locationMetadata";

// Facts checked against public sources on 2026-10-23: waterlooin.gov (plan
// commission, BZA, the ILP instructions, the 2017 extraterritorial
// jurisdiction agreement, utilities), Amtrak's Waterloo (WTI) station page,
// Census 2020 and DeKalb County Central United schools. Distance is from the
// vetted table in ../page.tsx. The town's electric and gas providers could not
// be confirmed and are deliberately not named.
const locationData = {
  city: "Waterloo",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "6 miles",
  description:
    "Waterloo zones its own land and, by agreement with DeKalb County, some of the land around it. Here is who signs off on a Champion home in and just outside town, and what the rail line means for your lot.",
  counties: ["DeKalb"],
  facts: [
    { label: "Status", value: "Town, Grant & Smithfield townships" },
    { label: "Location permit", value: "Town Zoning Administrator" },
    { label: "Water and sewer", value: "Town of Waterloo Utilities" },
    { label: "Schools", value: "DeKalb County Central United" },
  ],
  localSections: [
    {
      heading: "The town signs off first",
      paragraphs: [
        "Waterloo is a town of about 2,100 people a few minutes north of our Auburn lot. It has its own plan commission and board of zoning appeals, and its Zoning Administrator issues the Improvement Location Permit for new construction. The town's instructions say a new home's permit is approved only after the Street, Water and Sewer departments have commented on it, and a site plan is required.",
        "If a building permit is needed as well, you take the approved location permit on to the building department. Leave time for that first round of town review in your schedule — it happens before any building permit can be pulled.",
      ],
    },
    {
      heading: "Just outside town may still be the town",
      paragraphs: [
        "In 2017 Waterloo and DeKalb County drew up an agreement giving the town zoning control over a mapped area of unincorporated land around its limits — Indiana lets a town plan up to two miles beyond its boundary that way. In practice that means a parcel with a county road address can still fall under the town's zoning.",
        "Before you buy land on the edge of Waterloo, ask the town whether it sits inside that area. It decides whose ordinance applies, whose permit you need and who hears a variance request.",
      ],
    },
    {
      heading: "Town water and sewer",
      paragraphs: [
        "Inside town limits, water and sewer come from the town's own utility department, which bills trash and recycling with them — no well or septic design on an in-town lot. The town has been working through a state-agreed upgrade of its wastewater system, so ask the utility about tap fees and connection requirements for your lot when you apply.",
        "Outside the sewer area, the site needs a septic system and usually a well, and those start with the DeKalb County Health Department in Auburn. Size the system to the bedroom count of the floor plan you choose.",
      ],
    },
    {
      heading: "Living next to a main line",
      paragraphs: [
        "Waterloo sits on Norfolk Southern's former Lake Shore main line, and Amtrak's Lake Shore Limited stops at the town's station. Freight traffic runs around the clock. If you are looking at lots near the tracks, visit at night and on a weekday before you commit, and think about which way the bedrooms face — a split-bedroom plan lets you put the primary suite at the quiet end.",
        "Rail crossings matter on delivery day too. Each section is a wide, long load on an oversize permit, and the carrier plans its route around crossings and turns. Tell us which road your lot is on and we will look at the approach when we quote.",
      ],
    },
  ],
  nearbyTowns: ["Auburn", "Butler", "Corunna", "Ashley", "St. Joe"],
  contacts: [
    {
      name: "Town of Waterloo — Plan Commission and Zoning Administrator",
      role: "Improvement Location Permit, zoning inside town and within the town's extraterritorial area.",
      href: "https://waterlooin.gov/plan-commission/",
    },
    {
      name: "Town of Waterloo — Board of Zoning Appeals",
      role: "Variances and special exceptions under the town's zoning.",
      href: "https://waterlooin.gov/board-of-zoning-appeals/",
    },
    {
      name: "Town of Waterloo Utilities",
      role: "Water and sewer connections and fees for in-town lots.",
      href: "https://waterlooin.gov/how-do-i/",
    },
    {
      name: "DeKalb County Health Department",
      role: "Septic and well questions for parcels outside the town's sewer and water.",
    },
  ],
  faqs: [
    {
      question: "Who issues the permit for a manufactured home in Waterloo?",
      answer:
        "The town's Zoning Administrator issues the Improvement Location Permit, after the Street, Water and Sewer departments have reviewed it. A site plan is required. Any building permit follows once the location permit is approved.",
    },
    {
      question: "My land is just outside Waterloo — whose zoning applies?",
      answer:
        "Possibly the town's. Waterloo and DeKalb County agreed in 2017 on a mapped area around the town where the town handles zoning. Ask the town whether your parcel is inside it before you buy.",
    },
    {
      question: "Is a lot near the railroad in Waterloo a problem?",
      answer:
        "It is a lifestyle question more than a permit one: Norfolk Southern freight and Amtrak use the line through town. Visit at different times of day, and choose a layout that puts the bedrooms away from the tracks.",
    },
    {
      question: "Which schools serve Waterloo?",
      answer:
        "DeKalb County Central United School District, which runs Waterloo Elementary, DeKalb Middle School and DeKalb High School. Confirm the attendance area for your exact address with the district.",
    },
  ],
};

export const metadata = generateLocationMetadata({
  city: locationData.city,
  state: locationData.state,
  description:
    "Placing a Champion home in Waterloo, IN: the town's location permit, its zoning area outside town limits, town water and sewer, and lots near the rail line.",
});

export default function WaterlooPage() {
  return <LocationPageTemplate {...locationData} />;
}
