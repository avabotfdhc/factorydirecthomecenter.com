import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_REFRESH_COOKIE, getAdminToken, signOut } from "@/lib/admin-auth";

// POST /api/admin/logout — revokes the Supabase session and clears both cookies.
export async function POST() {
  const token = await getAdminToken();
  if (token) await signOut(token);
  const response = NextResponse.json({ success: true });
  for (const name of [ADMIN_COOKIE, ADMIN_REFRESH_COOKIE]) {
    response.cookies.set(name, "", { httpOnly: true, path: "/", maxAge: 0 });
  }
  return response;
}
