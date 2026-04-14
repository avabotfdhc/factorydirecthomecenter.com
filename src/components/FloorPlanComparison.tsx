"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { H3, H4 } from "./Heading";
import { FadeIn } from "./VisualEffects";
import { getAllFloorPlans, FloorPlan } from "@/lib/floor-plans";

interface FloorPlanComparisonProps {
  initialPlans?: string[];
}

export function FloorPlanComparison({ initialPlans }: FloorPlanComparisonProps) {
  const allPlans = getAllFloorPlans();
  const [selectedPlans, setSelectedPlans] = useState<FloorPlan[]>([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const togglePlan = (plan: FloorPlan) => {
    if (selectedPlans.find((p) => p.slug === plan.slug)) {
      setSelectedPlans(selectedPlans.filter((p) => p.slug !== plan.slug));
    } else if (selectedPlans.length < 3) {
      setSelectedPlans([...selectedPlans, plan]);
    }
  };

  const removePlan = (slug: string) => {
    setSelectedPlans(selectedPlans.filter((p) => p.slug !== slug));
  };

  if (selectedPlans.length === 0) {
    return (
      <FadeIn direction="up">
        <div className="bg-[var(--color-cream-dark)] rounded-xl p-8 text-center">
          <H3 className="font-serif text-2xl font-light mb-4">Compare Floor Plans</H3>
          <p className="text-[var(--color-gray)] mb-6">
            Select up to 3 floor plans to compare side-by-side
          </p>
          <button
            onClick={() => setIsSelectorOpen(true)}
            className="px-6 py-3 bg-[var(--color-teal)] text-white font-semibold rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
          >
            Choose Plans to Compare
          </button>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn direction="up">
      <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-charcoal)]/5 overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--color-teal)] text-white p-6 flex justify-between items-center">
          <H4 className="font-serif text-xl font-light">Floor Plan Comparison</H4>
          <div className="flex gap-2">
            <button
              onClick={() => setIsSelectorOpen(true)}
              className="px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-colors"
            >
              Add/Remove Plans
            </button>
            <button
              onClick={() => setSelectedPlans([])}
              className="px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-charcoal)]/10">
                <th className="p-4 text-left text-sm font-semibold text-[var(--color-gray)] sticky left-0 bg-white min-w-[120px]">
                  Feature
                </th>
                {selectedPlans.map((plan) => (
                  <th key={plan.slug} className="p-4 text-center min-w-[200px]">
                    <div className="relative w-full aspect-video mb-2 rounded-lg overflow-hidden">
                      <Image
                        src={plan.heroImage}
                        alt={plan.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="font-semibold text-[var(--color-charcoal)]">{plan.name}</div>
                    <button
                      onClick={() => removePlan(plan.slug)}
                      className="text-xs text-red-500 hover:text-red-700 mt-1"
                    >
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Type", key: "type" },
                { label: "Square Feet", key: "sqft" },
                { label: "Bedrooms", key: "beds" },
                { label: "Bathrooms", key: "baths" },
                { label: "Sections", key: "sections" },
                { label: "Building Code", key: "code" },
                { label: "Starting Price", key: "price" },
              ].map((row, idx) => (
                <tr key={row.key} className={idx % 2 === 0 ? "bg-[var(--color-cream-dark)]/30" : ""}>
                  <td className="p-4 text-sm font-medium text-[var(--color-charcoal)] sticky left-0 bg-inherit">
                    {row.label}
                  </td>
                  {selectedPlans.map((plan) => (
                    <td key={plan.slug} className="p-4 text-center text-sm">
                      {row.key === "sqft"
                        ? `${(plan[row.key as keyof FloorPlan] as number).toLocaleString()} sq ft`
                        : String(plan[row.key as keyof FloorPlan])}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Features Row */}
              <tr className="bg-[var(--color-cream-dark)]/30">
                <td className="p-4 text-sm font-medium text-[var(--color-charcoal)] sticky left-0 bg-inherit align-top">
                  Key Features
                </td>
                {selectedPlans.map((plan) => (
                  <td key={plan.slug} className="p-4 text-sm align-top">
                    <ul className="space-y-1">
                      {plan.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[var(--color-lime-dark)]">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              {/* Action Row */}
              <tr>
                <td className="p-4 sticky left-0 bg-inherit"></td>
                {selectedPlans.map((plan) => (
                  <td key={plan.slug} className="p-4">
                    <Link
                      href={`/floor-plans/${plan.slug}`}
                      className="block w-full text-center bg-[var(--color-teal)] text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Selector Modal */}
      {isSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-[var(--color-charcoal)]/10 flex justify-between items-center">
              <H4 className="font-serif text-xl">Select Plans to Compare</H4>
              <button
                onClick={() => setIsSelectorOpen(false)}
                className="text-[var(--color-gray)] hover:text-[var(--color-charcoal)]"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-sm text-[var(--color-gray)] mb-4">
                Select up to 3 plans ({selectedPlans.length} selected)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allPlans.map((plan) => {
                  const isSelected = selectedPlans.find((p) => p.slug === plan.slug);
                  const isDisabled = !isSelected && selectedPlans.length >= 3;
                  return (
                    <button
                      key={plan.slug}
                      onClick={() => !isDisabled && togglePlan(plan)}
                      disabled={isDisabled}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        isSelected
                          ? "border-[var(--color-teal)] bg-[var(--color-teal)]/5"
                          : isDisabled
                          ? "border-[var(--color-charcoal)]/10 opacity-50 cursor-not-allowed"
                          : "border-[var(--color-charcoal)]/10 hover:border-[var(--color-teal)]/30"
                      }`}
                    >
                      <div className="font-semibold text-[var(--color-charcoal)]">{plan.name}</div>
                      <div className="text-sm text-[var(--color-gray)]">
                        {plan.type} • {plan.sqft.toLocaleString()} sq ft • {plan.beds} bed
                      </div>
                      {isSelected && (
                        <div className="text-[var(--color-teal)] text-sm mt-2">✓ Selected</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="p-6 border-t border-[var(--color-charcoal)]/10 flex justify-end gap-3">
              <button
                onClick={() => setIsSelectorOpen(false)}
                className="px-6 py-2 border border-[var(--color-charcoal)]/20 text-[var(--color-charcoal)] font-semibold rounded-lg hover:bg-[var(--color-cream-dark)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsSelectorOpen(false)}
                className="px-6 py-2 bg-[var(--color-teal)] text-white font-semibold rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </FadeIn>
  );
}
