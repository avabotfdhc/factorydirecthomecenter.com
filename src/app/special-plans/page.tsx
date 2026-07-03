import Link from "next/link";
import Image from "next/image";
import { generateMetadata as genMeta } from "@/lib/seo";
import { FadeIn } from "@/components/VisualEffects";
import { H2, H3 } from "@/components/Heading";
import { SaleDisclaimer } from "@/components/SaleDisclaimer";

// ============================================
// SPECIAL PLANS / ON SALE PAGE - UP TO 25% OFF CAMPAIGN
// ============================================
// Promotional page for current sales and clearance
// Updated: July 2026 - Up to 25% off select new Champion floor plans
// ============================================

export const metadata = genMeta({
  title: "Up to 25% Off Select Champion Floor Plans | Factory Direct Homes Center",
  description: "Save up to 25% off select new Champion floor plans! Limited time sale on manufactured and modular homes. Single wide, double wide, and modular homes on sale now through July 31, 2026.",
  keywords: [
    "manufactured homes sale",
    "champion floor plans sale",
    "champion homes discount",
    "factory direct sale",
    "mobile home clearance",
    "modular home sale",
    "summer home sale"
  ],
  url: "/special-plans",
});

// Sale disclaimer
const saleDisclaimer = `
*Save up to 25% off MSRP (Manufacturer's Suggested Retail Price) on select new Champion floor
plans. Discount applies to MSRP base price only and does not include options, upgrades, delivery,
setup, or other fees. This offer is not valid with any other specials or discounts and cannot be
used in combination with other specials or discounts. Good on new purchases only, and order must
be authorized for production in July 2026. See dealer for complete details. Financing subject to
credit approval. Offer expires July 31, 2026 or while supplies last.
`;

// Featured sale homes
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
    image: "/floorplans/Dutch Aspire 1656H22208.png",
    tag: "On Sale"
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
    image: "/floorplans/Dutch Aspire 1652H21151.png",
    tag: "On Sale"
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
    image: "/floorplans/Brighton.png",
    tag: "On Sale"
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
    image: "/floorplans/Fillmore.png",
    tag: "On Sale"
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
    image: "/floorplans/Silverton.png",
    tag: "On Sale"
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
    image: "/floorplans/Bay Port.png",
    tag: "On Sale"
  }
];

export default function SpecialPlansPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner - 25% Off MSRP Campaign - COMPACT VERSION */}
      <section className="relative w-full min-h-[400px] md:min-h-[450px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/2026-03-22-hero-autumn.png"
            alt="Modern manufactured home with autumn landscaping"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a365d]/95 via-[#1a365d]/80 to-[#2c7a7b]/70" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <FadeIn>
            <div className="text-center">
              {/* Sale Badge */}
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#1a365d] px-4 py-1.5 rounded-full font-bold text-sm mb-4">
                <span className="animate-pulse">🔥</span>
                <span>LIMITED TIME OFFER</span>
                <span className="animate-pulse">🔥</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                UP TO 25% OFF
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-semibold mb-2">
                Select New Champion Floor Plans
              </p>
              <p className="text-base text-white/80 max-w-xl mx-auto mb-3">
                Save thousands on your new Champion manufactured home. Factory direct pricing just got better.
              </p>
              <p className="text-yellow-300 font-bold mb-4 text-sm md:text-base">
                ⏰ Ends July 31, 2026
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="#sale-homes"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#84cc16] hover:bg-[#65a30d] text-white font-bold rounded-lg transition-colors text-base"
                >
                  View Sale Homes
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors text-base backdrop-blur-sm"
                >
                  Contact Sales
                </Link>
              </div>
              
              {/* Trust badges - compact */}
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-white/70 text-xs md:text-sm">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Factory Direct
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Champion Quality
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  6-State Delivery
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Link
                href="/special-plans"
                className="px-6 py-2 bg-[#2c7a7b] text-white rounded-full font-medium"
              >
                On Sale
              </Link>
              <Link
                href="/special-plans/clearance"
                className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-full font-medium hover:bg-gray-50"
              >
                Clearance
              </Link>
            </div>
            
            {/* Search */}
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Floor Plan"
                  className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#2c7a7b]"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="px-6 py-2 bg-[#84cc16] text-white rounded-lg font-medium hover:bg-[#65a30d]">
                Search
              </button>
            </div>
          </div>
          
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="px-4 py-2 bg-white border rounded-full text-sm hover:bg-gray-50">
              Bedrooms
            </button>
            <button className="px-4 py-2 bg-white border rounded-full text-sm hover:bg-gray-50">
              Bathroom
            </button>
            <button className="px-4 py-2 bg-white border rounded-full text-sm hover:bg-gray-50">
              Price
            </button>
            <button className="px-4 py-2 bg-white border rounded-full text-sm hover:bg-gray-50 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Square Feet
            </button>
            <button className="px-4 py-2 bg-white border rounded-full text-sm hover:bg-gray-50 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Sort By
            </button>
          </div>
        </div>
      </section>

      {/* Sale Homes Grid */}
      <section id="sale-homes" className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <H2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Sale Homes
              </H2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Take advantage of our biggest sale of the year. Each home includes Champion's 
                industry-leading warranty and our factory-direct service promise.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {saleHomes.map((home, index) => (
              <FadeIn key={home.id} delay={index * 0.1}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border hover:shadow-xl transition-shadow">
                  {/* Sale Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {home.tag}
                    </span>
                  </div>
                  
                  {/* Savings Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-[#84cc16] text-white px-3 py-1 rounded-full text-sm font-bold">
                      Up to 25% Off
                    </span>
                  </div>

                  {/* Image */}
                  <div className="relative h-56 bg-gray-100">
                    <Image
                      src={home.image}
                      alt={`${home.name} floor plan - ${home.sqft} sq ft manufactured home`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white text-sm font-medium">360° view available</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{home.name}</h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span>Model: {home.modelNo}</span>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-[#2c7a7b]">{home.sqft}</p>
                        <p className="text-xs text-gray-500">Sq. Ft</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-[#2c7a7b]">{home.beds}</p>
                        <p className="text-xs text-gray-500">Beds</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-[#2c7a7b]">{home.baths}</p>
                        <p className="text-xs text-gray-500">Baths</p>
                      </div>
                    </div>

                    {/* Dimensions */}
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Width: {home.width}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Length: {home.length}
                      </span>
                    </div>

                    {/* Pricing — temporarily hidden pre-launch */}
                    <div className="border-t pt-4 mb-4">
                      <p className="text-2xl font-bold text-[#2c7a7b]">Contact for Price</p>
                      <p className="text-sm text-gray-500">Save up to 25% off select new Champion floor plans</p>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/special-plans/details/${home.id}`}
                      className="block w-full text-center py-3 bg-[#2c7a7b] hover:bg-[#1a365d] text-white font-semibold rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#2c7a7b] text-[#2c7a7b] font-semibold rounded-lg hover:bg-[#2c7a7b] hover:text-white transition-colors">
              Load More Homes
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SaleDisclaimer variant="full" />
          </FadeIn>
        </div>
      </section>

      {/* Sales Alert CTA */}
      <section className="py-16 bg-gradient-to-r from-[#1a365d] to-[#2c7a7b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white mb-4">
              Don't Miss Out on These Savings
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Sign up for our Sales Alert to be the first to know about new promotions, 
              clearance inventory, and exclusive factory-direct deals.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-[#84cc16] hover:bg-[#65a30d] text-white font-bold rounded-lg transition-colors"
              >
                Get Alert
              </button>
            </form>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
