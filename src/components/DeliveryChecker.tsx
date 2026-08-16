"use client";

import { useState } from "react";
import { H3 } from "./Heading";

// Zip-code delivery-area checker. Zones are approximate, keyed by 3-digit zip
// prefix and centered on the Auburn, IN lot (46706). Freight is quoted exactly
// per order — this widget only answers "do you deliver to me?" instantly so
// out-of-area visitors don't bounce to a competitor before asking.
const CORE_PREFIXES = new Set([
  // Northeast Indiana
  "465", "466", "467", "468", "469",
  // Northwest Ohio (Toledo, Defiance, Lima)
  "434", "435", "458",
  // South-central Michigan (Kalamazoo, Battle Creek, Jackson)
  "490", "491", "492",
]);

function stateForZip(zip: string): string | null {
  const n = Number(zip.slice(0, 3));
  if (n >= 460 && n <= 479) return "Indiana";
  if (n >= 430 && n <= 459) return "Ohio";
  if (n >= 480 && n <= 499) return "Michigan";
  return null;
}

type Result =
  | { tier: "core"; state: string }
  | { tier: "standard"; state: string }
  | { tier: "outside" }
  | { tier: "invalid" };

function check(zip: string): Result {
  if (!/^\d{5}$/.test(zip)) return { tier: "invalid" };
  const state = stateForZip(zip);
  if (!state) return { tier: "outside" };
  if (CORE_PREFIXES.has(zip.slice(0, 3))) return { tier: "core", state };
  return { tier: "standard", state };
}

export function DeliveryChecker() {
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  return (
    <div className="bg-[var(--color-cream-dark)] rounded-lg p-6 lg:p-8">
      <H3 className="font-semibold text-lg mb-2">Do We Deliver to You?</H3>
      <p className="text-sm text-[var(--color-gray)] mb-4">
        Enter your zip code — we deliver factory-direct across Indiana, Ohio, and Michigan.
      </p>
      <form
        className="flex gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setResult(check(zip.trim()));
        }}
      >
        <input
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
          placeholder="Zip code"
          aria-label="Delivery zip code"
          className="w-36 px-4 py-3 border border-[var(--color-charcoal)]/10 rounded focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/30 focus:outline-none transition-colors bg-white"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-[var(--color-teal)] text-white text-sm font-bold tracking-wider uppercase rounded hover:bg-[var(--color-teal-dark)] transition-colors"
        >
          Check
        </button>
      </form>

      {result && (
        <div aria-live="polite" className="mt-4 text-sm leading-relaxed">
          {result.tier === "invalid" && (
            <p className="text-red-600">Please enter a valid 5-digit zip code.</p>
          )}
          {result.tier === "core" && (
            <p className="bg-[var(--color-lime)]/15 border border-[var(--color-lime)]/50 rounded-lg px-4 py-3">
              <strong>Yes — you&rsquo;re in our core delivery area.</strong> {result.state} zip
              within roughly 90 miles of our Auburn lot, so delivery lands at the low end of the
              typical $2,500–$8,000 range. We&rsquo;ll quote it exactly, line-item, with your home.
            </p>
          )}
          {result.tier === "standard" && (
            <p className="bg-[var(--color-teal)]/8 border border-[var(--color-teal)]/25 rounded-lg px-4 py-3">
              <strong>Yes — we deliver throughout {result.state}.</strong> Freight for longer runs
              is quoted per order (typically $2,500–$8,000 depending on distance and home size) and
              shown line-item with your home — no bundled surprises.
            </p>
          )}
          {result.tier === "outside" && (
            <p className="bg-[var(--color-cream)] border border-[var(--color-charcoal)]/15 rounded-lg px-4 py-3">
              That zip is outside our usual Indiana / Ohio / Michigan area — but factory-direct
              deals can still make the trip worth it.{" "}
              <a href="tel:+12603081457" className="text-[var(--color-teal)] font-semibold">
                Call (260) 308-1457
              </a>{" "}
              and we&rsquo;ll tell you honestly whether it pencils out.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
