import { NextResponse } from "next/server";
import { NO_EMAIL_PLACEHOLDER, pushLeadToDealertide } from "@/lib/dealertide";
import { leadsStoreConfigured, storeLead } from "@/lib/leads-store";
import { spamVerdict } from "@/lib/anti-spam";

// DealerTide is tried twice with a 6s timeout each (see lib/dealertide.ts) and
// the other channels run alongside it. Give the function room so a slow CRM
// can never get the whole lead killed mid-flight by the platform default.
export const maxDuration = 30;

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

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : v == null ? "" : String(v));

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Bots get the same 200 a person gets and nothing is forwarded or stored.
  const spam = spamVerdict(body);
  if (spam) {
    console.log(`[leads] Dropped as spam (${spam})`);
    return NextResponse.json({ success: true, message: "Lead received" }, { status: 200 });
  }

  // A lead needs a name and one way to reach the person. Requiring an email
  // used to force the instant-quote path to invent one, which DealerTide then
  // deduped every phone-only lead against. Phone alone is fine.
  const email = str(body.email).toLowerCase() === NO_EMAIL_PLACEHOLDER ? "" : str(body.email);
  const phone = str(body.phone);
  if (!str(body.firstName) || !str(body.lastName) || (!email && !phone)) {
    return NextResponse.json(
      { error: "Missing required fields: firstName, lastName, and an email or phone" },
      { status: 400 }
    );
  }

  const lead = {
    firstName: str(body.firstName),
    lastName: str(body.lastName),
    email,
    phone,
    interest: str(body.interest),
    deliveryState: str(body.deliveryState),
    bedrooms: str(body.bedrooms),
    landStatus: str(body.landStatus),
    timeframe: str(body.timeframe),
    financingStatus: str(body.financingStatus),
    message: str(body.message),
    source: str(body.source) || "Contact Form",
    pageUrl: str(body.pageUrl),
    submittedAt: new Date().toISOString(),
  };
  // The instant-quote server action stores its own copy before calling us.
  const skipStore = body.skipStore === true || body.skipStore === "true";

  console.log("[leads] New submission:", lead.email, lead.firstName, lead.lastName);

  // Everything the salesperson needs to act, in the one free-text field
  // DealerTide is known to accept. The top-level payload stays as it was —
  // their /leads schema was only ever confirmed by probing, so no new fields
  // are guessed at here.
  const dtMessage = [
    `Form: ${lead.source}`,
    lead.interest && `Interest: ${lead.interest}`,
    lead.deliveryState && `Delivery: ${lead.deliveryState}`,
    lead.timeframe && `Timeframe: ${lead.timeframe}`,
    lead.financingStatus && `Financing: ${lead.financingStatus}`,
    lead.landStatus && `Land: ${lead.landStatus}`,
    lead.bedrooms && `Bedrooms: ${lead.bedrooms}`,
    lead.message && `Message: ${lead.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  // Run all channels concurrently; no single failure blocks the response
  const [storeResult, emailResult, sheetsResult, dtResult] = await Promise.allSettled([
    // Durable copy first, so nothing downstream can lose the lead.
    skipStore
      ? Promise.resolve<string | null>(null)
      : storeLead({
          fullName: `${lead.firstName} ${lead.lastName}`,
          contactInfo: [lead.phone, lead.email].filter(Boolean).join(" · "),
          targetCounty: lead.deliveryState,
          timeline: lead.timeframe,
          modelInterest: lead.interest,
          sourcePage: lead.pageUrl,
        }),
    sendEmail(lead),
    appendToSheet(lead),
    // DealerTide CRM — key's inbound-lead automation handles source defaulting,
    // Auburn location assignment, and email/phone dedupe on their side.
    pushLeadToDealertide({
      first_name: lead.firstName,
      last_name: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      source: "Website",
      message: dtMessage,
      page_url: lead.pageUrl,
    }),
  ]);

  if (storeResult.status === "rejected") {
    console.error("[leads] Supabase store failed:", storeResult.reason);
  } else if (!skipStore && storeResult.value === null && !leadsStoreConfigured()) {
    console.log("[leads] Supabase store skipped — Supabase env vars not set");
  }
  if (emailResult.status === "rejected") {
    console.error("[leads] Email channel failed:", emailResult.reason);
  }
  if (sheetsResult.status === "rejected") {
    console.error("[leads] Sheets channel failed:", sheetsResult.reason);
  }
  // DealerTide is the CRM of record, so say what happened either way — a
  // silent success is indistinguishable from a silent drop in the logs.
  if (dtResult.status === "rejected") {
    console.error("[leads] DealerTide channel threw:", dtResult.reason);
  } else if (dtResult.value.ok) {
    console.log(`[leads] DealerTide accepted (${dtResult.value.status} ${dtResult.value.detail}, attempt ${dtResult.value.attempts})`);
  } else {
    console.error(`[leads] DealerTide channel failed after ${dtResult.value.attempts} attempt(s): ${dtResult.value.detail}`);
  }

  // Tell a human when the CRM of record did not get a clean 201 — a failure,
  // or a 202 "duplicate" (a repeat inquiry DealerTide skipped, which means the
  // second request's content never reached the CRM). Inert until
  // RESEND_API_KEY is set; never throws; never blocks the visitor.
  if (dtResult.status === "rejected") {
    await notifyLeadProblem(lead, "failed", String(dtResult.reason));
  } else if (!dtResult.value.ok) {
    await notifyLeadProblem(lead, "failed", dtResult.value.detail);
  } else if (dtResult.value.status === 202) {
    await notifyLeadProblem(lead, "duplicate", dtResult.value.detail);
  }
  if (storeResult.status === "rejected") {
    await notifyLeadProblem(lead, "store-failed", String(storeResult.reason));
  }

  return NextResponse.json({ success: true, message: "Lead received" });
}



// ─── Channel 1: Resend email ───────────────────────────────────────────────

// Visitor-typed text goes into HTML email bodies below. Escape it.
function escapeHtml(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function escapeAll(lead: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(lead).map(([k, v]) => [k, escapeHtml(v)]));
}

async function resendSend(subject: string, html: string): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({ from: "leads@factorydirecthomescenter.com", to: LEAD_EMAIL_TO, subject, html }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`Resend API error ${res.status}: ${await res.text()}`);
}

type LeadProblem = "failed" | "duplicate" | "store-failed";

/**
 * Email the sales inbox when a lead did not land cleanly in the CRM of record.
 * Skipped when RESEND_API_KEY is unset (the failure is still in the logs).
 * Never throws: alerting must not break lead capture.
 */
async function notifyLeadProblem(rawLead: Record<string, string>, kind: LeadProblem, detail: string): Promise<void> {
  if (!RESEND_API_KEY) return;
  const lead = escapeAll(rawLead);
  const name = `${lead.firstName} ${lead.lastName}`.trim();
  const headline =
    kind === "failed"
      ? "⚠️ Lead NOT delivered to DealerTide"
      : kind === "duplicate"
        ? "ℹ️ Repeat inquiry — DealerTide skipped it as a duplicate"
        : "⚠️ Lead not saved to Supabase";
  const action =
    kind === "failed"
      ? "Enter this lead in DealerTide by hand. A copy is in Supabase → leads."
      : kind === "duplicate"
        ? "DealerTide matched an existing contact and did not record this new request. Check the contact and add this inquiry to it. A copy is in Supabase → leads."
        : "DealerTide has this lead; the Supabase copy failed. Nothing to enter by hand, but the reconciliation table is missing a row.";
  const html = `
    <h2 style="color:#1a1a1a">${headline}</h2>
    <p style="font-family:sans-serif;font-size:14px"><strong>${escapeHtml(action)}</strong></p>
    <table cellpadding="6" cellspacing="0" style="font-family:sans-serif;font-size:14px">
      <tr><td><strong>Name</strong></td><td>${name}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${lead.phone || "—"}</td></tr>
      <tr><td><strong>Email</strong></td><td>${lead.email || "—"}</td></tr>
      <tr><td><strong>Interest</strong></td><td>${lead.interest || "—"}</td></tr>
      <tr><td><strong>Delivery</strong></td><td>${lead.deliveryState || "—"}</td></tr>
      <tr><td><strong>Timeframe</strong></td><td>${lead.timeframe || "—"}</td></tr>
      <tr><td><strong>Financing</strong></td><td>${lead.financingStatus || "—"}</td></tr>
      <tr><td><strong>Message</strong></td><td>${lead.message || "—"}</td></tr>
      <tr><td><strong>Form</strong></td><td>${lead.source}</td></tr>
      <tr><td><strong>Page</strong></td><td>${lead.pageUrl || "—"}</td></tr>
      <tr><td><strong>Submitted</strong></td><td>${lead.submittedAt}</td></tr>
      <tr><td><strong>Detail</strong></td><td><code>${escapeHtml(detail)}</code></td></tr>
    </table>
  `;
  try {
    await resendSend(`${headline}: ${name}`, html);
    console.log(`[leads] Problem alert emailed (${kind}) to`, LEAD_EMAIL_TO);
  } catch (err) {
    console.error(`[leads] Problem alert (${kind}) could not be emailed:`, err instanceof Error ? err.message : err);
  }
}

// ─── Channel 1: Resend email ───────────────────────────────────────────────
async function sendEmail(rawLead: Record<string, string>) {
  if (!RESEND_API_KEY) {
    console.log("[leads] Email skipped — RESEND_API_KEY not set");
    return;
  }
  const lead = escapeAll(rawLead);

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
