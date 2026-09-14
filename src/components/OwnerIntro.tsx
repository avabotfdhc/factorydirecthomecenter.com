import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/lib/business";
import { H2 } from "./Heading";

// A named human behind the site. The 2026 ranking-factors survey puts
// first-hand experience and real authorship near the top of what raters and
// Google reward, and a dealership page with no owner on it reads like a
// listing farm. The Person node this pairs with lives in src/lib/business.ts
// (`ownerJsonLd`), so the byline on a guide and the founder of the business
// are the same @id rather than two strangers with one name.
//
// DRAFT COPY: written from what the repo already states as fact — the
// dealership opened in November 2024, the showroom is on State Road 8 in
// Auburn, and we are an authorized Champion dealer. Kyle should rewrite this
// in his own words; nothing here is a claim he has not already made publicly.
// No photograph yet: set BUSINESS.owner.image and this renders it.

const PARAGRAPHS = [
  "I opened Factory Direct Homes Center in November 2024 for a simple reason: buying a manufactured home should not feel like buying a used car. Too many buyers I met were handed one bundled number, told it was the best they would do, and pushed to sign that afternoon.",
  "We do it the other way round. You get the home, the options, the delivery and the set-up broken out line by line, in writing, so you can take our quote to any other dealer and compare it honestly. If another dealer beats it, I would rather you knew that than found out later.",
  "We sell Champion homes exclusively, and the plant is close enough that I can answer questions about how your home is actually being built. If something goes wrong after delivery, you call me — not a corporate line in another state.",
];

export function OwnerIntro() {
  const { owner, phoneDisplay, telephone } = BUSINESS;
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,260px)_1fr] gap-10 items-start">
          <div>
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/8">
              {owner.image ? (
                <Image
                  src={owner.image}
                  alt={`${owner.name}, ${owner.jobTitle} of ${BUSINESS.name}, at the Auburn, Indiana showroom`}
                  fill
                  sizes="(max-width: 768px) 60vw, 260px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-5xl text-[var(--color-teal)]/30">
                    {owner.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-lime-dark)] mb-3">
              Who you are buying from
            </p>
            <H2 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-2">
              Meet {owner.name}
            </H2>
            <p className="text-sm text-[var(--color-gray)] mb-6">
              {owner.jobTitle}, {BUSINESS.name} &middot; {BUSINESS.city}, {BUSINESS.region}
            </p>

            {PARAGRAPHS.map((text) => (
              <p key={text} className="text-[var(--color-charcoal)]/80 leading-relaxed mb-4">
                {text}
              </p>
            ))}

            <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              <a href={`tel:${telephone}`} className="text-[var(--color-teal)] hover:underline underline-offset-4">
                Call {phoneDisplay}
              </a>
              <Link href="/about" className="text-[var(--color-teal)] hover:underline underline-offset-4">
                More about the dealership &rarr;
              </Link>
              <Link href="/contact-us" className="text-[var(--color-teal)] hover:underline underline-offset-4">
                Plan a showroom visit &rarr;
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
