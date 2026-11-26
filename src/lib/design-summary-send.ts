// Send a buyer the copy of their design they asked for: by email (Resend, the
// same account /api/leads already uses) and/or by text message (Twilio).
//
// Called from /api/leads after a Home Designer lead has passed the spam and
// Turnstile checks, so a copy only ever goes out for a real submission, only
// to the email and phone typed into that same submission, and only once every
// lead question is answered (`missingForCopy`). A text also needs the buyer's
// consent box ticked (SMS_CONSENT_TEXT).
//
// What goes in the copy is rebuilt here from the catalogue: the home is
// looked up by slug and every pick is checked against its board
// (`sanitizePicks`). The buyer's own name is the only text from the request
// that appears, escaped. Their notes are not included.
//
// Inert until configured, never throws, never blocks the lead:
//   Email — RESEND_API_KEY (already used for lead alerts). The sender is
//           DESIGN_COPY_FROM, default sales@ on the dealership's domain, which
//           must be a verified Resend domain.
//   Text  — TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and either
//           TWILIO_MESSAGING_SERVICE_SID or TWILIO_FROM_NUMBER. US texting from
//           a business number also needs Twilio's A2P 10DLC registration.

import { BUSINESS, SITE_URL } from "@/lib/business";
import { exteriorCatalog } from "@/lib/exterior-options";
import { planElevation } from "@/lib/plan-elevation";
import { findDesignerPlan, type DesignerPlanWithMedia } from "@/lib/designer-plans";
import {
  designLines,
  encodeDesign,
  EMAIL_RE,
  missingForCopy,
  sanitizePicks,
  toE164,
  type DesignCopyContact,
  type DesignCopyRequest,
  type DesignPicks,
} from "@/lib/design-summary";

export type CopyStatus = "sent" | "not-requested" | "not-configured" | "incomplete" | "failed";
export interface CopyResult {
  email: CopyStatus;
  sms: CopyStatus;
}

export function designCopyConfigured(env: NodeJS.ProcessEnv = process.env): { email: boolean; sms: boolean } {
  return {
    email: Boolean(env.RESEND_API_KEY),
    sms: Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && (env.TWILIO_MESSAGING_SERVICE_SID || env.TWILIO_FROM_NUMBER)),
  };
}

// ---------- the content ----------

export interface DesignCopy {
  firstName: string;
  home: DesignerPlanWithMedia;
  lines: string[];
  /** absolute URL of the design picture (PNG) */
  imageUrl: string | null;
  /** absolute URL of the floor plan (JPEG), when the home has one */
  floorPlanUrl: string | null;
  /** the home's page on the live site */
  planUrl: string;
}

const esc = (v: unknown): string =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const DAY_ABBR: Record<string, string> = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun" };
function clock(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return m ? `${h12}:${String(m).padStart(2, "0")}${suffix}` : `${h12}${suffix}`;
}
/** "Mon–Fri 9am–5pm · Sat 10am–4pm", from the one place the hours live. */
export function hoursLine(): string {
  return BUSINESS.hours
    .map((h) => {
      const days = h.days.length > 1 ? `${DAY_ABBR[h.days[0]]}–${DAY_ABBR[h.days[h.days.length - 1]]}` : DAY_ABBR[h.days[0]];
      return `${days} ${clock(h.opens)}–${clock(h.closes)}`;
    })
    .join(" · ");
}

