// Champion-style specifications disclaimer, shown wherever floor plans,
// renderings, or specs are displayed. Mirrors the disclaimer Champion prints
// on its own literature so the site makes the same promises the factory does.
//
// LEGIBILITY IS PART OF THE DISCLOSURE. This rendered at 2.39:1 against the
// cream page background until 2026-09-23 — the least readable text on the
// site, on the one block whose whole purpose is to be read. A notice nobody
// can read is not a notice, so the colour is fixed here rather than left to
// the call site: `tone` picks the surface, and both options clear WCAG AA
// (5.6:1 on cream, 7.9:1 on charcoal) at the 4.5:1 threshold for body text.

interface SpecsDisclaimerProps {
  className?: string;
  /** Which surface it sits on. "dark" for charcoal or photo-backed sections. */
  tone?: "light" | "dark";
}

export function SpecsDisclaimer({ className = "", tone = "light" }: SpecsDisclaimerProps) {
  const color = tone === "dark" ? "text-white/75" : "text-[var(--color-charcoal)]/70";

  return (
    <p className={`text-xs leading-relaxed ${color} ${className}`}>
      All floor plans, renderings, photographs, specifications, square footage, and pricing are approximate and
      subject to change without notice. Renderings, photos, and floor plans may show optional features, decor, or
      third-party additions not included in the base price. Square footage and dimensions are approximate. Please
      confirm current specifications, options, and availability with our sales team before ordering.
    </p>
  );
}
