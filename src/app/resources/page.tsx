import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Floor Plans & Buyer Guide Downloads",
  description:
    "Download 2026 Champion Homes floor plans, sales options, decor guide, Aspire literature, and installation manuals. All resources from Factory Direct Homes Center in Auburn, IN.",
  alternates: {
    canonical: "/resources",
  },
};

interface ResourceCard {
  title: string;
  description: string;
  href: string;
  category: string;
  icon: React.ReactNode;
  fileCount?: string;
  highlight?: boolean;
}

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);
const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);
const SwatchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
  </svg>
);
const WrenchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
  </svg>
);
const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.499z" />
  </svg>
);
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const resources: ResourceCard[] = [
  {
    title: "Aspire Singlewide Floor Plans",
    description: "Complete 2026 floor plan drawings for all 14', 16', and 18' Aspire single-wide homes. Includes sales floor plans and production drawings for every SKU.",
    href: "https://championh.box.com/s/ukmrw71iijn4az5xt155jv3lll1bs8tl",
    category: "Floor Plans",
    fileCount: "146 PDFs",
    highlight: true,
    icon: <PhoneIcon />,
  },
  {
    title: "Sectional (Double Wide) Floor Plans",
    description: "Floor plan drawings for all 2026 Champion sectional homes — 24', 28', and 32' wide double-wide and multi-section layouts.",
    href: "https://championh.box.com/s/izqej9jz8mks3ff1w8xgre31kk4nlilq",
    category: "Floor Plans",
    fileCount: "135+ PDFs",
    highlight: true,
    icon: <PhoneIcon />,
  },
  {
    title: "Modular Floor Plans",
    description: "IRC-code modular home floor plans for 28' and 32' wide models. Modular homes qualify for conventional mortgages and land-home financing.",
    href: "https://championh.box.com/s/kvj3updl6ox2au5zky9ed0d8h15vbtne",
    category: "Floor Plans",
    fileCount: "180 PDFs",
    highlight: true,
    icon: <HomeIcon />,
  },
  {
    title: "2026 Aspire Literature",
    description: "Marketing brochures and consumer-facing literature for the full 2026 Aspire home lineup. Great for sharing with family members or comparing models.",
    href: "https://championh.box.com/s/4qgukgnsjatg1617nu8d0w12j8fm3co5",
    category: "Brochures",
    icon: <BookIcon />,
  },
  {
    title: "2026 Sales Options",
    description: "Complete 2026 options and upgrades guide. See all available factory upgrades, packages, and features you can order on any new Champion home.",
    href: "https://championh.box.com/s/79fl40jwsqfq5y014puxbpida5yln1hq",
    category: "Guides",
    icon: <StarIcon />,
  },
  {
    title: "2026 Decor Poster",
    description: "Full-color 2026 decor selections poster. See available interior color schemes, cabinet finishes, flooring options, and countertop selections.",
    href: "https://championh.box.com/s/b4xm186295ajgijikowcix018fauvibk",
    category: "Guides",
    icon: <SwatchIcon />,
  },
  {
    title: "Installation Manuals & Homeowner Guide",
    description: "Technical installation manuals and the homeowner's guide for Champion manufactured and modular homes. Essential reading for site contractors and new homeowners.",
    href: "https://championh.box.com/s/8c58die78hvgg0ntdemsnk6urciz2mbj",
    category: "Technical",
    icon: <WrenchIcon />,
  },
];

const categories = ["Floor Plans", "Brochures", "Guides", "Technical"] as const;

const categoryColors: Record<string, string> = {
  "Floor Plans": "bg-[var(--color-teal)]/10 text-[var(--color-teal)]",
  "Brochures": "bg-[var(--color-lime)]/10 text-[var(--color-charcoal)]",
  "Guides": "bg-amber-50 text-amber-700",
  "Technical": "bg-slate-100 text-slate-600",
};

export default function ResourcesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                Champion Homes 2026
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Resources &amp; <span className="italic text-[var(--color-teal-light)]">Downloads</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              Floor plan PDFs, brochures, decor selections, and installation guides — everything you need to research, compare, and plan your new Champion home.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Floor Plans — highlighted */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="decorative-line" />
              <h2 className="font-serif text-2xl font-light tracking-tight text-[var(--color-charcoal)]">
                Floor Plan Libraries
              </h2>
            </div>
            <p className="text-[var(--color-gray)] mb-10 max-w-2xl">
              These are the actual 2026 factory floor plan drawings direct from Champion Homes. Download any plan to see exact room dimensions, door placements, and layout options before you visit the showroom.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.filter(r => r.category === "Floor Plans").map((resource) => (
                <a
                  key={resource.title}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`resource-${resource.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group flex flex-col bg-white border border-[var(--color-charcoal)]/8 rounded-lg p-6 hover:border-[var(--color-teal)] hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded bg-[var(--color-teal)]/10 text-[var(--color-teal)] flex-shrink-0">
                      {resource.icon}
                    </div>
                    {resource.fileCount && (
                      <span className="text-xs text-[var(--color-gray)] bg-[var(--color-cream-dark)] px-2 py-1 rounded">
                        {resource.fileCount}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[var(--color-charcoal)] mb-2 group-hover:text-[var(--color-teal)] transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-[var(--color-gray)] leading-relaxed flex-1 mb-4">
                    {resource.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-teal)]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Open in Box
                    <svg className="w-3 h-3 ml-auto opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Other resources */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="decorative-line" />
              <h2 className="font-serif text-2xl font-light tracking-tight text-[var(--color-charcoal)]">
                Literature &amp; Guides
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {resources.filter(r => r.category !== "Floor Plans").map((resource) => (
                <a
                  key={resource.title}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`resource-${resource.title.toLowerCase().replace(/[\s&]+/g, "-")}`}
                  className="group flex flex-col bg-white border border-[var(--color-charcoal)]/8 rounded-lg p-5 hover:border-[var(--color-teal)] hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded bg-[var(--color-cream-dark)] text-[var(--color-charcoal)]/60 flex-shrink-0">
                      {resource.icon}
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColors[resource.category]}`}>
                      {resource.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-[var(--color-charcoal)] mb-2 group-hover:text-[var(--color-teal)] transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-xs text-[var(--color-gray)] leading-relaxed flex-1 mb-3">
                    {resource.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-[var(--color-teal)] font-medium mt-auto">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Open in Box
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 bg-[var(--color-charcoal)] rounded-2xl p-10 lg:p-14 text-white text-center">
            <div className="decorative-line mx-auto mb-6" />
            <h2 className="font-serif text-3xl lg:text-4xl font-light mb-4">
              Ready to walk through a model?
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Download any floor plan, then come see it full-size at our Auburn showroom. We&apos;ll walk you through the same design so you can see how it really feels to live in.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact-us"
                className="inline-block bg-[var(--color-teal)] text-white px-8 py-3 text-sm font-bold tracking-widest uppercase rounded hover:bg-[var(--color-teal-dark)] transition-colors"
              >
                Schedule a Visit
              </Link>
              <Link
                href="/floor-plans"
                className="inline-block border border-white/30 text-white px-8 py-3 text-sm font-bold tracking-widest uppercase rounded hover:border-white/60 transition-colors"
              >
                Browse Floor Plans
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
