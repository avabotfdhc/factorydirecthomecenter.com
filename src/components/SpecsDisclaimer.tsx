// Champion-style specifications disclaimer, shown wherever floor plans,
// renderings, or specs are displayed. Mirrors the disclaimer Champion prints
// on its own literature so the site makes the same promises the factory does.
export function SpecsDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs text-[var(--color-gray-light)] leading-relaxed ${className}`}>
      All floor plans, renderings, photographs, specifications, square footage, and pricing are approximate and
      subject to change without notice. Renderings, photos, and floor plans may show optional features, decor, or
      third-party additions not included in the base price. Square footage and dimensions are approximate. Please
      confirm current specifications, options, and availability with our sales team before ordering.
    </p>
  );
}
