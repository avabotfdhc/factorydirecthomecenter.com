"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAntiSpam } from "@/lib/use-anti-spam";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { trackGA4Event, trackLeadFormStart, trackLeadFormError, trackLeadFormSubmit } from "@/lib/analytics";
import { ShowroomVisitButton } from "@/components/QuoteModal";
import { CurrentHome } from "@/lib/current-home";
import type { DesignerSource } from "@/lib/designer-link";
import { DoorSwatch, HomeElevation, type DoorStyle, type ExteriorChoices } from "@/components/HomeElevation";
import { exteriorCatalog, swatchLabel, type ExteriorCatalog, type Swatch } from "@/lib/exterior-options";
import { addedDoorSlots, featureFor, viewForFeature, type AddedDoor } from "@/lib/exterior-features";
import {
  BEDROOM_LAYOUTS,
  KITCHENS,
  LAND_OPTIONS,
  PAYMENT_OPTIONS,
  PRIMARY_BATHS,
  SMS_CONSENT_TEXT,
  TIMEFRAME_OPTIONS,
  UPGRADES,
  choicesFromPicks,
  designLines,
  encodeDesign,
  endWhere,
  type DesignPicks,
} from "@/lib/design-summary";
import type { PlanElevation, ViewName } from "@/lib/plan-elevation-types";

// A lightweight "design your home" configurator. It does NOT price anything or
// claim an exact build — it captures a buyer's preferences (home, floor-plan
// variations, colors, options) plus qualifying answers (cash/finance, land,
// timeframe) and submits them as one rich lead through /api/leads, so the sales
// team gets a warm, specific starting point for a line-item quote. Colors and
// options are shown as preferences; the team confirms exact Champion
// availability per model.
//
// What may be picked comes from src/lib/exterior-options.ts, by series and
// section type: Aspire (Topeka) homes get the 2026 Aspire board, the Perfect
// Options doors and packages, and the dormer and elevation sheets for their
// section type; Prime (Decatur) homes get only Prime's own colours and no
// upgrades. Switching homes drops any pick the new home's catalogue does not
// offer.
//
// The exterior picture: once a home is chosen, the designer fetches that
// plan's elevation from /api/plan-elevation (window and door placement read
// off Champion's sales sheet, src/lib/plan-elevations.json) and HomeElevation
// redraws it in the chosen siding, shingles, trim, door and foundation as the
// buyer clicks. It is an illustration, labelled as one, and when a plan's
// sheet could not be read the fallback is a representative layout that says
// so. Dormers, bump-outs, bays and added doors are drawn too, from the specs
// in src/lib/exterior-features.ts, at the place Champion's sheet shows them
// (over the entry, on the end with the window, on the rear wall); the plant
// sets the real placement at order and the caption says so. Picking one
// switches the preview to the view that shows it.
//
// Funnel: every step fires a GA4 `designer_step` event (plan chosen, each
// exterior or interior pick, view change) so the path from plan to quote can
// be read in Analytics alongside the existing lead_form_* events. `source`
// (the `src` query param, src/lib/designer-link.ts) rides on plan_selected so
// a design that started from a plan page's teaser can be told from one that
// started in the header.
//
// Getting to the quote: the contact section is step 6, so once a home is
// chosen a slim bar at the bottom of the viewport ("Get my line-item quote")
// and a button under the desktop preview both jump to it. The bar hides
// while the contact section is on screen and after submit; on a phone it
// sits above the site's mobile action bar (--mobile-bar-h) rather than over it.
//
// Full screen: "Open full screen" above step 1, or a click on the picture,
// lays the whole designer over the page (above the header, the mobile bar and
// the chat, below the consent banner and the lot-visit dialog) with a Close
// button. Escape and the browser's Back button close it too. It is the same
// form in a different frame, so nothing the buyer picked is lost either way.
//
// A copy of the design: step 6 offers to email and/or text the buyer their
// design (picture, floor plan, every pick, and the dealership's details).
// /api/leads sends it with the lead (src/lib/design-summary-send.ts), and
// only once every lead question is answered: name, email, phone, cash or
// finance, land or community, and time frame. The text needs its own consent
// box (SMS_CONSENT_TEXT), never pre-ticked.

export interface DesignerPlan {
  slug: string;
  name: string;
  series: string;
  homeType: string;
  modelNumber?: string;
  lengthFt?: number;
  widthFt?: number;
  beds?: number;
}

const field =
  "w-full px-4 py-3 border border-[var(--color-charcoal)]/10 rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors bg-white";
const legendCls = "font-serif text-2xl font-light mb-1";
const sectionCls = "bg-white border border-[var(--color-charcoal)]/8 rounded-2xl p-6 lg:p-8";
const chip = (on: boolean) =>
  `px-3 py-1.5 rounded-full border text-sm transition-colors ${
    on ? "border-[var(--color-teal)] bg-[var(--color-teal)]/8 font-semibold" : "border-[var(--color-charcoal)]/15 hover:border-[var(--color-teal)]/40"
  }`;

function step(name: string, params: Record<string, string | number | boolean | undefined>) {
  trackGA4Event("designer_step", { step: name, ...params });
}

