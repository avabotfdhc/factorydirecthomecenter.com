// Locally-authored blog posts, merged with CMS posts in api-content.ts.
// Use for editorial content published from the repo (reviewed in a PR) rather
// than through the external CMS admin. Keep claims consistent with site copy:
// price RANGES only (quotes are line-item, "contact for pricing"), and site
// work / setup is done by the buyer's own contractors — never claim FDHC
// performs setup or site work.

import type { ApiBlogDetail } from "./api-content";

export const localBlogPosts: ApiBlogDetail[] = [
  {
    slug: "manufactured-homes-fort-wayne-buyers-guide",
    title: "Buying a Manufactured Home Near Fort Wayne: A 2026 Buyer's Guide",
    excerpt:
      "What Fort Wayne and Allen County buyers should know before purchasing a manufactured or modular home — placement options, costs, delivery, and why the best deals are 25 minutes up the road.",
    image: "/images/homepage/double-wides.webp",
    date: "August 12, 2026",
    html: `
<p>Fort Wayne's housing market has priced a lot of good people out of a new site-built home. If you're one of them, a new manufactured or modular home is the most realistic path to new construction in northeast Indiana — and Fort Wayne buyers have a geographic advantage most of the country doesn't: you live about 25 minutes from a factory-direct Champion dealer, and under an hour from the largest Champion factory in the country. Here's what that means for you, and what to know before you buy.</p>

<h2>Why Fort Wayne buyers shop in Auburn</h2>
<p>Our showroom at 1211 State Road 8 in Auburn is about 25 minutes north of Fort Wayne, straight up I-69. That drive matters for two reasons. First, you can walk through real model homes — floor plans on a screen don't tell you how a kitchen feels. Second, the factory that builds these homes is in Topeka, Indiana, about 20 miles from us. Freight is one of the biggest hidden costs in manufactured housing, and homes that travel a short distance cost less to deliver than homes trucked in from hundreds of miles away. That saving shows up in your quote.</p>

<h2>Where can you put a manufactured home around Fort Wayne?</h2>
<p>You have three main options in the Fort Wayne area:</p>
<ul>
  <li><strong>Your own land.</strong> Rural and unincorporated areas of Allen County — and neighboring DeKalb, Whitley, and Noble counties — allow manufactured homes on private land in many zoning districts. Rules vary parcel by parcel, so you or your contractor verify zoning and setbacks and pull the permits for your specific site. Our <a href="/guides/zoning">zoning guide</a> covers how this works in Indiana.</li>
  <li><strong>A land-lease community.</strong> The Fort Wayne area has established manufactured home communities where you own the home and lease the lot — the lowest cash-to-move-in option.</li>
  <li><strong>A modular home on a permanent foundation.</strong> Built to the same Indiana residential code as site-built houses, modular homes can go where site-built homes go — including many Fort Wayne suburbs — and finance with conventional mortgages.</li>
</ul>

<h2>What it costs</h2>
<p>Most new manufactured homes we sell fall between <strong>$50,000 and $150,000</strong> for the home itself — single wides typically starting around $50,000, double wides around $80,000, and IRC-code modular homes around $100,000. Compare that with what new site-built construction runs in Allen County and the math explains why factory-built housing is the fastest-growing path to homeownership in the region. For a deeper cost breakdown, read our <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a> — and remember our quotes are line-item: the home, the options, the delivery, each priced separately so you can compare honestly against any other dealer.</p>
<p>Site work — foundation or pad, utilities, driveway — is separate, and in our model <strong>you hire your own licensed contractors</strong> for it. Most buyers save money that way versus dealer-bundled site work, and we can share a referral list of licensed and insured contractors past customers around Fort Wayne have used.</p>

<h2>How delivery works from here</h2>
<p>Once your home is built at the Topeka factory, it's transported to your site — a short, low-cost trip anywhere in the Fort Wayne area, including New Haven, Huntertown, Churubusco, Columbia City, and the surrounding counties. From order to move-in typically runs 8&ndash;12 weeks: 6&ndash;8 weeks of factory build time, plus site preparation and permitting that your contractor can run in parallel.</p>

<h2>Financing for Fort Wayne buyers</h2>
<p>Manufactured home financing is a specialty, and we work with the lenders who do it every day: 21st Mortgage, Triad Financial Services, Credit Human, and Lake Michigan Credit Union. Home-only (chattel) loans, land-home packages, and conventional financing for modular homes are all on the table. Start with our <a href="/financing">financing page</a> to see how the options compare.</p>

<h2>FAQ</h2>
<h3>Do you deliver to Fort Wayne?</h3>
<p>Yes — Fort Wayne and all of Allen County are squarely in our primary delivery area, about 25 minutes from our Auburn showroom.</p>
<h3>Can I put a manufactured home inside Fort Wayne city limits?</h3>
<p>Within city limits, zoning is stricter and typically favors established manufactured home communities or modular construction on permanent foundations. On rural land outside the city, private-land placement is common. Verify the rules for your specific parcel before you buy — we can point you to the right county offices.</p>
<h3>What's the difference between buying from you and a Fort Wayne area dealer lot?</h3>
<p>Factory-direct pricing and line-item transparency. We're an authorized Champion dealer 20 miles from the factory, we don't bundle mystery costs, and you stay in control of site work with your own contractors. See <a href="/locations/fort-wayne">our Fort Wayne page</a> for more on how we serve the area.</p>
<h3>Can I tour homes before buying?</h3>
<p>Yes — walk through model homes at our Auburn showroom, Mon&ndash;Fri 9&ndash;5 or Saturday 10&ndash;4. Browse our <a href="/floor-plans">70+ Champion floor plans</a> first, then <a href="/contact-us">let us know</a> which ones you want to see in person.</p>
`,
  },
  {
    slug: "manufactured-home-cost-indiana",
    title: "How Much Does a Manufactured Home Cost in Indiana? (2026 Guide)",
    excerpt:
      "Real 2026 price ranges for single wide, double wide, and modular homes in Indiana — plus the cost drivers dealers don't explain and how line-item pricing works.",
    image: "/images/homepage/hero-banner.webp",
    date: "August 12, 2026",
    html: `
<p>If you've searched for manufactured home prices in Indiana, you've probably noticed something frustrating: almost nobody publishes real numbers. Dealers advertise "affordable homes" and then make you sit through a sales pitch to learn what anything costs. We think you deserve better context before you ever pick up the phone — so here is an honest look at what manufactured and modular homes actually cost in Indiana in 2026, what drives the price up or down, and how to read a quote so you know exactly what you're paying for.</p>

<h2>Indiana manufactured home price ranges in 2026</h2>
<p>Most new manufactured homes in Indiana fall between <strong>$50,000 and $150,000</strong> for the home itself. Where you land in that range depends mostly on the size and construction type:</p>
<ul>
  <li><strong>Single wide homes (500&ndash;1,200 sq ft):</strong> typically start around $50,000. These are efficient, smartly designed homes for first-time buyers, downsizers, or rental land placements.</li>
  <li><strong>Double wide homes (1,000&ndash;2,400 sq ft):</strong> typically start around $80,000. Sectional homes like the Brighton and Silverton series offer multiple living areas and layouts that rival site-built houses.</li>
  <li><strong>Modular homes (1,000&ndash;2,500+ sq ft):</strong> typically start around $100,000. Built to Indiana's IRC residential code and placed on permanent foundations, these are financed and appraised like site-built homes.</li>
</ul>
<p>Every home is different — options, finishes, and current factory pricing all move the number. That's why we quote each home individually rather than publishing a price sheet that would be out of date in a month. <a href="/contact-us">Ask us for a quote</a> and you'll get real, current numbers for the exact floor plan you want.</p>

<h2>What actually drives the price</h2>
<h3>1. Square footage and sections</h3>
<p>The biggest single factor. A second section (making a single wide into a double wide) adds structure, transport, and assembly cost — but also dramatically more living space per dollar than site-built construction.</p>
<h3>2. HUD code vs. IRC modular construction</h3>
<p>Manufactured homes are built to the federal HUD code on a steel chassis; modular homes are built to the same Indiana residential code as a site-built house. Modular costs more up front but opens up conventional mortgages and typically appraises like site-built housing.</p>
<h3>3. Options and finishes</h3>
<p>Upgraded kitchens, drywall throughout, energy packages, porches, and exterior upgrades each move the price. Champion's option catalog is deep — this is where two homes with the same floor plan can differ by five figures.</p>
<h3>4. Freight distance from the factory</h3>
<p>Here's an advantage of buying in northeast Indiana: Champion's largest plant in the country is in Topeka, IN — about 20 miles from our Auburn showroom. Homes that travel 20 miles cost less to deliver than homes that travel 300, and that saving lands in your quote.</p>

<h2>The costs that are NOT in the home price</h2>
<p>Any honest cost guide has to mention these, because they surprise buyers everywhere:</p>
<ul>
  <li><strong>Land</strong> — owned, purchased, or a leased community lot.</li>
  <li><strong>Site work</strong> — foundation or pad, utility connections, driveway, and grading. In our model, <strong>you hire your own licensed contractors</strong> for site work and setup. Most buyers save money this way compared to dealer-bundled site work, and we can share a referral list of licensed and insured contractors past customers have used.</li>
  <li><strong>Permits</strong> — pulled by you or your contractor; county requirements vary across Indiana.</li>
  <li><strong>Taxes and title/registration fees.</strong></li>
</ul>

<h2>How line-item pricing protects you</h2>
<p>Most dealers quote one bundled number, which makes it impossible to tell what the home costs versus what the extras cost. We quote line by line: the home, the options, the delivery. You see each number, you can compare fairly against any other dealer, and you stay in control of the parts of the project — like site work — where hiring your own contractor saves money. Read more in our <a href="/guides/pricing">pricing guide</a>.</p>

<h2>Financing a manufactured home in Indiana</h2>
<p>Financing is often easier than buyers expect. We work with lenders who specialize in factory-built housing — 21st Mortgage, Triad Financial Services, Credit Human, and Lake Michigan Credit Union — covering chattel (home-only) loans, land-home packages, and conventional financing for modular homes. Our <a href="/financing">financing page</a> and <a href="/guides/financing">financing guide</a> walk through the options and what lenders look for.</p>

<h2>FAQ</h2>
<h3>Is a manufactured home cheaper than building on-site in Indiana?</h3>
<p>Almost always, per square foot. Factory construction avoids weather delays, bulk-buys materials, and builds with repeatable quality control. That's how a 1,500 sq ft double wide can cost a fraction of a comparable site-built home.</p>
<h3>Do manufactured homes hold their value?</h3>
<p>Modern HUD-code and IRC-code homes hold value well, especially on permanent foundations on owned land. Modular homes appreciate similarly to site-built houses.</p>
<h3>What's the cheapest way to get into a new home?</h3>
<p>A single wide on land you already own or a leased lot is usually the lowest total cost of entry for new construction in Indiana.</p>
<h3>How do I get an exact price?</h3>
<p>Pick a floor plan from our <a href="/floor-plans">70+ Champion floor plans</a> and <a href="/contact-us">request a quote</a>, or visit the showroom at 1211 State Road 8, Auburn, IN. You'll get current, line-item numbers for exactly the home and options you want — no pressure, no bundled mystery pricing.</p>
`,
  },
  {
    slug: "manufactured-homes-auburn-indiana-guide",
    title: "Manufactured Homes in Auburn, Indiana: Buying on Our Home Turf",
    excerpt:
      "Auburn is where our showroom lives — here's what DeKalb County buyers should know about touring models, placing a home on local land, and why Auburn is the center of our delivery map.",
    image: "/images/homepage/single-wides.webp",
    date: "August 12, 2026",
    html: `
<p>Every dealer says they serve your town. Auburn is different for us — it's our town. Our showroom sits at 1211 State Road 8, our team drives these county roads every day, and more of our homes are delivered in DeKalb County than anywhere else. If you're an Auburn-area buyer, here's what that home-field advantage means for you.</p>
<h2>Tour real homes, ten minutes from anywhere in Auburn</h2>
<p>Photos don't tell you whether a kitchen island crowds the walkway or how a primary suite actually feels. Because the showroom is local, you can stop in on a lunch break, walk through model homes, and come back with your spouse on Saturday. We're open Mon&ndash;Fri 9&ndash;5 and Saturday 10&ndash;4 — browse our <a href="/floor-plans">Champion floor plans</a> before you visit.</p>
<h2>Placing a home in DeKalb County</h2>
<p>Much of DeKalb County outside city limits allows manufactured homes on private land, and modular homes on permanent foundations fit nearly anywhere a site-built house can go. Zoning and setbacks are parcel-specific: you or your contractor verify the rules and pull the permits, and because the county offices are minutes away, we can point you to exactly the right desk. Our <a href="/guides/zoning">zoning guide</a> explains the process.</p>
<h2>The factory question</h2>
<p>Champion's Topeka plant — the largest Champion factory in the country — is about 20 miles from Auburn. Short freight means lower delivery cost on your line-item quote, and it's why Auburn buyers consistently see some of the lowest delivered prices in our service area. Most homes fall between $50,000 and $150,000 depending on size and options; see the full breakdown in our <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a>.</p>
<h2>FAQ</h2>
<h3>Do you deliver inside Auburn city limits?</h3>
<p>We deliver anywhere in the area — city-limit placements depend on zoning, which typically favors established communities or modular construction; rural DeKalb parcels are usually simpler. We'll help you check your specific address.</p>
<h3>What towns near Auburn do you serve?</h3>
<p>All of DeKalb County — Garrett, Waterloo, Butler, St. Joe, Corunna, Ashley — plus the wider region. See <a href="/locations/auburn">our Auburn page</a> for the full picture.</p>
`,
  },
  {
    slug: "manufactured-homes-garrett-indiana",
    title: "Manufactured Homes in Garrett, Indiana: New Construction Minutes From Our Showroom",
    excerpt:
      "Garrett buyers are about ten minutes from our Auburn showroom. What to know about buying a new Champion home in this DeKalb County rail town.",
    image: "/images/homepage/double-wides.webp",
    date: "August 12, 2026",
    html: `
<p>Garrett grew up around the railroad, and it's still the kind of DeKalb County town where a dollar should buy real value. For homebuyers, that's exactly what factory-built housing delivers: new construction — new roof, new furnace, new warranty — at a price no site-built home in the county can match.</p>
<h2>Ten minutes to the showroom</h2>
<p>Our Auburn showroom on State Road 8 is roughly a ten-minute drive from Garrett. That makes the buying process unusually easy: tour model homes after work, bring your questions back as many times as you like, and deal with people who know Garrett — not a call center three states away.</p>
<h2>Land options around Garrett</h2>
<p>Buyers around Garrett typically choose between rural DeKalb County acreage — where manufactured homes are permitted on many parcels — and placing a modular home on a permanent foundation closer to town. Zoning is parcel-specific; you or your contractor verify requirements and pull permits with the county, and our <a href="/guides/zoning">zoning guide</a> walks through how that works.</p>
<h2>What Garrett buyers pay</h2>
<p>Most of our homes land between $50,000 and $150,000 — single wides from around $50,000, double wides from around $80,000, modular from around $100,000 — with delivery costs among the lowest anywhere we serve, because Garrett sits minutes from both our lot and short freight range of Champion's Topeka factory. Our <a href="/blog/manufactured-home-cost-indiana">cost guide</a> explains every line of the quote.</p>
<h2>FAQ</h2>
<h3>How fast can I be in a new home in Garrett?</h3>
<p>Typically 8&ndash;12 weeks from order: 6&ndash;8 weeks of factory build, with your contractor's site prep running in parallel.</p>
<h3>Where do I start?</h3>
<p>Browse <a href="/floor-plans">floor plans</a>, then visit the showroom or <a href="/contact-us">request a quote</a>. More local detail on <a href="/locations/garrett">our Garrett page</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-waterloo-indiana",
    title: "Manufactured Homes in Waterloo, Indiana: A Practical Path to a New Home",
    excerpt:
      "Waterloo sits minutes up the road from our Auburn showroom. Here's how DeKalb County buyers in Waterloo get into new factory-built homes at factory-direct prices.",
    image: "/images/homepage/feature-find-home.webp",
    date: "August 12, 2026",
    html: `
<p>Waterloo is one of the closest towns in Indiana to our showroom — a few minutes north of Auburn along the I-69 corridor. If you're renting in Waterloo or holding onto an aging house because new construction feels out of reach, the math on a new manufactured home is worth twenty minutes of your time.</p>
<h2>Why proximity pays</h2>
<p>Two of the biggest soft costs in manufactured housing are freight and logistics. Waterloo effectively eliminates both: our lot is minutes away, and Champion's Topeka factory — where your home is built — is about 20 miles from Auburn. Shorter trips mean lower delivery line items on your quote, and simpler scheduling for your contractor.</p>
<h2>Your placement options</h2>
<p>Rural parcels around Waterloo and across DeKalb County commonly allow manufactured homes; modular homes on permanent foundations extend your options closer to town. As everywhere in Indiana, zoning is parcel-by-parcel — you or your contractor confirm the rules and pull permits, and we can point you to the right DeKalb County offices. Details in our <a href="/guides/zoning">zoning guide</a>.</p>
<h2>Costs, honestly</h2>
<p>Expect most homes to fall between $50,000 and $150,000 depending on size and options. Every quote we write is line-item — home, options, delivery, each priced separately — so you can compare us against anyone. Start with the <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a>, then browse <a href="/floor-plans">70+ Champion floor plans</a>.</p>
<h2>FAQ</h2>
<h3>Can I see homes in person?</h3>
<p>Yes — model homes are open at our Auburn showroom, Mon&ndash;Fri 9&ndash;5 and Saturday 10&ndash;4, a few minutes' drive from Waterloo. See <a href="/locations/waterloo">our Waterloo page</a> for more.</p>
<h3>Who does the site work?</h3>
<p>You hire your own licensed contractors for foundation, utilities, and setup — most buyers save money that way, and we can share a referral list of licensed and insured contractors past customers have used.</p>
`,
  },
  {
    slug: "manufactured-homes-butler-indiana",
    title: "Manufactured Homes in Butler, Indiana: Eastern DeKalb County's Factory-Direct Option",
    excerpt:
      "Butler buyers near the Ohio line are a short drive from our Auburn showroom — and from Champion's factory. What to know about new manufactured homes in eastern DeKalb County.",
    image: "/images/homepage/about-2.webp",
    date: "August 12, 2026",
    html: `
<p>Butler anchors the eastern edge of DeKalb County, close enough to the Ohio line that plenty of families shop both states. Wherever you land, the housing math is the same: new site-built construction has outrun local budgets, and a new Champion manufactured or modular home is the practical way to get new construction on your own terms.</p>
<h2>A short drive, a real showroom</h2>
<p>Our Auburn showroom is an easy drive west from Butler on State Road 8 — the same road. Walk through model homes, compare layouts side by side, and get line-item numbers for exactly the home you want. Hours are Mon&ndash;Fri 9&ndash;5, Saturday 10&ndash;4.</p>
<h2>Placing a home around Butler</h2>
<p>Eastern DeKalb County is largely rural, and many parcels allow manufactured homes on private land; modular homes on permanent foundations broaden the options further. You or your contractor verify zoning for your parcel and pull the permits — our <a href="/guides/zoning">zoning guide</a> covers the Indiana process, and we serve Ohio buyers across the line too.</p>
<h2>What it costs</h2>
<p>Most homes run $50,000&ndash;$150,000 depending on size and options — singles from about $50,000, doubles from about $80,000, modular from about $100,000 — and Butler's proximity to the Topeka factory keeps the delivery line low. Full breakdown in the <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a>.</p>
<h2>FAQ</h2>
<h3>Do you serve buyers just across the Ohio line?</h3>
<p>Yes — we deliver throughout Ohio, including the countryside just east of Butler. See <a href="/locations">all the areas we serve</a>.</p>
<h3>Where do I start?</h3>
<p>Browse <a href="/floor-plans">floor plans</a>, then <a href="/contact-us">contact us</a> or stop by. Local details on <a href="/locations/butler">our Butler page</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-kendallville-indiana",
    title: "Manufactured Homes in Kendallville, Indiana: Noble County's Straightforward Path to New Construction",
    excerpt:
      "Kendallville is about 25 minutes from our Auburn showroom. Here's how Noble County buyers put new Champion homes on rural land — and what it costs.",
    image: "/images/homepage/feature-find-land.webp",
    date: "August 12, 2026",
    html: `
<p>Kendallville is Noble County's commercial hub, and the countryside around it is exactly the kind of place factory-built housing shines: rural parcels, reasonable land prices, and county zoning that accommodates manufactured homes on many private lots. Add a 25-minute drive to our Auburn showroom and Kendallville buyers have one of the simplest paths to new construction in northeast Indiana.</p>
<h2>Rural Noble County land works in your favor</h2>
<p>Much of Noble County outside municipal limits permits manufactured homes on private land, and modular homes on permanent foundations extend your reach into more restrictive districts. Rules are parcel-specific — you or your contractor verify zoning and setbacks and pull permits with Noble County. Our <a href="/guides/zoning">zoning guide</a> explains each step.</p>
<h2>Close to the showroom, close to the factory</h2>
<p>Our Auburn showroom at 1211 State Road 8 is about a 25-minute drive from Kendallville, and your home is built at Champion's Topeka plant — the largest Champion factory in the country — a short freight hop away. Short distances show up as real savings on the delivery line of your quote.</p>
<h2>The numbers</h2>
<p>Most homes fall between $50,000 and $150,000: single wides from around $50,000, double wides from around $80,000, IRC-code modular from around $100,000. Quotes are line-item, and site work is handled by your own licensed contractors — most buyers save money that way. Details in the <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a>.</p>
<h2>FAQ</h2>
<h3>What Noble County towns do you serve from Kendallville?</h3>
<p>All of them — Albion, Ligonier, Rome City, Avilla, Wolcottville, and the surrounding countryside. See <a href="/locations/kendallville">our Kendallville page</a> and <a href="/locations/noble-county">Noble County page</a>.</p>
<h3>How long until move-in?</h3>
<p>Typically 8&ndash;12 weeks from order — 6&ndash;8 weeks of factory build with site prep in parallel. Browse <a href="/floor-plans">floor plans</a> to start.</p>
`,
  },
  {
    slug: "manufactured-homes-albion-indiana",
    title: "Manufactured Homes in Albion, Indiana: New Homes Near the County Seat",
    excerpt:
      "Albion buyers are about half an hour from our Auburn showroom — and steps from the Noble County offices where their permits get pulled. A local look at buying factory-built.",
    image: "/images/homepage/single-wides.webp",
    date: "August 12, 2026",
    html: `
<p>Albion is Noble County's seat, ringed by farmland and lake country — Chain O'Lakes State Park is just down the road. It's also, quietly, one of the most convenient places in the county to put a manufactured home: rural parcels are plentiful, and the county offices that handle your zoning questions and permits are right in town.</p>
<h2>The Albion advantage: permits without the runaround</h2>
<p>Every manufactured home placement in Indiana runs through county zoning and permitting, handled by you or your contractor. Albion buyers have the shortest possible trip — the Noble County offices are local, and we can tell you exactly which desk to visit. Start with our <a href="/guides/zoning">zoning guide</a> so you know what to ask.</p>
<h2>A 30-minute trip to compare real homes</h2>
<p>Our Auburn showroom is about a half-hour drive from Albion. Walk through single wide, double wide, and modular models, then get a line-item quote — home, options, delivery, each priced separately — for the exact configuration you want from our <a href="/floor-plans">70+ Champion floor plans</a>.</p>
<h2>What Albion buyers spend</h2>
<p>Most homes land between $50,000 and $150,000 depending on size and options. Site work — pad or foundation, utilities, driveway — is separate and handled by your own licensed contractors, which is where many buyers save real money. The <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a> breaks down every driver.</p>
<h2>FAQ</h2>
<h3>Can I put a home on lake-area land near Albion?</h3>
<p>Often yes, subject to the parcel's zoning and any lake-community rules — verify before you buy land. We're happy to walk through what to check.</p>
<h3>More local info?</h3>
<p>See <a href="/locations/albion">our Albion page</a> and <a href="/locations/noble-county">Noble County page</a>, or <a href="/contact-us">get in touch</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-ligonier-indiana",
    title: "Manufactured Homes in Ligonier, Indiana: Living Closest to the Factory",
    excerpt:
      "Ligonier sits nearer to Champion's Topeka plant than almost anywhere we serve. What that means for delivery costs, timelines, and buying a new home in western Noble County.",
    image: "/images/homepage/double-wides.webp",
    date: "August 12, 2026",
    html: `
<p>Here's a fact most Ligonier residents don't realize: the largest Champion Homes factory in the country builds homes just up the road in Topeka. If you buy a new manufactured home in Ligonier, it will likely travel fewer miles to reach your site than almost any factory-built home delivered anywhere in America. That's not trivia — it's money.</p>
<h2>Why factory proximity matters in your quote</h2>
<p>Freight is one of the larger non-negotiable costs in manufactured housing, priced by distance and escort requirements. Ligonier-area deliveries are about as short as they come, and because our quotes are line-item, you'll see that saving as its own number — not buried in a bundle.</p>
<h2>Placing a home in western Noble County</h2>
<p>The countryside around Ligonier offers rural parcels where manufactured homes are commonly permitted, and modular homes on permanent foundations open up additional districts. Zoning is parcel-specific: you or your contractor verify requirements and pull permits with Noble County. Our <a href="/guides/zoning">zoning guide</a> shows the steps.</p>
<h2>Seeing the homes</h2>
<p>Our Auburn showroom is about a 40-minute drive from Ligonier — model homes open Mon&ndash;Fri 9&ndash;5, Saturday 10&ndash;4. Preview our <a href="/floor-plans">Champion floor plans</a> first, including Aspire-series homes built right in Topeka. Most fall between $50,000 and $150,000; see the <a href="/blog/manufactured-home-cost-indiana">cost guide</a> for what moves the number.</p>
<h2>FAQ</h2>
<h3>How fast can a Ligonier home be delivered once built?</h3>
<p>The factory-to-site trip is short; the overall order-to-move-in timeline still runs about 8&ndash;12 weeks, driven mostly by factory build time and your contractor's site prep.</p>
<h3>More local details?</h3>
<p>See <a href="/locations/ligonier">our Ligonier page</a> or <a href="/contact-us">request a quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-angola-indiana",
    title: "Manufactured Homes in Angola, Indiana: Lake Country Living Without the Lake-Country Price",
    excerpt:
      "Steuben County's 101 lakes make Angola one of northeast Indiana's most desirable places to live. Factory-built homes are how buyers get there affordably.",
    image: "/images/homepage/feature-find-home.webp",
    date: "August 12, 2026",
    html: `
<p>Angola and the Steuben County lake country around it — the county promotes its 101 lakes for good reason — draw two kinds of buyers: families who want to live near the water year-round, and owners replacing an aging lake cottage with something modern. Both keep discovering the same answer: a new Champion manufactured or modular home delivers new construction at a price the lake-area market otherwise doesn't offer.</p>
<h2>Lake lots and rural Steuben parcels</h2>
<p>Around the lakes, placement depends on the parcel: rural Steuben County land commonly accommodates manufactured homes, while some lake communities have their own standards — and modular homes on permanent foundations fit nearly anywhere a site-built cottage could. Verify zoning for the specific lot (you or your contractor pull the permits); our <a href="/guides/zoning">zoning guide</a> covers what to check before you buy land.</p>
<h2>A straight shot down I-69</h2>
<p>Our Auburn showroom is an easy drive south from Angola on I-69. Tour models in person, then get line-item pricing for the exact floor plan and options you want from our <a href="/floor-plans">70+ Champion plans</a>. Most homes run $50,000&ndash;$150,000 — the <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a> explains the ranges.</p>
<h2>FAQ</h2>
<h3>Can a manufactured home work as a lake home?</h3>
<p>Yes — modern HUD-code homes are fully insulated, four-season houses, and modular homes on permanent foundations finance and appraise like site-built. Many buyers use them as primary residences near the water.</p>
<h3>Do you deliver throughout Steuben County?</h3>
<p>Yes — Angola, Fremont, Hamilton, Pleasant Lake, and the surrounding townships. See <a href="/locations/angola">our Angola page</a> and <a href="/locations/steuben-county">Steuben County page</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-huntertown-indiana",
    title: "Manufactured Homes Near Huntertown, Indiana: New Construction on the Growing North Side",
    excerpt:
      "Huntertown is one of Allen County's fastest-growing corridors — and site-built prices show it. How north-side buyers use factory-built homes to keep new construction affordable.",
    image: "/images/homepage/about-2.webp",
    date: "August 12, 2026",
    html: `
<p>Huntertown and the corridor north of Fort Wayne have been growing fast, and new site-built subdivisions there price accordingly. If you want new construction on the north side without a subdivision price tag, factory-built housing is the honest alternative — especially with our showroom just up the road in Auburn.</p>
<h2>Between the city and the country</h2>
<p>Huntertown buyers sit at a sweet spot: minutes from Fort Wayne, but close to rural Allen and DeKalb County land where manufactured homes are commonly permitted on private parcels. Modular homes on permanent foundations extend the options into more developed areas. Zoning is parcel-specific — you or your contractor verify and pull permits; see the <a href="/guides/zoning">zoning guide</a>.</p>
<h2>The closest dealer to the north side</h2>
<p>From Huntertown, our Auburn showroom is a short drive north — closer than crossing Fort Wayne. Walk through models, then get line-item quotes on any of our <a href="/floor-plans">Champion floor plans</a>, built about 20 miles away at the Topeka plant. Most homes run $50,000&ndash;$150,000; details in the <a href="/blog/manufactured-home-cost-indiana">cost guide</a> and the <a href="/blog/manufactured-homes-fort-wayne-buyers-guide">Fort Wayne buyer's guide</a>.</p>
<h2>FAQ</h2>
<h3>Can I place a manufactured home in Huntertown itself?</h3>
<p>Within town limits, zoning typically favors modular construction on permanent foundations; manufactured homes are commonly placed on rural land just outside. We'll help you check your specific parcel.</p>
<h3>More local info?</h3>
<p>See <a href="/locations/huntertown">our Huntertown page</a> or <a href="/contact-us">get in touch</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-new-haven-indiana",
    title: "Manufactured Homes Near New Haven, Indiana: East Allen County's Affordable New-Build Option",
    excerpt:
      "New Haven buyers east of Fort Wayne can reach rural east-Allen land, established communities, and our Auburn showroom with ease. Here's the local playbook.",
    image: "/images/homepage/feature-financing.webp",
    date: "August 12, 2026",
    html: `
<p>New Haven has always been Fort Wayne's practical eastern neighbor — close to everything, easier on the wallet. The same logic points straight at factory-built housing: for the price of a dated fixer-upper in east Allen County, you can own brand-new construction with a manufacturer warranty.</p>
<h2>East Allen options</h2>
<p>East and southeast of New Haven, rural Allen County parcels commonly accommodate manufactured homes on private land, and established manufactured home communities offer the lowest cash-to-move-in path. Modular homes on permanent foundations — built to Indiana's residential code — fit nearly anywhere site-built homes go. As always, zoning is parcel-specific: you or your contractor verify and pull permits (<a href="/guides/zoning">how it works</a>).</p>
<h2>Getting to us is the easy part</h2>
<p>Our Auburn showroom is a straightforward drive north of New Haven. Tour single wide, double wide, and modular models, and leave with line-item pricing — home, options, delivery, each its own number. Browse <a href="/floor-plans">70+ Champion floor plans</a> first; most run $50,000&ndash;$150,000 (<a href="/blog/manufactured-home-cost-indiana">full cost guide</a>).</p>
<h2>Financing</h2>
<p>We work with the manufactured-housing specialists — 21st Mortgage, Triad Financial Services, Credit Human, Lake Michigan Credit Union — for chattel loans, land-home packages, and conventional modular financing. Start at <a href="/financing">financing</a>.</p>
<h2>FAQ</h2>
<h3>Do you deliver to New Haven and east Allen County?</h3>
<p>Yes — New Haven, Woodburn, Monroeville, and the townships between. More on <a href="/locations/new-haven">our New Haven page</a> and the <a href="/blog/manufactured-homes-fort-wayne-buyers-guide">Fort Wayne buyer's guide</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-columbia-city-indiana",
    title: "Manufactured Homes in Columbia City, Indiana: Whitley County's Factory-Direct Route",
    excerpt:
      "Columbia City buyers on the US-30 corridor commute everywhere — Fort Wayne, Warsaw, and beyond. Here's how they're putting new Champion homes on Whitley County land.",
    image: "/images/homepage/single-wides.webp",
    date: "August 12, 2026",
    html: `
<p>Columbia City works hard: the US-30 corridor carries Whitley County commuters to Fort Wayne one way and Warsaw the other. What the corridor hasn't carried lately is affordable new housing — which is why more Whitley County families are looking at factory-built homes on their own land.</p>
<h2>Whitley County land is the opportunity</h2>
<p>Outside municipal limits, much of Whitley County accommodates manufactured homes on private parcels, and modular homes on permanent foundations extend into more developed districts. The county seat is right there in Columbia City, which makes the permit process — handled by you or your contractor — conveniently local. Our <a href="/guides/zoning">zoning guide</a> lays out the steps.</p>
<h2>Worth the drive to Auburn</h2>
<p>Our showroom at 1211 State Road 8 in Auburn is about a 40-minute drive from Columbia City. In one visit you can tour real single wide, double wide, and modular homes and get line-item pricing for any of our <a href="/floor-plans">Champion floor plans</a>, built at the Topeka plant about 20 miles from our lot. Most homes run $50,000&ndash;$150,000 — see the <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a>.</p>
<h2>FAQ</h2>
<h3>What Whitley County areas do you serve?</h3>
<p>All of them — Columbia City, Churubusco, South Whitley, Larwill, and the surrounding townships. See <a href="/locations/columbia-city">our Columbia City page</a> and <a href="/locations/whitley-county">Whitley County page</a>.</p>
<h3>Who handles site work?</h3>
<p>Your own licensed contractors handle foundation, utilities, and setup — most buyers save money that way, and we can share a referral list of licensed and insured contractors past customers have used.</p>
`,
  },
  {
    slug: "manufactured-homes-churubusco-indiana",
    title: "Manufactured Homes in Churubusco, Indiana: Small-Town Living, Factory-Direct Prices",
    excerpt:
      "Turtle Town USA sits an easy half-hour from our Auburn showroom. How Churubusco buyers get new Champion homes on Whitley County land without big-city prices.",
    image: "/images/homepage/double-wides.webp",
    date: "August 12, 2026",
    html: `
<p>Churubusco — Turtle Town USA, if you know your local festivals — is the kind of small town people move to on purpose: quiet roads, real community, and a quick hop to Fort Wayne when you need it. The housing challenge is the same as everywhere: not much new construction, and what exists costs plenty. A new manufactured or modular home solves both problems at once.</p>
<h2>An easy 30 minutes to compare homes</h2>
<p>Our Auburn showroom is about a 30-minute drive from Churubusco. That's close enough to visit twice before deciding — once to walk the models, once to bring the family. Model homes are open Mon&ndash;Fri 9&ndash;5 and Saturday 10&ndash;4; preview <a href="/floor-plans">70+ Champion floor plans</a> before you come.</p>
<h2>Placing a home around Churubusco</h2>
<p>The countryside around Churubusco — northern Whitley County and neighboring Allen and Noble County townships — commonly accommodates manufactured homes on rural parcels, with modular-on-foundation extending the options. You or your contractor verify parcel zoning and pull permits; the <a href="/guides/zoning">zoning guide</a> shows how.</p>
<h2>The budget picture</h2>
<p>Most homes fall between $50,000 and $150,000 depending on size and options, quoted line-item so you see the home, the options, and the delivery — which stays low here, since Champion's Topeka factory is a short freight run away. Full details in the <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a>.</p>
<h2>FAQ</h2>
<h3>How long from order to move-in?</h3>
<p>Typically 8&ndash;12 weeks — 6&ndash;8 weeks of factory build, with your contractor's site prep in parallel.</p>
<h3>More local info?</h3>
<p>See <a href="/locations/churubusco">our Churubusco page</a> or <a href="/contact-us">request a quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-indianapolis-guide",
    title: "Manufactured Homes for Indianapolis Buyers: Why Central Indiana Shops Factory-Direct Up North",
    excerpt:
      "Indianapolis-area buyers face the state's steepest housing costs. Here's when it makes sense to buy factory-direct from northeast Indiana — and how delivery to central Indiana works.",
    image: "/images/homepage/feature-find-land.webp",
    date: "August 12, 2026",
    html: `
<p>Indianapolis has Indiana's biggest housing market and its steepest affordability squeeze. For buyers with land — or plans to buy land — in the counties around Marion, a factory-direct manufactured or modular home is often the only realistic route to new construction. And here's the part most central Indiana buyers don't know: shopping a factory-direct dealer up north can beat metro-area dealer pricing, even after the longer delivery.</p>
<h2>The factory-direct math for central Indiana</h2>
<p>Our dealership in Auburn sits about 20 miles from Champion's largest factory in the country. We buy direct, quote line-item, and don't carry metro-market overhead. Delivery to central Indiana costs more than delivery near Auburn — that's physics — but it's one transparent line on your quote, and the home price itself is the same factory-direct number our local buyers get. Most homes run $50,000&ndash;$150,000 (<a href="/blog/manufactured-home-cost-indiana">cost guide</a>).</p>
<h2>Where Indy-area buyers place homes</h2>
<p>Manufactured homes are commonly placed on rural parcels in the counties surrounding Indianapolis, and in established land-lease communities throughout the metro. Modular homes on permanent foundations — IRC-code construction — fit suburban lots where site-built homes go. Zoning is parcel-specific everywhere: you or your contractor verify the rules and pull permits. Start with our <a href="/guides/zoning">zoning guide</a>.</p>
<h2>How buying from a distance works</h2>
<p>Buyers make the trip up I-69 once — about two and a half hours — to tour model homes and lock in choices; everything else happens by phone and email. Browse <a href="/floor-plans">floor plans</a> first so your visit counts, then coordinate delivery timing with your contractor's site schedule. Financing works the same statewide, through <a href="/financing">our lending partners</a>.</p>
<h2>FAQ</h2>
<h3>Do you really deliver to the Indianapolis area?</h3>
<p>Yes — we serve all of Indiana, with custom delivery quotes for central Indiana sites. See <a href="/locations/indianapolis">our Indianapolis page</a>.</p>
<h3>Is the trip north worth it?</h3>
<p>If line-item transparency and factory-direct pricing matter to you, yes — bring your land details and leave with real numbers to compare against any metro dealer.</p>
`,
  },
];
