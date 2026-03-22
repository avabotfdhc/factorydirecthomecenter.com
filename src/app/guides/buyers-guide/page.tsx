import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Manufactured Home Buyer's Guide | Factory Direct Homes Center",
  description: "Everything you need to know about buying a manufactured home in Indiana, Ohio, and Michigan. From financing to delivery, we walk you through the complete process.",
};

const sections = [
  {
    id: "types",
    title: "Types of Factory-Built Homes",
    content: [
      {
        heading: "Manufactured Homes (HUD Code)",
        text: "Built to federal HUD standards, these homes are constructed on a permanent chassis and can be placed on various foundation types. They're the most affordable option and offer surprising quality and customization. Perfect for first-time buyers, retirees, and anyone seeking value without sacrificing comfort.",
        pros: ["Most affordable", "Fastest delivery (8-12 weeks)", "Flexible placement options", "FHA/VA financing available"],
        cons: ["May have resale limitations in some areas", "Requires specific foundation types for financing"],
      },
      {
        heading: "Modular Homes (IRC Code)",
        text: "Built to the same International Residential Code (IRC) as site-built homes, modular homes are placed on permanent foundations and are virtually indistinguishable from traditional construction. They qualify for conventional mortgages and typically appreciate like site-built homes.",
        pros: ["Conventional financing", "Permanent foundation required", "Appreciates like site-built", "Fully customizable"],
        cons: ["Higher cost than manufactured", "Longer timeline (12-20 weeks)", "More complex permitting"],
      },
    ],
  },
  {
    id: "financing",
    title: "Understanding Your Financing Options",
    content: [
      {
        heading: "FHA Title I & Title II Loans",
        text: "FHA loans are popular for manufactured homes. Title I covers home-only purchases (chattel loans), while Title II covers home-and-land packages. Both offer low down payments (3.5%) and competitive rates. Credit score minimum: 580 for 3.5% down, or 500 with 10% down.",
        pros: ["Low down payment", "Government-backed", "Available for many buyers"],
        cons: ["Mortgage insurance required", "Property must meet FHA standards"],
      },
      {
        heading: "VA Loans for Veterans",
        text: "If you've served in the military, VA loans offer incredible benefits: 0% down payment, no mortgage insurance, and competitive rates. The home must meet VA and HUD standards. This is often the best financing option for eligible buyers.",
        pros: ["0% down payment", "No mortgage insurance", "Competitive rates", "Easier qualification"],
        cons: ["VA funding fee (can be rolled into loan)", "Must meet service requirements"],
      },
      {
        heading: "Conventional Mortgages",
        text: "For modular homes on permanent foundations, conventional mortgages work just like site-built homes. Best rates go to buyers with 740+ credit scores and 20% down, but options exist for lower scores and smaller down payments.",
        pros: ["Best interest rates", "No mortgage insurance with 20% down", "Flexible terms"],
        cons: ["Higher credit requirements", "Modular homes only (typically)", "Stricter appraisal standards"],
      },
      {
        heading: "Chattel Loans",
        text: "When you don't own the land, chattel loans treat the home as personal property. Rates are higher (7-12% vs 6-7% for mortgages), but qualification is easier. Many buyers use chattel loans initially, then refinance to a mortgage after purchasing land.",
        pros: ["Easier qualification", "Faster approval", "No land required"],
        cons: ["Higher interest rates", "Shorter terms (15-20 years)", "May not build equity as fast"],
      },
    ],
  },
  {
    id: "pricing",
    title: "Understanding True Costs",
    content: [
      {
        heading: "The Home Itself",
        text: "This is your base price — the manufactured or modular home from the factory. At Factory Direct, this is where our partnership begins. We show you the factory invoice and add only a fair margin, unlike dealers who markup 20-40%.",
        range: "$50,000 - $150,000+",
        factors: ["Square footage", "Number of bedrooms/bathrooms", "Customization level", "Manufacturer"],
      },
      {
        heading: "Delivery & Transportation",
        text: "Moving your home from the factory to your site. Costs depend on distance, home size (wider = more expensive), and route complexity (tight turns, low bridges). We itemize this separately so you see exactly what you're paying for.",
        range: "$2,500 - $8,000",
        factors: ["Distance from factory", "Home width", "Route complexity", "Permits for oversize load"],
      },
      {
        heading: "Setup & Installation",
        text: "Placing the home on foundation, connecting utilities, leveling, and securing. This is critical work that affects your home's longevity. You can use our trusted crews or bring your own licensed contractors to save money.",
        range: "$5,000 - $15,000",
        factors: ["Foundation type", "Utility connections", "Crew rates", "Local code requirements"],
      },
      {
        heading: "Site Work & Preparation",
        text: "Everything that happens before delivery: clearing land, grading, foundation, driveway, well/septic (if needed), and landscaping. This varies dramatically by property. Rural sites cost more than developed lots.",
        range: "$5,000 - $50,000+",
        factors: ["Land clearing needs", "Soil conditions", "Foundation type", "Utility access", "Driveway length"],
      },
    ],
  },
  {
    id: "timeline",
    title: "The Buying Process Timeline",
    content: [
      {
        heading: "Step 1: Research & Pre-Qualification (Week 1-2)",
        text: "Browse floor plans online, visit showrooms, and get pre-qualified for financing. Know your budget before you fall in love with a home. We recommend getting pre-qualified with 2-3 lenders to compare rates.",
      },
      {
        heading: "Step 2: Choose Your Home (Week 2-3)",
        text: "Select your floor plan, customize options (flooring, cabinets, appliances), and sign your purchase agreement. At Factory Direct, you'll see line-item pricing for every choice. No surprises.",
      },
      {
        heading: "Step 3: Site Preparation (Week 3-8)",
        text: "While your home is being built, prepare your site. This includes permits, foundation, utility connections, and access roads. We coordinate with your contractors or recommend trusted local crews.",
      },
      {
        heading: "Step 4: Manufacturing (Week 3-12)",
        text: "Your home is built in Champion's climate-controlled factory. Quality inspections happen at every stage. You'll receive photo updates of your home's progress.",
      },
      {
        heading: "Step 5: Delivery & Setup (Week 12-14)",
        text: "Your home is transported to your site and placed on the foundation. Utility connections are made, and final leveling occurs. This takes 1-3 days depending on complexity.",
      },
      {
        heading: "Step 6: Final Inspection & Move-In (Week 14-16)",
        text: "Local inspection, punch list completion, and your final walkthrough. Once approved, you get the keys. Welcome home!",
      },
    ],
  },
];

