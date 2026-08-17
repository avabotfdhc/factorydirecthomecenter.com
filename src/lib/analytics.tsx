"use client";

import React, { useEffect, useCallback } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

// ============================================
// CONFIGURATION - Environment Variables
// ============================================
// GA4 Measurement ID. A GA4 ID is a PUBLIC value (it ships in the page source
// on every request), so committing it is safe — this is not a secret. Kyle
// can't readily set Vercel env vars, so the real ID lives here as the default
// and analytics work out of the box; a NEXT_PUBLIC_GA_MEASUREMENT_ID set in
// Vercel still overrides it. (This is the one tracking ID intentionally in
// source for that reason; keys/secrets never go here.)
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-6PMB9SZX4H";
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";
// Microsoft Clarity project ID — public (ships in page source), same
// rationale as GA4 above: committed as the default so session recordings and
// heatmaps work without a Vercel env var; NEXT_PUBLIC_CLARITY_PROJECT_ID
// overrides it if ever set.
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "tjh2nfoq85";

// ============================================
// TYPE DEFINITIONS
// ============================================
export interface TrackingEvent {
  eventName: string;
  params?: Record<string, any>;
}

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_category2?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
  item_brand?: string;
}

export interface LeadData {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  homeModel?: string;
  location?: string;
  budget?: string;
  timeline?: string;
  value?: number;
  currency?: string;
  landStatus?: string;
  timeframe?: string;
  financingStatus?: string;
}

// ============================================
// GOOGLE ANALYTICS 4 - Enhanced Implementation
// ============================================

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <React.Fragment>
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
            custom_map: {
              'custom_parameter_1': 'page_type',
              'custom_parameter_2': 'user_type',
              'custom_parameter_3': 'content_group'
            }
          });
          
          // Enhanced Ecommerce Configuration
          gtag('config', '${GA_MEASUREMENT_ID}', {
            'allow_enhanced_conversions': true
          });
        `}
      </Script>
    </React.Fragment>
  );
}

// ============================================
// FACEBOOK PIXEL - Complete Implementation
// ============================================

export function FacebookPixel() {
  if (!FB_PIXEL_ID) return null;

  return (
    <React.Fragment>
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          
          // Initialize Pixel with Advanced Matching
          fbq('init', '${FB_PIXEL_ID}', {
            em: '', // Email (hashed) - populated when available
            ph: '', // Phone (hashed) - populated when available
            fn: '', // First name (hashed)
            ln: '', // Last name (hashed)
            ct: 'Auburn', // City
            st: 'IN', // State
            zp: '46706', // Zip
            country: 'US'
          });
          
          // Track PageView
          fbq('track', 'PageView');
          
          // Enable Automatic Advanced Matching
          fbq('track', 'InitiateCheckout');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </React.Fragment>
  );
}

// ============================================
// GOOGLE TAG MANAGER
// ============================================

export function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <React.Fragment>
      <Script id="gtm-head" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
    </React.Fragment>
  );
}

// GTM NoScript (for body)
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

// ============================================
// MICROSOFT CLARITY
// ============================================

export function MicrosoftClarity() {
  if (!CLARITY_PROJECT_ID) return null;

  return (
    <Script id="clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `}
    </Script>
  );
}

// ============================================
// TRACKING HOOKS & UTILITIES
// ============================================

// Hook for page view tracking
export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    
    // GA4 Page View
    trackGA4PageView(url);
    
    // Facebook Page View
    trackFBEvent("PageView");
  }, [pathname, searchParams]);
}

// ============================================
// GA4 TRACKING FUNCTIONS
// ============================================

export function trackGA4Event(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, {
      ...eventParams,
      send_to: GA_MEASUREMENT_ID,
      event_timestamp: new Date().toISOString(),
    });
  }
}

export function trackGA4PageView(url: string, additionalParams?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
      ...additionalParams,
    });
  }
}

// Enhanced Ecommerce - View Item
export function trackViewItem(item: EcommerceItem) {
  trackGA4Event("view_item", {
    currency: "USD",
    value: item.price,
    items: [item],
  });
}

// Enhanced Ecommerce - View Item List
export function trackViewItemList(items: EcommerceItem[], listName: string) {
  trackGA4Event("view_item_list", {
    item_list_name: listName,
    items: items,
  });
}

// Enhanced Ecommerce - Select Item
export function trackSelectItem(item: EcommerceItem, listName: string) {
  trackGA4Event("select_item", {
    item_list_name: listName,
    items: [item],
  });
}

// Enhanced Ecommerce - Begin Checkout
export function trackBeginCheckout(value: number, items: EcommerceItem[]) {
  trackGA4Event("begin_checkout", {
    currency: "USD",
    value: value,
    items: items,
  });
}

// Lead Generation Tracking
export function trackGenerateLead(leadData: LeadData) {
  trackGA4Event("generate_lead", {
    currency: leadData.currency || "USD",
    value: leadData.value || 0,
    lead_id: leadData.id,
    lead_source: document.referrer || "direct",
    lead_interest: leadData.interest,
    lead_location: leadData.location,
    lead_home_model: leadData.homeModel,
    lead_timeline: leadData.timeline,
  });
}

