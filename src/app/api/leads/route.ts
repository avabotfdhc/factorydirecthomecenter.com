import { NextResponse } from "next/server";

// ============================================
// LEAD CAPTURE API — factorydirecthomescenter.com
// ============================================
// POST /api/leads
//
// Channel 1 — Email via Resend
//   Requires env vars (add via: vercel env add <VAR> production):
//     RESEND_API_KEY   — from resend.com
//     LEAD_EMAIL_TO    — e.g. sales@factorydirecthomescenter.com
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
const LEAD_EMAIL_TO = process.env.LEAD_EMAIL_TO ?? "sales@factorydirecthomescenter.com";
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
    landStatus: body.landStatus ?? "",
    timeframe: body.timeframe ?? "",
    financingStatus: body.financingStatus ?? "",
    message: body.message ?? "",
    source: body.source ?? "Contact Form",
    pageUrl: body.pageUrl ?? "",
    submittedAt: new Date().toISOString(),
  };

  console.log("[leads] New submission:", lead.email, lead.firstName, lead.lastName);

  // Run both channels concurrently; neither failing blocks the response
  const [emailResult, sheetsResult, cmsResult] = await Promise.allSettled([
    sendEmail(lead),
    appendToSheet(lead),
    postToCms(lead),
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

  return NextResponse.json({ success: true, message: "Lead received" });
}

// ─── Channel 3: Factory Direct admin CMS (leads appear in the admin panel) ──
// Posts to the existing public enquiry endpoint so submissions land in the same
// place Kyle already manages leads. Rich fields the CMS enquiry model doesn't
// structure are summarized into the address field for visibility.

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
