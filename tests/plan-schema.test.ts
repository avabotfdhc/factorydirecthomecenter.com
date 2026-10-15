// The floor-plan detail page publishes ONE JSON-LD block: a `@graph` of the
// home, its breadcrumb trail, its FAQs and the page node that links them.
// Until 2026-10-15 it shipped four unlinked blocks (and a Product only when
// priced). These tests hold the graph's shape, the price gate, and the two
// rules every other schema on the site already obeys: the seller is the one
// canonical business node, and no dollar figure is published while prices
// are hidden.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildPlanGraph, numericPrice, planSchemaDescription, priceValidUntil } from "../src/lib/plan-schema";
import { buildPlanNarrative } from "../src/lib/plan-content";
import type { ApiFloorPlanDetail } from "../src/lib/api-content";
import { BUSINESS, BUSINESS_ID, SITE_URL } from "../src/lib/business";
import { WEBSITE_ID } from "../src/lib/seo";
import { jsonLdScript } from "../src/lib/json-ld";

const URL = `${SITE_URL}/floor-plans/aspire-1676h32107`;

/** A CMS-shaped Aspire double-wide, as getApiFloorPlanBySlug returns it. */
const plan: ApiFloorPlanDetail = {
  slug: "aspire-1676h32107",
  name: "Westbrook",
  title: "Westbrook - 3 Bed 2 Bath Multi-Section | Champion Aspire Series",
  price: "Call for pricing",
  sqft: 1178,
  beds: 3,
  baths: 2,
  image: "/images/aspire/1676h32107.webp",
  brand: "Champion Homes",
  homeType: "Multi-Section Manufactured Home",
  series: "Aspire",
  widthFt: 28,
  updatedAt: "2026-09-09T14:02:11.000Z",
  description: "",
  floorPlanHtml: "",
  modelNumber: "1676H32107",
  length: "44'",
  width: "28'",
  brochureUrl: "",
  floorPlanUrl: "",
  virtualTour: "",
  gallery: [
    "/images/aspire/1676h32107.webp",
    "https://example.supabase.co/storage/v1/object/public/floor-plans/aspire/1676H32107/photos/kitchen.jpg",
    "/images/aspire/1676h32107-opt2.webp",
  ],
};

const narrative = buildPlanNarrative(plan, []);
const today = new Date("2026-10-15T12:00:00Z");

type Node = Record<string, unknown>;
const nodes = (g: { "@graph": Node[] }) => g["@graph"];
const byType = (g: { "@graph": Node[] }, type: string) =>
  nodes(g).find((n) => ([] as unknown[]).concat(n["@type"]).includes(type));

// ── Shape ───────────────────────────────────────────────────────────────────

test("one @context, one @graph, every node identified under the page URL", () => {
  const g = buildPlanGraph({ plan, narrative, today });
  assert.equal(g["@context"], "https://schema.org");
  assert.ok(Array.isArray(g["@graph"]) && g["@graph"].length >= 3);
  for (const n of nodes(g)) {
    assert.ok(!("@context" in n), `a graph node must not carry its own @context: ${JSON.stringify(n["@type"])}`);
    assert.match(String(n["@id"]), new RegExp(`^${URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}#[a-z]+$`), "every node is an anchor on the page URL");
  }
  const ids = nodes(g).map((n) => n["@id"]);
  assert.equal(new Set(ids).size, ids.length, "no two nodes share an @id");
});

test("the home node describes the floor plan", () => {
  const home = byType(buildPlanGraph({ plan, narrative, today }), "SingleFamilyResidence")!;
  assert.equal(home["@id"], `${URL}#product`);
  assert.equal(home.name, "Champion Homes Westbrook (1676H32107)");
  assert.equal(home.url, URL);
  assert.equal(home.sku, "aspire-1676h32107");
  assert.equal(home.mpn, "1676H32107");
  assert.deepEqual(home.brand, { "@type": "Brand", name: "Champion Homes" });
  assert.deepEqual(home.manufacturer, { "@type": "Organization", name: "Champion Homes" });
  assert.equal(home.numberOfBedrooms, 3);
  assert.equal(home.numberOfBathroomsTotal, 2);
  assert.deepEqual(home.floorSize, { "@type": "QuantitativeValue", value: 1178, unitCode: "FTK" });
  // Images are absolute, banner first, deduplicated (the banner is also gallery[0]).
  assert.deepEqual(home.image, [
    `${SITE_URL}/images/aspire/1676h32107.webp`,
    "https://example.supabase.co/storage/v1/object/public/floor-plans/aspire/1676H32107/photos/kitchen.jpg",
    `${SITE_URL}/images/aspire/1676h32107-opt2.webp`,
  ]);
  const props = home.additionalProperty as Array<{ name: string; value: string }>;
  assert.deepEqual(props.map((p) => p.name), ["Home type", "Series", "Width", "Length", "Construction"]);
  assert.match(props.at(-1)!.value, /Topeka/, "an Aspire home is built in Topeka");
  // Description comes from the page's own opening paragraph when the CMS
  // description is empty (true for every CMS plan on 2026-09-11).
  assert.match(String(home.description), /^The Westbrook is a 1,178-square-foot multi-section manufactured home/);
  assert.ok(String(home.description).length <= 500);
});

