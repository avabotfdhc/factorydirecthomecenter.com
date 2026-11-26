// /photos: the catalogue's room photos, gathered by room.
//
// Built from the 2026-11-26 competitor review (see src/lib/photo-gallery.ts
// for why). The hub shows a handful of photos per room and links each room's
// full page; every photo links to the home it shows. Nothing here is a
// delivered-customer photo and the page says so — these are Champion's photos
// of the models we sell, the same ones on the plan pages.
import Link from "next/link";
import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import { GALLERY_ROOMS, galleryCount } from "@/lib/photo-gallery";
import { getGallery } from "@/lib/photo-gallery-data";
import { SpecsDisclaimer } from "@/components/SpecsDisclaimer";
import { ShowroomVisitButton } from "@/components/QuoteModal";
import { PhotoTile } from "./PhotoGrid";

export const metadata = genMeta({
  title: "Mobile & Manufactured Home Pictures: Kitchens, Baths, Exteriors",
  description:
    "Photos of Champion single wide, double wide and modular homes, room by room: kitchens, bathrooms, bedrooms, living rooms and exteriors. Every photo links to its floor plan.",
  keywords: [
    "mobile home pictures",
    "manufactured home photos",
    "mobile home interior pictures",
    "double wide mobile home pictures",
    "single wide mobile home pictures",
    "champion homes photos",
  ],
  url: "/photos",
});

// Same window as /floor-plans: the catalogue is read at most once per 5 minutes.
export const revalidate = 300;

const PER_ROOM = 6;

const FAQS = [
  {
    question: "Are these photos of real homes?",
    answer:
      "Yes. They are Champion Homes' photographs of the floor plans we sell, the same photos shown on each plan's page. Artist renderings and floor-plan drawings are left out of this gallery. Furniture, decor and some features in the photos may be optional or added for the photo shoot.",
  },
  {
    question: "Can I see one of these homes in person?",
    answer:
      "Yes. There are walk-through Champion model homes on our Auburn, Indiana lot at 1211 IN-8. Book a visit and tell us which photo or floor plan caught your eye, and we will show you the model closest to it.",
  },
  {
    question: "Can I change the cabinets, flooring or siding I see in a photo?",
    answer:
      "Champion homes are built to order, so many colors and finishes are chosen when you order. Design Your Home on this site lets you try siding, shingle, shutter and door colors on the exterior; ask us which interior options a floor plan offers.",
  },
];

export default async function PhotosPage() {
  const gallery = await getGallery();
  const total = galleryCount(gallery);
  const rooms = GALLERY_ROOMS.filter((r) => (gallery.get(r.slug)?.length ?? 0) > 0);

  return (
    <div className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      <StructuredData data={structuredData.faqPage(FAQS)} />

      <section className="bg-[var(--color-charcoal)] text-[var(--color-cream)] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-lime-on-dark)] mb-4">
            Photo gallery
          </p>
          <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mb-5">
            Mobile &amp; Manufactured <span className="italic text-[var(--color-teal-light)]">Home Pictures</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
            {total > 0 ? `${total.toLocaleString("en-US")} photos` : "Photos"} of Champion single wide, double wide and
            modular homes, room by room. Tap any photo to see the floor plan it comes from.
          </p>
          {rooms.length > 0 && (
            <nav aria-label="Rooms" className="mt-8 flex flex-wrap gap-2">
              {rooms.map((r) => (
                <Link
                  key={r.slug}
                  href={`/photos/${r.slug}`}
                  className="px-4 py-2 rounded-full border border-white/20 text-sm text-white/85 hover:border-[var(--color-lime-on-dark)] hover:text-white transition-colors"
                >
                  {r.label} <span className="opacity-60">({gallery.get(r.slug)!.length})</span>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 space-y-20">
        {rooms.length === 0 && (
          <p className="text-[var(--color-charcoal)]/70">
            The photo gallery is being refreshed. Browse the <Link href="/floor-plans" className="underline">floor plans</Link> to
            see every home&apos;s photos.
          </p>
        )}

        {rooms.map((r) => {
          const photos = gallery.get(r.slug)!;
          return (
            <section key={r.slug} aria-labelledby={`room-${r.slug}`}>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                  <h2 id={`room-${r.slug}`} className="font-serif text-3xl font-light">
                    {r.label}
                  </h2>
                  <p className="mt-2 text-[var(--color-charcoal)]/70 max-w-2xl">{r.blurb}</p>
                </div>
                <Link href={`/photos/${r.slug}`} className="text-sm font-medium text-[var(--color-teal)] hover:underline">
                  See all {photos.length} {r.label.toLowerCase()} photos →
                </Link>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.slice(0, PER_ROOM).map((p) => (
                  <li key={p.src}>
                    <PhotoTile photo={p} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section className="rounded-2xl bg-white border border-[var(--color-charcoal)]/8 p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl font-light">See one in person</h2>
            <p className="mt-2 text-[var(--color-charcoal)]/70 max-w-xl">
              Walk through Champion model homes on our Auburn, Indiana lot, or browse every floor plan with its photos
              and drawings.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ShowroomVisitButton
              location="photos"
              className="btn-primary bg-[var(--color-teal)] text-white px-6 py-3 text-sm font-bold tracking-widest uppercase rounded hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            />
            <Link
              href="/floor-plans"
              className="border border-[var(--color-charcoal)]/20 px-6 py-3 text-sm font-bold tracking-widest uppercase rounded hover:border-[var(--color-teal)] transition-colors duration-300"
            >
              Browse floor plans
            </Link>
          </div>
        </section>

        <section aria-labelledby="photos-faq">
          <h2 id="photos-faq" className="font-serif text-2xl font-light mb-6">
            About these photos
          </h2>
          <dl className="space-y-6 max-w-3xl">
            {FAQS.map((f) => (
              <div key={f.question}>
                <dt className="font-medium">{f.question}</dt>
                <dd className="mt-1 text-[var(--color-charcoal)]/75 leading-relaxed">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <SpecsDisclaimer />
      </div>
    </div>
  );
}
