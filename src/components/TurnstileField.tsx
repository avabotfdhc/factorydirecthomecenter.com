"use client";

import { useEffect, useId, useRef } from "react";

// The browser half of the Turnstile check verified in src/lib/turnstile.ts.
//
// Renders NOTHING when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset, which is the
// state the site ships in: no script is loaded, no request is made to
// Cloudflare, and /api/leads keeps accepting submissions unchanged. Setting
// the two env vars is what turns the whole feature on.
//
// `appearance: "interaction-only"` is the CRO-relevant choice — real visitors
// see no widget and no checkbox at all, and the challenge surfaces only for
// the traffic Cloudflare cannot clear silently. A visible "I am not a robot"
// box in the middle of a quote form costs completions; this does not.

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          appearance?: "always" | "execute" | "interaction-only";
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "flexible" | "compact";
          "refresh-expired"?: "auto" | "manual" | "never";
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SCRIPT_ID = "cf-turnstile-script";

export function turnstileEnabled(): boolean {
  return Boolean(SITE_KEY);
}

/** Loads the Turnstile script once per page, whichever form asks first. */
function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => resolve(), { once: true });
    });
  }
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(), { once: true });
    // A blocked or failed script must not wedge the form: the server side
    // fails open the same way.
    script.addEventListener("error", () => resolve(), { once: true });
    document.head.appendChild(script);
  });
}

export function TurnstileField({ onToken }: { onToken: (token: string) => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Held in a ref so the widget is mounted once and never torn down just
  // because the parent re-rendered with a new closure.
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);
  const instanceId = useId();

  useEffect(() => {
    if (!SITE_KEY) return;
    let widgetId: string | undefined;
    let cancelled = false;

    loadScript().then(() => {
      if (cancelled || !hostRef.current || !window.turnstile) return;
      try {
        widgetId = window.turnstile.render(hostRef.current, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          theme: "light",
          size: "flexible",
          "refresh-expired": "auto",
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "error-callback": () => onTokenRef.current(""),
        });
      } catch {
        /* Widget failed to mount — server side fails open. */
      }
    });

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          /* already gone */
        }
      }
    };
  }, [instanceId]);

  if (!SITE_KEY) return null;
  // No fixed height: in interaction-only mode the widget is zero-height for
  // almost every visitor, so reserving space would open a permanent gap in
  // the form. When a challenge does appear it grows a block that is already
  // at the end of the form, below the last field, so nothing above it moves.
  return <div ref={hostRef} className="mt-3 empty:mt-0" />;
}
