import Link from "next/link";
import { H2 } from "@/components/Heading";
import { countyPostLinks } from "@/lib/county-posts";

/** The county's town posts, for the hand-built county pages. */
export function CountyPostsList({ countySlug, county }: { countySlug: string; county: string }) {
  const posts = countyPostLinks(countySlug);
  if (!posts.length) return null;
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-6">
          Read more about <span className="italic text-[var(--color-teal)]">{county}</span>
        </H2>
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className="text-[var(--color-teal)] font-semibold underline underline-offset-4">
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
