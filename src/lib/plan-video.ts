// A plan's video tour. DealerTide's detail record names a YouTube video in
// `video_url` for nine homes (2026-10-18; the list feed only flags
// `has_video`). The URL is stored on `floor_plans.video_url`, shown on the
// plan page as a privacy-enhanced embed (PlanVideo), and published as a
// VideoObject in the page graph ONLY once `video_published_on` is known —
// Google requires uploadDate on every VideoObject, and a guessed date is a
// fabricated one. Two of the nine carry a dollar figure in their YouTube
// title; those are never stored (the no-dollar-figure rule).

/** The 11-character video id out of any YouTube URL shape, or "". */
export function youtubeIdFrom(url: string | undefined | null): string {
  if (!url) return "";
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return "";
  }
  const host = u.hostname.replace(/^(www|m)\./, "");
  let id = "";
  if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const m = u.pathname.match(/^\/(?:embed|shorts|v|live)\/([^/?#]+)/);
    id = m ? m[1] : u.searchParams.get("v") || "";
  }
  return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : "";
}

export const youtubeEmbedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const youtubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
