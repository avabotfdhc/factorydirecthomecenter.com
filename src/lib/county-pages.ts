// Programmatic county pages (/locations/[slug]). Each entry renders the same
// template; add a county here and it is live, in the sitemap and in the
// locations index. Static folders under src/app/locations/ take precedence
// over this route for the same slug.

export interface CountyPage {
  slug: string;
  county: string;          // "Allen County"
  state: "Indiana";
  eyebrow: string;         // hero kicker
  intro: string;
  towns: string[];         // communities we deliver to
  /**
   * The county's main town, named in the title and H1 so the page answers
   * "manufactured homes {town}". Only for counties whose main town has no
   * location page of its own (Fort Wayne, Auburn, Kendallville and Angola do),
   * so two pages never compete for the same town.
   */
  seat?: string;
  /** Only from the vetted table in src/app/locations/page.tsx — omit rather than guess. */
  milesFromAuburn?: string; // "about 25 miles"
  driveNote: string;
  points: string[];        // why-this-county bullets
  zoningNote: string;      // honest, non-legal guidance
  milesFromTopeka?: string; // delivery distance from Champion's Topeka plant; omit unless vetted
  frostDepth: string;      // foundation frost-line guidance
  /** The county's local blog posts — every post should link back to its county page. */
  relatedPosts?: { href: string; label: string }[];
  /** County-specific questions; rendered with FAQPage schema. */
  faqs?: { question: string; answer: string }[];
}

// Shared wording for counties outside the vetted distance table: no mileage is
// published for them, so the page says how freight is priced instead.
const PER_ROUTE =
  "We deliver across Indiana, with freight quoted per route — it is its own line on your quote, never folded into the home price.";
const FOOTINGS =
  "Footings and piers go below the frost depth the county building department sets; ask for the figure when you apply for the permit. Champion's set-up drawing gives the pier layout, and the foundation contractor you hire builds to both, so plan the concrete before the home ships.";

