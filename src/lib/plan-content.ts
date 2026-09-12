// Per-plan editorial content for /floor-plans/[slug], derived from the facts we
// actually hold about each home (series, HUD vs IRC code, width, length,
// square footage, bedrooms, plant) plus the rest of the catalogue (its HUD/
// modular twin, the same box in another series, the closest comparable plans).
//
// Why this exists: on 2026-09-11 all 400 active plans in the CMS had an empty
// description and body, so every detail page was one templated sentence plus
// the same six homepage FAQs — 400 near-duplicate thin pages, the single
// biggest content-quality liability on the site. This module makes each page
// say what is specific to that home and link it into the catalogue. It is
// still generated copy: hand-written descriptions entered in /admin
// (floor_plans.description / floor_plan_html) render above it and should
// replace it for the featured sale homes first.
//
// House rules honoured here: no dollar figures for home prices (pricing is
// line-item, "contact for pricing"); site work, foundations and setup are done
// by the buyer's own contractors, never by FDHC.

import type { ApiFloorPlan, ApiFloorPlanDetail } from "./api-content";
import { seriesHubs, type SeriesHub } from "./series-hubs";

export type PlanKind = "single" | "multi" | "modular";

export interface PlanSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface PlanLink {
  name: string;
  href: string;
}

export interface PlanFaq {
  question: string;
  answer: string;
}

export interface PlanNarrative {
  kind: PlanKind;
  hub?: SeriesHub;
  sections: PlanSection[];
  /** The same box built to the other code (HUD ⇄ IRC modular), when published. */
  twin?: { plan: ApiFloorPlan; text: string };
  /** The same model number published under another Champion series. */
  sibling?: { plan: ApiFloorPlan; text: string };
  related: ApiFloorPlan[];
  guides: PlanLink[];
  locations: PlanLink[];
  faqs: PlanFaq[];
}

const num = (n: number) => n.toLocaleString("en-US");

export function planKind(homeType: string): PlanKind {
  if (/modular/i.test(homeType)) return "modular";
  if (/multi|double|section/i.test(homeType)) return "multi";
  return "single";
}

/** Home-type words as buyers search for them ("double wide", not "multi-section"). */
export function planTypeLabel(plan: Pick<ApiFloorPlan, "homeType" | "widthFt">): string {
  const kind = planKind(plan.homeType);
  if (kind === "modular") return "Modular Home";
  if (kind === "multi") return (plan.widthFt ?? 0) >= 32 ? "Multi-Section Home" : "Double Wide Home";
  return "Single Wide Home";
}

function widthFt(plan: ApiFloorPlanDetail): number | undefined {
  const w = plan.widthFt ?? parseInt(plan.width, 10);
  return Number.isFinite(w) && w > 0 ? w : undefined;
}

function lengthFt(plan: ApiFloorPlanDetail): number | undefined {
  const l = parseInt(plan.length, 10);
  return Number.isFinite(l) && l > 0 ? l : undefined;
}

/** Champion model code as it appears in a slug ("aspire-monroe-2840m32024"). */
function modelCode(slug: string): string {
  const m = slug.match(/(\d{4})([hm])(\d{2}[a-z0-9]{3})/i);
  return m ? `${m[1]}${m[2]}${m[3]}`.toUpperCase() : "";
}

/** The code with the HUD/modular letter neutralised, so twins match. */
function boxCode(slug: string): string {
  const code = modelCode(slug);
  return code ? code.replace(/^(\d{4})[HM]/, "$1_") : "";
}

function hubFor(plan: ApiFloorPlan): SeriesHub | undefined {
  // Dutch-branded Aspire slugs belong to the Dutch hub; every other series maps by name.
  const dutch = seriesHubs.find((h) => h.slugPrefix && plan.slug.startsWith(h.slugPrefix));
  if (dutch) return dutch;
  return seriesHubs.find((h) => !h.slugPrefix && h.catalogSeries.includes(plan.series));
}

function plantFor(series: string): { town: string; distance: string } {
  return /prime/i.test(series)
    ? { town: "Decatur, Indiana", distance: "south of Fort Wayne, under an hour from our Auburn showroom" }
    : { town: "Topeka, Indiana", distance: "about 20 miles up the road from our Auburn showroom" };
}