// Form Submission Tracking
export function trackFormSubmit(formName: string, formData?: Record<string, any>) {
  trackGA4Event("form_submit", {
    form_name: formName,
    form_id: formData?.id,
    form_destination: formData?.destination,
    ...formData,
  });
}

// ============================================
// FACEBOOK PIXEL TRACKING FUNCTIONS
// ============================================

export function trackFBEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", eventName, params);
  }
}

export function trackFBCustomEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("trackCustom", eventName, params);
  }
}

// Facebook Standard Events
export const FacebookEvents = {
  // Content Events
  viewContent: (contentType: string, contentIds: string[], value?: number, currency = "USD") => {
    trackFBEvent("ViewContent", {
      content_type: contentType,
      content_ids: contentIds,
      value: value,
      currency: currency,
    });
  },

  search: (searchString: string, contentType?: string) => {
    trackFBEvent("Search", {
      search_string: searchString,
      content_type: contentType,
    });
  },

  // Lead Events
  lead: (contentName?: string, contentCategory?: string, value?: number) => {
    trackFBEvent("Lead", {
      content_name: contentName,
      content_category: contentCategory,
      value: value,
      currency: "USD",
    });
  },

  // Contact Events
  contact: (contentName?: string) => {
    trackFBEvent("Contact", {
      content_name: contentName,
    });
  },

  // Initiate Checkout (for financing applications)
  initiateCheckout: (contentIds: string[], contentType: string, value?: number) => {
    trackFBEvent("InitiateCheckout", {
      content_ids: contentIds,
      content_type: contentType,
      value: value,
      currency: "USD",
    });
  },

  // Custom Events for Home Buying Journey
  viewFloorPlan: (planName: string, planType: string, sqft: number, price?: number) => {
    trackFBCustomEvent("ViewFloorPlan", {
      plan_name: planName,
      plan_type: planType,
      square_feet: sqft,
      price: price,
    });
  },

  viewLocation: (locationName: string, state: string) => {
    trackFBCustomEvent("ViewLocation", {
      location_name: locationName,
      state: state,
    });
  },

  viewFinancing: (loanType: string) => {
    trackFBCustomEvent("ViewFinancing", {
      loan_type: loanType,
    });
  },

  phoneCall: (location: string, pageType: string) => {
    trackFBCustomEvent("PhoneCall", {
      location: location,
      page_type: pageType,
    });
  },

  emailClick: (location: string, pageType: string) => {
    trackFBCustomEvent("EmailClick", {
      location: location,
      page_type: pageType,
    });
  },

  getQuote: (planName?: string, location?: string) => {
    trackFBCustomEvent("GetQuote", {
      plan_name: planName,
      location: location,
    });
  },

  scheduleVisit: (location?: string) => {
    trackFBCustomEvent("ScheduleVisit", {
      location: location,
    });
  },

  downloadGuide: (guideName: string) => {
    trackFBCustomEvent("DownloadGuide", {
      guide_name: guideName,
    });
  },
};

// ============================================
// UNIFIED TRACKING FUNCTIONS
// ============================================

// Track events to both GA4 and Facebook
export function trackEvent(eventName: string, params?: Record<string, any>) {
  trackGA4Event(eventName, params);
  
  // Map common events to Facebook equivalents
  const fbEventMap: Record<string, string> = {
    "phone_call_click": "PhoneCall",
    "email_click": "EmailClick",
    "form_submit": "Lead",
    "scroll_depth": "ScrollDepth",
    "time_on_page": "TimeOnPage",
  };
  
  if (fbEventMap[eventName]) {
    trackFBCustomEvent(fbEventMap[eventName], params);
  }
}

// ============================================
// USER INTERACTION TRACKING
// ============================================

export function trackPhoneClick(location: string, pageType = "unknown") {
  trackGA4Event("phone_call_click", { location, page_type: pageType });
  FacebookEvents.phoneCall(location, pageType);
}

export function trackEmailClick(location: string, pageType = "unknown") {
  trackGA4Event("email_click", { location, page_type: pageType });
  FacebookEvents.emailClick(location, pageType);
}

export function trackOutboundLink(url: string, label: string) {
  trackGA4Event("outbound_link", { url, label });
  trackFBCustomEvent("OutboundLink", { url, label });
}

export function trackScrollDepth(depth: number) {
  trackGA4Event("scroll_depth", { depth: `${depth}%` });
}

export function trackTimeOnPage(minutes: number) {
  trackGA4Event("time_on_page", { minutes });
}

// ============================================
// SCROLL TRACKING HOOK
// ============================================

