import { NextResponse } from "next/server";
import { adminAuthConfigured, sessionCookies, signInWithPassword } from "@/lib/admin-auth";

// POST /api/admin/login — Supabase Auth email + password sign-in. The session
// tokens are stored in httpOnly cookies; nothing is returned to the browser.
export async function POST(request: Request) {
  let body: { email?: string; userName?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
  const email = String(body.email || body.userName || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!email || !password) {
    return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
  }
  if (!adminAuthConfigured()) {
    return NextResponse.json(
      { success: false, message: "Admin sign-in is not configured (Supabase env vars missing)." },
      { status: 503 },
    );
  }

  try {
    const { session, error } = await signInWithPassword(email, password);
    if (!session) {
      return NextResponse.json({ success: false, message: error || "Invalid email or password" }, { status: 401 });
    }
    const response = NextResponse.json({ success: true, user: { email: session.user.email, name: session.user.name } });
    for (const c of sessionCookies(session)) response.cookies.set(c.name, c.value, c.options);
    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the sign-in service. Try again." },
      { status: 502 },
    );
  }
}
