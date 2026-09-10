import Link from "next/link";
import { H2 } from "@/components/Heading";
import { absoluteImageUrl } from "@/lib/image-alt";
import { HOME_VIDEO, isHomeVideoConfigured, type HomeVideoConfig } from "@/lib/home-video";

// Server-rendered homepage video section: a YouTube embed (privacy-enhanced,
// lazy) or a native <video> for a hosted MP4, plus VideoObject JSON-LD so the
// video is eligible for video rich results. Renders nothing until a video is
// configured in src/lib/home-video.ts.
export function HomeVideo({ video = HOME_VIDEO }: { video?: HomeVideoConfig }) {
  if (!isHomeVideoConfigured(video)) return null;

  const thumbnailUrl = absoluteImageUrl(video.poster);
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl,
    uploadDate: video.uploadDate,
    ...(video.duration ? { duration: video.duration } : {}),
    ...(video.youtubeId
      ? { embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtubeId}` }
      : { contentUrl: video.mp4Url }),
    publisher: {
      "@type": "Organization",
      name: "Factory Direct Homes Center",
      logo: { "@type": "ImageObject", url: absoluteImageUrl("/images/logo.png") },
    },
  };

  return (
    <section className="py-16 lg:py-20 bg-[var(--color-charcoal)] text-white" aria-labelledby="see-a-champion-home">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <H2 id="see-a-champion-home" className="text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3">
            See a Champion Home
          </H2>
          <div className="w-16 h-1 bg-[var(--color-lime-light)] mx-auto mb-4" />
          <p className="text-base text-slate-200 max-w-2xl mx-auto">
            Take a video tour of a new manufactured home built 20 miles from our lot. Then visit Auburn to walk
            through one in person.
          </p>
        </div>

        <div className="aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
          {video.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
              title={video.name}
              width="100%"
              height="100%"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
              style={{ border: 0 }}
            />
          ) : (
            <video
              controls
              preload="none"
              playsInline
              poster={video.poster}
              className="w-full h-full object-cover"
              aria-label={video.name}
            >
              <source src={video.mp4Url} type="video/mp4" />
              Your browser does not support embedded video.{" "}
              <a href={video.mp4Url} className="underline">Download the video</a>.
            </video>
          )}
        </div>

        <p className="text-center mt-8">
          <Link href="/floor-plans" className="inline-flex items-center gap-2 text-[var(--color-lime-light)] font-semibold hover:underline">
            Browse every floor plan
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  );
}
