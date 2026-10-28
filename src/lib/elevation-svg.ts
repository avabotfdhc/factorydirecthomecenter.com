// Renders a plan's elevation to a standalone SVG document — the picture the
// plan page's "Design this home" teaser shows as an <img>, served by
// /api/plan-elevation/image.
//
// Server only: it renders a React tree to a string. The same HomeElevation
// component draws the live preview in the designer, so the teaser and the
// designer can never disagree about a home.
//
// Why `react-dom/server.edge` and a stream: Next refuses `react-dom/server`
// in a route handler outright, and `react-dom/server.browser` keeps a Node
// process alive after use (its scheduler holds a MessageChannel), which hangs
// `node --test`. The edge entry point's `renderToReadableStream` works in a
// route handler (Next's alias keeps that one export real), exits cleanly in
// tests, and the markup is identical once the stream is read. React's output
// has no xmlns on the root <svg>, which a browser needs when the file stands
// alone as an image, so it is added here; nothing else is rewritten.

import { createElement } from "react";
import { renderToReadableStream } from "react-dom/server.edge";
import { HomeElevation, type ExteriorChoices } from "@/components/HomeElevation";
import type { PlanElevation, ViewName } from "@/lib/plan-elevation-types";

export const SVG_XMLNS = 'xmlns="http://www.w3.org/2000/svg"';

export async function renderElevationSvg(args: {
  plan: PlanElevation;
  choices: ExteriorChoices;
  view: ViewName;
  /** a title for assistive tech and the image's own tooltip */
  title?: string;
}): Promise<string> {
  const stream = await renderToReadableStream(
    createElement(HomeElevation, { plan: args.plan, choices: args.choices, view: args.view, id: "img" }),
  );
  await stream.allReady;
  const markup = await new Response(stream).text();
  const title = args.title ? `<title>${escapeXml(args.title)}</title>` : "";
  // `<svg …>` is the first tag React emits; add the namespace to it and the
  // title just inside it so the document is valid on its own.
  const open = markup.match(/^<svg\b[^>]*>/);
  if (!open) throw new Error("HomeElevation did not render an <svg> root");
  const root = open[0].replace(/^<svg\b/, `<svg ${SVG_XMLNS}`);
  return `<?xml version="1.0" encoding="UTF-8"?>${root}${title}${markup.slice(open[0].length)}`;
}

function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (ch) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[ch] as string);
}
