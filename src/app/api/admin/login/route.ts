import { NextResponse } from "next/server";
import { adminAuthConfigured, sessionCookies, signInWithPassword } from "@/lib/admin-auth";
import { rateLimit, requestIp } from "@/lib/request-guard";

// Password guessing guard (security fixes, 2026-11-26): 8 attempts per IP and
// 5 per email address per 15 minutes, and one generic failure message so the
// response never tells a guesser whether an address has an account.
const WINDOW_MS = 15 * 60 * 1000;

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
  const ip = requestIp(request.headers);
  const byIp = rateLimit("admin-login-ip", ip, 8, WINDOW_MS);
  const byEmail = rateLimit("admin-login-email", email, 5, WINDOW_MS);
  if (!byIp.allowed || !byEmail.allowed) {
    const wait = Math.max(byIp.retryAfterSec, byEmail.retryAfterSec);
    return NextResponse.json(
      { success: false, message: "Too many sign-in attempts. Wait 15 minutes and try again." },
      { status: 429, headers: { "Retry-After": String(wait) } },
    );
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
      if (error) console.warn("[admin-login] sign-in refused");
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
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
