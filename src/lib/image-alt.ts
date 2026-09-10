/**
 * Alt text and image-URL helpers for catalogue photos.
 *
 * Champion's photo filenames carry the room in them
 * ("112-paramount-3260h32394-odyssey-bath.jpg", "lincoln-kitchen.webp"),
 * so gallery images can say what they show instead of "image 3".
 */

const SITE = "https://factorydirecthomescenter.com";

const ROOMS: [RegExp, string][] = [
  [/\b(primary|master)[-_ ]?(bath|bathroom)\b/, "primary bathroom"],
  [/\b(primary|master)[-_ ]?(bed|bedroom|suite)\b/, "primary bedroom"],
  [/\b(guest|second|2nd)[-_ ]?(bath|bathroom)\b/, "guest bathroom"],
  [/\bbath(room)?s?\b/, "bathroom"],
  [/\bbed(room)?s?\b/, "bedroom"],
  [/\bkitchen\b/, "kitchen"],
  [/\bisland\b/, "kitchen island"],
  [/\bpantry\b/, "pantry"],
  [/\bdining\b/, "dining area"],
  [/\bliving\b/, "living room"],
  [/\bfamily\b/, "family room"],
  [/\bgreat[-_ ]?room\b/, "great room"],
  [/\bden\b|\boffice\b|\bstudy\b/, "den"],
  [/\butility\b|\blaundry\b|\bmud(room)?\b/, "utility room"],
  [/\bcloset\b|\bwic\b/, "walk-in closet"],
  [/\bentry\b|\bfoyer\b/, "entry"],
  [/\bporch\b|\bdeck\b|\bpatio\b/, "porch"],
  [/\bexterior\b|\bext\b|\bfront\b|\bfacade\b|\belevation\b/, "exterior"],
  [/\brear\b|\bback\b/, "rear exterior"],
  [/\binterior\b/, "interior"],
  [/\bfireplace\b/, "fireplace"],
  [/\bcutaway\b/, "construction cutaway"],
  [/\b(floor[-_ ]?plan|floorplan|plan|sales|apb|apf|lit|l-?10[12]|drawing|sheet|opt\d*)\b/, "floor plan sheet"],
];

/** Human words for what a catalogue photo shows, read from its filename. */
export function describeImageFile(src: string): string {
  const file = decodeURIComponent(src.split("?")[0].split("/").pop() || "")
    .replace(/\.[a-z0-9]+$/i, "")
    .toLowerCase()
    .replace(/\b\d{4}[hm]\d{2}[a-z0-9]*\b/g, " ") // model numbers
    .replace(/\b(aspire|paramount|prime|dutch|redman|champion|web|jpgs?|img|dsc|photo|image|banner)\b/g, " ")
    .replace(/[-_]+/g, " ");
  for (const [re, label] of ROOMS) if (re.test(file)) return label;
  return "";
}

/** Alt text for the i-th of n gallery images of a home. */
export function planImageAlt(src: string, planName: string, homeType: string, i: number, n: number): string {
  const type = (homeType || "manufactured home").toLowerCase();
  const what = describeImageFile(src);
  const home = `${planName} ${type.includes("home") ? type : `${type} home`}`;
  if (what) return `${home} — ${what}${n > 1 ? ` (photo ${i + 1} of ${n})` : ""}`;
  return `${home} by Champion Homes${n > 1 ? ` — photo ${i + 1} of ${n}` : ""}`;
}

/** Absolute URL for an image path that may be site-relative. */
export function absoluteImageUrl(src: string | undefined | null): string {
  const s = String(src || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return `${SITE}${s.startsWith("/") ? "" : "/"}${s}`;
}

/** Hosts next/image may optimise (must match next.config images.remotePatterns). */
export function isOptimizableImage(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    const u = new URL(src);
    return (
      u.hostname === "factory-direct-homescenter.s3.us-east-1.amazonaws.com" ||
      (u.hostname.endsWith(".supabase.co") && u.pathname.startsWith("/storage/v1/object/public/"))
    );
  } catch {
    return false;
  }
}
