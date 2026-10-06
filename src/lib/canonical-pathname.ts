// Kept in its own module, free of imports, because DeferredPageFooter (in the
// root layout, so on every page) needs it — importing it from pages.ts would
// pull the whole page registry, every blog post's HTML included, back into the
// layout bundle that tests/bundle-weight.test.ts keeps it out of.

/**
 * The route a component should reason about, from what `usePathname()` returned.
 *
 * When Vercel regenerates the root route under ISR, the server render sees the
 * homepage as "/index" while every browser sees "/". PageFooter then rendered a
 * "Home › Index" trail (and a BreadcrumbList naming a /index URL that 404s) into
 * the cached homepage, and the browser — which renders nothing on "/" —
 * disagreed: React error #418 on every homepage load, the one failing
 * Lighthouse Best Practices audit on 2026-10-06. Normalise before branching.
 */
export function canonicalPathname(pathname: string | null | undefined): string {
  if (!pathname || pathname === "/index" || pathname === "/index/") return "/";
  return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}
