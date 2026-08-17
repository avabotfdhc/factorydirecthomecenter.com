"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { trackLeadFormStart, trackLeadFormError, trackLeadFormSubmit } from "@/lib/analytics";

// A lightweight "design your home" configurator. It does NOT price anything or
// claim an exact build — it captures a buyer's preferences (home, floor-plan
// variations, colors, upgrades) plus qualifying answers (cash/finance, land,
// timeframe) and submits them as one rich lead through /api/leads, so the sales
// team gets a warm, specific starting point for a line-item quote. Colors and
// options are shown as preferences; the team confirms exact Champion
// availability per model.

export interface DesignerPlan {
  slug: string;
  name: string;
  series: string;
  homeType: string;
}

type Swatch = { label: string; hex: string };

// Real Champion 2026 Aspire selections (from the official color board, Dec
// 2025). Hex values approximate the printed swatch for the on-screen chip;
// exact color is confirmed against physical samples — /options shows the full
// board.
const SIDING_COLORS: Swatch[] = [
  // Standard vinyl siding
  { label: "Pearl", hex: "#e7e2cf" },
  { label: "Clay", hex: "#8f867b" },
  { label: "Flint", hex: "#8a9092" },
  { label: "White", hex: "#f6f5f2" },
  // Upgrade vinyl siding
  { label: "Cypress (upgrade)", hex: "#7f8a68" },
  { label: "Wedgewood (upgrade)", hex: "#54707f" },
  { label: "Shadow (upgrade)", hex: "#4a3f37" },
  { label: "Brunswick (upgrade)", hex: "#232f3b" },
  { label: "Dublin (upgrade)", hex: "#3a4a43" },
];
const SHINGLE_COLORS: Swatch[] = [
  { label: "Black", hex: "#2c2c30" },
  { label: "Weatherwood", hex: "#5b5140" },
];
const SHUTTER_COLORS: Swatch[] = [
  { label: "Clay", hex: "#b1a68a" },
  { label: "Wine", hex: "#5a2530" },
  { label: "Blue", hex: "#3a4c60" },
  { label: "White", hex: "#eeece6" },
  { label: "Black", hex: "#1d1d1f" },
];
const CABINET_COLORS: Swatch[] = [
  { label: "Urban Oak", hex: "#c8a97c" },
  { label: "Destin White", hex: "#ece9e0" },
  { label: "Boho (upgrade)", hex: "#9a9b86" },
  { label: "Timberwolf (upgrade)", hex: "#7d766f" },
];
const FLOORING: Swatch[] = [
  { label: "Natural", hex: "#b89a72" },
  { label: "Thunder", hex: "#6d6a62" },
  { label: "Serenity", hex: "#b5b6a7" },
];
const COUNTERTOPS: Swatch[] = [
  { label: "Glacier Quartzite", hex: "#a7a29a" },
  { label: "Aluma Marble", hex: "#ece7df" },
  { label: "Bello Romano", hex: "#b2a48b" },
  { label: "Lisola", hex: "#463c34" },
  { label: "Pietra Viva", hex: "#c8c6be" },
  { label: "Roca Bosco", hex: "#8e8c87" },
];

