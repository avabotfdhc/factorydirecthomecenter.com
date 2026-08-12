// Renders a blog post's banner image, or an on-brand gradient placeholder when
// the CMS post has no image set — so a card/article is never a blank gray box.
// Server-component safe (no client hooks). Drop into any `relative` container.
// Images route through next/image so multi-megapixel CMS originals are
// resized, converted to AVIF/WebP, and cached.

import Image from "next/image";

export function PostImage({
  src,
  alt,
  className = "",
  sizes = "(max-width: 768px) 100vw, 896px",
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        sizes={sizes}
      />
    );
  }

  // Branded fallback — teal→charcoal gradient with a house mark and the name.
  return (
    <div
      role="img"
      aria-label={alt}
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[var(--color-teal)] via-[var(--color-teal-dark)] to-[var(--color-charcoal)]"
    >
      {/* subtle diagonal sheen */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
      <svg
        className="w-12 h-12 text-[var(--color-lime)] relative"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
        <path d="M9.5 21v-6h5v6" />
      </svg>
      <span className="relative text-[10px] font-bold uppercase tracking-[0.25em] text-white/80 text-center px-6">
        Factory Direct Homes Center
      </span>
    </div>
  );
}
