// The floor-plan detail page's structured data: ONE <script type="application/ld+json">
// carrying a single `@graph`, instead of the four separate blocks the page used
// to ship (a Product only when priced, a SingleFamilyResidence, a BreadcrumbList
// and the FAQ section's FAQPage), none of which referenced each other.
//
// Nodes, every one with an `@id` under the page URL so they can be linked:
//
//   #product      the home — ["Product", "SingleFamilyResidence"] with name,
//                 description, images, sku/mpn, brand, manufacturer, bedrooms,
//                 bathrooms, floorSize, the construction facts, and an Offer
//                 (#offer) sold by the canonical business node.
//   #breadcrumbs  Home › Floor Plans › <Series> Series › <Home>. The series
//                 crumb is why this page builds its own trail: it cannot be
//                 derived from the URL, so PageFooter stands down for
//                 /floor-plans/* (see tests/structured-data.test.ts).
//   #faq          the plan's own six questions (src/lib/plan-content.ts), so
//                 FAQSection renders with showSchema={false} on this page.
//   #webpage      the page itself, tying the others together: isPartOf the
//                 site's #website node, breadcrumb → #breadcrumbs, mainEntity
//                 → #product.
//
// THE PRICE GATE. Google's product-snippet rules require `offers`, `review` or
// `aggregateRating` on every Product, and an Offer must carry a `price`. Prices
// are hidden site-wide while SHOW_PRICES is off (src/lib/api-content.ts,
// src/lib/supabase-content.ts): every plan's `price` reads "Call for pricing",
// and the no-dollar-figure rule in AGENTS.md covers markup as much as prose —
// a price in the schema that the visible page does not show is also a Google
// merchant-listing violation. So while no numeric price exists the main node
// is a SingleFamilyResidence only, with no Offer (exactly what the page
// published before, now with the rest of the graph around it). The moment a
// numeric price comes through, the same node becomes
// ["Product", "SingleFamilyResidence"] with the full Offer — nothing else
// needs to change for the Product rich result to qualify.
//
// AVAILABILITY. Every home is built to order at Champion's plant, so the
// Offer says PreOrder. `onLot` flips it to InStock for a home that physically
// stands on the Auburn lot; nothing in the catalogue records that today (the
// DealerTide inventory feed is staged, never imported — see AGENTS.md), so
// the page never sets it. Wire it up from real data, never by hand.
//
// The seller is `businessRef()` — the canonical `#business` @id with an
// address — never a hand-written `{ "@type": "LocalBusiness", name: … }`
// stub, which would publish a second business with our name (the defect
// src/lib/business.ts exists to prevent, guarded in tests/structured-data.test.ts).

import type { ApiFloorPlanDetail } from "./api-content";
import { businessRef, SITE_URL } from "./business";
import { absoluteImageUrl } from "./image-alt";
import type { PlanNarrative } from "./plan-content";
import { WEBSITE_ID } from "./seo";

export const SCHEMA_CONTEXT = "https://schema.org";

export interface PlanGraphInput {
  plan: ApiFloorPlanDetail;
  /** The page's own narrative: the series hub (breadcrumb), the opening
   *  paragraph (description fallback) and the plan's FAQs. */
  narrative: Pick<PlanNarrative, "hub" | "sections" | "faqs">;
  /** True only when this exact home stands on the Auburn lot today. */
  onLot?: boolean;
  /** "Now", for priceValidUntil. Injected by the tests. */
  today?: Date;
}

export interface PlanGraph {
  "@context": typeof SCHEMA_CONTEXT;
  "@graph": Record<string, unknown>[];
}

export const planUrl = (slug: string) => `${SITE_URL}/floor-plans/${slug}`;

/** The end of next calendar year, the conventional priceValidUntil for a
 *  standing (not time-limited) price. Always a full YYYY-MM-DD: schema.org's
 *  Date is xsd:date, and a reduced-precision value is a markup error. */
export function priceValidUntil(today: Date = new Date()): string {
  return `${today.getUTCFullYear() + 1}-12-31`;
}

