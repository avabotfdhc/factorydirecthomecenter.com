import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_REFRESH_COOKIE, getAdminRefreshToken, refreshSession, sessionCookies } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// GET /api/admin/refresh?next=/admin/... — the protected layout sends an
// expired session here; a valid refresh token yields new cookies and a bounce
// back to the page, otherwise the session is cleared and login is shown.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const nextPath = url.searchParams.get("next") || "/admin";
  // Only same-site admin paths are allowed as the bounce target.
  const target = /^\/admin(\/|$)/.test(nextPath) ? nextPath : "/admin";

  const refreshToken = await getAdminRefreshToken();
  const session = refreshToken ? await refreshSession(refreshToken) : null;
  if (!session) {
    const response = NextResponse.redirect(new URL("/admin/login", url.origin));
    for (const name of [ADMIN_COOKIE, ADMIN_REFRESH_COOKIE]) {
      response.cookies.set(name, "", { httpOnly: true, path: "/", maxAge: 0 });
    }
    return response;
  }
  const response = NextResponse.redirect(new URL(target, url.origin));
  for (const c of sessionCookies(session)) response.cookies.set(c.name, c.value, c.options);
  return response;
}
