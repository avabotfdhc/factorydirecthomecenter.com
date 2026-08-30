// The switch that decides whether any dollar figure is published on the site.
//
// Turned off on 2026-08-30 at Kyle's request, so he can review the numbers
// before they go in front of buyers. While it is false, every price on the
// sale pages renders as "Call for pricing" — MSRP, sale price and savings
// alike — and the controls that would put dollar amounts on screen (the
// "Under $75,000" filter) are hidden with them.
//
// The campaign itself keeps running: the sale banner, the "% off MSRP" claim
// and the countdown are unaffected, because those are the offer, not a price.
// Say the word if those should come down too.
//
// TO PUT PRICES BACK: set this to true. Nothing else needs changing — the
// figures are still derived from the master price sheet on every render, so
// they cannot go stale while hidden.
//
// The catalogue's own prices are governed separately by SHOW_PRICES in
// src/lib/api-content.ts, which has been false since before this.
export const SHOW_SALE_PRICES = false;
