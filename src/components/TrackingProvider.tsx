"use client";

import { Suspense } from "react";
import { useTracking } from "@/lib/analytics";

function TrackingInner() {
  useTracking();
  return null;
}

export function TrackingProvider() {
  return (
    <Suspense fallback={null}>
      <TrackingInner />
    </Suspense>
  );
}
