// The page a buyer lands on when they are ready to come in. Until 2026-10-13
// the site had no page about visiting at all: the address and hours sat in the
// footer and on /contact-us, and "Schedule a Lot Visit" existed only on the
// floor-plan pages. Kyle's goal that day was more phone calls and showroom
// visits, and his facts for this page: the lot has walk-through Champion model
// homes, and appointments are preferred so someone is free to show the buyer
// around. Hours and the address come from src/lib/business.ts; nothing here is
// retyped.
import Link from "next/link";
import { generateMetadata as genMeta, StructuredData, structuredData } from "@/lib/seo";
import { BUSINESS, DIRECTIONS_URL, dialable } from "@/lib/business";
import { LocationMap } from "@/components/LocationMap";
import { ShowroomVisitButton } from "@/components/QuoteModal";

export const metadata = genMeta({
  title: "Visit Our Showroom & Model Homes in Auburn, IN",
  description:
    "Walk through Champion model homes at our Auburn, IN showroom on State Road 8, just off I-69. Book a visit, get directions, or call (260) 308-1457.",
  keywords: [
    "mobile home dealer near me",
    "manufactured home dealer auburn indiana",
    "model homes auburn in",
    "mobile home lot fort wayne",
    "champion homes showroom indiana",
  ],
  url: "/showroom",
});

const DAY_SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

/** "09:00" → "9 AM", "16:30" → "4:30 PM". */
function clock(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")} ${suffix}` : `${hour} ${suffix}`;
}

function dayRange(days: readonly string[]): string {
  const short = days.map((d) => DAY_SHORT[d] ?? d);
  return short.length > 2 ? `${short[0]}–${short[short.length - 1]}` : short.join(", ");
}

const HOURS = BUSINESS.hours.map((h) => ({ days: dayRange(h.days), time: `${clock(h.opens)} – ${clock(h.closes)}` }));
const OPEN_DAYS = new Set<string>(BUSINESS.hours.flatMap((h) => h.days));
const CLOSED = Object.keys(DAY_SHORT).filter((d) => !OPEN_DAYS.has(d)).map((d) => DAY_SHORT[d]);

const TEL = `tel:${dialable(BUSINESS.telephone)}`;

const FAQS = [
  {
    question: "Do I need an appointment to visit the showroom?",
    answer:
      "Appointments are preferred, so someone is free to walk you through the model homes and answer questions without you waiting. Book a time online or call (260) 308-1457. If you are coming the same day, call ahead and we will tell you who is in.",
  },
  {
    question: "Can I walk through a model home?",
    answer:
      "Yes. There are Champion model homes on our Auburn lot that you can walk through. When you book, tell us which floor plan or size you are considering and we will let you know which model on the lot is closest to it.",
  },
  {
    question: "Where is the showroom?",
    answer:
      "1211 State Road 8, Auburn, Indiana 46706, just off I-69 at the State Road 8 / Auburn exit, about 20 minutes north of Fort Wayne. Champion's Topeka plant, where Aspire and Redman homes are built, is 30 miles away.",
  },
  {
    question: "What should I bring to my visit?",
    answer:
      "The address or county of the land the home will go on, the number of bedrooms and bathrooms you need, a rough timeline, and photos of the site if you have them. That is enough for us to show you the right models and send a line-item quote afterwards.",
  },
];