export default function BuyersGuidePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[var(--color-charcoal)] grain-overlay text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="decorative-line" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-teal-light)]">
                Complete Guide
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6">
              Manufactured Home<br />
              <span className="italic text-[var(--color-teal-light)]">Buyer's Guide</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              Everything you need to know about buying a manufactured or modular home 
              in Indiana, Ohio, and Michigan. From financing to move-in day, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-16 bg-[var(--color-cream-dark)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold mb-8">In This Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="bg-white rounded-lg p-6 border border-[var(--color-charcoal)]/5 hover:border-[var(--color-teal)]/30 hover:shadow-md transition-all"
              >
                <span className="text-[var(--color-teal)] font-bold text-sm">{section.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="py-24 lg:py-32 border-b border-[var(--color-charcoal)]/5 last:border-0">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="decorative-line mb-6" />
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-12">
              {section.title}
            </h2>

            <div className="space-y-16">
              {section.content.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h3 className="font-serif text-2xl font-semibold mb-4">{item.heading}</h3>
                    <p className="text-[var(--color-gray)] leading-relaxed mb-6">{item.text}</p>

                    {item.pros && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[var(--color-lime)]/10 rounded-lg p-6">
                          <h4 className="font-bold text-sm uppercase tracking-wider text-[var(--color-lime-dark)] mb-3">Pros</h4>
                          <ul className="space-y-2">
                            {item.pros.map((pro, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-[var(--color-lime)] mt-1">✓</span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-[var(--color-orange)]/10 rounded-lg p-6">
                          <h4 className="font-bold text-sm uppercase tracking-wider text-[var(--color-orange)] mb-3">Considerations</h4>
                          <ul className="space-y-2">
                            {item.cons.map((con, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-[var(--color-orange)] mt-1">•</span>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {item.factors && (
                      <div className="bg-[var(--color-cream-dark)] rounded-lg p-6">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-[var(--color-gray)] mb-3">Cost Factors</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {item.factors.map((factor, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <span className="w-1.5 h-1.5 bg-[var(--color-teal)] rounded-full" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {item.range && (
                    <div className="bg-[var(--color-charcoal)] text-white rounded-lg p-8 flex flex-col justify-center">
                      <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gray)] mb-2">Typical Range</span>
                      <span className="font-serif text-4xl font-semibold text-[var(--color-lime)]">{item.range}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[var(--color-charcoal)] grain-overlay relative text-white">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-6">
            Ready to Take the <span className="italic text-[var(--color-teal-light)]">Next Step?</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
            Browse our floor plans, visit our Auburn showroom, or give us a call. 
            We're here to answer your questions — no pressure, no sales tactics, just honest information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/floor-plans"
              className="btn-primary inline-flex items-center justify-center bg-[var(--color-teal)] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[var(--color-teal-dark)] transition-colors duration-300"
            >
              Browse Floor Plans
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/5 transition-colors duration-300"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
