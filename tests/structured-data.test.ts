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
import { businessRef, businessJsonLd, BUSINESS_ID, BUSINESS, GOOGLE_LISTING_URL } from "../src/lib/business";
import { GOOGLE_REVIEWS_URL } from "../src/lib/reviews";
import { jsonLdScript } from "../src/lib/json-ld";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const BUSINESS_TYPES = new Set([
  "LocalBusiness",
  "MobileHomeDealer",
  "RealEstateAgent",
  "HomeAndConstructionBusiness",
]);

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

// ── The same rule, for Organization ─────────────────────────────────────────
// businessRef() closed the LocalBusiness hole. The identical defect survived
// under a different @type: `author` and `publisher` nodes typed Organization
// and named "Factory Direct Homes Center", with no @id, which read as a
// second organisation sharing our name. The blog detail page published one on
// every post. Any node carrying our name must carry our @id.

function namedNodes(value: unknown, found: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    for (const v of value) namedNodes(v, found);
    return found;
  }
  if (value && typeof value === "object") {
    const node = value as Record<string, unknown>;
    const name = node.name;
    if (typeof name === "string" && /Factory Direct Homes Center/i.test(name)) found.push(node);
    for (const v of Object.values(node)) namedNodes(v, found);
  }
  return found;
}

test("every node calling itself Factory Direct Homes Center carries the one business @id", () => {
  const docs: Record<string, unknown> = {
    ...samples,
    article: structuredData.article({
      headline: "A post",
      description: "About a post",
      image: "/images/hero-home.jpg",
      datePublished: "2026-09-18",
      url: "/blog/a-post",
    }),
    imageObject: structuredData.imageObject({
      url: "/images/hero-home.jpg",
      name: "A home",
      description: "A home",
      width: 1920,
      height: 1071,
    }),
    videoObject: structuredData.videoObject({
      name: "A walkthrough",
      description: "A walkthrough",
      thumbnailUrl: "/images/hero-home.jpg",
      contentUrl: "https://example.com/video.mp4",
      uploadDate: "2026-09-18",
    }),
  };

  for (const [label, doc] of Object.entries(docs)) {
    for (const node of namedNodes(doc)) {
      // The top-level node of a generator is allowed to be the canonical one;
      // what must never happen is a *nested* namesake with no @id.
      assert.equal(
        node["@id"],
        BUSINESS_ID,
        `${label}: a node named "${String(node.name)}" (@type ${JSON.stringify(node["@type"])}) has no canonical @id — it publishes a second business with our name`,
      );
    }
  }
});

test("a post attributed to someone else is NOT given the business @id", () => {
  // The rule is "our name means our @id", not "every author is us". A guest
  // byline must stay a distinct person/organisation.
  const guest = structuredData.article({
    headline: "A guest post",
    description: "By someone else",
    image: "/images/hero-home.jpg",
    datePublished: "2026-09-18",
    author: "Champion Home Builders",
    url: "/blog/guest",
  });
  const author = (guest as { author?: Record<string, unknown> }).author;
  assert.equal(author?.name, "Champion Home Builders");
  assert.equal(author?.["@id"], undefined);
});

// ── Exactly one BreadcrumbList per page ────────────────────────────────────

test("only PageFooter and the floor-plan detail page emit a BreadcrumbList", () => {
  // Twenty-three pages used to emit their own on top of the sitewide one in
  // PageFooter, so each shipped two BreadcrumbList nodes disagreeing about the
  // labels for the same URL. A source-level guard is the only kind that
  // catches this: both nodes are individually valid, so no schema validator
  // complains — you only see it by counting them in the rendered HTML.
  const allowed = new Set([
    "src/components/PageFooter.tsx",
    // Home › Floor Plans › <Series> Series › <Home> — the series crumb is not
    // derivable from the URL, so this page builds its own and PageFooter
    // stands down for /floor-plans/*.
    "src/app/floor-plans/[slug]/page.tsx",
    // The generator itself.
    "src/lib/seo.ts",
  ]);

  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
        const rel = relative(process.cwd(), full).split(sep).join("/");
        if (allowed.has(rel)) continue;
        const source = readFileSync(full, "utf8");
        if (/structuredData\.breadcrumb\(|"@type":\s*"BreadcrumbList"|"BreadcrumbList"/.test(source)) {
          offenders.push(rel);
        }
      }
    }
  };
  walk(resolve(process.cwd(), "src"));

  assert.deepEqual(
    offenders,
    [],
    "these files emit a second BreadcrumbList; PageFooter already publishes one on every non-home page",
  );
});

