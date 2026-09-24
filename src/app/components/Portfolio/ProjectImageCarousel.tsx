"use client";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";

export default function ProjectImageCarousel({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const gallery = useMemo(
    () => images.filter(Boolean).slice(0),
    [images]
  );
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const slides = slider.children;
    const target = slides[index] as HTMLElement | undefined;
    if (!target) return;
    slider.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const onScroll = () => {
      const slides = Array.from(slider.children) as HTMLElement[];
      if (!slides.length) return;
      const currentLeft = slider.scrollLeft;
      let closest = 0;
      let smallest = Number.POSITIVE_INFINITY;
      for (let i = 0; i < slides.length; i++) {
        const d = Math.abs(slides[i].offsetLeft - currentLeft);
        if (d < smallest) {
          smallest = d;
          closest = i;
        }
      }
      setActiveIndex(closest);
    };

    slider.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => slider.removeEventListener("scroll", onScroll);
  }, [gallery.length]);

  if (!gallery.length) return null;

  return (
    <div className="mt-8">
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {gallery.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="relative min-w-full snap-start"
          >
            <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-slate-100">
              <Image
                src={url}
                alt={`${title} — image ${i + 1}`}
                width={1400}
                height={900}
                priority={i === 0}
                className="mx-auto h-auto max-h-[75vh] w-full object-contain"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white">
              {i + 1}/{gallery.length}
            </span>
          </div>
        ))}
      </div>

      {gallery.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {gallery.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${ activeIndex === i ? "w-7 bg-primary" : "w-2.5 bg-slate-300 hover:bg-primary/70" }`}
            />
          ))}
        </div>
      )}

      {gallery.length > 1 && (
        <div className="mt-4 hidden sm:flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => scrollToIndex((activeIndex - 1 + gallery.length) % gallery.length)}
            className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
          >
            <span className="inline-flex items-center gap-2">
              <Icon icon="material-symbols:arrow-left-alt-rounded" width={18} height={18} />
              Prev
            </span>
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex((activeIndex + 1) % gallery.length)}
            className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
          >
            <span className="inline-flex items-center gap-2">
              Next
              <Icon icon="material-symbols:arrow-right-alt-rounded" width={18} height={18} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