export const countyPages: CountyPage[] = [
  {
    slug: "allen-county",
    county: "Allen County",
    state: "Indiana",
    eyebrow: "Fort Wayne Metro",
    intro:
      "Allen County is Indiana's second-largest county and our busiest delivery area outside DeKalb. From rural acreage north of Fort Wayne to lots in New Haven, Huntertown and Leo-Cedarville, we deliver Champion homes with factory-direct pricing and line-item transparency.",
    towns: ["Fort Wayne", "New Haven", "Huntertown", "Leo-Cedarville", "Woodburn", "Monroeville", "Grabill", "Harlan"],
    milesFromAuburn: "about 25 miles",
    driveNote: "Our Auburn lot is a 25-minute drive up I-69 from Fort Wayne, and the Champion plant in Topeka is under an hour from most Allen County sites.",
    points: [
      "Rural and suburban lots across the county's unincorporated areas",
      "Short freight run from the Topeka factory keeps delivery costs down",
      "Chattel, land-home and FHA Title I lenders active throughout the Fort Wayne market",
      "Modular (IRC) homes available where a site calls for a stick-built appraisal",
    ],
    milesFromTopeka: "about 45 miles",
    frostDepth:
      "Allen County footings go below the local frost line, generally 36 inches. Piers and perimeter foundations for a HUD-code home, and the full foundation for a modular, are inspected to that depth, so plan the concrete before the home ships.",
    zoningNote:
      "Allen County's Department of Planning Services handles zoning and building permits for unincorporated areas; Fort Wayne, New Haven and the towns have their own offices. Manufactured homes are allowed on many residential and agricultural lots outside city limits, often with foundation and skirting standards. Confirm your parcel's zoning with them before you commit to a home — we can tell you which office to call.",
  },
  {
    slug: "dekalb-county",
    county: "DeKalb County",
    state: "Indiana",
    eyebrow: "Our Home County",
    intro:
      "DeKalb County is home. Our lot sits on State Road 8 in Auburn, so every home we deliver in the county is a short local run: Garrett, Butler, Waterloo, St. Joe and the rural townships between them.",
    towns: ["Auburn", "Garrett", "Butler", "Waterloo", "St. Joe", "Ashley", "Corunna", "Spencerville"],
    milesFromAuburn: "0 to 12 miles",
    driveNote: "Stop by the Auburn lot any weekday, walk the homes, and we can be at your parcel the same afternoon.",
    points: [
      "Local delivery: the lowest freight and set-up cost of any county we serve",
      "We know the county's permit office, inspectors and site contractors by name",
      "Rural lots with wells and septic are the norm, and our referral list covers both",
      "Same factory-direct pricing whether the home goes on a farm or a town lot",
    ],
    milesFromTopeka: "about 30 miles",
    frostDepth:
      "DeKalb County uses a 36-inch frost depth for footings and piers. Champion's set-up drawing specifies the pier layout; your foundation contractor works from it so the home lands on cured concrete.",
    zoningNote:
      "DeKalb County Planning & Building in Auburn issues permits for the unincorporated county; Auburn, Garrett and Butler permit within their city limits. Most residential and agricultural districts allow HUD-code manufactured homes on a permanent foundation. Bring us the parcel number and we'll confirm before you order.",
  },
  {
    slug: "noble-county",
    county: "Noble County",
    state: "Indiana",
    eyebrow: "Rural Indiana",
    intro:
      "Noble County welcomes manufactured homes. From Kendallville to Ligonier, rural lots to small-town settings, we deliver Champion homes with factory-direct pricing and line-item transparency.",
    towns: ["Kendallville", "Ligonier", "Albion", "Rome City", "Avilla", "Cromwell", "Wolcottville"],
    milesFromAuburn: "about 20 to 35 miles",
    driveNote: "Noble County sits between our Auburn lot and the Champion plant in Topeka, so your home travels one of the shortest routes we run.",
    points: [
      "Manufactured homes permitted on most rural residential lots",
      "Lake-area and farm parcels alike: we've set homes on both",
      "Closest county to the Topeka factory after LaGrange",
      "Affordable land compared with the Fort Wayne metro",
    ],
    milesFromTopeka: "about 15 miles",
    frostDepth:
      "Noble County footings are set below the 36-inch frost line; lake-area lots often need engineered fill or deeper piers, which the county inspector will call out at permit.",
    zoningNote:
      "The Noble County Plan Commission in Albion issues permits for unincorporated areas; Kendallville and Ligonier permit within their limits. Most agricultural and residential districts allow manufactured homes on a permanent foundation. We'll pull your parcel's zoning before you order.",
  },
  {
    slug: "steuben-county",
    county: "Steuben County",
    state: "Indiana",
    eyebrow: "Lakes Country",
    intro:
      "Steuben County's 101 lakes draw year-round and seasonal buyers alike, and a factory-built home is the fastest way onto a lake lot or a rural parcel near Angola or Fremont. We deliver Champion homes from the Topeka plant with factory-direct pricing.",
    towns: ["Angola", "Fremont", "Hamilton", "Orland", "Ashley", "Hudson", "Clear Lake"],
    milesFromAuburn: "about 25 miles",
    driveNote: "Auburn to Angola is a straight run up I-69, and the Topeka plant is about an hour west, so delivery and set-up crews are local to the job.",
    points: [
      "Lake and rural lots throughout the county",
      "Popular with seasonal owners replacing an older cottage",
      "Short haul from the Topeka factory keeps freight low",
      "Modular (IRC) homes for lake associations that require them",
    ],
    milesFromTopeka: "about 40 miles",
    frostDepth:
      "Steuben County footings go 36 inches below grade, and many lake lots also need flood-elevation and setback checks. Confirm both with the county before ordering; we'll help you read the plat.",
    zoningNote:
      "The Steuben County Plan Commission in Angola issues permits for the unincorporated county; Angola and Fremont permit within their limits. Manufactured homes are allowed in most residential and agricultural districts on a permanent foundation. Some lake associations have covenants beyond zoning, so we check those too.",
  },
  {
    slug: "kosciusko-county",
    seat: "Warsaw",
    county: "Kosciusko County",
    state: "Indiana",
    eyebrow: "Warsaw & the Lakes",
    intro:
      "Kosciusko County mixes Warsaw's year-round neighbourhoods with lake country around Wawasee, Syracuse and North Webster. We order Champion HUD-code manufactured homes for buyers here, quote each one line by line from our Auburn showroom, and arrange delivery to the lot.",
    towns: ["Warsaw", "Winona Lake", "Syracuse", "North Webster", "Pierceton", "Milford", "Mentone", "Leesburg"],
    driveNote:
      "Lake Wawasee is the largest natural lake wholly inside Indiana, and lots near it and the county's other lakes come with tighter setbacks and narrower lanes than a farm parcel. Walk your plan through the county before you choose a home size. " + PER_ROUTE,
    points: [
      "Lake lots and in-town Warsaw lots call for very different home sizes — pick the lot first",
      "Single-section homes fit narrow lake parcels that a double-wide cannot",
      "Year-round buyers working in Warsaw's orthopedic industry, and seasonal owners replacing a cottage",
      "Every home quoted line by line, with freight on its own row",
    ],
    zoningNote:
      "The Kosciusko County Area Plan Commission in Warsaw handles zoning and permits outside the incorporated towns; Warsaw, Winona Lake, Syracuse and the other towns permit inside their limits. Lake associations can carry covenants that go further than zoning. Confirm your parcel with the office and read any covenants before you order — we can tell you which office to call.",
    frostDepth: FOOTINGS,
    relatedPosts: [
      { href: "/blog/manufactured-homes-warsaw-indiana", label: "Manufactured homes in Warsaw: new or used — what to weigh" },
    ],
    faqs: [
      {
        question: "Can I put a manufactured home on a lake lot in Kosciusko County?",
        answer:
          "Often, but lake lots are where setbacks, septic placement and association covenants bite hardest. Get the lot's survey and the covenants first, then choose a home that fits them — a single-section plan solves many narrow-lot problems.",
      },
      {
        question: "Should I buy a new or a used manufactured home near Warsaw?",
        answer:
          "Our Warsaw post walks through it: a new HUD-code home comes with Champion's warranty, current energy standards and a known history. Read it before you shop the used market.",
      },
      {
        question: "Do you deliver to Kosciusko County?",
        answer: "Yes. We deliver across Indiana, and freight is quoted per route as its own line on your estimate.",
      },
    ],
  },
  {
    slug: "huntington-county",
    seat: "Huntington",
    county: "Huntington County",
    state: "Indiana",
    eyebrow: "Huntington, Roanoke & Andrews",
    intro:
      "Huntington County runs from Roanoke on the edge of the Fort Wayne area to farm country around Warren and Andrews, with the Salamonie and J. Edward Roush reservoirs in between. We order Champion HUD-code manufactured homes for buyers here and quote each one line by line.",
    towns: ["Huntington", "Roanoke", "Andrews", "Warren", "Markle", "Mount Etna"],
    driveNote:
      "Many Huntington County buyers commute toward Fort Wayne and want a busy-household layout — a mudroom-style entry, a second bath, room for pets. Bring your list to the Auburn showroom and walk plans against it. " + PER_ROUTE,
    points: [
      "Commuter lots near Roanoke and rural acreage near Warren and Andrews",
      "Plans with a back-door entry, utility room and second bath for busy families",
      "Champion's HUD-code homes are built for Indiana's wind and snow loads",
      "Line-item quote: the home, the options and the freight on separate lines",
    ],
    zoningNote:
      "Huntington County's planning office in Huntington handles the unincorporated county, and the city and towns permit inside their own limits. Most agricultural and rural residential districts allow a HUD-code home with the right foundation and skirting. Confirm your parcel's zoning with the office before you order — we can tell you which one answers for your address.",
    frostDepth: FOOTINGS,
    relatedPosts: [
      { href: "/blog/manufactured-homes-huntington-indiana", label: "Manufactured homes in Huntington: planning for pets and a busy household" },
    ],
    faqs: [
      {
        question: "Which floor plans suit a busy household in Huntington County?",
        answer:
          "Look for a separate entry with a utility room beside it, a second full bath, and bedrooms split from the main living space. Our Huntington post covers the layout features that matter most with kids and pets.",
      },
      {
        question: "Are manufactured homes allowed outside Huntington city limits?",
        answer:
          "In many rural and agricultural districts, yes, usually with foundation and skirting standards. The county planning office gives the answer for your specific parcel.",
      },
      {
        question: "Do you deliver to Huntington County?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route.",
      },
    ],
  },
  {
    slug: "elkhart-county",
    seat: "Goshen",
    county: "Elkhart County",
    state: "Indiana",
    eyebrow: "Goshen, Elkhart & Nappanee",
    intro:
      "Elkhart County builds more recreational vehicles than anywhere else in the country, so buyers here know factory building well — and often ask how a HUD-code home differs from an RV or a park model. We order Champion HUD-code manufactured homes for buyers in Goshen, Elkhart, Nappanee, Middlebury and the farm country between them.",
    towns: ["Goshen", "Elkhart", "Nappanee", "Middlebury", "Bristol", "Millersburg", "Wakarusa"],
    driveNote:
      "A HUD-code home is a permanent residence built to the federal manufactured housing code, not a vehicle — it is titled, financed, insured and zoned differently from an RV. Our Goshen post explains the difference before you shop. " + PER_ROUTE,
    points: [
      "Year-round homes, not seasonal units: built to the HUD code and anchored on a foundation",
      "Rural parcels around Middlebury and Millersburg and town lots in Goshen and Nappanee",
      "Single-section and multi-section Champion plans for different lot sizes",
      "Every quote itemised, freight included as its own line",
    ],
    zoningNote:
      "Elkhart County Planning and Development in Goshen handles zoning outside the cities and towns; Goshen, Elkhart and Nappanee each permit inside their limits. Rules for a HUD-code home differ from the rules for an RV or a park model, so ask about the home type specifically. Confirm your parcel with the right office before you order — we can tell you which one that is.",
    frostDepth: FOOTINGS,
    relatedPosts: [
      { href: "/blog/manufactured-homes-goshen-indiana", label: "Manufactured homes in Goshen: how a HUD-code home differs from an RV or park model" },
    ],
    faqs: [
      {
        question: "Is a manufactured home the same as an RV or a park model?",
        answer:
          "No. A manufactured home is built to the federal HUD code as a permanent dwelling; RVs and most park models are built to different standards for recreational or seasonal use. That difference changes zoning, titling, insurance and financing.",
      },
      {
        question: "Can I place a manufactured home in rural Elkhart County?",
        answer:
          "Many agricultural and rural residential districts allow one with the right foundation and skirting. Confirm your parcel with Elkhart County Planning and Development, or the city or town office if you are inside limits.",
      },
      {
        question: "Do you deliver to Elkhart County?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route.",
      },
    ],
  },
  {
    slug: "wabash-county",
    seat: "Wabash",
    county: "Wabash County",
    state: "Indiana",
    eyebrow: "Wabash & North Manchester",
    intro:
      "Wabash County centres on the city of Wabash and the college town of North Manchester, with small towns and farm ground along the Wabash and Eel rivers. We order Champion HUD-code manufactured homes for buyers here and quote each one line by line.",
    towns: ["Wabash", "North Manchester", "Lagro", "LaFontaine", "Roann", "Urbana"],
    driveNote:
      "Smaller lots in Wabash and North Manchester reward a plan that lives larger than its footprint — an open kitchen and living area, vaulted ceilings, and windows on more than one wall. Our Wabash post covers how to choose one. " + PER_ROUTE,
    points: [
      "Open-plan single-section homes for town lots",
      "Multi-section homes for farm parcels with room to spread out",
      "Options like vaulted ceilings and extra windows chosen at order",
      "Freight on its own line, never folded into the home price",
    ],
    zoningNote:
      "Wabash County's planning office handles the unincorporated county, and the city of Wabash and the towns permit inside their limits. Many rural districts allow a HUD-code home on a permanent foundation with skirting. Confirm your parcel with the right office before you order — we can tell you which one answers for your address.",
    frostDepth: FOOTINGS,
    relatedPosts: [
      { href: "/blog/manufactured-homes-wabash-indiana", label: "Manufactured homes in Wabash: making a smaller home feel bigger" },
    ],
    faqs: [
      {
        question: "How do I make a single-section home feel bigger?",
        answer:
          "Choose an open kitchen and living area, raise the ceiling where the plan allows, add windows, and keep storage built in. Our Wabash post goes through each choice.",
      },
      {
        question: "Can a manufactured home go on a town lot in North Manchester or Wabash?",
        answer:
          "That is a question for the town or city office, since each permits inside its own limits. Ask about lot size, setbacks and foundation rules before you choose a home width.",
      },
      {
        question: "Do you deliver to Wabash County?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route.",
      },
    ],
  },
  {
    slug: "jay-county",
    seat: "Portland",
    county: "Jay County",
    state: "Indiana",
    eyebrow: "Portland & the Ohio Line",
    intro:
      "Jay County sits on the Ohio line, with Portland at its centre and Dunkirk, Redkey and Pennville around it. Many buyers here are moving from renting to owning. We order Champion HUD-code manufactured homes for them and quote every line so the numbers are clear from the start.",
    towns: ["Portland", "Dunkirk", "Redkey", "Pennville", "Bryant", "Salamonia"],
    driveNote:
      "Moving from a rental means planning more than a monthly payment: land or a lot, the site work you will contract, utilities, insurance and taxes. Our Portland post walks through the steps in order. " + PER_ROUTE,
    points: [
      "First-time owners moving from a rental",
      "Farm parcels and small-town lots across the county",
      "A line-item quote that shows the home, options and freight separately",
      "A lender list of companies past customers have used, if you need one — you choose your own lender",
    ],
    zoningNote:
      "Jay County's planning office in Portland handles the unincorporated county, and Portland, Dunkirk and the towns permit inside their limits. Many rural districts allow a HUD-code home on a permanent foundation with skirting. Confirm your parcel with the right office before you order — we can tell you which one answers for your address.",
    frostDepth: FOOTINGS,
    relatedPosts: [
      { href: "/blog/manufactured-homes-portland-indiana", label: "Manufactured homes in Portland: moving from renting to owning" },
    ],
    faqs: [
      {
        question: "What should a renter plan for before buying a manufactured home?",
        answer:
          "Where the home will sit, the site work you will hire out, utilities, insurance and property taxes, alongside the home itself. Our Portland post lays out the order to work through them.",
      },
      {
        question: "Do you arrange financing?",
        answer:
          "No. You choose your own lender. We can hand you a list of lenders our past customers have used; we recommend none of them and we do not pull credit.",
      },
      {
        question: "Do you deliver to Jay County?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route.",
      },
    ],
  },
  {
    slug: "grant-county",
    seat: "Marion",
    county: "Grant County",
    state: "Indiana",
    eyebrow: "Marion, Gas City & Upland",
    intro:
      "Grant County stretches along I-69 from Marion and Gas City to Fairmount, Upland and Jonesboro. We order Champion HUD-code manufactured homes for buyers here and quote each one line by line from our Auburn showroom.",
    towns: ["Marion", "Gas City", "Jonesboro", "Fairmount", "Upland", "Swayzee", "Van Buren"],
    driveNote:
      "The drive to Auburn is worth one well-planned trip. Shortlist plans online, bring your lot details and must-haves, and walk the homes on display with a list — our Marion post explains how to make one visit count. " + PER_ROUTE,
    points: [
      "Shortlist floor plans online before the drive",
      "Showroom open Monday–Friday 9–5 and Saturday 10–4",
      "Town lots in Marion and Gas City and rural parcels across the county",
      "A written line-item quote to take home and compare",
    ],
    zoningNote:
      "Grant County's area plan office handles the unincorporated county, and Marion, Gas City and the towns permit inside their limits. Many rural districts allow a HUD-code home on a permanent foundation with skirting. Confirm your parcel with the right office before you order — we can tell you which one answers for your address.",
    frostDepth: FOOTINGS,
    relatedPosts: [
      { href: "/blog/manufactured-homes-marion-indiana", label: "Manufactured homes in Marion: making one showroom visit count" },
    ],
    faqs: [
      {
        question: "What should I bring to the showroom from Grant County?",
        answer:
          "Your parcel details or lot survey, a shortlist of plans, your must-have rooms, and questions about options. Our Marion post has the full checklist.",
      },
      {
        question: "When is the Auburn showroom open?",
        answer: "Monday to Friday 9 to 5 and Saturday 10 to 4, at 1211 State Road 8, Auburn.",
      },
      {
        question: "Do you deliver to Grant County?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route.",
      },
    ],
  },
  {
    slug: "blackford-county",
    seat: "Hartford City",
    county: "Blackford County",
    state: "Indiana",
    eyebrow: "Hartford City & Montpelier",
    intro:
      "Blackford County is one of Indiana's smallest counties, with Hartford City and Montpelier at its heart and farm ground all around. We order Champion HUD-code manufactured homes for buyers here and quote each one line by line.",
    towns: ["Hartford City", "Montpelier", "Shamrock Lakes", "Roll"],
    driveNote:
      "If you have only ever bought or built a stick-built house, a HUD-code home follows a different order: choose the plan, order it, prepare the site while it is built, then delivery and set-up by the crews you hire. Our Hartford City post compares the two step by step. " + PER_ROUTE,
    points: [
      "A factory build that runs while your site is being prepared",
      "Federal HUD-code construction and inspection, not a local framing inspection",
      "Farm parcels and town lots in Hartford City and Montpelier",
      "Line-item quote with freight as its own line",
    ],
    zoningNote:
      "Blackford County's planning office in Hartford City handles the unincorporated county, and Hartford City and Montpelier permit inside their limits. Many rural districts allow a HUD-code home on a permanent foundation with skirting. Confirm your parcel with the right office before you order — we can tell you which one answers for your address.",
    frostDepth: FOOTINGS,
    relatedPosts: [
      { href: "/blog/manufactured-homes-hartford-city-indiana", label: "Manufactured homes in Hartford City: how the process differs from stick-built" },
    ],
    faqs: [
      {
        question: "How is buying a manufactured home different from building a house?",
        answer:
          "The home is built in Champion's plant to the federal HUD code while your contractors prepare the site, then it is delivered and set. Our Hartford City post compares each step.",
      },
      {
        question: "Who does the site work and set-up?",
        answer:
          "You hire your own licensed contractors for site work, the foundation and set-up. We sell the home and arrange its delivery.",
      },
      {
        question: "Do you deliver to Blackford County?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route.",
      },
    ],
  },
  {
    slug: "miami-county",
    seat: "Peru",
    county: "Miami County",
    state: "Indiana",
    eyebrow: "Peru, Bunker Hill & Converse",
    intro:
      "Miami County runs along US-31 from Peru to Bunker Hill and Grissom Air Reserve Base, with Converse, Denver and Macy in the farm country around them. We order Champion HUD-code manufactured homes for buyers here and quote each one line by line.",
    towns: ["Peru", "Bunker Hill", "Converse", "Denver", "Macy", "Amboy"],
    driveNote:
      "Skirting is the part of a manufactured home people see first and think about last. Vinyl, insulated panels and masonry each behave differently through a northern Indiana winter — our Peru post compares them. " + PER_ROUTE,
    points: [
      "Skirting choices that suit open, windy farm ground",
      "Rural parcels and town lots around Peru",
      "Champion homes built for Indiana's wind and snow loads",
      "Every line itemised, including freight",
    ],
    zoningNote:
      "Miami County's planning office in Peru handles the unincorporated county, and Peru and the towns permit inside their limits. Many districts require skirting or a perimeter enclosure on a manufactured home, so ask what material they accept. Confirm your parcel with the right office before you order — we can tell you which one answers for your address.",
    frostDepth: FOOTINGS,
    relatedPosts: [
      { href: "/blog/manufactured-homes-peru-indiana", label: "Manufactured homes in Peru: choosing and caring for skirting" },
    ],
    faqs: [
      {
        question: "What kind of skirting works best in Miami County?",
        answer:
          "It depends on exposure and budget. Vinyl is common, insulated panels help with cold floors, and masonry lasts longest. Every option needs ventilation and an access panel. Our Peru post covers the trade-offs.",
      },
      {
        question: "Does the county require skirting?",
        answer:
          "Many Indiana jurisdictions do. Ask the planning office in Peru, or your town office, what they require for your parcel.",
      },
      {
        question: "Do you deliver to Miami County?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route.",
      },
    ],
  },
  {
    slug: "marshall-county",
    seat: "Plymouth",
    county: "Marshall County",
    state: "Indiana",
    eyebrow: "Plymouth, Bremen & Culver",
    intro:
      "Marshall County centres on Plymouth, where US-30 crosses US-31, and takes in Bremen, Argos, Bourbon and Culver on Lake Maxinkuckee. We order Champion HUD-code manufactured homes for buyers here and quote each one line by line.",
    towns: ["Plymouth", "Bremen", "Culver", "Argos", "Bourbon", "La Paz"],
    driveNote:
      "Subdivisions and lake neighbourhoods here often have covenants on roof pitch, siding, garages and porches. Read them before you choose the home's exterior — our Plymouth post explains which choices to settle at order. " + PER_ROUTE,
    points: [
      "Exterior options — siding, roof pitch, porches — chosen to suit covenants",
      "Lake lots near Culver and rural parcels around Argos and Bourbon",
      "Single-section and multi-section Champion plans",
      "A line-item quote that shows each option separately",
    ],
    zoningNote:
      "The Marshall County Plan Commission in Plymouth handles the unincorporated county, and Plymouth, Bremen, Culver and the towns permit inside their limits. Subdivision covenants can go further than zoning. Confirm your parcel with the right office and read any covenants before you order — we can tell you which office to call.",
    frostDepth: FOOTINGS,
    relatedPosts: [
      { href: "/blog/manufactured-homes-plymouth-indiana", label: "Manufactured homes in Plymouth: exterior choices and neighbourhood rules" },
    ],
    faqs: [
      {
        question: "Can covenants limit which manufactured home I put on my lot?",
        answer:
          "Yes. Covenants can set roof pitch, siding, a minimum size or a garage. Read them before you choose the plan and exterior options. Our Plymouth post covers the common ones.",
      },
      {
        question: "Can I put a manufactured home near Lake Maxinkuckee?",
        answer:
          "Check with Culver or the county plan commission, depending on where the lot is, and read any association rules before you order.",
      },
      {
        question: "Do you deliver to Marshall County?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route.",
      },
    ],
  },
  {
    slug: "fulton-county",
    seat: "Rochester",
    county: "Fulton County",
    state: "Indiana",
    eyebrow: "Rochester & Lake Manitou",
    intro:
      "Fulton County centres on Rochester and Lake Manitou, with Akron, Fulton and Kewanna in the farm country around them. Many buyers here are buying land and a home together. We order Champion HUD-code manufactured homes for them and quote each one line by line.",
    towns: ["Rochester", "Akron", "Fulton", "Kewanna", "Leiters Ford"],
    driveNote:
      "Before you close on a parcel, settle zoning, road access for a delivery truck, the well and septic, utilities and any floodplain on it. Our Rochester post lists what to check and in what order. " + PER_ROUTE,
    points: [
      "Land checks to finish before you close",
      "Farm parcels and lots near Lake Manitou",
      "Champion plans for single-section and multi-section sites",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "Fulton County's planning office in Rochester handles the unincorporated county, and Rochester and the towns permit inside their limits. Many rural districts allow a HUD-code home on a permanent foundation with skirting. Confirm your parcel with the right office before you close — we can tell you which one answers for your address.",
    frostDepth: FOOTINGS,
    relatedPosts: [
      { href: "/blog/manufactured-homes-rochester-indiana", label: "Manufactured homes in Rochester: what to check before you close on land" },
    ],
    faqs: [
      {
        question: "What should I check before buying land in Fulton County?",
        answer:
          "Zoning for a manufactured home, road access for delivery, well and septic feasibility, utility hook-ups, and any floodplain on the parcel. Our Rochester post walks through each one.",
      },
      {
        question: "Can I put a manufactured home on farm ground?",
        answer:
          "Often, depending on the district. Confirm with the county planning office in Rochester before you close.",
      },
      {
        question: "Do you deliver to Fulton County?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route.",
      },
    ],
  },
];

/** "<slug>-in" aliases (allen-county-in …) resolve to the canonical county slug. */
export function canonicalCountySlug(slug: string): string {
  return slug.replace(/-in$/, "");
}

export function getCountyPage(slug: string): CountyPage | undefined {
  const canonical = canonicalCountySlug(slug);
  return countyPages.find((c) => c.slug === canonical);
}
