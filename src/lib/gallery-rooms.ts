// The rooms of the /photos gallery. Kept free of imports: the page registry
// (src/lib/pages.ts) reads it, and the registry reaches client bundles.

export interface GalleryRoom {
  /** URL segment: /photos/<slug>. */
  slug: string;
  /** Short name for chips and crumbs ("Kitchens"). */
  label: string;
  /** Singular, title-cased, for "Mobile Home <heading> Pictures". */
  heading: string;
  /** describeImageFile() labels that belong in this room. */
  labels: readonly string[];
  /** One sentence under the room heading. Plain facts, no claims. */
  blurb: string;
}

export const GALLERY_ROOMS: readonly GalleryRoom[] = [
  {
    slug: "kitchens",
    label: "Kitchens",
    heading: "Kitchen",
    labels: ["kitchen", "kitchen island", "pantry"],
    blurb: "Islands, pantries, cabinet and countertop choices in Champion single wide, double wide and modular homes.",
  },
  {
    slug: "living-rooms",
    label: "Living rooms",
    heading: "Living Room",
    labels: ["living room", "family room", "great room", "den", "fireplace"],
    blurb: "Open living areas, family rooms and dens, photographed in finished homes.",
  },
  {
    slug: "primary-bedrooms",
    label: "Primary bedrooms",
    heading: "Primary Bedroom",
    labels: ["primary bedroom", "walk-in closet"],
    blurb: "Primary bedrooms and their walk-in closets.",
  },
  {
    slug: "bathrooms",
    label: "Bathrooms",
    heading: "Bathroom",
    labels: ["primary bathroom", "guest bathroom", "bathroom"],
    blurb: "Primary baths with showers and soaking tubs, and second bathrooms.",
  },
  {
    slug: "bedrooms",
    label: "Bedrooms",
    heading: "Bedroom",
    labels: ["bedroom"],
    blurb: "Second and third bedrooms, as built.",
  },
  {
    slug: "dining-rooms",
    label: "Dining",
    heading: "Dining Room",
    labels: ["dining area"],
    blurb: "Dining rooms and eat-in areas.",
  },
  {
    slug: "exteriors",
    label: "Exteriors",
    heading: "Exterior",
    labels: ["exterior", "rear exterior", "aerial exterior view", "porch"],
    blurb: "Siding, roof lines, porches and the outside of homes on site.",
  },
  {
    slug: "laundry-and-entry",
    label: "Laundry & entry",
    heading: "Laundry Room & Entry",
    labels: ["utility room", "entry", "hallway"],
    blurb: "Utility and laundry rooms, mudrooms and entries.",
  },
];

export function galleryRoom(slug: string): GalleryRoom | undefined {
  return GALLERY_ROOMS.find((r) => r.slug === slug);
}
