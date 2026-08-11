"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Click-to-enlarge for floor plans and photos. Floor-plan drawings are dense
// line art — buyers need them fullscreen and zoomable to read room dimensions,
// so the overlay offers a 2.5x zoom toggle (click the image) with scroll-pan.
export interface LightboxImage {
  src: string;
  alt: string;
}

function Overlay({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const img = images[index];
  const many = images.length > 1;

  const prev = useCallback(
    () => onNavigate((index - 1 + images.length) % images.length),
    [index, images.length, onNavigate],
  );
  const next = useCallback(
    () => onNavigate((index + 1) % images.length),
    [index, images.length, onNavigate],
  );

  useEffect(() => {
    setZoomed(false);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && many) prev();
      else if (e.key === "ArrowRight" && many) next();
    };
    window.addEventListener("keydown", onKey);
    // Lock page scroll while open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next, many]);

  return createPortal(
    <div
      className="fixed inset-0 z-[120] bg-black/92 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={img.alt}
      onClick={onClose}
    >
      <div
        className={`${zoomed ? "overflow-auto" : "overflow-hidden flex items-center justify-center"} w-full h-full p-4 sm:p-8`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.src}
          alt={img.alt}
          onClick={() => setZoomed((z) => !z)}
          className={
            zoomed
              ? "max-w-none w-[250%] sm:w-[180%] cursor-zoom-out mx-auto"
              : "max-w-full max-h-full object-contain cursor-zoom-in mx-auto"
          }
        />
      </div>

      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-5 sm:right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl leading-none transition-colors"
      >
        ×
      </button>

      {many && (
        <>
          <button
            aria-label="Previous image"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white text-xl transition-colors"
          >
            ‹
          </button>
          <button
            aria-label="Next image"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white text-xl transition-colors"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm tabular-nums">
            {index + 1} / {images.length}
          </div>
        </>
      )}

      <div className="absolute bottom-4 right-4 hidden sm:block text-white/40 text-xs">
        click image to zoom · esc to close
      </div>
    </div>,
    document.body,
  );
}

/** A single enlargeable image (hero/floor plan). */
export function ZoomableImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onClick={() => setOpen(true)}
        className={`${className ?? ""} cursor-zoom-in`}
        title="Click to enlarge"
      />
      {open && (
        <Overlay images={[{ src, alt }]} index={0} onClose={() => setOpen(false)} onNavigate={() => {}} />
      )}
    </>
  );
}

/** A grid of enlargeable images with prev/next between them. */
export function LightboxGallery({
  images,
  gridClassName,
  imgClassName,
}: {
  images: LightboxImage[];
  gridClassName?: string;
  imgClassName?: string;
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  return (
    <>
      <div className={gridClassName ?? "grid grid-cols-2 md:grid-cols-3 gap-4"}>
        {images.map((im, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={im.src}
            alt={im.alt}
            onClick={() => setOpenAt(i)}
            // NOTE: no loading="lazy" — globals.css hides plain <img loading>
            // behind an opacity fade meant for next/image (site gotcha).
            className={`${imgClassName ?? ""} cursor-zoom-in`}
            title="Click to enlarge"
          />
        ))}
      </div>
      {openAt !== null && (
        <Overlay images={images} index={openAt} onClose={() => setOpenAt(null)} onNavigate={setOpenAt} />
      )}
    </>
  );
}
