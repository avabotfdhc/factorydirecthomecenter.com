"use client";

import { resetConsent } from "@/lib/consent";

// Lets a visitor change their mind after answering the banner. Required for the
// opt-out promise in the privacy policy to mean anything — without it, an
// "Accept" was permanent.
export function CookiePreferencesLink({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={resetConsent} className={className}>
      Cookie Preferences
    </button>
  );
}
