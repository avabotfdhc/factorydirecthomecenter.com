// Short, same-origin paths for catalogue photos.
//
// A catalogue photo lives at
//   https://mvetqzhjszlullttfkwa.supabase.co/storage/v1/object/public/floor-plans/<key>
// and next/image writes that address, URL-encoded, into every srcset entry —
// ~95 characters of host and bucket prefix, ten times per image. On
// /floor-plans (214 cards) that alone was ~200 KB of the 1.2 MB page.
//
// `/fp/<key>` is a rewrite to the same object (next.config.ts), so the
// optimiser fetches the identical file and the page carries a third of the
// text. Only the *display* src changes: sitemap <image:loc>, og:image and
// JSON-LD keep the canonical Supabase URL that `imgUrl()` produces.

export const CATALOGUE_BUCKET_URL =
  "https://mvetqzhjszlullttfkwa.supabase.co/storage/v1/object/public/floor-plans/";
export const SHORT_IMAGE_PREFIX = "/fp/";

/** Keys made only of these characters survive the rewrite byte-for-byte. */
const SAFE_KEY = /^[A-Za-z0-9._\-/]+$/;

export function shortImageSrc(src: string): string {
  if (!src.startsWith(CATALOGUE_BUCKET_URL)) return src;
  const key = src.slice(CATALOGUE_BUCKET_URL.length);
  // Legacy S3 imports carry %-escapes ("Dutch%20Aspire…"); leave those on the
  // full URL rather than trust a rewrite to round-trip the encoding.
  return SAFE_KEY.test(key) && !key.includes("..") ? SHORT_IMAGE_PREFIX + key : src;
}
