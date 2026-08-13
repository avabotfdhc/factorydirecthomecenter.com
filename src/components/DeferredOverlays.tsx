"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// LiveChat and ExitIntentPopup are overlays that no visitor needs during the
// first seconds of a page view, yet they hydrated on every page and contributed
// to mobile Total Blocking Time. Load them after the browser goes idle so the
// main thread is free while the page becomes interactive.
const LiveChat = dynamic(() => import("./LiveChat").then((m) => m.LiveChat), { ssr: false });
const ExitIntentPopup = dynamic(() => import("./ExitIntentPopup").then((m) => m.ExitIntentPopup), { ssr: false });

export function DeferredOverlays() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const go = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = (window as Window & typeof globalThis).requestIdleCallback(go, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(go, 3000);
    return () => clearTimeout(t);
  }, []);

  if (!ready) return null;
  return (
    <>
      <LiveChat />
      <ExitIntentPopup />
    </>
  );
}
