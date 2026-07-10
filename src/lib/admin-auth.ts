import { cookies } from "next/headers";

// Admin auth = the SAME accounts as the existing CMS admin panel
// (admin.factorydirecthomescenter.com). We proxy the CMS login endpoint and
// keep the JWT in an httpOnly cookie so it never touches browser storage.

export const ADMIN_COOKIE = "fdhc_admin";

export const CMS_API = (
  process.env.NEXT_PUBLIC_API_URL || "https://api.factorydirecthomescenter.com"
).replace(/\/$/, "");

/** JWT from the httpOnly admin cookie, or null. */
export async function getAdminToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value ?? null;
}

/** Authenticated GET against the CMS API. Returns parsed JSON or null on 401/error. */
export async function cmsGet(path: string, token: string): Promise<any | null> {
  try {
    const res = await fetch(`${CMS_API}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
