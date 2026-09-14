// The one place customer reviews live.
//
// Why this file exists: until 2026-09-14 the homepage showed three quotes
// attributed to "David B." (Fort Wayne), "Sarah M." (Indianapolis) and
// "James T." (South Bend), and every blog post claimed a "4.8 Star rating
// from verified customers". Kyle confirmed those were placeholder copy from
// the original build — no such customers, no such rating. Invented reviews
// break Google's fake-engagement policy and the FTC's rule on endorsements,
// and the 2026 ranking-factors survey puts trust signals near the top, so a
// fabricated one is worse than none at all.
//
// The rule now: nothing in this file unless a real customer wrote it
// somewhere Kyle can point to. Paste the review text as published, with the
// reviewer's own name, the date, and the link. When REVIEWS is empty the site
// says so honestly and invites reviews instead of inventing them, and no
// AggregateRating is published — schema is generated from these rows, never
// from a hand-typed number.

import { BUSINESS } from "./business";

export interface CustomerReview {
  /** The review text exactly as the customer published it. Do not polish it. */
  quote: string;
  /** The reviewer's name as it appears on the review. */
  name: string;
  /** "Fort Wayne, IN" — only when the reviewer states it. */
  location?: string;
  /** Stars the reviewer actually gave, 1–5. */
  rating: number;
  /** ISO date the review was posted (YYYY-MM-DD). */
  date: string;
  /** Link to the review itself, or to the listing it sits on. */
  url?: string;
}

/**
 * Real, attributable reviews. Empty on purpose — see the note above.
 *
 * To add one, copy it verbatim from the Google listing:
 *   { quote: "…", name: "Jane Doe", location: "Auburn, IN",
 *     rating: 5, date: "2026-03-14", url: GOOGLE_REVIEWS_URL }
 */
export const REVIEWS: CustomerReview[] = [];

/** Where visitors read and leave reviews. Same listing as the business `sameAs`. */
export const GOOGLE_REVIEWS_URL = BUSINESS.sameAs[0];

/**
 * The rating to publish, computed from the reviews we actually hold — or null
 * when there are none. Callers must treat null as "publish no rating at all",
 * never as a reason to fall back to a default.
 */
export function reviewStats(): { ratingValue: number; reviewCount: number } | null {
  if (REVIEWS.length === 0) return null;
  const total = REVIEWS.reduce((sum, r) => sum + r.rating, 0);
  return {
    ratingValue: Math.round((total / REVIEWS.length) * 10) / 10,
    reviewCount: REVIEWS.length,
  };
}

/** True when the site has real reviews to show. */
export function hasReviews(): boolean {
  return REVIEWS.length > 0;
}
