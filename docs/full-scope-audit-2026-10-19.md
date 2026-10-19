# Full-Scope Digital & Technical Due Diligence Audit — factorydirecthomescenter.com

**Date:** 2026-10-19  
**Scope:** production site (`factorydirecthomescenter.com`, Vercel project `factorydirecthomescenter`, deployment `dpl_GUEhGtaoD997P8VBX9UGmNEeKBtc` = `main` @ `3287ee3`), the repository at that commit, and the wired Supabase project `mvetqzhjszlullttfkwa`.  
**Pillars:** 1 Codebase/Architecture/Performance · 2 SEO/AEO · 3 UX/CRO/Telemetry · 4 Security · 5 Accessibility/Privacy/Legal.

## How this was measured (and what could not be)

| Method | Used for |
|---|---|
| `npm test` (221 tests), `tsc --noEmit`, `npm run lint`, `npm audit` on a clean `npm ci` | code health, dependency CVEs |
| `next build` + `next start` locally, Lighthouse 12 mobile (simulated throttling), 2–3 runs per page | Core Web Vitals, a11y/SEO/best-practice scores (local build, repo catalogue fallback — no Supabase env) |
| Production fetched through the Vercel connector: `/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/privacy`, `/admin`, `/search?q=<script>…`, `/about?lang=es`, `/api/health`, `/api/leads`, a 404 URL, a `/fp/../` traversal | headers, redirects, crawl surface, live config, injection checks |
| Vercel API: project settings, domains, last 8 production deployments, 7-day runtime error clusters, firewall config, Web Analytics | infra, observability |
| Supabase MCP: security + performance advisors, row counts, policies | database posture |
| Four parallel source reviews (security, SEO, performance, UX/a11y/privacy), every finding re-checked against the file and line cited | the bulk of the findings |

**Not possible from this sandbox:** direct HTTP to the public internet (every outbound host except the connectors answers 403 at the proxy), so TTFB/HTTP-version/TLS-cipher measurements of production, external-link validation of `src/lib/citations.ts`, Google Search Console data, GA4/Clarity data (no connector), Semrush (account has no API units), real-device field data (CrUX), session recordings/heatmaps, and a live penetration test (nothing was attacked; every security finding is from reading the code path, and the one dynamic probe was a harmless traversal that returned 404).

