"use client";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import SingleService from "./SingleService";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchServices, fetchSiteSettings } from "@/lib/api";
import { IService } from "@/types";
import { defaultServices, defaultSiteSettings } from "@/lib/defaultData";

const Services = () => {
  const [services, setServices] = useState<IService[]>(defaultServices as unknown as IService[]);
  const [sectionInfo, setSectionInfo] = useState({
    badge: defaultSiteSettings.servicesSection.badge,
    title: defaultSiteSettings.servicesSection.title,
    viewAllText: defaultSiteSettings.servicesSection.viewAllText,
  });

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    const loadData = async () => {
      const [servicesData, settingsData] = await Promise.all([
        fetchServices(),
        fetchSiteSettings(),
      ]);
      setServices(servicesData);
      if (settingsData?.servicesSection) {
        setSectionInfo(settingsData.servicesSection as any);
      }
    };

    loadData();
  }, []);

  const TopAnimation = {
    animate: inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 },
    transition: { duration: 0.8 },
  };

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="bg-slate-950 py-24 relative overflow-hidden border-t border-white/5">
      {/* Ambient tech lighting */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-30 pointer-events-none" />

      <div ref={ref} className="container mx-auto lg:max-w-7xl px-4 relative z-10">
        <motion.div {...TopAnimation} className="mb-14">
          <div className="flex lg:justify-start justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-sky-300 mb-3 shadow-[0_0_15px_rgba(0,82,204,0.25)]">
              <Icon icon="solar:widget-bold" width="18" height="18" className="text-sky-400" />
              <span className="text-xs font-bold tracking-widest uppercase">{sectionInfo.badge || "Core Capabilities"}</span>
            </div>
          </div>
          <div className="flex lg:flex-row flex-col lg:gap-0 gap-8 justify-between items-center mt-2">
            <div>
              <h2 className="font-extrabold sm:text-4xl md:text-5xl text-3xl text-white lg:text-start text-center tracking-tight">
                {sectionInfo.title || "Enterprise Engineering Services"}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 lg:text-left text-center max-w-xl">
                End-to-end software development, microservices architecture, and cloud infrastructure engineered for resilience.
              </p>
            </div>
            <Link
              href="/services"
              className="py-3.5 px-7 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all text-center shrink-0 flex items-center gap-2"
            >
              <span>{sectionInfo.viewAllText || "View All Capabilities"}</span>
              <Icon icon="solar:arrow-right-linear" width="18" height="18" />
            </Link>
          </div>
        </motion.div>

        <div className="mt-8 -mx-3 sm:mx-0">
          <Slider {...settings} className="services-slider">
            {services.map((item, index) => (
              <div key={item.slug || index} className="px-3">
                <SingleService service={item} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Services;
