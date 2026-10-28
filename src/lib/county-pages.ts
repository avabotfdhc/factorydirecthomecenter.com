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
  /**
   * Hand-written local sections built from public sources (named in a comment
   * on the entry). These are what make a county page worth its URL — pages that
   * differ only by place name are doorway pages under Google's spam policies.
   */
  sections?: { heading: string; paragraphs: string[] }[];
  /** "At a glance" rows — sourced facts only. */
  facts?: { label: string; value: string }[];
  /** Public offices the buyer deals with. We name who answers; we never answer for them. */
  contacts?: { name: string; role: string; href?: string }[];
  /** Page-specific meta description; the shared sentence is only a fallback. */
  metaDescription?: string;
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
      "Rural lots with wells and septic are the norm, and our contractor list covers both",
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
    faqs: [
      {
        question: "Which permits come first for a manufactured home in Kosciusko County?",
        answer:
          "Start with the septic: the Kosciusko County Health Department requires a permit for any new or repaired septic system or well. Outside the towns, the Kosciusko County Area Plan Commission in Warsaw issues the improvement location permit, and a lot in a mapped floodplain needs a flood development permit first. Inside Warsaw, the city's building department handles building permits. Your contractors pull these permits; we can tell you which office answers for your address.",
      },
      {
        question: "Can I put a manufactured home on a lake lot in Kosciusko County?",
        answer:
          "Often, but lake lots are where setbacks, septic placement and association covenants bite hardest. Get the lot's survey and the covenants first, then choose a home that fits them — a single-section plan solves many narrow-lot problems.",
      },
      {
        question: "Should I buy a new or a used manufactured home near Warsaw?",
        answer:
          "A new HUD-code home comes with Champion's warranty, current energy standards and a known history; a used one may not have any of those. Compare them on the same terms before you shop the used market.",
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
    faqs: [
      {
        question: "Which floor plans suit a busy household in Huntington County?",
        answer:
          "Look for a separate entry with a utility room beside it, a second full bath, and bedrooms split from the main living space.",
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
      "A HUD-code home is a permanent residence built to the federal manufactured housing code, not a vehicle — it is titled, financed, insured and zoned differently from an RV. " + PER_ROUTE,
    points: [
      "Year-round homes, not seasonal units: built to the HUD code and anchored on a foundation",
      "Rural parcels around Middlebury and Millersburg and town lots in Goshen and Nappanee",
      "Single-section and multi-section Champion plans for different lot sizes",
      "Every quote itemised, freight included as its own line",
    ],
    zoningNote:
      "Elkhart County Planning and Development in Goshen handles zoning outside the cities and towns; Goshen, Elkhart and Nappanee each permit inside their limits. Rules for a HUD-code home differ from the rules for an RV or a park model, so ask about the home type specifically. Confirm your parcel with the right office before you order — we can tell you which one that is.",
    frostDepth: FOOTINGS,
    faqs: [
      {
        question: "Which permits come first for a manufactured home in Elkhart County?",
        answer:
          "Septic permits come from the Elkhart County Health Department's environmental health division. Outside the cities, Elkhart County Planning and Development in Goshen handles zoning and building permits; inside Goshen, the city requires a zoning clearance before it issues building permits, and the City of Elkhart runs its own permit center. Your contractors pull these permits; we can tell you which office answers for your address.",
      },
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
      "Smaller lots in Wabash and North Manchester reward a plan that lives larger than its footprint — an open kitchen and living area, vaulted ceilings, and windows on more than one wall. " + PER_ROUTE,
    points: [
      "Open-plan single-section homes for town lots",
      "Multi-section homes for farm parcels with room to spread out",
      "Options like vaulted ceilings and extra windows chosen at order",
      "Freight on its own line, never folded into the home price",
    ],
    zoningNote:
      "Wabash County's planning office handles the unincorporated county, and the city of Wabash and the towns permit inside their limits. Many rural districts allow a HUD-code home on a permanent foundation with skirting. Confirm your parcel with the right office before you order — we can tell you which one answers for your address.",
    frostDepth: FOOTINGS,
    faqs: [
      {
        question: "How do I make a single-section home feel bigger?",
        answer:
          "Choose an open kitchen and living area, raise the ceiling where the plan allows, add windows, and keep storage built in.",
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
      "Moving from a rental means planning more than a monthly payment: land or a lot, the site work you will contract, utilities, insurance and taxes. " + PER_ROUTE,
    points: [
      "First-time owners moving from a rental",
      "Farm parcels and small-town lots across the county",
      "A line-item quote that shows the home, options and freight separately",
      "A lender list of companies past customers have used, if you need one — you choose your own lender",
    ],
    zoningNote:
      "Jay County's planning office in Portland handles the unincorporated county, and Portland, Dunkirk and the towns permit inside their limits. Many rural districts allow a HUD-code home on a permanent foundation with skirting. Confirm your parcel with the right office before you order — we can tell you which one answers for your address.",
    frostDepth: FOOTINGS,
    faqs: [
      {
        question: "What should a renter plan for before buying a manufactured home?",
        answer:
          "Where the home will sit, the site work you will hire out, utilities, insurance and property taxes, alongside the home itself.",
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
      "The drive to Auburn is worth one well-planned trip. Shortlist plans online, bring your lot details and must-haves, and walk the homes on display with a list so one trip answers your questions. " + PER_ROUTE,
    points: [
      "Shortlist floor plans online before the drive",
      "Showroom open Monday–Friday 9–5 and Saturday 10–4",
      "Town lots in Marion and Gas City and rural parcels across the county",
      "A written line-item quote to take home and compare",
    ],
    zoningNote:
      "Grant County's Area Plan Commission in Marion issues permits for the unincorporated county and for Fairmount, Jonesboro, Matthews, Sweetser, Upland and Van Buren; the cities of Marion and Gas City issue their own. Many rural districts allow a HUD-code home on a permanent foundation with skirting. Confirm your parcel with the right office before you order — we can tell you which one answers for your address.",
    frostDepth: FOOTINGS,
    faqs: [
      {
        question: "Which permits come first for a manufactured home in Grant County?",
        answer:
          "The septic comes first: the building department needs a letter from the Grant County Health Department's environmental division about the septic system before it issues a building permit. Outside Marion and Gas City, the Grant County Area Plan Commission issues the improvement location and building permits; inside Marion, the city planning department issues the improvement location permit and its building department the building permit. Your contractors pull these permits; we can tell you which office answers for your address.",
      },
      {
        question: "What should I bring to the showroom from Grant County?",
        answer:
          "Your parcel details or lot survey, a shortlist of plans, your must-have rooms, and questions about options.",
      },
      {
        question: "When is the Auburn showroom open?",
        answer: "Monday to Friday 9 to 5 and Saturday 10 to 4, at 1211 IN-8, Auburn.",
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
      "If you have only ever bought or built a stick-built house, a HUD-code home follows a different order: choose the plan, order it, prepare the site while it is built, then delivery and set-up by the crews you hire. " + PER_ROUTE,
    points: [
      "A factory build that runs while your site is being prepared",
      "Federal HUD-code construction and inspection, not a local framing inspection",
      "Farm parcels and town lots in Hartford City and Montpelier",
      "Line-item quote with freight as its own line",
    ],
    zoningNote:
      "Blackford County's planning office in Hartford City handles the unincorporated county, and Hartford City and Montpelier permit inside their limits. Many rural districts allow a HUD-code home on a permanent foundation with skirting. Confirm your parcel with the right office before you order — we can tell you which one answers for your address.",
    frostDepth: FOOTINGS,
    faqs: [
      {
        question: "How is buying a manufactured home different from building a house?",
        answer:
          "The home is built in Champion's plant to the federal HUD code while your contractors prepare the site, then it is delivered and set.",
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
      "Skirting is the part of a manufactured home people see first and think about last. Vinyl, insulated panels and masonry each behave differently through a northern Indiana winter, so choose with the climate in mind. " + PER_ROUTE,
    points: [
      "Skirting choices that suit open, windy farm ground",
      "Rural parcels and town lots around Peru",
      "Champion homes built for Indiana's wind and snow loads",
      "Every line itemised, including freight",
    ],
    zoningNote:
      "Miami County's planning office in Peru handles the unincorporated county, and Peru and the towns permit inside their limits. Many districts require skirting or a perimeter enclosure on a manufactured home, so ask what material they accept. Confirm your parcel with the right office before you order — we can tell you which one answers for your address.",
    frostDepth: FOOTINGS,
    faqs: [
      {
        question: "What kind of skirting works best in Miami County?",
        answer:
          "It depends on exposure and budget. Vinyl is common, insulated panels help with cold floors, and masonry lasts longest. Every option needs ventilation and an access panel.",
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
      "Subdivisions and lake neighbourhoods here often have covenants on roof pitch, siding, garages and porches. Read them before you choose the home's exterior — some exterior choices can only be made when the home is ordered. " + PER_ROUTE,
    points: [
      "Exterior options — siding, roof pitch, porches — chosen to suit covenants",
      "Lake lots near Culver and rural parcels around Argos and Bourbon",
      "Single-section and multi-section Champion plans",
      "A line-item quote that shows each option separately",
    ],
    zoningNote:
      "The Marshall County Plan Commission in Plymouth handles the unincorporated county, and Plymouth, Bremen, Culver and the towns permit inside their limits. Subdivision covenants can go further than zoning. Confirm your parcel with the right office and read any covenants before you order — we can tell you which office to call.",
    frostDepth: FOOTINGS,
    faqs: [
      {
        question: "How does the septic permit work in Marshall County?",
        answer:
          "The Marshall County Health Department's process starts with a soil evaluation by a registered soil scientist, then a scaled septic design submitted for review. Do it before you settle on the home size, because the soil result decides where the system goes and how much of the lot is left for the home. Your contractors pull the permits; we can tell you which office answers for your address.",
      },
      {
        question: "Can covenants limit which manufactured home I put on my lot?",
        answer:
          "Yes. Covenants can set roof pitch, siding, a minimum size or a garage. Read them before you choose the plan and exterior options.",
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
  // Sources checked 2026-10-23: the Rochester Sentinel legal notice and the
  // Purdue-hosted Fulton County Zone Ordinance (one ordinance for the county,
  // Rochester, Akron, Kewanna and Fulton; plan commission office address; BZA),
  // the Town of Fulton building code (interlocal inspections), the Fulton
  // County Health Department's links page and the state TRP list of approved
  // local septic ordinances, Rochester's wastewater FAQ, Fulton County REMC,
  // DNR's lake association directory (Lake Bruce and Nyona/South Mud Lake
  // conservancy districts; Lake Manitou Association), IDEM's Lake Manitou
  // TMDL, DNR floodway jurisdiction, the USDA Tippecanoe watershed sheet,
  // Census 2020 and INDOT town counts. Natural gas could not be confirmed.
  {
    slug: "fulton-county",
    seat: "Rochester",
    county: "Fulton County",
    state: "Indiana",
    eyebrow: "Rochester & Lake Manitou",
    intro:
      "Fulton County zones the county and all four of its towns under one ordinance, writes its own septic rules, and has lakes where the septic question matters most. Here is how placing a Champion home works around Rochester, Akron and Kewanna.",
    towns: ["Rochester", "Akron", "Fulton", "Kewanna", "Leiters Ford"],
    driveNote:
      "Most of the county drains to the Tippecanoe River, and much of the countryside is lake and river land with narrow roads to the water. Tell us about the approach to your lot when we quote. " + PER_ROUTE,
    points: [
      "One zoning ordinance for the county, Rochester, Akron, Kewanna and Fulton",
      "A county septic ordinance of its own",
      "Lake districts at Lake Bruce and Nyona/South Mud Lake",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "The Fulton County Plan Commission, in the County Office Building on East 9th Street in Rochester, administers one Fulton County Zone Ordinance (adopted 2008, amended 2018) that covers the unincorporated county and the City of Rochester and the towns of Akron, Kewanna and Fulton, with a board of zoning appeals for variances. Ask it which district your parcel is in and what that district requires for a manufactured home.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "Rochester" },
      { label: "Zoning", value: "Fulton County Plan Commission" },
      { label: "Septic", value: "Fulton County Health Dept." },
      { label: "Rural electric", value: "Fulton County REMC" },
    ],
    sections: [
      {
        heading: "One office for the county and all four towns",
        paragraphs: [
          "Most counties leave their towns to zone themselves. Fulton County does not: one zone ordinance covers the county, Rochester, Akron, Kewanna and Fulton, administered by the county plan commission. The Town of Fulton even has its building inspections done through interlocal agreements with the county. That means the counter you start at is the same wherever your land is — but the district, setbacks and standards still differ parcel by parcel, so ask about yours specifically.",
        ],
      },
      {
        heading: "Septic near the lakes",
        paragraphs: [
          "Fulton County has its own onsite sewage ordinance, approved by the state's technical review panel, and the county health department publishes the steps to a permit, a list of certified septic installers and its inspection requirements. Read those steps before you buy land, and size the system to the bedroom count of the plan you choose.",
          "Around the lakes it matters more. The state's water-quality study of Lake Manitou names home septic systems among the possible pollution sources. Lake Bruce and Nyona/South Mud Lake have conservancy districts, while Lake Manitou has a lake association. If you are buying near any of them, ask what sewer or district rules apply before you plan a septic field. Inside Rochester, sewer taps go through the city's wastewater department.",
        ],
      },
      {
        heading: "The Tippecanoe and its floodways",
        paragraphs: [
          "Most of Fulton County's land lies in the Tippecanoe River watershed, and the Department of Natural Resources has jurisdiction over most building in Indiana floodways. If your parcel is near the river or one of its creeks, have your surveyor check the flood maps before you buy; a home in a flood zone may need to sit higher or may need DNR approval.",
        ],
      },
      {
        heading: "Power, gas and schools",
        paragraphs: [
          "Fulton County REMC, headquartered in Rochester, serves much of the countryside here and parts of six neighbouring counties. Confirm whether natural gas reaches your parcel before you choose a furnace; on many rural and lake lots it does not, which changes the factory options you order.",
          "The county is served by Rochester Community Schools, Caston and Tippecanoe Valley around Akron, with parts of neighbouring districts reaching in. Confirm the district for your exact address.",
        ],
      },
    ],
    contacts: [
      {
        name: "Fulton County Plan Commission",
        role: "Zoning for the county, Rochester, Akron, Kewanna and Fulton under one ordinance; board of zoning appeals.",
      },
      {
        name: "Fulton County Health Department",
        role: "Septic permits under the county's own ordinance; certified installer list and inspections.",
        href: "https://www.in.gov/localhealth/fultoncounty/links",
      },
      {
        name: "Indiana DNR, Division of Water",
        role: "Floodway approvals along the Tippecanoe and its creeks.",
        href: "https://www.in.gov/dnr/water/",
      },
    ],
    faqs: [
      {
        question: "Who handles zoning for a manufactured home in Rochester?",
        answer:
          "The Fulton County Plan Commission. One Fulton County Zone Ordinance covers the county and Rochester, Akron, Kewanna and Fulton, so the same office answers wherever your land is.",
      },
      {
        question: "Can I put a home with a septic system near Lake Manitou or Lake Bruce?",
        answer:
          "Possibly, but check first. The county has its own septic ordinance, and Lake Bruce has a conservancy district. Ask the health department and any lake district what applies to your lot before you buy.",
      },
      {
        question: "Is natural gas available for a new home in Fulton County?",
        answer:
          "Not everywhere. Confirm with the gas provider for your parcel before you order, because the heating choice changes the factory options.",
      },
      {
        question: "Do you deliver to Rochester?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "A Champion home in Rochester & Fulton County, IN: one zoning ordinance for the county and towns, the county septic ordinance, lake districts and floodways.",
  },
  // Sources checked 2026-10-23: the Howard County Health Department's agency
  // checklist (Kokomo-Howard County Plan Commission; Kokomo Inspection Services
  // for occupancy) and homeowner OSS checklist + soil-scientist list; county
  // commissioner minutes (rural rezonings); the IURC/OUCC order folding Kokomo
  // Gas into NIPSCO and NIPSCO's 2023 Kokomo-area line; DNR's Kokomo/Howard
  // County flood insurance study and coverage of the April 2013 Wildcat Creek
  // flood and FEMA buyouts; IDEM's Russiaville wastewater permit; in.gov's
  // list of towns; INDOT's county map; the five school corporations. Rural
  // electric and gas providers could not be confirmed and are not named.
  {
    slug: "howard-county",
    seat: "Kokomo",
    county: "Howard County",
    state: "Indiana",
    eyebrow: "Kokomo, Greentown & Russiaville",
    intro:
      "Howard County runs through one joint plan commission for Kokomo and the county, and its septic rules start with a question most buyers never think to ask: is the parcel a legal lot of record? Here is the order things happen in when you place a Champion home here.",
    towns: ["Kokomo", "Greentown", "Russiaville", "Jerome", "Cassville"],
    driveNote:
      "Kokomo sits where US 31, US 35 and State Roads 22 and 26 meet, so the highway part of a delivery is straightforward; the last mile to your lot is what we ask about when we quote. " + PER_ROUTE,
    points: [
      "One plan commission for Kokomo and the unincorporated county",
      "Septic permits only on approved subdivision lots or legal lots of record",
      "Wildcat Creek flood ground mapped by the DNR",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "Zoning and building permits for Kokomo and the county go through the Kokomo-Howard County Plan Commission on North Main Street in Kokomo, and a rural rezoning goes on from the plan commission to the county commissioners for a vote. Ask the plan commission which district your parcel is in, and what it requires for a manufactured home there, before you buy the land.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "Kokomo" },
      { label: "Zoning and building permits", value: "Kokomo-Howard County Plan Commission" },
      { label: "Septic permits", value: "Howard County Health Dept." },
      { label: "Natural gas in Kokomo", value: "NIPSCO" },
    ],
    sections: [
      {
        heading: "Is it a legal lot? Ask before anything else",
        paragraphs: [
          "The Howard County Health Department will only issue a septic permit, or septic guidelines, for an approved subdivision lot or a legal lot of record. A piece split off a farm without going through the plan commission may not qualify, and without a septic permit the home cannot be permitted at all. If you are buying land from a relative or off a larger parcel, ask the plan commission whether the split is recorded properly before you close.",
        ],
      },
      {
        heading: "How the septic permit works here",
        paragraphs: [
          "Once the lot qualifies, you hire a soil scientist from the county's certified list. The borings go where the system will sit, with at least one inside the absorption field. The health department reviews the evaluation and sends back the minimum requirements, and only an installer registered in Howard County may build the system — the installer submits the site plan, design sheets, plat and elevations. Applications are reviewed in the order they arrive, so start early in the season.",
          "Size the system to the floor plan you choose. A four-bedroom home needs more than a two-bedroom one, so settle on the plan before the design is drawn.",
        ],
      },
      {
        heading: "Wildcat Creek",
        paragraphs: [
          "Wildcat Creek runs through Kokomo. The April 2013 flood reached nearly 400 homes, the city updated its floodplain rules with the DNR afterwards, and land along the creek bought out with FEMA money has to stay open space. The DNR holds the flood study for Kokomo and Howard County. If a parcel is anywhere near the creek or a tributary, have your surveyor check which flood zone the building site is in before you buy.",
        ],
      },
      {
        heading: "Sewer in the smaller towns",
        paragraphs: [
          "Russiaville runs its own wastewater plant, and Greentown was under a sewer connection ban until 2014. If you are buying a lot in either town, ask the town utility whether the lot can connect and what the connection requires — it decides whether you need a septic system at all.",
          "In Kokomo, natural gas is NIPSCO, which took over Kokomo Gas and Fuel and finished a gas line extension in the Kokomo area in 2023. For a rural parcel, ask the gas and electric providers for your address what it costs to bring service to the building site.",
        ],
      },
    ],
    contacts: [
      {
        name: "Kokomo-Howard County Plan Commission",
        role: "Zoning and building permits for Kokomo and the unincorporated county; rezonings go on to the county commissioners.",
      },
      {
        name: "Howard County Health Department — Environmental Health",
        role: "Septic permits: lot-of-record check, certified soil scientist, minimum requirements, registered installer.",
        href: "https://www.in.gov/localhealth/howardcounty/environmental-health/on-site-sewage-systems",
      },
      {
        name: "City of Kokomo Inspection Services",
        role: "Certificates of occupancy inside the city.",
      },
    ],
    faqs: [
      {
        question: "Who issues the permit for a manufactured home in Howard County?",
        answer:
          "The Kokomo-Howard County Plan Commission handles zoning and building permits for Kokomo and the unincorporated county. Inside Kokomo, the city's Inspection Services Department issues the certificate of occupancy.",
      },
      {
        question: "Can I get a septic permit on land split off a farm?",
        answer:
          "Only if it is an approved subdivision lot or a legal lot of record — that is the Howard County Health Department's first condition. Ask the plan commission whether the split was recorded properly before you buy.",
      },
      {
        question: "Is land near Wildcat Creek a problem?",
        answer:
          "It can be. The 2013 flood reached nearly 400 homes, and some creek-side land is now open space that cannot be built on. Have your surveyor check the flood zone for the building site.",
      },
      {
        question: "Do you deliver to Kokomo?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "Placing a Champion home in Kokomo & Howard County, IN: the joint plan commission, the lot-of-record septic rule, Wildcat Creek flood ground, town sewers.",
  },
  // Sources checked 2026-10-23: Cass County Planning Department page and the
  // joint Logansport/Cass County/Walton ILP form (in.gov/counties/cass), the
  // 2024 Cass County Zoning Ordinance (manufactured homes: title, under 20
  // years, permanent foundation below frost line, perimeter enclosure), health
  // department minutes, Logansport Municipal Utilities (IURC; 2020 solar
  // plant), Miami-Cass REMC, USGS flood inundation maps for the Wabash and Eel
  // at Logansport, Census 2020 (37,870), the county's school list. The gas
  // provider could not be confirmed and is not named.
  {
    slug: "cass-county",
    seat: "Logansport",
    county: "Cass County",
    state: "Indiana",
    eyebrow: "Logansport & the Wabash",
    intro:
      "Cass County has one planning office for the county, Logansport and Walton, and a zoning ordinance that spells out what a manufactured home needs to conform — a title, an age limit and a permanent foundation. Here is what that means for a new Champion home.",
    towns: ["Logansport", "Galveston", "Walton", "Royal Center", "Onward", "Lucerne", "Twelve Mile", "Young America"],
    driveNote:
      "US 24 and US 35 run together on a four-lane expressway around Logansport, and State Road 25 and State Road 29 reach north and south, so the highway part of a delivery is direct. " + PER_ROUTE,
    points: [
      "One permit form for the county, Logansport and Walton",
      "Zoning rules written for manufactured homes",
      "Wabash and Eel river flood maps from USGS",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "The Cass County Planning Department — plan commission, board of zoning appeals, zoning administrator and building commissioner — works out of the county government building in Logansport. Its improvement location permit for new construction covers Logansport, the unincorporated county and Walton on one form, needs a site plan, and is not processed until it is complete. Inspections must pass before a certificate of occupancy is issued.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "Logansport" },
      { label: "Permits", value: "Cass County Planning Department" },
      { label: "Septic", value: "Cass County Health Dept." },
      { label: "Electric in Logansport", value: "Logansport Municipal Utilities" },
    ],
    sections: [
      {
        heading: "What the county ordinance asks of a manufactured home",
        paragraphs: [
          "The 2024 Cass County Zoning Ordinance has its own section on mobile and manufactured homes. To be conforming, a home must be titled and newer than 20 years old by its state serial number, and the ordinance defines both a permanent foundation — below the frost line — and a permanent perimeter enclosure. A new Champion home is titled and new by definition; the foundation and enclosure are what your contractors build to that standard.",
          "Ask the planning department for the current section before you choose a foundation and skirting, and give it to your set-up contractor. It is the standard your permit will be inspected against.",
        ],
      },
      {
        heading: "Where the Eel meets the Wabash",
        paragraphs: [
          "The Eel River joins the Wabash at Logansport. The U.S. Geological Survey publishes flood inundation maps for 8.3 miles of the Wabash and 7.6 miles of the Eel there, tied to the river gauges, which show what land goes under water at each river level. Use them, and the floodplain maps, before you buy any parcel near either river or Goose Creek; a home in a flood zone may need to sit higher, and some ground may not be buildable at all.",
        ],
      },
      {
        heading: "Utilities: city, co-op or your own",
        paragraphs: [
          "Inside Logansport, Logansport Municipal Utilities supplies electricity, water and wastewater; since its coal plant closed in 2016 it has added a 16-megawatt solar plant. Much of the countryside is served by Miami-Cass REMC, based in Peru. Ask the provider for your parcel what it costs to bring service to the building site, and confirm whether natural gas reaches it before you choose a furnace.",
          "Off the city system, the site needs a well and a septic system, and the septic starts with the Cass County Health Department, which works alongside the planning department on new construction.",
        ],
      },
    ],
    contacts: [
      {
        name: "Cass County Planning Department",
        role: "Improvement location permits for the county, Logansport and Walton; plan commission, BZA and building commissioner.",
        href: "https://www.in.gov/counties/cass/departments/planning-department",
      },
      {
        name: "Cass County Health Department",
        role: "Septic questions for parcels off the city sewer.",
      },
      {
        name: "Logansport Municipal Utilities",
        role: "Electric, water and wastewater inside Logansport.",
      },
      {
        name: "Miami-Cass REMC",
        role: "Electric service across much of rural Cass County.",
      },
    ],
    faqs: [
      {
        question: "Does Cass County have rules for manufactured homes?",
        answer:
          "Yes. The county zoning ordinance requires a manufactured home to be titled and newer than 20 years old to be conforming, and defines a permanent foundation below the frost line and a perimeter enclosure. Ask the Cass County Planning Department for the current text.",
      },
      {
        question: "Who issues permits in Logansport?",
        answer:
          "The Cass County Planning Department's improvement location permit covers Logansport, the unincorporated county and Walton on one form. A site plan is required, and inspections must pass before occupancy.",
      },
      {
        question: "Can I build near the Wabash or Eel River?",
        answer:
          "Check first. USGS flood inundation maps cover both rivers at Logansport, and a home in a flood zone may need to be raised or may not be allowed. Have your surveyor confirm the building site's zone.",
      },
      {
        question: "Do you deliver to Logansport?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "Placing a Champion home in Logansport & Cass County, IN: the joint permit form, the county's manufactured-home rules, Wabash and Eel flood maps, and utilities.",
  },
  // Sources checked 2026-10-23: South Bend's residential permitting process
  // (joint South Bend/St. Joseph County Building Department; 5-digit county
  // addresses), Mishawaka's Building Department page, the St. Joseph County
  // Department of Health septic, permit-procedure, well-application and
  // well-drilling pages (three soil borings; separate well permit; wellhead
  // protection ordinance, 1998), South Bend 311 (groundwater supply), the 1982
  // Area Plan Commission staff report on P.L. 312-1981, Mishawaka Utilities
  // electric, South Bend's NIPSCO page, the NWS South Bend climatology and
  // 14-15 Jan 2026 snow summary, DNR's Kankakee basin summary, Census 2020.
  {
    slug: "st-joseph-county",
    seat: "South Bend",
    county: "St. Joseph County",
    state: "Indiana",
    eyebrow: "South Bend, Mishawaka & the Michigan Line",
    intro:
      "In St. Joseph County, South Bend and the unincorporated county share one building department while Mishawaka runs its own, septic permits start with three soil borings, and lake-effect snow decides a lot about delivery and set-up. Here is how placing a Champion home works here.",
    towns: ["South Bend", "Mishawaka", "Granger", "Osceola", "New Carlisle", "North Liberty", "Walkerton", "Lakeville"],
    driveNote:
      "South Bend averages about 64.5 inches of snow a season, so plan delivery, set-up and the driveway around November to March. " + PER_ROUTE,
    points: [
      "One building department for South Bend and the county",
      "Mishawaka's own building and planning offices",
      "Septic permits that start with three soil borings",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "The joint South Bend/St. Joseph County Building Department issues permits for South Bend and for unincorporated county land, including properties with a five-digit county address, and its building commissioner is the zoning administrator for both. Rezonings, variances and special uses go through the Area Plan Commission of St. Joseph County and its board of zoning appeals. Mishawaka, Walkerton and some other towns have their own offices.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "South Bend" },
      { label: "Permits (South Bend and county)", value: "Joint Building Department" },
      { label: "Permits in Mishawaka", value: "City of Mishawaka" },
      { label: "Septic and wells", value: "St. Joseph County Dept. of Health" },
    ],
    sections: [
      {
        heading: "Which office: South Bend and the county, or Mishawaka",
        paragraphs: [
          "South Bend and the unincorporated county share one building department, so a lot with a five-digit county address and a lot inside South Bend start at the same counter. Mishawaka is separate: its Building Department handles building permits and inspections, and its Planning department issues the improvement location permit. Walkerton and some of the smaller towns run their own planning too.",
          "Indiana law has said since 1981 that a local ordinance cannot completely exclude a manufactured home built after 1981 and larger than 950 square feet from lots where other homes are allowed. Local rules can still set standards — foundation, size, appearance — so ask the office for your lot what applies there.",
        ],
      },
      {
        heading: "Three soil borings, and a separate well permit",
        paragraphs: [
          "The St. Joseph County Department of Health's environmental health unit issues septic permits. A residential application needs the fee and a soil report built on three soil borings taken from the area of the new system; the department then issues minimum design specifications for a licensed installer. A well needs its own Water Supply Well Permit, and abandoning an old septic system — common when an older home on the lot is being replaced — needs its own application too.",
          "Groundwater matters here: South Bend draws all of its drinking water from wells, and the county has had a wellhead protection ordinance since 1998. Its permits are aimed at businesses, not homes, but it is a reason to site your well and septic carefully.",
        ],
      },
      {
        heading: "Lake-effect snow and set-up",
        paragraphs: [
          "The National Weather Service puts South Bend under Lake Michigan's influence, averaging about 64.5 inches of snow a season from November to March — and 17.1 inches fell in South Bend on January 14 and 15, 2026 alone. Plan the set-up, the utility hook-ups and a driveway that can be cleared around that season, and leave room on the lot to pile snow away from the home and the skirting.",
        ],
      },
      {
        heading: "Utilities in the cities",
        paragraphs: [
          "Mishawaka runs its own electric utility, Mishawaka Utilities, with more than 13,000 customers; much of the rest of the county is served by Indiana Michigan Power. Natural gas in South Bend is NIPSCO. In the rural south and west of the county, toward the Kankakee River, which rises near South Bend, ask the providers for your address what service to the building site will take.",
        ],
      },
    ],
    contacts: [
      {
        name: "South Bend/St. Joseph County Building Department",
        role: "Building permits and zoning administration for South Bend and the unincorporated county.",
      },
      {
        name: "Area Plan Commission of St. Joseph County",
        role: "Rezonings, variances and special uses through the Area Board of Zoning Appeals.",
      },
      {
        name: "City of Mishawaka — Building Department",
        role: "Building permits and inspections inside Mishawaka; Planning issues the location permit.",
        href: "https://mishawaka.in.gov/government/departments/building/",
      },
      {
        name: "St. Joseph County Department of Health — Environmental Health",
        role: "Septic permits (three soil borings), well permits and septic abandonment.",
        href: "https://www.in.gov/localhealth/stjosephcounty/environmental-health/septic-systems/",
      },
    ],
    faqs: [
      {
        question: "Who issues the permit for a manufactured home in South Bend or Mishawaka?",
        answer:
          "In South Bend and the unincorporated county, the joint South Bend/St. Joseph County Building Department. In Mishawaka, the city's own Building Department, with the location permit from its Planning department.",
      },
      {
        question: "What does a septic permit need in St. Joseph County?",
        answer:
          "An application, the fee and a soil report built on three soil borings from the area of the new system. The health department then issues minimum design specifications for a licensed installer. A well needs a separate permit.",
      },
      {
        question: "Can a town ban manufactured homes outright?",
        answer:
          "Indiana law has said since 1981 that a local ordinance cannot completely exclude a post-1981 manufactured home over 950 square feet from lots where other homes are allowed. Local standards on foundation, size or appearance can still apply — ask the office for your lot.",
      },
      {
        question: "Do you deliver to South Bend?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "A Champion home in South Bend & St. Joseph County, IN: the joint building department, Mishawaka's offices, three-boring septic permits and lake-effect snow.",
  },
  // Sources checked 2026-10-23: co.delaware.in.us (Delaware-Muncie
  // Metropolitan Plan Commission; County Building Commissioner, annual
  // contractor registration; which towns run their own offices), the county
  // health department's onsite sewage guide (the application is not the
  // permit), Indiana American Water on Prairie Creek Reservoir, Indiana Public
  // Radio on the county's flood hazard map, Daleville's 2021 zoning ordinance,
  // Census 2020, school corporations. Electric is named only as "much of the
  // county"; gas and rural co-ops could not be confirmed.
  {
    slug: "delaware-county",
    seat: "Muncie",
    county: "Delaware County",
    state: "Indiana",
    eyebrow: "Muncie, Yorktown & Albany",
    intro:
      "In Delaware County one plan commission plans for Muncie and the county, but seven towns and the city each issue their own permits, and the county wants your contractors registered every year. Here is who signs off on a Champion home here.",
    towns: ["Muncie", "Yorktown", "Albany", "Eaton", "Selma", "Daleville", "Gaston", "Chesterfield"],
    driveNote:
      "I-69 crosses the southwest of the county, State Road 32 runs through Daleville, Yorktown and Muncie, and US 35, SR 3 and SR 67 share the Muncie bypass, so most of the trip is on wide roads; the turn into your lot is what we ask about. " + PER_ROUTE,
    points: [
      "One plan commission for Muncie and the unincorporated county",
      "Contractors registered with the county every year",
      "A three-step septic process before the permit",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "The Delaware-Muncie Metropolitan Plan Commission is the planning department for Muncie and the unincorporated county, but it handles permitting and zoning enforcement only for the unincorporated county. Muncie, Yorktown, Eaton, Gaston, Albany, Selma and Daleville each run their own office. Ask first which one your parcel answers to.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "Muncie" },
      { label: "Planning", value: "Delaware-Muncie Metropolitan Plan Commission" },
      { label: "Building permits (county)", value: "County Building Commissioner" },
      { label: "Septic", value: "Delaware County Health Dept." },
    ],
    sections: [
      {
        heading: "Your contractors register with the county",
        paragraphs: [
          "In the unincorporated county, the County Building Commissioner issues permits for new structures, additions and electrical, plumbing and HVAC work — and general, electrical, plumbing and HVAC contractors have to register with that office every year. When you hire the crews for your foundation, set-up and hook-ups, ask each one whether their Delaware County registration is current. A lapsed registration can hold up a permit.",
          "Inside a town the rules are the town's own. Daleville's 2021 zoning ordinance, for example, requires a manufactured home's foundation to be built to Indiana's one- and two-family dwelling code. Ask the office that has your lot for its version.",
        ],
      },
      {
        heading: "The septic application is not the permit",
        paragraphs: [
          "The Delaware County Health Department's environmental health division runs a set sequence: site testing, then the septic application, then design specifications, then a detailed system design submitted for review. Its own guide points out that the application is not the permit — the permit comes after the design is approved. Build that sequence into your schedule before the home is ordered.",
          "Some older neighbourhoods in the county have had failing septic systems. If you are buying in one, ask whether sewer service reaches it or is planned.",
        ],
      },
      {
        heading: "The White River and Prairie Creek",
        paragraphs: [
          "The White River runs through Muncie, and together with Prairie Creek Reservoir — owned by Indiana American Water and leased to the city for recreation — it supplies about 70 percent of Muncie's drinking water. The county website has a flood hazard map you can search by address. Look up any parcel near the river or a creek before you buy, because a home in a flood zone may need to sit higher.",
          "Indiana Michigan Power serves much of the county; ask the electric and gas providers for your address what it costs to bring service to the building site.",
        ],
      },
    ],
    contacts: [
      {
        name: "Delaware-Muncie Metropolitan Plan Commission",
        role: "Planning for Muncie and the county; permits and zoning enforcement for the unincorporated county.",
        href: "https://www.co.delaware.in.us/department/?fDD=5-0",
      },
      {
        name: "Delaware County Building Commissioner",
        role: "Building, electrical, plumbing and HVAC permits in the unincorporated county; annual contractor registration.",
        href: "https://www.co.delaware.in.us/department/index.php?fDD=20-0",
      },
      {
        name: "Delaware County Health Department — Environmental Health",
        role: "Site testing, septic application, design specifications and design review.",
      },
    ],
    faqs: [
      {
        question: "Who issues the permit for a manufactured home in Delaware County?",
        answer:
          "In the unincorporated county, the County Building Commissioner, with zoning from the Delaware-Muncie Metropolitan Plan Commission. Muncie, Yorktown, Eaton, Gaston, Albany, Selma and Daleville each have their own office.",
      },
      {
        question: "Do my contractors need to be registered?",
        answer:
          "In the unincorporated county, yes — general, electrical, plumbing and HVAC contractors register with the County Building Commissioner every year. Ask each one before you hire them.",
      },
      {
        question: "How long does the septic permit take?",
        answer:
          "It follows four steps — site testing, application, design specifications, detailed design review — and the permit comes at the end, not with the application. Start the soil work as soon as you own the land.",
      },
      {
        question: "Do you deliver to Muncie?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "A Champion home in Muncie & Delaware County, IN: the metropolitan plan commission, annual contractor registration, septic steps and White River flood maps.",
  },
  // Sources checked 2026-10-23: in.gov/counties/randolph (Area Planning & Zoning
  // — ILP before a building permit, manufactured homes named; Building
  // Commission; Unified Zoning Ordinance, March 2026; "mother of rivers";
  // school corporations), the Randolph County Health Department septic permit
  // page (IRSS soil scientist; recessional moraine warning; owner responsible),
  // the City of Winchester utilities page, EDP Renewables on Headwaters Wind
  // Farm, IDEM's upper Mississinewa TMDL, Census 2020. Rural electric and gas
  // providers are not named.
  {
    slug: "randolph-county",
    seat: "Winchester",
    county: "Randolph County",
    state: "Indiana",
    eyebrow: "Winchester & Union City",
    intro:
      "Randolph County has one zoning ordinance for the county and every city and town in it, a septic process that warns about soils a standard test can miss, and wind turbines along the Ohio line. Here is what that means for a Champion home here.",
    towns: ["Winchester", "Union City", "Farmland", "Lynn", "Parker City", "Ridgeville", "Losantville", "Modoc"],
    driveNote:
      "US 27 and State Road 32 meet in Winchester, with US 36 and State Road 28 crossing the county, so the highway part of a delivery is open road; farm lanes and field drives are what we ask about. " + PER_ROUTE,
    points: [
      "One unified zoning ordinance for the whole county",
      "A location permit before the building permit",
      "Septic soils checked by a certified soil scientist",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "Randolph County Area Planning handles zoning and issues the Improvement Location Permit, which is required before any building permit — and the county names a manufactured home as one of the cases that needs it. The Building Commission then issues the building permit, registers contractors and inspects; it lists manufactured housing and foundation work among the projects that need a permit. Both offices are on South Oak Street in Winchester.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "Winchester" },
      { label: "Zoning and location permit", value: "Randolph County Area Planning" },
      { label: "Building permits", value: "Randolph County Building Commission" },
      { label: "Zoning ordinance", value: "One unified ordinance, county-wide" },
    ],
    sections: [
      {
        heading: "One ordinance for every town",
        paragraphs: [
          "Unlike most counties around it, Randolph County has a single Unified Zoning Ordinance covering the county and its cities and towns; the current version is dated March 2026. Whether your lot is in Winchester, Union City, Farmland or open farm ground, the rules come from the same document, and the location permit comes from the same office. Ask Area Planning for the district your parcel is in and the standards for a manufactured home there.",
        ],
      },
      {
        heading: "Soils a standard test can miss",
        paragraphs: [
          "The Randolph County Health Department's septic process starts with an application, a property plat and the home's floor plans, then a soil analysis by a soil scientist certified by the Indiana Registry of Soil Scientists, working with a registered septic contractor. The department mails back the minimum requirements, and the contractor submits the installation plans. The property owner is responsible for getting the permit before any work starts.",
          "The county also warns that recessional moraine soils found here may be unsuitable for a septic field, and that a standard soil analysis may not detect them. Tell your soil scientist about that warning, and do the soil work before you commit to a building site on a large parcel.",
        ],
      },
      {
        heading: "The mother of rivers",
        paragraphs: [
          "Randolph County calls itself the mother of rivers: the White River and the Whitewater River both start here, and part of the county drains to the upper Mississinewa. Their headwaters are small creeks and ditches, but low ground beside them can still hold water. Have your surveyor check drainage and any flood zone before you set the home's height.",
        ],
      },
      {
        heading: "Wind turbines and the Ohio line",
        paragraphs: [
          "Headwaters Wind Farm — 398 megawatts, entirely inside Randolph County along the Ohio border, running since 2014 — puts turbines on farm ground in the east of the county. If you are looking at land there, visit at different times of day and in different weather to see and hear them before you buy.",
          "Union City sits directly across the state line from Union City, Ohio, and each side has its own government, schools and permits. Make sure your parcel is on the Indiana side if you are counting on Indiana rules.",
        ],
      },
      {
        heading: "Utilities in Winchester",
        paragraphs: [
          "In Winchester, electricity comes from Indiana Michigan Power, gas from Ohio Valley Gas — headquartered in Winchester — and water from Indiana American Water, with sewer and trash billed by the city. In the countryside, ask the electric provider for your address what it costs to run service to the building site, and plan on a well and septic system.",
        ],
      },
    ],
    contacts: [
      {
        name: "Randolph County Area Planning & Zoning",
        role: "Zoning under the Unified Zoning Ordinance and the Improvement Location Permit, required before a building permit.",
        href: "https://www.in.gov/counties/randolph/departments/area-planning-zoning/",
      },
      {
        name: "Randolph County Building Commission",
        role: "Building permits, contractor registration and inspections, including manufactured housing and foundations.",
        href: "https://secure.in.gov/counties/randolph/departments/building-commission",
      },
      {
        name: "Randolph County Health Department",
        role: "Septic permits: plat and floor plans, certified soil scientist, minimum requirements, installation plans.",
        href: "https://www.in.gov/localhealth/randolphcounty/services/septic-system-permit",
      },
    ],
    faqs: [
      {
        question: "Do I need a location permit for a manufactured home in Randolph County?",
        answer:
          "Yes. Area Planning issues an Improvement Location Permit before any building permit, and the county names manufactured homes among the cases that need one. The Building Commission then issues the building permit.",
      },
      {
        question: "Why does my septic soil test matter more here?",
        answer:
          "The county health department warns that recessional moraine soils in Randolph County may be unsuitable for septic and may not show up on a standard soil analysis. Tell your certified soil scientist, and test before you choose the building site.",
      },
      {
        question: "Are there wind turbines near land for sale in Randolph County?",
        answer:
          "In the east of the county, yes — Headwaters Wind Farm runs along the Ohio border. Visit a parcel at different times before you buy.",
      },
      {
        question: "Do you deliver to Winchester and Union City?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "A Champion home in Winchester & Randolph County, IN: one unified zoning ordinance, the ILP-first rule, moraine soils in septic tests, and the wind farm.",
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