test("Prime is built in Decatur, never Topeka", () => {
  const prime = buildPlanGraph({ plan: { ...plan, series: "Prime", slug: "prime-1676h32107" }, narrative, today });
  const props = byType(prime, "SingleFamilyResidence")!.additionalProperty as Array<{ name: string; value: string }>;
  assert.match(props.at(-1)!.value, /Decatur/);
  assert.doesNotMatch(props.at(-1)!.value, /Topeka/);
});

test("the breadcrumb trail is Home › Floor Plans › Series › Home, in order", () => {
  const crumbs = byType(buildPlanGraph({ plan, narrative, today }), "BreadcrumbList")!;
  assert.equal(crumbs["@id"], `${URL}#breadcrumbs`);
  const items = crumbs.itemListElement as Array<{ position: number; name: string; item: string }>;
  assert.deepEqual(items.map((i) => i.position), [1, 2, 3, 4]);
  assert.deepEqual(items.map((i) => i.name), ["Home", "Floor Plans", "Aspire Series", "Westbrook"]);
  assert.deepEqual(items.map((i) => i.item), [`${SITE_URL}/`, `${SITE_URL}/floor-plans`, `${SITE_URL}/series/aspire`, URL]);
});

test("a plan with no series hub still gets a three-step trail", () => {
  const g = buildPlanGraph({ plan, narrative: { ...narrative, hub: undefined }, today });
  const items = byType(g, "BreadcrumbList")!.itemListElement as Array<{ name: string }>;
  assert.deepEqual(items.map((i) => i.name), ["Home", "Floor Plans", "Westbrook"]);
});

test("the FAQ node carries the plan's own questions and is omitted when there are none", () => {
  const faq = byType(buildPlanGraph({ plan, narrative, today }), "FAQPage")!;
  assert.equal(faq["@id"], `${URL}#faq`);
  const qs = faq.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>;
  assert.equal(qs.length, narrative.faqs.length);
  assert.deepEqual(qs.map((q) => q.name), narrative.faqs.map((f) => f.question));
  assert.equal(byType(buildPlanGraph({ plan, narrative: { ...narrative, faqs: [] }, today }), "FAQPage"), undefined);
});

test("the WebPage node links the site, the trail and the home", () => {
  const page = byType(buildPlanGraph({ plan, narrative, today }), "WebPage")!;
  assert.equal(page["@id"], `${URL}#webpage`);
  assert.deepEqual(page.isPartOf, { "@id": WEBSITE_ID });
  assert.deepEqual(page.breadcrumb, { "@id": `${URL}#breadcrumbs` });
  assert.deepEqual(page.mainEntity, { "@id": `${URL}#product` });
  assert.equal(page.dateModified, plan.updatedAt);
  assert.equal((page.primaryImageOfPage as Node).contentUrl, `${SITE_URL}/images/aspire/1676h32107.webp`);
});

// ── The price gate ──────────────────────────────────────────────────────────

test("while prices are hidden there is no Product, no Offer and no dollar figure", () => {
  const g = buildPlanGraph({ plan, narrative, today });
  const home = byType(g, "SingleFamilyResidence")!;
  assert.deepEqual(home["@type"], ["SingleFamilyResidence"], "a Product without offers is a Search Console error on every plan page");
  assert.equal(home.offers, undefined);
  assert.equal(byType(g, "Offer"), undefined);
  const json = jsonLdScript(g);
  assert.ok(!/"price"/.test(json), "no price key may be published while prices are hidden");
  assert.ok(!/\$\s?\d/.test(json), "no dollar figure may be published while prices are hidden");
  assert.ok(!/Call for pricing/.test(json), "the placeholder must not leak into the markup");
});