function sizeSentence(name: string, sqft: number, kind: PlanKind): string {
  if (!sqft) return "";
  if (sqft < 800)
    return `At ${num(sqft)} square feet it is one of the most compact homes we sell, which keeps the purchase price, delivery and heating bills low.`;
  if (sqft < 1200)
    return `${num(sqft)} square feet is an efficient footprint: every room earns its place, and there is little hallway to heat or clean.`;
  if (sqft < 1600)
    return `${num(sqft)} square feet is the mid-size range most buyers land in — enough room for a full kitchen, a real living room and bedrooms that fit queen beds.`;
  if (sqft < 2000)
    return `At ${num(sqft)} square feet the ${name} is a spacious ${kind === "modular" ? "modular" : "sectional"} home, with the open living area and storage buyers usually compare against a site-built house.`;
  return `At ${num(sqft)} square feet the ${name} is among the largest plans in the catalogue — a full-size family home with room for a separate dining area, a utility room and a large primary suite.`;
}

function bedroomSentence(beds: number, baths: number): string {
  const bathText = baths >= 2 ? `${baths} baths mean nobody is waiting in the hallway in the morning.` : `The single bath keeps the layout simple and the plumbing run short.`;
  if (beds <= 1) return `One bedroom keeps the footprint and the price down — a fit for a single occupant, a guest house on family land, or farm housing. ${bathText}`;
  if (beds === 2) return `Two bedrooms suit a couple, a buyer downsizing from a larger house, or a rental on family land. ${bathText}`;
  if (beds === 3) return `Three bedrooms is the layout most families ask for: a primary bedroom plus two more for kids, guests or a home office. ${bathText}`;
  return `${beds} bedrooms give a larger family room to spread out, or a dedicated office and a guest room without giving up a kids' bedroom. ${bathText}`;
}

function constructionSection(plan: ApiFloorPlanDetail, kind: PlanKind, w?: number): PlanSection {
  const name = plan.name;
  if (kind === "single") {
    return {
      heading: "Single-section construction: what it means for your site",
      paragraphs: [
        `The ${name} ships as one ${w ? `${w}-foot-wide ` : ""}section, so it travels county roads and fits lots where a multi-section home cannot. It is built to the federal HUD Code on a steel chassis, which means it can go on private land or in a manufactured-home community, on piers or a permanent foundation, and can be financed with a chattel (home-only) loan or a land-home package.`,
        `Because it arrives complete, setup is the quickest of any home type: your own licensed installer levels and anchors it, connects utilities, and finishes the skirting.`,
      ],
    };
  }
  const half = w ? Math.round(w / 2) : undefined;
  if (kind === "multi") {
    return {
      heading: "Multi-section construction: what it means for your site",
      paragraphs: [
        `The ${name} is built as two factory sections${half ? `, each about ${half} feet wide,` : ""} that are delivered separately and joined on your foundation to make one ${w ? `${w}-foot-wide ` : ""}home. It is built to the federal HUD Code, so it can be placed on private land or in a community and financed with a chattel loan or a land-home mortgage.`,
        `Your site needs access for two transports and room to set the sections; most buyers place a home this size on a permanent block or poured foundation, which also opens up FHA, VA and conventional land-home financing. Your own licensed contractors handle the foundation, set and utility hookups.`,
      ],
    };
  }
  return {
    heading: "IRC modular construction: what it means for your site",
    paragraphs: [
      `The ${name} is built to Indiana's residential building code (the IRC) — the same code as a site-built house — and inspected by the state rather than under the federal HUD program. It has no permanent chassis, sits on a permanent foundation (crawl space or basement), and appraises and finances like a stick-built home, including conventional, FHA and VA mortgages.`,
      `It is delivered in two sections${half ? ` of about ${half} feet each` : ""} and set by crane on the foundation your contractor prepares. Modular is the answer where local zoning excludes HUD-code homes, or where you want the home to be treated as real estate from day one.`,
    ],
  };
}