export function useScrollTracking() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const depths = [25, 50, 75, 90];
    const tracked = new Set<number>();

    const handleScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      );

      depths.forEach((depth) => {
        if (scrollPercent >= depth && !tracked.has(depth)) {
          tracked.add(depth);
          trackScrollDepth(depth);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}

// ============================================
// TIME ON PAGE TRACKING HOOK
// ============================================

export function useTimeOnPageTracking() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const startTime = Date.now();
    const intervals = [1, 3, 5, 10]; // minutes
    const tracked = new Set<number>();

    const interval = setInterval(() => {
      const minutes = Math.floor((Date.now() - startTime) / 60000);
      
      intervals.forEach((intervalTime) => {
        if (minutes >= intervalTime && !tracked.has(intervalTime)) {
          tracked.add(intervalTime);
          trackTimeOnPage(intervalTime);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);
}

// ============================================
// FLOOR PLAN TRACKING
// ============================================

export function trackFloorPlanView(planName: string, planType: string, sqft: number, price?: number) {
  // GA4
  trackViewItem({
    item_id: planName.toLowerCase().replace(/\s+/g, "-"),
    item_name: planName,
    item_category: planType,
    price: price,
    quantity: 1,
    item_brand: "Champion Homes",
  });
  
  // Facebook
  FacebookEvents.viewFloorPlan(planName, planType, sqft, price);
}

export function trackFloorPlanSelect(planName: string, planType: string, listName: string) {
  trackSelectItem(
    {
      item_id: planName.toLowerCase().replace(/\s+/g, "-"),
      item_name: planName,
      item_category: planType,
    },
    listName
  );
}

// ============================================
// LOCATION TRACKING
// ============================================

export function trackLocationView(locationName: string, state: string) {
  trackGA4Event("view_location", { location_name: locationName, state });
  FacebookEvents.viewLocation(locationName, state);
}

// ============================================
// FINANCING TRACKING
// ============================================

export function trackFinancingView(loanType: string) {
  trackGA4Event("view_financing", { loan_type: loanType });
  FacebookEvents.viewFinancing(loanType);
}

export function trackFinancingApplicationStart(loanType: string, value?: number) {
  trackGA4Event("begin_checkout", {
    loan_type: loanType,
    value: value,
    currency: "USD",
  });
  FacebookEvents.initiateCheckout([loanType], "financing", value);
}

// ============================================
// LEAD FORM TRACKING
// ============================================

export function trackLeadFormStart(formName: string) {
  trackGA4Event("lead_form_start", { form_name: formName });
  trackFBCustomEvent("LeadFormStart", { form_name: formName });
}

export function trackLeadFormError(formName: string, errorFields: string[]) {
  trackGA4Event("lead_form_error", { 
    form_name: formName, 
    error_fields: errorFields.join(",") 
  });
  trackFBCustomEvent("LeadFormError", { 
    form_name: formName, 
    error_fields: errorFields 
  });
}

export function trackLeadFormSubmit(formName: string, leadData: LeadData) {
  // GA4
  trackGenerateLead(leadData);
  trackFormSubmit(formName, {
    form_destination: "/contact-us",
    form_id: leadData.id,
  });
  
  // Facebook
  FacebookEvents.lead(formName, leadData.interest, leadData.value);
  
  // Contact event for high-intent leads
  if (leadData.phone) {
    FacebookEvents.contact(formName);
  }
}

// ============================================
// GUIDE/DOWNLOAD TRACKING
// ============================================

export function trackGuideDownload(guideName: string) {
  trackGA4Event("file_download", {
    file_name: guideName,
    file_extension: "pdf",
  });
  FacebookEvents.downloadGuide(guideName);
}

// ============================================
// CTA BUTTON TRACKING
// ============================================

export function trackCTAClick(ctaName: string, ctaLocation: string, destination?: string) {
  trackGA4Event("cta_click", {
    cta_name: ctaName,
    cta_location: ctaLocation,
    destination: destination,
  });
  trackFBCustomEvent("CTAClick", {
    cta_name: ctaName,
    cta_location: ctaLocation,
    destination: destination,
  });
}

// ============================================
// VIDEO TRACKING (if videos added later)
// ============================================

export function trackVideoStart(videoName: string) {
  trackGA4Event("video_start", { video_name: videoName });
  trackFBCustomEvent("VideoStart", { video_name: videoName });
}

export function trackVideoComplete(videoName: string) {
  trackGA4Event("video_complete", { video_name: videoName });
  trackFBCustomEvent("VideoComplete", { video_name: videoName });
}

// ============================================
// COMPLETE TRACKING COMPONENT
// ============================================

export function AnalyticsProvider() {
  return (
    <React.Fragment>
      <GoogleTagManager />
      <GoogleAnalytics />
      <FacebookPixel />
      <MicrosoftClarity />
    </React.Fragment>
  );
}

// Hook that combines all tracking
export function useTracking() {
  usePageTracking();
  useScrollTracking();
  useTimeOnPageTracking();
}

// ============================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================
export const events = {
  scrollDepth: trackScrollDepth,
  timeOnPage: trackTimeOnPage,
  outboundLink: trackOutboundLink,
  phoneCallClick: trackPhoneClick,
  emailClick: trackEmailClick,
};

export function trackPageView(url: string) {
  trackGA4PageView(url);
}
