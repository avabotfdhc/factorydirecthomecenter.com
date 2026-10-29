import { buildLlmsText } from "@/lib/llms-text";

// Served from the same modules as the pages, so it can never say something a
// page does not (see src/lib/llms-text.ts). Static: nothing in it changes per
// request.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