function twinText(twin: ApiFloorPlan): string {
  return planKind(twin.homeType) === "modular"
    ? `The same floor plan is also built as an IRC modular home (the ${twin.name}, model ${modelCode(twin.slug)}) for buyers who need a permanent foundation, a conventional mortgage, or a subdivision that requires modular construction.`
    : `The same floor plan is also built as a HUD-code manufactured home (the ${twin.name}, model ${modelCode(twin.slug)}), which can be placed on piers or in a community and financed with a chattel loan.`;
}

function siblingText(sib: ApiFloorPlan): string {
  return `Champion also offers this exact box in its ${sib.series} series (${sib.name}), with that series' standard features and finishes — worth comparing before you order.`;
}

function relatedPlans(plan: ApiFloorPlanDetail, all: ApiFloorPlan[], kind: PlanKind, exclude: Set<string>): ApiFloorPlan[] {
  const score = (p: ApiFloorPlan) =>
    Math.abs((p.sqft || 0) - (plan.sqft || 0)) + (p.beds === plan.beds ? 0 : 400) + (p.series === plan.series ? 0 : 800);
  return all
    .filter((p) => p.slug !== plan.slug && !exclude.has(p.slug) && planKind(p.homeType) === kind && p.image)
    .sort((a, b) => score(a) - score(b))
    .slice(0, 4);
}

