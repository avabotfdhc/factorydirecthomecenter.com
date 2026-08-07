import { NextResponse } from "next/server";
import { pushLeadToDealertide } from "@/lib/dealertide";

// ============================================
// LEAD CAPTURE API — factorydirecthomescenter.com
// ============================================
// POST /api/leads
//
// Channel 1 — Email via Resend
//   Requires env vars (add via: vercel env add <VAR> production):
//     RESEND_API_KEY   — from resend.com (required for email to actually send)
//     LEAD_EMAIL_TO    — recipient; defaults to leads@factorydirecthomescenter.com
//
// Channel 2 — Google Sheets
//   Requires env vars:
//     GOOGLE_SHEETS_ID          — the spreadsheet ID from the URL
//     GOOGLE_SERVICE_ACCOUNT_KEY — full JSON key (base64-encoded)
//
// If a channel's env vars are missing it is skipped silently —
// the contact form will still show the thank-you screen.
// ============================================

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const LEAD_EMAIL_TO = process.env.LEAD_EMAIL_TO ?? "leads@factorydirecthomescenter.com";
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

export async function POST(request: Request) {
  let body: Record<string, string>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Basic validation
  if (!body.firstName || !body.lastName || !body.email) {
    return NextResponse.json(
      { error: "Missing required fields: firstName, lastName, email" },
      { status: 400 }
    );
  }

  const lead = {
    firstName: body.firstName ?? "",
    lastName: body.lastName ?? "",
    email: body.email ?? "",
    phone: body.phone ?? "",
    interest: body.interest ?? "",
    deliveryState: body.deliveryState ?? "",
    bedrooms: body.bedrooms ?? "",
    landStatus: body.landStatus ?? "",
    timeframe: body.timeframe ?? "",
    financingStatus: body.financingStatus ?? "",
    message: body.message ?? "",
    source: body.source ?? "Contact Form",
    pageUrl: body.pageUrl ?? "",
    submittedAt: new Date().toISOString(),
  };

  console.log("[leads] New submission:", lead.email, lead.firstName, lead.lastName);

  // Run all channels concurrently; no single failure blocks the response
  const [emailResult, sheetsResult, cmsResult, dtResult] = await Promise.allSettled([
    sendEmail(lead),
    appendToSheet(lead),
    postToCms(lead),
    // DealerTide CRM — key's inbound-lead automation handles source defaulting,
    // Auburn location assignment, and email/phone dedupe on their side.
    pushLeadToDealertide({
      first_name: lead.firstName,
      last_name: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      source: "Website",
      message: lead.message,
      page_url: lead.pageUrl,
    }),
  ]);

  if (emailResult.status === "rejected") {
    console.error("[leads] Email channel failed:", emailResult.reason);
  }
  if (sheetsResult.status === "rejected") {
    console.error("[leads] Sheets channel failed:", sheetsResult.reason);
  }
  if (cmsResult.status === "rejected") {
    console.error("[leads] CMS channel failed:", cmsResult.reason);
  }
  if (dtResult.status === "rejected" || (dtResult.status === "fulfilled" && dtResult.value === false)) {
    console.error("[leads] DealerTide channel failed or not configured");
  }

  return NextResponse.json({ success: true, message: "Lead received" });
}

// ─── Channel 3: Factory Direct admin CMS (leads appear in the admin panel) ──
// Posts to the existing public enquiry endpoint so submissions land in the same
// place Kyle already manages leads.
//
// The CMS enquiry model REQUIRES numeric option IDs (deliveryState, homeType,
// bedrooms, purchaseOptions, landOptions, communicationOptions, state) as
// foreign keys — omitting them makes the insert fail with HTTP 400 and the lead
// is silently lost. We map the fields the contact form collects to those IDs
// and default the rest to sensible values (Indiana base market), preserving the
// full free-text detail in the `address` note field so nothing is lost.
//
// Option IDs from GET /api/enquiry/get-enquiry-options (stable):
//   delivery: 2=Indiana 4=Ohio 5=Michigan 8=Illinois 9=Kentucky
//   homeType: 1=Single Wide 2=Double/Sectional 3=Modular
//   bedrooms: 1..5   purchase: 1=Cash 2=Finance
//   land: 1=Have land/place 2=Community   communication: 1=phone 2=text 3=email
//   states: 15=Indiana 23=Michigan 36=Ohio

function pickId(map: Record<string, number>, value: string, fallback: number): number {
  const v = String(value || "").toLowerCase();
  for (const key of Object.keys(map)) if (v.includes(key)) return map[key];
  return fallback;
}

const HOME_TYPE: Record<string, number> = {
  single: 1, "single wide": 1, double: 2, "double wide": 2, sectional: 2, modular: 3,
};
const PURCHASE: Record<string, number> = { cash: 1, finance: 2, financ: 2, loan: 2, mortgage: 2 };
const LAND: Record<string, number> = { own: 1, "have land": 1, land: 1, community: 2, park: 2, lot: 2, need: 2 };
const DELIVERY: Record<string, number> = { indiana: 2, ohio: 4, michigan: 5, illinois: 8, kentucky: 9 };
// The CMS `state` FK only has Indiana/Michigan/Ohio; map from the delivery state.
const STATE: Record<string, number> = { indiana: 15, michigan: 23, ohio: 36 };

