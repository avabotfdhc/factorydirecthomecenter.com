import Link from "next/link";
import { ZoomableImage } from "@/components/ImageLightbox";
import { notFound } from "next/navigation";
import { generateMetadata as genMeta } from "@/lib/seo";
import { FadeIn } from "@/components/VisualEffects";
import { H2 } from "@/components/Heading";

// ============================================
// SALE HOME DETAIL PAGE
// ============================================
// Individual sale home details with 25% off pricing
// ============================================

// Sale homes data (same as main page)
const saleHomes = [
  {
    id: "dutch-aspire-1656h22208",
    name: "Dutch Aspire 1656H22208",
    series: "Dutch Aspire",
    modelNo: "1656H22208",
    sqft: 849,
    beds: 2,
    baths: 2,
    width: "16'",
    length: "56'",
    msrp: 89900,
    salePrice: 67425,
    image: "/images/paramount/1656h22208-opt2.webp",
    description: "Champion 16'x56' 2 Beds 2 baths Single Wide Dutch Aspire",
    features: ["Smart Floor Plan", "Modern Kitchen", "Comfortable Living Area", "Spacious Bedrooms"]
  },
  {
    id: "dutch-aspire-1652h21151",
    name: "Dutch Aspire 1652H21151",
    series: "Dutch Aspire",
    modelNo: "1652H21151",
    sqft: 789,
    beds: 2,
    baths: 1,
    width: "16'",
    length: "52'",
    msrp: 84900,
    salePrice: 63675,
    image: "/images/paramount/1652h21151-opt2.webp",
    description: "Champion 16'x52' 2 Beds 1 bath Single Wide Dutch Aspire",
    features: ["Efficient Layout", "Modern Kitchen", "Cozy Living Space"]
  },
  {
    id: "brighton-2852",
    name: "Brighton",
    series: "Aspire",
    brand: "Champion Home Builders",
    modelNo: "2852H32170",
    sqft: 1386,
    beds: 3,
    baths: 2,
    width: "28'",
    length: "52'",
    msrp: 145000,
    salePrice: 108750,
    image: "/images/paramount/2852h32170-opt2.webp",
    description: "Champion 28'x52' 3 Beds 2 baths Double Wide",
    features: ["Open Concept", "Master Suite", "Large Kitchen Island"]
  },
  {
    id: "fillmore-2864",
    name: "Fillmore",
    series: "Aspire",
    brand: "Champion Home Builders",
    modelNo: "2864H32060",
    sqft: 1707,
    beds: 3,
    baths: 2,
    width: "28'",
    length: "64'",
    msrp: 169000,
    salePrice: 126750,
    image: "/images/paramount/2864h32060-opt2.webp",
    description: "Champion 28'x64' 3 Beds 2 baths Double Wide",
    features: ["Spacious Layout", "Walk-in Closets", "Gourmet Kitchen"]
  },
  {
    id: "silverton-2856",
    name: "Silverton",
    series: "Aspire",
    brand: "Champion Home Builders",
    modelNo: "2856H32174",
    sqft: 1493,
    beds: 3,
    baths: 2,
    width: "28'",
    length: "56'",
    msrp: 155000,
    salePrice: 116250,
    image: "/images/paramount/silverton-exterior.webp",
    description: "Champion 28'x56' 3 Beds 2 baths Double Wide",
    features: ["Modern Design", "Vaulted Ceilings", "Large Windows"]
  },
  {
    id: "bay-port-2860",
    name: "Bay Port",
    series: "Aspire",
    brand: "Champion Home Builders",
    modelNo: "2860H32168",
    sqft: 1600,
    beds: 3,
    baths: 2,
    width: "28'",
    length: "60'",
    msrp: 162000,
    salePrice: 121500,
    image: "/images/paramount/bayport-exterior.webp",
    description: "Champion 28'x60' 3 Beds 2 baths Double Wide",
    features: ["Family Friendly", "Bonus Room", "Luxury Finishes"]
  }
];

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const home = saleHomes.find(h => h.id === slug);

  if (!home) {
    return genMeta({
      title: "Home Not Found",
      description: "The requested home could not be found.",
      url: "/homes-on-sale",
    });
  }

  return genMeta({
    title: `${home.name} - Up to 25% Off MSRP`,
    description: `Save up to 25% off MSRP on the ${home.name} — ${home.sqft} sq ft, ${home.beds} bed, ${home.baths} bath Champion home. Contact us for your factory-direct price. Limited time offer!`,
    url: `/homes-on-sale/details/${home.id}`,
  });
}

