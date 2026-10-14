import { localBlogPosts } from "@/lib/local-posts";

// Town posts that link only their town's location page, not a county page.
// Without this map, Allen County listed none of its eight town posts and DeKalb
// none of its five. Keyed by county page slug; values are post slugs.
const TOWN_PAGE_ONLY: Record<string, string[]> = {
  "allen-county": [
    "manufactured-homes-fort-wayne-buyers-guide",
    "manufactured-homes-new-haven-indiana",
    "manufactured-homes-huntertown-indiana",
    "manufactured-homes-leo-cedarville-indiana",
    "manufactured-homes-grabill-indiana",
    "manufactured-homes-harlan-indiana",
    "manufactured-homes-woodburn-indiana",
    "manufactured-homes-monroeville-indiana",
  ],
  "dekalb-county": [
    "manufactured-homes-auburn-indiana-guide",
    "manufactured-homes-garrett-indiana",
    "manufactured-homes-waterloo-indiana",
    "manufactured-homes-butler-indiana",
    "manufactured-homes-st-joe-indiana",
  ],
  "noble-county": ["manufactured-homes-ligonier-indiana"],
  "whitley-county": ["manufactured-homes-churubusco-indiana"],
};

export const townPageOnlyPosts = TOWN_PAGE_ONLY;

/**
 * Every published town post for a county page: the posts that link the county
 * page itself, the posts mapped above, and any listed by hand. Scheduled posts
 * are absent until a build publishes them, so a county never links a 404.
 */
export function countyPostLinks(
  countySlug: string,
  extra: { href: string; label: string }[] = [],
): { href: string; label: string }[] {
  const seen = new Set<string>();
  const out: { href: string; label: string }[] = [];
  const add = (href: string, label: string) => {
    if (seen.has(href)) return;
    seen.add(href);
    out.push({ href, label });
  };
  for (const p of extra) add(p.href, p.label);
  const target = `/locations/${countySlug}"`;
  const mapped = new Set(TOWN_PAGE_ONLY[countySlug] ?? []);
  for (const post of localBlogPosts) {
    if (post.html.includes(target) || mapped.has(post.slug)) add(`/blog/${post.slug}`, post.title);
  }
  return out;
}
