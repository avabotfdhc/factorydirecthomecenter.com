import type { Metadata } from "next";

export function generateLocationMetadata({ city, state }: { city: string; state: string }): Metadata {
  return {
    title: `Manufactured & Modular Homes in ${city}, ${state} | Factory Direct`,
    description: `Champion manufactured and modular homes delivered to ${city}, ${state}. Factory-direct pricing, line-item transparency, serving Indiana, Ohio, and Michigan from Auburn, IN.`,
  };
}
