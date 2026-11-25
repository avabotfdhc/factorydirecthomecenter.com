// One home design, in a form that can travel: the buyer's picks in the
// Design Your Home tool (src/components/HomeDesigner.tsx), encoded for a URL
// or a request body, and turned back into the drawing's choices and a
// readable list of what they configured.
//
// The designer uses this to write the lead message the sales team reads, and
// the server uses the same functions to write the copy a buyer asks to be
// emailed or texted (src/lib/design-summary-send.ts) and to draw its picture
// (/api/design-summary/image). One list, so the buyer's copy and the
// salesperson's lead can never disagree about a home.
//
// Every pick is checked against the chosen home's own catalogue
// (src/lib/exterior-options.ts) and the fixed option lists below when it is
// decoded, so a hand-made request cannot put a colour, an option or any free
// text of its own into an email the dealership sends.
//
// Client-safe: no data files, no Node APIs. It must not import
// src/lib/plan-elevation (the 70 KB data file); the drawing's elevation is
// passed in by whoever has it.

import type { DoorStyle, ExteriorChoices } from "@/components/HomeElevation";
import type { ExteriorCatalog, Swatch } from "@/lib/exterior-options";
import { addedDoorSlots, featureEnd, mergeFeatures, type AddedDoor } from "@/lib/exterior-features";
import type { PlanElevation, ViewName } from "@/lib/plan-elevation-types";

// ---------- the fixed option lists the designer offers ----------

export const BEDROOM_LAYOUTS = ["Convert to 2-bedroom with larger living area", "Add a bedroom if available", "Add a study / den"] as const;
export const KITCHENS = ["Add a kitchen island", "Ultimate kitchen upgrade", "Summit kitchen upgrade"] as const;
export const PRIMARY_BATHS = ["Walk-in shower", "Garden / soaking tub", "Double vanity"] as const;

// General upgrades on the Aspire quote checklist. Exterior items that have
// their own picker (porch, dormer, doors) are not repeated here.
export const UPGRADES = [
  "Electric fireplace",
  "Kitchen island",
  "Stainless steel appliance package",
  "Upgraded (overlay) cabinets",
  "Farmhouse sink",
  "Extra windows",
  "Ceiling fans throughout",
  "Washer & dryer",
  "Energy/insulation upgrade package",
  "Garden tub in primary bath",
] as const;

export const PAYMENT_OPTIONS = ["Paying cash", "Financing", "Not sure yet"] as const;
export const LAND_OPTIONS = ["I own my land", "I have a lot in a community / park", "I need to find land or a lot", "Not sure yet"] as const;
export const TIMEFRAME_OPTIONS = ["1–3 months", "3–6 months", "6–9 months", "9–12 months"] as const;

const VIEWS: ViewName[] = ["front", "rear", "left", "right"];

// ---------- the picks ----------

/** Everything a buyer chose, by board label or option id. Empty means "not picked". */
export interface DesignPicks {
  /** the plan's slug */
  home: string;
  bedroomLayout: string;
  kitchen: string;
  primaryBath: string;
  siding: string;
  shingle: string;
  shutter: string;
  trim: "shutters" | "lineals";
  gableAccent: string;
  door: DoorStyle;
  extraDoors: string[];
  blackPackage: boolean;
  dormer: string;
  elevation: string;
  foundation: "block" | "skirting";
  addonPorch: boolean;
  cabinet: string;
  flooring: string;
  countertop: string;
  upgrades: string[];
  /** the side the picture shows */
  view: ViewName;
}

export function emptyPicks(home = ""): DesignPicks {
  return {
    home,
    bedroomLayout: "",
    kitchen: "",
    primaryBath: "",
    siding: "",
    shingle: "",
    shutter: "",
    trim: "shutters",
    gableAccent: "",
    door: "6-panel",
    extraDoors: [],
    blackPackage: false,
    dormer: "",
    elevation: "",
    foundation: "block",
    addonPorch: false,
    cabinet: "",
    flooring: "",
    countertop: "",
    upgrades: [],
    view: "front",
  };
}

