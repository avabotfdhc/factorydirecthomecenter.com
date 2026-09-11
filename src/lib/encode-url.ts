// Percent-encode a URL or path for use as an image `src`, safely.
//
// Catalogue image references arrive in three shapes: raw ("banner/Bay Port
// 2856H32168.png" from the legacy CMS), already encoded ("…/Dutch%20Aspire…"
// as the Supabase CMS stores the S3 banners), and mixed. `encodeURI` alone is
// not idempotent: it turns an existing "%20" into "%2520", which is a different
// object key, and S3 answers 404. That is what blanked 146 of the 162 S3-hosted
// cards on /floor-plans (2026-09-11).
//
// So: encode, then collapse any "%25XX" that came from a valid "%XX" sequence
// in the input back to "%XX". Raw characters (spaces, parentheses, non-ASCII)
// still get encoded; existing escapes — including reserved ones such as %2F —
// are kept as they were.
export function encodeImageUrl(raw: string | null | undefined): string {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  return encodeURI(s).replace(/%25([0-9A-Fa-f]{2})/g, "%$1");
}
