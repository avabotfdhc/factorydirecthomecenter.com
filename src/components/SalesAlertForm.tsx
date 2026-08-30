"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { trackLeadFormStart, trackLeadFormSubmit } from "@/lib/analytics";

// The sale page's "Sales Alert" sign-up was a bare <form> with an unnamed email
// input and no submit handler: every address typed into it was discarded on
// submit and the visitor got a page reload for their trouble. This posts to
// /api/leads like every other form on the site.
//
// The lead API requires a first and last name, so we ask for a name rather than
// inventing a placeholder that would land junk in the CRM.
export function SalesAlertForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  // "dark" = sits on the teal/navy gradient; "light" = sits on a pale section.
  const onDark = tone === "dark";
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [started, setStarted] = useState(false);

  const onFirstInput = () => {
    if (!started) {
      setStarted(true);
      trackLeadFormStart("sales_alert");
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const fullName = (data.get("name")?.toString() || "").trim();
    const email = (data.get("email")?.toString() || "").trim();

    if (!fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please add your name and a valid email address.");
      setStatus("error");
      return;
    }

    const [firstName, ...rest] = fullName.split(/\s+/);
    const lastName = rest.join(" ") || firstName;

    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          interest: "Sales alerts",
          message: "Requested email alerts for new promotions, clearance homes, and factory-direct deals.",
          source: "Homes on Sale — Sales Alert",
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error(`lead post failed: ${res.status}`);
      trackLeadFormSubmit("sales_alert", { name: fullName, email });
      setStatus("done");
    } catch {
      setErrorMsg("Something went wrong. Please try again, or call (260) 308-1457.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className={`font-semibold max-w-md mx-auto ${onDark ? "text-white" : "text-gray-900"}`}>
        You&rsquo;re on the list. We&rsquo;ll email you when the next promotion or clearance home lands.
      </p>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit} onFocus={onFirstInput}>
        <label htmlFor="alert-name" className="sr-only">
          Your name
        </label>
        <input
          id="alert-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          className="flex-1 px-5 py-4 rounded-lg text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
        />
        <label htmlFor="alert-email" className="sr-only">
          Email address
        </label>
        <input
          id="alert-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          className="flex-1 px-5 py-4 rounded-lg text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-8 py-4 bg-[#84cc16] hover:bg-[#65a30d] disabled:opacity-60 text-white font-bold rounded-lg transition-colors whitespace-nowrap"
        >
          {status === "submitting" ? "Sending…" : "Get Alerts"}
        </button>
      </form>

      {status === "error" && (
        <p role="alert" className={`mt-3 text-sm ${onDark ? "text-yellow-200" : "text-red-600"}`}>
          {errorMsg}
        </p>
      )}

      <p className={`mt-4 text-xs leading-relaxed ${onDark ? "text-white/70" : "text-gray-500"}`}>
        We email you about promotions and new homes only, and you can unsubscribe any time. Your
        information is never sold or shared. See our{" "}
        <Link href="/privacy" className={`underline ${onDark ? "hover:text-white" : "hover:text-[#2c7a7b]"}`}>
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
