"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Icon } from "@iconify/react";
import { fetchTechnologies } from "@/lib/api";
import { ITechCategory, ITechItem } from "@/types";
import { defaultTechnologies } from "@/lib/defaultData";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const UsedTech = () => {
  const [techCategories, setTechCategories] = useState<ITechCategory[]>(
    defaultTechnologies as unknown as ITechCategory[]
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTechnologies();
        if (data && data.length > 0) {
          setTechCategories(data);
        }
      } catch (error) {
        console.error("Error fetching technologies:", error);
      }
    };

    fetchData();
  }, []);

  // Flatten all tech items for the slider
  const allTechItems: Array<ITechItem & { category: string }> = techCategories.flatMap((cat) =>
    (cat.items || []).map((item) => ({
      ...item,
      category: cat.category.replace(/[:]/g, "").trim(),
    }))
  );

  const settings = {
    autoplay: true,
    autoplaySpeed: 2500,
    dots: false,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 6,
    slidesToScroll: 1,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <section className="py-20 lg:py-28 bg-slate-950 relative overflow-hidden border-t border-white/10">
      {/* Subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-20 pointer-events-none" />

      <div className="container mx-auto lg:max-w-7xl px-4 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-sky-300 mb-4 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,82,204,0.3)]">
            <Icon icon="solar:code-square-bold" width="18" height="18" className="text-sky-400" />
            Core Stack & Tooling
          </div>
          <h4 className="font-extrabold text-3xl md:text-4xl lg:text-5xl text-white mb-4 tracking-tight">
            Architectural <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Stack & Standards</span>
          </h4>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We leverage industry-proven, high-velocity technologies to build resilient and scalable enterprise solutions.
          </p>
        </div>

        {mounted && allTechItems.length > 0 && (
          <div className="mt-8 -mx-3">
            <Slider {...settings}>
              {allTechItems.map((item, index) => (
                <div key={index} className="px-2.5 py-3">
                  <div className="group relative flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg hover:border-sky-500/50 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] hover:-translate-y-1.5 transition-all duration-300 h-36 backdrop-blur-xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl group-hover:bg-sky-400/15 transition-colors pointer-events-none" />
                    <div className="w-13 h-13 flex items-center justify-center rounded-xl bg-white/[0.05] group-hover:bg-blue-500/20 border border-white/5 group-hover:border-blue-400/30 transition-all mb-2.5">
                      <Icon
                        icon={item.icon || "solar:code-linear"}
                        width="32"
                        height="32"
                        className="drop-shadow group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-200 text-center line-clamp-1 group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-sky-400/80 font-semibold mt-0.5 truncate max-w-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </section>
  );
};

export default UsedTech;

