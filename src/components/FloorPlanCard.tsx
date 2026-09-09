"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ApiFloorPlan } from "@/lib/api-content";
import PriceQuoteModal from "@/components/PriceQuoteModal";

// Category badge key from whatever the source calls the home type.
function typeKey(homeType: string): "singleWide" | "multiSection" | "modular" {
  if (/modular/i.test(homeType)) return "modular";
  if (/multi|double|section/i.test(homeType)) return "multiSection";
  return "singleWide";
}

// One home in the /floor-plans grid.
//
// - Photo/Plan toggle: when the catalogue holds a dimensioned drawing for the
//   home it can be viewed in place (object-contain, padded, so the whole sheet
//   is readable) without leaving the grid.
// - "Get Pricing" opens the instant-quote modal instead of printing "Call for
//   pricing": the price is deliberately unpublished, so the card asks for the
//   lead rather than showing a dead label.
// The buttons sit OUTSIDE the <Link> — an interactive element nested in an
// anchor would navigate instead of toggling.

interface Props {
  plan: ApiFloorPlan;
  bedsLabel: string;
  bedsFlex: boolean;
  compareSlot?: React.ReactNode;
}

export function FloorPlanCard({ plan: p, bedsLabel, bedsFlex, compareSlot }: Props) {
  const t = useTranslations("card");
  const hasDrawing = Boolean(p.floorPlanImage && p.floorPlanImage !== p.image);
  const [view, setView] = useState<"photo" | "plan">("photo");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const showingPlan = hasDrawing && view === "plan";
  const src = showingPlan ? p.floorPlanImage : p.image;
  // A plan with no photo carries its rendered sales sheet as its only image;
  // show a sheet whole (contain) rather than cover-cropping it like a photo.
  const isSheet = showingPlan || (Boolean(p.floorPlanImage) && p.image === p.floorPlanImage);
  const hidePrice = /call for pricing/i.test(p.priceFrom || p.price || "") || !(p.priceFrom || p.price);

  return (
    <div className="relative flex flex-col h-full border border-[var(--color-charcoal)]/8 hover:border-[var(--color-teal)]/30 bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-[16/10] bg-gradient-to-br from-[var(--color-cream-dark)] to-[var(--color-cream)] overflow-hidden border-b border-[var(--color-charcoal)]/5">
        <Link href={`/floor-plans/${p.slug}`} className="group block absolute inset-0" aria-label={`View the ${p.name} floor plan`}>
          {src ? (
            <Image
              src={src}
              alt={
                showingPlan
                  ? `${p.name} floor plan drawing — ${bedsLabel} bed ${p.baths} bath`
                  : `${p.name} — ${bedsLabel} bed ${p.baths} bath manufactured home floor plan`
              }
              fill
              className={isSheet ? "object-contain p-3 bg-slate-50" : "object-cover group-hover:scale-105 transition-transform duration-700"}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--color-gray-light)] text-sm">{t("noPhoto")}</div>
          )}
          {!isSheet && <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
        </Link>

        {p.series && (
          <span className="absolute top-3 left-3 bg-[var(--color-teal)] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded pointer-events-none">
            {p.series} Series
          </span>
        )}
        {bedsFlex && (
          <span className="absolute top-3 right-3 bg-[var(--color-lime)] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded pointer-events-none">
            {bedsLabel} Bed
          </span>
        )}
        {p.virtualTour && !hasDrawing && (
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded pointer-events-none">
            3D Tour
          </span>
        )}

        {hasDrawing && (
          <div
            className="absolute bottom-3 right-3 flex rounded-md bg-white/95 p-0.5 shadow-sm text-[11px] font-semibold border border-[var(--color-charcoal)]/10"
            role="group"
            aria-label={`${p.name} image view`}
          >
            <button
              type="button"
              onClick={() => setView("photo")}
              aria-pressed={view === "photo"}
              className={`px-2.5 py-1 rounded ${view === "photo" ? "bg-[var(--color-teal)] text-white" : "text-[var(--color-charcoal)]"}`}
            >
              {t("photo")}
            </button>
            <button
              type="button"
              onClick={() => setView("plan")}
              aria-pressed={view === "plan"}
              className={`px-2.5 py-1 rounded ${view === "plan" ? "bg-[var(--color-teal)] text-white" : "text-[var(--color-charcoal)]"}`}
            >
              {t("plan")}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <Link href={`/floor-plans/${p.slug}`} className="group">
            <h2 className="font-serif text-xl font-semibold group-hover:text-[var(--color-teal)] transition-colors">{p.name}</h2>
          </Link>
          {!hidePrice && (
            <span className="text-sm font-bold text-[var(--color-lime-dark)] whitespace-nowrap">{p.priceFrom || p.price}</span>
          )}
        </div>
        <p className="text-sm text-[var(--color-teal)] font-medium mb-4">
          {p.brand}
          {p.series ? ` · ${t("series", { series: p.series })}` : ""}
        </p>
        <div className="flex gap-4 text-xs tracking-wider uppercase text-[var(--color-gray)]">
          <span>{p.sqft.toLocaleString()} {t("sqft")}</span>
          <span className="text-[var(--color-gray-light)]">|</span>
          <span>{bedsLabel} {t("bed")}</span>
          <span className="text-[var(--color-gray-light)]">|</span>
          <span>{p.baths} {t("bath")}</span>
        </div>

        <div className="mt-auto pt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setQuoteOpen(true)}
            className="rounded-lg bg-[var(--color-teal)] py-2.5 text-xs font-bold tracking-wider uppercase text-white hover:bg-[var(--color-teal-dark)] transition-colors"
          >
            {t("getPricing")}
          </button>
          <Link
            href={`/floor-plans/${p.slug}`}
            className="flex items-center justify-center rounded-lg border border-[var(--color-charcoal)]/15 py-2.5 text-xs font-bold tracking-wider uppercase text-[var(--color-charcoal)] hover:border-[var(--color-teal)]/50 hover:text-[var(--color-teal)] transition-colors"
          >
            {t("viewPlan")}
          </Link>
        </div>
        {compareSlot && <div className="mt-3">{compareSlot}</div>}
      </div>

      <PriceQuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} modelName={p.name} series={p.series || "Champion"} />
    </div>
  );
}
