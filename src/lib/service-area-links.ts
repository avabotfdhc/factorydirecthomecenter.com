// The town and county pages linked from every page (Footer) and from the
// homepage's "Areas we serve" block.
//
// Until 2026-10-13 nothing outside /locations linked a single location page,
// and a page with no internal links from the rest of the site is a page Google
// treats as unimportant: the competitor research that day found us absent
// from every Fort Wayne, Warsaw and Kendallville search while a Warsaw dealer
// ranked for "manufactured homes Auburn Indiana" with its own Auburn page.
//
// Labels are short place names for the footer; the homepage block prefixes
// them ("Manufactured homes in Fort Wayne, IN") because anchor text is part of
// what tells Google what the linked page is about. Every href must be a live
// route — tests/indexing.test.ts checks them against the page registry.

export interface ServiceAreaLink {
  href: string;
  label: string;
}

export const SERVICE_AREA_LINKS: ServiceAreaLink[] = [
  { href: "/locations/auburn", label: "Auburn, IN" },
  { href: "/locations/fort-wayne", label: "Fort Wayne, IN" },
  { href: "/locations/kendallville", label: "Kendallville, IN" },
  { href: "/locations/garrett", label: "Garrett, IN" },
  { href: "/locations/angola", label: "Angola, IN" },
  { href: "/locations/columbia-city", label: "Columbia City, IN" },
  { href: "/locations/kosciusko-county", label: "Warsaw & Kosciusko County" },
  { href: "/locations/elkhart-county", label: "Goshen & Elkhart County" },
  { href: "/locations", label: "All areas we serve" },
];
