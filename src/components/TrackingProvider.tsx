"use client";

import { Suspense } from "react";
import { useTracking } from "@/lib/analytics";
import { AttributionTracker } from "@/components/AttributionTracker";

function TrackingInner() {
  useTracking();
  // Records where the visit came from into the attribution cookie that
  // /api/leads reads at submit time (src/lib/attribution.ts).
  return <AttributionTracker />;
}

export function TrackingProvider() {
  return (
    <Suspense fallback={null}>
      <TrackingInner />
    </Suspense>
  );
}
