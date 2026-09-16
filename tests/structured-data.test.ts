// Every business node we publish must be the same business, with an address.
//
// Semrush's crawl flagged "Local Business / address / A value for the address
// field is required" on 15 pages (/financing and 14 location pages). The cause
// was four hand-written stubs of the shape
//
//     { "@type": "LocalBusiness", name: "Factory Direct Homes Center" }
//
// nested as a `provider`, `seller` or `itemReviewed`. Two things are wrong with
// that stub: schema.org requires `address` on a LocalBusiness, and with no
// `@id` it reads as a *second* business sharing our name — the duplicate-entity
// problem src/lib/business.ts exists to prevent.
//
//   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { structuredData } from "../src/lib/seo";
import { businessRef, businessJsonLd, BUSINESS_ID } from "../src/lib/business";

const BUSINESS_TYPES = new Set(["LocalBusiness", "RealEstateAgent", "HomeAndConstructionBusiness"]);

interface Node {
  "@type"?: unknown;
  "@id"?: unknown;
  address?: unknown;
  [k: string]: unknown;
}

/** Every business-typed node anywhere in a JSON-LD tree, however deeply nested. */
function businessNodes(value: unknown, found: Node[] = []): Node[] {
  if (Array.isArray(value)) {
    for (const v of value) businessNodes(v, found);
    return found;
  }
  if (value && typeof value === "object") {
    const node = value as Node;
    const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
    if (types.some((t) => typeof t === "string" && BUSINESS_TYPES.has(t))) found.push(node);
    for (const v of Object.values(node)) businessNodes(v, found);
  }
  return found;
}

/** One sample of every generator that can carry a business node. */
const samples: Record<string, unknown> = {
  localBusiness: structuredData.localBusiness(),
  service: structuredData.service({
    name: "Manufactured Home Delivery",
    description: "Delivery to northeast Indiana",
    areaServed: "Indiana",
  }),
  product: structuredData.product({
    name: "Champion Paramount",
    description: "A multi-section home",
    image: "/images/hero-home.jpg",
    price: "$0",
  }),
  aggregateRating: structuredData.aggregateRating({
    ratingValue: 5,
    reviewCount: 1,
    itemReviewed: "Factory Direct Homes Center",
  }),
  businessRef: businessRef(),
  businessJsonLd: businessJsonLd(),
};

test("every business node carries an address", () => {
  for (const [name, doc] of Object.entries(samples)) {
    const nodes = businessNodes(doc);
    assert.ok(nodes.length > 0, `${name}: expected at least one business node`);
    for (const node of nodes) {
      assert.ok(
        node.address && typeof node.address === "object",
        `${name}: a business node has no address — never hand-write a LocalBusiness stub, use businessRef()`,
      );
    }
  }
});

test("every business node is the same business", () => {
  for (const [name, doc] of Object.entries(samples)) {
    for (const node of businessNodes(doc)) {
      assert.equal(
        node["@id"],
        BUSINESS_ID,
        `${name}: a business node has a different @id (or none), which publishes a second business`,
      );
    }
  }
});

test("the nested reference stays in step with the canonical node", () => {
  const ref = businessRef();
  const full = businessJsonLd();
  assert.deepEqual(ref["@type"], full["@type"], "nested type must match the canonical node");
  assert.deepEqual(ref.address, full.address, "nested address must match the canonical node");
  assert.equal(ref.name, full.name);
  assert.equal(ref.telephone, full.telephone);
});

test("the guard would catch the stub it was written for", () => {
  // The exact shape that shipped before this fix.
  const stub = { "@type": "Service", provider: { "@type": "LocalBusiness", name: "Factory Direct Homes Center" } };
  const [node] = businessNodes(stub);
  assert.ok(node, "the walker must find a nested business node");
  assert.equal(node.address, undefined, "…and see that it has no address");
  assert.equal(node["@id"], undefined, "…and no @id");
});
