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
  // Sources checked 2026-10-28: Census QuickFacts (80,240); the Kosciusko County
  // Area Plan Commission page and county permit checklist (building permit only
  // after other approvals, including a driveway entrance permit; Syracuse issues
  // its own), the Purdue-hosted county zoning ordinance (participating towns;
  // Etna Green 2007, Burket 2014); the county health department's septic and
  // well page and vacant-lot checklist; DNR's 2022 Lake Wawasee survey; SBOA on
  // the Lakeland Regional Sewer District (North Webster); DNR's Lake
  // Preservation Act guidance; Kosciusko REMC; the county's school list.
  {
    slug: "kosciusko-county",
    seat: "Warsaw",
    county: "Kosciusko County",
    state: "Indiana",
    eyebrow: "Warsaw & the Lakes",
    intro:
      "Kosciusko County will not issue a building permit until the other approvals are in hand — down to the driveway entrance permit — and it is home to Lake Wawasee, Indiana's largest natural lake. Here is the order things happen in when you place a Champion home here.",
    towns: ["Warsaw", "Winona Lake", "Syracuse", "North Webster", "Pierceton", "Milford", "Mentone", "Leesburg"],
    driveNote:
      "US 30 crosses the county through Warsaw and State Road 15 runs north and south, so the highway part of a delivery is direct; narrow lake roads are what we ask about. " + PER_ROUTE,
    points: [
      "Every other approval before the building permit",
      "A driveway entrance permit from the road authority",
      "Lake Wawasee and the county's other lakes under DNR rules",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "The Kosciusko County Area Plan Commission, at the Area Planning Office on West Center Street in Warsaw, administers a zoning ordinance covering the unincorporated county and the towns that take part — Etna Green joined in 2007 and Burket in 2014. Syracuse issues its own building permits. Ask which applies to your parcel first.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "Warsaw" },
      { label: "Zoning and permits", value: "Kosciusko County Area Plan Commission" },
      { label: "Septic and wells", value: "Kosciusko County Health Dept." },
      { label: "Rural electric co-op", value: "Kosciusko REMC (Warsaw)" },
    ],
    sections: [
      {
        heading: "Every approval first, then the building permit",
        paragraphs: [
          "The Area Plan Commission will not issue a building permit until the other approvals are in hand — including a driveway entrance permit from the county or state highway department, depending on which road your lot is on. That last one surprises people. Apply for the driveway permit as soon as you know where the entrance will go, because the delivery truck needs that entrance too.",
        ],
      },
      {
        heading: "Septic and well on a vacant lot",
        paragraphs: [
          "For a vacant lot, the Kosciusko County Health Department's checklist is short: fill out the septic and well applications, get a soil scientist's report, and the department issues a specification sheet for the system. Do it before you finalise the floor plan, because the bedroom count sizes the system and the soil decides where it goes.",
        ],
      },
      {
        heading: "Lake Wawasee and the lake country",
        paragraphs: [
          "Lake Wawasee, by Syracuse, is Indiana's largest natural lake — about 3,410 acres in the DNR's 2022 survey — and the county has many more. Work at or lakeward of a public lake's shoreline, from a seawall to regrading at the water, needs Indiana DNR approval under the Lake Preservation Act, with a 30-day public notice. Around several lakes, sewer service comes from the Lakeland Regional Sewer District based in North Webster; ask whether your lot is on it before you plan a septic system.",
          "Lake lots are often narrow. Measure the buildable width after setbacks before choosing a plan; a single-section home often fits where a wider one does not.",
        ],
      },
      {
        heading: "Power and schools",
        paragraphs: [
          "Kosciusko REMC, headquartered in Warsaw, serves much of the countryside; ask the provider for your parcel what service to the building site will take, and confirm whether natural gas reaches it. The county's schools include Warsaw Community, Wawasee, Tippecanoe Valley, Whitko and Triton, several of which cross county lines — confirm the district for your address.",
        ],
      },
    ],
    contacts: [
      {
        name: "Kosciusko County Area Plan Commission",
        role: "Zoning and building permits for the unincorporated county and participating towns; issued after other approvals are in hand.",
        href: "https://www.kosciusko.in.gov/department/board.php?fDD=2-46",
      },
      {
        name: "Kosciusko County Health Department",
        role: "Septic and well applications, soil scientist report and specification sheet.",
        href: "https://www.in.gov/localhealth/kosciuskocounty/environmental-health-services/septic-and-well-systems",
      },
      {
        name: "County or state highway department",
        role: "Driveway entrance permit for your lot, required before the building permit.",
      },
      {
        name: "Indiana DNR, Division of Water",
        role: "Approvals for work at or lakeward of a public lake's shoreline.",
        href: "https://www.in.gov/dnr/water/",
      },
    ],
    faqs: [
      {
        question: "Why do I need a driveway permit before my building permit in Kosciusko County?",
        answer:
          "The Area Plan Commission issues the building permit only after the other approvals are in hand, including a driveway entrance permit from the county or state highway department for your road.",
      },
      {
        question: "What does the health department need for a vacant lot?",
        answer:
          "Septic and well applications and a soil scientist's report; the department then issues a specification sheet for the septic system.",
      },
      {
        question: "Can I put a home on Lake Wawasee or another lake?",
        answer:
          "The home is a county or town permit question, but shoreline work needs Indiana DNR approval. Ask the Lakeland Regional Sewer District whether your lot has sewer before planning a septic system.",
      },
      {
        question: "Do you deliver to Warsaw and the lakes?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "A Champion home in Warsaw & Kosciusko County, IN: every approval before the building permit, the driveway permit, septic and well steps, and Lake Wawasee.",
  },
  // Sources checked 2026-10-28: Census QuickFacts (36,662); the Huntington
  // County Department of Community Development page (permits for the
  // unincorporated county and Andrews, Markle, Mount Etna, Roanoke, Warren) and
  // the 2024 draft Unified Development Ordinance; the City of Huntington's plan
  // commission, BZA and historic review board; the county health department's
  // septic permit process; Huntington County Community School Corporation;
  // NIPSCO's gas town index; Heartland REMC. Reservoir facts are general (Army
  // Corps / DNR roles) and not tied to a parcel.
  {
    slug: "huntington-county",
    seat: "Huntington",
    county: "Huntington County",
    state: "Indiana",
    eyebrow: "Huntington, Roanoke & Andrews",
    intro:
      "Huntington County issues permits for the countryside and five of its towns from one department, has a single school district for the whole county, and lays out its septic permit in five plain steps. Here is how placing a Champion home works here.",
    towns: ["Huntington", "Roanoke", "Andrews", "Warren", "Markle", "Mount Etna"],
    driveNote:
      "US 24 runs through Huntington toward Fort Wayne and Wabash, so the highway part of a delivery is direct; the county road and lane to your lot are what we ask about. " + PER_ROUTE,
    points: [
      "One county department for the countryside and five towns",
      "A five-step septic permit process",
      "One school district for the whole county",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "The Huntington County Department of Community Development reviews and issues building permits for the unincorporated county and the towns of Andrews, Markle, Mount Etna, Roanoke and Warren. The City of Huntington has its own plan commission, board of zoning appeals and historic review board. In 2024 the county was drafting a new Unified Development Ordinance, so ask for the rules currently in force.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "Huntington" },
      { label: "Permits (county and five towns)", value: "Dept. of Community Development" },
      { label: "Septic", value: "Huntington County Health Dept." },
      { label: "School district", value: "Huntington County Community Schools" },
    ],
    sections: [
      {
        heading: "Five steps to a septic permit",
        paragraphs: [
          "The Huntington County Health Department sets the order out plainly. First, hire a soil scientist from the Indiana Registry of Soil Scientists — the county keeps a list. Second, file the application with the soil report, and the department issues the minimum specifications for the system. Third, your designer or installer submits construction plans, which the department reviews within 30 days. Fourth, the permit is issued once the plans are approved. Fifth, call the department before construction starts and at each inspection.",
          "Choose the floor plan before step two, because the bedroom count sizes the system.",
        ],
      },
      {
        heading: "The city is its own jurisdiction",
        paragraphs: [
          "Inside the City of Huntington, zoning and appeals go through the city's own plan commission and board of zoning appeals, and older parts of the city have a historic review board. If you are looking at a city lot, ask the city what applies before you choose a plan and exterior, and whether the lot sits in a historic area.",
        ],
      },
      {
        heading: "Reservoirs and the upper Wabash",
        paragraphs: [
          "J. Edward Roush Lake (long known as Huntington Lake) and Salamonie Lake were built for flood control on the upper Wabash. The Army Corps of Engineers runs the dams and water levels and the Indiana DNR manages much of the surrounding land, so that land is not for sale for homes. For private parcels near the Wabash or Little Wabash rivers or their creeks, have your surveyor check the flood maps before you buy.",
        ],
      },
      {
        heading: "Schools and utilities",
        paragraphs: [
          "One school corporation, Huntington County Community Schools, serves the whole county, with Huntington North as its high school — so the district question is simpler here than almost anywhere else we deliver. NIPSCO supplies natural gas in Huntington, and Heartland REMC serves part of the countryside. Ask the providers for your parcel what service to the building site will take.",
        ],
      },
    ],
    contacts: [
      {
        name: "Huntington County Department of Community Development",
        role: "Building permits for the unincorporated county and Andrews, Markle, Mount Etna, Roanoke and Warren.",
        href: "https://www.huntington.in.us/county/department/?fDD=35-0",
      },
      {
        name: "Huntington County Health Department",
        role: "Septic permits: IRSS soil scientist, specifications, plan review, permit and inspections.",
        href: "https://secure.in.gov/localhealth/huntingtoncounty/environmental-sanitarian/septic",
      },
      {
        name: "City of Huntington — Plan Commission and BZA",
        role: "Zoning and appeals inside the city.",
      },
    ],
    faqs: [
      {
        question: "Who issues the permit for a manufactured home in Roanoke or Andrews?",
        answer:
          "The Huntington County Department of Community Development, which issues building permits for the unincorporated county and the towns of Andrews, Markle, Mount Etna, Roanoke and Warren.",
      },
      {
        question: "How long does the septic permit take in Huntington County?",
        answer:
          "It follows five steps, starting with a registered soil scientist. Once your designer submits construction plans, the health department reviews them within 30 days, and the permit follows approval.",
      },
      {
        question: "Which school district would my home be in?",
        answer:
          "Huntington County Community Schools covers the whole county, with Huntington North as its high school.",
      },
      {
        question: "Do you deliver to Huntington?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "A Champion home in Huntington County, IN: one permit office for the county and five towns, a five-step septic permit, one school district and the reservoirs.",
  },
  // Sources checked 2026-10-28: Census QuickFacts (207,047); Elkhart County
  // Planning & Development's ILP brochure and the 6/1/2024 Development
  // Ordinance (replacing the 2015 zoning ordinance); county permit logs (a
  // separate residential mobile-home permit type naming the installer); the City
  // of Elkhart zoning ordinance; the county health department's septic page
  // (Ordinance 2012-153; registered installers) and well page (permit before
  // construction; drillers and pump installers register; 2017 ordinance);
  // in.gov's list of seven school corporations; Visit Elkhart County on the
  // RV and manufactured-housing industry.
  {
    slug: "elkhart-county",
    seat: "Goshen",
    county: "Elkhart County",
    state: "Indiana",
    eyebrow: "Goshen, Elkhart & Nappanee",
    intro:
      "Elkhart County is the heart of the RV and manufactured housing industry, and it permits a new home in a set order: zoning first through an Improvement Location Permit, then a building permit reviewed by health, highway and soil and water. Here is how placing a Champion home works here.",
    towns: ["Goshen", "Elkhart", "Nappanee", "Middlebury", "Bristol", "Millersburg", "Wakarusa"],
    driveNote:
      "US 20, US 33 and the Indiana Toll Road cross the county, so the highway part of a delivery is direct; the county road and lane to your lot are what we ask about. " + PER_ROUTE,
    points: [
      "Zoning first, through an Improvement Location Permit",
      "A 2024 Development Ordinance replaced the old zoning code",
      "Registered well drillers and septic installers",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "Elkhart County Planning & Development, in the Public Services Building on Elkhart Road in Goshen, administers the Elkhart County Development Ordinance, which took effect in June 2024 and replaced the 2015 zoning ordinance. The cities of Elkhart, Goshen and Nappanee run their own zoning. Ask which office has your parcel, and ask for the current ordinance rather than an older copy.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "Goshen" },
      { label: "Zoning and permits", value: "Elkhart County Planning & Development" },
      { label: "Septic and wells", value: "Elkhart County Health Dept." },
      { label: "School corporations", value: "Seven, from Baugo to Wa-Nee" },
    ],
    sections: [
      {
        heading: "Zoning first, then the building permit",
        paragraphs: [
          "In the unincorporated county the first step is zoning review, through an Improvement Location Permit. The building permit application comes after, with buildable plans, and is routed to the health department, the highway department and the Soil & Water Conservation District. The county's permit records carry a separate residential permit type for a mobile or manufactured home that names the installer, so have your set-up contractor lined up before you apply.",
          "The rules sit in the Development Ordinance adopted in 2024. Ask the planning office what it requires for a manufactured home in your parcel's district — foundation, skirting and placement — and give that to your contractor.",
        ],
      },
      {
        heading: "Registered drillers and installers",
        paragraphs: [
          "Every new private well needs a permit from the Elkhart County Health Department before it is built, and well drillers and pump installers must register with the department first. Septic systems fall under the county's Private Sewage System Ordinance, and the department keeps the list of registered installers. Ask anyone you hire to confirm their registration before work starts.",
        ],
      },
      {
        heading: "The RV and manufactured housing capital",
        paragraphs: [
          "Elkhart County calls itself the RV capital of the world, and the RV/MH Hall of Fame in Elkhart covers both recreational vehicles and manufactured housing. That makes it a place where buyers often already know the difference between an RV, a park model and a HUD-code home — a HUD-code manufactured home is a permanent residence built to the federal code, titled and financed as a home.",
        ],
      },
      {
        heading: "Schools",
        paragraphs: [
          "The county has seven school corporations — Baugo, Concord, Elkhart, Fairfield, Goshen, Middlebury and Wa-Nee — so the district can change from one road to the next. Confirm it for the exact address before you buy land.",
        ],
      },
    ],
    contacts: [
      {
        name: "Elkhart County Planning & Development",
        role: "Improvement Location Permits and building permits for the unincorporated county under the 2024 Development Ordinance.",
      },
      {
        name: "Elkhart County Health Department — Environmental Health",
        role: "Septic permits and registered installers; well permits and driller registration.",
        href: "https://health.elkhartcounty.com/en/environmental-health/about-environmental-health/septic-permits/",
      },
      {
        name: "City of Elkhart, Goshen or Nappanee planning offices",
        role: "Zoning inside each city.",
      },
    ],
    faqs: [
      {
        question: "What is the first permit for a manufactured home in Elkhart County?",
        answer:
          "In the unincorporated county, an Improvement Location Permit for zoning review. The building permit follows and is routed to health, highway and the Soil & Water Conservation District.",
      },
      {
        question: "Which zoning rules apply now?",
        answer:
          "The Elkhart County Development Ordinance, in effect since June 2024, which replaced the 2015 zoning ordinance. Inside Elkhart, Goshen or Nappanee, the city's own zoning applies.",
      },
      {
        question: "Does my well driller need to be registered?",
        answer:
          "Yes. Well drillers and pump installers must register with the Elkhart County Health Department, and every new well needs a permit before construction.",
      },
      {
        question: "Do you deliver to Goshen, Elkhart and Nappanee?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "A Champion home in Goshen & Elkhart County, IN: the ILP-first permit order, the 2024 Development Ordinance, registered drillers and installers, and schools.",
  },
  // Sources checked 2026-10-28: Census QuickFacts (30,976); the Wabash County
  // Advisory Plan Commission page (jurisdiction: unincorporated county, Lagro,
  // LaFontaine, Roann; not Wabash or North Manchester or their fringe areas),
  // its FAQ and 2024 minutes (tax-status and drainage checks before a building
  // permit; special exceptions to the BZA; Chapter 7 of the 2023 ordinance on
  // manufactured homes); the county health department's septic handout; the
  // county Flood Damage Prevention Ordinance; NIPSCO's gas tariff index of towns;
  // Heartland and Miami-Cass REMC; the three school corporations. The county
  // FAQ is inconsistent on where manufactured homes are allowed, so the page
  // sends buyers to the plan commission rather than stating a rule.
  {
    slug: "wabash-county",
    seat: "Wabash",
    county: "Wabash County",
    state: "Indiana",
    eyebrow: "Wabash & North Manchester",
    intro:
      "In Wabash County the county plans for the countryside and three small towns, while the City of Wabash and North Manchester zone themselves and the land around them. A manufactured home can need a special exception, and a building permit waits on a tax and drainage check. Here is the order things happen in.",
    towns: ["Wabash", "North Manchester", "Lagro", "LaFontaine", "Roann", "Urbana"],
    driveNote:
      "US 24 crosses the county east to west through Wabash, so most of a delivery is on a four-lane route; the county road and the lane to your lot are what we ask about. " + PER_ROUTE,
    points: [
      "County zoning for the countryside, Lagro, LaFontaine and Roann",
      "Wabash and North Manchester zone their own fringe areas",
      "A special exception may be needed for a manufactured home",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "The Wabash County Planning & Zoning Department and Advisory Plan Commission, on West Hill Street in Wabash, cover the unincorporated county and the towns of Lagro, LaFontaine and Roann. The City of Wabash and the Town of North Manchester zone themselves and the land just outside their limits. Find out which applies to your parcel first.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "Wabash" },
      { label: "County zoning", value: "Wabash County Planning & Zoning" },
      { label: "Septic", value: "Wabash County Health Dept." },
      { label: "Natural gas (in the towns)", value: "NIPSCO" },
    ],
    sections: [
      {
        heading: "Manufactured homes and special exceptions",
        paragraphs: [
          "Chapter 7 of the county's zoning ordinance, in force since January 2023, deals with mobile and manufactured homes and defines a manufactured home as one built to the HUD code after June 15, 1976. In some residential districts a manufactured home is allowed only by special exception, which is heard by the Board of Zoning Appeals — the plan commission itself does not issue permits or grant variances. Ask the planning department what your parcel's district allows before you buy, and allow time for a hearing if one is needed.",
        ],
      },
      {
        heading: "Tax status and drainage, before the building permit",
        paragraphs: [
          "The plan commission's 2024 minutes record a county ordinance that requires the treasurer's office to confirm the parcel's tax status, and requires drainage approval, before a building permit is issued. If you are buying land, make sure the taxes are current at closing and ask about any county drain on the parcel early — either can hold up the permit after the home is already ordered.",
        ],
      },
      {
        heading: "Septic comes before anything else",
        paragraphs: [
          "The Wabash County Health Department needs a site evaluation from a state-certified soil scientist, sent to the department, and a plot design map from your contractor; the septic permit is not issued until that map is accepted. Under the state rule, neither the house nor the septic system may be started until the septic permit is in hand, so this step sets your whole schedule.",
        ],
      },
      {
        heading: "Floodplains and utilities",
        paragraphs: [
          "The county's Flood Damage Prevention Ordinance covers the unincorporated county and LaFontaine, Lagro and Roann, and requires a floodplain development permit for building in a mapped floodplain. Where a site is in a regulatory floodway, the Indiana DNR has to issue its own floodway permit too. Check the flood maps for any parcel near the Wabash or Eel River or their creeks.",
          "NIPSCO supplies natural gas in Wabash, North Manchester, Lagro, Roann, Urbana and other communities in the county; out in the countryside, confirm whether gas reaches your parcel. Electric service varies, with Heartland REMC and Miami-Cass REMC each serving part of the county.",
        ],
      },
    ],
    contacts: [
      {
        name: "Wabash County Planning & Zoning / Advisory Plan Commission",
        role: "Zoning and permits for the unincorporated county, Lagro, LaFontaine and Roann; special exceptions go to the BZA.",
        href: "https://secure.in.gov/counties/wabash/departments/advisory-plan-commission",
      },
      {
        name: "Wabash County Health Department",
        role: "Septic permits: certified soil scientist's site evaluation and the contractor's plot design map.",
      },
      {
        name: "City of Wabash Building Department",
        role: "Improvement location and building permits inside the city and its fringe area.",
      },
    ],
    faqs: [
      {
        question: "Can I put a manufactured home on land in Wabash County?",
        answer:
          "It depends on the district. The county ordinance has a chapter on manufactured homes, and in some residential districts one needs a special exception from the Board of Zoning Appeals. Ask the county planning department about your parcel before you buy.",
      },
      {
        question: "Who handles zoning near North Manchester or the City of Wabash?",
        answer:
          "Those two zone themselves and the land just outside their limits. The county handles the rest of the countryside plus Lagro, LaFontaine and Roann.",
      },
      {
        question: "Why is my building permit waiting on the county treasurer?",
        answer:
          "A county ordinance requires the parcel's tax status to be confirmed, and drainage to be approved, before a building permit is issued. Make sure taxes are current when you buy.",
      },
      {
        question: "Do you deliver to Wabash and North Manchester?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "A Champion home in Wabash County, IN: who zones Wabash and North Manchester, special exceptions for manufactured homes, septic first and floodplain permits.",
  },
  // Sources checked 2026-10-28: in.gov's Jay County places list; the Jay/Portland
  // Building & Planning Department page (city and county permits, inspections,
  // rezonings, both plan commissions); the joint plan commission agenda of
  // 2026-02-12; The Commercial Review on Bitter Ridge and Bluff Point wind
  // farms, the proposed 2025 wind-ordinance review and Millers Branch /
  // Salamonie River flooding in Portland; Jay County REMC (Portland); INDOT
  // county map; the Jay School Corporation. The health department's septic
  // process and the gas provider were not confirmed and are not described.
  {
    slug: "jay-county",
    seat: "Portland",
    county: "Jay County",
    state: "Indiana",
    eyebrow: "Portland & the Ohio Line",
    intro:
      "In Jay County one office issues building and zoning permits for both Portland and the county, wind turbines already stand on farm ground, and downtown Portland has a long flooding history. Here is what that means for placing a Champion home here.",
    towns: ["Portland", "Dunkirk", "Redkey", "Pennville", "Bryant", "Salamonia"],
    driveNote:
      "US 27, State Road 67 and State Road 26 meet at Portland, with State Roads 1 and 18 crossing the county, so most of a delivery is on through routes; the farm lane at the end is what we ask about. " + PER_ROUTE,
    points: [
      "One building and planning office for Portland and the county",
      "Wind farms on farm ground, and setback rules under review",
      "Flood ground along Millers Branch and the Salamonie",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "The Jay/Portland Building & Planning Department issues building and zoning permits for both the City of Portland and Jay County, carries out the inspections, handles rezonings and staffs both plan commissions. Whether your land is in the city or out on a county road, start there and ask which plan commission and district your parcel falls under.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "Portland" },
      { label: "Permits (city and county)", value: "Jay/Portland Building & Planning" },
      { label: "Towns", value: "Bryant, Dunkirk, Pennville, Portland, Redkey, Salamonia" },
      { label: "Rural electric co-op", value: "Jay County REMC (Portland)" },
    ],
    sections: [
      {
        heading: "One counter for city and county",
        paragraphs: [
          "Most counties send you to one office in town and another in the countryside. Jay County does not: the Jay/Portland Building & Planning Department handles building and zoning permits, inspections and rezonings for both, and staffs both the city and county plan commissions, which have also met jointly. That makes it easy to find the right person — ask them for the district your parcel is in and what a manufactured home needs there.",
        ],
      },
      {
        heading: "Wind turbines on the horizon",
        paragraphs: [
          "Two wind farms already operate in the county, Bitter Ridge and Bluff Point, and a third, a 200-megawatt project from RWE, is targeted for 2031. In 2025 county planning staff proposed pausing new wind projects to review the wind ordinance, including turbine setbacks. If you are buying farm ground, ask the planning department where turbines stand or are proposed near the parcel, and visit at different times of day before you commit.",
        ],
      },
      {
        heading: "Millers Branch, the Salamonie and Portland",
        paragraphs: [
          "Downtown Portland has flooded repeatedly from Millers Branch and the Salamonie River, enough that the Army Corps of Engineers came to look at the problem in 2018. If you are considering a lot in or near Portland, or any parcel beside the river or a branch, have your surveyor check the flood maps for the building site before you buy. A home in a flood zone may need to sit higher, which changes the foundation and the steps.",
        ],
      },
      {
        heading: "Power and schools",
        paragraphs: [
          "Jay County REMC is headquartered in Portland. Ask the electric provider for your parcel what it costs to bring service to the building site, and confirm whether natural gas reaches it before you choose a furnace. The county's schools are run by the Jay School Corporation, with Jay County Junior-Senior High School and elementaries including East Jay, West Jay and Redkey.",
        ],
      },
    ],
    contacts: [
      {
        name: "Jay/Portland Building & Planning Department",
        role: "Building and zoning permits, inspections and rezonings for Portland and Jay County; staffs both plan commissions.",
        href: "https://www.in.gov/counties/jay/departments/building-and-planning/",
      },
      {
        name: "Jay County Health Department",
        role: "Septic questions for parcels off a town sewer.",
      },
    ],
    faqs: [
      {
        question: "Who issues the permit for a manufactured home in Jay County?",
        answer:
          "The Jay/Portland Building & Planning Department, which issues building and zoning permits for both the City of Portland and the county and handles the inspections.",
      },
      {
        question: "Are there wind turbines near land for sale in Jay County?",
        answer:
          "Possibly. Bitter Ridge and Bluff Point wind farms already operate in the county and another is planned. Ask the planning department about the parcel and visit before you buy.",
      },
      {
        question: "Does Portland flood?",
        answer:
          "Parts of it have, repeatedly, from Millers Branch and the Salamonie River. Have your surveyor check the flood maps for any lot in or near Portland before you buy.",
      },
      {
        question: "Do you deliver to Portland and Dunkirk?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "A Champion home in Portland & Jay County, IN: one permit office for city and county, wind farms and setback review, and Millers Branch flooding.",
  },
  // Sources checked 2026-10-28: Grant County Area Plan Commission page
  // (jurisdiction: unincorporated county plus Van Buren, Upland, Matthews,
  // Jonesboro, Fairmount, Sweetser), its contractor-registration notice and
  // residential permit form (manufactured home setup section); the City of
  // Marion ILP procedures; the Grant County Health Department septic FAQ,
  // homebuyer brochure and registered-installer page; USGS SIR 2014-5060
  // (Mississinewa flood-inundation maps at Marion), the county's 2017 hazard
  // mitigation flood exhibit and the NWS Marion gauge. Electric providers are
  // described only where sourced; gas was not confirmed.
  {
    slug: "grant-county",
    seat: "Marion",
    county: "Grant County",
    state: "Indiana",
    eyebrow: "Marion, Gas City & Upland",
    intro:
      "Grant County splits permits three ways — Marion, the county's area plan commission, and Gas City — and its permit form has a section just for manufactured home set-up. Septic starts with a certified soil scientist, and the Mississinewa runs through Marion. Here is the order things happen in.",
    towns: ["Marion", "Gas City", "Jonesboro", "Fairmount", "Upland", "Swayzee", "Van Buren", "Sweetser", "Matthews"],
    driveNote:
      "I-69 crosses the county, with US 35 and State Roads 9, 13, 18 and 5 reaching Marion and the towns, so most of a delivery is on through routes. " + PER_ROUTE,
    points: [
      "A permit form with its own manufactured-home set-up section",
      "Contractors registered with the area plan commission",
      "Certified soil scientist first for any septic permit",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "The Grant County Area Plan Commission, on South Adams Street in Marion, covers the unincorporated county and the towns of Van Buren, Upland, Matthews, Jonesboro, Fairmount and Sweetser. Marion runs its own planning and building departments, and Gas City is outside the area plan commission's list. Ask first which office has your parcel.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "Marion" },
      { label: "County and towns", value: "Grant County Area Plan Commission" },
      { label: "Inside Marion", value: "City Planning, then Building" },
      { label: "Septic", value: "Grant County Health Dept." },
    ],
    sections: [
      {
        heading: "A permit form written with manufactured homes in mind",
        paragraphs: [
          "The area plan commission's residential permit form has its own section for manufactured home set-up and asks for the foundation contractor's state licence. Nothing can be occupied until every inspection has passed and a certificate of occupancy is issued. Contractors working in the commission's jurisdiction must also register with it — registration moved online in 2024 — so ask your foundation, set-up and utility crews whether theirs is current.",
          "Inside Marion the order is different: an Improvement Location Permit from the City Planning Department comes first, then the city's Building Department handles contractor registration, inspections and the certificate of occupancy.",
        ],
      },
      {
        heading: "Septic: soil scientist, installer, then the permit",
        paragraphs: [
          "A septic permit from the Grant County Health Department is required before a system is built, repaired or altered. The health department's own order is: hire an ARCPACS-certified soil scientist for the soil analysis (a partial list comes with the application), choose a county-registered installer, submit the application, then plan review, then the permit. Installers must hold IOWPA certification or pass the county's exam.",
          "Size the system to the bedroom count of the plan you choose, and start the soil work as soon as you own the land.",
        ],
      },
      {
        heading: "The Mississinewa through Marion",
        paragraphs: [
          "The Mississinewa River runs through Marion. The U.S. Geological Survey has published flood-inundation maps for a nine-mile reach there, and the county's hazard mitigation plan maps the floodplain. The National Weather Service notes that most county roads near the river flood in a major flood — which matters for getting to the home, not only for the home itself. Check the flood maps for any parcel near the river before you buy.",
        ],
      },
      {
        heading: "Utilities",
        paragraphs: [
          "Indiana Michigan Power serves Marion, and Gas City runs its own municipal electric utility. In the countryside, ask the electric provider for your parcel what service to the building site will take, and confirm whether natural gas reaches it before you choose a furnace.",
        ],
      },
    ],
    contacts: [
      {
        name: "Grant County Area Plan Commission",
        role: "Permits and zoning for the unincorporated county and Van Buren, Upland, Matthews, Jonesboro, Fairmount and Sweetser; contractor registration.",
        href: "https://www.in.gov/counties/grant/county-offices/area-plan/",
      },
      {
        name: "City of Marion — Planning and Building Departments",
        role: "Improvement Location Permit first, then building permits, inspections and occupancy inside Marion.",
        href: "https://cityofmarion.in.gov/government/departments/building-department/ilp-procedures",
      },
      {
        name: "Grant County Health Department — Environmental Division",
        role: "Septic permits: certified soil scientist, registered installer, application, plan review.",
        href: "https://www.in.gov/localhealth/grantcounty/environmental-division/faqs",
      },
    ],
    faqs: [
      {
        question: "Who issues the permit for a manufactured home in Grant County?",
        answer:
          "In the unincorporated county and six of its towns, the Grant County Area Plan Commission, whose permit form has a manufactured-home set-up section. Inside Marion, the city's Planning Department issues the location permit and its Building Department the rest.",
      },
      {
        question: "Do my contractors need to register?",
        answer:
          "Yes, with the Grant County Area Plan Commission for work in its jurisdiction, and with the city in Marion. Ask each contractor before you hire them.",
      },
      {
        question: "How does the septic permit work in Grant County?",
        answer:
          "Certified soil scientist first, then a county-registered installer, then the application, plan review and the permit — in that order, before any work begins.",
      },
      {
        question: "Do you deliver to Marion and Gas City?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "A Champion home in Marion & Grant County, IN: who issues permits, the manufactured-home set-up permit, contractor registration, septic and the Mississinewa.",
  },
  // Sources checked 2026-10-28: Census QuickFacts (12,112); the Blackford County
  // joint zoning ordinance (county, Hartford City, Montpelier, Shamrock Lakes;
  // revised through 2021); the Blackford County Health Department's septic page,
  // installer-licence reminder and pre-1985 point-of-sale inspection rule; I&M's
  // tariff listing Hartford City; USGS gauge on Big Lick Creek near Hartford
  // City; EDP Renewables on Teays River Wind Farm; Inside Indiana Business on
  // Prairie Creek wind and I&M's purchase agreement; INDOT county map. Gas
  // provider and the ordinance's manufactured-home text were not confirmed.
  {
    slug: "blackford-county",
    seat: "Hartford City",
    county: "Blackford County",
    state: "Indiana",
    eyebrow: "Hartford City & Montpelier",
    intro:
      "Blackford County is one of Indiana's smallest, with one zoning ordinance for the county and its towns, septic installers who must hold a county licence every year, and a point-of-sale septic inspection that matters if you are replacing an older home. Here is how placing a Champion home works here.",
    towns: ["Hartford City", "Montpelier", "Shamrock Lakes", "Roll"],
    driveNote:
      "State Road 26 crosses the county east to west through Hartford City, with State Roads 3 and 18 north and south, so the highway part of a delivery is short; the lane to your lot is what we ask about. " + PER_ROUTE,
    points: [
      "One zoning ordinance for the county and its towns",
      "Septic installers licensed by the county every year",
      "Older septic systems inspected when a property sells",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "The Blackford County Area Plan Commission administers one joint zoning ordinance covering the unincorporated county, Hartford City, Montpelier and Shamrock Lakes, revised most recently in 2021. Ask the plan commission which district your parcel is in and what it requires for a manufactured home before you buy the land.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "Hartford City" },
      { label: "Zoning", value: "Blackford County Area Plan Commission" },
      { label: "Septic", value: "Blackford County Health Dept." },
      { label: "Electric in Hartford City", value: "Indiana Michigan Power" },
    ],
    sections: [
      {
        heading: "One ordinance, one plan commission",
        paragraphs: [
          "Blackford County, home to about 12,100 people, keeps its zoning in one ordinance shared by the county, Hartford City, Montpelier and the town of Shamrock Lakes. Wherever your land is, the rules come from the same document and the same plan commission — though the district your parcel sits in still sets what is allowed on it.",
        ],
      },
      {
        heading: "Replacing an older home? Check the septic first",
        paragraphs: [
          "Blackford County requires residential septic systems built before 1985 to be inspected when the property is offered for sale. If you are buying a lot with an old home or an old trailer on it to replace with a new Champion home, find out when the existing system went in and what its inspection found — a failing system may need replacing before anything else can happen.",
          "For a new system, the health department's septic page lists soil scientists who work in the county, and every septic installer must hold a Blackford County septic contractor licence, renewed each year. Ask yours to show it before you sign. Size the system to the bedroom count of the plan you choose.",
        ],
      },
      {
        heading: "Big Lick Creek and the low ground",
        paragraphs: [
          "Big Lick Creek runs through Licking Township, where Hartford City sits, and the U.S. Geological Survey keeps a stream gauge on it near the city. If a parcel borders the creek or one of its ditches, have your surveyor check the flood maps for the building site before you buy, and plan the grading so water runs away from the foundation.",
        ],
      },
      {
        heading: "Wind farms coming to the county",
        paragraphs: [
          "Two wind projects are planned here: EDP Renewables' Teays River Wind Farm just east of Hartford City, and RWE's Prairie Creek project, expected online in 2028 with Indiana Michigan Power buying its output. If you are looking at farm ground in the east or south of the county, ask the plan commission whether the parcel is near a project area, and visit at different times before you buy.",
          "Indiana Michigan Power serves Hartford City; for a rural parcel, ask the electric provider for your address what it takes to bring service to the building site.",
        ],
      },
    ],
    contacts: [
      {
        name: "Blackford County Area Plan Commission",
        role: "Zoning under the joint ordinance for the county, Hartford City, Montpelier and Shamrock Lakes.",
      },
      {
        name: "Blackford County Health Department",
        role: "Septic permits, the county soil scientist list, installer licensing and pre-1985 system inspections at sale.",
        href: "https://www.in.gov/localhealth/blackfordcounty/environmental-health/septic",
      },
    ],
    faqs: [
      {
        question: "Who handles zoning for a manufactured home in Hartford City?",
        answer:
          "The Blackford County Area Plan Commission. One zoning ordinance covers the county, Hartford City, Montpelier and Shamrock Lakes, so the same office answers wherever your land is.",
      },
      {
        question: "I'm replacing an old home on my lot. What about the septic?",
        answer:
          "If the system was built before 1985, Blackford County requires an inspection when the property is offered for sale. Find out its age and condition before you plan the new home; it may need replacing.",
      },
      {
        question: "Does my septic installer need a licence?",
        answer:
          "Yes. Every septic installer working in Blackford County needs a county septic contractor licence, renewed each year. Ask to see it before you hire.",
      },
      {
        question: "Do you deliver to Hartford City and Montpelier?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "A Champion home in Hartford City & Blackford County, IN: one joint zoning ordinance, licensed septic installers, pre-1985 septic checks and planned wind farms.",
  },
  // Sources checked 2026-10-28: Census QuickFacts (35,962); in.gov's Miami
  // County places list; the county Planning Department/Building Commission
  // directory (unincorporated areas only) and Plan Commission page; the 2024
  // county notice on the Peru, Bunker Hill and Converse fringe jurisdiction
  // (adoption not confirmed); Peru's code (own Building & Zoning); the county
  // health department's septic page (county ordinance; site visit to verify an
  // existing system's diagrams); SBOA on Peru Utilities; Miami-Cass REMC;
  // NIPSCO's gas town index; Grissom ARB on its land-use studies; the county
  // EDA's school list.
  {
    slug: "miami-county",
    seat: "Peru",
    county: "Miami County",
    state: "Indiana",
    eyebrow: "Peru, Bunker Hill & Converse",
    intro:
      "Miami County is home to Grissom Air Reserve Base and to Peru's own city utility, and who zones the land just outside Peru, Bunker Hill and Converse was under review in 2024. Here is who to ask, and in what order, before you place a Champion home here.",
    towns: ["Peru", "Bunker Hill", "Converse", "Denver", "Macy", "Amboy"],
    driveNote:
      "US 24 and US 31 meet near Peru, so the highway part of a delivery is direct; the county road and lane to your site are what we ask about. " + PER_ROUTE,
    points: [
      "County permits for the unincorporated areas; Peru has its own office",
      "Fringe-area zoning around three towns under review",
      "Grissom Air Reserve Base land-use studies",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "The Miami County Planning Department and Building Commission, on North Broadway in Peru, issue building permits for the unincorporated county only, and the county plan commission meets on the second Wednesday of each month. The City of Peru runs its own Building and Zoning Department with its own plan commission. Ask first which office has your parcel.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "Peru" },
      { label: "County permits", value: "Planning Dept. & Building Commission" },
      { label: "Electric in Peru", value: "Peru Utilities (city-owned)" },
      { label: "Septic", value: "Miami County Health Dept." },
    ],
    sections: [
      {
        heading: "Just outside town? Ask who zones it",
        paragraphs: [
          "Peru, Bunker Hill and Converse have each zoned some of the land around their limits. In 2024 the county gave notice of a proposal to end those three plan commissions' jurisdiction over that adjoining land, and we could not confirm the outcome. If your parcel is near any of the three, ask the county planning department which body zones it today, because that decides whose ordinance, permit and appeals board apply.",
        ],
      },
      {
        heading: "Grissom Air Reserve Base",
        paragraphs: [
          "Grissom Air Reserve Base sits in the west of the county near the Cass County line. It has had noise and land-use compatibility studies since 1978, and it takes part in a joint land use study with the surrounding communities. We found no adopted county overlay zone around the base, but if you are looking at land near it, ask the planning department whether the parcel falls in a studied noise or accident-potential area, and visit to hear the aircraft before you buy.",
        ],
      },
      {
        heading: "Septic, especially when you replace a home",
        paragraphs: [
          "Septic systems are permitted by the Miami County Health Department under a county ordinance as well as the state rule. If you are replacing an older home and want to use the existing system, the department requires a site visit to verify the system's diagrams before you hook up to it — find out early whether the old system can be reused or must be replaced.",
        ],
      },
      {
        heading: "City utility, co-op and gas",
        paragraphs: [
          "Peru Utilities, owned by the city, supplies electricity, water and wastewater in Peru and also serves the Grissom Aeroplex. Miami-Cass REMC, headquartered in Peru, serves rural Miami and Cass counties. NIPSCO supplies natural gas in Peru. Ask the provider for your parcel what service to the building site will take.",
          "The county's schools are Peru Community, Maconaquah, North Miami and Oak Hill United, which reaches into Grant County. Confirm the district for your exact address.",
        ],
      },
    ],
    contacts: [
      {
        name: "Miami County Planning Department & Building Commission",
        role: "Building permits for the unincorporated county; the plan commission meets on the second Wednesday.",
        href: "https://www.miamicountyin.gov/Directory.aspx?did=38",
      },
      {
        name: "City of Peru — Building and Zoning Department",
        role: "Permits and zoning inside Peru.",
      },
      {
        name: "Miami County Health Department — Environmental Division",
        role: "Septic permits under the county ordinance; site visits to verify an existing system.",
        href: "https://www.in.gov/localhealth/miamicounty/environmental-health/septic/",
      },
    ],
    faqs: [
      {
        question: "Who issues the permit for a manufactured home in Miami County?",
        answer:
          "In the unincorporated county, the Miami County Planning Department and Building Commission. Inside Peru, the city's Building and Zoning Department. Near Peru, Bunker Hill or Converse, ask the county which body zones the parcel today.",
      },
      {
        question: "Is land near Grissom Air Reserve Base a problem?",
        answer:
          "Not automatically, but the base has noise and land-use compatibility studies. Ask the planning department whether the parcel is in a studied area, and visit before you buy.",
      },
      {
        question: "Can I reuse the septic system from the home I'm replacing?",
        answer:
          "Possibly. The Miami County Health Department requires a site visit to verify the existing system's diagrams before a new home is connected to it.",
      },
      {
        question: "Do you deliver to Peru and Bunker Hill?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "A Champion home in Peru & Miami County, IN: county vs. city permits, fringe zoning near three towns, Grissom land-use studies, septic reuse and Peru Utilities.",
  },
  // Sources checked 2026-10-28: Census QuickFacts (46,095); the Town of Culver's
  // building-permit page (county online permit system; Beacon GIS); Plymouth's
  // building and plan commission page; the Marshall County Health Department's
  // onsite sewage page and 2022 permit-procedure guidance (registered soil
  // scientist; operating permits for some newer technologies) and its well
  // permitting guidance (septic located before well design; two-year permit;
  // 2017 ordinance); Marshall County REMC; the state's school-district map;
  // USGS SIR 2016-5117 (Yellow River flood-inundation maps at Plymouth);
  // DNR's Lake Preservation Act guidance.
  {
    slug: "marshall-county",
    seat: "Plymouth",
    county: "Marshall County",
    state: "Indiana",
    eyebrow: "Plymouth, Bremen & Culver",
    intro:
      "Marshall County ties the well to the septic — the septic system has to be located before a well design is approved — and some newer septic systems need an operating permit kept up for as long as you own them. Add Lake Maxinkuckee and the Yellow River, and here is what to plan for with a Champion home here.",
    towns: ["Plymouth", "Bremen", "Culver", "Argos", "Bourbon", "La Paz"],
    driveNote:
      "US 30 and US 31 cross near Plymouth, so the highway part of a delivery is direct; lake roads around Culver and the lane to your lot are what we ask about. " + PER_ROUTE,
    points: [
      "Well design approved only after the septic is located",
      "Operating permits for some newer septic systems",
      "Lake Maxinkuckee shoreline under DNR rules",
      "Freight quoted per route as its own line",
    ],
    zoningNote:
      "The Marshall County Plan Commission and Board of Zoning Appeals handle zoning in the unincorporated county, and building permits go through the county's online permit system — the Town of Culver points its residents there too, with zoning districts on the county's Beacon GIS map. The City of Plymouth runs its own building department and plan commission. Ask which applies to your parcel first.",
    frostDepth: FOOTINGS,
    facts: [
      { label: "County seat", value: "Plymouth" },
      { label: "Zoning", value: "Marshall County Plan Commission" },
      { label: "Septic and wells", value: "Marshall County Health Dept." },
      { label: "Rural electric co-op", value: "Marshall County REMC (Plymouth)" },
    ],
    sections: [
      {
        heading: "The septic decides where the well goes",
        paragraphs: [
          "The Marshall County Health Department will not approve a well design until the septic system has been located — from past permit records or by a septic inspector. A new septic system starts with a soil evaluation by a certified, registered soil scientist. So the order on a rural lot is: soil evaluation, septic design, then the well. A well permit is good for two years under the county's 2017 well ordinance, and although emergency drilling can happen before a permit, the water cannot be used for drinking until the well is permitted and inspected.",
        ],
      },
      {
        heading: "Some septic systems need a permit to keep running",
        paragraphs: [
          "Some newer septic technologies — the kind used where the soil is poor for a standard field — need an operating permit from the health department that has to be kept current. If the soil scientist's report points you toward one of those systems, ask what the operating permit requires before you choose it, because it is an ongoing obligation, not a one-time fee.",
        ],
      },
      {
        heading: "Lake Maxinkuckee and the Yellow River",
        paragraphs: [
          "Lake Maxinkuckee at Culver is one of Indiana's largest natural lakes. Like other public freshwater lakes, work at or lakeward of its shoreline — a seawall, a pier footing, regrading at the water — needs Indiana DNR approval, and applications go through a 30-day public notice. Plan lakefront work early.",
          "The Yellow River runs through Plymouth. The U.S. Geological Survey published flood-inundation maps for a 4.9-mile reach there in 2016, built on the county's flood insurance study. Check those maps for any lot near the river before you buy.",
        ],
      },
      {
        heading: "Power and schools",
        paragraphs: [
          "Marshall County REMC, based in Plymouth and serving members since 1935, supplies much of the countryside. Ask the electric provider for your parcel what service to the building site will take, and confirm whether natural gas reaches it. The county's school corporations are Plymouth, Bremen, Culver, Argos, Triton and Union-North United; Triton and Union-North reach into neighbouring counties, so confirm the district for your address.",
        ],
      },
    ],
    contacts: [
      {
        name: "Marshall County Plan Commission",
        role: "Zoning and the online building-permit system for the unincorporated county; Culver residents use it too.",
      },
      {
        name: "Marshall County Health Department — Environmental",
        role: "Septic permits (registered soil scientist; operating permits for some systems) and well permits.",
        href: "https://www.in.gov/localhealth/marshallcounty/environmental/onsite-sewage-systems-septic-system",
      },
      {
        name: "City of Plymouth — Building Department and Plan Commission",
        role: "Permits and zoning inside Plymouth.",
      },
      {
        name: "Indiana DNR, Division of Water",
        role: "Approvals for work at or lakeward of the shoreline of Lake Maxinkuckee and other public lakes.",
        href: "https://www.in.gov/dnr/water/",
      },
    ],
    faqs: [
      {
        question: "Why does my well have to wait for the septic in Marshall County?",
        answer:
          "The health department will not approve a well design until the septic system is located, so the two stay a safe distance apart. Do the soil evaluation and septic design first.",
      },
      {
        question: "What is a septic operating permit?",
        answer:
          "Some newer septic technologies in Marshall County need an operating permit from the health department that has to be kept up. Ask what it involves if your soil report points you to one.",
      },
      {
        question: "Can I build on Lake Maxinkuckee?",
        answer:
          "The home is a zoning and permit question for the county or town, but any work at or lakeward of the shoreline needs Indiana DNR approval, with a 30-day public notice.",
      },
      {
        question: "Do you deliver to Plymouth and Culver?",
        answer: "Yes. We deliver across Indiana, with freight quoted per route as its own line on your quote.",
      },
    ],
    metaDescription:
      "A Champion home in Plymouth & Marshall County, IN: septic before well, septic operating permits, Lake Maxinkuckee shoreline rules and Yellow River flood maps.",
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
