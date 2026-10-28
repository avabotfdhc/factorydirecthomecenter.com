"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackCTAClick } from "@/lib/analytics";
import { designerHref, type DesignerSource } from "@/lib/designer-link";

// A link into Design Your Home that reports the click. Every entry point to
// the designer goes through this one component so GA4's `cta_click` rows
// (cta_name = design_this_home, cta_location = where it sat) can be compared
// against the designer's own `designer_step` funnel and the leads it sends.

export function DesignerCta({
  slug,
  siding,
  src,
  location,
  className = "",
  children,
  ariaLabel,
}: {
  /** the plan to preselect; omit to open the designer with the picker empty */
  slug?: string;
  /** a board colour to start in (the designer ignores a label its catalogue lacks) */
  siding?: string;
  /** which placement this is, carried on the URL for the designer's funnel events */
  src: DesignerSource;
  /** the GA4 cta_location value */
  location: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const href = designerHref(slug, { siding, src });
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      onClick={() => trackCTAClick("design_this_home", location, href)}
      className={className}
    >
      {children}
    </Link>
  );
}
