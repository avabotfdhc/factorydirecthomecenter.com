// Locally-authored blog posts, merged with CMS posts in api-content.ts.
// Use for editorial content published from the repo (reviewed in a PR) rather
// than through the external CMS admin. Keep claims consistent with site copy:
// price RANGES only (quotes are line-item, "contact for pricing"), and site
// work / setup is done by the buyer's own contractors — never claim FDHC
// performs setup or site work.

import type { ApiBlogDetail } from "./api-content";

export const localBlogPosts: ApiBlogDetail[] = [
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
];