const ADDRESS = `${BUSINESS.streetAddress}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postalCode}`;
const WEBSITE_DISPLAY = SITE_URL.replace(/^https?:\/\//, "");

export function buildDesignEmail(copy: DesignCopy): { subject: string; html: string; text: string } {
  const subject = `Your ${copy.home.name} design from ${BUSINESS.name}`;
  const teal = "#047857";
  const rows = copy.lines
    .map((line) => {
      const i = line.indexOf(": ");
      const [k, v] = i > 0 ? [line.slice(0, i), line.slice(i + 2)] : ["", line];
      return `<tr><td style="padding:6px 12px 6px 0;color:#6b6b6b;font-size:14px;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;color:#1a1a1a;font-size:14px">${esc(v)}</td></tr>`;
    })
    .join("");
  const picture = copy.imageUrl
    ? `<img src="${esc(copy.imageUrl)}" width="560" alt="${esc(`Your ${copy.home.name} design (illustration)`)}" style="display:block;width:100%;max-width:560px;height:auto;border:1px solid #e3e3e3;border-radius:8px">`
    : "";
  const floorPlan = copy.floorPlanUrl
    ? `<h2 style="font-family:Georgia,serif;font-weight:normal;font-size:20px;margin:28px 0 10px">Floor plan</h2>
       <a href="${esc(copy.planUrl)}"><img src="${esc(copy.floorPlanUrl)}" width="560" alt="${esc(`${copy.home.name} floor plan`)}" style="display:block;width:100%;max-width:560px;height:auto;border:1px solid #e3e3e3;border-radius:8px"></a>`
    : "";
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f8f7f4">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a">
<tr><td style="padding:24px 20px 8px;border-bottom:3px solid ${teal}">
  <div style="font-family:Georgia,serif;font-size:22px">${esc(BUSINESS.name)}</div>
  <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${teal};margin-top:4px">Champion homes, factory direct</div>
</td></tr>
<tr><td style="padding:24px 20px 8px">
  <p style="font-size:16px;margin:0 0 12px">Hi ${esc(copy.firstName)},</p>
  <p style="font-size:15px;line-height:1.5;margin:0 0 20px">Here is the ${esc(copy.home.name)} you designed on our website. Our team has your design and will follow up with your line-item quote.</p>
  ${picture}
  <h2 style="font-family:Georgia,serif;font-weight:normal;font-size:20px;margin:28px 0 10px">How you configured it</h2>
  <table role="presentation" cellpadding="0" cellspacing="0">${rows}</table>
  ${floorPlan}
  <p style="margin:28px 0 0"><a href="${esc(copy.planUrl)}" style="display:inline-block;background:${teal};color:#ffffff;text-decoration:none;font-size:13px;font-weight:bold;letter-spacing:.08em;text-transform:uppercase;padding:12px 20px;border-radius:6px">See the ${esc(copy.home.name)}</a></p>
</td></tr>
<tr><td style="padding:24px 20px;background:#faf8f4;border-top:1px solid #eee;font-size:14px;line-height:1.6">
  <strong>${esc(BUSINESS.name)}</strong><br>
  ${esc(ADDRESS)}<br>
  <a href="tel:${esc(BUSINESS.telephone.replace(/[^\d+]/g, ""))}" style="color:${teal}">${esc(BUSINESS.phoneDisplay)}</a> · <a href="mailto:${esc(BUSINESS.email)}" style="color:${teal}">${esc(BUSINESS.email)}</a><br>
  <a href="${esc(SITE_URL)}" style="color:${teal}">${esc(WEBSITE_DISPLAY)}</a><br>
  ${esc(hoursLine())}
</td></tr>
<tr><td style="padding:16px 20px;font-size:11px;line-height:1.5;color:#8a8a8a">The picture is an artist&rsquo;s illustration; colors are approximate, and porch, steps, foundation and landscaping are site-built and shown for illustration only. Options and availability are confirmed with Champion when you order. You received this email because you asked for a copy of your design at ${esc(WEBSITE_DISPLAY)}.</td></tr>
</table></td></tr></table></body></html>`;
  const text = [
    `Hi ${copy.firstName},`,
    "",
    `Here is the ${copy.home.name} you designed on our website. Our team has your design and will follow up with your line-item quote.`,
    "",
    "How you configured it:",
    ...copy.lines.map((l) => `- ${l}`),
    "",
    copy.imageUrl ? `Picture of your design: ${copy.imageUrl}` : "",
    copy.floorPlanUrl ? `Floor plan: ${copy.floorPlanUrl}` : "",
    `See the ${copy.home.name}: ${copy.planUrl}`,
    "",
    BUSINESS.name,
    ADDRESS,
    `${BUSINESS.phoneDisplay} · ${BUSINESS.email}`,
    WEBSITE_DISPLAY,
    hoursLine(),
  ]
    .filter((l, i, all) => l !== "" || all[i - 1] !== "")
    .join("\n");
  return { subject, html, text };
}

/** One text: who it is from, the home, the main picks, the links, and how to stop. */
export function buildDesignSms(copy: DesignCopy): string {
  const keep = /^(Siding color|Shingle color|Shutter color|Window trim|Black Exterior|Front door|Gable shake accent|Dormer|Elevation option|Cabinet finish|Flooring|Countertop)/;
  const picks = copy.lines
    .filter((l) => keep.test(l))
    .map((l) => l.replace(/ \((shown|not drawn)[^)]*\)/g, "").replace(/ \(black soffit[^)]*\)/, ""))
    .slice(0, 8);
  return [
    `${BUSINESS.name}: Hi ${copy.firstName}, here is your ${copy.home.name} design.`,
    ...picks,
    copy.floorPlanUrl ? "Your design picture and floor plan are attached." : "Your design picture is attached.",
    `See the home: ${copy.planUrl}`,
    `Questions? Call ${BUSINESS.phoneDisplay}`,
    `${ADDRESS} · ${WEBSITE_DISPLAY}`,
    "Reply STOP to opt out.",
  ].join("\n");
}

// ---------- sending ----------

async function sendEmail(to: string, copy: DesignCopy, env: NodeJS.ProcessEnv): Promise<void> {
  const { subject, html, text } = buildDesignEmail(copy);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RESEND_API_KEY}` },
    body: JSON.stringify({
      from: env.DESIGN_COPY_FROM || `${BUSINESS.name} <${BUSINESS.email}>`,
      to,
      reply_to: BUSINESS.email,
      subject,
      html,
      text,
    }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

async function sendSms(to: string, copy: DesignCopy, env: NodeJS.ProcessEnv): Promise<void> {
  const form = new URLSearchParams({ To: to, Body: buildDesignSms(copy) });
  if (env.TWILIO_MESSAGING_SERVICE_SID) form.set("MessagingServiceSid", env.TWILIO_MESSAGING_SERVICE_SID);
  else form.set("From", env.TWILIO_FROM_NUMBER || "");
  for (const media of [copy.imageUrl, copy.floorPlanUrl]) if (media) form.append("MediaUrl", media);
  const auth = Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString("base64");
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(env.TWILIO_ACCOUNT_SID || "")}/Messages.json`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${auth}` },
    body: form,
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`Twilio ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

/** Build the copy from the catalogue. Null when the home is not one we sell. */
export async function buildDesignCopy(firstName: string, rawDesign: Partial<Record<keyof DesignPicks, unknown>>, origin: string): Promise<DesignCopy | null> {
  const home = await findDesignerPlan(String(rawDesign.home || ""));
  if (!home) return null;
  const catalog = exteriorCatalog(home.series, home.homeType, home.widthFt);
  const picks = sanitizePicks(rawDesign, catalog);
  const elevation = planElevation({ modelNumber: home.modelNumber, lengthFt: home.lengthFt, widthFt: home.widthFt, beds: home.beds });
  const base = origin.replace(/\/+$/, "");
  return {
    firstName,
    home,
    lines: designLines({ home, catalog, picks, elevation, audience: "buyer" }),
    imageUrl: elevation ? `${base}/api/design-summary/image?d=${encodeDesign(picks)}` : null,
    floorPlanUrl: home.floorPlanImage ? `${base}/api/design-summary/floor-plan?home=${encodeURIComponent(home.slug)}` : null,
    planUrl: `${SITE_URL}/floor-plans/${encodeURIComponent(home.slug)}`,
  };
}

/**
 * Send the copy the buyer asked for. Never throws: each channel reports what
 * happened so the designer can tell the buyer, and the lead is untouched
 * whatever happens here.
 */
export async function sendDesignCopy(args: {
  contact: DesignCopyContact;
  rawDesign: Partial<Record<keyof DesignPicks, unknown>> | null;
  request: DesignCopyRequest;
  smsConsent: boolean;
  origin: string;
  env?: NodeJS.ProcessEnv;
}): Promise<CopyResult> {
  const env = args.env || process.env;
  const result: CopyResult = { email: args.request.email ? "failed" : "not-requested", sms: args.request.sms ? "failed" : "not-requested" };
  if (!args.request.email && !args.request.sms) return result;

  // The gate: every lead question answered, and a real home.
  if (missingForCopy(args.contact).length || !args.rawDesign) {
    if (args.request.email) result.email = "incomplete";
    if (args.request.sms) result.sms = "incomplete";
    return result;
  }
  const configured = designCopyConfigured(env);
  let copy: DesignCopy | null;
  try {
    copy = await buildDesignCopy(args.contact.firstName.trim(), args.rawDesign, args.origin);
  } catch (err) {
    console.error("[design-copy] could not build the copy:", err instanceof Error ? err.message : err);
    return result;
  }
  if (!copy) {
    if (args.request.email) result.email = "incomplete";
    if (args.request.sms) result.sms = "incomplete";
    return result;
  }

  const jobs: Promise<void>[] = [];
  if (args.request.email) {
    const to = args.contact.email.trim();
    if (!configured.email) result.email = "not-configured";
    else if (!EMAIL_RE.test(to)) result.email = "incomplete";
    else
      jobs.push(
        sendEmail(to, copy, env).then(
          () => {
            result.email = "sent";
          },
          (err) => console.error("[design-copy] email failed:", err instanceof Error ? err.message : err),
        ),
      );
  }
  if (args.request.sms) {
    const to = toE164(args.contact.phone);
    if (!args.smsConsent || !to) result.sms = "incomplete";
    else if (!configured.sms) result.sms = "not-configured";
    else
      jobs.push(
        sendSms(to, copy, env).then(
          () => {
            result.sms = "sent";
          },
          (err) => console.error("[design-copy] text failed:", err instanceof Error ? err.message : err),
        ),
      );
  }
  await Promise.all(jobs);
  console.log(`[design-copy] email=${result.email} sms=${result.sms} home=${copy.home.slug}`);
  return result;
}
