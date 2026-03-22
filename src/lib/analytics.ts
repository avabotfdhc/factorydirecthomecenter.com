import Script from "next/script";

// Google Analytics 4 Configuration
export const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // Replace with your GA4 ID

// Google Analytics Component
export function GoogleAnalytics() {
  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true,
            cookie_flags: 'SameSite=None;Secure',
            allow_google_signals: true,
            allow_ad_personalization_signals: true,
            custom_map: {
              'custom_parameter_1': 'service_type',
              'custom_parameter_2': 'location',
              'custom_parameter_3': 'home_model'
            }
          });
        `}
      </Script>
    </>
  );
}

// Event tracking helper
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, eventParams);
  }
}

// Track page views
export function trackPageView(url: string) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
}

// Predefined events for manufactured homes business
export const events = {
  // Lead generation events
  leadFormStart: (formName: string) =>
    trackEvent("lead_form_start", { form_name: formName }),
  
  leadFormSubmit: (formName: string, value?: string) =>
    trackEvent("lead_form_submit", { 
      form_name: formName,
      form_value: value 
    }),
  
  phoneCallClick: (location: string) =>
    trackEvent("phone_call_click", { location }),
  
  emailClick: (location: string) =>
    trackEvent("email_click", { location }),
  
  directionsClick: () =>
    trackEvent("directions_click"),
  
  // Home browsing events
  viewHomeDetails: (homeName: string, homeType: string, price?: string) =>
    trackEvent("view_home_details", {
      home_name: homeName,
      home_type: homeType,
      price: price,
    }),
  
  filterHomes: (filterType: string, filterValue: string) =>
    trackEvent("filter_homes", {
      filter_type: filterType,
      filter_value: filterValue,
    }),
  
  compareHomes: (homeNames: string[]) =>
    trackEvent("compare_homes", {
      home_names: homeNames.join(","),
    }),
  
  // Financing events
  financingCalculatorUse: (homePrice: number, downPayment: number) =>
    trackEvent("financing_calculator_use", {
      home_price: homePrice,
      down_payment: downPayment,
    }),
  
  financingInfoRequest: (financingType: string) =>
    trackEvent("financing_info_request", {
      financing_type: financingType,
    }),
  
  // Content engagement
  downloadGuide: (guideName: string) =>
    trackEvent("download_guide", { guide_name: guideName }),
  
  videoPlay: (videoName: string) =>
    trackEvent("video_play", { video_name: videoName }),
  
  videoComplete: (videoName: string) =>
    trackEvent("video_complete", { video_name: videoName }),
  
  // E-commerce events (for home purchases)
  beginCheckout: (homeName: string, value: number) =>
    trackEvent("begin_checkout", {
      home_name: homeName,
      value: value,
      currency: "USD",
    }),
  
  addToCart: (homeName: string, value: number) =>
    trackEvent("add_to_cart", {
      home_name: homeName,
      value: value,
      currency: "USD",
    }),
  
  purchase: (homeName: string, value: number, transactionId?: string) =>
    trackEvent("purchase", {
      home_name: homeName,
      value: value,
      currency: "USD",
      transaction_id: transactionId,
    }),
  
  // User engagement
  scrollDepth: (depth: number) =>
    trackEvent("scroll_depth", { depth: `${depth}%` }),
  
  timeOnPage: (minutes: number) =>
    trackEvent("time_on_page", { minutes }),
  
  // Outbound links
  outboundLink: (url: string, label: string) =>
    trackEvent("outbound_link", { url, label }),
  
  // Social engagement
  socialShare: (platform: string, content: string) =>
    trackEvent("social_share", { platform, content }),
  
  // Search events
  siteSearch: (searchTerm: string, resultsCount: number) =>
    trackEvent("site_search", {
      search_term: searchTerm,
      results_count: resultsCount,
    }),
};

// Google Tag Manager (optional)
export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `}
    </Script>
  );
}

// Meta Pixel (Facebook/Instagram ads)
export function MetaPixel({ pixelId }: { pixelId: string }) {
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}

// Microsoft Clarity (heatmaps and session recordings)
export function MicrosoftClarity({ projectId }: { projectId: string }) {
  return (
    <Script id="clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${projectId}");
      `}
    </Script>
  );
}