export function buildPlanNarrative(plan: ApiFloorPlanDetail, all: ApiFloorPlan[]): PlanNarrative {
  const kind = planKind(plan.homeType);
  const hub = hubFor(plan);
  const w = widthFt(plan);
  const l = lengthFt(plan);
  const plant = plantFor(plan.series);
  const name = plan.name;
  const seriesName = hub ? hub.fullName : plan.series ? `Champion ${plan.series} Series` : "Champion";
  const typeWords = kind === "modular" ? "modular home" : kind === "multi" ? "multi-section manufactured home" : "single-wide manufactured home";
  const footprint = w && l ? ` on a ${w}' × ${l}' footprint` : "";
  const bathWord = plan.baths === 1 ? "bath" : "baths";

  const code = modelCode(plan.slug);
  const box = boxCode(plan.slug);
  const twin = box
    ? all.find((p) => p.slug !== plan.slug && p.series === plan.series && boxCode(p.slug) === box && modelCode(p.slug) !== code)
    : undefined;
  const sibling = code ? all.find((p) => p.slug !== plan.slug && p.series !== plan.series && modelCode(p.slug) === code) : undefined;

  const sections: PlanSection[] = [
    {
      heading: `About the ${name}`,
      paragraphs: [
        `The ${name} is a ${plan.sqft ? `${num(plan.sqft)}-square-foot ` : ""}${typeWords} from the ${seriesName}: ${plan.beds} bedroom${plan.beds === 1 ? "" : "s"} and ${plan.baths} ${bathWord}${footprint}${plan.modelNumber ? ` (Champion model ${plan.modelNumber})` : ""}.`,
        [bedroomSentence(plan.beds, plan.baths), sizeSentence(name, plan.sqft, kind)].filter(Boolean).join(" "),
      ],
    },
    constructionSection(plan, kind, w),
    {
      heading: `Built in ${plant.town}, delivered from Auburn`,
      paragraphs: [
        `Champion builds the ${name} at its ${plant.town} plant, ${plant.distance}. Build time is typically 6–8 weeks, and most buyers are moved in 8–12 weeks from order once site work and permits are done. The short haul is why our freight line is lower than dealers farther from the factory.`,
        `We deliver throughout Indiana, Ohio and Michigan, and we quote the home, each option and delivery as separate line items — so you see exactly what you are paying for and nothing is bundled into a mystery number.`,
      ],
    },
  ];

  if (hub) {
    sections.push({
      heading: `Why the ${hub.name} series`,
      paragraphs: [hub.intro, `Best for: ${hub.bestFor.join(" · ")}.`],
      bullets: hub.highlights,
    });
  }

  sections.push({
    heading: "Options and finishes",
    paragraphs: [
      `Like every Champion home we sell, the ${name} is ordered to spec. You choose exterior siding and shingle colors, cabinets and countertops, flooring and appliance packages, and on many plans an optional kitchen, bath or porch layout.${plan.flexNote ? ` On this plan: ${plan.flexNote}` : ""}`,
      `Use the design tool to configure the ${name} online, or walk through models at the Auburn showroom and pick finishes in person.`,
    ],
  });

  const exclude = new Set([twin?.slug, sibling?.slug].filter(Boolean) as string[]);

  const guides: PlanLink[] = [
    kind === "modular"
      ? { name: "Manufactured vs. modular: codes, foundations, financing", href: "/guides/manufactured-vs-modular" }
      : { name: "Single wide vs. double wide: which fits your lot and budget", href: "/guides/single-wide-vs-double-wide" },
    { name: "Delivery and setup, step by step", href: "/guides/delivery-and-setup" },
    { name: "Site work and foundations", href: "/guides/site-work" },
    { name: "Zoning and permits in Indiana", href: "/guides/zoning" },
    { name: "Financing a factory-built home", href: "/guides/financing" },
  ];

  const locations: PlanLink[] = [
    { name: "Fort Wayne", href: "/locations/fort-wayne" },
    { name: "Auburn", href: "/locations/auburn" },
    { name: "Kendallville", href: "/locations/kendallville" },
    { name: "Angola", href: "/locations/angola" },
    { name: "Columbia City", href: "/locations/columbia-city" },
    { name: "All delivery areas", href: "/locations" },
  ];

  const faqs: PlanFaq[] = [
    {
      question: `How big is the ${name}?`,
      answer: `The ${name} has ${plan.sqft ? `${num(plan.sqft)} square feet of living space` : "a compact footprint"} with ${plan.beds} bedroom${plan.beds === 1 ? "" : "s"} and ${plan.baths} ${bathWord}${w && l ? `, on a ${w}-by-${l}-foot footprint` : ""}. ${kind === "single" ? "It is delivered as a single section." : "It is delivered as two factory-built sections joined on site."}`,
    },
    {
      question: `Is the ${name} a single wide, a double wide, or a modular home?`,
      answer:
        kind === "single"
          ? `The ${name} is a single-wide (single-section) manufactured home built to the federal HUD Code. It arrives complete on its own chassis and can be placed on private land or in a manufactured-home community.`
          : kind === "multi"
            ? `The ${name} is a multi-section manufactured home — what most people call a double wide — built to the federal HUD Code and joined from two sections on your foundation.`
            : `The ${name} is an IRC modular home: built in Champion's factory to Indiana's residential building code, set on a permanent foundation, and treated like a site-built house for appraisal and financing.`,
    },
    {
      question: `Where is the ${name} built, and how long until it is delivered?`,
      answer: `Champion builds the ${name} at its ${plant.town} plant, ${plant.distance}. Factory build time is usually 6–8 weeks, and most buyers move in 8–12 weeks from order once permits and site work are complete.`,
    },
    {
      question: `Can I put the ${name} on my own land?`,
      answer:
        kind === "modular"
          ? `Yes. As an IRC modular home the ${name} is permitted almost anywhere a site-built house is, including subdivisions that exclude HUD-code homes. It requires a permanent foundation, which your own licensed contractor builds after you confirm setbacks and pull permits with the county.`
          : `Yes. Manufactured homes are permitted on private land in most rural areas of Indiana, Ohio and Michigan; some cities and subdivisions restrict them or require a permanent foundation. You or your contractor confirm zoning and pull the permits, and we can help you check your parcel before you order.`,
    },
    {
      question: `Can I customize the ${name}?`,
      answer: `Yes. Every ${name} is built to order, so you choose exterior colors, cabinets, countertops, flooring and appliance packages${plan.flexNote ? `, and this plan offers a factory layout option: ${plan.flexNote}` : ", and many plans offer optional kitchen, bath or porch layouts"}. Selections are made at order time from Champion's current options chart.`,
    },
    {
      question: `How do I get a price on the ${name}?`,
      answer: `Call (260) 308-1457 or request a quote online. We quote the ${name} line by line — the home, each option you choose, and delivery to your site are priced separately — so you can compare it honestly against any other dealer's bundled number.`,
    },
  ];

  return {
    kind,
    hub,
    sections,
    twin: twin ? { plan: twin, text: twinText(twin) } : undefined,
    sibling: sibling ? { plan: sibling, text: siblingText(sibling) } : undefined,
    related: relatedPlans(plan, all, kind, exclude),
    guides,
    locations,
    faqs,
  };
}
