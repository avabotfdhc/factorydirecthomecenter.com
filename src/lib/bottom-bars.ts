"use client";

import { useEffect, type RefObject } from "react";

// Several pieces of UI pin themselves to the bottom of the viewport: the mobile
// call/text action bar, the floor-plan compare bar, the consent notice, and the
// live-chat bubble. Left to themselves they stack on top of each other and the
// topmost one hides the rest.
//
// Each bar publishes its rendered height as a CSS custom property on <html>, so
// the bars above it can offset by `calc(...)` and the stack lays out correctly
// no matter which bars happen to be on screen. A bar that is absent, or hidden
// by a CSS media query, measures 0 and simply drops out of the calculation.
//
// Registered variables:
//   --consent-h      the consent notice (bottom-most; it interrupts everything)
//   --mobile-bar-h   the mobile action bar (0 at lg and above)
export function useBottomBarHeight(
  cssVar: `--${string}`,
  ref: RefObject<HTMLElement | null>,
  active = true,
): void {
  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;

    if (!active || !el) {
      root.style.removeProperty(cssVar);
      return;
    }

    const publish = () => root.style.setProperty(cssVar, `${el.offsetHeight}px`);
    publish();

    // Height changes when the copy rewraps (rotation, resize, font swap).
    const observer = new ResizeObserver(publish);
    observer.observe(el);

    return () => {
      observer.disconnect();
      root.style.removeProperty(cssVar);
    };
  }, [cssVar, ref, active]);
}
