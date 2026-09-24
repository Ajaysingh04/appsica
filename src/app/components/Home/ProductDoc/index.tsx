"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchPortfolio, fetchSiteSettings } from "@/lib/api";
import { IProject } from "@/types";
import { defaultSiteSettings } from "@/lib/defaultData";

function formatLiveUrl(url?: string) {
  if (!url || !url.trim()) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

const ProductDoc = () => {
  const [portfolio, setPortfolio] = useState<IProject[]>([]);
  const [sectionInfo, setSectionInfo] = useState({
    badge: defaultSiteSettings.portfolioSection.badge,
    title: defaultSiteSettings.portfolioSection.title,
    subtitle: defaultSiteSettings.portfolioSection.subtitle,
  });

  useEffect(() => {
    const loadData = async () => {
      const [portfolioData, settingsData] = await Promise.all([
        fetchPortfolio(),
        fetchSiteSettings(),
      ]);
      setPortfolio(portfolioData || []);
      if (settingsData?.portfolioSection) {
        setSectionInfo(settingsData.portfolioSection as any);
      }
    };

    loadData();
  }, []);

  const count = portfolio.length;

  const settings = {
    dots: false,
    arrows: false,
    infinite: count > 3,
    slidesToShow: Math.min(3, count || 1),
    slidesToScroll: 1,
    autoplay: count > 3,
    speed: 4000,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, count || 1),
          infinite: count > 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          infinite: count > 1,
        },
      },
    ],
  };

  if (count === 0) {
    return null;
  }

  return (
    <section className="bg-slate-950 py-24 relative overflow-hidden border-t border-white/5">
      {/* Background cyber grid & glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

      <div className="container mx-auto lg:max-w-7xl px-4 relative z-10">
        <div className="lg:pb-16 pb-10">
          <div className="flex sm:justify-start justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-sky-300 mb-3 shadow-[0_0_15px_rgba(0,82,204,0.25)]">
              <Icon icon="solar:folder-with-files-bold" width="18" height="18" className="text-sky-400" />
              <span className="text-xs font-bold tracking-widest uppercase">{sectionInfo.badge || "Featured Work"}</span>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col sm:gap-0 gap-6 justify-between items-center mt-2">
            <div>
              <h2 className="text-white md:text-5xl sm:text-4xl text-3xl font-extrabold tracking-tight">
                {sectionInfo.title || "Enterprise Case Studies"}
              </h2>
              <p className="text-slate-400 text-base sm:text-lg mt-2 max-w-xl">
                {sectionInfo.subtitle || "Scalable digital architectures deployed for industry leaders."}
              </p>
            </div>
            <Link
              href="/portfolio"
              className="py-3.5 px-7 bg-blue-600 hover:bg-blue-500 rounded-xl text-white text-base font-bold shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all text-center shrink-0 flex items-center gap-2"
            >
              <span>Explore All Projects</span>
              <Icon icon="solar:arrow-right-linear" width="18" height="18" />
            </Link>
          </div>
        </div>

        <div className="mt-4 -mx-3 sm:mx-0">
          {count > 3 ? (
            <Slider {...settings} className="portfolio-slider">
              {portfolio.map((item, index) => renderProjectCard(item, index))}
            </Slider>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((item, index) => renderProjectCard(item, index))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

function renderProjectCard(item: IProject, index: number) {
  const src = item.coverImage || item.image || "";
  const formattedLink = formatLiveUrl(item.liveLink);
  const href = formattedLink || (item.slug ? `/portfolio/${item.slug}` : "/portfolio");
  const isExternal = Boolean(formattedLink);
  const label = item.title || `Project ${index + 1}`;

  return (
    <div key={item.slug || index} className="px-3 py-2">
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="block overflow-hidden rounded-2xl border border-white/10 hover:border-sky-500/50 hover:shadow-[0_15px_40px_-10px_rgba(56,189,248,0.25)] transition-all duration-500 bg-slate-900/60 backdrop-blur-xl group h-full"
      >
        <div className="relative h-[250px] sm:h-[280px] bg-slate-950 overflow-hidden">
          <Image
            src={src}
            alt={label}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          
          {/* Top category badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 backdrop-blur-md border border-white/15 text-sky-300 shadow-md">
              {(item as any).category || "Full-Stack System"}
            </span>
          </div>
        </div>

        <div className="p-6 bg-slate-900/90 backdrop-blur-md flex items-center justify-between border-t border-white/5">
          <div>
            <p className="text-white font-bold text-lg truncate group-hover:text-sky-300 transition-colors">
              {label}
            </p>
            <p className="text-xs text-slate-400 mt-1">Production Deployment</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 group-hover:text-white shrink-0 ml-3 transition-colors">
            <span>{isExternal ? "Launch App" : "View Details"}</span>
            <Icon
              icon={isExternal ? "solar:arrow-right-up-linear" : "solar:arrow-right-linear"}
              className="group-hover:translate-x-1 transition-transform"
              width="18"
              height="18"
            />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductDoc;
