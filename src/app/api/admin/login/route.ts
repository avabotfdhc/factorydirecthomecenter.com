import { NextResponse } from "next/server";
import { ADMIN_COOKIE, CMS_API } from "@/lib/admin-auth";

// POST /api/admin/login — proxies the CMS admin login and stores the JWT in an
// httpOnly cookie. Uses the SAME credentials as admin.factorydirecthomescenter.com.
export async function POST(request: Request) {
  let body: { userName?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }

  if (!body.userName || !body.password) {
    return NextResponse.json(
      { success: false, message: "Username and password are required" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${CMS_API}/api/authenticate/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: body.userName, password: body.password }),
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));

    // The CMS returns the JWT either top-level or nested under `data` (and does
    // not always include a `success` flag). Resolve it the same defensive way
    // the cms-sync route does — requiring only a reachable 200 and a token —
    // otherwise valid credentials were being rejected as "invalid".
    const token = json?.token || json?.data?.token || json?.accessToken;

    if (!res.ok || !token) {
      return NextResponse.json(
        { success: false, message: json?.message || "Invalid username or password" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    });
    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the login service. Try again." },
      { status: 502 },
    );
  }
}
