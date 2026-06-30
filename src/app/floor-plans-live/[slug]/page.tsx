import Link from "next/link";
import { notFound } from "next/navigation";
import { getApiFloorPlanBySlug } from "@/lib/api-content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = await getApiFloorPlanBySlug(slug);
  if (!plan) return { title: "Home Not Found | Factory Direct Homes Center" };
  const desc =
    plan.description ||
    `${plan.name}: ${plan.beds} bed, ${plan.baths} bath, ${plan.sqft.toLocaleString()} sq ft manufactured home from Factory Direct Homes Center in Auburn, IN.`;
  return {
    title: `${plan.name} | Factory Direct Homes Center`,
    description: desc.slice(0, 160),
    robots: { index: false, follow: false },
  };
}

export const dynamic = "force-dynamic";

const Spec = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <div className="font-serif text-2xl font-semibold text-[var(--color-teal)]">{value}</div>
    <div className="text-xs tracking-[0.15em] uppercase text-[var(--color-gray)] mt-1">{label}</div>
  </div>
);

export default async function FloorPlanLiveDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = await getApiFloorPlanBySlug(slug);
  if (!plan) notFound();

  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-charcoal)]/5 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 text-sm text-[var(--color-gray)]">
          <Link href="/floor-plans-live" className="hover:text-[var(--color-teal)]">
            Floor Plans
          </Link>
          <span className="mx-2 text-[var(--color-gray-light)]">/</span>
          <span className="text-[var(--color-charcoal)] font-medium">{plan.name}</span>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden border border-[var(--color-charcoal)]/8 bg-white aspect-[16/11] relative">
            {plan.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={plan.image} alt={`${plan.name} manufactured home`} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[var(--color-gray-light)]">No photo</div>
            )}
          </div>

          {/* Summary */}
          <div className="flex flex-col">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-lime-dark)] mb-3">
              {plan.brand}
              {plan.series ? ` · ${plan.series}` : ""}
            </p>
            <h1 className="font-serif text-3xl lg:text-5xl font-light tracking-tight mb-3">{plan.name}</h1>
            {plan.modelNumber && (
              <p className="text-sm text-[var(--color-gray)] mb-6">Model {plan.modelNumber}</p>
            )}

            <div className="text-2xl font-bold text-[var(--color-lime-dark)] mb-8">{plan.price}</div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 py-6 border-y border-[var(--color-charcoal)]/8 mb-8">
              <Spec label="Sq Ft" value={plan.sqft.toLocaleString()} />
              <Spec label="Beds" value={String(plan.beds)} />
              <Spec label="Baths" value={String(plan.baths)} />
              {plan.width && <Spec label="Width" value={plan.width} />}
              {plan.length && <Spec label="Length" value={plan.length} />}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
              >
                Get a Quote
              </Link>
              <a
                href="tel:+12603081457"
                className="inline-flex items-center justify-center border-2 border-[var(--color-charcoal)]/15 px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-charcoal)]/5 transition-colors"
              >
                Call (260) 308-1457
              </a>
              {plan.virtualTour && (
                <a
                  href={plan.virtualTour}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border-2 border-[var(--color-teal)]/30 text-[var(--color-teal)] px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal)]/5 transition-colors"
                >
                  3D Virtual Tour
                </a>
              )}
              {plan.brochureUrl && (
                <a
                  href={plan.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-sm font-medium text-[var(--color-teal)] underline underline-offset-4 px-2 py-3.5"
                >
                  Download brochure (PDF)
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Gallery */}
        {plan.gallery.length > 1 && (
          <div className="mt-14">
            <h2 className="font-serif text-2xl font-light mb-6">Gallery &amp; Floor Plan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {plan.gallery.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`${plan.name} image ${i + 1}`}
                  className="w-full rounded-xl border border-[var(--color-charcoal)]/8 bg-white object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {plan.floorPlanHtml && (
          <div className="mt-14 max-w-3xl">
            <h2 className="font-serif text-2xl font-light mb-5">About this home</h2>
            <div
              className="prose-fdhc text-[var(--color-charcoal)]/80 leading-relaxed [&_p]:mb-4 [&_h2]:font-serif [&_h3]:font-serif [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: plan.floorPlanHtml }}
            />
          </div>
        )}
      </section>
    </main>
  );
}
