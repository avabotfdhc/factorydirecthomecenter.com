import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo";

export function generateLocationMetadata({ city, state }: { city: string; state: string }): Metadata {
  // Title only — the root layout metadata template wraps this with
  // " | Factory Direct Homes Center" automatically, so avoid duplicating the brand here.
  const stateAbbr = state === "Indiana" ? "IN" : state === "Ohio" ? "OH" : state === "Michigan" ? "MI" : state;
  const path = `/locations/${city.toLowerCase().replace(/\s+/g, "-")}`;
  // genMeta adds canonical + hreflang, Open Graph and Twitter images (with
  // alt) and the image-preview robots directive for the page's own URL.
  return genMeta({
    title: `Manufactured Homes in ${city}, ${stateAbbr}`,
    description: `Champion manufactured and modular homes delivered to ${city}, ${state}. Factory-direct pricing, line-item transparency, serving Indiana, Ohio, and Michigan from Auburn, IN.`,
    url: path,
    imageAlt: `Champion manufactured homes delivered to ${city}, ${state} by Factory Direct Homes Center`,
  });
}
