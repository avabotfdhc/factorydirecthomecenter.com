"use client";

import { lazy, Suspense } from "react";
import { usePathname } from "next/navigation";
import { canonicalPathname } from "@/lib/canonical-pathname";

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
  // PageFooter renders nothing on the homepage, but rendering it there still
  // downloaded and ran its chunk — the registry and every post (~73 KB raw) —
  // during the homepage's load: an 82 ms long task in the 2026-10-06
  // Lighthouse run, on the one page where it shows nothing.
  const pathname = canonicalPathname(usePathname());
  if (pathname === "/") return null;
  return (
    <Suspense fallback={null}>
      <PageFooter />
    </Suspense>
  );
}