const str = (v: unknown, max = 80): string => (typeof v === "string" ? v.trim().slice(0, max) : "");
const oneOf = <T extends string>(v: unknown, list: readonly T[]): T | "" => ((list as readonly string[]).includes(str(v)) ? (str(v) as T) : "");
const label = (v: unknown, list: Swatch[]): string => (list.some((s) => s.label === str(v)) ? str(v) : "");
const id = (v: unknown, list: { id: string }[]): string => (list.some((c) => c.id === str(v)) ? str(v) : "");

/**
 * Keep only what the home's catalogue offers. Anything else — an unknown
 * colour, a dormer on a single-wide, an upgrade on a Prime, free text — is
 * dropped, the same way the designer drops picks when the buyer switches homes.
 */
export function sanitizePicks(raw: Partial<Record<keyof DesignPicks, unknown>>, catalog: ExteriorCatalog): DesignPicks {
  const p = emptyPicks(str(raw.home, 120));
  p.bedroomLayout = oneOf(raw.bedroomLayout, BEDROOM_LAYOUTS);
  p.kitchen = oneOf(raw.kitchen, KITCHENS);
  p.primaryBath = oneOf(raw.primaryBath, PRIMARY_BATHS);
  p.siding = label(raw.siding, catalog.siding);
  p.shingle = label(raw.shingle, catalog.shingles);
  p.shutter = label(raw.shutter, catalog.shutters);
  p.trim = catalog.lineals && raw.trim === "lineals" ? "lineals" : "shutters";
  p.gableAccent = label(raw.gableAccent, catalog.gableAccents);
  p.door = (id(raw.door, catalog.doors) as DoorStyle) || "6-panel";
  p.extraDoors = Array.isArray(raw.extraDoors) ? [...new Set(raw.extraDoors.map((d) => id(d, catalog.extraDoors)).filter(Boolean))] : [];
  p.blackPackage = catalog.blackPackage && raw.blackPackage === true;
  p.dormer = id(raw.dormer, catalog.dormers);
  p.elevation = id(raw.elevation, catalog.elevations);
  p.foundation = raw.foundation === "skirting" ? "skirting" : "block";
  p.addonPorch = raw.addonPorch === true;
  p.cabinet = label(raw.cabinet, catalog.interior.cabinets);
  p.flooring = label(raw.flooring, catalog.interior.flooring);
  p.countertop = label(raw.countertop, catalog.interior.countertops);
  p.upgrades = catalog.upgrades && Array.isArray(raw.upgrades) ? [...new Set(raw.upgrades.map((u) => oneOf(u, UPGRADES)).filter(Boolean))] : [];
  p.view = (VIEWS as string[]).includes(str(raw.view)) ? (str(raw.view) as ViewName) : "front";
  return p;
}

// ---------- travelling ----------

