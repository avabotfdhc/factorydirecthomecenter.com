import { NextResponse } from "next/server";

// POST /api/webhooks/new-lead — Supabase Database Webhook target.
//
// Configure in Supabase → Database → Webhooks: table `public.leads`, event
// INSERT, HTTP POST to https://factorydirecthomescenter.com/api/webhooks/new-lead
// with header `x-webhook-secret: <LEAD_WEBHOOK_SECRET>`. Sends a lead alert to
// the sales inbox through Resend (RESEND_API_KEY, already used by /api/leads).
//
// The secret is required: without it anyone could spam the sales inbox.

export const dynamic = "force-dynamic";

const SALES_EMAIL = process.env.LEAD_ALERT_EMAIL_TO || "sales@factorydirecthomescenter.com";
const FROM_EMAIL = "leads@factorydirecthomescenter.com";

interface LeadRecord {
  id?: string;
  created_at?: string;
  full_name?: string;
  contact_info?: string;
  target_county?: string;
  timeline?: string;
  model_interest?: string;
  series_interest?: string;
  source_page?: string;
  status?: string;
}

interface WebhookPayload {
  type?: string;
  table?: string;
  schema?: string;
  record?: LeadRecord;
}

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export async function POST(request: Request) {
  const secret = process.env.LEAD_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[new-lead] LEAD_WEBHOOK_SECRET is not set; refusing webhook");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }
  if (request.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (payload.type !== "INSERT" || payload.table !== "leads" || !payload.record) {
    // Not an event we act on; acknowledge so Supabase doesn't retry.
    return NextResponse.json({ ok: true, ignored: true });
  }

  const lead = payload.record;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[new-lead] RESEND_API_KEY not set; lead alert not emailed:", lead.id);
    return NextResponse.json({ ok: true, emailed: false });
  }

  const rows: Array<[string, unknown]> = [
    ["Name", lead.full_name],
    ["Contact", lead.contact_info],
    ["County", lead.target_county],
    ["Timeline", lead.timeline],
    ["Model", lead.model_interest],
    ["Series", lead.series_interest],
    ["Page", lead.source_page],
    ["Received", lead.created_at],
  ];
  const html = `
    <h2 style="color:#1e293b;font-family:sans-serif">New instant-quote lead</h2>
    <table cellpadding="6" cellspacing="0" style="font-family:sans-serif;font-size:14px">
      ${rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${esc(v) || "—"}</td></tr>`).join("")}
    </table>
    <p style="font-family:sans-serif;font-size:12px;color:#64748b">Lead ID ${esc(lead.id)} · Supabase leads table</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: SALES_EMAIL,
      subject: `New lead: ${lead.full_name || "Website visitor"} — ${lead.model_interest || "Direct Inquiry"}`,
      html,
    }),
  });
  if (!res.ok) {
    console.error("[new-lead] Resend error", res.status, (await res.text()).slice(0, 300));
    return NextResponse.json({ ok: false, error: "Email failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, emailed: true });
}
