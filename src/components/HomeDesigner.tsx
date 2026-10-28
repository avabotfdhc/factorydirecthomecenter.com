"use client";

import { useEffect, useMemo, useState } from "react";
import { useAntiSpam } from "@/lib/use-anti-spam";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { trackGA4Event, trackLeadFormStart, trackLeadFormError, trackLeadFormSubmit } from "@/lib/analytics";
import { HomeElevation, type DoorStyle, type ExteriorChoices } from "@/components/HomeElevation";
import { exteriorCatalog, swatchLabel, type ExteriorCatalog, type Swatch } from "@/lib/exterior-options";
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
// so. Dormers, bays and added doors are quote preferences and are not drawn.
//
// Funnel: every step fires a GA4 `designer_step` event (plan chosen, each
// exterior or interior pick, view change) so the path from plan to quote can
// be read in Analytics alongside the existing lead_form_* events.

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

// General upgrades on the Aspire quote checklist. Exterior items that now
// have their own picker (porch, dormer, doors) are not repeated here.
const UPGRADES = [
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
];

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

const VIEWS: { key: ViewName; label: string }[] = [
  { key: "front", label: "Front" },
  { key: "rear", label: "Rear" },
  { key: "left", label: "Left end" },
  { key: "right", label: "Right end" },
];

function previewCaption(home: DesignerPlan, elevation: PlanElevation, choices: ExteriorChoices, catalog: ExteriorCatalog): ReactNode {
  const summary = [
    `${choices.siding.label} siding`,
    `${choices.shingles.label} shingles`,
    choices.blackPackage ? "Black Exterior package" : choices.trim === "lineals" ? "lineals" : `${choices.shutter.label} shutters`,
    !choices.blackPackage && choices.door !== "6-panel" ? `${catalog.doors.find((d) => d.id === choices.door)?.label || choices.door} door` : null,
    choices.gableAccent ? `${choices.gableAccent.label} gables` : null,
    choices.foundation === "block" ? "block foundation" : "vinyl skirting",
  ].filter(Boolean).join(" · ");
  return (
    <>
      <strong className="font-semibold">{home.name}</strong>
      {elevation.sqft ? ` · ${elevation.sqft.toLocaleString("en-US")} sq ft` : ""} · {summary}.{" "}
      {elevation.src !== "sheet"
        ? "Representative layout — we don't have this model's drawing on file, so window placement is typical for a home this size, not exact."
        : elevation.basedOn
          ? `Window and door placement follows Champion's sheet for the base plan (model ${elevation.basedOn}); this Reverse Aisle layout is its mirror image, so the door side and ends may be reversed.`
          : "Window and door placement follows Champion's floor plan sheet for this model."}{" "}
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
  view: ViewName;
  onView: (v: ViewName) => void;
}

/**
 * The picture and its view tabs. A grid item that comes first on a phone and
 * sticks under the header there while the swatches scroll past; on desktop
 * the column sits beside the swatches and sticks as a whole. The caption is
 * part of this block on desktop and rendered separately below the swatches
 * on a phone (ElevationCaption), so the stuck block stays short.
 */
function ElevationPreview({ home, elevation, state, choices, catalog, view, onView }: PreviewProps) {
  const frame = "rounded-xl border border-[var(--color-charcoal)]/10 bg-[#eaf1f5] overflow-hidden";
  const column = "order-first lg:order-none sticky top-[72px] lg:top-24 self-start z-10 bg-white lg:bg-transparent space-y-3";
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
      <div className={frame}>
        <HomeElevation plan={elevation} choices={choices} view={view} id={`dyh-${home.slug}`} />
      </div>
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
      <p className="hidden lg:block text-xs text-[var(--color-charcoal)]/70 leading-relaxed">{previewCaption(home, elevation, choices, catalog)}</p>
    </div>
  );
}

/** The preview's caption for phones, where it follows the swatches instead of the stuck picture. */
function ElevationCaption({ home, elevation, choices, catalog }: { home?: DesignerPlan; elevation: PlanElevation | null; choices: ExteriorChoices; catalog: ExteriorCatalog }) {
  if (!home || !elevation) return null;
  return <p className="lg:hidden text-xs text-[var(--color-charcoal)]/70 leading-relaxed">{previewCaption(home, elevation, choices, catalog)}</p>;
}

