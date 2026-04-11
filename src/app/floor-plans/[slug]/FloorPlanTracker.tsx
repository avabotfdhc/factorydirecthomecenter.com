"use client";

import { useEffect } from "react";
import { trackFloorPlanView, trackFloorPlanSelect } from "@/lib/analytics";
import type { FloorPlan } from "@/lib/floor-plans";

interface FloorPlanTrackerProps {
  plan: FloorPlan;
}

export function FloorPlanTracker({ plan }: FloorPlanTrackerProps) {
  useEffect(() => {
    // Track floor plan view on mount
    trackFloorPlanView(plan.name, plan.type, plan.sqft, parseInt(plan.priceNumeric) || undefined);
  }, [plan]);

  return null;
}
