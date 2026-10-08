// Shopping page for one HUD-code home type (/single-wide-homes,
// /double-wide-homes). Local dealers rank for "double wide homes Indiana" with a
// page like this and the catalogue had none: every type link went to the
// all-homes grid. The figures in the hero are computed from the live
// catalogue, never typed in, so they stay true as plans come and go.
import Link from "next/link";
import type { ApiFloorPlan } from "@/lib/api-content";
import { gridPlan } from "@/lib/grid-plan";
import { FloorPlansGrid } from "@/app/floor-plans/FloorPlansGrid";
import { FAQSection } from "@/components/FAQSection";
import { SpecsDisclaimer } from "@/components/SpecsDisclaimer";
import { PricingDisclaimer } from "@/components/Pricing";

export interface HomeTypeLandingProps {
  eyebrow: string;
  heading: string;
  headingAccent: string;
  intro: string;
  plans: ApiFloorPlan[];
  /** Short sections of buyer guidance under the grid. */
  points: { title: string; body: string }[];
  faqs: { question: string; answer: string }[];
  related: { href: string; label: string }[];
}

function range(values: number[]): string {
  const v = values.filter((n) => Number.isFinite(n) && n > 0);
  if (!v.length) return "";
  const lo = Math.min(...v);
  const hi = Math.max(...v);
  return lo === hi ? lo.toLocaleString() : `${lo.toLocaleString()}–${hi.toLocaleString()}`;
}

export function homeTypeFacts(plans: ApiFloorPlan[]) {
  return {
    count: plans.length,
    widths: range(plans.map((p) => p.widthFt ?? 0)),
    sqft: range(plans.map((p) => p.sqft)),
    beds: range(plans.flatMap((p) => [p.bedsMin ?? p.beds, p.bedsMax ?? p.beds, p.beds])),
  };
}

export function HomeTypeLanding({ eyebrow, heading, headingAccent, intro, plans, points, faqs, related }: HomeTypeLandingProps) {
  const facts = homeTypeFacts(plans);
  const stats = [
    { value: String(facts.count), label: "Plans to choose from" },
    facts.widths && { value: `${facts.widths} ft`, label: "Wide" },
    facts.sqft && { value: facts.sqft, label: "Square feet" },
    facts.beds && { value: facts.beds, label: "Bedrooms" },
  ].filter(Boolean) as { value: string; label: string }[];

  return (
    <div className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      <section className="bg-[var(--color-charcoal)] text-[var(--color-cream)] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-lime-on-dark)] mb-4">{eyebrow}</p>
          <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mb-5">
            {heading} <span className="italic text-[var(--color-teal-light)]">{headingAccent}</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">{intro}</p>
          {stats.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-wider text-white/70">{s.label}</dt>
                  <dd className="font-serif text-3xl mt-1">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        {plans.length === 0 ? (
          <p className="text-[var(--color-gray)]">
            Our floor plans are being updated. <Link href="/floor-plans" className="text-[var(--color-teal)] underline underline-offset-4">Browse every plan</Link> or{" "}
            <Link href="/contact-us" className="text-[var(--color-teal)] underline underline-offset-4">ask us</Link>.
          </p>
        ) : (
          <FloorPlansGrid plans={plans.map(gridPlan)} />
        )}
        <SpecsDisclaimer className="mt-12" />
        <PricingDisclaimer variant="short" className="mt-6 max-w-3xl" />
      </section>

      <section className="bg-white border-y border-[var(--color-charcoal)]/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-2">
          {points.map((p) => (
            <div key={p.title}>
              <h2 className="font-serif text-2xl font-light mb-3">{p.title}</h2>
              <p className="text-[var(--color-charcoal)]/80 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 pb-16">
          <h2 className="font-serif text-2xl font-light mb-4">Keep reading</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="text-[var(--color-teal)] font-semibold underline underline-offset-4">{r.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FAQSection title={`${heading} ${headingAccent}: Questions`} faqs={faqs} />
    </div>
  );
}
