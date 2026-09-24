"use client";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { fetchPartners, fetchSiteSettings } from "@/lib/api";
import { IPartner } from "@/types";
import { defaultPartners, defaultSiteSettings } from "@/lib/defaultData";

const Partners = () => {
  const [partners, setPartners] = useState<IPartner[]>(defaultPartners as unknown as IPartner[]);
  const [sectionInfo, setSectionInfo] = useState({
    badge: defaultSiteSettings.partnersSection.badge,
    description: defaultSiteSettings.partnersSection.description,
  });

  useEffect(() => {
    const loadData = async () => {
      const [partnerData, settingsData] = await Promise.all([
        fetchPartners(),
        fetchSiteSettings(),
      ]);
      setPartners(partnerData);
      if (settingsData?.partnersSection) {
        setSectionInfo(settingsData.partnersSection);
      }
    };

    loadData();
  }, []);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: false,
    responsive: [
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
    <section className="bg-slate-950 py-20 relative border-t border-white/5 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

      <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
        <div className="flex flex-col items-center mb-14">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 shadow-[0_0_15px_rgba(0,82,204,0.25)] mb-4">
            <Icon icon="solar:shield-check-bold" className="text-sky-400 w-4 h-4" />
            <span className="text-sky-300 text-xs font-bold tracking-widest uppercase">
              {sectionInfo.badge || "Ecosystem Partners"}
            </span>
          </div>
          <p className="text-slate-400 text-center max-w-2xl text-sm sm:text-base font-normal">
            {sectionInfo.description || "Trusted by visionary enterprises and fast-growing software companies."}
          </p>
        </div>

        <div className="relative">
          {/* Gradient Masks for smooth scrolling edges */}
          <div className="absolute left-0 top-0 w-24 sm:w-32 h-full bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-24 sm:w-32 h-full bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none"></div>

          <Slider {...settings} className="partner-slider">
            {[...partners, ...partners, ...partners, ...partners].map((item, index) => (
              <div key={index} className="!flex justify-center items-center px-6 outline-none">
                <div className="w-[140px] h-[70px] relative flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer opacity-70 hover:opacity-100 brightness-0 invert">
                  {item.image.startsWith("http") || item.image.startsWith("data:") ? (
                    <img
                      src={item.image}
                      alt={item.name || "partner logo"}
                      className="w-full h-full object-contain max-h-[45px]"
                    />
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.name || "partner logo"}
                      fill
                      className="object-contain"
                      sizes="140px"
                    />
                  )}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Partners;
