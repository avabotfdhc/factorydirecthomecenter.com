// Series brochure fallbacks for listings whose CMS record has no brochure of
// its own. The Aspire links are Champion's own published Box shares (the
// full-resolution brochures are too large to host in-repo); repo-published
// series (Prime/Paramount) set brochureUrl on their entries instead.
const ASPIRE_BROCHURES: Record<string, string> = {
  "Single Wide": "https://championh.box.com/s/19m1o4gwanj21h8rryhwb065axzimqpx",
  "Multi-Section": "https://championh.box.com/s/v7u9pu1qsi0tpmt4gxvo2qxcrzf5je5z",
  "Modular": "https://championh.box.com/s/gibc21e0juupef6pm98gs40kki6g6r4v",
};

/** Champion-published brochure URL for a series/homeType, or "". */
export function seriesBrochure(series: string, homeType: string): string {
  if (series === "Aspire") return ASPIRE_BROCHURES[homeType] || "";
  return "";
}