export function HomeDesigner({ plans, initialHome }: { plans: DesignerPlan[]; initialHome?: string }) {
  const [homeSlug, setHomeSlug] = useState(initialHome || "");
  const [bedroomLayout, setBedroomLayout] = useState("");
  const [kitchen, setKitchen] = useState("");
  const [primaryBath, setPrimaryBath] = useState("");
  // exterior picks are the board labels; hex comes from the series' catalogue
  const [siding, setSiding] = useState("");
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
    step("plan_selected", { plan: selectedHome.slug, model: selectedHome.modelNumber, series: catalog.series, section: catalog.section });
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
  }, [selectedHome, catalog]);

  // What the picture is drawn in: the buyer's picks, with the board's first
  // colour standing in until they choose.
  const pick = (list: Swatch[], label: string): Swatch => list.find((s) => s.label === label) || list[0];
  const choices: ExteriorChoices = {
    siding: pick(catalog.siding, siding),
    shingles: pick(catalog.shingles, shingle),
    trim,
    shutter: pick(catalog.shutters, shutter || "Black"),
    gableAccent: gableAccent ? pick(catalog.gableAccents, gableAccent) : null,
    foundation,
    addonPorch,
    door,
    blackPackage,
    windowGrids: catalog.windowGrids,
  };

  // one place for every pick, so the GA4 funnel sees each of them
  const change = <T,>(setter: (v: T) => void, fieldName: string) => (v: T) => {
    setter(v);
    step("exterior_pick", { plan: selectedHome?.slug, field: fieldName, value: String(v) });
  };
  const changeView = (v: ViewName) => {
    setView(v);
    step("view", { plan: selectedHome?.slug, view: v });
  };

  function toggleUpgrade(u: string) {
    setUpgrades((prev) => (prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]));
  }
  function toggleExtraDoor(id: string) {
    setExtraDoors((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    step("exterior_pick", { plan: selectedHome?.slug, field: "extra_door", value: id });
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
    setErrors(errs);
    if (errs.length) {
      trackLeadFormError("home_designer", errs);
      return;
    }

    const doorLabel = catalog.doors.find((d) => d.id === door)?.label;
    const dormerLabel = catalog.dormers.find((d) => d.id === dormer)?.label;
    const elevationLabel = catalog.elevations.find((d) => d.id === elevationOption)?.label;
    const extraDoorLabels = extraDoors.map((id) => catalog.extraDoors.find((d) => d.id === id)?.label || id);
    // Pack every design choice into a readable summary for the sales team.
    const lines = [
      `Home: ${selectedHome ? `${selectedHome.name}${selectedHome.series ? ` (${selectedHome.series} Series, ${selectedHome.homeType})` : ""}` : homeSlug}`,
      bedroomLayout && `Bedroom layout: ${bedroomLayout}`,
      kitchen && `Kitchen: ${kitchen}`,
      primaryBath && `Primary bath: ${primaryBath}`,
      siding && `Siding color: ${siding}${isPrime ? " (Prime)" : ""}`,
      shingle && `Shingle color: ${shingle}`,
      blackPackage
        ? "Black Exterior package (black soffit, fascia, drip edge, lineals; Black Craftsman door; non-gridded windows)"
        : trim === "lineals"
          ? "Window trim: lineals (no shutters)"
          : shutter && `Shutter color: ${shutter}`,
      !blackPackage && door !== "6-panel" && doorLabel && `Front door: ${doorLabel}`,
      extraDoorLabels.length && `Add: ${extraDoorLabels.join(", ")}`,
      gableAccent && `Gable shake accent: ${gableAccent}`,
      dormerLabel && `Dormer: ${dormerLabel}`,
      elevationLabel && `Elevation option: ${elevationLabel}`,
      addonPorch && "Add Champion's optional porch",
      `Foundation shown: ${foundation === "block" ? "block perimeter wall" : "vinyl skirting"}`,
      elevation &&
        `Exterior preview: ${
          elevation.src !== "sheet"
            ? "representative layout (no sheet on file)"
            : elevation.basedOn
              ? `drawn from the ${elevation.basedOn} sheet (base plan of this reverse-aisle model, not mirrored)`
              : `drawn from sales sheet ${elevation.model || ""}`
        }`,
      cabinet && `Cabinet finish: ${cabinet}`,
      flooring && `Flooring: ${flooring}`,
      countertop && `Countertop: ${countertop}`,
      upgrades.length && `Upgrades: ${upgrades.join(", ")}`,
      payment && `Payment: ${payment}`,
      land && `Land status: ${land}`,
      timeframe && `Decision timeframe: ${timeframe}`,
      notes && `Notes: ${notes}`,
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
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors(["Something went wrong submitting your design — please try again or call (260) 308-1457."]);
      trackLeadFormError("home_designer", ["submission_failed"]);
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center bg-[var(--color-lime)]/12 border border-[var(--color-lime)]/50 rounded-2xl p-10">
        <h2 className="font-serif text-3xl font-light mb-3">Your design is on its way! 🎉</h2>
        <p className="text-[var(--color-gray)] mb-6">
          Thanks{selectedHome ? ` for designing your ${selectedHome.name}` : ""}. Our team will review your
          selections and follow up — usually within one business day — with next steps and a line-item quote.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/floor-plans" className="bg-[var(--color-teal)] text-white px-6 py-3 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors">
            Browse more homes
          </Link>
          <a href="tel:+12603081457" className="border-2 border-[var(--color-charcoal)]/15 px-6 py-3 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-charcoal)]/5 transition-colors">
            Call (260) 308-1457
          </a>
        </div>
      </div>
    );
  }

  const sectionLabel = catalog.section === "single" ? "single-wide" : catalog.section === "modular" ? "modular" : "multi-section";

  return (
    <form onSubmit={handleSubmit} onChange={markStarted} className="space-y-6" noValidate>
      {antiSpam.fields}
      {errors.length > 0 && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
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
              <option>Convert to 2-bedroom with larger living area</option>
              <option>Add a bedroom if available</option>
              <option>Add a study / den</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-2">Kitchen</span>
            <select className={field} value={kitchen} onChange={(e) => setKitchen(e.target.value)}>
              <option value="">As designed</option>
              <option>Add a kitchen island</option>
              <option>Ultimate kitchen upgrade</option>
              <option>Summit kitchen upgrade</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-2">Primary bath</span>
            <select className={field} value={primaryBath} onChange={(e) => setPrimaryBath(e.target.value)}>
              <option value="">As designed</option>
              <option>Walk-in shower</option>
              <option>Garden / soaking tub</option>
              <option>Double vanity</option>
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
                    <ChipGroup
                      name="Front door"
                      options={catalog.doors.map((d) => ({ value: d.id as DoorStyle, label: d.standard ? `${d.label} (standard)` : d.label }))}
                      value={door}
                      onChange={change(setDoor, "door")}
                    />
                  </div>
                )}
                {catalog.extraDoors.length > 0 && (
                  <div className="space-y-2">
                    {catalog.extraDoors.map((d) => (
                      <label key={d.id} className="flex items-center gap-3 cursor-pointer text-sm">
                        <input type="checkbox" checked={extraDoors.includes(d.id)} onChange={() => toggleExtraDoor(d.id)} className="w-4 h-4 accent-[var(--color-teal)]" />
                        Add a {d.label.toLowerCase()} <span className="text-xs text-[var(--color-gray)]">(placement set at order; not drawn)</span>
                      </label>
                    ))}
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
                        <span className="block text-sm font-medium mb-2">Dormer <span className="font-normal text-[var(--color-gray)]">(not drawn)</span></span>
                        <select className={field} value={dormer} onChange={(e) => change(setDormer, "dormer")(e.target.value)}>
                          <option value="">None</option>
                          {catalog.dormers.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                        </select>
                      </label>
                    )}
                    {catalog.elevations.length > 0 && (
                      <label className="block">
                        <span className="block text-sm font-medium mb-2">Bay, bump-out or eyebrow <span className="font-normal text-[var(--color-gray)]">(not drawn)</span></span>
                        <select className={field} value={elevationOption} onChange={(e) => change(setElevationOption, "elevation")(e.target.value)}>
                          <option value="">None</option>
                          {catalog.elevations.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                        </select>
                      </label>
                    )}
                    <p className="sm:col-span-2 text-xs text-[var(--color-gray)] -mt-2">Champion&rsquo;s {sectionLabel} elevation options. They go on your quote; the preview does not draw them.</p>
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
                <ElevationCaption home={selectedHome} elevation={elevation} choices={choices} catalog={catalog} />
              </div>

              <ElevationPreview
                home={selectedHome}
                elevation={elevation}
                state={elevationState}
                choices={choices}
                catalog={catalog}
                view={view}
                onView={changeView}
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

      {/* 5. Qualifying */}
      <fieldset className={sectionCls}>
        <legend className={legendCls}><span className="text-[var(--color-lime-dark)] font-bold">5.</span> A few quick questions</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <label className="block">
            <span className="block text-sm font-medium mb-2">Paying cash or financing? <span className="text-red-500" aria-hidden="true">*</span></span>
            <select className={field} value={payment} onChange={(e) => setPayment(e.target.value)}>
              <option value="">Select…</option>
              <option>Paying cash</option>
              <option>Financing</option>
              <option>Not sure yet</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-2">Do you have land or a spot?</span>
            <select className={field} value={land} onChange={(e) => setLand(e.target.value)}>
              <option value="">Select…</option>
              <option>I own my land</option>
              <option>I have a lot in a community / park</option>
              <option>I need to find land or a lot</option>
              <option>Not sure yet</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-2">Decision timeframe</span>
            <select className={field} value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
              <option value="">Select…</option>
              <option>1–3 months</option>
              <option>3–6 months</option>
              <option>6–9 months</option>
              <option>9–12 months</option>
            </select>
          </label>
        </div>
      </fieldset>

      {/* 6. Contact */}
      <fieldset className={sectionCls}>
        <legend className={legendCls}><span className="text-[var(--color-lime-dark)] font-bold">6.</span> Where should we send your quote?</legend>
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
      </fieldset>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <button type="submit" disabled={busy} className="w-full sm:w-auto bg-[var(--color-teal)] text-white px-10 py-4 text-sm font-bold tracking-widest uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors disabled:opacity-60">
          {busy ? "Submitting…" : "Submit My Design"}
        </button>
        <p className="text-xs text-[var(--color-gray)]">No obligation. We&rsquo;ll follow up with a line-item quote — you see exactly what you pay for.</p>
      </div>
    </form>
  );
}
