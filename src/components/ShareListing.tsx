"use client";

import { useState } from "react";

// Lets a visitor send a floor plan to themselves or someone else. On phones
// the native share sheet (navigator.share) covers text/iMessage/WhatsApp/
// email in one tap; the explicit Text / Email / Copy buttons cover desktop
// and older browsers. No backend involved — sms:/mailto: links compose the
// message in the visitor's own apps, so nothing is collected or stored.
export function ShareListing({
  name,
  url,
  summary,
}: {
  name: string;
  url: string;
  summary: string;
}) {
  const [copied, setCopied] = useState(false);

  const message = `Check out the ${name} at Factory Direct Homes Center — ${summary} ${url}`;
  const smsHref = `sms:?&body=${encodeURIComponent(message)}`;
  const emailHref = `mailto:?subject=${encodeURIComponent(`${name} — Factory Direct Homes Center`)}&body=${encodeURIComponent(`${message}\n\nQuestions? Call (260) 308-1457.`)}`;

  const nativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: name, text: `Check out the ${name} — ${summary}`, url });
        return true;
      }
    } catch {
      /* visitor dismissed the sheet */
    }
    return false;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the sms/email buttons still work */
    }
  };

  const btn =
    "inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase rounded-lg border-2 border-[var(--color-charcoal)]/12 text-[var(--color-charcoal)]/80 hover:border-[var(--color-teal)]/40 hover:text-[var(--color-teal)] transition-colors";

  return (
    <div className="mt-6">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] mb-2.5">
        Share this home
      </p>
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={async () => {
            if (!(await nativeShare())) copyLink();
          }}
          className={btn}
          aria-label={`Share the ${name}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
          Share
        </button>
        <a href={smsHref} className={btn} aria-label={`Text a link to the ${name}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          Text
        </a>
        <a href={emailHref} className={btn} aria-label={`Email a link to the ${name}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          Email
        </a>
        <button type="button" onClick={copyLink} className={btn} aria-label="Copy link to this home">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