export default function ShowroomPage() {
  return (
    <div className="bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      <StructuredData data={structuredData.faqPage(FAQS)} />

      <section className="bg-[var(--color-charcoal)] text-[var(--color-cream)] py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-lime-on-dark)] mb-4">
            Auburn, Indiana showroom
          </p>
          <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mb-5">
            Walk through Champion <span className="italic text-[var(--color-teal-light)]">model homes</span>
          </h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
            See the layouts, finishes and room sizes in person at our lot on State Road 8, just off I-69.
            Book a time so someone is free to walk you through, then leave with a line-item quote on the
            home you like.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <ShowroomVisitButton
              location="showroom_hero"
              className="inline-flex items-center justify-center bg-[var(--color-lime)] text-white px-8 py-4 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-lime-dark)] transition-colors"
            />
            <a
              href={TEL}
              className="inline-flex items-center justify-center border-2 border-white/40 px-8 py-4 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-white/10 transition-colors"
            >
              Call {BUSINESS.phoneDisplay}
            </a>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border-2 border-white/40 px-8 py-4 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-white/10 transition-colors"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="hours-heading">
          <h2 id="hours-heading" className="font-serif text-3xl font-light mb-6">Hours &amp; location</h2>
          <address className="not-italic text-lg leading-relaxed">
            {BUSINESS.name}
            <br />
            {BUSINESS.streetAddress}
            <br />
            {BUSINESS.city}, {BUSINESS.region} {BUSINESS.postalCode}
          </address>
          <dl className="mt-6 space-y-2">
            {HOURS.map((h) => (
              <div key={h.days} className="flex justify-between max-w-xs border-b border-[var(--color-charcoal)]/10 pb-2">
                <dt className="font-semibold">{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
            {CLOSED.length > 0 && (
              <div className="flex justify-between max-w-xs border-b border-[var(--color-charcoal)]/10 pb-2">
                <dt className="font-semibold">{CLOSED.join(", ")}</dt>
                <dd>Closed</dd>
              </div>
            )}
          </dl>
          <p className="mt-6 text-[var(--color-gray)]">
            Appointments preferred. Calling the same day?{" "}
            <a href={TEL} className="font-semibold text-[var(--color-teal)] underline underline-offset-4">
              {BUSINESS.phoneDisplay}
            </a>
          </p>
        </section>

        <div className="rounded-lg overflow-hidden border border-[var(--color-charcoal)]/10 self-start">
          <LocationMap
            title={`${BUSINESS.name} — ${BUSINESS.streetAddress}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postalCode} on Google Maps`}
            className="w-full h-80"
          />
        </div>
      </div>

      <section className="bg-white py-16" aria-labelledby="expect-heading">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 id="expect-heading" className="font-serif text-3xl font-light mb-8">What happens at a visit</h2>
          <ol className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Walk the models",
                body: "Go through the Champion model homes on the lot and see the room sizes, ceilings, cabinets and finishes for yourself.",
              },
              {
                title: "Narrow the floor plans",
                body: "Tell us your land, family size and timeline and we will pull up the floor plans that fit, with the factory options for each.",
              },
              {
                title: "Get a line-item quote",
                body: "We price the home, each option and delivery on separate lines, so you can compare it with any other quote side by side.",
              },
            ].map((step, i) => (
              <li key={step.title} className="rounded border border-[var(--color-charcoal)]/10 bg-[var(--color-cream)] p-6">
                <p className="text-sm font-bold text-[var(--color-teal)]">Step {i + 1}</p>
                <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-charcoal)]/80">{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[var(--color-gray)]">
            Want to look first?{" "}
            <Link href="/floor-plans" className="font-semibold text-[var(--color-teal)] underline underline-offset-4">
              Browse every floor plan
            </Link>{" "}
            or see{" "}
            <Link href="/homes-on-sale" className="font-semibold text-[var(--color-teal)] underline underline-offset-4">
              the homes on sale
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16" aria-labelledby="showroom-faq">
        <h2 id="showroom-faq" className="font-serif text-3xl font-light mb-6">Visiting the showroom</h2>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <details key={f.question} className="bg-white rounded-lg border border-[var(--color-charcoal)]/5">
              <summary className="p-6 cursor-pointer font-semibold">{f.question}</summary>
              <div className="px-6 pb-6 text-[var(--color-gray)] leading-relaxed">{f.answer}</div>
            </details>
          ))}
        </div>
        <div className="mt-10">
          <ShowroomVisitButton
            location="showroom_faq"
            className="inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
          />
        </div>
      </section>
    </div>
  );
}