export default async function SaleHomeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const home = saleHomes.find(h => h.id === slug);

  if (!home) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#2c7a7b]">Home</Link>
            <span>/</span>
            <Link href="/homes-on-sale" className="hover:text-[#2c7a7b]">On Sale</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{home.name}</span>
          </nav>
        </div>
      </div>

      {/* Sale Banner */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-bold text-lg">
            🔥 LIMITED TIME: Save up to 25% off select new Champion floor plans! 🔥
          </p>
          <p className="text-sm text-white/90">
            Offer Ends August 31, 2026
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <FadeIn>
            <div className="relative">
              {/* Sale Badge */}
              <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                25% OFF
              </div>
              
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-lg">
                <ZoomableImage
                  src={home.image}
                  alt={`${home.name} floor plan - ${home.sqft} sq ft manufactured home on sale`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              {/* 360 View CTA */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-2">Want to see this home in detail?</p>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#2c7a7b] text-white rounded-lg font-medium hover:bg-[#1a365d] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View 360° Tour
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Right Column - Details */}
          <FadeIn delay={0.2}>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {home.name}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <span>Series: {home.series}</span>
                <span>Model: {home.modelNo}</span>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#2c7a7b]">{home.sqft}</p>
                  <p className="text-xs text-gray-500">Sq. Ft</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#2c7a7b]">{home.beds}</p>
                  <p className="text-xs text-gray-500">Beds</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#2c7a7b]">{home.baths}</p>
                  <p className="text-xs text-gray-500">Baths</p>
                </div>
              </div>

              {/* Dimensions */}
              <div className="flex gap-6 text-gray-600 mb-6 pb-6 border-b">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Width: {home.width}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Length: {home.length}
                </span>
              </div>

              {/* Pricing — temporarily hidden pre-launch */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl mb-6 border border-red-100">
                <p className="text-sm text-red-600 font-semibold mb-1">SAVE UP TO 25% OFF MSRP</p>
                <p className="text-4xl font-bold text-[#2c7a7b]">Contact for Price</p>
                <p className="text-sm text-gray-500 mt-2">Call (260) 308-1457 for your factory-direct quote</p>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">{home.description}</p>

              {/* Features */}
              <div className="mb-6">
                <h2 className="font-bold text-gray-900 mb-3">Key Features</h2>
                <ul className="space-y-2">
                  {home.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-[#84cc16]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact-us"
                  className="flex-1 text-center py-4 bg-[#84cc16] hover:bg-[#65a30d] text-white font-bold rounded-lg transition-colors"
                >
                  Get This Deal
                </Link>
                <a
                  href="tel:2603081457"
                  className="flex-1 text-center py-4 bg-[#2c7a7b] hover:bg-[#1a365d] text-white font-bold rounded-lg transition-colors"
                >
                  Call (260) 308-1457
                </a>
              </div>

              {/* Download Brochure */}
              <div className="mt-4 text-center">
                <a
                  href="https://factory-direct-homescenter.s3.us-east-1.amazonaws.com/brochure/Perfect%20Options%20Brochure%202024.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#2c7a7b] hover:text-[#1a365d] font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Brochure
                </a>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl">
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            Terms & Conditions
          </h2>
          <p className="text-xs text-gray-500">
            *Save up to 25% off MSRP (Manufacturer's Suggested Retail Price) on select new Champion floor plans.
            Discount applies to base home price only and does not include options, upgrades,
            delivery, setup, or other fees. This offer is not valid with any other specials or discounts and cannot
            be used in combination with other specials or discounts. Good on new purchases only, and order must be
            authorized for production in August 2026. See dealer for complete details. Financing subject to credit
            approval. <strong>Offer expires August 31, 2026</strong> or while supplies last. Prices shown are for the
            home only and do not include taxes, title, delivery, installation, or site preparation costs.
          </p>
        </div>
      </div>

      {/* Lead Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Claim This 25% Off Deal
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Fill out the form below and our team will contact you within 24 hours 
                to secure your discount on the {home.name}.
              </p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]"
                      placeholder="(260) 555-0123"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Finance Options
                    </label>
                    <select aria-label="Finance option" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]">
                      <option>Select finance option</option>
                      <option>Cash</option>
                      <option>Finance</option>
                      <option>Credit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Home Placement
                    </label>
                    <select aria-label="Home placement" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]">
                      <option>Select placement option</option>
                      <option>In a community</option>
                      <option>I have land</option>
                      <option>Still looking</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery State
                  </label>
                  <select aria-label="Delivery state" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]">
                    <option>Select state</option>
                    <option>Indiana</option>
                    <option>Ohio</option>
                    <option>Michigan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]"
                    placeholder="Tell us about your timeline or any questions..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#84cc16] hover:bg-[#65a30d] text-white font-bold rounded-lg transition-colors"
                >
                  Submit Request
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting, you agree to be contacted about this offer. 
                  We respect your privacy and will never share your information.
                </p>
              </form>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
