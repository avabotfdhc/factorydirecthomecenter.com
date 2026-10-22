// Locally-authored blog posts, merged with CMS posts in api-content.ts.
// Use for editorial content published from the repo (reviewed in a PR) rather
// than through the external CMS admin. Keep claims consistent with site copy:
// NO dollar figures for home prices — not even ranges (Kyle, 2026-08-16);
// quotes are line-item, "contact for pricing". Ancillary contractor costs
// (delivery, setup, site work) may cite ranges. Site work / setup is done by
// the buyer's own contractors — never claim FDHC performs setup or site work.

import type { ApiBlogDetail } from "./api-content";

/**
 * A post may carry `publishAt` (an ISO instant) to be scheduled: it stays out
 * of every published list — the blog index, the post route, the sitemap and
 * the page registry — until a deployment BUILT at or after that instant.
 * The cut-off is the build time (`SITE_BUILT_AT`, set in next.config.ts), not
 * the request time, so the server and the browser bundle always agree and a
 * scheduled post appears everywhere at once. Publishing on the day therefore
 * takes a production build after `publishAt` (a merge or a redeploy).
 */
export type LocalBlogPost = ApiBlogDetail & { publishAt?: string };

export const allLocalBlogPosts: LocalBlogPost[] = [
  {
    slug: "champion-vs-clayton-homes",
    title: "Champion vs. Clayton Homes: How to Choose in 2026",
    excerpt:
      "Both build quality homes to the same HUD code. The real differences are what you can compare, who you buy from and how the deal is put together. An honest side-by-side guide for northeast Indiana buyers weighing Champion and Clayton.",
    image: "/images/homepage/double-wide-exterior.webp",
    date: "August 17, 2026",
    html: `
<p>If you&rsquo;re shopping for a new manufactured home (most people still call it a mobile home) in northeast Indiana, two names come up fast: <strong>Clayton</strong> and <strong>Champion</strong>. Both build homes to the same federal HUD code, and both are big, established builders. The real differences are in <em>what you can compare, who you buy from, and how the deal is put together.</em> Here&rsquo;s an honest breakdown, written by a Champion dealer, so read it with that in mind and check every point against the quotes you get.</p>

<h2>Who they are</h2>
<ul>
  <li><strong>Clayton Homes</strong> is one of the largest builders of factory-built homes in the country and is owned by Berkshire Hathaway. Clayton builds its own family of brands and sells them mainly through company-owned Clayton Homes retail centers, with affiliated companies offering mortgages and insurance. The closest one to us is on State Road 8 in Garrett.</li>
  <li><strong>Champion Homes</strong> is one of the largest producers of factory-built housing in North America. Champion sells through independent dealers. Factory Direct Homes Center is one of them: an owner-operated dealership in Auburn, run by Kyle Dudgeon, selling Champion&rsquo;s <a href="/champion-homes">Aspire, Prime and Redman series</a>, built at Champion&rsquo;s Indiana plants, most of them 30 miles away in Topeka.</li>
</ul>

<h2>Build quality: honestly, both are strong</h2>
<p>Every new manufactured home from either builder is built to the federal HUD code, inspected during construction, and carries a HUD label and a data plate. Modular homes from either are built to the state building code instead. Neither brand is a gamble on construction. What varies is the specific model and the options on it, so compare <em>homes</em>, not brands.</p>

<h2>How to compare two homes side by side</h2>
<p>Pick two homes of similar size and layout, one from each builder, and put these on a sheet next to each other. Every item is on the data plate, the spec sheet or the quote:</p>
<ul>
  <li><strong>Thermal zone, wind zone and roof load zone</strong> on the data plate. Northeast Indiana needs the right thermal zone and a roof rated for our snow load.</li>
  <li><strong>Insulation</strong> in the walls, floor and ceiling, and the window type.</li>
  <li><strong>Wall and ceiling finish</strong>: taped and textured drywall or vinyl-covered panels, and the ceiling height.</li>
  <li><strong>Roof pitch, siding and shingles</strong>, which drive both looks and upkeep.</li>
  <li><strong>Kitchen and bath</strong>: cabinet construction, countertops, appliances, and whether the photos show the standard package or options.</li>
  <li><strong>Warranty</strong>: how long the manufacturer&rsquo;s warranty runs and what it covers.</li>
</ul>
<p>Not sure how to read a plan or a data plate? Ask us at the showroom &mdash; both are explained on the home itself &mdash; and browse <a href="/double-wide-homes">double wides</a> and <a href="/single-wide-homes">single wides</a> with full specs on each page.</p>

<h2>How the purchase is put together</h2>
<p>This is where the two models really differ.</p>
<ul>
  <li><strong>The lender.</strong> When the same company owns the store and an affiliated lender, the store&rsquo;s own financing is usually what&rsquo;s offered first. We don&rsquo;t offer financing at all: we hand you the list of lenders our customers have used, recommend none of them, and you apply to as many as you like. Wherever you buy, compare rates from more than one lender.</li>
  <li><strong>Site work and setup.</strong> At our dealership you hire and pay your own licensed contractors for site work, the foundation and setup, and we give you a contractor list to start from. Other retailers may package some of that into their price. Neither is wrong, but you need to know which you&rsquo;re looking at, or two quotes won&rsquo;t compare.</li>
  <li><strong>The quote itself.</strong> We list the home, each option and delivery as separate lines. Ask every dealer for the same, in writing.</li>
</ul>

<h2>Getting quotes you can actually compare</h2>
<p>A single bottom-line number tells you almost nothing. Before you compare two dealers, make sure both quotes answer the same questions:</p>
<ul>
  <li>Is delivery included, and from which plant?</li>
  <li>Is setup included: blocking, leveling, tie-downs, joining the sections?</li>
  <li>Are air conditioning, skirting, steps and gutters included or extra?</li>
  <li>Which options are on the home in the photos, and which are on the home in the quote?</li>
  <li>Which fees appear only at signing?</li>
</ul>
<p>Our <a href="/blog/how-to-read-manufactured-home-quote">guide to reading a manufactured home quote</a> goes deeper, and <a href="/guides/pricing">how our pricing works</a> shows what goes on each line of ours.</p>

<h2>How to decide</h2>
<p>If you want one company handling the store, the home and the financing, a company-owned store is built for that. If you want the Champion lineup, an itemized quote, and the freedom to choose your own lender and contractors, that&rsquo;s how we work. Either way, walk through homes in person, compare the same items on both, and get every cost in writing before you sign.</p>

<h2>FAQ</h2>
<h3>Is Champion or Clayton better quality?</h3>
<p>Both build to the same federal HUD code (or the state building code for modular homes), are inspected during construction, and carry manufacturer warranties. Compare specific models: insulation, wall finish, roof, windows and warranty matter more than the brand name.</p>
<h3>Are Champion homes mobile homes?</h3>
<p>&ldquo;Mobile home&rdquo; is the everyday name. Strictly, it means a home built before June 15, 1976. New Champion single wides and double wides are HUD-code manufactured homes, which is what most people mean when they search for a new mobile home.</p>
<h3>Is Factory Direct Homes Center a Clayton dealer?</h3>
<p>No. We&rsquo;re an independent, authorized <strong>Champion Homes</strong> dealer in Auburn, Indiana, selling Champion&rsquo;s Aspire, Prime and Redman series.</p>
<h3>Can I compare Champion homes in person near Fort Wayne?</h3>
<p>Yes. Our Auburn showroom is about 25 minutes from Fort Wayne. Browse our <a href="/floor-plans">Champion floor plans</a> or <a href="/design-your-home">design your home online</a>, then <a href="/contact-us">visit us</a> to walk through homes in person.</p>
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
<p>And as always, site work — foundation or pad, utilities, and driveway — is handled by <strong>your own licensed contractors</strong>, which is where many buyers save real money versus dealer-bundled site work. We're glad to share a list of licensed and insured contractors past customers have used.</p>

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
  <li><strong>Site work</strong> — foundation or pad, utility connections, driveway, and grading. In our model, <strong>you hire your own licensed contractors</strong> for site work and setup. Most buyers save money this way compared to dealer-bundled site work, and we can share a list of licensed and insured contractors past customers have used.</li>
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
<p>Pick a floor plan from our <a href="/floor-plans">70+ Champion floor plans</a> and <a href="/contact-us">request a quote</a>, or visit the showroom at 1211 IN-8, Auburn, IN. You'll get current, line-item numbers for exactly the home and options you want — no pressure, no bundled mystery pricing.</p>
`,
  },
];

/** When this build was made; outside a Next build (tests, scripts) it is now. */
export function siteBuiltAt(): string {
  return process.env.SITE_BUILT_AT || new Date().toISOString();
}

export function isPublished(post: { publishAt?: string }, at: string = siteBuiltAt()): boolean {
  return !post.publishAt || Date.parse(post.publishAt) <= Date.parse(at);
}

/** The posts this build publishes. Everything that lists or serves posts reads this. */
export const localBlogPosts: LocalBlogPost[] = allLocalBlogPosts.filter((p) => isPublished(p));
