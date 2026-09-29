// A catalogue card image with a three-entry srcset.
//
// /floor-plans renders ~214 cards. Through next/image each card image carried
// a srcset of every configured width (256 … 1920, eight entries) plus, on
// Vercel, a 38-character `&dpl=` deployment tag on every entry — ~1 KB of
// attribute text per card, and the reason the page stayed over 600 KB of HTML
// after the first pass (DealerTide review, 2026-09-28).
//
// A card is shown at ~390–420 CSS px on desktop and tablet and at the viewport
// width on a phone, so three widths cover it: 640 for desktop/tablet at 1x,
// 828/1080 for phones at 2x–2.6x and desktops at 2x. (384 was dropped: every
// card layout is wider than 384 CSS px, so the browser never picked it.)
// Each URL is the same /_next/image endpoint next/image uses (every width is
// in `images.deviceSizes`, and q=75 is the default quality), so optimisation,
// AVIF/WebP and caching are unchanged. Only the markup is shorter.

const WIDTHS = [640, 828, 1080] as const;
const QUALITY = 75;

function optimised(src: string, w: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${QUALITY}`;
}

export function CatalogueImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- next/image cannot limit the srcset to three widths per image; this emits the same /_next/image URLs it would, minus the other five widths and the per-entry deployment tag. See the header comment.
    <img
      src={optimised(src, 640)}
      srcSet={WIDTHS.map((w) => `${optimised(src, w)} ${w}w`).join(", ")}
      sizes={sizes}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  );
}