// `sameAs` tells Google which other profiles are this same business. An entry
// that does not resolve, or that resolves to somebody else, asks Google to
// merge a stranger into our knowledge-graph entity — so these came from the
// Google Business Profile itself rather than from memory. The handle the
// previous build published (`instagram.com/factorydirecthomescenter`) was not
// the real one; these tests hold the shape, not the spelling.

test("every sameAs profile is an absolute https URL", () => {
  for (const url of BUSINESS.sameAs) {
    assert.match(url, /^https:\/\/[^\s]+$/, `sameAs entry is not an absolute https URL: ${url}`);
    assert.equal(url.trim(), url, `sameAs entry has stray whitespace: ${url}`);
  }
});

test("no profile is listed twice", () => {
  const seen = new Set(BUSINESS.sameAs.map((u) => u.toLowerCase()));
  assert.equal(seen.size, BUSINESS.sameAs.length, "a sameAs profile is listed more than once");
});

test("the Google listing is the one we publish and the one we send reviewers to", () => {
  assert.ok(
    BUSINESS.sameAs.includes(GOOGLE_LISTING_URL),
    "the Google Business Profile must be in sameAs",
  );
  assert.equal(
    GOOGLE_REVIEWS_URL,
    GOOGLE_LISTING_URL,
    "the review link and the published listing must be the same URL",
  );
});

test("the business node publishes every profile", () => {
  const node = businessJsonLd() as { sameAs?: unknown };
  assert.deepEqual(node.sameAs, [...BUSINESS.sameAs], "businessJsonLd must publish the full sameAs list");
});

// Every JSON-LD block goes through jsonLdScript().
//
// Inside a <script>, the HTML parser stops at the first `</script` — JSON
// quoting does not protect it, because the parser never looks inside the
// JSON. Five places emitted an ld+json block and only one escaped `<`, so a
// plan name or FAQ answer containing a tag would have ended the block early.
// No live content carries a `<` in a schema field today; this keeps the four
// that were unguarded from drifting back.
test("no JSON-LD block is built with a raw JSON.stringify", () => {
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!entry.name.endsWith(".ts") && !entry.name.endsWith(".tsx")) continue;
      const rel = relative(process.cwd(), full).split(sep).join("/");
      if (rel === "src/lib/json-ld.ts") continue;
      const lines = readFileSync(full, "utf8").split("\n");
      for (const [i, line] of lines.entries()) {
        if (!/application\/ld\+json/.test(line)) continue;
        // The serialiser may sit on this line or in the dozen that follow it.
        const window = lines.slice(i, i + 14).join("\n");
        if (/JSON\.stringify/.test(window) && !/jsonLdScript/.test(window)) {
          offenders.push(`${rel}:${i + 1}`);
        }
      }
    }
  };
  walk(resolve(process.cwd(), "src"));

  assert.deepEqual(offenders, [], "these ld+json blocks serialise without escaping `<` — use jsonLdScript()");
});

// The escaping itself, not just its call sites.
test("jsonLdScript closes the </script> escape and still round-trips", () => {
  const hostile = {
    name: 'Peak </script><img src=x onerror="alert(1)">',
    detail: "a < b, and 3 < 4",
  };
  const out = jsonLdScript(hostile);

  assert.ok(!/<\/script/i.test(out), "the serialised block must not contain </script");
  assert.ok(!out.includes("<"), "no raw < may survive");
  assert.deepEqual(JSON.parse(out), hostile, "a consumer must still read the original strings back");
});
