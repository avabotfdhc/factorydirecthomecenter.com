// Homepage video (Semrush On Page SEO Checker, 2026-08-20: higher-ranking
// rivals for "mobile homes for sale direct from factory" embed a video).
//
// Fill in ONE of `youtubeId` or `mp4Url` and the "See a Champion home"
// section renders on the homepage with VideoObject structured data. While
// both are empty the section is skipped entirely.
//
// Champion shares finished video tours in its Box library (search "Video
// Tour" / "reel" — e.g. "2852H32103 - Video Tour [Original].mp4",
// "Aspire 1676H32090 Video Tour [Original].mp4", "112-paramount-westbrook-
// drone-view-v2.mp4"). Upload one to YouTube (or to the `floor-plans`
// storage bucket) and paste its id / URL here.
export interface HomeVideoConfig {
  /** YouTube video id, e.g. "dQw4w9WgXcQ" — rendered as a privacy-enhanced embed. */
  youtubeId: string;
  /** Direct MP4 URL (S3 / Supabase storage) — rendered with a native <video> player. */
  mp4Url: string;
  /** Site-relative or absolute poster image; also the schema thumbnail. */
  poster: string;
  name: string;
  description: string;
  /** ISO 8601 date the video was published (required by Google for VideoObject). */
  uploadDate: string;
  /** ISO 8601 duration, e.g. "PT2M30S" (optional). */
  duration?: string;
}

export const HOME_VIDEO: HomeVideoConfig = {
  youtubeId: "",
  mp4Url: "",
  poster: "/images/homepage/double-wide-exterior.webp",
  name: "Champion manufactured home video tour — Factory Direct Homes Center, Auburn, Indiana",
  description:
    "Walk through a new Champion manufactured home built at the Topeka, Indiana factory and sold factory direct by Factory Direct Homes Center in Auburn, IN.",
  uploadDate: "2026-09-10",
};

export function isHomeVideoConfigured(video: HomeVideoConfig): boolean {
  return Boolean(video.youtubeId || video.mp4Url);
}
