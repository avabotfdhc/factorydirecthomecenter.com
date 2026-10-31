import Link from "next/link";
import { H2 } from "@/components/Heading";
import { countyLabel, neighborCounties } from "@/lib/county-neighbors";

// "Neighboring counties we serve" — links a county page to the county pages
// that border it (src/lib/county-neighbors.ts). Server component; renders
// nothing for a slug with no listed neighbours.
export function NeighborCounties({ slug }: { slug: string }) {
  const neighbors = neighborCounties(slug);
  if (neighbors.length === 0) return null;
  return (
    <section className="py-12 border-t border-[var(--color-charcoal)]/10">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <H2 className="font-serif text-2xl lg:text-3xl font-light tracking-tight mb-4">
          Neighboring counties we serve
        </H2>
        <p className="text-[var(--color-gray)] mb-5">
          Building near the {countyLabel(slug)} line? Each of these counties has its own permit office and
          rules, covered on its page.
        </p>
        <ul className="flex flex-wrap gap-3">
          {neighbors.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                className="inline-block rounded-full border border-[var(--color-teal)]/40 px-4 py-2 text-sm font-semibold text-[var(--color-teal)] hover:bg-[var(--color-teal)]/10"
              >
                Manufactured homes in {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
