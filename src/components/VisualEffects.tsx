"use client";

import { useEffect, useRef, useState } from "react";
import { events } from "@/lib/analytics";

// Scroll-depth and time-on-page tracking used to be duplicated here as well
// as in src/lib/analytics.tsx, and seven pages called this copy on top of the
// global one that <TrackingProvider /> already runs site-wide. The result was
// two scroll listeners per page firing GA4 `scroll_depth` twice per milestone
// — from two different formulas, so the duplicates landed at different scroll
// positions and neither number meant anything. The analytics module is the
// single implementation now; nothing needs to call it per page.

// Animated counter component
interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({ end, duration = 2000, suffix = "", prefix = "" }: AnimatedCounterProps) {
  // Starts at the FINAL value, not 0: the server-rendered HTML (what crawlers,
  // audits, and everyone pre-hydration sees) must read "260+", never "0+".
  // The count-up only runs client-side once the element scrolls into view.
  const [count, setCount] = useState(end);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    // Reduced motion: leave the counter at its initial value, which is already
    // `end` (see useState above). It used to call setCount(end) here, which
    // React bails out of anyway — a no-op that read as a render cascade.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// Fade in on scroll component
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export function FadeIn({ children, delay = 0, direction = "up", className = "" }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const directionClasses = {
    up: "translate-y-10",
    down: "-translate-y-10",
    left: "translate-x-10",
    right: "-translate-x-10",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0, 0)" : undefined,
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className={isVisible ? "" : directionClasses[direction]}>
        {children}
      </div>
    </div>
  );
}

// Stagger children animation
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({ children, staggerDelay = 100, className = "" }: StaggerContainerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={className}>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className="transition-all duration-500 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: `${index * staggerDelay}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// A `useParallax` hook lived here: it registered an unthrottled scroll
// listener that called getBoundingClientRect() on every event — a forced
// synchronous layout per scroll tick — and no component ever imported it.
// Removed rather than fixed.

// Magnetic button effect
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Renders a <div>, not a <button>: callers wrap their own <a>/<Link>/<button>
// children, and nesting those inside a button is invalid HTML that trips
// accessibility and tap-target audits.
export function MagneticButton({ children, className = "", onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      className={`inline-block transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Image zoom on hover
// A `ZoomImage` component lived here — a plain <img> with a hover-scale
// wrapper — and nothing imported it. The lightbox (src/components/
// ImageLightbox.tsx) is what the site actually uses for enlargeable imagery,
// and it goes through next/image.

// Text reveal animation
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className = "", delay = 0 }: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      <span
        className="inline-block transition-transform duration-700 ease-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
          transitionDelay: `${delay}ms`,
        }}
      >
        {text}
      </span>
    </span>
  );
}

// Loading skeleton
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

// Track outbound links
export function trackOutboundLink(url: string, label: string) {
  events.outboundLink(url, label);
}

// Track phone number clicks
export function trackPhoneClick(location: string) {
  events.phoneCallClick(location);
}

// Track email clicks  
export function trackEmailClick(location: string) {
  events.emailClick(location);
}
