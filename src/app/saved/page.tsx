// /saved: the shopper's saved homes. The list lives in their browser
// (src/lib/saved-homes.ts), so this page has no content of its own for a
// crawler and stays out of the index.
import { generateMetadata as genMeta } from "@/lib/seo";
import { SavedHomesView } from "./SavedHomesView";

export const metadata = genMeta({
  title: "My Saved Homes",
  description: "The Champion homes you saved, side by side. Compare them, or ask for prices on all of them at once.",
  url: "/saved",
  noindex: true,
});

export default function SavedPage() {
  return (
    <div className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      <section className="bg-[var(--color-charcoal)] text-[var(--color-cream)] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-lime-on-dark)] mb-4">
            Your shortlist
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">
            My Saved <span className="italic text-[var(--color-teal-light)]">Homes</span>
          </h1>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <SavedHomesView />
      </div>
    </div>
  );
}