/** The numeric price, or "" while prices are hidden ("Call for pricing"). */
export function numericPrice(price: string): string {
  const n = Number(String(price || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? String(n) : "";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    // "<strong>suite</strong>." → "suite ." without this.
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();
}

/** Cut long text at a sentence end (or a word, with an ellipsis). */
function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const head = text.slice(0, max);
  const sentence = Math.max(head.lastIndexOf(". "), head.lastIndexOf("! "), head.lastIndexOf("? "));
  if (sentence > max / 2) return head.slice(0, sentence + 1);
  const space = head.lastIndexOf(" ");
  return `${head.slice(0, space > 0 ? space : max).trimEnd()}…`;
}

/** Plain-text description: the CMS copy when there is any, otherwise the
 *  page's own generated opening paragraph, so the schema always describes
 *  what the visitor reads. */
export function planSchemaDescription(
  plan: Pick<ApiFloorPlanDetail, "name" | "description" | "homeType" | "brand">,
  narrative: Pick<PlanNarrative, "sections">,
): string {
  const own = stripHtml(plan.description || "");
  const opening = (narrative.sections[0]?.paragraphs ?? []).map(stripHtml).filter(Boolean).join(" ");
  const body = own || opening || `${plan.name} ${plan.homeType} by ${plan.brand || "Champion Homes"}.`;
  return clip(body, 500);
}

export function buildPlanGraph({ plan, narrative, onLot = false, today }: PlanGraphInput): PlanGraph {
  const url = planUrl(plan.slug);
  const brand = plan.brand || "Champion Homes";
  const mpn = plan.modelNumber || "";
  const price = numericPrice(plan.price);
  const images = [...new Set([plan.image, ...plan.gallery].filter(Boolean).map(absoluteImageUrl))];
  // Prime is built at Champion's Decatur, IN plant; Aspire, Redman and Dutch in Topeka.
  const plant = /prime/i.test(plan.series) ? "Decatur" : "Topeka";

  const additionalProperty = [
    plan.homeType ? { "@type": "PropertyValue", name: "Home type", value: plan.homeType } : null,
    plan.series ? { "@type": "PropertyValue", name: "Series", value: `Champion ${plan.series}` } : null,
    plan.width ? { "@type": "PropertyValue", name: "Width", value: plan.width } : null,
    plan.length ? { "@type": "PropertyValue", name: "Length", value: plan.length } : null,
    { "@type": "PropertyValue", name: "Construction", value: `Factory-built at Champion's ${plant}, Indiana plant` },
  ].filter(Boolean);

  const offer = price
    ? {
        "@type": "Offer",
        "@id": `${url}#offer`,
        url,
        priceCurrency: "USD",
        price,
        priceValidUntil: priceValidUntil(today),
        itemCondition: "https://schema.org/NewCondition",
        availability: onLot ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
        seller: businessRef(),
      }
    : null;

  const product: Record<string, unknown> = {
    "@type": price ? ["Product", "SingleFamilyResidence"] : ["SingleFamilyResidence"],
    "@id": `${url}#product`,
    name: mpn ? `${brand} ${plan.name} (${mpn})` : `${brand} ${plan.name}`,
    description: planSchemaDescription(plan, narrative),
    url,
    ...(images.length ? { image: images } : {}),
    // Our catalogue code for this listing; the slug is unique per page and
    // carries the series ("aspire-1676h32107").
    sku: plan.slug,
    ...(mpn ? { mpn } : {}),
    brand: { "@type": "Brand", name: brand },
    manufacturer: { "@type": "Organization", name: brand },
    ...(plan.beds ? { numberOfBedrooms: plan.beds } : {}),
    ...(plan.baths ? { numberOfBathroomsTotal: plan.baths } : {}),
    ...(plan.sqft ? { floorSize: { "@type": "QuantitativeValue", value: plan.sqft, unitCode: "FTK" } } : {}),
    additionalProperty,
    ...(offer ? { offers: offer } : {}),
  };

  const crumbs = [
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Floor Plans", url: `${SITE_URL}/floor-plans` },
    ...(narrative.hub ? [{ name: `${narrative.hub.name} Series`, url: `${SITE_URL}/series/${narrative.hub.slug}` }] : []),
    { name: plan.name, url },
  ];
  const breadcrumbs = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumbs`,
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })),
  };

  const faq = narrative.faqs.length
    ? {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: narrative.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const webpage: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: plan.name,
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": `${url}#breadcrumbs` },
    mainEntity: { "@id": `${url}#product` },
    ...(images[0] ? { primaryImageOfPage: { "@type": "ImageObject", contentUrl: images[0], url: images[0] } } : {}),
    ...(plan.updatedAt ? { dateModified: plan.updatedAt } : {}),
  };

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [product, breadcrumbs, ...(faq ? [faq] : []), webpage],
  };
}
