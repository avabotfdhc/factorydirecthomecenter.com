// Serialising data into a <script type="application/ld+json"> block.
//
// Inside a <script>, the HTML parser stops at the first `</script` — quoting
// and JSON escaping do not protect it, because the parser never looks inside
// the JSON. A `<` in any string that reaches a schema (a plan name typed in
// /admin, a FAQ answer, a post title) therefore ends the block early at best,
// and injects markup at worst.
//
// Escaping `<` to its \\u003c form is the whole fix: JSON.parse turns it back
// into `<`, so consumers read identical data, and the HTML parser never sees a
// tag. Nothing else needs escaping here — an ld+json block is parsed as JSON,
// not executed as JavaScript, so the U+2028/U+2029 problem that bites inline
// scripts does not apply.
//
// `JsonLd.tsx` already did this; the other four emitters did not, and that
// inconsistency is what this module removes. No content in the catalogue or
// the repo carries a `<` in a schema field today (checked) — this is the
// guard, not a repair.
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