test("a numeric price turns the node into a Product with a complete Offer", () => {
  const g = buildPlanGraph({ plan: { ...plan, price: "$120,800" }, narrative, today });
  const home = byType(g, "Product")!;
  assert.deepEqual(home["@type"], ["Product", "SingleFamilyResidence"]);
  const offer = home.offers as Node;
  assert.equal(offer["@type"], "Offer");
  assert.equal(offer["@id"], `${URL}#offer`);
  assert.equal(offer.url, URL);
  assert.equal(offer.priceCurrency, "USD");
  assert.equal(offer.price, "120800");
  assert.equal(offer.priceValidUntil, "2027-12-31");
  assert.equal(offer.itemCondition, "https://schema.org/NewCondition");
  assert.equal(offer.availability, "https://schema.org/PreOrder", "every home is built to order unless it stands on the lot");
});

test("the seller is the one canonical business node, with an address", () => {
  const g = buildPlanGraph({ plan: { ...plan, price: "$120,800" }, narrative, today });
  const seller = (byType(g, "Product")!.offers as Node).seller as Node;
  assert.equal(seller["@id"], BUSINESS_ID, "never a hand-written LocalBusiness stub — that publishes a second business");
  assert.ok(seller.address && typeof seller.address === "object", "schema.org requires an address on a LocalBusiness");
  assert.equal(seller.name, BUSINESS.legalName);
});

test("a home on the lot is InStock; everything else is PreOrder", () => {
  const priced = { ...plan, price: "$120,800" };
  const lot = (byType(buildPlanGraph({ plan: priced, narrative, onLot: true, today }), "Product")!.offers as Node).availability;
  const order = (byType(buildPlanGraph({ plan: priced, narrative, today }), "Product")!.offers as Node).availability;
  assert.equal(lot, "https://schema.org/InStock");
  assert.equal(order, "https://schema.org/PreOrder");
});

test("priceValidUntil is the end of next year as a full calendar day", () => {
  assert.equal(priceValidUntil(new Date("2026-01-01T00:00:00Z")), "2027-12-31");
  assert.equal(priceValidUntil(new Date("2026-12-31T23:59:59Z")), "2027-12-31");
  assert.match(priceValidUntil(), /^\d{4}-12-31$/);
});

test("numericPrice reads a formatted price and rejects the placeholder", () => {
  assert.equal(numericPrice("$120,800"), "120800");
  assert.equal(numericPrice("From $80,000"), "80000");
  assert.equal(numericPrice("Call for pricing"), "");
  assert.equal(numericPrice(""), "");
  assert.equal(numericPrice("$0"), "");
});

// ── Description ─────────────────────────────────────────────────────────────

test("the CMS description wins when there is one, and HTML is stripped", () => {
  const d = planSchemaDescription(
    { ...plan, description: "<p>Open kitchen &amp; a big <strong>primary suite</strong>.</p>" },
    narrative,
  );
  assert.equal(d, "Open kitchen & a big primary suite.");
});

test("long text is cut at a sentence end, never mid-word", () => {
  const long = Array.from({ length: 30 }, (_, i) => `Sentence number ${i + 1} says something about the home.`).join(" ");
  const d = planSchemaDescription({ ...plan, description: long }, narrative);
  assert.ok(d.length <= 500);
  assert.match(d, /home\.$/);
});

// ── Source guards ───────────────────────────────────────────────────────────

const read = (rel: string) => readFileSync(resolve(process.cwd(), rel), "utf8");

test("the plan page renders exactly one structured-data block, from the graph builder", () => {
  const page = read("src/app/floor-plans/[slug]/page.tsx");
  const emitters = page.match(/<StructuredData\b/g) ?? [];
  assert.equal(emitters.length, 1, "the page used to ship four unlinked ld+json blocks; everything goes through buildPlanGraph()");
  assert.match(page, /buildPlanGraph\(/);
  assert.doesNotMatch(page, /SingleFamilyResidenceSchema|structuredData\.breadcrumb|structuredData\.product/);
  // FAQSection emits its own FAQPage by default; the graph already carries it.
  assert.match(page, /<FAQSection[\s\S]*?showSchema=\{false\}[\s\S]*?\/>/, "FAQSection must not publish a second FAQPage on the plan page");
});

test("the retired standalone residence block is gone", () => {
  assert.doesNotMatch(read("src/components/JsonLd.tsx"), /SingleFamilyResidence/);
});