async function postToCms(lead: Record<string, string>) {
  const CMS_API = (
    process.env.NEXT_PUBLIC_API_URL || "https://api.factorydirecthomescenter.com"
  ).replace(/\/$/, "");

  const detail = [
    lead.interest && `Interest: ${lead.interest}`,
    lead.timeframe && `Timeframe: ${lead.timeframe}`,
    lead.landStatus && `Land: ${lead.landStatus}`,
    lead.financingStatus && `Financing: ${lead.financingStatus}`,
    lead.message && `Message: ${lead.message}`,
    lead.pageUrl && `Page: ${lead.pageUrl}`,
  ]
    .filter(Boolean)
    .join(" | ");

  const res = await fetch(`${CMS_API}/api/enquiry/rash-enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phoneNo: lead.phone || "",
      // Required option IDs — mapped from the form fields, else sensible default.
      deliveryState: pickId(DELIVERY, lead.deliveryState, 2),
      homeType: pickId(HOME_TYPE, lead.interest, 2),
      bedrooms: Number(lead.bedrooms) || 3,
      purchaseOptions: pickId(PURCHASE, lead.financingStatus, 2),
      landOptions: pickId(LAND, lead.landStatus, 1),
      communicationOptions: 3, // email (we always capture an email address)
      state: pickId(STATE, lead.deliveryState, 15),
      floorTitle: lead.source || "Website Contact Form",
      leadSource: lead.source || "Website",
      address: detail || "Website contact form submission",
    }),
  });

  if (!res.ok) throw new Error(`CMS enquiry API error ${res.status}`);
  console.log("[leads] pushed to CMS enquiry (admin panel)");
}

// ─── Channel 1: Resend email ───────────────────────────────────────────────

async function sendEmail(lead: Record<string, string>) {
  if (!RESEND_API_KEY) {
    console.log("[leads] Email skipped — RESEND_API_KEY not set");
    return;
  }

  const html = `
    <h2 style="color:#1a1a1a">New Website Lead</h2>
    <table cellpadding="6" cellspacing="0" style="font-family:sans-serif;font-size:14px">
      <tr><td><strong>Name</strong></td><td>${lead.firstName} ${lead.lastName}</td></tr>
      <tr><td><strong>Email</strong></td><td>${lead.email}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${lead.phone || "—"}</td></tr>
      <tr><td><strong>Interest</strong></td><td>${lead.interest || "—"}</td></tr>
      <tr><td><strong>Land Status</strong></td><td>${lead.landStatus || "—"}</td></tr>
      <tr><td><strong>Timeframe</strong></td><td>${lead.timeframe || "—"}</td></tr>
      <tr><td><strong>Financing</strong></td><td>${lead.financingStatus || "—"}</td></tr>
      <tr><td><strong>Message</strong></td><td>${lead.message || "—"}</td></tr>
      <tr><td><strong>Source</strong></td><td>${lead.source}</td></tr>
      <tr><td><strong>Page</strong></td><td>${lead.pageUrl}</td></tr>
      <tr><td><strong>Submitted</strong></td><td>${lead.submittedAt}</td></tr>
    </table>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "leads@factorydirecthomescenter.com",
      to: LEAD_EMAIL_TO,
      subject: `New Lead: ${lead.firstName} ${lead.lastName} — ${lead.interest || "General Inquiry"}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API error ${res.status}: ${err}`);
  }

  console.log("[leads] Email sent to", LEAD_EMAIL_TO);
}

// ─── Channel 2: Google Sheets ──────────────────────────────────────────────

async function appendToSheet(lead: Record<string, string>) {
  if (!GOOGLE_SHEETS_ID || !GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.log("[leads] Sheets skipped — GOOGLE_SHEETS_ID or GOOGLE_SERVICE_ACCOUNT_KEY not set");
    return;
  }

  // Decode and parse the service account key (stored base64 to avoid JSON quoting issues in Vercel)
  const serviceAccount = JSON.parse(
    Buffer.from(GOOGLE_SERVICE_ACCOUNT_KEY, "base64").toString("utf-8")
  );

  // Get an access token via JWT (Google OAuth2 service account flow)
  const token = await getGoogleAccessToken(serviceAccount);

  const row = [
    lead.submittedAt,
    lead.firstName,
    lead.lastName,
    lead.email,
    lead.phone,
    lead.interest,
    lead.landStatus,
    lead.timeframe,
    lead.financingStatus,
    lead.message,
    lead.source,
    lead.pageUrl,
  ];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ values: [row] }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sheets API error ${res.status}: ${err}`);
  }

  console.log("[leads] Row appended to Google Sheets");
}

// Minimal JWT/OAuth2 for Google service accounts (no extra dependencies)
async function getGoogleAccessToken(sa: {
  client_email: string;
  private_key: string;
}) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const signingInput = `${encode(header)}.${encode(payload)}`;

  // Import the RSA private key and sign
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(signingInput)
  );

  const jwt = `${signingInput}.${Buffer.from(signature).toString("base64url")}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`Google token error: ${await tokenRes.text()}`);
  }

  const { access_token } = await tokenRes.json();
  return access_token as string;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const binary = atob(b64);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
  return buf.buffer;
}
