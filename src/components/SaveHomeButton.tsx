"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { toggleSavedHome, useSavedHomes, type SavedHome } from "@/lib/saved-homes";

// The heart on a floor-plan card and the "Save this home" button on a plan
// page. Saving is local to the browser (src/lib/saved-homes.ts) and reports
// `save_home` / `unsave_home` to GA4 so the list's use can be measured.
//
// On the server and the first client render nothing is saved (the list lives
// in localStorage), so the button renders unpressed and corrects itself after
// hydration without a mismatch.

const Heart = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
    focusable="false"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20.5s-7.5-4.6-9.4-9.3C1.4 8.2 3.3 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.6 0 5.5 3.7 4.3 6.7-1.9 4.7-9.4 9.3-9.4 9.3z"
    />
  </svg>
);

export function SaveHomeButton({
  home,
  variant = "icon",
  location,
}: {
  home: SavedHome;
  /** "icon": round heart over a card photo. "full": labelled button on a plan page. */
  variant?: "icon" | "full";
  /** Where the button sits, for GA4. */
  location: string;
}) {
  const saved = useSavedHomes();
  const isSaved = saved.some((h) => h.slug === home.slug);

  const onClick = () => {
    const now = toggleSavedHome(home);
    trackEvent(now ? "save_home" : "unsave_home", {
      item_name: home.name,
      item_category: home.homeType,
      location,
      saved_count: saved.length + (now ? 1 : -1),
    });
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isSaved}
        aria-label={isSaved ? `Remove the ${home.name} from saved homes` : `Save the ${home.name}`}
        title={isSaved ? "Saved — tap to remove" : "Save this home"}
        className={`absolute bottom-3 left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-sm border transition-colors ${
          isSaved
            ? "bg-[var(--color-teal)] text-white border-[var(--color-teal)]"
            : "bg-white/95 text-[var(--color-charcoal)] border-[var(--color-charcoal)]/10 hover:text-[var(--color-teal)]"
        }`}
      >
        <Heart filled={isSaved} />
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isSaved}
        className={`inline-flex items-center gap-2 rounded border px-4 py-2.5 text-sm font-semibold transition-colors ${
          isSaved
            ? "bg-[var(--color-teal)] text-white border-[var(--color-teal)]"
            : "bg-white text-[var(--color-charcoal)] border-[var(--color-charcoal)]/20 hover:border-[var(--color-teal)]"
        }`}
      >
        <Heart filled={isSaved} />
        {isSaved ? "Saved" : "Save this home"}
      </button>
      {saved.length > 0 && (
        <Link href="/saved" className="text-sm font-medium text-[var(--color-teal)] hover:underline">
          View saved homes ({saved.length}) →
        </Link>
      )}
    </div>
  );
}

/** "♥ 3 saved homes · Compare" — renders nothing until something is saved. */
export function SavedHomesLink({ className = "" }: { className?: string }) {
  const saved = useSavedHomes();
  if (saved.length === 0) return null;
  return (
    <Link
      href="/saved"
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--color-teal)]/30 bg-white px-4 py-2 text-sm font-medium text-[var(--color-teal)] hover:border-[var(--color-teal)] ${className}`}
    >
      <Heart filled />
      {saved.length} saved {saved.length === 1 ? "home" : "homes"} · view &amp; compare
    </Link>
  );
}
