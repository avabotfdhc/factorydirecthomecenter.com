import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, LOCALE_QUERY, isLocale } from "./i18n/config";

const ACCESS = "fdhc_admin";
const REFRESH = "fdhc_admin_refresh";

// Two jobs, each limited by `config.matcher` to the requests that need it, so
// ordinary page loads never run this function.
//
// 1. ?lang= arrivals. The server always renders English and the language
//    choice lives in the NEXT_LOCALE cookie (src/i18n/LocaleProvider.tsx), so
//    `/about?lang=es` is the same English page as `/about`. Search Console
//    (2026-10-14) showed ~150 such URLs crawled as 200 duplicates. Remember the
//    choice in the cookie, then 308 to the URL without the parameter: the
//    visitor still sees Spanish, and Google sees one page.
//
// 2. Admin session renewal. The access-token cookie expires with the Supabase
//    JWT (one hour); when it is gone but a refresh cookie remains, bounce
//    through /api/admin/refresh, which mints new cookies and returns to the
//    same page. Everything else (verification, sign-in) happens in the
//    protected layout.
export function proxy(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;

  if (searchParams.has(LOCALE_QUERY)) {
    const lang = searchParams.get(LOCALE_QUERY);
    const url = request.nextUrl.clone();
    url.searchParams.delete(LOCALE_QUERY);
    const res = NextResponse.redirect(url, 308);
    if (isLocale(lang)) {
      res.cookies.set(LOCALE_COOKIE, lang, { path: "/", maxAge: 31536000, sameSite: "lax" });
    }
    return res;
  }

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) return NextResponse.next();
  const hasAccess = Boolean(request.cookies.get(ACCESS)?.value);
  const hasRefresh = Boolean(request.cookies.get(REFRESH)?.value);
  if (!hasAccess && hasRefresh) {
    const url = request.nextUrl.clone();
    url.pathname = "/api/admin/refresh";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    {
      source: "/((?!api|_next|admin|design-system).*)",
      has: [{ type: "query", key: "lang" }],
    },
  ],
};
