"use client";

import { lazy, Suspense } from "react";

// PageFooter (related-resource cards, citations, breadcrumbs and the site's
// BreadcrumbList) needs the page registry to find the current URL's entry,
// and the registry is built from every blog post — so bundling it into the
// layout shipped the full HTML of ~35 posts (~67 KB compressed) to every
// visitor, on every page, ahead of the LCP image. PageSpeed (2026-09-29)
// scored / at 93 with LCP 3.2 s; the simulator counts every byte requested
// before the hero paints.
//
// Loaded lazily it is still server-rendered — the links and the schema are in
// the HTML for crawlers and for the first paint — but its code downloads after
// hydration starts instead of competing with the hero image. Suspense lets
// React leave the server HTML in place until the chunk arrives.
const PageFooter = lazy(() => import("./PageFooter"));

export function DeferredPageFooter() {
  return (
    <Suspense fallback={null}>
      <PageFooter />
    </Suspense>
  );
}
