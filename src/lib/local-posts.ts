// Locally-authored blog posts, merged with CMS posts in api-content.ts.
// Use for editorial content published from the repo (reviewed in a PR) rather
// than through the external CMS admin. Keep claims consistent with site copy:
// NO dollar figures for home prices — not even ranges (Kyle, 2026-08-16);
// quotes are line-item, "contact for pricing". Ancillary contractor costs
// (delivery, setup, site work) may cite ranges. Site work / setup is done by
// the buyer's own contractors — never claim FDHC performs setup or site work.

import type { ApiBlogDetail } from "./api-content";

export const localBlogPosts: ApiBlogDetail[] = [
  {
    slug: "champion-vs-clayton-homes",
    title: "Champion vs. Clayton Homes: How to Choose in 2026",
    excerpt:
      "Both build quality factory-built homes — the real difference is who you buy from and how the deal is structured. An honest comparison for northeast Indiana buyers weighing Champion and Clayton.",
    image: "/images/homepage/double-wide-exterior.webp",
    date: "August 17, 2026",
    html: `
<p>If you're shopping for a manufactured or modular home in northeast Indiana, two names come up fast: <strong>Clayton</strong> and <strong>Champion</strong>. Both build quality homes to the same federal standards. The real difference isn't the hammer and nails — it's <em>who you buy from and how the deal is structured.</em> Here's an honest breakdown to help you choose.</p>

<h2>Who they are</h2>
<ul>
  <li><strong>Clayton Homes</strong> is the largest builder of factory-built homes in the country, owned by Berkshire Hathaway. Clayton builds its own family of brands and sells them primarily through company-owned Clayton Homes retail centers. It's a vertically integrated model — the same company builds the home, runs the store, and (through affiliated companies) offers the mortgage and insurance.</li>
  <li><strong>Champion Homes</strong> is one of the largest factory-built home producers in North America. Factory Direct Homes Center is a local, family-run business, not a corporate store, and every home we sell is built at Champion's Indiana plants, most of them 30 miles up the road in Topeka.</li>
</ul>

<h2>Build quality: honestly, both are strong</h2>
<p>Every home from both builders is constructed to the federal HUD Code (or state IRC code for modular), inspected at the factory, and backed by a manufacturer's warranty. You won't go wrong on construction with either. Champion's <a href="/champion-homes">Aspire, Prime, and Redman lines</a> give you a wide range of layouts and finishes.</p>

<h2>Financing: independent vs. in-house</h2>
<p>This is where the models differ most. A vertically integrated builder typically steers you toward its own affiliated lender. As an independent dealer, we hand you the full list of lenders our customers have used, recommend none of them, and leave the choosing to you — so you compare offers yourself instead of taking the first one handed to you. Always compare rates, no matter who you buy from. Our <a href="/financing">financing page</a> explains the options.</p>

<h2>The buying experience</h2>
<p>With a national chain you get a big-brand process. With a local independent dealer you get a name, a face, and someone 20 minutes away who answers the phone after the sale. We also let you stay in control of your own site work with your own licensed contractors — where many buyers save real money — rather than bundling everything into one price.</p>

<h2>How to decide</h2>
<p>Want a national brand's footprint and one-stop process? Clayton delivers that. Want an independent local partner, the Champion lineup, the ability to compare financing, and line-item pricing with no bundled mystery costs? That's us. Either way, tour homes in person and get every cost in writing before you sign.</p>

<h2>FAQ</h2>
<h3>Is Champion or Clayton better quality?</h3>
<p>Both build to the same federal HUD Code (or state IRC code for modular homes), are factory-inspected, and carry manufacturer warranties. Quality is comparable — the meaningful differences are brand selection, financing flexibility, and whether you buy from a corporate store or an independent local dealer.</p>
<h3>Is Factory Direct Homes Center a Clayton dealer?</h3>
<p>No — we're an independent, authorized <strong>Champion Homes</strong> dealer in Auburn, Indiana. We sell Champion's Aspire, Prime, and Redman series, built at Champion's Indiana plants.</p>
<h3>Can I compare Champion homes in person near Fort Wayne?</h3>
<p>Yes. Our Auburn showroom is about 25 minutes from Fort Wayne. Browse our <a href="/floor-plans">Champion floor plans</a> or <a href="/design-your-home">design your home online</a>, then <a href="/contact-us">visit us</a> to walk through models in person.</p>
`,
  },
  {
    slug: "how-to-read-manufactured-home-quote",
    title: "How to Read a Manufactured Home Quote: Line-Item vs. Bundled Pricing",
    excerpt:
      "Two dealers can quote what looks like the same home and mean very different things. Here's how to read a manufactured home quote line by line — and the questions to ask before you sign.",
    image: "/images/homepage/feature-financing.webp",
    date: "August 17, 2026",
    html: `
<p>The most important skill when buying a manufactured home isn't picking the floor plan — it's <strong>reading the quote</strong>. Two dealers can quote what looks like the same home and mean very different things. Here's how to tell what you're actually paying for.</p>

<h2>Bundled pricing vs. line-item pricing</h2>
<ul>
  <li>A <strong>bundled</strong> quote gives you one big number — home, delivery, setup, and sometimes site work rolled together. It looks simple, but you can't see what each piece costs, which makes it impossible to compare dealers or know where you could save.</li>
  <li>A <strong>line-item</strong> quote breaks it out: the home, each factory option, delivery, and setup, each priced separately. That's how we quote at Factory Direct Homes Center — so you see exactly what you're paying for and can compare us honestly against anyone.</li>
</ul>

<h2>The costs every buyer should ask about — separately</h2>
<ul>
  <li><strong>The home itself</strong> — the base plan plus the factory options you choose.</li>
  <li><strong>Delivery</strong> from the factory to your site — distance matters, which is why being 30 miles from Champion's Topeka plant keeps this line low.</li>
  <li><strong>Setup &amp; installation</strong> — leveling, anchoring, utility hookups, and the marriage line on multi-section homes.</li>
  <li><strong>Site work</strong> — pad or foundation, utilities, driveway. <em>This is the big one.</em> In our model, you hire your own licensed contractors for site work, which is where many buyers save the most money versus a dealer marking it up inside a bundle.</li>
</ul>

<h2>Questions to ask any dealer before you sign</h2>
<ol>
  <li>Can I see this quote broken out line by line?</li>
  <li>What exactly is included in "setup"?</li>
  <li>Is site work included or separate — and can I use my own contractor?</li>
  <li>Are there any fees not shown here?</li>
</ol>
<p>A dealer who gladly itemizes everything is a dealer you can trust. One who won't is telling you something. <a href="/contact-us">Contact us for a line-item quote</a> on any floor plan — you'll see every number.</p>

<h2>Learn more</h2>
<p>Our <a href="/guides/pricing">pricing guide</a> explains how line-item pricing works, the <a href="/guides/buyers-guide">complete buyer's guide</a> walks the whole process, and the <a href="/guides/site-work">site work guide</a> covers what you or your contractor handle before the home arrives.</p>
`,
  },
  {
    slug: "road-to-housing-act-manufactured-homes-2026",
    title: "New Federal Law Expands Access to Affordable Manufactured Homes: What the ROAD to Housing Act Means for Indiana, Ohio & Michigan Buyers",
    excerpt:
      "The 21st Century ROAD to Housing Act modernizes manufactured housing at the federal level — a new definition, expanded financing, and community grants. Here's what it means for buyers across our Indiana, Ohio, and Michigan service area.",
    image: "/images/homepage/double-wide-exterior.webp",
    date: "August 17, 2026",
    html: `
<p>If you've been priced out of a new site-built home, there's real news worth your attention. A sweeping, bipartisan federal housing law — the <strong>21st Century ROAD to Housing Act</strong> — took effect in July 2026, and one of its central goals is to make manufactured homes more affordable, easier to finance, and more widely accepted. For families across our Indiana, Ohio, and Michigan service area, it's one of the most significant changes to factory-built housing in decades. Here's a plain-English breakdown of what changed and what it means for you.</p>

<h2>What the ROAD to Housing Act actually does</h2>
<p>The law is a broad package aimed at reducing the barriers that keep housing expensive and in short supply. Several of its provisions speak directly to manufactured and modular homes:</p>
<ul>
  <li><strong>A modernized definition of "manufactured home."</strong> For decades, federal law defined a manufactured home as a house built <em>on a permanent steel chassis</em>. The Act rewrites that to "<strong>with or without a permanent chassis</strong>" — a long-sought change that lets these homes look, sit, and finance more like traditional site-built houses.</li>
  <li><strong>Lower costs.</strong> Removing the required steel chassis on eligible homes is projected by the bill's analysts to cut construction costs by roughly <strong>$5,000 to $10,000 per home</strong> nationally — savings that can put ownership within reach for more families.</li>
  <li><strong>Expanded financing.</strong> The law raises FHA Title I loan limits for manufactured homes and home improvements, extends that financing to accessory dwelling units (ADUs), and directs HUD to review its construction-financing programs to remove barriers for modular and manufactured-home builders.</li>
  <li><strong>Support for communities.</strong> It authorizes grants to preserve and improve manufactured-home communities, support resident-owned communities, and help replace very old homes with safe, energy-efficient new ones.</li>
</ul>

<h2>Why this matters in Ohio, Indiana, and Michigan</h2>
<p>Demand for factory-built housing is already surging across the region. In Ohio alone, the Department of Commerce's Manufactured Homes Program reported receiving <strong>as many manufactured-home park applications in 2024 as in the previous five years combined</strong>, with roughly 1,500 operating communities and more than 111,000 home sites statewide. Nationwide, more than 20 million Americans already call a manufactured home their own.</p>
<p>The reason is simple: factory-built homes cost far less per square foot than new site-built construction, and they're built under a federal quality-control code in a climate-controlled plant. The ROAD to Housing Act leans into that momentum — making the homes easier to finance and, over time, more house-like in appearance and placement.</p>

<h2>What "chassis-free" homes mean for buyers — and a caution</h2>
<p>The new definition is a green light for a category of home that installs on a permanent foundation and reads, to most eyes, as a conventional house — while keeping the cost advantages of factory construction. One important detail from the law: <strong>each state must certify that it treats chassis-free homes on par with traditional HUD-code manufactured homes</strong> for financing, sale, installation, and title. States that don't certify must prohibit the sale of those homes within their borders, so exactly how and when these appear will depend on Indiana, Ohio, and Michigan completing that process. We're watching it closely and will help you understand which options are available for your location as the rules roll out.</p>
<p>In the meantime, today's HUD-code <a href="/floor-plans">Champion manufactured homes</a> and IRC-code <a href="/guides/manufactured-vs-modular">modular homes</a> already deliver the affordability and quality this law is built to expand — you don't have to wait to take advantage of factory-direct pricing.</p>

<h2>How Factory Direct Homes Center fits in</h2>
<p>We're an authorized Champion Homes dealer in Auburn, Indiana, about 30 miles from Champion's Topeka plant. That means short freight distances, direct access to the full Aspire, Prime, and Redman lineups, and factory-direct pricing quoted line by line, so you see exactly what you're paying for with no hidden markups.</p>
<p>On financing, we do not lend, broker or pull credit — buyers apply directly to the lender of their choice, across chattel (home-only) loans, land-home packages and conventional mortgages. As the Act's expanded FHA options take shape, they will be available through the same lenders on the list we hand you. Our <a href="/financing">financing page</a> walks through how each loan type works.</p>
<p>And as always, site work — foundation or pad, utilities, and driveway — is handled by <strong>your own licensed contractors</strong>, which is where many buyers save real money versus dealer-bundled site work. We're glad to share a referral list of licensed and insured contractors past customers have used.</p>

<h2>The bottom line</h2>
<p>The 21st Century ROAD to Housing Act is a clear signal from Washington that factory-built housing is a serious answer to the affordability crisis — not a fallback. For buyers across northeast Indiana, northwest Ohio, and southern Michigan, it means more financing options and, in time, more home styles to choose from. If you've been wondering whether a new manufactured or modular home is the right move, this is a good moment to start the conversation.</p>

<h2>FAQ</h2>
<h3>Is the ROAD to Housing Act in effect now?</h3>
<p>Yes — the law took effect in 2026. Some provisions, like the new chassis-free home category, depend on federal rulemaking and state certification, so they'll phase in over the coming months. Financing and community-grant provisions are moving forward now.</p>
<h3>Does the new law change how much a home costs at Factory Direct?</h3>
<p>The chassis-free provision is projected to lower construction costs on eligible homes nationally, but exact pricing always depends on the model, size, and options you choose. We quote every home line by line — <a href="/contact-us">contact us</a> for current factory-direct pricing on any floor plan.</p>
<h3>Do you serve Ohio and Michigan buyers?</h3>
<p>Yes. We deliver across northeast Indiana, northwest Ohio (including the <a href="/locations/toledo">Toledo</a> area), and southern Michigan (including <a href="/locations/kalamazoo">Kalamazoo</a>). See our <a href="/locations">locations page</a> for the full service area.</p>
<h3>Where can I learn the basics before I buy?</h3>
<p>Start with our <a href="/guides/buyers-guide">complete buyer's guide</a>, then browse <a href="/floor-plans">our Champion floor plans</a> and <a href="/contact-us">reach out</a> when you're ready to see homes in person at our Auburn showroom.</p>

<p style="font-size:0.85em;margin-top:2rem"><em>Sources: <a href="https://www.limaohio.com/top-stories/2026/08/16/manufactured-housing-law-expands-access-to-affordable-homes/" target="_blank" rel="noopener noreferrer">Lima News — "Manufactured housing law expands access to affordable homes"</a>; U.S. Senate Committee on Banking, Housing, and Urban Affairs, 21st Century ROAD to Housing Act section-by-section summary. This article is general information, not legal or financial advice.</em></p>
`,
  },
  {
    slug: "manufactured-homes-fort-wayne-buyers-guide",
    title: "Buying a Manufactured Home Near Fort Wayne: A 2026 Buyer's Guide",
    excerpt:
      "What Fort Wayne and Allen County buyers should know before purchasing a manufactured home — placement options, costs, delivery, and why the best deals are 25 minutes up the road.",
    image: "/images/homepage/double-wides.webp",
    date: "August 12, 2026",
    html: `
<p>Fort Wayne's housing market has priced a lot of good people out of a new site-built home. If you're one of them, a new HUD-code manufactured home is the most realistic path to new construction in northeast Indiana — and Fort Wayne buyers have a geographic advantage most of the country doesn't: you live about 25 minutes from a factory-direct Champion dealer, and under an hour from Champion's Topeka plant. Here's what that means for you, and what to know before you buy.</p>

<h2>Why Fort Wayne buyers shop in Auburn</h2>
<p>Our showroom at 1211 State Road 8 in Auburn is about 25 minutes north of Fort Wayne, straight up I-69. That drive matters for two reasons. First, you can walk through real model homes — floor plans on a screen don't tell you how a kitchen feels. Second, the factory that builds these homes is in Topeka, Indiana, about 30 miles from us. Freight is one of the biggest hidden costs in manufactured housing, and homes that travel a short distance cost less to deliver than homes trucked in from hundreds of miles away. That saving shows up in your quote.</p>

<h2>Where can you put a manufactured home around Fort Wayne?</h2>
<p>You have three main options in the Fort Wayne area:</p>
<ul>
  <li><strong>Your own land.</strong> Rural and unincorporated areas of Allen County — and neighboring DeKalb, Whitley, and Noble counties — allow manufactured homes on private land in many zoning districts. Rules vary parcel by parcel, so you or your contractor verify zoning and setbacks and pull the permits for your specific site. Our <a href="/guides/zoning">zoning guide</a> covers how this works in Indiana.</li>
  <li><strong>A land-lease community.</strong> The Fort Wayne area has established manufactured home communities where you own the home and lease the lot — the lowest cash-to-move-in option.</li>
  <li><strong>Private land outside the city.</strong> Rural Allen County parcels are where HUD-code homes are most straightforwardly permitted, and where most of our Fort Wayne-area buyers end up.</li>
</ul>

<h2>What it costs</h2>
<p>What you'll pay depends on the size, series, and options you choose — single wides are the most affordable path and double wides the mid-range. Compare factory-direct pricing with what new site-built construction runs in Allen County and the math explains why factory-built housing is the fastest-growing path to homeownership in the region. For a deeper cost breakdown, read our <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a> — and remember our quotes are line-item: the home, the options, the delivery, each priced separately so you can compare honestly against any other dealer.</p>
<p>Site work — foundation or pad, utilities, driveway — is separate, and in our model <strong>you hire your own licensed contractors</strong> for it. Most buyers save money that way versus dealer-bundled site work, and we can share a referral list of licensed and insured contractors past customers around Fort Wayne have used.</p>

<h2>How delivery works from here</h2>
<p>Once your home is built at the Topeka factory, it's transported to your site — a short, low-cost trip anywhere in the Fort Wayne area, including New Haven, Huntertown, Churubusco, Columbia City, and the surrounding counties. From order to move-in typically runs 8&ndash;12 weeks: 6&ndash;8 weeks of factory build time, plus site preparation and permitting that your contractor can run in parallel.</p>

<h2>Financing for Fort Wayne buyers</h2>
<p>Manufactured home financing is a specialty. We do not offer it ourselves and we recommend no one — you get the full list of lenders our customers have used and apply wherever you like, for home-only (chattel) loans, land-home packages or a conventional mortgage. Start with our <a href="/financing">financing page</a> to see how the options compare.</p>

<h2>FAQ</h2>
<h3>Do you deliver to Fort Wayne?</h3>
<p>Yes — Fort Wayne and all of Allen County are squarely in our primary delivery area, about 25 minutes from our Auburn showroom.</p>
<h3>Can I put a manufactured home inside Fort Wayne city limits?</h3>
<p>Within city limits, zoning is stricter and typically favors established manufactured home communities. On rural land outside the city, private-land placement is common. If a district rules out a HUD-code home entirely, the IRC-code alternative is covered in our <a href="/guides/manufactured-vs-modular">manufactured vs modular guide</a>. Verify the rules for your specific parcel before you buy — we can point you to the right county offices.</p>
<h3>What's the difference between buying from you and a Fort Wayne area dealer lot?</h3>
<p>Factory-direct pricing and line-item transparency. We're an authorized Champion dealer 30 miles from the factory, we don't bundle mystery costs, and you stay in control of site work with your own contractors. See <a href="/locations/fort-wayne">our Fort Wayne page</a> for more on how we serve the area.</p>
<h3>Can I tour homes before buying?</h3>
<p>Yes — walk through model homes at our Auburn showroom, Mon&ndash;Fri 9&ndash;5 or Saturday 10&ndash;4. Browse our <a href="/floor-plans">70+ Champion floor plans</a> first, then <a href="/contact-us">let us know</a> which ones you want to see in person.</p>
`,
  },
  {
    slug: "manufactured-home-cost-indiana",
    title: "How Much Does a Manufactured Home Cost in Indiana? (2026 Guide)",
    excerpt:
      "What actually drives single wide, double wide, and modular home costs in Indiana — the factors dealers don't explain and how line-item pricing works.",
    image: "/images/homepage/hero-banner.webp",
    date: "August 12, 2026",
    html: `
<p>If you've searched for manufactured home prices in Indiana, you've probably noticed something frustrating: almost nobody publishes real numbers. Dealers advertise "affordable homes" and then make you sit through a sales pitch to learn what anything costs. We think you deserve better context before you ever pick up the phone — so here is an honest look at what manufactured and modular homes actually cost in Indiana in 2026, what drives the price up or down, and how to read a quote so you know exactly what you're paying for.</p>

<h2>What drives manufactured home prices in Indiana in 2026</h2>
<p>Where a new home lands in your budget depends mostly on the size and construction type:</p>
<ul>
  <li><strong>Single wide homes (500&ndash;1,200 sq ft):</strong> the most affordable path to a new home. These are efficient, smartly designed homes for first-time buyers, downsizers, or rental land placements.</li>
  <li><strong>Double wide homes (1,000&ndash;2,400 sq ft):</strong> the mid-range of the market. Sectional homes like the Brighton and Silverton series offer multiple living areas and layouts that rival site-built houses.</li>
  <li><strong>Modular homes (1,000&ndash;2,500+ sq ft):</strong> the top of the range. Built to Indiana's IRC residential code and placed on permanent foundations, these are financed and appraised like site-built homes.</li>
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
<p>Here's an advantage of buying in northeast Indiana: Champion builds homes at its plant in Topeka, IN — about 30 miles from our Auburn showroom. Homes that travel 30 miles cost less to deliver than homes that travel 300, and that saving lands in your quote.</p>

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
<p>Financing is often easier than buyers expect. We do not arrange it — you pick your own lender from the full list we hand you, covering chattel (home-only) loans, land-home packages and conventional mortgages. Our <a href="/financing">financing page</a> and <a href="/guides/financing">financing guide</a> walk through the options and what lenders look for.</p>

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
<p>Much of DeKalb County outside city limits allows manufactured homes on private land. Zoning and setbacks are parcel-specific: you or your contractor verify the rules and pull the permits, and because the county offices are minutes away, we can point you to exactly the right desk. Our <a href="/guides/zoning">zoning guide</a> explains the process.</p>
<h2>The factory question</h2>
<p>Champion's Topeka plant is about 30 miles from Auburn. Short freight means lower delivery cost on your line-item quote, and it's why Auburn buyers consistently see some of the lowest delivered prices in our service area. Every home is quoted line-item for your exact configuration; see the full breakdown in our <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a>.</p>
<h2>FAQ</h2>
<h3>Do you deliver inside Auburn city limits?</h3>
<p>We deliver anywhere in the area — city-limit placements depend on zoning, which typically favors established communities (the IRC-code route is covered in our <a href="/guides/manufactured-vs-modular">manufactured vs modular guide</a>); rural DeKalb parcels are usually simpler. We'll help you check your specific address.</p>
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
<p>Buyers around Garrett mostly land on rural DeKalb County acreage, where manufactured homes are permitted on many parcels. Zoning is parcel-specific; you or your contractor verify requirements and pull permits with the county, and our <a href="/guides/zoning">zoning guide</a> walks through how that works.</p>
<h2>What Garrett buyers pay</h2>
<p>Whatever the floor plan, every quote is line-item — home, options, delivery each priced separately — and delivery costs here are among the lowest anywhere we serve, because Garrett sits minutes from both our lot and short freight range of Champion's Topeka factory. Our <a href="/blog/manufactured-home-cost-indiana">cost guide</a> explains every line of the quote.</p>
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
<p>Two of the biggest soft costs in manufactured housing are freight and logistics. Waterloo effectively eliminates both: our lot is minutes away, and Champion's Topeka factory — where your home is built — is about 30 miles from Auburn. Shorter trips mean lower delivery line items on your quote, and simpler scheduling for your contractor.</p>
<h2>Your placement options</h2>
<p>Rural parcels around Waterloo and across DeKalb County commonly allow manufactured homes. As everywhere in Indiana, zoning is parcel-by-parcel — you or your contractor confirm the rules and pull permits, and we can point you to the right DeKalb County offices. Details in our <a href="/guides/zoning">zoning guide</a>.</p>
<h2>Costs, honestly</h2>
<p>Every quote we write is line-item — home, options, delivery, each priced separately — so you can compare us against anyone. Start with the <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a>, then browse <a href="/floor-plans">70+ Champion floor plans</a>.</p>
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
<p>Butler anchors the eastern edge of DeKalb County, close enough to the Ohio line that plenty of families shop both states. Wherever you land, the housing math is the same: new site-built construction has outrun local budgets, and a new Champion manufactured home is the practical way to get new construction on your own terms.</p>
<h2>A short drive, a real showroom</h2>
<p>Our Auburn showroom is an easy drive west from Butler on State Road 8 — the same road. Walk through model homes, compare layouts side by side, and get line-item numbers for exactly the home you want. Hours are Mon&ndash;Fri 9&ndash;5, Saturday 10&ndash;4.</p>
<h2>Placing a home around Butler</h2>
<p>Eastern DeKalb County is largely rural, and many parcels allow manufactured homes on private land. You or your contractor verify zoning for your parcel and pull the permits — our <a href="/guides/zoning">zoning guide</a> covers the Indiana process, and we serve Ohio buyers across the line too.</p>
<h2>What it costs</h2>
<p>Single wides and double wides each occupy their own part of the budget — ask for a line-item quote and you'll see every number for the exact configuration you want — and Butler's proximity to the Topeka factory keeps the delivery line low. Full breakdown in the <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a>.</p>
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
    date: "August 15, 2026",
    html: `
<p>Kendallville is Noble County's commercial hub, and the countryside around it is exactly the kind of place factory-built housing shines: rural parcels, reasonable land prices, and county zoning that accommodates manufactured homes on many private lots. Add a 25-minute drive to our Auburn showroom and Kendallville buyers have one of the simplest paths to new construction in northeast Indiana.</p>
<h2>Rural Noble County land works in your favor</h2>
<p>Much of Noble County outside municipal limits permits manufactured homes on private land. Rules are parcel-specific — you or your contractor verify zoning and setbacks and pull permits with Noble County. Our <a href="/guides/zoning">zoning guide</a> explains each step.</p>
<h2>Close to the showroom, close to the factory</h2>
<p>Our Auburn showroom at 1211 State Road 8 is about a 25-minute drive from Kendallville, and your home is built at Champion's Topeka plant, a short freight hop away. Short distances show up as real savings on the delivery line of your quote.</p>
<h2>The numbers</h2>
<p>Quotes are line-item — home, options, and delivery each priced separately — and site work is handled by your own licensed contractors, where most buyers save real money. Details in the <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a>.</p>
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
    date: "August 15, 2026",
    html: `
<p>Albion is Noble County's seat, ringed by farmland and lake country — Chain O'Lakes State Park is just down the road. It's also, quietly, one of the most convenient places in the county to put a manufactured home: rural parcels are plentiful, and the county offices that handle your zoning questions and permits are right in town.</p>
<h2>The Albion advantage: permits without the runaround</h2>
<p>Every manufactured home placement in Indiana runs through county zoning and permitting, handled by you or your contractor. Albion buyers have the shortest possible trip — the Noble County offices are local, and we can tell you exactly which desk to visit. Start with our <a href="/guides/zoning">zoning guide</a> so you know what to ask.</p>
<h2>A 30-minute trip to compare real homes</h2>
<p>Our Auburn showroom is about a half-hour drive from Albion. Walk through single wide and double wide models, then get a line-item quote — home, options, delivery, each priced separately — for the exact configuration you want from our <a href="/floor-plans">70+ Champion floor plans</a>.</p>
<h2>What Albion buyers spend</h2>
<p>Every home is quoted line-item for the exact configuration you choose. Site work — pad or foundation, utilities, driveway — is separate and handled by your own licensed contractors, which is where many buyers save real money. The <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a> breaks down every driver.</p>
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
    date: "August 15, 2026",
    html: `
<p>Here's a fact most Ligonier residents don't realize: Champion Homes builds homes just up the road in Topeka. If you buy a new Champion manufactured home in Ligonier, it travels only a short distance from the plant to your site. That's not trivia — it's money.</p>
<h2>Why factory proximity matters in your quote</h2>
<p>Freight is one of the larger non-negotiable costs in manufactured housing, priced by distance and escort requirements. Ligonier-area deliveries are about as short as they come, and because our quotes are line-item, you'll see that saving as its own number — not buried in a bundle.</p>
<h2>Placing a home in western Noble County</h2>
<p>The countryside around Ligonier offers rural parcels where manufactured homes are commonly permitted. Zoning is parcel-specific: you or your contractor verify requirements and pull permits with Noble County. Our <a href="/guides/zoning">zoning guide</a> shows the steps.</p>
<h2>Seeing the homes</h2>
<p>Our Auburn showroom is about a 40-minute drive from Ligonier — model homes open Mon&ndash;Fri 9&ndash;5, Saturday 10&ndash;4. Preview our <a href="/floor-plans">Champion floor plans</a> first, including Aspire-series homes built right in Topeka. Each is quoted line-item for your exact configuration; see the <a href="/blog/manufactured-home-cost-indiana">cost guide</a> for what moves the number.</p>
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
    date: "August 15, 2026",
    html: `
<p>Angola and the Steuben County lake country around it — the county promotes its 101 lakes for good reason — draw two kinds of buyers: families who want to live near the water year-round, and owners replacing an aging lake cottage with something modern. Both keep discovering the same answer: a new Champion manufactured home delivers new construction at a price the lake-area market otherwise doesn't offer.</p>
<h2>Lake lots and rural Steuben parcels</h2>
<p>Around the lakes, placement depends on the parcel: rural Steuben County land commonly accommodates manufactured homes, while some lake communities set their own standards. Verify zoning for the specific lot (you or your contractor pull the permits); our <a href="/guides/zoning">zoning guide</a> covers what to check before you buy land.</p>
<h2>A straight shot down I-69</h2>
<p>Our Auburn showroom is an easy drive south from Angola on I-69. Tour models in person, then get line-item pricing for the exact floor plan and options you want from our <a href="/floor-plans">70+ Champion plans</a>. Every home is quoted line-item — the <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a> explains the ranges.</p>
<h2>FAQ</h2>
<h3>Can a manufactured home work as a lake home?</h3>
<p>Yes — modern HUD-code homes are fully insulated, four-season houses. Many buyers use them as primary residences near the water.</p>
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
    date: "August 18, 2026",
    html: `
<p>Huntertown and the corridor north of Fort Wayne have been growing fast, and new site-built subdivisions there price accordingly. If you want new construction on the north side without a subdivision price tag, factory-built housing is the honest alternative — especially with our showroom just up the road in Auburn.</p>
<h2>Between the city and the country</h2>
<p>Huntertown buyers sit at a sweet spot: minutes from Fort Wayne, but close to rural Allen and DeKalb County land where manufactured homes are commonly permitted on private parcels. Zoning is parcel-specific — you or your contractor verify and pull permits; see the <a href="/guides/zoning">zoning guide</a>.</p>
<h2>The closest dealer to the north side</h2>
<p>From Huntertown, our Auburn showroom is a short drive north — closer than crossing Fort Wayne. Walk through models, then get line-item quotes on any of our <a href="/floor-plans">Champion floor plans</a>, built about 30 miles away at the Topeka plant. Every home is quoted line-item; details in the <a href="/blog/manufactured-home-cost-indiana">cost guide</a> and the <a href="/blog/manufactured-homes-fort-wayne-buyers-guide">Fort Wayne buyer's guide</a>.</p>
<h2>FAQ</h2>
<h3>Can I place a manufactured home in Huntertown itself?</h3>
<p>Within town limits, zoning is tighter — see the IRC-code option in our <a href="/guides/manufactured-vs-modular">manufactured vs modular guide</a>; manufactured homes are commonly placed on rural land just outside. We'll help you check your specific parcel.</p>
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
    date: "August 18, 2026",
    html: `
<p>New Haven has always been Fort Wayne's practical eastern neighbor — close to everything, easier on the wallet. The same logic points straight at factory-built housing: for the price of a dated fixer-upper in east Allen County, you can own brand-new construction with a manufacturer warranty.</p>
<h2>East Allen options</h2>
<p>East and southeast of New Haven, rural Allen County parcels commonly accommodate manufactured homes on private land, and established manufactured home communities offer the lowest cash-to-move-in path. As always, zoning is parcel-specific: you or your contractor verify and pull permits (<a href="/guides/zoning">how it works</a>).</p>
<h2>Getting to us is the easy part</h2>
<p>Our Auburn showroom is a straightforward drive north of New Haven. Tour single wide and double wide models, and leave with line-item pricing — home, options, delivery, each its own number. Browse <a href="/floor-plans">70+ Champion floor plans</a> first; each is quoted line-item (<a href="/blog/manufactured-home-cost-indiana">full cost guide</a>).</p>
<h2>Financing</h2>
<p>We do not do financing or recommend a lender — you get the full list our customers have used and choose for yourself, for chattel loans, land-home packages or a conventional mortgage. Start at <a href="/financing">financing</a>.</p>
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
    date: "August 18, 2026",
    html: `
<p>Columbia City works hard: the US-30 corridor carries Whitley County commuters to Fort Wayne one way and Warsaw the other. What the corridor hasn't carried lately is affordable new housing — which is why more Whitley County families are looking at factory-built homes on their own land.</p>
<h2>Whitley County land is the opportunity</h2>
<p>Outside municipal limits, much of Whitley County accommodates manufactured homes on private parcels. The county seat is right there in Columbia City, which makes the permit process — handled by you or your contractor — conveniently local. Our <a href="/guides/zoning">zoning guide</a> lays out the steps.</p>
<h2>Worth the drive to Auburn</h2>
<p>Our showroom at 1211 State Road 8 in Auburn is about a 40-minute drive from Columbia City. In one visit you can tour real single wide and double wide homes and get line-item pricing for any of our <a href="/floor-plans">Champion floor plans</a>, built at the Topeka plant about 30 miles from our lot. Every home is quoted line-item — see the <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a>.</p>
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
    date: "August 18, 2026",
    html: `
<p>Churubusco — Turtle Town USA, if you know your local festivals — is the kind of small town people move to on purpose: quiet roads, real community, and a quick hop to Fort Wayne when you need it. The housing challenge is the same as everywhere: not much new construction, and what exists costs plenty. A new manufactured home solves both problems at once.</p>
<h2>An easy 30 minutes to compare homes</h2>
<p>Our Auburn showroom is about a 30-minute drive from Churubusco. That's close enough to visit twice before deciding — once to walk the models, once to bring the family. Model homes are open Mon&ndash;Fri 9&ndash;5 and Saturday 10&ndash;4; preview <a href="/floor-plans">70+ Champion floor plans</a> before you come.</p>
<h2>Placing a home around Churubusco</h2>
<p>The countryside around Churubusco — northern Whitley County and neighboring Allen and Noble County townships — commonly accommodates manufactured homes on rural parcels. You or your contractor verify parcel zoning and pull permits; the <a href="/guides/zoning">zoning guide</a> shows how.</p>
<h2>The budget picture</h2>
<p>Every home is quoted line-item so you see the home, the options, and the delivery — which stays low here, since Champion's Topeka factory is a short freight run away. Full details in the <a href="/blog/manufactured-home-cost-indiana">Indiana cost guide</a>.</p>
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
    date: "August 18, 2026",
    html: `
<p>Indianapolis has Indiana's biggest housing market and its steepest affordability squeeze. For buyers with land — or plans to buy land — in the counties around Marion, a factory-direct manufactured or modular home is often the only realistic route to new construction. And here's the part most central Indiana buyers don't know: shopping a factory-direct dealer up north can beat metro-area dealer pricing, even after the longer delivery.</p>
<h2>The factory-direct math for central Indiana</h2>
<p>Our dealership in Auburn sits about 30 miles from Champion's Topeka plant. We buy direct, quote line-item, and don't carry metro-market overhead. Delivery to central Indiana costs more than delivery near Auburn — that's physics — but it's one transparent line on your quote, and the home price itself is the same factory-direct number our local buyers get. Every home is quoted line-item (<a href="/blog/manufactured-home-cost-indiana">cost guide</a>).</p>
<h2>Where Indy-area buyers place homes</h2>
<p>Manufactured homes are commonly placed on rural parcels in the counties surrounding Indianapolis, and in established land-lease communities throughout the metro. Modular homes on permanent foundations — IRC-code construction — fit suburban lots where site-built homes go. Zoning is parcel-specific everywhere: you or your contractor verify the rules and pull permits. Start with our <a href="/guides/zoning">zoning guide</a>.</p>
<h2>How buying from a distance works</h2>
<p>Buyers make the trip up I-69 once — about two and a half hours — to tour model homes and lock in choices; everything else happens by phone and email. Browse <a href="/floor-plans">floor plans</a> first so your visit counts, then coordinate delivery timing with your contractor's site schedule. Financing works the same statewide; you choose your own lender, and <a href="/financing">our list</a> is a starting point.</p>
<h2>FAQ</h2>
<h3>Do you really deliver to the Indianapolis area?</h3>
<p>Yes — we serve all of Indiana, with custom delivery quotes for central Indiana sites. See <a href="/locations/indianapolis">our Indianapolis page</a>.</p>
<h3>Is the trip north worth it?</h3>
<p>If line-item transparency and factory-direct pricing matter to you, yes — bring your land details and leave with real numbers to compare against any metro dealer.</p>
`,
  },
  {
    slug: "manufactured-homes-corunna-indiana",
    title: "Manufactured Homes in Corunna, Indiana: The Closest Town to Our Lot",
    excerpt:
      "Corunna sits minutes from our Auburn showroom. What a HUD-code manufactured home looks like on a small in-town lot, and how DeKalb County handles placement.",
    image: "/images/homepage/single-wides.webp",
    date: "September 18, 2026",
    html: `
<p>Corunna is about as close to our lot as a town gets. You can leave a job site here, walk three Champion homes in Auburn over a lunch break, and be back before the afternoon. That proximity is not just convenient &mdash; it changes what a home costs to deliver, because freight is quoted by the mile and this is the shortest run we make.</p>

<h2>Small lots, single-section homes</h2>
<p>Most in-town parcels in a place like Corunna were platted long before anyone was parking a 28-foot-wide home on them. That is not a problem, it is a design constraint, and it is the reason Champion still builds a deep single-section lineup. A <a href="/series/prime">Prime</a> or single-section <a href="/series/aspire">Aspire</a> home runs 14 to 18 feet wide and up to 80 feet long &mdash; two or three bedrooms, a full kitchen, a real laundry room &mdash; on a footprint that fits an older village lot with setbacks left over.</p>
<p>These are <strong>manufactured homes</strong>, built to the federal HUD code in a controlled plant rather than in the weather. One transport, one set, no framing crew waiting out a rainy April. If your lot is wider than it looks, a multi-section home opens up; bring your parcel dimensions and we will tell you honestly which lineup fits.</p>

<h2>Placement is a DeKalb County question</h2>
<p>Corunna sits in DeKalb County, our home county, and county rules are parcel-specific &mdash; zoning district, minimum square footage, foundation and skirting requirements, setbacks. You or your contractor confirm those and pull the permits; we do not perform site work or setup, which is exactly why your quote is not padded with it. Our <a href="/guides/zoning">zoning guide</a> walks through what to ask and who to ask.</p>

<h2>What the visit is for</h2>
<p>Photographs do not tell you how a kitchen feels or whether a hallway is wide enough for your mother-in-law&rsquo;s walker. Browse the <a href="/floor-plans">full Champion lineup</a> first, then come walk two or three. The showroom is open Monday to Friday 9&ndash;5 and Saturday 10&ndash;4, and every home is quoted line by line &mdash; home, options, delivery, each on its own line, so you can carry the sheet to another dealer and compare it honestly.</p>

<h2>Common questions</h2>
<h3>Is a manufactured home allowed on my Corunna lot?</h3>
<p>Usually the question is not whether but under what conditions &mdash; foundation type, minimum width, skirting. That is a DeKalb County determination on your specific parcel. Ask before you fall in love with a floor plan.</p>
<h3>How long does the whole thing take?</h3>
<p>Typically 8 to 12 weeks from order to move-in. The factory build is 6 to 8 weeks; your contractor&rsquo;s site prep runs in parallel, not after.</p>
<h3>Where do I start?</h3>
<p>See <a href="/locations/dekalb-county">our DeKalb County page</a>, or <a href="/contact-us">ask us for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-st-joe-indiana",
    title: "Manufactured Homes in St. Joe, Indiana: Building on Rural DeKalb County Land",
    excerpt:
      "Buying acreage near St. Joe? Here is how well, septic and site prep sequence against a Champion manufactured home build, and what to settle before you order.",
    image: "/images/homepage/feature-find-land.webp",
    date: "September 18, 2026",
    html: `
<p>St. Joe sits in the eastern half of DeKalb County, in the farm country along the river that gives the town its name. Buyers here are almost never shopping for a lot in a subdivision &mdash; they have inherited ground, bought a few acres off a family farm, or are splitting a parcel. That changes the order of operations in a way nobody explains until you are already three weeks behind.</p>

<h2>The sequence that saves you a month</h2>
<p>On rural DeKalb ground you are usually on a private well and a septic system. Those are not afterthoughts &mdash; the septic permit depends on a soil evaluation, and soil work depends on weather and on the county health department&rsquo;s schedule. The mistake we watch people make is ordering the home first and starting the soil test later, then waiting on a permit while a finished home sits at the plant.</p>
<p>Do it the other way. Get the soil evaluation moving, get your septic design in front of the county, and let the factory build run in parallel. A Champion <strong>manufactured home</strong> takes 6 to 8 weeks to build; that is 6 to 8 weeks your excavator and well driller can be working. Handled in the right order, the whole project is 8 to 12 weeks. Handled backwards, it is five months.</p>

<h2>What fits on acreage</h2>
<p>With land you are not squeezed by setbacks, so the multi-section lineup opens up &mdash; <a href="/series/redman">Redman</a> and multi-section <a href="/series/aspire">Aspire</a> homes run to five bedrooms with kitchen islands and full primary suites. All HUD-code manufactured homes, built indoors and delivered finished. Browse the <a href="/floor-plans">floor plans</a> and note two or three before you visit.</p>

<h2>You hire your own crews</h2>
<p>We sell the home and arrange delivery. Site work, foundation, well, septic, utility hookups and setup are yours to contract. We keep a referral list of licensed and insured crews previous customers have used. Delivery, set-up and site-work ranges are published in the <a href="/guides/pricing">pricing guide</a> so you can budget before you commit.</p>

<h2>Common questions</h2>
<h3>Can I put a manufactured home on my own land here?</h3>
<p>On most rural DeKalb County parcels, yes, subject to the zoning district and foundation requirements on your specific ground. Confirm with the county before ordering &mdash; our <a href="/guides/zoning">zoning guide</a> covers the questions to ask.</p>
<h3>Does delivery cost more out here?</h3>
<p>Barely. St. Joe is a short run from Auburn, and Champion&rsquo;s Topeka plant is about 30 miles from our lot. Freight is quoted as its own line on your sheet, never buried in the home price.</p>
<h3>Next step?</h3>
<p>Read the <a href="/guides/site-work">site work guide</a>, then <a href="/contact-us">send us your parcel details</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-spencerville-indiana",
    title: "Manufactured Homes in Spencerville, Indiana: Delivery and Access on Country Roads",
    excerpt:
      "Spencerville buyers place homes on farm parcels and long lanes. What a multi-section delivery actually needs to reach your site, and how to check before you order.",
    image: "/images/homepage/double-wides.webp",
    date: "September 18, 2026",
    html: `
<p>Spencerville is a crossroads community in northeast DeKalb County &mdash; covered bridge, river, farm ground in every direction. Almost every home we deliver around here goes onto private land at the end of a lane, and that raises a question nobody thinks about until the transport is scheduled: <em>can the home physically get to the spot you picked?</em></p>

<h2>What a delivery actually needs</h2>
<p>A single-section manufactured home travels as one box. A multi-section travels as two or three, each on its own transport, and each one needs room to swing. The things that stop a delivery are rarely dramatic: a lane too narrow between mature trees, a soft spot that will not carry a loaded transport after a wet week, a turn radius at the road, a low line crossing the drive, or a seasonal load posting on the bridge you assumed everyone uses.</p>
<p>None of that is a reason to give up on the site you want. It is a reason to walk the route before you order rather than after. Your site contractor can widen a lane, build up a soft approach, or schedule around a posting &mdash; all cheap in advance, all expensive on the morning a transport is idling at your mailbox.</p>

<h2>Timing around the farm calendar</h2>
<p>Around Spencerville the roads get busy with equipment at planting and harvest, and spring thaw is when soft ground is softest. If your schedule is flexible, late summer and early fall tend to be the easiest windows for both delivery and site work. If it is not flexible, say so early and we will plan the route and the date around it.</p>

<h2>The home itself</h2>
<p>Champion builds our <strong>manufactured homes</strong> to the federal HUD code, indoors, on a schedule that does not care about Indiana weather &mdash; 6 to 8 weeks from order. Single-section homes for a simple footprint, multi-section for full family layouts. See the <a href="/floor-plans">full lineup</a>, and read the <a href="/guides/delivery-and-setup">delivery and set-up guide</a> for how the day itself runs.</p>

<h2>Common questions</h2>
<h3>Who checks whether my lane will work?</h3>
<p>Walk it with your site contractor early, and tell us what you find. We arrange transport; your contractor handles the site, the approach and the setup.</p>
<h3>Is a multi-section home realistic on a rural parcel?</h3>
<p>Very often yes &mdash; most rural DeKalb County sites have the room. Access, not acreage, is the usual constraint.</p>
<h3>More local detail?</h3>
<p>See <a href="/locations/dekalb-county">our DeKalb County page</a> or <a href="/contact-us">request a quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-ashley-indiana",
    title: "Manufactured Homes in Ashley, Indiana: Which County’s Rules Apply to Your Lot",
    excerpt:
      "Ashley straddles the DeKalb and Steuben county line, and the rules for placing a manufactured home are not identical on both sides. How to find out which set governs your parcel.",
    image: "/images/homepage/about-2.webp",
    date: "September 18, 2026",
    html: `
<p>Ashley is a small town with an unusual complication for anyone placing a home: the town sits on the DeKalb&ndash;Steuben county line. Neighbors a few hundred feet apart can fall under different county plan commissions, different zoning ordinances, and different permit desks. If you are buying a lot here, the first question is not which floor plan &mdash; it is which county you are actually in.</p>

<h2>Why it matters more than it sounds</h2>
<p>County ordinances differ on the details that decide whether a <strong>manufactured home</strong> works on your parcel: the zoning districts that permit one, minimum width or square footage, whether a permanent perimeter foundation is required, skirting standards, and setbacks. Two adjacent lots can have genuinely different answers. Guessing, or assuming the rule your cousin followed in another township applies to you, is how people end up with a home they cannot place as planned.</p>

<h2>How to settle it in one afternoon</h2>
<p>Pull your parcel number from the property tax record &mdash; it tells you the county and township outright. Then call that county&rsquo;s plan commission with the parcel number in hand and ask three questions: is a HUD-code manufactured home permitted in this zoning district, what foundation and skirting are required, and what permits do I need before delivery. Write the answers down with the name of the person who gave them. Our <a href="/guides/zoning">zoning guide</a> lays this out in more detail.</p>

<h2>Then the easy part</h2>
<p>Ashley is a short drive from our Auburn showroom &mdash; close enough to come twice. Champion&rsquo;s HUD-code lineup runs from single-section <a href="/series/prime">Prime</a> homes through multi-section <a href="/series/aspire">Aspire</a> layouts, all built indoors in 6 to 8 weeks and quoted line by line. Browse <a href="/floor-plans">floor plans</a> before you come so the visit is about deciding, not browsing.</p>

<h2>Common questions</h2>
<h3>Which county is Ashley in?</h3>
<p>Both, depending on the parcel &mdash; the town straddles the line. Your parcel number settles it; do not assume from the mailing address.</p>
<h3>Does the county line change what I pay?</h3>
<p>Not the home. It can change permit fees and what your contractor has to build, which is one more reason every quote we write breaks the home, options and delivery onto separate lines.</p>
<h3>Who can help me read this?</h3>
<p>Bring us the parcel number and what the county told you &mdash; <a href="/contact-us">get in touch</a> and we will talk through which homes fit. See also <a href="/locations/steuben-county">Steuben County</a> and <a href="/locations/dekalb-county">DeKalb County</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-avilla-indiana",
    title: "Manufactured Homes in Avilla, Indiana: The Shortest Freight Run We Make",
    excerpt:
      "Avilla sits between our Auburn showroom and Champion’s Topeka plant. Why that geography puts Noble County buyers on the cheapest delivery route we quote.",
    image: "/images/homepage/double-wide-exterior.webp",
    date: "September 18, 2026",
    html: `
<p>Avilla has a geographic advantage most buyers never think to look for. Our showroom is in Auburn, east of town. Champion&rsquo;s Topeka plant &mdash; where your <strong>manufactured home</strong> is actually built &mdash; is about 30 miles west of us. Avilla sits between them. Your home is not making a long haul to reach you; it is essentially stopping on the way.</p>

<h2>Why freight is worth caring about</h2>
<p>Delivery is one of the biggest costs buyers never see coming, because most dealers bundle it into a single price and you never learn what it was. We quote it as its own line. On a short northeast Indiana run like Avilla, that line sits at the low end of the published range in our <a href="/guides/pricing">pricing guide</a> &mdash; and because it is itemized, you can carry our sheet to any other dealer and see whether their bundled number is really competitive or just opaque.</p>

<h2>Noble County placement</h2>
<p>Noble County is generally workable ground for manufactured homes on rural parcels, and Avilla itself has in-town lots where a single-section home fits comfortably. As everywhere, it is parcel-specific: the zoning district, foundation requirements and setbacks decide what you can place. You or your contractor confirm with the county and pull permits &mdash; start with our <a href="/guides/zoning">zoning guide</a>. We do not perform site work or setup, so none of that is marked up in your quote.</p>

<h2>What you are actually buying</h2>
<p>A HUD-code home built indoors on a controlled line, inspected through the build, delivered finished. Champion&rsquo;s <a href="/series/aspire">Aspire</a> series is the broadest lineup we carry &mdash; single-section homes for first-time buyers and downsizers, multi-section homes with full family layouts. <a href="/series/redman">Redman</a> goes larger, with islands and big primary suites. See the <a href="/floor-plans">full catalogue</a>, then come walk a few in Auburn; it is a short drive east.</p>

<h2>Common questions</h2>
<h3>How close is the factory really?</h3>
<p>Champion&rsquo;s Topeka plant is about 30 miles from our Auburn lot, and Avilla sits between the two. Short freight, and short trips for anyone who needs to get back out to your site.</p>
<h3>How long from order to keys?</h3>
<p>Typically 8 to 12 weeks &mdash; 6 to 8 weeks of factory build with your contractor&rsquo;s site prep running alongside it.</p>
<h3>More on the area?</h3>
<p>See <a href="/locations/noble-county">our Noble County page</a>, the nearby <a href="/locations/kendallville">Kendallville</a> and <a href="/locations/albion">Albion</a> pages, or <a href="/contact-us">request a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-rome-city-indiana",
    title: "Manufactured Homes at Rome City and Sylvan Lake: Replacing an Aging Lake Cottage",
    excerpt:
      "Lake lots come with tight setbacks, older septic systems and seasonal cottages that were never built for winter. How a new HUD-code home fits a Rome City parcel.",
    image: "/images/homepage/feature-find-home.webp",
    date: "September 18, 2026",
    html: `
<p>A lot of Sylvan Lake property around Rome City carries a cottage that was built for July. Uninsulated or barely insulated, a furnace added later, a septic system that predates the rules it would be held to today. Families inherit these places, love the location, and discover that making one genuinely livable year-round costs more than the structure is worth. Replacing it with a new <strong>manufactured home</strong> is often the cheaper and warmer answer.</p>

<h2>What a lake lot demands</h2>
<p>Lake parcels are the tightest sites we deal with, and the constraints are real: shoreline setbacks, small platted lots, narrow access, neighbors close on both sides, and septic that may need to be replaced or relocated as part of the project. Some lots take a multi-section home comfortably; others only work with a single-section. This is decided by the parcel and by Noble County, not by a brochure &mdash; get the county&rsquo;s answer on setbacks, foundation and septic before you choose a floor plan. Our <a href="/guides/zoning">zoning guide</a> and <a href="/guides/site-work">site work guide</a> cover the ground.</p>

<h2>Built for February, not just July</h2>
<p>This is where a modern HUD-code home separates itself from the cottage it replaces. Today&rsquo;s manufactured homes are built to a federal construction and safety standard covering insulation, heating, structure and wind resistance, and Champion builds to the northern thermal zone for homes staying in Indiana. Insulation packages, better windows and a properly sized furnace are ordered as options up front &mdash; see <a href="/options">factory options</a>. A place you used to close up in September becomes a house you can live in.</p>

<h2>Access on delivery day</h2>
<p>Lake roads are narrow and often crowded in season. Walk the route with your site contractor before ordering, and plan delivery for the shoulder season if you can &mdash; late fall through early spring is usually far easier around the lakes. The <a href="/guides/delivery-and-setup">delivery and set-up guide</a> explains what the transport needs.</p>

<h2>Common questions</h2>
<h3>Can I replace an old cottage with a manufactured home on the same lot?</h3>
<p>Often yes, but the new home is held to current setbacks and septic rules even though the old one was not. Confirm with Noble County before you commit.</p>
<h3>Will a lake lot take a multi-section home?</h3>
<p>Some will, many will not. Bring us your lot dimensions and the county&rsquo;s setback answer and we will tell you straight which lineup fits.</p>
<h3>Where to next?</h3>
<p>See <a href="/locations/noble-county">Noble County</a>, browse <a href="/floor-plans">floor plans</a>, or <a href="/contact-us">send us the parcel details</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-hamilton-indiana",
    title: "Manufactured Homes in Hamilton, Indiana: Replacing an Old Trailer With a HUD-Code Home",
    excerpt:
      "If the home on your Steuben County lot predates 1976, it is not the same category of building as what we sell. What actually changed, and what replacement involves.",
    image: "/images/homepage/single-wides.webp",
    date: "September 18, 2026",
    html: `
<p>Around Hamilton and Hamilton Lake, as across rural Steuben County, there are still older homes on private lots that people call trailers &mdash; and in the technical sense they are right. Anything built before 15 June 1976 was made under no federal construction standard at all. What we sell is a different category of building that happens to share a delivery method.</p>

<h2>What changed in 1976, and what it means for you</h2>
<p>On that date the federal <strong>HUD code</strong> took effect: an enforceable national construction and safety standard covering structural design, insulation and energy, heating and electrical systems, fire safety and wind resistance, inspected at the plant through the build. Every home built to it carries a red certification label. A pre-1976 trailer has none of that behind it, which is why lenders, insurers and county ordinances all treat the two differently.</p>
<p>The practical consequences are large. Pre-HUD units are difficult to finance, expensive or impossible to insure well, and many counties will not permit one to be moved onto a new parcel. A new HUD-code <strong>manufactured home</strong> is financeable through ordinary chattel or land-home lending, insurable as a normal home, and permitted wherever the zoning district allows the category.</p>

<h2>What replacement actually involves</h2>
<p>Replacing an old unit on ground you already own is usually the most affordable route to a genuinely new home in Steuben County &mdash; you own the land, the utilities are there, and the access already carried a home in once. The parts to plan for: demolition and disposal of the old unit, an honest look at whether the existing septic still meets county requirements, whether the existing pad or piers suit the new home, and any setback rules the old placement was grandfathered against but the new one will not be. You or your contractor handle all of that and pull the permits; we sell the home and arrange delivery. See the <a href="/guides/site-work">site work guide</a> and our <a href="/guides/zoning">zoning guide</a>.</p>

<h2>Built for northern Indiana winters</h2>
<p>Champion builds to the northern thermal zone for homes staying here. Insulation levels, window packages and furnace sizing are ordered up front as <a href="/options">factory options</a> &mdash; worth spending on when the lot is exposed and the wind comes off the lake. Browse the <a href="/floor-plans">Champion lineup</a>, from single-section <a href="/series/prime">Prime</a> homes to multi-section <a href="/series/aspire">Aspire</a> layouts.</p>

<h2>Common questions</h2>
<h3>Is a manufactured home the same as a mobile home?</h3>
<p>Not legally. Mobile home refers to pre-1976 units built to no federal standard. Everything built since is a manufactured home built to the HUD code. The words get used interchangeably in conversation; lenders, insurers and zoning offices do not use them interchangeably.</p>
<h3>Can I finance a new home on land I already own?</h3>
<p>Usually, and owning the land outright often improves your terms. See <a href="/financing">financing options</a>.</p>
<h3>What about the old unit?</h3>
<p>Demolition and disposal are contracted by you. Get that quote before you order so the full picture is on one page. <a href="/contact-us">Talk it through with us</a>, or see <a href="/locations/steuben-county">our Steuben County page</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-fremont-indiana",
    title: "Manufactured Homes in Fremont, Indiana: Year-Round Living in Steuben County Lake Country",
    excerpt:
      "Fremont sits in the northern lakes, minutes from the Michigan line. What to order on a Champion manufactured home so a lake-country property works in January.",
    image: "/images/homepage/feature-financing.webp",
    date: "September 18, 2026",
    html: `
<p>Fremont sits at the top of Steuben County, close to the Michigan line and surrounded by the lakes that bring the county its summer population. Plenty of property up here was developed for seasonal use and is slowly converting to year-round living &mdash; which is a different engineering problem than most buyers expect.</p>

<h2>The options that matter in a northern winter</h2>
<p>A Champion <strong>manufactured home</strong> is built to the HUD code, and that code sets thermal requirements by zone &mdash; a home staying in northern Indiana is built to a different specification than one headed to Alabama. Beyond the baseline, the choices worth making at order time are the ones you cannot retrofit cheaply: upgraded insulation in floor, walls and ceiling, better window packages, and a furnace sized for the house you actually ordered rather than the smallest one that qualifies.</p>
<p>These go on the order sheet as <a href="/options">factory options</a>, get built into the home on the line, and show up as their own lines on your quote. Spending here is the difference between a home that is comfortable in February and one that is merely legal in February.</p>

<h2>Skirting, water lines and the freeze question</h2>
<p>The other half of winter performance is under the home, and that part belongs to your site contractor, not to us. Properly insulated skirting, protected and heat-taped water lines where required, and drainage that moves water away from the perimeter rather than into it. It is unglamorous work that decides whether you spend a January weekend under the house with a heat gun. Our <a href="/guides/site-work">site work guide</a> covers what to specify; we keep a referral list of licensed and insured crews previous buyers have used.</p>

<h2>Distance and delivery</h2>
<p>Fremont is a straight run up I-69 from our Auburn showroom, and Champion&rsquo;s Topeka plant is about 30 miles west of us &mdash; an easy northeast Indiana freight route, quoted as its own line at the rates published in our <a href="/guides/pricing">pricing guide</a>. Come walk homes on a weekday or Saturday morning; browse <a href="/floor-plans">floor plans</a> first so the trip is productive.</p>

<h2>Common questions</h2>
<h3>Can a manufactured home really be a year-round home up here?</h3>
<p>Yes &mdash; thousands are, across northern Indiana and Michigan. The variables are the insulation and heating package you order and the quality of the skirting and utility work underneath.</p>
<h3>Are lake lots harder to build on?</h3>
<p>Often, because of setbacks, lot size, septic and access. Get Steuben County&rsquo;s answers on your parcel before choosing a floor plan.</p>
<h3>More detail?</h3>
<p>See <a href="/locations/steuben-county">Steuben County</a>, nearby <a href="/locations/angola">Angola</a>, or <a href="/contact-us">request a quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-leo-cedarville-indiana",
    title: "Manufactured Homes in Leo-Cedarville: Getting Onto Allen County Acreage",
    excerpt:
      "Land in northeast Allen County is not cheap. Splitting your budget between the parcel and a Champion manufactured home is how buyers still get there.",
    image: "/images/homepage/feature-find-land.webp",
    date: "September 18, 2026",
    html: `
<p>Leo-Cedarville is one of the more sought-after corners of Allen County, and the price of ground reflects it. Buyers who want to live here run into the same wall repeatedly: between the land and a site-built house, the total lands somewhere they cannot reach. The way people actually get onto acreage in this area is by changing which half of that equation absorbs the budget.</p>

<h2>The structural math</h2>
<p>A new-construction project has two costs: the land and the house. You cannot negotiate the land down &mdash; the market sets it. You can change what the house costs per finished square foot, and that is where a factory-built home does its work. Champion&rsquo;s <strong>manufactured homes</strong> are built indoors on a production line, with materials bought at volume and no weather delays, and we sell them factory-direct with the home, options and delivery each on their own line. The saving is not a discount on a lesser house; it is a different cost structure for a comparable one.</p>
<p>Multi-section <a href="/series/redman">Redman</a> and <a href="/series/aspire">Aspire</a> homes reach five bedrooms with kitchen islands, walk-in closets and full primary suites. Walk one before you assume what the category looks like &mdash; most people&rsquo;s mental image is thirty years out of date. Start with the <a href="/floor-plans">full lineup</a>.</p>

<h2>Allen County placement, honestly</h2>
<p>Allen County is large and its rules are not uniform across it. Whether a HUD-code manufactured home is permitted on a given parcel depends on the zoning district, and some districts and subdivisions have covenants of their own that zoning will not tell you about. Check both &mdash; the county for zoning and permits, the deed and plat for private restrictions &mdash; before you buy the land, not after. Our <a href="/guides/zoning">zoning guide</a> explains how to run both checks.</p>

<h2>Close enough to shop properly</h2>
<p>Our Auburn showroom is a short drive north, and the Topeka plant that builds these homes is about 30 miles from our lot. Come twice if you can: once to see the homes, once with whoever has to live in it. Financing works the same here as anywhere in the region; you choose your own lender, and <a href="/financing">our list</a> is a starting point.</p>

<h2>Common questions</h2>
<h3>Will a manufactured home fit the neighborhood?</h3>
<p>On acreage, a multi-section home with the right roof pitch, siding and porch reads much like a site-built ranch from the road. Come look rather than guessing.</p>
<h3>What stops a placement most often here?</h3>
<p>Private covenants, more often than county zoning. Read the deed restrictions on the parcel before you buy it.</p>
<h3>Next step?</h3>
<p>See <a href="/locations/fort-wayne">our Fort Wayne and Allen County page</a>, or <a href="/contact-us">bring us a parcel to look at</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-grabill-indiana",
    title: "Manufactured Homes near Grabill, Indiana: Buying on Rural Allen County Ground",
    excerpt:
      "Grabill sits in the farm country of northeast Allen County. What placing a Champion manufactured home on acreage here involves, from utilities to outbuildings.",
    image: "/images/homepage/double-wides.webp",
    date: "September 18, 2026",
    html: `
<p>The country around Grabill is working farm ground &mdash; open fields, long lanes, a strong building culture, and parcels that are usually measured in acres rather than feet. Buyers here tend to arrive with a clear picture of what they want and a practical question: what does it take to put a new home on this ground and be done before winter.</p>

<h2>Utilities set the timeline, not the house</h2>
<p>On rural Allen County parcels you are typically on a private well and septic, and possibly running a new electric service to the site. Those are the long poles. The soil evaluation that drives the septic design depends on weather and on the health department&rsquo;s calendar; a well driller has a schedule of his own. The <strong>manufactured home</strong> itself is the predictable part &mdash; 6 to 8 weeks on the factory line, built indoors regardless of what the weather does.</p>
<p>So run them in parallel. Get the soil work and the well moving while the home is being built, and the whole project lands at 8 to 12 weeks. Run them in sequence and you will add months for no reason. Our <a href="/guides/site-work">site work guide</a> lays out the order.</p>

<h2>Planning for the buildings that come after</h2>
<p>Most people out here are not only placing a house. There is a pole barn, a shop, a garage, or livestock housing either already standing or planned. Site the home with that in mind from the start: leave the equipment access you will need, keep the septic field clear of where you intend to build or drive, and think about the driveway serving both. Moving a house later is possible and expensive; moving a septic field is worse.</p>

<h2>What we do and what you contract</h2>
<p>We sell the home and arrange its delivery from Champion&rsquo;s Topeka plant, about 30 miles from our Auburn lot. Foundation, utilities, setup and site work are hired by you. Delivery, set-up and site-work ranges are published in our <a href="/guides/pricing">pricing guide</a>, and every home is quoted line by line. Browse the <a href="/floor-plans">Champion lineup</a> before you visit.</p>

<h2>Common questions</h2>
<h3>Can I put a manufactured home on my farm ground?</h3>
<p>Commonly yes on rural Allen County parcels, subject to the zoning district and foundation requirements on your specific ground. Confirm with the county first.</p>
<h3>How much land do I need?</h3>
<p>Less than most people assume &mdash; access and setbacks usually decide the question rather than total acreage.</p>
<h3>Where do I start?</h3>
<p>See <a href="/locations/fort-wayne">our Allen County page</a>, read the <a href="/guides/zoning">zoning guide</a>, then <a href="/contact-us">send us your parcel details</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-harlan-indiana",
    title: "Manufactured Homes in Harlan, Indiana: What a Multi-Section Delivery Needs",
    excerpt:
      "Harlan sits in far northeast Allen County, where most homes go in at the end of a driveway. A practical checklist for making sure the transport can reach your site.",
    image: "/images/homepage/feature-find-home.webp",
    date: "September 18, 2026",
    html: `
<p>Harlan is about as far northeast as Allen County goes before it runs into Ohio, and nearly every home we place around here goes onto private land reached by a driveway rather than a street. That makes access the single most common thing that complicates an otherwise simple project &mdash; and the easiest thing to solve, if you look at it early.</p>

<h2>Walk the route before you order</h2>
<p>A multi-section <strong>manufactured home</strong> arrives as two or three separate boxes, each on its own transport, each needing room to turn in and room to maneuver once it is on your ground. Before you sign anything, walk the whole route with your site contractor and look for five things: the turn from the road onto your drive, the width between anything permanent &mdash; trees, posts, a well head &mdash; the load-bearing quality of the drive after a wet week, overhead lines crossing it, and any seasonal weight postings on the bridges or roads the route depends on.</p>
<p>Every one of those is cheap to address in advance. A drive can be widened, an approach built up with stone, a low line temporarily lifted, a delivery date moved off a posting. What you want to avoid is discovering the problem on the morning the transport arrives, which is when it becomes expensive.</p>

<h2>Where the home will actually sit</h2>
<p>Once it is on the property, the set location needs working room around the whole perimeter for the crew and equipment. Think about where the septic field goes, where you want the drive to finish, and which way the house should face for winter wind and summer sun &mdash; decisions that cost nothing now and cannot be revisited later. Our <a href="/guides/delivery-and-setup">delivery and set-up guide</a> walks through the day itself.</p>

<h2>The straightforward part</h2>
<p>The home is built indoors at Champion&rsquo;s Topeka plant, about 30 miles from our Auburn showroom, in 6 to 8 weeks &mdash; no weather delays, no framing crew to chase. Single-section homes for a simple footprint, multi-section for full family layouts; see the <a href="/floor-plans">full lineup</a>. We handle the home and the transport. Site work, foundation, utilities and setup are contracted by you.</p>

<h2>Common questions</h2>
<h3>What if my driveway will not work?</h3>
<p>Usually it will, with a modest amount of preparation. Find out early and your contractor can fix it for very little; find out late and it stops the delivery.</p>
<h3>Can you deliver into the Ohio side?</h3>
<p>Yes &mdash; we deliver throughout Indiana, Ohio and Michigan, with freight quoted per route.</p>
<h3>More local information?</h3>
<p>See <a href="/locations/fort-wayne">our Allen County page</a>, or <a href="/contact-us">ask for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-wolcottville-indiana",
    title: "Manufactured Homes in Wolcottville, Indiana: Lake Parcels and Older Septic Systems",
    excerpt:
      "Wolcottville sits in the northern lakes of Noble County, where septic is usually what decides a project. What to check on a lake parcel before you order a home.",
    image: "/images/homepage/about-2.webp",
    date: "September 18, 2026",
    html: `
<p>Wolcottville sits up in the northern lakes of Noble County, close enough to the LaGrange County line that plenty of buyers here are looking at parcels in both directions. It is lake and near-lake country, and on this kind of ground one thing decides more projects than zoning, budget or floor plan: the septic system.</p>

<h2>Confirm which county your parcel is in</h2>
<p>Before anything else, pull your parcel number off the property tax record. It names the county and township outright, and up here that is worth checking rather than assuming from a mailing address. Then call that county&rsquo;s plan commission with the number in hand and ask whether a HUD-code <strong>manufactured home</strong> is permitted in your zoning district, what foundation and skirting are required, what the setbacks are, and which permits must be in place before delivery. Write down the name of whoever answers. Ordinances differ from county to county on exactly these points, so a neighbour&rsquo;s experience is not a substitute for your own parcel&rsquo;s answer. Our <a href="/guides/zoning">zoning guide</a> covers the process.</p>

<h2>Lakes, septic and older systems</h2>
<p>Much of the ground around Wolcottville is lake and near-lake property, and septic is usually the deciding factor. If you are buying a parcel with an existing system, have it evaluated before closing rather than after &mdash; an older system may not meet what the county would require for a new home, and replacing one is a real budget line. If you are starting fresh, the soil evaluation drives the design and the design drives the permit, so start it early and let the factory build run alongside. The <a href="/guides/site-work">site work guide</a> explains the sequence.</p>

<h2>A short run from the plant</h2>
<p>Champion&rsquo;s Topeka plant is in LaGrange County, close to this area, and our Auburn showroom is about 30 miles east of it. Wolcottville sits between the two &mdash; a short freight route, quoted as its own line rather than folded into the home price. Browse the <a href="/floor-plans">Champion lineup</a> and come walk a few; single-section <a href="/series/prime">Prime</a> and <a href="/series/aspire">Aspire</a> homes for tighter lots, multi-section <a href="/series/aspire">Aspire</a> layouts where the parcel allows.</p>

<h2>Common questions</h2>
<h3>Which county am I in?</h3>
<p>Your parcel number answers it, and it is worth confirming rather than assuming from the mailing address before you count on any particular ordinance.</p>
<h3>Does an existing septic system carry over to a new home?</h3>
<p>Sometimes, sometimes not. The county decides, and it is worth knowing before you buy the parcel.</p>
<h3>Where to next?</h3>
<p>See <a href="/locations/noble-county">Noble County</a>, <a href="/locations/lagrange-county">LaGrange County</a>, or <a href="/contact-us">send us the parcel details</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-woodburn-indiana",
    title: "Manufactured Homes in Woodburn, Indiana: Building Near the Floodplain",
    excerpt:
      "Eastern Allen County is Maumee River country, and some parcels sit in a mapped flood zone. How to find out before you buy, and what it changes about placing a manufactured home.",
    image: "/images/homepage/double-wide-exterior.webp",
    date: "September 28, 2026",
    html: `
<p>Woodburn sits out in the flat farm country of eastern Allen County, toward the Ohio line, where the land drains to the Maumee. Most parcels here are perfectly ordinary building ground. Some are not &mdash; and the difference is a line on a federal flood map that most buyers never look at until a lender or a permit clerk brings it up.</p>

<h2>Look up the flood map before you buy the land</h2>
<p>FEMA publishes flood maps for every county, searchable by address in its Flood Map Service Center. If any part of the spot where you want the home falls in a <em>special flood hazard area</em>, three things follow: the county&rsquo;s floodplain ordinance applies to the placement, a lender will almost certainly require flood insurance, and the cost of the foundation goes up. None of that makes the parcel unbuildable. It makes it a different project, and you want to know which project you are buying before you close on the ground.</p>
<p>Allen County has a floodplain administrator whose job is exactly this question. Call with the parcel number, ask whether the home site is in a mapped zone, and if it is, ask what elevation the lowest floor has to sit at. Indiana sets its flood protection grade above the federal base flood elevation, so do not assume a national rule of thumb applies here &mdash; get the figure for your parcel, in writing.</p>

<h2>What a flood zone changes about the home</h2>
<p>A HUD-code <strong>manufactured home</strong> placed in a flood zone has to be elevated to the required height and anchored so it cannot float or shift. That is foundation work &mdash; taller piers or a raised foundation, anchoring designed for the site, sometimes fill brought in to raise the pad. It is your contractor&rsquo;s scope, not ours; we sell the home and arrange delivery, and we never perform site work or setup. What we can tell you is that the home itself does not change: the same Champion floor plans fit, built indoors to the federal HUD code.</p>
<p>Often the best answer is simply moving the home site. On a larger parcel, the mapped zone may only cover the low corner by the ditch, and shifting the pad a hundred feet puts it on ordinary ground. Walk the land with the map in hand before you pick the spot.</p>

<h2>Budget the site honestly</h2>
<p>Elevation and anchoring are the kind of costs that surprise people because they are invisible on a floor plan. The <a href="/guides/pricing">pricing guide</a> publishes typical ranges for delivery, set-up and site work, and the <a href="/guides/site-work">site work guide</a> explains the foundation options. Your quote from us lists the home, options and delivery on separate lines, so the site budget stays yours to control.</p>

<h2>Common questions</h2>
<h3>How do I know whether my Woodburn parcel is in a flood zone?</h3>
<p>Look the address up on FEMA&rsquo;s flood map, then confirm with the Allen County floodplain administrator. The administrator&rsquo;s answer is the one that governs your permit.</p>
<h3>Can a manufactured home go in a flood zone at all?</h3>
<p>Usually yes, if it is elevated and anchored to the county&rsquo;s standard. It costs more at the foundation, and flood insurance becomes a line in your monthly budget.</p>
<h3>What next?</h3>
<p>See <a href="/locations/fort-wayne">our Allen County page</a>, read the <a href="/guides/zoning">zoning guide</a>, or <a href="/contact-us">ask for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-pleasant-lake-indiana",
    title: "Manufactured Homes in Pleasant Lake, Indiana: Single-Level Living That Lasts",
    excerpt:
      "Pleasant Lake buyers are often planning for the next twenty years, not the next five. How to choose a manufactured home you can still get around in at 80 — entry height, hallways and bathrooms.",
    image: "/images/homepage/about-2.webp",
    date: "September 28, 2026",
    html: `
<p>Pleasant Lake is a small town in southern Steuben County, a few minutes off I-69 and not far from our Auburn lot. A lot of the buyers we meet from around here are not first-time buyers at all. They are selling a two-story house, or moving closer to family, and the question on their mind is simple: <em>will I still be comfortable in this home when my knees are twenty years older?</em></p>

<h2>Every room on one floor is only the start</h2>
<p>A Champion <strong>manufactured home</strong> is single-level by design &mdash; no stairs to the bedroom, no basement laundry. That is a real advantage, but it is not the whole answer. Two homes with the same square footage can be very different to live in if you use a walker, a cane or a wheelchair, or if you might one day. Walk the floor plans with these in mind:</p>
<ul>
  <li><strong>Hallway width and turns.</strong> A straight, short hallway is easier than one with a dog-leg.</li>
  <li><strong>The primary bathroom.</strong> Look at the shower, not just the tub. A walk-in shower is easier to live with than a tub you have to step over, and space beside the toilet matters if a grab bar goes in later.</li>
  <li><strong>Laundry location.</strong> Near the bedrooms means fewer trips carrying baskets.</li>
  <li><strong>Kitchen layout.</strong> An open plan with room to turn beats a narrow galley.</li>
</ul>
<p>Plans vary, and so do the factory options. Bring a tape measure and your actual needs to the showroom and ask which options a specific plan offers &mdash; do not assume a feature is available from a photo.</p>

<h2>The steps at the front door are a foundation decision</h2>
<p>The one thing a floor plan cannot show you is how high the front door will be off the ground. That is set by the foundation your contractor builds &mdash; piers, a crawlspace, a raised pad &mdash; and it decides how many steps you climb every day, or how long a ramp would need to be. If a ramp or a low entry matters to you, tell your site contractor before the foundation is designed, not after. The <a href="/guides/site-work">site work guide</a> explains the foundation choices, and the <a href="/guides/delivery-and-setup">delivery and set-up guide</a> covers the steps and skirting that finish the job.</p>

<h2>Lake-area parcels</h2>
<p>Steuben County is lake country, and a parcel near the water can carry lake-association covenants on top of county zoning. Read the covenants and ask the county plan commission about your specific parcel before you buy. Our <a href="/guides/zoning">zoning guide</a> lists the questions to ask.</p>

<h2>Common questions</h2>
<h3>Single-section or multi-section for downsizing?</h3>
<p>Both work. Single-section <a href="/series/prime">Prime</a> and <a href="/series/aspire">Aspire</a> homes keep the footprint small and the upkeep light; a multi-section home gives wider rooms, which is often what makes a wheelchair workable. See <a href="/guides/single-wide-vs-double-wide">single-wide vs double-wide</a>.</p>
<h3>Can I see the homes without a long walk?</h3>
<p>The showroom is open Monday to Friday 9&ndash;5 and Saturday 10&ndash;4. Call ahead and tell us which plans you want to see, and we will point you straight to them.</p>
<h3>Where do I start?</h3>
<p>See <a href="/locations/steuben-county">our Steuben County page</a>, browse the <a href="/floor-plans">floor plans</a>, or <a href="/contact-us">ask for a quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-orland-indiana",
    title: "Manufactured Homes in Orland, Indiana: Floor Plans for Two Generations",
    excerpt:
      "Moving a parent in, or a grown child back home? How Orland-area families choose a manufactured home layout that gives two households room — split bedrooms, second living areas and bathroom count.",
    image: "/images/homepage/feature-find-home.webp",
    date: "September 28, 2026",
    html: `
<p>Orland is a quiet town in northwest Steuben County, close to the Michigan line and a short run from the Topeka plant where Champion builds our homes. More and more of the families we talk to from out this way are shopping for two generations at once &mdash; a widowed parent moving in, a grown child coming home with a baby, or a couple who want Grandma close but not in the next bedroom.</p>

<h2>What makes a layout work for two households</h2>
<p>Square footage matters less than where the rooms sit. When you browse the <a href="/floor-plans">floor plans</a>, look for these:</p>
<ul>
  <li><strong>Split bedrooms.</strong> The primary suite at one end of the home, the other bedrooms at the far end, with the kitchen and living room between. It is the single most useful feature for shared living &mdash; two sets of sleep schedules, no shared wall.</li>
  <li><strong>Two full bathrooms, minimum.</strong> One attached to the primary suite, one for everyone else. Three is better if the plan allows.</li>
  <li><strong>A second living area.</strong> Many multi-section plans include a den or family room separate from the main living room. That is where a parent watches their own programmes, or where the kids go when the adults want quiet.</li>
  <li><strong>A bedroom near a bathroom, on the ground-level entry side.</strong> If mobility is part of the reason for the move, fewer steps between bed, bath and the door is everything.</li>
</ul>
<p>Multi-section <a href="/series/aspire">Aspire</a> and <a href="/series/redman">Redman</a> homes are where most of these layouts live, running up to four and five bedrooms. They are all HUD-code <strong>manufactured homes</strong>, built indoors in 6 to 8 weeks and delivered finished.</p>

<h2>Check what the parcel allows</h2>
<p>A larger multi-section home needs room for its footprint plus setbacks, parking and a septic field sized for the bedroom count &mdash; septic permits are usually tied to how many bedrooms the home has. Before you commit to a five-bedroom plan, ask the county health department what the soil on your parcel can support, and ask the Steuben County plan commission about zoning, foundation and setback rules for your specific parcel. You or your contractor confirm those and pull the permits; the <a href="/guides/zoning">zoning guide</a> and <a href="/guides/site-work">site work guide</a> cover what to ask.</p>

<h2>Bring everyone to the showroom</h2>
<p>This is a decision better made with every generation in the room. Walk two or three multi-section homes together and let each person say where they would sleep, sit and cook. Every quote is line-item &mdash; home, options, delivery, each on its own line &mdash; so you can compare layouts on equal terms.</p>

<h2>Common questions</h2>
<h3>How many bedrooms do we need?</h3>
<p>Count the bedrooms you need now, then add one for the change you can see coming. Remember the septic permit follows the bedroom count.</p>
<h3>Is a multi-section home harder to deliver to Orland?</h3>
<p>Not usually. It travels in sections, and freight from our lot is quoted as its own line. Walk your driveway approach with your contractor before delivery.</p>
<h3>Next step?</h3>
<p>See <a href="/locations/steuben-county">our Steuben County page</a>, or <a href="/contact-us">send us the size of your household and parcel</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-laotto-indiana",
    title: "Manufactured Homes in Laotto, Indiana: Your Own Land or a Land-Lease Community?",
    excerpt:
      "Laotto buyers commuting to Fort Wayne weigh two very different ways to place a manufactured home: on ground they own, or on a leased lot in a community. How the two compare.",
    image: "/images/homepage/single-wides.webp",
    date: "September 28, 2026",
    html: `
<p>Laotto is a small community in southern Noble County, right where the farm country starts to give way to the Fort Wayne commute. The buyers we meet from around here usually have one foot in each world &mdash; a job in town, a wish for a little space &mdash; and before they choose a floor plan they have to choose where the home will sit. There are two very different answers.</p>

<h2>Option one: a home on land you own</h2>
<p>You buy a parcel, or use ground you already have, and place the home on it. You own both, so you build equity in the land as well as the home, and nobody else sets rules beyond the county&rsquo;s zoning. The trade-off is up-front work: a parcel search, a well and a septic system on most rural ground, a driveway, utility connections and a foundation, all of which you contract yourself. The <a href="/guides/site-work">site work guide</a> lays out that sequence, and the <a href="/guides/pricing">pricing guide</a> publishes typical site-work ranges so you can budget it.</p>

<h2>Option two: a home in a land-lease community</h2>
<p>You buy the home and rent the lot it sits on. The community has already built the roads, water, sewer and pads, so the site cost is mostly done for you and the cash needed to move in is usually lower. The trade-offs are a monthly lot rent that can rise over time, no equity in the ground, and the community&rsquo;s own rules. Those rules matter to a buyer: many communities set a minimum or maximum home width, require particular skirting or steps, and approve the home before it can be placed. Get the community&rsquo;s written requirements before you choose a floor plan, and ask what the lot rent has done over the past few years.</p>

<h2>Financing is not the same for both</h2>
<p>A home on land you own can often be financed together with the land. A home on a leased lot is usually financed as the home alone, on different terms. You choose your own lender either way; our <a href="/guides/financing">financing guide</a> explains the loan types in plain language, and the <a href="/financing">lender list on our financing page</a> names lenders past customers have used &mdash; we recommend none of them.</p>

<h2>The home is the same either way</h2>
<p>Whichever you choose, the home is a Champion HUD-code <strong>manufactured home</strong>, built indoors in 6 to 8 weeks. Single-section <a href="/series/prime">Prime</a> and <a href="/series/aspire">Aspire</a> homes suit most community lots; multi-section homes open up on your own ground. Browse the <a href="/floor-plans">floor plans</a> with your placement in mind.</p>

<h2>Common questions</h2>
<h3>Which costs less?</h3>
<p>Less cash up front is usually the community; less cost over twenty years is often your own land. Put both on paper with real figures before you decide.</p>
<h3>Will a community accept any home?</h3>
<p>No &mdash; each community sets its own rules on size, age and appearance. Read them before you pick a plan.</p>
<h3>Where do I start?</h3>
<p>See <a href="/locations/noble-county">our Noble County page</a>, or <a href="/contact-us">tell us which route you are leaning toward</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-topeka-indiana",
    title: "Manufactured Homes in Topeka, Indiana: What to Check on Delivery Day",
    excerpt:
      "Topeka is where Champion builds our homes. What happens between the plant gate and move-in, what to inspect when your manufactured home arrives, and how warranty items get handled.",
    image: "/images/homepage/hero-banner.webp",
    date: "September 28, 2026",
    html: `
<p>Topeka, in LaGrange County, is where Champion builds the homes we sell &mdash; the plant is about 30 miles from our Auburn showroom. We order your home to spec, quote it line by line, arrange delivery and stay your point of contact after move-in. This post is about the day the home arrives, which is the part of the process nobody prepares you for.</p>

<h2>From the plant to your site</h2>
<p>Once your order is placed, Champion builds the home indoors in about 6 to 8 weeks. While that happens, your own contractor prepares the site &mdash; foundation, utilities, driveway approach. When both are ready, the home travels from the plant to your site, and your set-up contractor places it, levels it, joins the sections on a multi-section home, and connects it. We arrange the transport; site work and setup are yours to contract, and we never perform them. The <a href="/guides/delivery-and-setup">delivery and set-up guide</a> walks through the day hour by hour.</p>

<h2>What to check when it arrives</h2>
<p>A home that has travelled on a highway deserves a careful look before you sign off on anything. Walk it slowly, with a notebook and your phone&rsquo;s camera:</p>
<ul>
  <li><strong>Every door and window.</strong> Open and close each one. Sticking can mean the home still needs levelling.</li>
  <li><strong>Walls and ceilings.</strong> Look for cracks at corners and along the marriage line where sections join.</li>
  <li><strong>Floors.</strong> Walk every room; note soft spots or seams that do not sit flat.</li>
  <li><strong>Water.</strong> Once plumbing is connected, run every tap and shower and look underneath sinks for drips.</li>
  <li><strong>Appliances and systems.</strong> Confirm the furnace, water heater and each appliance start, and keep the paperwork that came with them.</li>
</ul>
<p>Write down each item with a photo and the date. Some things are for your set-up contractor &mdash; levelling, a door that needs adjustment after the home settles, connections. Others are manufacturer items covered by Champion&rsquo;s limited warranty, and appliances and equipment carry their own makers&rsquo; warranties. Send the list to us in writing; we stay your point of contact and help you file warranty items with Champion.</p>

<h2>Give the home a few weeks</h2>
<p>A new home settles on its foundation. Small adjustments in the first month or two &mdash; a door, a trim piece &mdash; are normal. Keep adding to your list rather than calling about each one, and send it in together.</p>

<h2>Common questions</h2>
<h3>Does being close to the plant lower delivery cost?</h3>
<p>Freight is quoted per route as its own line on your sheet, and a short run from Topeka is about as short as it gets.</p>
<h3>Where to next?</h3>
<p>See <a href="/locations/lagrange-county">our LaGrange County page</a>, browse the <a href="/floor-plans">floor plans</a>, or <a href="/contact-us">ask for a quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-monroeville-indiana",
    title: "Manufactured Homes in Monroeville, Indiana: Planning Your Timeline Around the Seasons",
    excerpt:
      "Want to be moved in by a certain date? How Monroeville buyers work backward from move-in day — order date, factory build, frost, spring thaw and road postings — so the calendar works for them.",
    image: "/images/homepage/double-wides.webp",
    date: "September 28, 2026",
    html: `
<p>Monroeville sits in the southeast corner of Allen County, out where the farm fields run toward the Ohio line. The families we talk to from here usually have a date in mind &mdash; a lease that ends in May, a school year that starts in August, a parent who needs to move before winter. The good news is that a <strong>manufactured home</strong> is one of the most predictable ways to build. The catch is that northern Indiana weather is not, and the calendar works best when you plan backward from the day you want to move in.</p>

<h2>Work backward from move-in day</h2>
<p>From order to move-in usually runs 8 to 12 weeks. Champion builds the home indoors in about 6 to 8 of those weeks, and the plant schedules production by month, so the date your order is placed decides when your home comes off the line. While the home is being built, your own contractor prepares the site &mdash; permits, foundation, well and septic if you need them, utility connections and a driveway the transport can use. Both have to finish before delivery day. Whichever runs longer sets your move-in date.</p>
<p>So the useful question is not &ldquo;how long does the home take?&rdquo; It is &ldquo;how long will my site take, and when can my contractor start?&rdquo; Get that answer first.</p>

<h2>What the seasons change</h2>
<ul>
  <li><strong>Winter.</strong> The factory keeps building, because it is indoors. Frozen ground is what slows things down: digging footings, septic work and grading all get harder once the frost sets in. Ordering in winter for spring delivery is a common and sensible plan.</li>
  <li><strong>Spring thaw.</strong> Soft ground and seasonal load limits on some county roads can delay a heavy transport. Rural sites near Monroeville are exactly where that matters. Ask your contractor how the approach to your site holds up in March and April.</li>
  <li><strong>Summer and early fall.</strong> Usually the easiest window for both site work and delivery. They are also the busiest months for contractors, so book your crew early.</li>
</ul>

<h2>A simple plan</h2>
<ol>
  <li>Pick your target move-in month.</li>
  <li>Ask your site contractor how long your parcel will take and when they can start.</li>
  <li>Choose your floor plan and options, and place the order so production lines up with the site finishing.</li>
  <li>Confirm the delivery date once the site is ready &mdash; not before.</li>
</ol>
<p>The <a href="/guides/delivery-and-setup">delivery and set-up guide</a> walks through the final weeks, and the <a href="/guides/site-work">site work guide</a> covers what your contractor handles. We sell the home and arrange delivery; site work and setup are yours to contract.</p>

<h2>Common questions</h2>
<h3>Can a home be delivered in winter?</h3>
<p>Often yes, if the site is ready and the roads and approach can carry the transport. Frost usually slows the site work, not the delivery.</p>
<h3>What if my site is not ready when the home is built?</h3>
<p>That is why the order date should follow the site schedule. Ask us how the timing works before you order.</p>
<h3>Where do I start?</h3>
<p>See <a href="/locations/fort-wayne">our Allen County page</a>, browse the <a href="/floor-plans">floor plans</a>, or <a href="/contact-us">tell us your target move-in month</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-cromwell-indiana",
    title: "Manufactured Homes in Cromwell, Indiana: Choosing a Heating Fuel for a Rural Lot",
    excerpt:
      "No natural gas line on your road? How Cromwell-area buyers choose between propane, electric and natural gas for a new manufactured home, and what to settle before you order.",
    image: "/images/homepage/single-wides.webp",
    date: "September 28, 2026",
    html: `
<p>Cromwell is a small town in the southwest corner of Noble County, surrounded by farm ground and the lakes that run toward Kosciusko County. Buyers here tend to find out the same thing partway through planning: the natural gas main does not come down every country road. That turns a question most city buyers never think about &mdash; what will heat the house? &mdash; into one you should answer before you order the home.</p>

<h2>Why it matters before you order</h2>
<p>The furnace and water heater are built into a <strong>manufactured home</strong> at the plant. What fuel they burn depends on the plan and the factory options you choose, so it is far easier to get right on the order than to change after the home arrives. Ask which options a specific plan offers; do not assume from a photo.</p>

<h2>The three usual choices</h2>
<ul>
  <li><strong>Natural gas.</strong> Where a gas main reaches your road, it is often the simplest choice. Call the gas utility with your address and ask whether service is available and what connecting it involves.</li>
  <li><strong>Propane.</strong> The common answer on rural lots without gas service. It means a tank on your property, placed where the supplier and local fire rules allow, and a delivery truck that can reach it year-round. Talk to a propane supplier before you decide where the home sits, because tank placement and the driveway both affect it.</li>
  <li><strong>All-electric.</strong> No tank and no gas line, just one utility bill. Ask your electric provider about service to the site, and ask us which electric heating options a given plan offers.</li>
</ul>
<p>None of these is right for everyone. The best answer depends on what reaches your parcel, your electric provider, and how you like to heat. Get the facts for your address and decide from them.</p>

<h2>Who does what</h2>
<p>We sell the home and arrange delivery. Utility connections &mdash; the gas line, the propane tank and its piping, the electric service &mdash; are handled by your contractors and your utility or propane supplier. Put those calls on the list early; a utility connection can have its own lead time. The <a href="/guides/site-work">site work guide</a> explains the order things happen in, and the <a href="/guides/pricing">pricing guide</a> publishes typical ranges for site work.</p>

<h2>Common questions</h2>
<h3>Can I switch fuels later?</h3>
<p>Sometimes, but it usually means new equipment and new connections. It is much simpler to choose on the order.</p>
<h3>Does the fuel choice change the floor plan?</h3>
<p>Not usually. It changes the equipment inside the home and what your contractor connects outside it.</p>
<h3>Next step?</h3>
<p>See <a href="/locations/noble-county">our Noble County page</a>, browse the <a href="/floor-plans">floor plans</a>, or <a href="/contact-us">ask which heating options a plan offers</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-hudson-indiana",
    title: "Manufactured Homes in Hudson, Indiana: Adding a Porch, Deck or Garage",
    excerpt:
      "Most Hudson buyers want a porch, a deck or a garage with their new manufactured home. How those get built, why they usually stand on their own, and which permits to expect.",
    image: "/images/homepage/double-wide-exterior.webp",
    date: "September 28, 2026",
    html: `
<p>Hudson is a small town in southwest Steuben County, a short drive from our Auburn showroom. Almost every buyer we meet from out this way has a picture in mind that goes beyond the house itself &mdash; a covered front porch, a back deck for summer evenings, a garage for the truck and the mower. All of that is possible with a <strong>manufactured home</strong>. It just helps to know how it is done before you start.</p>

<h2>Outdoor structures usually stand on their own</h2>
<p>A HUD-code home is engineered as a complete structure, and the manufacturer&rsquo;s installation instructions set out what can and cannot be attached to it. The common approach for decks, porches and garages is to build them <em>freestanding</em> &mdash; on their own footings and posts &mdash; rather than hanging their weight off the home. Before anyone designs an attached porch or roof, check the home&rsquo;s installation instructions and ask how the addition must be supported.</p>

<h2>Plan them with the site, not after it</h2>
<ul>
  <li><strong>Where the steps land.</strong> The foundation sets how high your doors are off the ground, which decides how big a porch or deck needs to be.</li>
  <li><strong>Where the garage goes.</strong> A detached garage needs its own footprint, setbacks and driveway. Decide where it goes before the home is placed so the two work together.</li>
  <li><strong>What the lot allows.</strong> Steuben County setbacks and lot-coverage rules apply to the garage and the deck too, not just the home.</li>
</ul>

<h2>Permits and who builds them</h2>
<p>Decks, porches and garages usually need their own building permits. You or your contractor apply for them and build them; we sell the home and arrange its delivery and do not perform site work, setup or construction. Ask the Steuben County plan commission what is required for your parcel. The <a href="/guides/zoning">zoning guide</a> lists the questions to ask, and the <a href="/guides/site-work">site work guide</a> covers the foundation and setup side.</p>

<h2>Choose the home with the outdoor space in mind</h2>
<p>Look at where the doors are on each floor plan. A plan with a door off the kitchen or dining area makes a back deck easy to use every day. Browse the <a href="/floor-plans">floor plans</a> with that in mind, then come walk a few at the showroom.</p>

<h2>Common questions</h2>
<h3>Can I attach a porch roof to the home?</h3>
<p>Only if the home&rsquo;s installation instructions allow it and the design follows them. Many buyers build a freestanding porch instead.</p>
<h3>Can I add a garage later?</h3>
<p>Yes, but leave room for it when you place the home, and check setbacks for both at the start.</p>
<h3>Where do I start?</h3>
<p>See <a href="/locations/steuben-county">our Steuben County page</a>, or <a href="/contact-us">ask for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-lagrange-indiana",
    title: "Manufactured Homes in LaGrange, Indiana: How Your Home Is Titled and Taxed",
    excerpt:
      "Is a manufactured home personal property or real estate? For LaGrange County buyers the answer depends on the land and the foundation, and it affects taxes, insurance and resale. What to ask.",
    image: "/images/homepage/feature-find-land.webp",
    date: "September 28, 2026",
    html: `
<p>LaGrange is the county seat of LaGrange County, the same county as Champion&rsquo;s Topeka plant. It is also where the county auditor, assessor and recorder keep their offices &mdash; which matters, because one of the least understood parts of buying a <strong>manufactured home</strong> is how it is titled and taxed. The answer changes more than paperwork. It affects your property tax bill, your insurance, how a loan is written, and what the home is worth when you sell.</p>

<h2>Personal property or real estate?</h2>
<p>A new HUD-code home leaves the plant much like a vehicle, with a title. What happens next depends on where it goes:</p>
<ul>
  <li><strong>On land you own, on a permanent foundation.</strong> The home can often be joined to the land and treated as real estate &mdash; one parcel, taxed and sold together. That usually involves steps with the title and with the county, done in a set order.</li>
  <li><strong>On a leased lot or land you do not own.</strong> The home usually stays personal property, with its own title, separate from the ground.</li>
</ul>
<p>The rules and the steps belong to the state and the county, not to us, and they can change. Before you close, ask the LaGrange County auditor and assessor how a manufactured home on your parcel will be listed and taxed, and ask the title office what is needed to treat it as real estate if that is your goal.</p>

<h2>Why it matters beyond taxes</h2>
<ul>
  <li><strong>Financing.</strong> A home treated as real estate with the land can usually be financed differently from a home-only loan. You choose your own lender; the <a href="/guides/financing">financing guide</a> explains the loan types in plain language.</li>
  <li><strong>Insurance.</strong> Tell your insurer how the home is titled and placed.</li>
  <li><strong>Resale.</strong> A home and land sold together as one property is a simpler sale for the next buyer.</li>
</ul>

<h2>The foundation is part of the answer</h2>
<p>Treating a home as real estate usually goes hand in hand with a permanent foundation. That is your contractor&rsquo;s work, and it is worth deciding early, because it changes the site budget. The <a href="/guides/site-work">site work guide</a> explains the foundation options, and the <a href="/guides/pricing">pricing guide</a> publishes typical ranges.</p>

<h2>Common questions</h2>
<h3>Do I pay property tax on a manufactured home?</h3>
<p>Yes, in one form or another. How it is assessed depends on how the home is titled and placed. The county assessor answers for your parcel.</p>
<h3>Can I change it to real estate later?</h3>
<p>Often, if the home is on land you own and meets the requirements. Ask the county and the title office what that involves.</p>
<h3>Where to next?</h3>
<p>See <a href="/locations/lagrange-county">our LaGrange County page</a>, or <a href="/contact-us">ask us for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-howe-indiana",
    title: "Manufactured Homes in Howe, Indiana: Where to Put the Home on Your Land",
    excerpt:
      "Buying acreage near Howe? Where the home sits on the parcel decides your driveway, utility runs, drainage, morning light and delivery day. How to pick the spot before anything is dug.",
    image: "/images/homepage/about-2.webp",
    date: "September 28, 2026",
    html: `
<p>Howe is a small town in northern LaGrange County, close to the Michigan line and the Pigeon River. Buyers from around here usually have room &mdash; a few acres, a wooded corner, a field with a view. Room is a gift, but it brings a question city lots never raise: <em>where exactly should the home go?</em> Pick the spot well and the home is easier to build, cheaper to connect and nicer to live in. Pick it in a hurry and you pay for it every day.</p>

<h2>Things to walk the land for</h2>
<ul>
  <li><strong>Distance to the road.</strong> Every foot back from the road is more driveway, a longer electric run and a longer path for the delivery transport. A home set far back can be lovely; just budget for the lane and the utilities.</li>
  <li><strong>Where the septic field goes.</strong> On rural ground, the soil test decides where the septic system can go, and the well has to keep its distance from it. Settle both before you place the home, not after.</li>
  <li><strong>Drainage.</strong> Stand on the spot after a hard rain. Water should run away from the home. Low spots and wet ground cost money to fix.</li>
  <li><strong>Sun and wind.</strong> Think about which rooms face morning light, where afternoon sun will heat the living room in July, and where winter wind comes from. Mature trees give shade but drop limbs; keep a sensible distance.</li>
  <li><strong>Room to deliver.</strong> A multi-section home arrives in pieces, each on its own transport, and each needs a clear path and room to turn.</li>
</ul>

<h2>Match the floor plan to the spot</h2>
<p>Once you know which way the home will face, look at the floor plans with that in mind &mdash; where the front door lands, which side the kitchen windows are on, where a back deck would go. Browse the <a href="/floor-plans">floor plans</a> and bring a sketch of your parcel to the showroom.</p>

<h2>Who does what</h2>
<p>We sell the home and arrange delivery. Site layout, the foundation, the driveway, well, septic and utilities are yours to contract, and LaGrange County&rsquo;s setback and zoning rules apply to where the home can go. Ask the county about your parcel before you decide. The <a href="/guides/site-work">site work guide</a> and <a href="/guides/zoning">zoning guide</a> cover what to ask.</p>

<h2>Common questions</h2>
<h3>Should I put the home near the road or back in the trees?</h3>
<p>Either can work. Closer is cheaper to connect and deliver to; farther back costs more in lane and utilities. Price both with your contractor.</p>
<h3>When should I decide?</h3>
<p>Before you order, and before any digging starts. The spot drives the site plan, and the site plan drives the timeline.</p>
<h3>Next step?</h3>
<p>See <a href="/locations/lagrange-county">our LaGrange County page</a>, or <a href="/contact-us">send us a sketch of your parcel</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-decatur-indiana",
    title: "Manufactured Homes in Decatur, Indiana: Storms, Tie-Downs and a Safe Place to Go",
    excerpt:
      "Adams County gets its share of spring storms. How a manufactured home is anchored, who installs the tie-downs, and why every household should plan where to shelter before the first warning.",
    image: "/images/homepage/double-wide-exterior.webp",
    date: "September 30, 2026",
    html: `
<p>Decatur is the county seat of Adams County, about 55 miles south of our Auburn lot, in wide-open farm country where you can watch weather build across the fields for an hour before it arrives. Buyers from here ask a fair question about a <strong>manufactured home</strong>: how does it hold up when the wind comes? The honest answer has two parts &mdash; how the home is anchored, and where your family goes when a warning is issued.</p>

<h2>How the home is held down</h2>
<p>Every HUD-code home is built to a federal wind standard for the zone it is going to, and all of Indiana falls in the lowest-risk zone on HUD&rsquo;s map, Wind Zone I. Just as important is what happens on site: the home is set on its piers and tied to the ground with anchors and straps, following the manufacturer&rsquo;s installation instructions and state installation rules. That work belongs to your licensed installer. We sell the home and arrange delivery; we do not perform setup, anchoring or site work.</p>
<p>Ask your installer to show you the anchors before the skirting goes on, and keep the paperwork. Anchors and straps are simple hardware, and knowing they are there, and correctly installed, is worth the five minutes.</p>

<h2>Plan where you will shelter</h2>
<p>No house that is not a purpose-built shelter is the right place to ride out a tornado, and the National Weather Service advises anyone in a manufactured home to go to a sturdy shelter when a tornado warning is issued. So make the plan now, while the weather is calm:</p>
<ul>
  <li><strong>Know your nearest sturdy building</strong> and how long it takes to reach it.</li>
  <li><strong>Consider a storm shelter or safe room on your own land.</strong> Many rural buyers put in a below-ground shelter or a separate safe room. FEMA publishes design guidance for safe rooms; your contractor can tell you what fits your site and what permits apply.</li>
  <li><strong>Get warnings on your phone</strong> and keep a weather radio for the nights the phone is on the charger.</li>
</ul>

<h2>Plan it with the site</h2>
<p>If you want a shelter on the property, decide where it goes when you lay out the home, the driveway and the septic field, not after. The <a href="/guides/site-work">site work guide</a> walks through the order things happen in, and the <a href="/guides/delivery-and-setup">delivery and set-up guide</a> covers the setup day itself.</p>

<h2>Common questions</h2>
<h3>Is a newer manufactured home stronger than an old trailer?</h3>
<p>Homes built since the 1976 HUD code are engineered to a federal standard that older units were not. Proper installation matters as much as the construction.</p>
<h3>Who checks the tie-downs?</h3>
<p>Your licensed installer does the work, and your county may inspect it. Ask both what they check.</p>
<h3>Where do I start?</h3>
<p>See <a href="/locations/adams-county">our Adams County page</a>, browse the <a href="/floor-plans">floor plans</a>, or <a href="/contact-us">ask for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-ossian-indiana",
    title: "Manufactured Homes in Ossian, Indiana: A Second Home on the Family Farm",
    excerpt:
      "Want to put a home for a parent or grown child on the family farm near Ossian? What to ask about a second dwelling, splitting off a lot, and sharing a well or septic before you order.",
    image: "/images/homepage/feature-find-land.webp",
    date: "September 30, 2026",
    html: `
<p>Ossian sits in northern Wells County, a short drive south of Fort Wayne and surrounded by family farms. A lot of the calls we get from this area start the same way: &ldquo;Mom and Dad have the farm, and we want to put a home out there so we can be close.&rdquo; Or the reverse &mdash; parents who want their grown kids on the land. A <strong>manufactured home</strong> is a natural fit. The part that needs sorting out first is not the home. It is the land.</p>

<h2>Can a second home go on the parcel?</h2>
<p>Counties treat a second dwelling on one parcel differently. Some allow it in an agricultural district with conditions; some require the new home to sit on its own lot. Before you pick a spot or a floor plan, call the Wells County plan commission with the parcel number and ask:</p>
<ul>
  <li>Is a second single-family dwelling allowed on this parcel as it is zoned?</li>
  <li>If not, what does it take to split off a separate lot, and what is the minimum lot size and road frontage?</li>
  <li>What setbacks apply from the existing house, the barns and the road?</li>
</ul>
<p>Write the answers down. They decide everything that follows.</p>

<h2>Well, septic and utilities</h2>
<p>This is where family-farm projects most often stall. A new home usually needs its own approved septic system, sized for its bedrooms and placed where the soil allows. Whether it can share the existing well is a question for the county health department and your well contractor. Electric service may mean a new meter and a line from the road. Get those answers before you order the home; the <a href="/guides/site-work">site work guide</a> explains the sequence.</p>

<h2>Think about ownership now</h2>
<p>Who owns the home, and who owns the ground under it, matters for financing, insurance, taxes and one day for inheritance. If the home sits on land a parent owns, talk it through as a family, and with an attorney if the farm is in a trust or partnership. You choose your own lender; the <a href="/guides/financing">financing guide</a> explains how loans differ when the home is on land you do not own.</p>

<h2>Choosing the home</h2>
<p>Single-section <a href="/series/prime">Prime</a> and <a href="/series/aspire">Aspire</a> homes keep the footprint small on a farm yard; multi-section homes give a growing family room. Browse the <a href="/floor-plans">floor plans</a> and come see a few. We sell the home and arrange delivery; site work and setup are yours to contract.</p>

<h2>Common questions</h2>
<h3>Do I have to split off a lot?</h3>
<p>Sometimes. It depends on the zoning of the parcel. The plan commission answers for your land.</p>
<h3>Can the new home share the farm&rsquo;s septic?</h3>
<p>Usually a new home needs its own system. The county health department decides.</p>
<h3>Next step?</h3>
<p>See <a href="/locations/wells-county">our Wells County page</a>, or <a href="/contact-us">tell us about the parcel</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-south-whitley-indiana",
    title: "Manufactured Homes in South Whitley, Indiana: Insuring Your New Home",
    excerpt:
      "Insurance is one of the last calls most buyers make and one of the first a lender asks about. What South Whitley-area buyers should ask an insurer about a new manufactured home before closing.",
    image: "/images/homepage/single-wides.webp",
    date: "September 30, 2026",
    html: `
<p>South Whitley is a small town on the Eel River in southwest Whitley County. Buyers from around here tend to plan carefully &mdash; land, foundation, delivery date &mdash; and then leave the insurance call until the week before move-in. That is late. If you finance the home, the lender will want proof of coverage before closing, and if you are paying cash, you still want the home covered from the day it arrives.</p>

<h2>Start the call early</h2>
<p>Call two or three insurers once you have picked a floor plan. Tell them it is a new HUD-code <strong>manufactured home</strong>, give them the model, the size and the year, and tell them where it will sit and on what kind of foundation. Not every company writes policies on manufactured homes, and the ones that do will ask different questions. Starting early leaves you time to compare.</p>

<h2>Questions worth asking</h2>
<ul>
  <li><strong>Replacement cost or actual cash value?</strong> A replacement-cost policy pays to replace the home; an actual-cash-value policy subtracts depreciation. Ask which one you are being quoted.</li>
  <li><strong>What about the things attached to the home?</strong> Porches, decks, skirting, steps and a detached garage may be covered differently, or not at all.</li>
  <li><strong>Wind and hail.</strong> Ask how storm damage is handled and what the deductible is for it.</li>
  <li><strong>Flood.</strong> Standard policies usually exclude flood. If your parcel is near the river or in a mapped flood zone, ask about a separate flood policy.</li>
  <li><strong>How the home is titled and placed.</strong> A home on land you own on a permanent foundation may be written differently from a home on a leased lot.</li>
</ul>

<h2>Keep your paperwork together</h2>
<p>Keep the sales documents, the home&rsquo;s data plate information, your installer&rsquo;s paperwork and photos of the finished home in one place. An insurer will ask for some of it at the start, and all of it if you ever file a claim.</p>

<h2>What we provide</h2>
<p>We sell the home, quote it line by line and arrange delivery, and we can give you the model and specification details an insurer asks for. We do not sell insurance or recommend an insurer; the choice is yours. Browse the <a href="/floor-plans">floor plans</a>, and read the <a href="/guides/buyers-guide">buyer&rsquo;s guide</a> for the rest of the checklist.</p>

<h2>Common questions</h2>
<h3>When do I need coverage in place?</h3>
<p>If you finance, before closing. Either way, by the day the home arrives.</p>
<h3>Is flood covered?</h3>
<p>Usually not by a standard policy. Ask about a separate flood policy if your land is near water.</p>
<h3>Where do I start?</h3>
<p>See <a href="/locations/whitley-county">our Whitley County page</a>, or <a href="/contact-us">ask for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-kimmell-indiana",
    title: "Manufactured Homes in Kimmell, Indiana: Caring for Your Home in the First Year",
    excerpt:
      "A new manufactured home settles, breathes and meets its first Indiana winter in year one. A simple first-year care list for Kimmell-area owners: level, skirting vents, gutters, filters and water.",
    image: "/images/homepage/about-2.webp",
    date: "September 30, 2026",
    html: `
<p>Kimmell is a small community in western Noble County, a short drive from Ligonier and the lakes. The owners we hear from after move-in usually want to know one thing: <em>what should I be keeping an eye on?</em> A new <strong>manufactured home</strong> needs very little, but the first year is when a few simple habits pay off for the next twenty.</p>

<h2>A first-year care list</h2>
<ul>
  <li><strong>Check that it is still level.</strong> A new home settles on its piers, especially after the first freeze and thaw. Doors that start to stick or gaps that open at the corners are the usual signs. Your set-up contractor can re-level it; ask when they recommend a check.</li>
  <li><strong>Keep the skirting vents clear.</strong> The space under the home needs air. Keep leaves, snow and mulch away from the vents and make sure the ground cover under the home stays in place.</li>
  <li><strong>Move water away from the home.</strong> Clean gutters, keep downspouts pointed away, and watch where water stands after a hard rain. Water under the home is the problem most worth preventing.</li>
  <li><strong>Change the furnace filter</strong> on the schedule in the equipment paperwork, and keep the return-air path clear.</li>
  <li><strong>Look under the sinks</strong> every few weeks for drips, and know where your main water shut-off is.</li>
  <li><strong>Before winter,</strong> check heat tape on any exposed water line, close up gaps in the skirting, and disconnect garden hoses.</li>
</ul>

<h2>Keep a list for warranty items</h2>
<p>Small adjustments in the first months are normal. Keep a written list with photos and dates rather than calling about each one, and send it together. Some items belong to your set-up contractor, others are covered by the manufacturer&rsquo;s limited warranty, and appliances carry their own makers&rsquo; warranties. We stay your point of contact. Our <a href="/blog/manufactured-homes-topeka-indiana">delivery-day checklist</a> covers what to look for when the home first arrives.</p>

<h2>Read the homeowner manual</h2>
<p>The home comes with a homeowner&rsquo;s manual and equipment paperwork. Keep them together with your purchase papers. They say what the manufacturer expects for maintenance, and following it protects your warranty.</p>

<h2>Common questions</h2>
<h3>How often should the home be re-leveled?</h3>
<p>Ask your set-up contractor. A check after the first winter is a common starting point.</p>
<h3>Who fixes a door that sticks after a few months?</h3>
<p>Usually it is a levelling issue for your set-up contractor. Put it on your list and send it in.</p>
<h3>Where to next?</h3>
<p>See <a href="/locations/noble-county">our Noble County page</a>, or <a href="/contact-us">get in touch</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-shipshewana-indiana",
    title: "Manufactured Homes in Shipshewana, Indiana: Which Options to Decide at Order",
    excerpt:
      "Some choices are built into a manufactured home at the plant and are hard to change later; others are easy to add after move-in. How Shipshewana-area buyers sort one from the other.",
    image: "/images/homepage/feature-find-home.webp",
    date: "September 30, 2026",
    html: `
<p>Shipshewana, in northern LaGrange County, is not far from the Topeka plant where Champion builds the homes we sell. Buyers from around here tend to be practical: they want to spend where it counts and skip what does not. With a <strong>manufactured home</strong>, the most useful thing to know is which choices have to be made when you order, because the home is built at the plant, and which ones you can just as easily make after you move in.</p>

<h2>Decide these at order</h2>
<p>Anything built into the structure or the walls is far easier and cheaper to get right at the plant:</p>
<ul>
  <li><strong>The floor plan and any layout options</strong> &mdash; an extra bedroom, an open kitchen, a larger bathroom.</li>
  <li><strong>Windows and doors</strong> &mdash; where they go, how many, and whether you want an upgraded package.</li>
  <li><strong>Insulation and energy options</strong> offered for the plan.</li>
  <li><strong>Electrical</strong> &mdash; extra outlets, ceiling fan boxes, exterior outlets and lights.</li>
  <li><strong>Heating and water-heater fuel</strong>, if the plan offers a choice.</li>
  <li><strong>Interior finishes built into the walls and ceilings</strong>, where options are offered.</li>
</ul>
<p>Options vary by plan and series. Ask which ones a specific plan offers, and do not assume from a photo, because renderings can show optional features.</p>

<h2>Easy to add later</h2>
<ul>
  <li>Paint colours and window coverings.</li>
  <li>Most lighting fixtures, as long as the box is there.</li>
  <li>Freestanding furniture, rugs and storage.</li>
  <li>Outdoor space &mdash; a deck, porch or shed, built freestanding by your contractor with its own permit.</li>
</ul>

<h2>How the quote shows it</h2>
<p>Every quote from us lists the home, each option and delivery on separate lines, so you can see exactly what each choice adds and decide with the numbers in front of you. Browse the <a href="/floor-plans">floor plans</a>, note the options that matter to you, and walk a few homes at the showroom to see them in person.</p>

<h2>Common questions</h2>
<h3>Can I change options after I order?</h3>
<p>Changes get harder once the home is scheduled for production. Settle them before you sign.</p>
<h3>Which option matters most?</h3>
<p>The one you would use every day. For many buyers that is the kitchen layout or an extra bathroom.</p>
<h3>Next step?</h3>
<p>See <a href="/locations/lagrange-county">our LaGrange County page</a>, or <a href="/contact-us">ask for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-bluffton-indiana",
    title: "Manufactured Homes in Bluffton, Indiana: Selling Your Current House First",
    excerpt:
      "Moving from an older house in Bluffton into a new manufactured home? How to line up the sale, the order and the move so you are not paying for two homes, or living out of boxes, for months.",
    image: "/images/homepage/double-wides.webp",
    date: "October 1, 2026",
    html: `
<p>Bluffton is the county seat of Wells County, on the Wabash River south of Fort Wayne. Many of the buyers we hear from here already own a house &mdash; often an older two-story they raised a family in &mdash; and want something newer, smaller or easier to keep up. The home is the easy part. The hard part is timing: selling one house and moving into another without carrying both, or ending up with nowhere to live for a month.</p>

<h2>Three ways to sequence it</h2>
<ul>
  <li><strong>Sell first, then order.</strong> The cleanest financially. The catch is that you may need somewhere to live while the new <strong>manufactured home</strong> is built and the site is prepared &mdash; usually 8 to 12 weeks from order to move-in.</li>
  <li><strong>Order first, sell during the build.</strong> Popular when the land is already yours. List the house once the order is placed and the site work is scheduled, so the closing lands near move-in day. It works best when you are confident about your sale.</li>
  <li><strong>Sell with a delayed possession date.</strong> Some sellers negotiate a closing or possession date that gives them a few extra weeks in the house. Your real estate agent can tell you what buyers in your market will accept.</li>
</ul>
<p>Which one fits depends on your finances, your land and how quickly houses are selling in your neighbourhood. Talk it through with your agent and your lender before you sign anything; you choose your own lender, and the <a href="/guides/financing">financing guide</a> explains the loan types in plain language.</p>

<h2>Measure what you are taking with you</h2>
<p>A move from a bigger house means deciding what fits. Measure the pieces you are keeping &mdash; the dining table, the bed, the piano &mdash; and compare them with the room dimensions on the <a href="/floor-plans">floor plans</a>. Bring the measurements to the showroom; walking a home with real numbers in hand settles a lot of questions quickly.</p>

<h2>Keep the site work on schedule</h2>
<p>Whichever order you choose, the site has to be ready when the home is. Your own contractors handle the foundation, utilities and setup; we sell the home and arrange delivery. The <a href="/guides/site-work">site work guide</a> lays out the sequence, and the <a href="/guides/pricing">pricing guide</a> publishes typical site-work ranges so the budget is not a surprise.</p>

<h2>Common questions</h2>
<h3>How long between ordering and moving in?</h3>
<p>Usually 8 to 12 weeks. The factory build is 6 to 8 weeks, and your site work runs alongside it.</p>
<h3>Should I sell before I order?</h3>
<p>It depends on your finances and your market. Ask your agent and lender, then choose the order that leaves you the least exposed.</p>
<h3>Where do I start?</h3>
<p>See <a href="/locations/wells-county">our Wells County page</a>, or <a href="/contact-us">ask for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-berne-indiana",
    title: "Manufactured Homes in Berne, Indiana: Testing Your Well Water First",
    excerpt:
      "Most rural Adams County homes run on a private well. Why Berne-area buyers should test the water before they order, and how to leave room in the floor plan for any treatment it turns out to need.",
    image: "/images/homepage/feature-find-land.webp",
    date: "October 1, 2026",
    html: `
<p>Berne is a small town in southern Adams County, surrounded by farm ground where almost every home outside town runs on a private well. That brings a question city buyers never face: <em>what is actually in the water?</em> Asking it before you order a new <strong>manufactured home</strong> costs little, and the answer can shape the floor plan you choose.</p>

<h2>Test before you build</h2>
<p>If the parcel already has a well, have the water tested by a certified laboratory before you finalise your plans &mdash; ideally before you close on the land. If a new well is going in, test it once it is drilled. The county health department can tell you which tests are recommended and where to send samples. Common things a test looks at include bacteria, nitrates, hardness and iron.</p>

<h2>Why it matters for the floor plan</h2>
<p>If the water needs treatment &mdash; a softener, an iron filter, or something else your well contractor or a water-treatment company recommends &mdash; that equipment needs a home, usually near where the water line enters the house, with a drain and an electrical outlet nearby. In a manufactured home that is often the utility or laundry room. When you browse the <a href="/floor-plans">floor plans</a>, look at how much room the utility area has, and ask which options a plan offers. Planning for it now beats squeezing a tank into a closet later.</p>

<h2>Who does what</h2>
<p>Your well contractor drills or services the well, and a water-treatment company or plumber installs any equipment. Those are your contractors; we sell the home and arrange delivery, and we do not perform site work, setup or plumbing connections. The <a href="/guides/site-work">site work guide</a> explains where the well fits in the sequence, alongside septic, electric and the foundation.</p>

<h2>Keep testing</h2>
<p>A single test is a snapshot. Ask the lab or the health department how often to retest, and keep your results with your home paperwork.</p>

<h2>Common questions</h2>
<h3>Do I need to test a well that has always been used?</h3>
<p>It is still worth testing before you commit. Water can change, and a new household may use it differently.</p>
<h3>Where does a water softener go in a manufactured home?</h3>
<p>Usually in the utility or laundry area, near the water line. Check the room size on the floor plan.</p>
<h3>Next step?</h3>
<p>See <a href="/locations/adams-county">our Adams County page</a>, or <a href="/contact-us">ask which plans have the utility space you need</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-larwill-indiana",
    title: "Manufactured Homes in Larwill, Indiana: Check Internet Service Before You Buy Land",
    excerpt:
      "Working from home, school online, streaming at night — on rural Whitley County ground the internet service available at your address can decide whether a parcel works. How to check before you buy.",
    image: "/images/homepage/single-wides.webp",
    date: "October 1, 2026",
    html: `
<p>Larwill is a small town in western Whitley County, a short drive from Columbia City along US-30. It is quiet country, which is why people move here, and it is exactly the kind of place where the internet connection at one address can be very different from the one down the road. For a family that works from home or has kids doing schoolwork online, that matters as much as the soil test.</p>

<h2>Check the address, not the town</h2>
<p>Internet service is decided address by address. Before you buy a parcel, find out what is actually available there:</p>
<ul>
  <li><strong>Look the address up on the FCC&rsquo;s National Broadband Map,</strong> which lists the providers that report service at that location.</li>
  <li><strong>Call the providers</strong> that show up and ask them to confirm service, speeds and installation for that exact address. A map is a starting point, not a promise.</li>
  <li><strong>Ask the neighbours</strong> what they use and how well it works.</li>
  <li><strong>Ask about installation.</strong> A long lane may need a longer line run, and the provider may need to know where the home will sit.</li>
</ul>

<h2>Plan the line with the rest of the utilities</h2>
<p>If a wired service is available, its line usually comes in with, or alongside, the electric service. Decide where the home sits and tell both the electric provider and the internet provider early, so the trenching happens once. Your site contractor coordinates that; we sell the home and arrange delivery and do not perform site work. The <a href="/guides/site-work">site work guide</a> covers the order things happen in.</p>

<h2>Choose a plan with a place to work</h2>
<p>If someone in the house works from home, look for a <strong>manufactured home</strong> floor plan with a den, a spare bedroom or a room away from the living area. Browse the <a href="/floor-plans">floor plans</a> with that in mind.</p>

<h2>Common questions</h2>
<h3>Can I rely on the broadband map alone?</h3>
<p>No. Use it to find providers, then confirm service at your exact address with each one.</p>
<h3>When should I check?</h3>
<p>Before you buy the land. It is one of the few things you cannot change afterward.</p>
<h3>Where to next?</h3>
<p>See <a href="/locations/whitley-county">our Whitley County page</a>, or <a href="/contact-us">ask for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-wawaka-indiana",
    title: "Manufactured Homes in Wawaka, Indiana: Choosing a Plan With a Real Home Office",
    excerpt:
      "Working from home is the norm for many families near Wawaka. How to pick a manufactured home floor plan with a quiet place to work — where the room sits, doors, light, outlets and storage.",
    image: "/images/homepage/feature-find-home.webp",
    date: "October 1, 2026",
    html: `
<p>Wawaka is a small community in western Noble County, a short drive from Ligonier. More and more of the families we talk to from out this way have at least one person working from home. A kitchen table works for a week. For years of work, you want a real place to do it &mdash; and with a <strong>manufactured home</strong>, the time to plan that is when you choose the floor plan.</p>

<h2>Where the room sits matters most</h2>
<p>The best home office is away from the noise. When you look at the <a href="/floor-plans">floor plans</a>, notice:</p>
<ul>
  <li><strong>Distance from the living room and kitchen.</strong> A spare bedroom or den at the end of the home, not off the main living space, keeps calls quieter.</li>
  <li><strong>A door that closes.</strong> An open &ldquo;flex space&rdquo; is pleasant, but a room with a door is an office.</li>
  <li><strong>Windows.</strong> Natural light makes a long workday easier. Think about which way the room will face once the home is placed.</li>
  <li><strong>Storage.</strong> A closet keeps files and equipment out of sight.</li>
</ul>

<h2>Ask about electrical options at order</h2>
<p>Outlets are far easier to add at the plant than after the home is built. If you know where the desk will go, ask which electrical options a plan offers &mdash; an extra outlet, a ceiling fan box &mdash; before you order. Our <a href="/blog/manufactured-homes-shipshewana-indiana">post on which options to decide at order</a> covers the rest of that list.</p>

<h2>And check the connection</h2>
<p>A great office is no use without a reliable internet connection. Check what service is actually available at your address before you commit to a parcel; our <a href="/blog/manufactured-homes-larwill-indiana">post on checking internet service</a> explains how.</p>

<h2>Come see it in person</h2>
<p>Bring your laptop bag and stand in the room. You will know quickly whether it works. The showroom is open Monday to Friday 9&ndash;5 and Saturday 10&ndash;4, and every quote is line by line &mdash; home, each option and delivery on separate lines.</p>

<h2>Common questions</h2>
<h3>Is a three-bedroom plan with one room as an office better than a plan with a den?</h3>
<p>Often, yes &mdash; a bedroom has a door and a closet. But a den placed well can work just as well. Walk both.</p>
<h3>Can I add outlets after move-in?</h3>
<p>Usually, but it is easier and tidier to choose them at order.</p>
<h3>Next step?</h3>
<p>See <a href="/locations/noble-county">our Noble County page</a>, or <a href="/contact-us">ask for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-stroh-indiana",
    title: "Manufactured Homes in Stroh, Indiana: Driveway Permits, Culverts and Your New Address",
    excerpt:
      "A new home on bare ground in LaGrange County needs a way in from the road and an address emergency crews can find. What Stroh-area buyers should ask about driveway permits, culverts and address assignment.",
    image: "/images/homepage/double-wide-exterior.webp",
    date: "October 1, 2026",
    html: `
<p>Stroh is a small lake community in southeast LaGrange County, close to the Noble County line. Many of the buyers we hear from around here are building on ground that has never had a house on it. That raises two small questions that are easy to miss until they hold up a project: <em>how do we get onto the property from the road,</em> and <em>what is our address?</em></p>

<h2>The driveway starts at the road</h2>
<p>A new driveway onto a county road usually needs approval from the county highway department, and often a culvert under the entrance so the roadside ditch keeps draining. Before you design the driveway &mdash; and before anyone digs &mdash; ask the county:</p>
<ul>
  <li>Is a permit required for a new driveway entrance on this road?</li>
  <li>Is a culvert required, and what size and material?</li>
  <li>Are there rules on where the entrance can go, such as sight distance near a curve or hill?</li>
</ul>
<p>Get the answers in writing. The driveway also has to carry the home&rsquo;s delivery, so build it for that, not just for the family car.</p>

<h2>Get an address before you need one</h2>
<p>Bare land often has a parcel number but no street address. A new home needs one &mdash; for utility service, mail, deliveries, and most importantly so emergency crews can find you. Ask the county which office assigns addresses and what it needs from you, and do it early, because utility companies may ask for the address before they will schedule service.</p>

<h2>Who does what</h2>
<p>The driveway, culvert and site work are yours to contract; we sell the home and arrange delivery, and we do not perform site work or setup. The <a href="/guides/site-work">site work guide</a> lays out the order things happen in, and the <a href="/guides/delivery-and-setup">delivery and set-up guide</a> explains what the transport needs to reach your site.</p>

<h2>Common questions</h2>
<h3>Do I always need a culvert?</h3>
<p>Not always. It depends on the road and the ditch. The county highway department answers for your entrance.</p>
<h3>When should I request an address?</h3>
<p>As soon as you know where the driveway and home will go. Utilities may need it to schedule service.</p>
<h3>Where to next?</h3>
<p>See <a href="/locations/lagrange-county">our LaGrange County page</a>, browse the <a href="/floor-plans">floor plans</a>, or <a href="/contact-us">ask for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-warsaw-indiana",
    title: "Manufactured Homes in Warsaw, Indiana: New or Used — What to Weigh",
    excerpt:
      "Kosciusko County buyers often compare a new manufactured home against a used one already on the market. The questions that decide it: age and HUD label, moving and setup, condition, title and warranty.",
    image: "/images/homepage/double-wides.webp",
    date: "October 6, 2026",
    html: `
<p>Warsaw is the county seat of Kosciusko County, lake country on US-30 west of Columbia City. Buyers from here often start the same way: there is a used manufactured home for sale down the road, and they want to know whether it is a better deal than a new one. Sometimes it is. Often the answer changes once every cost is on paper. These are the questions that settle it.</p>

<h2>Start with the age and the label</h2>
<p>Every <strong>manufactured home</strong> built since June 1976 carries a red HUD certification label on the outside of each section and a data plate inside, usually in a kitchen cabinet or bedroom closet. The data plate tells you the year, the manufacturer and the wind and roof-load zones the home was built for. A home without them, or built before the HUD code, is a different conversation entirely &mdash; and some counties and lenders treat it very differently.</p>

<h2>Count the whole cost, not the asking price</h2>
<p>A used home that has to be moved is not just its price. Add:</p>
<ul>
  <li><strong>Taking it down and moving it</strong> &mdash; disconnecting, transporting and re-setting a home that has already been installed once.</li>
  <li><strong>Setup on your site</strong> &mdash; the same foundation, utilities and set-up a new home needs.</li>
  <li><strong>Repairs</strong> &mdash; roof, furnace, water heater, flooring, windows. A home inspector who knows manufactured homes can tell you what you are buying.</li>
</ul>
<p>Then compare that total with a new home quoted line by line &mdash; the home, each option and delivery on separate lines &mdash; and the site-work ranges in our <a href="/guides/pricing">pricing guide</a>.</p>

<h2>Paperwork, financing and warranty</h2>
<p>Check that the seller holds a clear title. Ask your lender how they finance a used home versus a new one, since terms can differ; you choose your own lender, and our <a href="/guides/financing">financing guide</a> explains the loan types. A new home comes with the manufacturer&rsquo;s limited warranty; a used one usually does not.</p>

<h2>Where a new home fits</h2>
<p>If a new home makes more sense once the numbers are in, browse the <a href="/floor-plans">Champion floor plans</a> and come walk a few. We deliver across Indiana, with freight quoted per route as its own line. Site work and setup are yours to contract; we sell the home and arrange delivery.</p>

<h2>Common questions</h2>
<h3>Is a used manufactured home always cheaper?</h3>
<p>Not once moving, setup and repairs are added. Put both totals side by side before deciding.</p>
<h3>Where is the HUD label?</h3>
<p>On the outside of each section, usually near one end. The data plate is inside the home.</p>
<h3>Where do I start?</h3>
<p>See <a href="/locations">our delivery area</a>, or <a href="/contact-us">ask for a line-item quote on a new home</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-huntington-indiana",
    title: "Manufactured Homes in Huntington, Indiana: Planning for Pets and a Busy Household",
    excerpt:
      "Dogs, muddy boots and a back door that gets used fifty times a day. How Huntington-area families choose a manufactured home layout, flooring and yard plan that hold up to real life.",
    image: "/images/homepage/single-wides.webp",
    date: "October 6, 2026",
    html: `
<p>Huntington is the county seat of Huntington County, on the Wabash River southwest of Fort Wayne. A lot of the families we hear from around here have a yard full of life &mdash; a dog or two, kids in and out, work boots by the door. A new <strong>manufactured home</strong> handles that well, as long as the floor plan and finishes are chosen with it in mind.</p>

<h2>Look for a real back entry</h2>
<p>The door your family actually uses every day matters more than the front door. When you browse the <a href="/floor-plans">floor plans</a>, look for:</p>
<ul>
  <li><strong>A side or rear door into the laundry or utility room</strong>, so mud and wet dogs stop there instead of crossing the living room.</li>
  <li><strong>Space by that door</strong> for a bench, hooks and a mat.</li>
  <li><strong>A short path from that door to a bathroom</strong> for quick clean-ups.</li>
</ul>

<h2>Choose floors and finishes for wear</h2>
<p>Flooring is one of the choices to make at order. Ask which flooring options a specific plan offers and how each one handles claws, water and grit. Many busy households choose hard-surface flooring in the entry, kitchen and laundry, and save carpet for bedrooms. Do not assume a finish from a photo; renderings can show optional features.</p>

<h2>Plan the yard with the home</h2>
<p>A fenced yard is usually the first project after move-in. Fences often need a permit or have to respect setbacks and easements, so ask the county before you build. Decide where the home and the back door sit, then plan the fence and gate around them. Your contractor handles the fence and site work; we sell the home and arrange delivery.</p>

<h2>Come see it with your household in mind</h2>
<p>Walk a few homes and imagine a rainy Tuesday. Where do the boots go? Where does the dog sleep? Every quote is line-item &mdash; home, each option and delivery &mdash; so you can see what each choice adds.</p>

<h2>Common questions</h2>
<h3>Which floor plans have a separate back entry?</h3>
<p>Many multi-section plans and some single-section plans do. Check the door placement on each plan.</p>
<h3>Do I need a permit for a fence?</h3>
<p>Often. Ask the county or town before you build.</p>
<h3>Where to next?</h3>
<p>See <a href="/locations">our delivery area</a>, or <a href="/contact-us">ask for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-goshen-indiana",
    title: "Manufactured Homes in Goshen, Indiana: How a HUD-Code Home Differs From an RV or Park Model",
    excerpt:
      "Elkhart County builds more RVs than anywhere, so Goshen buyers ask a fair question: what makes a manufactured home different from an RV, a park model or a tiny home? Codes, placement, financing and year-round living.",
    image: "/images/homepage/feature-find-home.webp",
    date: "October 6, 2026",
    html: `
<p>Goshen is the county seat of Elkhart County, the heart of the RV industry and right next door to LaGrange County, where Champion&rsquo;s Topeka plant builds the homes we sell. With so many factory-built products made around here, buyers sometimes ask whether a <strong>manufactured home</strong> is really so different from an RV, a park model or a tiny home. It is &mdash; and the difference matters for where you can put it, how you finance it and how you live in it.</p>

<h2>Different products, different rules</h2>
<ul>
  <li><strong>A HUD-code manufactured home</strong> is built to the federal Manufactured Home Construction and Safety Standards, the HUD code. It is designed as a permanent, year-round residence and carries a HUD label on each section.</li>
  <li><strong>An RV</strong> is a vehicle built to recreational-vehicle standards, meant for travel and seasonal use, not as a permanent home.</li>
  <li><strong>A park model RV</strong> is a larger recreational unit, usually for seasonal use in a campground or resort. It is not a HUD-code home.</li>
  <li><strong>A &ldquo;tiny home&rdquo;</strong> can be almost anything &mdash; an RV, a park model, or a small site-built house. The label tells you nothing until you know which code it was built to.</li>
</ul>

<h2>Why the difference matters</h2>
<p><strong>Placement.</strong> Zoning rules usually treat a permanent dwelling very differently from a recreational vehicle. Many places do not allow living in an RV year-round on a residential lot. Ask the county about your parcel before you buy anything.</p>
<p><strong>Financing and insurance.</strong> Lenders and insurers treat a HUD-code home, an RV and a park model differently. You choose your own lender; our <a href="/guides/financing">financing guide</a> explains the loan types for manufactured homes.</p>
<p><strong>Living.</strong> A manufactured home has full-size rooms, residential appliances and insulation designed for year-round living in its climate zone.</p>

<h2>See the difference in person</h2>
<p>Walk a Champion home and you will see it quickly. Browse the <a href="/floor-plans">floor plans</a>, read <a href="/guides/manufactured-vs-modular">manufactured vs. modular</a> for the other comparison buyers ask about, and come to the showroom. We sell the home and arrange delivery; site work and setup are yours to contract.</p>

<h2>Common questions</h2>
<h3>Can I live in a park model year-round?</h3>
<p>That depends on local rules and the unit itself. Ask the county, and know that a park model is not a HUD-code home.</p>
<h3>How do I tell what I am looking at?</h3>
<p>Look for the red HUD label on each section and the data plate inside. A HUD-code home has both.</p>
<h3>Where to next?</h3>
<p>See <a href="/locations">our delivery area</a>, or <a href="/contact-us">ask for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-wabash-indiana",
    title: "Manufactured Homes in Wabash, Indiana: Making a Smaller Home Feel Bigger",
    excerpt:
      "Square footage is only part of the story. How Wabash County buyers pick a manufactured home that feels larger than its size — open layouts, ceiling height, windows, light and storage.",
    image: "/images/homepage/about-2.webp",
    date: "October 6, 2026",
    html: `
<p>Wabash is the county seat of Wabash County, on the river of the same name. Many buyers we hear from here want to keep their budget and upkeep in check without feeling cramped. The good news is that how big a <strong>manufactured home</strong> feels depends on much more than its square footage. Two homes the same size can feel completely different inside.</p>

<h2>What makes a home feel bigger</h2>
<ul>
  <li><strong>An open kitchen, dining and living area.</strong> One shared space with long sightlines feels larger than three small rooms.</li>
  <li><strong>Ceiling height and shape.</strong> A higher or vaulted ceiling in the main living area changes the feel of a room. Ask which ceiling options a plan offers.</li>
  <li><strong>Windows and light.</strong> More and larger windows make rooms feel open. Think about which way the main room will face once the home is placed.</li>
  <li><strong>Hallways kept short.</strong> Less space spent on corridors means more spent on rooms.</li>
  <li><strong>Storage built in.</strong> A walk-in closet, a pantry or a linen closet keeps clutter out of the living space, which is half the battle.</li>
</ul>

<h2>Compare plans, not just numbers</h2>
<p>When you browse the <a href="/floor-plans">floor plans</a>, look past the square footage. Find two plans of similar size and compare where the space goes. Single-section <a href="/series/prime">Prime</a> and <a href="/series/aspire">Aspire</a> homes keep the footprint and upkeep small; multi-section homes give wider rooms. Our guide to <a href="/guides/single-wide-vs-double-wide">single-wide vs double-wide</a> covers the trade-offs.</p>

<h2>Decide the structural choices at order</h2>
<p>Ceilings, windows and layout options are built in at the plant, so settle them before you order. Paint, lighting and furniture can come later. Every quote lists the home, each option and delivery on separate lines, so you can see what each choice adds. We sell the home and arrange delivery; site work and setup are yours to contract.</p>

<h2>Common questions</h2>
<h3>Does a vaulted ceiling cost more?</h3>
<p>Options are priced individually on the quote. Ask which ceiling options a specific plan offers.</p>
<h3>Is a single-section home big enough for a family?</h3>
<p>For some families, yes &mdash; especially a well-laid-out three-bedroom plan. Walk one and see.</p>
<h3>Where to next?</h3>
<p>See <a href="/locations">our delivery area</a>, or <a href="/contact-us">ask for a line-item quote</a>.</p>
`,
  },
  {
    slug: "manufactured-homes-portland-indiana",
    title: "Manufactured Homes in Portland, Indiana: Moving From Renting to Owning",
    excerpt:
      "Tired of paying rent? How Portland and Jay County renters can get ready to own a new manufactured home — savings, talking to lenders, land or a leased lot, and a realistic timeline.",
    image: "/images/homepage/feature-find-land.webp",
    date: "October 6, 2026",
    html: `
<p>Portland is the county seat of Jay County, in east-central Indiana close to the Ohio line. Many of the people who reach us from this part of the state are renting today and wondering whether owning is within reach. For a lot of households, a new <strong>manufactured home</strong> is the most practical first step into ownership. Here is how to get ready.</p>

<h2>Step one: know where the home will go</h2>
<p>Before anything else, decide where the home will sit. There are two common routes:</p>
<ul>
  <li><strong>Land you own or will buy.</strong> You own the home and the ground, and you contract the site work &mdash; foundation, utilities, well and septic if needed.</li>
  <li><strong>A leased lot in a community.</strong> Less work up front, with a monthly lot rent and the community&rsquo;s own rules.</li>
</ul>
<p>Our <a href="/blog/manufactured-homes-laotto-indiana">post on own land versus a land-lease community</a> compares the two in detail.</p>

<h2>Step two: get your finances in order</h2>
<p>Talk to lenders early. Ask what they need to see, what down payment they expect, and how long approval takes. You choose your own lender; we do not arrange financing or pull credit, and the <a href="/financing">lender list on our financing page</a> names lenders past customers have used &mdash; we recommend none of them. Our <a href="/guides/financing">financing guide</a> explains the loan types in plain language.</p>

<h2>Step three: budget the whole project</h2>
<p>The home is one line. Add delivery, setup, site work, permits and utility connections. Every quote from us lists the home, each option and delivery separately, and the <a href="/guides/pricing">pricing guide</a> publishes typical ranges for the contractor work. Leave room for the unexpected.</p>

<h2>Step four: time it with your lease</h2>
<p>From order to move-in usually takes 8 to 12 weeks, plus the time to prepare the site. Count back from the end of your lease and start early enough to avoid paying rent and a mortgage at the same time.</p>

<h2>Common questions</h2>
<h3>Do you deliver to Jay County?</h3>
<p>We deliver across Indiana, with freight quoted per route as its own line on your quote.</p>
<h3>What size home should a first-time buyer choose?</h3>
<p>The one that fits your household and budget today, with a little room to grow. Browse the <a href="/floor-plans">floor plans</a> and walk a few.</p>
<h3>Where to next?</h3>
<p>See <a href="/locations">our delivery area</a>, or <a href="/contact-us">ask for a line-item quote</a>.</p>
`,
  },
];
