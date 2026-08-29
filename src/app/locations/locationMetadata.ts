import type { Metadata } from "next";

export function generateLocationMetadata({ city, state }: { city: string; state: string }): Metadata {
  // Title only — the root layout metadata template wraps this with
  // " | Factory Direct Homes Center" automatically, so avoid duplicating the brand here.
  const stateAbbr = state === "Indiana" ? "IN" : state === "Ohio" ? "OH" : state === "Michigan" ? "MI" : state;
  return {
    title: `Manufactured Homes in ${city}, ${stateAbbr}`,
    description: `Champion manufactured and modular homes delivered to ${city}, ${state}. Factory-direct pricing, line-item transparency, serving Indiana, Ohio, and Michigan from Auburn, IN.`,
    alternates: {
      canonical: `/locations/${city.toLowerCase().replace(/\s+/g, "-")}`,
    },
  };
}
