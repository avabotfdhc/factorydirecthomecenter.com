// /photos/<room>: every photo of one room across the catalogue ("mobile home
// kitchen pictures", "double wide bathroom photos"…). The rooms are a fixed
// list (GALLERY_ROOMS); anything else is a 404. A room the catalogue holds no
// photos for renders a pointer to the hub and stays out of the index.
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateMetadata as genMeta } from "@/lib/seo";
import { GALLERY_ROOMS, galleryRoom } from "@/lib/photo-gallery";
import { getGallery } from "@/lib/photo-gallery-data";
import { SpecsDisclaimer } from "@/components/SpecsDisclaimer";
import { ShowroomVisitButton } from "@/components/QuoteModal";
import { PhotoGrid } from "../PhotoGrid";

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return GALLERY_ROOMS.map((r) => ({ room: r.slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ room: string }> }): Promise<Metadata> {
  const { room: slug } = await params;
  const room = galleryRoom(slug);
  if (!room) return {};
  const count = (await getGallery()).get(room.slug)?.length ?? 0;
  const what = room.heading.toLowerCase().replace(/ & /g, " and ");
  return genMeta({
    title: `Mobile Home ${room.heading} Pictures${count ? ` (${count} Photos)` : ""}`,
    description: `${count ? `${count} photos` : "Photos"} of ${room.label.toLowerCase()} in Champion single wide, double wide and modular homes. ${room.blurb} Each photo links to its floor plan.`,
    keywords: [
      `mobile home ${what} pictures`,
      `manufactured home ${what} photos`,
      `double wide ${what} pictures`,
      `single wide ${what} pictures`,
    ],
    url: `/photos/${room.slug}`,
    noindex: count === 0,
  });
}

export default async function RoomPhotosPage({ params }: { params: Promise<{ room: string }> }) {
  const { room: slug } = await params;
  const room = galleryRoom(slug);
  if (!room) notFound();
  const photos = (await getGallery()).get(room.slug) ?? [];
  const others = GALLERY_ROOMS.filter((r) => r.slug !== room.slug);

  return (
    <div className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      <section className="bg-[var(--color-charcoal)] text-[var(--color-cream)] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-lime-on-dark)] mb-4">
            <Link href="/photos" className="hover:underline">
              Photo gallery
            </Link>
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-4">
            Mobile Home {room.heading} <span className="italic text-[var(--color-teal-light)]">Pictures</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
            {photos.length > 0 ? `${photos.length} photos. ` : ""}
            {room.blurb} Tap a photo to see that home&apos;s floor plan.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        {photos.length > 0 ? (
          <PhotoGrid photos={photos} roomLabel={room.label} />
        ) : (
          <p className="text-[var(--color-charcoal)]/70">
            No {room.label.toLowerCase()} photos right now. See the full <Link href="/photos" className="underline">photo gallery</Link> or
            browse the <Link href="/floor-plans" className="underline">floor plans</Link>.
          </p>
        )}

        <section className="mt-16 rounded-2xl bg-white border border-[var(--color-charcoal)]/8 p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl font-light">Like what you see?</h2>
            <p className="mt-2 text-[var(--color-charcoal)]/70 max-w-xl">
              Walk through Champion model homes on our Auburn, Indiana lot and see finishes like these in person.
            </p>
          </div>
          <ShowroomVisitButton
            location={`photos-${room.slug}`}
            className="btn-primary bg-[var(--color-teal)] text-white px-6 py-3 text-sm font-bold tracking-widest uppercase rounded hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
          />
        </section>

        <nav aria-label="More rooms" className="mt-14">
          <h2 className="font-serif text-2xl font-light mb-4">More photos</h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/photos/${r.slug}`}
                  className="inline-block px-4 py-2 rounded-full border border-[var(--color-charcoal)]/15 bg-white text-sm hover:border-[var(--color-teal)] transition-colors"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <SpecsDisclaimer className="mt-14" />
      </div>
    </div>
  );
}
