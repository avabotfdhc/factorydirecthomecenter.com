import { youtubeEmbedUrl, youtubeIdFrom } from "@/lib/plan-video";

// A plan's YouTube video tour, embedded the way the homepage's HomeVideo is:
// privacy-enhanced domain, lazy, no related videos. Renders nothing when the
// plan has no video. The VideoObject schema lives in the page graph
// (src/lib/plan-schema.ts), not here.
export function PlanVideo({ videoUrl, planName }: { videoUrl?: string; planName: string }) {
  const id = youtubeIdFrom(videoUrl);
  if (!id) return null;
  // Champion titles these videos itself ("Perfect Manufactured Home"); the
  // page says only what is certain: whose video it is and which plan it sits on.
  const title = `${planName}: video from Champion Homes`;
  return (
    <div className="mt-14">
      <h2 className="font-serif text-2xl font-light mb-6">Video from Champion Homes</h2>
      <div className="aspect-video max-w-4xl rounded-2xl overflow-hidden bg-black border border-[var(--color-charcoal)]/8">
        <iframe
          src={youtubeEmbedUrl(id)}
          title={title}
          width="100%"
          height="100%"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="w-full h-full"
          style={{ border: 0 }}
        />
      </div>
    </div>
  );
}