// Short keys keep an encoded design small enough for a URL and an MMS link.
const KEYS: [keyof DesignPicks, string][] = [
  ["home", "h"], ["bedroomLayout", "bl"], ["kitchen", "k"], ["primaryBath", "pb"],
  ["siding", "si"], ["shingle", "sg"], ["shutter", "su"], ["trim", "t"], ["gableAccent", "ga"],
  ["door", "d"], ["extraDoors", "xd"], ["blackPackage", "bp"], ["dormer", "dm"], ["elevation", "el"],
  ["foundation", "f"], ["addonPorch", "ap"], ["cabinet", "c"], ["flooring", "fl"], ["countertop", "ct"],
  ["upgrades", "u"], ["view", "v"],
];

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromBase64Url(b64: string): string {
  const bin = atob(b64.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

/** The picks as one URL-safe string. Defaults are left out to keep it short. */
export function encodeDesign(picks: DesignPicks): string {
  const empty = emptyPicks();
  const out: Record<string, unknown> = {};
  for (const [k, short] of KEYS) {
    const v = picks[k];
    if (k !== "home" && JSON.stringify(v) === JSON.stringify(empty[k])) continue;
    out[short] = v;
  }
  return toBase64Url(JSON.stringify(out));
}

/**
 * The raw picks back out of `encodeDesign`'s string, NOT yet checked against
 * a catalogue — pass the result through `sanitizePicks` once the home is
 * known. Null for anything that does not decode to an object with a home.
 */
export function decodeDesign(encoded: string | null | undefined): Partial<Record<keyof DesignPicks, unknown>> | null {
  if (!encoded || encoded.length > 2000 || !/^[A-Za-z0-9_-]+$/.test(encoded)) return null;
  let obj: unknown;
  try {
    obj = JSON.parse(fromBase64Url(encoded));
  } catch {
    return null;
  }
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
  const src = obj as Record<string, unknown>;
  const raw: Partial<Record<keyof DesignPicks, unknown>> = {};
  for (const [k, short] of KEYS) if (short in src) raw[k] = src[short];
  return str(raw.home) ? raw : null;
}

// ---------- the drawing ----------

/** What the picture is drawn in: the picks, with the board's first colour standing in until one is chosen. */
export function choicesFromPicks(catalog: ExteriorCatalog, picks: DesignPicks): ExteriorChoices {
  const pick = (list: Swatch[], want: string): Swatch => list.find((s) => s.label === want) || list[0];
  return {
    siding: pick(catalog.siding, picks.siding),
    shingles: pick(catalog.shingles, picks.shingle),
    trim: picks.trim,
    shutter: pick(catalog.shutters, picks.shutter || "Black"),
    gableAccent: picks.gableAccent ? pick(catalog.gableAccents, picks.gableAccent) : null,
    foundation: picks.foundation,
    addonPorch: picks.addonPorch,
    door: picks.door,
    blackPackage: picks.blackPackage,
    windowGrids: catalog.windowGrids,
    features: mergeFeatures(picks.dormer, picks.elevation),
    addedDoors: picks.extraDoors.filter((d): d is AddedDoor => d === "patio" || d === "atrium"),
  };
}

/** Where an end-wall option landed on this plan, for captions and the lead message. */
export function endWhere(elevation: PlanElevation, addonPorch: boolean): string {
  const end = featureEnd(elevation, addonPorch);
  return end ? ` (shown on the ${end} end)` : " (not drawn: this plan has no end-wall window for it; it stays on your quote)";
}

// ---------- the readable list ----------

export interface DesignHome {
  slug: string;
  name: string;
  series: string;
  homeType: string;
}

/**
 * The design as "Label: value" lines, in the order the designer asks.
 *
 * `audience: "sales"` is the lead message (it says which sheet the picture
 * was drawn from); `"buyer"` is the copy the buyer gets, which leaves that
 * out and keeps only what they chose.
 */
export function designLines(args: {
  home: DesignHome | undefined;
  catalog: ExteriorCatalog;
  picks: DesignPicks;
  elevation: PlanElevation | null;
  audience: "sales" | "buyer";
}): string[] {
  const { home, catalog, picks, elevation, audience } = args;
  const isPrime = catalog.series === "prime";
  const choices = choicesFromPicks(catalog, picks);
  const slots = elevation ? addedDoorSlots(elevation, choices.addedDoors) : {};
  const doorLabel = catalog.doors.find((d) => d.id === picks.door)?.label;
  const dormerLabel = catalog.dormers.find((d) => d.id === picks.dormer)?.label;
  const elevationLabel = catalog.elevations.find((d) => d.id === picks.elevation)?.label;
  const extraDoorLabels = picks.extraDoors.map((doorId) => {
    const name = catalog.extraDoors.find((d) => d.id === doorId)?.label || doorId;
    const slot = slots[doorId as AddedDoor];
    return slot ? `${name} (shown on the ${slot.view} wall; placement to confirm)` : name;
  });
  const endNote = choices.features.end && elevation ? endWhere(elevation, picks.addonPorch) : "";
  const lines = [
    `Home: ${home ? `${home.name}${home.series ? ` (${home.series} Series, ${home.homeType})` : ""}` : picks.home}`,
    picks.bedroomLayout && `Bedroom layout: ${picks.bedroomLayout}`,
    picks.kitchen && `Kitchen: ${picks.kitchen}`,
    picks.primaryBath && `Primary bath: ${picks.primaryBath}`,
    picks.siding && `Siding color: ${picks.siding}${isPrime ? " (Prime)" : ""}`,
    picks.shingle && `Shingle color: ${picks.shingle}`,
    picks.blackPackage
      ? "Black Exterior package (black soffit, fascia, drip edge, lineals; Black Craftsman door; non-gridded windows)"
      : picks.trim === "lineals"
        ? "Window trim: lineals (no shutters)"
        : picks.shutter && `Shutter color: ${picks.shutter}`,
    !picks.blackPackage && picks.door !== "6-panel" && doorLabel && `Front door: ${doorLabel}`,
    extraDoorLabels.length > 0 && `Add: ${extraDoorLabels.join(", ")}`,
    picks.gableAccent && `Gable shake accent: ${picks.gableAccent}`,
    dormerLabel && `Dormer: ${dormerLabel} (shown over the entry; placement to confirm)`,
    elevationLabel && `Elevation option: ${elevationLabel}${endNote}`,
    picks.addonPorch && "Add Champion's optional porch",
    `Foundation shown: ${picks.foundation === "block" ? "block perimeter wall" : "vinyl skirting"}`,
    audience === "sales" &&
      elevation &&
      `Exterior preview: ${
        elevation.src !== "sheet"
          ? "representative layout (no sheet on file)"
          : elevation.basedOn
            ? `drawn from the ${elevation.basedOn} sheet (base plan of this reverse-aisle model, not mirrored)`
            : `drawn from sales sheet ${elevation.model || ""}`
      }`,
    picks.cabinet && `Cabinet finish: ${picks.cabinet}`,
    picks.flooring && `Flooring: ${picks.flooring}`,
    picks.countertop && `Countertop: ${picks.countertop}`,
    picks.upgrades.length > 0 && `Upgrades: ${picks.upgrades.join(", ")}`,
  ];
  return lines.filter((l): l is string => typeof l === "string" && l.length > 0);
}

// ---------- the gate ----------

/** The lead answers a design copy needs before it may be sent. */
export interface DesignCopyContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  financingStatus: string;
  landStatus: string;
  timeframe: string;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** US numbers only: 10 digits, or 11 starting with 1. Null when it is not one. */
export function toE164(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

/**
 * What is still missing before a copy can be sent, as the field names the
 * designer shows. Empty means every lead question is answered: name, email,
 * phone, cash or finance, land or community, and time frame.
 */
export function missingForCopy(c: Partial<DesignCopyContact>): string[] {
  const missing: string[] = [];
  if (!str(c.firstName)) missing.push("first name");
  if (!str(c.lastName)) missing.push("last name");
  if (!EMAIL_RE.test(str(c.email, 200))) missing.push("email");
  if (!toE164(str(c.phone, 40))) missing.push("phone");
  if (!str(c.financingStatus)) missing.push("cash or financing");
  if (!str(c.landStatus)) missing.push("land or community");
  if (!str(c.timeframe)) missing.push("time frame");
  return missing;
}

/** How the buyer asked to get their copy. SMS also needs their consent box ticked. */
export interface DesignCopyRequest {
  email: boolean;
  sms: boolean;
}

/**
 * The words beside the text-message checkbox. The checkbox is the consent:
 * one message with the design the buyer asked for, sent because they asked.
 * Kept here so the form and any test read the same sentence.
 */
export const SMS_CONSENT_TEXT =
  "Text my design to the phone number above. By checking this box I agree to receive this text message from Factory Direct Homes Center. Message and data rates may apply. Reply STOP to opt out. Consent is not a condition of purchase.";
