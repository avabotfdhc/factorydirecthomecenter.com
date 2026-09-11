import { NextResponse, type NextRequest } from "next/server";

const ACCESS = "fdhc_admin";
const REFRESH = "fdhc_admin_refresh";

// Admin session renewal. The access-token cookie expires with the Supabase JWT
// (one hour); when it is gone but a refresh cookie remains, bounce through
// /api/admin/refresh, which mints new cookies and returns to the same page.
// Everything else (verification, sign-in) happens in the protected layout.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/admin/login")) return NextResponse.next();
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
  matcher: ["/admin/:path*"],
};