function SwatchPicker({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: Swatch[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={name}>
      {options.map((o) => {
        const selected = value === o.label;
        return (
          <button
            type="button"
            key={o.label}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.label)}
            className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border text-sm transition-colors ${
              selected
                ? "border-[var(--color-teal)] bg-[var(--color-teal)]/8 font-semibold"
                : "border-[var(--color-charcoal)]/15 hover:border-[var(--color-teal)]/40"
            }`}
          >
            <span
              className="w-6 h-6 rounded-full border border-black/10 flex-shrink-0"
              style={{ backgroundColor: o.hex }}
              aria-hidden="true"
            />
            {swatchLabel(o)}
          </button>
        );
      })}
    </div>
  );
}

function ChipGroup<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
      {options.map((o) => (
        <button type="button" key={o.value} role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)} className={chip(value === o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Door styles as picture chips, so a buyer sees the 9-lite or Craftsman look before choosing it. */
function DoorPicker({ options, value, grids, onChange }: { options: { id: string; label: string; standard?: boolean }[]; value: DoorStyle; grids: boolean; onChange: (v: DoorStyle) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Front door">
      {options.map((o) => {
        const selected = value === o.id;
        return (
          <button
            type="button"
            key={o.id}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.id as DoorStyle)}
            className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl border text-sm text-left transition-colors ${
              selected ? "border-[var(--color-teal)] bg-[var(--color-teal)]/8 font-semibold" : "border-[var(--color-charcoal)]/15 hover:border-[var(--color-teal)]/40"
            }`}
          >
            <DoorSwatch style={o.id as DoorStyle} grids={grids} className="rounded-md border border-black/10 flex-shrink-0" />
            <span>
              {o.label}
              {o.standard && <span className="block text-xs font-normal text-[var(--color-gray)]">standard</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const VIEWS: { key: ViewName; label: string }[] = [
  { key: "front", label: "Front" },
  { key: "rear", label: "Rear" },
  { key: "left", label: "Left end" },
  { key: "right", label: "Right end" },
];

function previewCaption(home: DesignerPlan, elevation: PlanElevation, choices: ExteriorChoices, catalog: ExteriorCatalog, picks: { dormer: string; elevation: string }): ReactNode {
  const { features, addedDoors } = choices;
  const slots = addedDoorSlots(elevation, addedDoors);
  const summary = [
    `${choices.siding.label} siding`,
    `${choices.shingles.label} shingles`,
    choices.blackPackage ? "Black Exterior package" : choices.trim === "lineals" ? "lineals" : `${choices.shutter.label} shutters`,
    !choices.blackPackage && choices.door !== "6-panel" ? `${catalog.doors.find((d) => d.id === choices.door)?.label || choices.door} door` : null,
    choices.gableAccent ? `${choices.gableAccent.label} gables` : null,
    picks.dormer ? catalog.dormers.find((d) => d.id === picks.dormer)?.label : null,
    picks.elevation ? `${catalog.elevations.find((d) => d.id === picks.elevation)?.label}${features.end ? endWhere(elevation, choices.addonPorch) : ""}` : null,
    ...addedDoors.map((d) => `${d} door${slots[d] ? ` on the ${slots[d]!.view} wall` : ""}`),
    choices.foundation === "block" ? "block foundation" : "vinyl skirting",
  ].filter(Boolean).join(" · ");
  const placed = features.dormer || features.bumpOut || features.end || addedDoors.length > 0;
  return (
    <>
      <strong className="font-semibold">{home.name}</strong>
      {elevation.sqft ? ` · ${elevation.sqft.toLocaleString("en-US")} sq ft` : ""} · {summary}.{" "}
      {elevation.src !== "sheet"
        ? "Representative layout — we don't have this model's drawing on file, so window placement is typical for a home this size, not exact."
        : elevation.basedOn
          ? `Window and door placement follows Champion's sheet for the base plan (model ${elevation.basedOn}); this Reverse Aisle layout is its mirror image, so the door side and ends may be reversed.`
          : "Window and door placement follows Champion's floor plan sheet for this model."}{" "}
      {placed ? "Dormer, bay and added-door placement is drawn where Champion's option sheet shows it; the plant sets the final position at order. " : ""}
      Artist&rsquo;s illustration; colors are approximate, and porch, steps, foundation and landscaping are site-built and shown for illustration only.
    </>
  );
}

interface PreviewProps {
  home?: DesignerPlan;
  elevation: PlanElevation | null;
  state: "idle" | "loading" | "ready" | "none";
  choices: ExteriorChoices;
  catalog: ExteriorCatalog;
  /** the dormer and elevation option ids, for the caption */
  picks: { dormer: string; elevation: string };
  view: ViewName;
  onView: (v: ViewName) => void;
  onQuote: () => void;
  /** the designer is laid over the page (its own header sits above this) */
  full: boolean;
  /** open the designer full screen; a click on the picture does this */
  onExpand: () => void;
}

/**
 * The picture and its view tabs. A grid item that comes first on a phone and
 * sticks under the header there while the swatches scroll past; on desktop
 * the column sits beside the swatches and sticks as a whole. The caption is
 * part of this block on desktop and rendered separately below the swatches
 * on a phone (ElevationCaption), so the stuck block stays short.
 */
function ElevationPreview({ home, elevation, state, choices, catalog, picks, view, onView, onQuote, full, onExpand }: PreviewProps) {
  const frame = "rounded-xl border border-[var(--color-charcoal)]/10 bg-[#eaf1f5] overflow-hidden";
  // under the site header normally; under the full-screen bar when laid over the page
  const column = `order-first lg:order-none sticky ${full ? "top-[57px] lg:top-[72px]" : "top-[72px] lg:top-24"} self-start z-10 bg-white lg:bg-transparent space-y-3`;
  if (!home || state === "idle") {
    return (
      <div className={`${column} ${frame} flex items-center justify-center min-h-[120px] lg:min-h-[220px] p-6 text-center text-sm text-[var(--color-gray)]`}>
        Choose a floor plan above and your home appears here in the colors you pick.
      </div>
    );
  }
  if (state === "loading") {
    return <div className={`${column} ${frame} min-h-[120px] lg:min-h-[220px] animate-pulse`} aria-busy="true" aria-label="Loading the exterior preview" />;
  }
  if (!elevation) {
    return (
      <div className={`${column} ${frame} flex items-center justify-center min-h-[120px] lg:min-h-[220px] p-6 text-center text-sm text-[var(--color-gray)]`}>
        We don&rsquo;t have an exterior drawing for the {home.name} yet — your color choices are still saved with your design.
      </div>
    );
  }
  return (
    <div className={column}>
      {full ? (
        <div className={frame}>
          <HomeElevation plan={elevation} choices={choices} view={view} id={`dyh-${home.slug}`} />
        </div>
      ) : (
        <button type="button" onClick={onExpand} aria-label="Open the designer full screen" className={`${frame} relative block w-full cursor-zoom-in group`}>
          <HomeElevation plan={elevation} choices={choices} view={view} id={`dyh-${home.slug}`} />
          <span className="absolute top-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-charcoal)] shadow-sm group-hover:bg-white">
            <ExpandIcon />
            Full screen
          </span>
        </button>
      )}
      <div className="flex flex-wrap items-center gap-1.5 lg:gap-2 pb-2 lg:pb-0" role="tablist" aria-label="Elevation view">
        {VIEWS.map((v) => (
          <button
            type="button"
            key={v.key}
            role="tab"
            aria-selected={view === v.key}
            onClick={() => onView(v.key)}
            className={`px-2.5 lg:px-3 py-1.5 rounded-full border text-[11px] lg:text-xs font-semibold tracking-wide uppercase transition-colors ${
              view === v.key
                ? "border-[var(--color-teal)] bg-[var(--color-teal)] text-white"
                : "border-[var(--color-charcoal)]/15 hover:border-[var(--color-teal)]/40"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <p className="hidden lg:block text-xs text-[var(--color-charcoal)]/70 leading-relaxed">{previewCaption(home, elevation, choices, catalog, picks)}</p>
      {/* The desktop column is stuck beside the pickers all the way down, so
          the ask lives with the picture; on a phone the bottom bar does this. */}
      <button
        type="button"
        onClick={onQuote}
        className="hidden lg:inline-flex w-full items-center justify-center gap-2 bg-[var(--color-teal)] text-white px-5 py-3 text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
      >
        Get a quote for this design
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
    </div>
  );
}

function ExpandIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </svg>
  );
}

/**
 * The bottom-of-viewport ask once a home is chosen. Hidden while the contact
 * section is on screen (nothing to jump to) and after submit. Stacks above the
 * mobile action bar and the consent banner via the CSS variables they publish.
 */
function QuoteBar({ homeName, show, full, onClick }: { homeName: string; show: boolean; full: boolean; onClick: () => void }) {
  if (!show) return null;
  return (
    <div
      data-designer-quote-bar=""
      // full screen covers the mobile action bar, so the bar sits on the bottom edge
      style={{ bottom: full ? "var(--consent-h, 0px)" : "calc(var(--consent-h, 0px) + var(--mobile-bar-h, 0px))" }}
      className="fixed left-0 right-0 z-40 px-3 pb-2 pointer-events-none"
    >
      {/* below md the chat launcher sits at the right edge on the same line, so the bar stops short of it */}
      <div className={`pointer-events-auto ${full ? "" : "mr-[4.75rem]"} md:mx-auto max-w-3xl flex items-center justify-between gap-3 rounded-xl border border-[var(--color-teal)]/30 bg-white/95 backdrop-blur-md shadow-[0_10px_30px_-12px_rgba(0,0,0,.35)] px-4 py-2.5`}>
        <p className="hidden sm:block min-w-0 text-sm text-[var(--color-charcoal)] truncate">
          Your <span className="font-semibold">{homeName}</span> design is ready to price.
        </p>
        <button
          type="button"
          onClick={onClick}
          className="flex-1 sm:flex-none shrink-0 inline-flex items-center justify-center gap-2 bg-[var(--color-teal)] text-white px-4 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
        >
          Get my line-item quote
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>
    </div>
  );
}

/** The preview's caption for phones, where it follows the swatches instead of the stuck picture. */
function ElevationCaption({ home, elevation, choices, catalog, picks }: { home?: DesignerPlan; elevation: PlanElevation | null; choices: ExteriorChoices; catalog: ExteriorCatalog; picks: { dormer: string; elevation: string } }) {
  if (!home || !elevation) return null;
  return <p className="lg:hidden text-xs text-[var(--color-charcoal)]/70 leading-relaxed">{previewCaption(home, elevation, choices, catalog, picks)}</p>;
}

export function HomeDesigner({
  plans,
  initialHome,
  initialSiding,
  source,
  copyChannels = { email: false, sms: false },
}: {
  plans: DesignerPlan[];
  /** a plan slug to preselect (?home=) */
  initialHome?: string;
  /** a board label to start the siding on (?siding=), already checked against the plan's catalogue by the page */
  initialSiding?: string;
  /** which entry point sent the visitor (?src=), for the funnel events */
  source?: DesignerSource;
  /** the design copies this deployment can send; a channel that is off is not offered */
  copyChannels?: { email: boolean; sms: boolean };
}) {
  const [homeSlug, setHomeSlug] = useState(initialHome || "");
  const [bedroomLayout, setBedroomLayout] = useState("");
  const [kitchen, setKitchen] = useState("");
  const [primaryBath, setPrimaryBath] = useState("");
  // exterior picks are the board labels; hex comes from the series' catalogue
  const [siding, setSiding] = useState(initialSiding || "");
  const [shingle, setShingle] = useState("");
  const [shutter, setShutter] = useState("");
  const [trim, setTrim] = useState<"shutters" | "lineals">("shutters");
  const [gableAccent, setGableAccent] = useState("");
  const [door, setDoor] = useState<DoorStyle>("6-panel");
  const [extraDoors, setExtraDoors] = useState<string[]>([]);
  const [blackPackage, setBlackPackage] = useState(false);
  const [dormer, setDormer] = useState("");
  const [elevationOption, setElevationOption] = useState("");
  const [foundation, setFoundation] = useState<"block" | "skirting">("block");
  const [addonPorch, setAddonPorch] = useState(false);
  const [elevation, setElevation] = useState<PlanElevation | null>(null);
  const [elevationState, setElevationState] = useState<"idle" | "loading" | "ready" | "none">("idle");
  const [view, setView] = useState<ViewName>("front");
  const [cabinet, setCabinet] = useState("");
  const [flooring, setFlooring] = useState("");
  const [countertop, setCountertop] = useState("");
  const [upgrades, setUpgrades] = useState<string[]>([]);
  const [payment, setPayment] = useState("");
  const [land, setLand] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [started, setStarted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  // a copy of the design for the buyer: email on by default, text only by
  // its own consent box (never pre-ticked)
  const [copyEmail, setCopyEmail] = useState(copyChannels.email);
  const [copySms, setCopySms] = useState(false);
  const [copySent, setCopySent] = useState<{ email: string; sms: string; toEmail: string; toPhone: string } | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // Full screen: the same form, laid over the page. A history entry is pushed
  // so the phone's Back button closes it instead of leaving the page.
  const [full, setFull] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const openFull = (from: "button" | "picture") => {
    if (full) return;
    setFull(true);
    step("full_screen", { plan: homeSlug || undefined, from });
    try {
      window.history.pushState({ ...(window.history.state || {}), dyhFull: true }, "");
    } catch {
      /* a sandboxed frame can refuse; Close and Escape still work */
    }
  };
  const closeFull = () => {
    if (window.history.state?.dyhFull) window.history.back();
    else setFull(false);
  };
  useEffect(() => {
    if (!full) return;
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    const onPop = () => setFull(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || document.querySelector("[role='dialog'][aria-modal='true']:not([data-designer-full])")) return;
      if (window.history.state?.dyhFull) window.history.back();
      else setFull(false);
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = before;
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
    };
  }, [full]);
  // the contact section: the bottom bar hides while it is on screen, and the
  // "get a quote" buttons scroll to it
  const contactRef = useRef<HTMLFieldSetElement>(null);
  const [contactInView, setContactInView] = useState(false);
  useEffect(() => {
    const el = contactRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setContactInView(entry.isIntersecting), { rootMargin: "0px 0px -15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [submitted]);
  const goToQuote = (from: "bar" | "preview") => {
    step("cta_quote", { plan: selectedHome?.slug, from });
    const el = contactRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    const first = el.querySelector<HTMLInputElement>("input[name='firstName']");
    window.setTimeout(() => first?.focus({ preventScroll: true }), 450);
  };

  useEffect(() => {
    if (initialHome) setHomeSlug(initialHome);
  }, [initialHome]);

  const bySeries = useMemo(() => {
    const groups = new Map<string, DesignerPlan[]>();
    for (const p of plans) {
      const key = p.series || "Other";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(p);
    }
    for (const list of groups.values()) list.sort((a, b) => a.name.localeCompare(b.name));
    return [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [plans]);

  const selectedHome = plans.find((p) => p.slug === homeSlug);
  const catalog = useMemo(
    () => exteriorCatalog(selectedHome?.series, selectedHome?.homeType, selectedHome?.widthFt),
    [selectedHome?.series, selectedHome?.homeType, selectedHome?.widthFt],
  );
  const isPrime = catalog.series === "prime";

  // Fetch the chosen plan's elevation, and drop every pick the new home's
  // catalogue does not offer (a Prime home cannot keep Dublin siding).
  useEffect(() => {
    const has = (list: Swatch[], label: string) => list.some((s) => s.label === label);
    setSiding((v) => (has(catalog.siding, v) ? v : ""));
    setShingle((v) => (has(catalog.shingles, v) ? v : ""));
    setShutter((v) => (has(catalog.shutters, v) ? v : ""));
    setGableAccent((v) => (has(catalog.gableAccents, v) ? v : ""));
    setCabinet((v) => (has(catalog.interior.cabinets, v) ? v : ""));
    setFlooring((v) => (has(catalog.interior.flooring, v) ? v : ""));
    setCountertop((v) => (has(catalog.interior.countertops, v) ? v : ""));
    setTrim((v) => (catalog.lineals ? v : "shutters"));
    setDoor((v) => (catalog.doors.some((d) => d.id === v) ? v : "6-panel"));
    setExtraDoors((v) => v.filter((id) => catalog.extraDoors.some((d) => d.id === id)));
    setBlackPackage((v) => v && catalog.blackPackage);
    setDormer((v) => (catalog.dormers.some((d) => d.id === v) ? v : ""));
    setElevationOption((v) => (catalog.elevations.some((d) => d.id === v) ? v : ""));
    setUpgrades((v) => (catalog.upgrades ? v : []));
    if (!selectedHome) {
      setElevation(null);
      setElevationState("idle");
      return;
    }
    step("plan_selected", { plan: selectedHome.slug, model: selectedHome.modelNumber, series: catalog.series, section: catalog.section, source });
    const q = new URLSearchParams();
    if (selectedHome.modelNumber) q.set("model", selectedHome.modelNumber);
    if (selectedHome.lengthFt) q.set("length", String(selectedHome.lengthFt));
    if (selectedHome.widthFt) q.set("width", String(selectedHome.widthFt));
    if (selectedHome.beds) q.set("beds", String(selectedHome.beds));
    const ctrl = new AbortController();
    // the previous home's drawing and porch choice never carry over, whether
    // the new fetch succeeds, 404s or fails on the network
    setElevation(null);
    setAddonPorch(false);
    setView("front");
    setElevationState("loading");
    fetch(`/api/plan-elevation?${q.toString()}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: PlanElevation | null) => {
        setElevation(data);
        setElevationState(data ? "ready" : "none");
        step("preview_loaded", { plan: selectedHome.slug, source: data ? data.src : "none" });
      })
      .catch(() => {
        if (ctrl.signal.aborted) return;
        setElevation(null);
        setElevationState("none");
      });
    return () => ctrl.abort();
  }, [selectedHome, catalog, source]);

  // Every pick in one object: what the picture is drawn in (the board's first
  // colour standing in until they choose), what the lead message lists, and
  // what the buyer's emailed or texted copy is rebuilt from
  // (src/lib/design-summary.ts).
  const picks: DesignPicks = {
    home: homeSlug,
    bedroomLayout,
    kitchen,
    primaryBath,
    siding,
    shingle,
    shutter,
    trim,
    gableAccent,
    door,
    extraDoors,
    blackPackage,
    dormer,
    elevation: elevationOption,
    foundation,
    addonPorch,
    cabinet,
    flooring,
    countertop,
    upgrades,
    view,
  };
  const choices: ExteriorChoices = choicesFromPicks(catalog, picks);
  const { features, addedDoors } = choices;
  // where each added door landed, for the checkbox hint and the lead message
  const doorSlots = elevation ? addedDoorSlots(elevation, addedDoors) : {};

  // one place for every pick, so the GA4 funnel sees each of them
  const change = <T,>(setter: (v: T) => void, fieldName: string) => (v: T) => {
    setter(v);
    step("exterior_pick", { plan: selectedHome?.slug, field: fieldName, value: String(v) });
  };
  const changeView = (v: ViewName) => {
    setView(v);
    step("view", { plan: selectedHome?.slug, view: v });
  };
  // a dormer or bay pick also turns the preview to the side it is drawn on
  const pickFeature = (setter: (v: string) => void, fieldName: string, id: string) => {
    change(setter, fieldName)(id);
    const spec = featureFor(id);
    const v = spec && elevation ? viewForFeature(spec, elevation, addonPorch) : null;
    if (v) setView(v);
  };

  function toggleUpgrade(u: string) {
    setUpgrades((prev) => (prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]));
  }
  function toggleExtraDoor(id: string) {
    const adding = !extraDoors.includes(id);
    setExtraDoors((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    step("exterior_pick", { plan: selectedHome?.slug, field: "extra_door", value: id });
    if (adding && elevation && (id === "patio" || id === "atrium")) {
      const next = [...addedDoors, id as AddedDoor];
      const slot = addedDoorSlots(elevation, next)[id as AddedDoor];
      if (slot) setView(slot.view);
    }
  }

  function markStarted() {
    if (!started) {
      setStarted(true);
      trackLeadFormStart("home_designer");
    }
  }

  const antiSpam = useAntiSpam();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const firstName = (data.get("firstName") as string)?.trim() || "";
    const lastName = (data.get("lastName") as string)?.trim() || "";
    const email = (data.get("email") as string)?.trim() || "";
    const phone = (data.get("phone") as string)?.trim() || "";
    const deliveryState = (data.get("deliveryState") as string) || "";
    const notes = (data.get("notes") as string)?.trim() || "";

    const errs: string[] = [];
    if (!homeSlug) errs.push("Please choose a home to start designing.");
    if (!firstName) errs.push("First name is required.");
    if (!lastName) errs.push("Last name is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push("A valid email is required.");
    if (phone.replace(/\D/g, "").length < 10) errs.push("A valid phone number is required.");
    if (!payment) errs.push("Please tell us if you are paying cash or financing.");
    if (!land) errs.push("Please tell us if you have land or a lot in a community.");
    if (!timeframe) errs.push("Please choose your time frame.");
    setErrors(errs);
    if (errs.length) {
      trackLeadFormError("home_designer", errs);
      window.requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
      return;
    }

    // Pack every design choice into a readable summary for the sales team.
    const lines = [
      ...designLines({ home: selectedHome, catalog, picks, elevation, audience: "sales" }),
      payment && `Payment: ${payment}`,
      land && `Land status: ${land}`,
      timeframe && `Decision timeframe: ${timeframe}`,
      notes && `Notes: ${notes}`,
      (copyEmail || copySms) && `Asked for a copy of this design by: ${[copyEmail && "email", copySms && "text"].filter(Boolean).join(" and ")}`,
    ].filter(Boolean);
    const message = `Home Designer submission —\n${lines.join("\n")}`;

    setBusy(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...antiSpam.payload(),
          firstName,
          lastName,
          email,
          phone,
          interest: selectedHome?.name || "Custom home design",
          deliveryState,
          landStatus: land,
          timeframe,
          financingStatus: payment,
          message,
          source: "Home Designer",
          pageUrl: window.location.href,
          // the copy is always drawn from the front
          design: encodeDesign({ ...picks, view: "front" }),
          sendCopy: { email: copyEmail, sms: copySms },
          smsConsent: copySms,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const reply = (await res.json().catch(() => null)) as { designCopy?: { email?: string; sms?: string } } | null;
      trackLeadFormSubmit("home_designer", {
        id: `lead_${Date.now()}`,
        name: `${firstName} ${lastName}`,
        email,
        phone,
        interest: selectedHome?.name || "Custom home design",
        financingStatus: payment,
        landStatus: land,
        timeframe,
        value: 50000,
        currency: "USD",
      });
      step("submitted", { plan: selectedHome?.slug, series: catalog.series, preview: elevation?.src || "none" });
      if (copyEmail || copySms) {
        const sent = { email: reply?.designCopy?.email || "unknown", sms: reply?.designCopy?.sms || "unknown" };
        step("design_copy", { plan: selectedHome?.slug, email: copyEmail ? sent.email : "not-requested", sms: copySms ? sent.sms : "not-requested" });
        setCopySent({ ...sent, toEmail: email, toPhone: phone });
      }
      setSubmitted(true);
      if (full) shellRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors(["Something went wrong submitting your design — please try again or call (260) 308-1457."]);
      trackLeadFormError("home_designer", ["submission_failed"]);
    } finally {
      setBusy(false);
    }
  }

  // The frame: inline on the page, or laid over it in full screen with its
  // own bar and Close button. A plain function, not a component, so switching
  // frames never remounts the form and nothing picked is lost.
  const shell = (content: ReactNode) => (
    <div
      ref={shellRef}
      data-designer-full={full ? "" : undefined}
      role={full ? "dialog" : undefined}
      aria-modal={full ? true : undefined}
      aria-label={full ? "Design your home, full screen" : undefined}
      className={full ? "fixed inset-0 z-[55] overflow-y-auto overscroll-contain bg-[var(--color-cream)]" : undefined}
    >
      {full ? (
        <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--color-charcoal)]/10 bg-white/95 backdrop-blur-md px-4 py-3">
          <p className="min-w-0 truncate font-serif text-lg">
            {selectedHome ? (
              <>
                Designing the <strong className="font-semibold">{selectedHome.name}</strong>
              </>
            ) : (
              "Design your home"
            )}
          </p>
          <button
            type="button"
            onClick={closeFull}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-charcoal)]/15 bg-white px-3 py-1.5 text-xs font-bold tracking-widest uppercase hover:bg-[var(--color-charcoal)]/5 transition-colors"
          >
            Close
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden="true"><path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      ) : (
        !submitted && (
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => openFull("button")}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-teal)]/40 bg-white px-4 py-2 text-xs font-bold tracking-widest uppercase text-[var(--color-teal)] hover:bg-[var(--color-teal)]/8 transition-colors"
            >
              <ExpandIcon />
              Open full screen
            </button>
          </div>
        )
      )}
      <div className={full ? "max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8" : undefined}>{content}</div>
    </div>
  );

  const copyLine = (status: string, sentText: string, failedText: string) =>
    status === "not-requested" ? null : <li>{status === "sent" ? sentText : failedText}</li>;

  if (submitted) {
    return shell(
      <div className="max-w-2xl mx-auto text-center bg-[var(--color-lime)]/12 border border-[var(--color-lime)]/50 rounded-2xl p-10">
        <h2 className="font-serif text-3xl font-light mb-3">Your design is on its way! 🎉</h2>
        <p className="text-[var(--color-gray)] mb-6">
          Thanks{selectedHome ? ` for designing your ${selectedHome.name}` : ""}. Our team will review your
          selections and follow up — usually within one business day — with next steps and a line-item quote.
        </p>
        {copySent && (
          <ul className="text-sm font-medium mb-6 space-y-1">
            {copyLine(copySent.email, `We emailed a copy of your design to ${copySent.toEmail}.`, "We couldn\u2019t email your copy just now. Our team has your design and can send it with your quote.")}
            {copyLine(copySent.sms, `We texted a copy of your design to ${copySent.toPhone}.`, "We couldn\u2019t text your copy just now. Our team has your design and can send it with your quote.")}
          </ul>
        )}
        <p className="text-[var(--color-gray)] mb-6">
          Want to walk through one in person? Our Auburn lot has Champion model homes you can tour &mdash; book a time so someone is free to show you around.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <ShowroomVisitButton
            location="designer_success"
            label="Book a lot visit"
            className="bg-[var(--color-teal)] text-white px-6 py-3 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
          />
          <a href="tel:+12603081457" className="border-2 border-[var(--color-charcoal)]/15 px-6 py-3 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-charcoal)]/5 transition-colors">
            Call (260) 308-1457
          </a>
          <Link href="/floor-plans" className="border-2 border-[var(--color-charcoal)]/15 px-6 py-3 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-charcoal)]/5 transition-colors">
            Browse more homes
          </Link>
        </div>
      </div>,
    );
  }

  const sectionLabel = catalog.section === "single" ? "single-wide" : catalog.section === "modular" ? "modular" : "multi-section";

  return shell(
    <form onSubmit={handleSubmit} onChange={markStarted} className="space-y-6" noValidate>
      {antiSpam.fields}
      {errors.length > 0 && (
        <div ref={errorRef} role="alert" className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      )}

      {/* 1. Choose a home */}
      <fieldset className={sectionCls}>
        <legend className={legendCls}><span className="text-[var(--color-lime-dark)] font-bold">1.</span> Choose your home</legend>
        <p className="text-sm text-[var(--color-gray)] mb-4">Pick the floor plan you&rsquo;d like to start from — you can change your mind later.</p>
        <select aria-label="Choose a home" className={field} value={homeSlug} onChange={(e) => setHomeSlug(e.target.value)}>
          <option value="">Select a floor plan…</option>
          {bySeries.map(([series, list]) => (
            <optgroup key={series} label={`${series} Series`}>
              {list.map((p) => (
                <option key={p.slug} value={p.slug}>{p.name} — {p.homeType}</option>
              ))}
            </optgroup>
          ))}
        </select>
        {selectedHome && (
          <p className="mt-3 text-sm">
            Designing the <strong>{selectedHome.name}</strong>, a {catalog.seriesLabel} {sectionLabel} home.{" "}
            <Link href={`/floor-plans/${selectedHome.slug}`} target="_blank" className="text-[var(--color-teal)] underline underline-offset-4">
              View its details &amp; photos
            </Link>
          </p>
        )}
      </fieldset>

      {/* 2. Floor plan variations */}
      <fieldset className={sectionCls}>
        <legend className={legendCls}><span className="text-[var(--color-lime-dark)] font-bold">2.</span> Floor plan options</legend>
        <p className="text-sm text-[var(--color-gray)] mb-5">Champion offers factory layout options on many plans. Tell us your preference — we&rsquo;ll confirm what&rsquo;s available on your model.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <label className="block">
            <span className="block text-sm font-medium mb-2">Bedroom layout</span>
            <select className={field} value={bedroomLayout} onChange={(e) => setBedroomLayout(e.target.value)}>
              <option value="">As designed</option>
              {BEDROOM_LAYOUTS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-2">Kitchen</span>
            <select className={field} value={kitchen} onChange={(e) => setKitchen(e.target.value)}>
              <option value="">As designed</option>
              {KITCHENS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-2">Primary bath</span>
            <select className={field} value={primaryBath} onChange={(e) => setPrimaryBath(e.target.value)}>
              <option value="">As designed</option>
              {PRIMARY_BATHS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        </div>
      </fieldset>

      {/* 3. Colors & finishes — the chosen home's own Champion selections */}
      <fieldset className={sectionCls}>
        <legend className={legendCls}><span className="text-[var(--color-lime-dark)] font-bold">3.</span> Colors &amp; finishes</legend>
        <p className="text-sm text-[var(--color-gray)] mb-5">
          {isPrime
            ? "Champion's 2026 Prime selections — Prime is the value series, with its own color palette and a fixed feature set."
            : "Champion's 2026 Aspire selections — the actual colors you'll choose."}{" "}
          On-screen chips are a guide; confirm against physical samples.{" "}
          {!isPrime && (
            <>
              <Link href="/options" target="_blank" className="text-[var(--color-teal)] underline underline-offset-4">See the full color board</Link>.
            </>
          )}
        </p>
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-lime-dark)] mb-3">Exterior</p>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 lg:gap-8">
              <div className="space-y-4">
                <div><span className="block text-sm font-medium mb-2">Siding color</span><SwatchPicker name="Siding color" options={catalog.siding} value={siding} onChange={change(setSiding, "siding")} /></div>
                <div>
                  <span className="block text-sm font-medium mb-2">Shingles</span>
                  {catalog.shingles.length > 1 ? (
                    <SwatchPicker name="Shingles" options={catalog.shingles} value={shingle} onChange={change(setShingle, "shingles")} />
                  ) : (
                    <p className="text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: catalog.shingles[0].hex }} aria-hidden="true" />
                      {catalog.shingles[0].label} 3-tab shingles come standard on Prime.
                    </p>
                  )}
                </div>

                {catalog.blackPackage && (
                  <label className="flex items-start gap-3 cursor-pointer text-sm">
                    <input type="checkbox" checked={blackPackage} onChange={(e) => change(setBlackPackage, "black_package")(e.target.checked)} className="mt-1 w-4 h-4 accent-[var(--color-teal)]" />
                    <span>
                      <span className="font-medium">Black Exterior package</span>
                      <span className="block text-xs text-[var(--color-gray)]">Black soffit, fascia, drip edge and lineals, a Black Craftsman door, and windows without grids.</span>
                    </span>
                  </label>
                )}

                {!blackPackage && (
                  <div>
                    <span className="block text-sm font-medium mb-2">Window trim</span>
                    {catalog.lineals ? (
                      <div className="mb-3">
                        <ChipGroup
                          name="Window trim"
                          options={[{ value: "shutters", label: "Shutters" }, { value: "lineals", label: "Lineals (trim around windows and doors)" }]}
                          value={trim}
                          onChange={change(setTrim, "trim")}
                        />
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--color-gray)] mb-2">Prime homes come with shutters on the door side and hitch end.</p>
                    )}
                    {trim === "shutters" && <SwatchPicker name="Shutter color" options={catalog.shutters} value={shutter} onChange={change(setShutter, "shutters")} />}
                  </div>
                )}

                {catalog.doors.length > 1 && !blackPackage && (
                  <div>
                    <span className="block text-sm font-medium mb-2">Front door</span>
                    <DoorPicker options={catalog.doors} value={door} grids={catalog.windowGrids} onChange={change(setDoor, "door")} />
                  </div>
                )}
                {catalog.extraDoors.length > 0 && (
                  <div className="space-y-2">
                    {catalog.extraDoors.map((d) => {
                      const slot = elevation ? doorSlots[d.id as AddedDoor] : undefined;
                      const on = extraDoors.includes(d.id);
                      return (
                        <label key={d.id} className="flex items-center gap-3 cursor-pointer text-sm">
                          <input type="checkbox" checked={on} onChange={() => toggleExtraDoor(d.id)} className="w-4 h-4 accent-[var(--color-teal)]" />
                          <span>
                            Add a {d.label.toLowerCase()}{" "}
                            <span className="text-xs text-[var(--color-gray)]">
                              {on && slot ? `(shown on the ${slot.view} wall; placement set at order)` : "(placement set at order)"}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {catalog.gableAccents.length > 0 && (
                  <div>
                    <span className="block text-sm font-medium mb-2">Gable shake accent <span className="font-normal text-[var(--color-gray)]">(optional)</span></span>
                    <SwatchPicker name="Gable shake accent" options={catalog.gableAccents} value={gableAccent} onChange={(v) => change(setGableAccent, "gable_accent")(v === gableAccent ? "" : v)} />
                  </div>
                )}

                {(catalog.dormers.length > 0 || catalog.elevations.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {catalog.dormers.length > 0 && (
                      <label className="block">
                        <span className="block text-sm font-medium mb-2">Dormer</span>
                        <select className={field} value={dormer} onChange={(e) => pickFeature(setDormer, "dormer", e.target.value)}>
                          <option value="">None</option>
                          {catalog.dormers.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                        </select>
                      </label>
                    )}
                    {catalog.elevations.length > 0 && (
                      <label className="block">
                        <span className="block text-sm font-medium mb-2">Bay, bump-out or eyebrow</span>
                        <select className={field} value={elevationOption} onChange={(e) => pickFeature(setElevationOption, "elevation", e.target.value)}>
                          <option value="">None</option>
                          {catalog.elevations.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                        </select>
                      </label>
                    )}
                    <p className="sm:col-span-2 text-xs text-[var(--color-gray)] -mt-2">
                      Champion&rsquo;s {sectionLabel} elevation options, drawn on the preview where the factory sheet shows them
                      {features.end && elevation ? endWhere(elevation, addonPorch) : ""}. Sizes are nominal; the plant sets the final placement at order.
                    </p>
                  </div>
                )}

                <div>
                  <span className="block text-sm font-medium mb-2">Foundation shown in the picture</span>
                  <ChipGroup
                    name="Foundation"
                    options={[{ value: "block", label: "Block perimeter wall" }, { value: "skirting", label: "Vinyl skirting" }]}
                    value={foundation}
                    onChange={change(setFoundation, "foundation")}
                  />
                  <p className="text-xs text-[var(--color-gray)] mt-2">Foundation, steps and skirting are site work by your contractor, not part of the home.</p>
                </div>
                {elevation?.porch?.kind === "addon" && (
                  <label className="flex items-center gap-3 cursor-pointer text-sm">
                    <input type="checkbox" checked={addonPorch} onChange={(e) => change(setAddonPorch, "addon_porch")(e.target.checked)} className="w-4 h-4 accent-[var(--color-teal)]" />
                    Show Champion&rsquo;s optional {elevation.porch.len}&rsquo; porch on this plan
                  </label>
                )}
                <ElevationCaption home={selectedHome} elevation={elevation} choices={choices} catalog={catalog} picks={{ dormer, elevation: elevationOption }} />
              </div>

              <ElevationPreview
                home={selectedHome}
                elevation={elevation}
                state={elevationState}
                choices={choices}
                catalog={catalog}
                picks={{ dormer, elevation: elevationOption }}
                view={view}
                onView={changeView}
                onQuote={() => goToQuote("preview")}
                full={full}
                onExpand={() => openFull("picture")}
              />
            </div>
          </div>
          <div className="border-t border-[var(--color-charcoal)]/8 pt-6">
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-lime-dark)] mb-3">Interior</p>
            <div className="space-y-4">
              <div><span className="block text-sm font-medium mb-2">Cabinet finish</span><SwatchPicker name="Cabinet finish" options={catalog.interior.cabinets} value={cabinet} onChange={change(setCabinet, "cabinets")} /></div>
              <div><span className="block text-sm font-medium mb-2">Vinyl flooring</span><SwatchPicker name="Vinyl flooring" options={catalog.interior.flooring} value={flooring} onChange={change(setFlooring, "flooring")} /></div>
              <div><span className="block text-sm font-medium mb-2">Countertop</span><SwatchPicker name="Countertop" options={catalog.interior.countertops} value={countertop} onChange={change(setCountertop, "countertop")} /></div>
            </div>
          </div>
        </div>
      </fieldset>

      {/* 4. Upgrades (Aspire); Prime has a fixed feature set */}
      <fieldset className={sectionCls}>
        <legend className={legendCls}><span className="text-[var(--color-lime-dark)] font-bold">4.</span> Popular upgrades</legend>
        {catalog.upgrades ? (
          <>
            <p className="text-sm text-[var(--color-gray)] mb-5">Check anything you&rsquo;d like included in your quote.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {UPGRADES.map((u) => (
                <label key={u} className="flex items-center gap-3 cursor-pointer text-sm">
                  <input type="checkbox" checked={upgrades.includes(u)} onChange={() => toggleUpgrade(u)} className="w-4 h-4 accent-[var(--color-teal)]" />
                  {u}
                </label>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-[var(--color-gray)]">
            Prime is Champion&rsquo;s value series: a fixed set of standard features at a lower price point, with the colors above and
            few optional upgrades. Tell us in the notes if there is something specific you want, and we&rsquo;ll check what Champion offers.
          </p>
        )}
      </fieldset>

      {/* 5. Qualifying — all three required, for the quote and for a copy of the design */}
      <fieldset className={sectionCls}>
        <legend className={legendCls}><span className="text-[var(--color-lime-dark)] font-bold">5.</span> A few quick questions</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <label className="block">
            <span className="block text-sm font-medium mb-2">Paying cash or financing? <span className="text-red-500" aria-hidden="true">*</span></span>
            <select className={field} value={payment} onChange={(e) => setPayment(e.target.value)} required aria-required="true">
              <option value="">Select…</option>
              {PAYMENT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-2">Your land, or a lot in a community? <span className="text-red-500" aria-hidden="true">*</span></span>
            <select className={field} value={land} onChange={(e) => setLand(e.target.value)} required aria-required="true">
              <option value="">Select…</option>
              {LAND_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-2">Decision timeframe <span className="text-red-500" aria-hidden="true">*</span></span>
            <select className={field} value={timeframe} onChange={(e) => setTimeframe(e.target.value)} required aria-required="true">
              <option value="">Select…</option>
              {TIMEFRAME_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        </div>
      </fieldset>

      {/* 6. Contact */}
      <fieldset ref={contactRef} id="design-quote" className={`${sectionCls} scroll-mt-24`}>
        <legend className={legendCls}><span className="text-[var(--color-lime-dark)] font-bold">6.</span> Where should we send your quote?</legend>
        <p className="text-sm text-[var(--color-gray)] mb-4">
          Your design goes to our Auburn, Indiana showroom and we price it line by line &mdash; the home, the options you picked and delivery. No obligation, and we don&rsquo;t pull credit.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="block"><span className="block text-sm font-medium mb-2">First name <span className="text-red-500" aria-hidden="true">*</span></span><input name="firstName" className={field} /></label>
          <label className="block"><span className="block text-sm font-medium mb-2">Last name <span className="text-red-500" aria-hidden="true">*</span></span><input name="lastName" className={field} /></label>
          <label className="block"><span className="block text-sm font-medium mb-2">Email <span className="text-red-500" aria-hidden="true">*</span></span><input type="email" name="email" className={field} /></label>
          <label className="block"><span className="block text-sm font-medium mb-2">Phone <span className="text-red-500" aria-hidden="true">*</span></span><input type="tel" name="phone" className={field} /></label>
          <label className="block">
            <span className="block text-sm font-medium mb-2">Delivery state</span>
            <select name="deliveryState" className={field}>
              <option value="">Select…</option>
              <option>Indiana</option>
              <option>Ohio</option>
              <option>Michigan</option>
            </select>
          </label>
          <label className="block sm:col-span-2"><span className="block text-sm font-medium mb-2">Anything else we should know?</span><textarea name="notes" rows={3} className={`${field} resize-none`} /></label>
        </div>

        {/* A copy of the design for the buyer, sent with the lead once every
            question above is answered (src/lib/design-summary-send.ts). */}
        {(copyChannels.email || copyChannels.sms) && (
        <div className="mt-6 rounded-xl border border-[var(--color-teal)]/25 bg-[var(--color-teal)]/[0.04] p-5">
          <p className="font-serif text-lg font-light mb-1">Send me a copy of my design</p>
          <p className="text-xs text-[var(--color-gray)] mb-4">
            The picture of your home, its floor plan and every choice you made, with our address and phone number. Sent when you submit,
            once every question above is answered.
          </p>
          <div className="space-y-3">
            {copyChannels.email && (
            <label className="flex items-start gap-3 cursor-pointer text-sm">
              <input type="checkbox" checked={copyEmail} onChange={(e) => setCopyEmail(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[var(--color-teal)]" />
              <span className="font-medium">Email my design to the email address above.</span>
            </label>
            )}
            {copyChannels.sms && (
            <label className="flex items-start gap-3 cursor-pointer text-sm">
              <input type="checkbox" checked={copySms} onChange={(e) => setCopySms(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[var(--color-teal)]" />
              <span>
                <span className="font-medium">{SMS_CONSENT_TEXT.split(". ")[0]}.</span>{" "}
                <span className="text-xs text-[var(--color-gray)]">{SMS_CONSENT_TEXT.split(". ").slice(1).join(". ")}</span>
              </span>
            </label>
            )}
          </div>
        </div>
        )}
      </fieldset>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <button type="submit" disabled={busy} className="w-full sm:w-auto bg-[var(--color-teal)] text-white px-10 py-4 text-sm font-bold tracking-widest uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors disabled:opacity-60">
          {busy ? "Submitting…" : copyEmail || copySms ? "Submit & Send My Design" : "Submit My Design"}
        </button>
        <p className="text-xs text-[var(--color-gray)]">No obligation. We&rsquo;ll follow up with a line-item quote — you see exactly what you pay for.</p>
      </div>

      {/* The layout's mobile bar quotes "this home" once one is chosen. */}
      {selectedHome && <CurrentHome name={selectedHome.name} series={selectedHome.series} />}
      <QuoteBar
        homeName={selectedHome?.name || ""}
        show={Boolean(selectedHome) && elevationState !== "loading" && !contactInView}
        full={full}
        onClick={() => goToQuote("bar")}
      />
    </form>,
  );
}
