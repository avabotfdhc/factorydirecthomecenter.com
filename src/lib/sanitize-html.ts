// Allow-list HTML cleaner for copy typed into /admin (floor_plans.floor_plan_html),
// which the floor-plan page renders as HTML. Security fixes, 2026-11-26: before
// this, anyone who could write that column (an admin, or a bug like the
// unauthenticated admin actions fixed in the same change) could put a script
// on ~200 indexed pages.
//
// Kept dependency-free on purpose: the copy is simple formatting, so a strict
// allow-list is enough. Allowed tags keep NO attributes except a safe `href`
// on <a>. Every other tag is dropped (its text stays); script/style-type
// elements are dropped with their contents; any "<" left over is escaped.

const ALLOWED = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li",
  "h2", "h3", "h4", "blockquote", "span", "a", "hr",
]);
const VOID = new Set(["br", "hr"]);
const DROP_WITH_CONTENT =
  /<(script|style|iframe|object|embed|template|noscript|svg|math|textarea|select|xmp|title)\b[\s\S]*?<\/\1\s*>/gi;
const SAFE_HREF = /^(\/(?!\/)|#|https?:\/\/|tel:|mailto:)/i;

function cleanHref(attrs: string): string | null {
  const m = attrs.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i);
  if (!m) return null;
  const raw = (m[1] ?? m[2] ?? m[3] ?? "").trim();
  // Strip control characters and whitespace a browser would ignore inside a
  // scheme ("java\tscript:") before testing it.
  const href = Array.from(raw).filter((c) => c.charCodeAt(0) > 0x20 && c.charCodeAt(0) !== 0x7f).join("");
  if (!SAFE_HREF.test(href)) return null;
  return href.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function sanitizeHtml(input: string): string {
  if (!input) return "";
  let html = String(input).replace(/<!--[\s\S]*?-->/g, "");
  // Repeat so a nested "<scr<script></script>ipt>" cannot reassemble.
  for (let i = 0; i < 5; i++) {
    const next = html.replace(DROP_WITH_CONTENT, "");
    if (next === html) break;
    html = next;
  }
  const TAG = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^<>]*)>/g;
  // Text between tags: any "<" there (an unterminated tag, "<!", "<?") is
  // escaped so the browser reads it as text.
  const text = (t: string) => t.replace(/<(?=[a-zA-Z/!?])/g, "&lt;");
  let out = "";
  let last = 0;
  for (const m of html.matchAll(TAG)) {
    const at = m.index ?? 0;
    out += text(html.slice(last, at));
    last = at + m[0].length;
    const slash = m[1];
    const tag = m[2].toLowerCase();
    if (!ALLOWED.has(tag)) continue;
    if (slash) {
      if (!VOID.has(tag)) out += `</${tag}>`;
      continue;
    }
    if (tag === "a") {
      const href = cleanHref(m[3]);
      if (!href) {
        out += "<a>";
        continue;
      }
      const external = /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?factorydirecthomescenter\.com/i.test(href);
      out += external ? `<a href="${href}" rel="noopener noreferrer nofollow" target="_blank">` : `<a href="${href}">`;
      continue;
    }
    out += `<${tag}>`;
  }
  out += text(html.slice(last));
  return out;
}
