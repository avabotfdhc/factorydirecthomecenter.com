import { LocationPageTemplate } from "../LocationPageTemplate";
import { generateLocationMetadata } from "../locationMetadata";

// Facts checked against public sources on 2026-10-23: cityofbutler.in.gov
// (about, utilities, plan commission, ordinances), the city's permits page
// (ILP; building permits contracted to the DeKalb County Building Department),
// Census 2020 and DeKalb County Eastern Community Schools. "About 6 miles west
// of the Ohio state line" is the city's own wording. Distance from the showroom
// is from the vetted table in ../page.tsx. Rural electric service around the
// city could not be confirmed and is deliberately not named.
const locationData = {
  city: "Butler",
  state: "Indiana",
  stateAbbr: "IN",
  distance: "12 miles",
  description:
    "Butler sits on US 6 near the Ohio line, and inside the city a manufactured home needs a city location permit before the county inspector ever sees it. Here is how placing a Champion home in Butler works.",
  counties: ["DeKalb"],
  facts: [
    { label: "Status", value: "City, Wilmington Township" },
    { label: "Location permit", value: "City of Butler" },
    { label: "Building permits and inspections", value: "DeKalb County Building Dept." },
    { label: "City utilities", value: "Water, sewer, stormwater, trash" },
  ],
  localSections: [
    {
      heading: "Two permits, two offices",
      paragraphs: [
        "Butler is a city of about 2,600 people in the northeast corner of DeKalb County, about six miles west of the Ohio state line. Inside city limits a new home starts with an Improvement Location Permit from the city — manufactured and mobile homes are named on the city's own list of structures that need one. The city does not run its own building inspections; it contracts with the DeKalb County Building Department to issue building permits and inspect the work.",
        "So the order is: city location permit first, then the county building permit and inspections. If your land is outside city limits, the county handles zoning as well, and the city is not involved. Find out which side of the line the parcel is on before anything else.",
      ],
    },
    {
      heading: "Where a manufactured home can go in town",
      paragraphs: [
        "Butler's zoning has a land-use table that says which kinds of homes each district allows. A 2021 amendment to it keeps manufactured homes off the parcels along North and South Broadway and East and West Main — the downtown frontage. Side streets and the districts around them are governed by their own rows of the table, so ask the city for the current version and the district your lot is in.",
        "If the rules for a lot point you toward a home on a permanent foundation, that is a question of the foundation and the paperwork, not only of the house: many of our floor plans are built in both a HUD-code and a modular version from the same box size. Our guide to the difference explains what changes on site.",
      ],
    },
    {
      heading: "City water and sewer, private power and gas",
      paragraphs: [
        "On a city lot you connect to Butler's own water and sewer — the city also runs stormwater and trash collection — so there is no well or septic system to design, and the tap and connection fees come from the city. Electricity inside the city comes from American Electric Power and natural gas from NIPSCO, not from the city.",
        "Out in the townships around Butler the picture changes: most rural parcels need a well and a septic system, which means a soil evaluation and a permit from the DeKalb County Health Department before the home is set. Ask the electric provider for the parcel about the cost of running service to the building site, especially on a long lane.",
      ],
    },
    {
      heading: "Schools and getting the home there",
      paragraphs: [
        "Butler is in DeKalb County Eastern Community Schools, which runs Butler Elementary, Riverdale Elementary and Eastside Junior-Senior High. If a school matters to you, confirm the attendance area for the exact address before you buy land, because rural district lines do not follow township lines.",
        "US 6 runs straight through the middle of town — Butler is the last Indiana community before the highway crosses into Ohio — and State Road 1 meets it at the city's center. Each section of the home travels on an oversize permit, so the route matters most in the last mile: tell us about tight corners, mature trees over the street or overhead wires on your block when we quote.",
      ],
    },
  ],
  nearbyTowns: ["Auburn", "Waterloo", "Garrett", "St. Joe", "Spencerville"],
  contacts: [
    {
      name: "City of Butler — Building, Planning and Development",
      role: "Improvement Location Permit, plan commission and board of zoning appeals inside city limits.",
      href: "https://cityofbutler.in.gov/forms-permits/",
    },
    {
      name: "DeKalb County Building Department",
      role: "Building permits and inspections — for Butler under contract with the city, and for the county.",
    },
    {
      name: "City of Butler Utilities",
      role: "Water, sewer, stormwater and trash connections for city lots.",
      href: "https://cityofbutler.in.gov/departments/utilities/",
    },
    {
      name: "DeKalb County Health Department",
      role: "Septic and well questions for parcels outside the city's sewer and water.",
    },
  ],
  faqs: [
    {
      question: "Do I need a city permit to put a manufactured home in Butler?",
      answer:
        "Yes. Inside city limits a manufactured home needs an Improvement Location Permit from the City of Butler. The building permit and inspections are then handled by the DeKalb County Building Department, which the city contracts with.",
    },
    {
      question: "Can a manufactured home go on Broadway or Main Street in Butler?",
      answer:
        "Under a 2021 amendment to the city's zoning land-use table, manufactured homes are not permitted on parcels along North and South Broadway and East and West Main. Ask the city which rules apply to the district your lot is in.",
    },
    {
      question: "Who provides utilities to a home in Butler?",
      answer:
        "The city runs water, sewer, stormwater and trash service. Electricity in the city comes from American Electric Power and natural gas from NIPSCO. Rural parcels outside the city usually need their own well and septic system.",
    },
    {
      question: "How far is Butler from your showroom?",
      answer:
        "About 12 miles from our Auburn lot, where you can walk through Champion model homes before you choose. Freight to Butler is quoted as its own line on your quote.",
    },
  ],
};

export const metadata = generateLocationMetadata({
  city: locationData.city,
  state: locationData.state,
  description:
    "Placing a Champion manufactured home in Butler, IN: the city location permit, county inspections, the Broadway and Main rule, and city water and sewer.",
});

export default function ButlerPage() {
  return <LocationPageTemplate {...locationData} />;
}
