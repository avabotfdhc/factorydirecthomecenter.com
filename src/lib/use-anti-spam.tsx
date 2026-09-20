"use client";

import { useEffect, useRef, type ReactElement } from "react";
import { TurnstileField } from "@/components/TurnstileField";

// Pair with spamVerdict() in src/lib/anti-spam.ts. Render `fields` anywhere
// inside the form's markup and spread `payload()` into the JSON body on submit.
//
// The honeypot is positioned off-screen rather than display:none, because
// some bots skip inputs that are not "visible" in the DOM sense. It is
// aria-hidden and tabIndex -1 so screen readers and keyboard users never
// land on it, and autoComplete off so browsers do not helpfully fill it.
//
// `fields` also carries the Cloudflare Turnstile widget, which renders nothing
// at all until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. Putting it here rather
// than in each form means all seven callers gained bot verification without a
// line of change, and the eighth gets it by using this hook.
export function useAntiSpam(): {
  fields: ReactElement;
  payload: () => { hp: string; fillMs?: number; turnstileToken?: string };
} {
  // Set after mount, not during render: the clock is impure and the value is
  // only meaningful once the visitor can actually see the form.
  const mountedAt = useRef<number | null>(null);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  const hpRef = useRef<HTMLInputElement>(null);
  const turnstileToken = useRef("");

  const fields = (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input ref={hpRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <TurnstileField
        onToken={(token) => {
          turnstileToken.current = token;
        }}
      />
    </>
  );

  const payload = () => ({
    hp: hpRef.current?.value ?? "",
    ...(mountedAt.current !== null ? { fillMs: Date.now() - mountedAt.current } : {}),
    ...(turnstileToken.current ? { turnstileToken: turnstileToken.current } : {}),
  });

  return { fields, payload };
}
