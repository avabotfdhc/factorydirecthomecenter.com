// Which floor plans sitemap.xml may publish, and when it must refuse.
//
// The catalogue read behind the sitemap degrades gracefully for *pages*:
// getSupabaseFloorPlans() swallows a CMS failure and getApiFloorPlans() then
// serves the repo-published copy, so a visitor still sees a home instead of a
// 500. For the sitemap that same fallback is actively wrong: the repo copy is
// 77 plans, 44 of them `dutch-aspire-*` URLs that 301 to their CMS twin, and
// the ~214 live CMS pages would simply vanish from the file. A sitemap that
// drops two hundred URLs and lists forty redirects teaches Google the opposite
// of the truth, and the ISR window caches it for an hour.
//
// So the sitemap asks for the catalogue strictly (`requireCms`) and this
// helper decides what to do when the answer is not trustworthy:
//
//   - at runtime, THROW. A metadata route that throws during revalidation
//     keeps serving the last good copy (ISR stale-on-error); with no copy at
//     all it answers 500, which Google records as "couldn't fetch" and retries
//     — nothing is de-indexed and nothing misleading is published. An error is
//     not cached, so the next request after the CMS recovers repairs it.
//   - during `next build`, publish the sitemap WITHOUT the floor-plan section.
//     Failing the build on a CMS blip would block every deploy (Supabase
//     answered 404 for two days in September 2026); the hourly revalidation
//     restores the section as soon as the CMS answers. Logged loudly.
//
// A CMS that answers 200 with far too few rows (an RLS change, a bulk
// deactivation, a wrong project) is treated the same as a failure, via the
// floor below.

/**
 * Fewer merged plans than this and the catalogue read is treated as degraded.
 * Repo-only (CMS unreachable) merges to 77 and the live catalogue is ~214, so
 * the floor sits between them with room for retirements. If the catalogue is
 * ever legitimately smaller than this, lower the floor in the same change.
 */
export const MIN_CMS_SITEMAP_PLANS = 120;

export interface CatalogueRead<T> {
  plans: T[];
  /** Whether a CMS is wired at all. A repo-only site is never "degraded". */
  cmsConfigured: boolean;
  /** The failure getApiFloorPlans({ requireCms: true }) threw, if any. */
  error?: unknown;
}

export function isBuildPhase(env: Record<string, string | undefined> = process.env): boolean {
  return env.NEXT_PHASE === "phase-production-build";
}

/**
 * The plans the sitemap may publish, or a throw when it must not publish any.
 * Pure: the caller does the fetching and tells it whether this is a build.
 */
export function planEntriesForSitemap<T>(
  read: CatalogueRead<T>,
  { buildPhase }: { buildPhase: boolean },
  log: Pick<Console, "error"> = console,
): T[] {
  if (!read.cmsConfigured) return read.plans;

  const reason = read.error
    ? `CMS read failed: ${read.error instanceof Error ? read.error.message : String(read.error)}`
    : read.plans.length < MIN_CMS_SITEMAP_PLANS
      ? `only ${read.plans.length} plans came back (floor ${MIN_CMS_SITEMAP_PLANS})`
      : null;
  if (!reason) return read.plans;

  const message = `[sitemap] catalogue DEGRADED, refusing to publish floor-plan URLs: ${reason}`;
  if (buildPhase) {
    log.error(`${message} — build-time render omits the floor-plan section; the hourly revalidation restores it`);
    return [];
  }
  throw new Error(message);
}
