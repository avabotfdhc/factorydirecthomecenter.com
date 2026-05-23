import Link from "next/link";
import Image from "next/image";
import { generateMetadata as genMeta } from "@/lib/seo";
import { FadeIn } from "@/components/VisualEffects";
import { H2, H3 } from "@/components/Heading";

// ============================================
// SPECIAL PLANS / ON SALE PAGE - 20% OFF CAMPAIGN
// ============================================
// Promotional page for current sales and clearance
// Updated: May 2026 - 20% OFF MSRP Campaign
// ============================================

export const metadata = genMeta({
  title: "20% Off MSRP | Factory Direct Homes Center Sale",
  description: "Save 20% off MSRP on all floor plans! Limited time offer on Champion manufactured homes. Single wide, double wide, and modular homes on sale now.",
  keywords: [
    "manufactured homes sale",
    "20% off mobile homes",
    "champion homes discount",
    "factory direct sale",
    "mobile home clearance",
    "modular home sale"
  ],
  url: "/special-plans",
});

// Sale disclaimer
const saleDisclaimer = `
*20% off MSRP (Manufacturer's Suggested Retail Price) valid on all new floor plan orders 
placed during the promotional period. Discount applies to base home price only and does 
not include options, upgrades, delivery, setup, or other fees. Cannot be combined with 
other offers or prior sales. See dealer for complete details. Financing subject to credit 
approval. Offer expires [DATE] or while supplies last.
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
    salePrice: 71920,
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
    salePrice: 67920,
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
    salePrice: 116000,
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
    salePrice: 135200,
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
    salePrice: 124000,
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
    salePrice: 129600,
    image: "/floorplans/Bay Port.png",
    tag: "On Sale"
  }
];

export default function SpecialPlansPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner - 20% Off Campaign */}
      <section className="relative w-full bg-gradient-to-r from-[#1a365d] to-[#2c7a7b] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Subtle house silhouettes background */}
          <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice">
            <path d="M0,400 L0,250 L150,150 L300,250 L300,400 Z" fill="currentColor" className="text-white"/>
            <path d="M250,400 L250,200 L400,100 L550,200 L550,400 Z" fill="currentColor" className="text-white"/>
            <path d="M500,400 L500,220 L650,120 L800,220 L800,400 Z" fill="currentColor" className="text-white"/>
            <path d="M750,400 L750,180 L900,80 L1050,180 L1050,400 Z" fill="currentColor" className="text-white"/>
            <path d="M1000,400 L1000,240 L1150,140 L1300,240 L1300,400 Z" fill="currentColor" className="text-white"/>
          </svg>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <FadeIn>
            <div className="text-center">
              {/* Sparkle decorations */}
              <div className="flex justify-center gap-4 mb-6">
                <span className="text-4xl animate-pulse">✨</span>
                <span className="text-3xl animate-pulse delay-100">⭐</span>
                <span className="text-4xl animate-pulse delay-200">✨</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
                20% OFF MSRP
              </h1>
              <p className="text-2xl md:text-3xl text-white/90 font-semibold mb-4">
                All Floor Plans - Limited Time Offer
              </p>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-2">
                Factory Direct Pricing Just Got Better. Save thousands on your new Champion manufactured home.
              </p>
              <p className="text-yellow-300 font-semibold mb-8">
                ⏰ Offer Ends May 31, 2026
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="#sale-homes"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#84cc16] hover:bg-[#65a30d] text-white font-bold rounded-lg transition-colors text-lg"
                >
                  View Sale Homes
                </Link>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors text-lg backdrop-blur-sm"
                >
                  Contact Sales
                </Link>
              </div>
              
              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Factory Direct Pricing
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Champion Quality
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
                      Save ${(home.msrp - home.salePrice).toLocaleString()}
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

                    {/* Pricing */}
                    <div className="border-t pt-4 mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-gray-400 line-through text-lg">
                          ${home.msrp.toLocaleString()}
                        </span>
                        <span className="text-red-500 font-semibold">
                          20% OFF
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-[#2c7a7b]">
                        ${home.salePrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">Factory Direct Price</p>
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
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                Sale Terms & Conditions
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>*20% off MSRP</strong> (Manufacturer's Suggested Retail Price) valid on all new floor plan orders 
                  placed during the promotional period. Discount applies to base home price only and does not include 
                  options, upgrades, delivery, setup, or other fees.
                </p>
                <p>
                  Cannot be combined with other offers or prior sales. See dealer for complete details. 
                  Financing subject to credit approval. Prices shown are for the home only and do not include 
                  taxes, title, delivery, installation, or site preparation costs.
                </p>
                <p>
                  All homes are built by Champion Home Builders to HUD or modular building codes. 
                  Warranty information available upon request. <strong>Offer expires May 31, 2026</strong> or while supplies last. 
                  Factory Direct Homes Center reserves the right to modify or end this promotion at any time.
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  Factory Direct Homes Center LLC | 1211 State Road 8, Auburn, IN 46706 | (260) 308-1457
                </p>
              </div>
            </div>
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
