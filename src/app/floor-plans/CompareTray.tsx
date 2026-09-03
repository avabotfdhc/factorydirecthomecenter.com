"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ApiFloorPlan } from "@/lib/api-content";

export const MAX_COMPARE = 4;

// Side-by-side comparison of the plans a shopper has ticked on the catalog.
// Rendered as a modal dialog over the grid rather than a separate route so the
// selection survives closing it and the filters underneath stay put.
export function CompareTray({
  plans,
  bedsLabel,
  onRemove,
  onClear,
  onClose,
}: {
  plans: ApiFloorPlan[];
  bedsLabel: (p: ApiFloorPlan) => string;
  onRemove: (slug: string) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes; focus moves into the dialog; body scroll is locked while
  // it's open so the page behind doesn't scroll away under the overlay.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const rows: Array<{ label: string; value: (p: ApiFloorPlan) => string }> = [
    { label: "Series", value: (p) => p.series || "—" },
    { label: "Type", value: (p) => p.homeType || "—" },
    { label: "Square feet", value: (p) => (p.sqft ? p.sqft.toLocaleString() : "—") },
    { label: "Width", value: (p) => (p.widthFt ? `${p.widthFt} ft` : "—") },
    { label: "Bedrooms", value: (p) => bedsLabel(p) },
    { label: "Bathrooms", value: (p) => String(p.baths ?? "—") },
    { label: "Price", value: (p) => p.priceFrom || p.price || "—" },
    { label: "3D tour", value: (p) => (p.virtualTour ? "Yes" : "—") },
    { label: "Flexible layout", value: (p) => p.flexNote || "—" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-6"
      onMouseDown={(e) => {
        if (!panelRef.current?.contains(e.target as Node)) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Compare floor plans"
        className="bg-white w-full sm:max-w-5xl max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--color-charcoal)]/10">
          <h2 className="font-serif text-2xl font-light">
            Comparing {plans.length} {plans.length === 1 ? "home" : "homes"}
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClear}
              className="text-sm font-semibold text-[var(--color-teal)] hover:underline"
            >
              Clear all
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close comparison"
              className="p-2 rounded-full hover:bg-[var(--color-charcoal)]/5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-auto px-6 py-5">
          <table className="w-full min-w-[560px] text-sm border-collapse">
            <caption className="sr-only">Specifications side by side</caption>
            <thead>
              <tr>
                <th scope="col" className="text-left align-bottom pb-4 w-32">
                  <span className="sr-only">Specification</span>
                </th>
                {plans.map((p) => (
                  <th key={p.slug} scope="col" className="text-left align-bottom pb-4 px-3">
                    <div className="relative aspect-[16/10] mb-3 rounded-lg overflow-hidden bg-[var(--color-cream-dark)]">
                      {p.image ? (
                        <Image src={p.image} alt="" fill className="object-cover" sizes="200px" />
                      ) : null}
                    </div>
                    <Link
                      href={`/floor-plans/${p.slug}`}
                      className="font-serif text-lg font-semibold hover:text-[var(--color-teal)]"
                    >
                      {p.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => onRemove(p.slug)}
                      className="block mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-gray)] hover:text-[var(--color-teal)]"
                    >
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-[var(--color-charcoal)]/8">
                  <th scope="row" className="text-left py-3 pr-3 font-semibold text-[var(--color-charcoal)] align-top">
                    {row.label}
                  </th>
                  {plans.map((p) => (
                    <td key={p.slug} className="py-3 px-3 text-[var(--color-charcoal)]/80 align-top">
                      {row.value(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-[var(--color-charcoal)]/10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/contact-us"
            className="flex-1 text-center bg-[var(--color-teal)] text-white px-6 py-3 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
          >
            Get line-item pricing on these
          </Link>
          <a
            href="tel:+12603081457"
            className="flex-1 text-center border-2 border-[var(--color-charcoal)]/15 px-6 py-3 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-charcoal)]/5 transition-colors"
          >
            Call (260) 308-1457
          </a>
        </div>
      </div>
    </div>
  );
}