const UPGRADES = [
  "Electric fireplace",
  "Kitchen island",
  "Stainless steel appliance package",
  "Upgraded (overlay) cabinets",
  "Farmhouse sink",
  "Covered porch",
  "Dormer / added roof detail",
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
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function HomeDesigner({ plans, initialHome }: { plans: DesignerPlan[]; initialHome?: string }) {
  const [homeSlug, setHomeSlug] = useState(initialHome || "");
  const [bedroomLayout, setBedroomLayout] = useState("");
  const [kitchen, setKitchen] = useState("");
  const [primaryBath, setPrimaryBath] = useState("");
  const [siding, setSiding] = useState("");
  const [shingle, setShingle] = useState("");
  const [shutter, setShutter] = useState("");
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

  function toggleUpgrade(u: string) {
    setUpgrades((prev) => (prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]));
  }

  function markStarted() {
    if (!started) {
      setStarted(true);
      trackLeadFormStart("home_designer");
    }
  }

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
    setErrors(errs);
    if (errs.length) {
      trackLeadFormError("home_designer", errs);
      return;
    }

    // Pack every design choice into a readable summary for the sales team.
    const lines = [
      `Home: ${selectedHome ? `${selectedHome.name}${selectedHome.series ? ` (${selectedHome.series} Series)` : ""}` : homeSlug}`,
      bedroomLayout && `Bedroom layout: ${bedroomLayout}`,
      kitchen && `Kitchen: ${kitchen}`,
      primaryBath && `Primary bath: ${primaryBath}`,
      siding && `Siding color: ${siding}`,
      shingle && `Shingle color: ${shingle}`,
      shutter && `Shutter color: ${shutter}`,
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

  return (
    <form onSubmit={handleSubmit} onChange={markStarted} className="space-y-6" noValidate>
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
            Designing the <strong>{selectedHome.name}</strong>.{" "}
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

      {/* 3. Colors & finishes — real Champion 2026 Aspire selections */}
      <fieldset className={sectionCls}>
        <legend className={legendCls}><span className="text-[var(--color-lime-dark)] font-bold">3.</span> Colors &amp; finishes</legend>
        <p className="text-sm text-[var(--color-gray)] mb-5">
          Champion&apos;s 2026 selections — the actual colors you&rsquo;ll choose. On-screen chips are a guide;
          confirm against physical samples.{" "}
          <Link href="/options" target="_blank" className="text-[var(--color-teal)] underline underline-offset-4">See the full color board</Link>.
        </p>
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-lime-dark)] mb-3">Exterior</p>
            <div className="space-y-4">
              <div><span className="block text-sm font-medium mb-2">Siding color</span><SwatchPicker name="Siding color" options={SIDING_COLORS} value={siding} onChange={setSiding} /></div>
              <div><span className="block text-sm font-medium mb-2">Shingles</span><SwatchPicker name="Shingles" options={SHINGLE_COLORS} value={shingle} onChange={setShingle} /></div>
              <div><span className="block text-sm font-medium mb-2">Shutters</span><SwatchPicker name="Shutters" options={SHUTTER_COLORS} value={shutter} onChange={setShutter} /></div>
            </div>
          </div>
          <div className="border-t border-[var(--color-charcoal)]/8 pt-6">
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--color-lime-dark)] mb-3">Interior</p>
            <div className="space-y-4">
              <div><span className="block text-sm font-medium mb-2">Cabinet finish</span><SwatchPicker name="Cabinet finish" options={CABINET_COLORS} value={cabinet} onChange={setCabinet} /></div>
              <div><span className="block text-sm font-medium mb-2">Vinyl flooring</span><SwatchPicker name="Vinyl flooring" options={FLOORING} value={flooring} onChange={setFlooring} /></div>
              <div><span className="block text-sm font-medium mb-2">Countertop</span><SwatchPicker name="Countertop" options={COUNTERTOPS} value={countertop} onChange={setCountertop} /></div>
            </div>
          </div>
        </div>
      </fieldset>

      {/* 4. Upgrades */}
      <fieldset className={sectionCls}>
        <legend className={legendCls}><span className="text-[var(--color-lime-dark)] font-bold">4.</span> Popular upgrades</legend>
        <p className="text-sm text-[var(--color-gray)] mb-5">Check anything you&rsquo;d like included in your quote.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {UPGRADES.map((u) => (
            <label key={u} className="flex items-center gap-3 cursor-pointer text-sm">
              <input type="checkbox" checked={upgrades.includes(u)} onChange={() => toggleUpgrade(u)} className="w-4 h-4 accent-[var(--color-teal)]" />
              {u}
            </label>
          ))}
        </div>
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
          <label className="block"><span className="block text-sm font-medium mb-2">Phone</span><input type="tel" name="phone" className={field} /></label>
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
