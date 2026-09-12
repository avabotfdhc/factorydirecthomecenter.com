import Link from "next/link";
import Image from "next/image";
import type { ApiFloorPlan } from "@/lib/api-content";
import type { PlanNarrative as Narrative } from "@/lib/plan-content";
import { planImageAlt } from "@/lib/image-alt";

// Server-rendered editorial body for a floor-plan page: the generated sections
// (src/lib/plan-content.ts), the HUD/modular twin and cross-series callouts,
// comparable homes, and the guide/location links that tie the plan into the
// rest of the site. No client JS.

const h2 = "font-serif text-2xl font-light mb-4";
const p = "text-[var(--color-charcoal)]/80 leading-relaxed mb-4";
const link = "text-[var(--color-teal)] underline underline-offset-4 hover:text-[var(--color-teal-dark)]";

function RelatedCard({ plan }: { plan: ApiFloorPlan }) {
  return (
    <Link
      href={`/floor-plans/${plan.slug}`}
      className="group block bg-white rounded-xl border border-[var(--color-charcoal)]/8 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-slate-50">
        {plan.image ? (
          <Image
            src={plan.image}
            alt={planImageAlt(plan.image, plan.name, plan.homeType, 0, 1)}
            fill
            sizes="(max-width: 768px) 50vw, 300px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="p-4">
        <div className="font-semibold text-[var(--color-charcoal)] group-hover:text-[var(--color-teal)]">{plan.name}</div>
        <div className="text-xs text-[var(--color-gray)] mt-1">
          {plan.beds} bed · {plan.baths} bath · {plan.sqft ? `${plan.sqft.toLocaleString("en-US")} sq ft` : plan.homeType}
          {plan.series ? ` · ${plan.series}` : ""}
        </div>
      </div>
    </Link>
  );
}

export function PlanNarrative({ narrative, planName, planSlug }: { narrative: Narrative; planName: string; planSlug: string }) {
  const { sections, twin, sibling, related, guides, locations, hub } = narrative;
  return (
    <>
      <div className="mt-14 max-w-3xl">
        {sections.map((s, i) => (
          <section key={s.heading} className={i === 0 ? "" : "mt-10"}>
            <h2 className={h2}>{s.heading}</h2>
            {s.paragraphs.map((text) => (
              <p key={text} className={p}>{text}</p>
            ))}
            {s.bullets && (
              <ul className="list-disc pl-6 mb-4 text-[var(--color-charcoal)]/80 leading-relaxed [&_li]:mb-1">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {/* The series section ends with the hub link; the options section with the tools. */}
            {hub && s.heading === `Why the ${hub.name} series` && (
              <p className={p}>
                <Link href={`/series/${hub.slug}`} className={link}>
                  See every {hub.name} series home
                </Link>
              </p>
            )}
            {s.heading === "Options and finishes" && (
              <p className={p}>
                <Link href={`/design-your-home?home=${encodeURIComponent(planSlug)}`} className={link}>
                  Design the {planName} online
                </Link>
                {" · "}
                <Link href="/options" className={link}>
                  Factory options &amp; selections
                </Link>
              </p>
            )}
          </section>
        ))}

        {(twin || sibling) && (
          <section className="mt-10">
            <h2 className={h2}>Also available as</h2>
            {twin && (
              <p className={p}>
                {twin.text}{" "}
                <Link href={`/floor-plans/${twin.plan.slug}`} className={link}>
                  View the {twin.plan.name} ({twin.plan.homeType})
                </Link>
              </p>
            )}
            {sibling && (
              <p className={p}>
                {sibling.text}{" "}
                <Link href={`/floor-plans/${sibling.plan.slug}`} className={link}>
                  View the {sibling.plan.series} {sibling.plan.name}
                </Link>
              </p>
            )}
          </section>
        )}

        <section className="mt-10">
          <h2 className={h2}>Before you order: guides for this home</h2>
          <ul className="list-disc pl-6 text-[var(--color-charcoal)]/80 leading-relaxed [&_li]:mb-1">
            {guides.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className={link}>{g.name}</Link>
              </li>
            ))}
          </ul>
          <p className={`${p} mt-4`}>
            We deliver the {planName} across Indiana, Ohio and Michigan, including{" "}
            {locations
              .filter((l) => l.href !== "/locations")
              .map((l, i, arr) => (
                <span key={l.href}>
                  <Link href={l.href} className={link}>{l.name}</Link>
                  {i < arr.length - 1 ? ", " : ""}
                </span>
              ))}
            . <Link href="/locations" className={link}>See all delivery areas</Link>.
          </p>
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className={h2}>Compare similar homes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((r) => (
              <RelatedCard key={r.slug} plan={r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
