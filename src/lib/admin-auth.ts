import { cookies } from "next/headers";

// Admin auth = Supabase Auth (email + password) on the same project that holds
// the catalogue and leads. The GoTrue REST endpoints are called directly (no
// client library); the access token lives in an httpOnly cookie and a refresh
// token in a second one, so nothing touches browser storage.
//
// Only users whose app_metadata.role is "admin" may sign in. app_metadata is
// set server-side (SQL / dashboard) and cannot be edited by the user, so a
// stray self-signup can never reach /admin.

export const ADMIN_COOKIE = "fdhc_admin";
export const ADMIN_REFRESH_COOKIE = "fdhc_admin_refresh";

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function adminAuthConfigured(): boolean {
  return Boolean(SUPABASE_URL && ANON_KEY);
}

export interface AdminSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AdminUser;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface GotrueUser {
  id?: string;
  email?: string;
  user_metadata?: { name?: string };
  app_metadata?: { role?: string };
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: GotrueUser;
  error?: string;
  error_description?: string;
  msg?: string;
}

function toUser(u: GotrueUser | undefined): AdminUser {
  return {
    id: String(u?.id || ""),
    email: String(u?.email || ""),
    name: String(u?.user_metadata?.name || u?.email || "Admin"),
    role: String(u?.app_metadata?.role || ""),
  };
}

async function gotrue(path: string, init: RequestInit & { token?: string } = {}): Promise<Response> {
  const { token, ...rest } = init;
  return fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    ...rest,
    cache: "no-store",
    headers: {
      apikey: ANON_KEY,
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(rest.headers || {}),
    },
    signal: AbortSignal.timeout(8000),
  });
}

/** Email + password sign-in. Returns null on bad credentials or a non-admin user. */
export async function signInWithPassword(
  email: string,
  password: string,
): Promise<{ session: AdminSession | null; error?: string }> {
  const res = await gotrue("token?grant_type=password", { method: "POST", body: JSON.stringify({ email, password }) });
  const json = (await res.json().catch(() => ({}))) as TokenResponse;
  if (!res.ok || !json?.access_token) {
    return { session: null, error: json?.error_description || json?.msg || json?.error || "Invalid email or password" };
  }
  const user = toUser(json.user);
  if (user.role !== "admin") return { session: null, error: "This account is not an admin" };
  return {
    session: {
      accessToken: json.access_token,
      refreshToken: String(json.refresh_token || ""),
      expiresIn: Number(json.expires_in) || 3600,
      user,
    },
  };
}

/** Trade a refresh token for a new session (rotates the refresh token). */
export async function refreshSession(refreshToken: string): Promise<AdminSession | null> {
  const res = await gotrue("token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const json = (await res.json().catch(() => ({}))) as TokenResponse;
  if (!res.ok || !json?.access_token) return null;
  const user = toUser(json.user);
  if (user.role !== "admin") return null;
  return {
    accessToken: json.access_token,
    refreshToken: String(json.refresh_token || ""),
    expiresIn: Number(json.expires_in) || 3600,
    user,
  };
}

/** Best-effort server-side sign-out (revokes the refresh token). */
export async function signOut(token: string): Promise<void> {
  try {
    await gotrue("logout", { method: "POST", token });
  } catch {
    /* the cookies are cleared regardless */
  }
}

/** Access token from the httpOnly admin cookie, or null. */
export async function getAdminToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value ?? null;
}

export async function getAdminRefreshToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ADMIN_REFRESH_COOKIE)?.value ?? null;
}

/**
 * Verify an access token with Supabase Auth.
 *  - "ok": valid admin session (user returned)
 *  - "expired": Supabase rejected the token (401/403) — try a refresh
 *  - "error": Supabase unreachable — keep the session rather than lock out
 */
export async function verifyAdmin(
  token: string,
): Promise<{ status: "ok" | "expired" | "error"; user: AdminUser | null }> {
  try {
    const res = await gotrue("user", { token });
    if (res.status === 401 || res.status === 403) return { status: "expired", user: null };
    if (!res.ok) return { status: "error", user: null };
    const user = toUser((await res.json()) as GotrueUser);
    if (user.role !== "admin") return { status: "expired", user: null };
    return { status: "ok", user };
  } catch {
    return { status: "error", user: null };
  }
}

/** Cookie options shared by login and refresh. */
export function sessionCookies(session: AdminSession) {
  const secure = process.env.NODE_ENV === "production";
  return [
    {
      name: ADMIN_COOKIE,
      value: session.accessToken,
      options: { httpOnly: true, secure, sameSite: "lax" as const, path: "/", maxAge: session.expiresIn },
    },
    {
      name: ADMIN_REFRESH_COOKIE,
      value: session.refreshToken,
      options: { httpOnly: true, secure, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 30 },
    },
  ];
}

/** Route-handler guard: true when the request carries a valid admin session. */
export async function isAdminRequest(): Promise<boolean> {
  const token = await getAdminToken();
  if (!token) return false;
  const { status } = await verifyAdmin(token);
  return status === "ok";
}
