"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Admin login — same credentials as the existing CMS admin panel.
export default function AdminLoginPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(json.message || "Login failed. Check your username and password.");
        setBusy(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-charcoal)] grain-overlay flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)] mb-3">
            Factory Direct Homes Center
          </p>
          <h1 className="font-serif text-4xl font-light text-white">
            Admin <span className="italic text-[var(--color-teal-light)]">Sign In</span>
          </h1>
          <p className="text-sm text-white/50 mt-3">
            Use your existing CMS admin username and password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium mb-2 text-[var(--color-charcoal)]">
              Username or Email
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoComplete="username"
              required
              className="w-full px-4 py-3 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-[var(--color-charcoal)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3.5 bg-[var(--color-teal)] text-white font-bold tracking-wider uppercase text-sm rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-white/30 mt-6">
          Authorized staff only. Sessions expire after 12 hours.
        </p>
      </div>
    </main>
  );
}
