"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import SkeletonCard from "../../Skeleton/ServiceCard/page";
import { defaultServices, defaultSiteSettings } from "@/lib/defaultData";

const ServicesCard = () => {
  const [services, setServices] = useState<any[]>(defaultServices);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sectionInfo, setSectionInfo] = useState({
    title: defaultSiteSettings.servicesSection.title,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, settingsRes] = await Promise.allSettled([
          fetch("/api/services"),
          fetch("/api/settings"),
        ]);

        if (servicesRes.status === "fulfilled" && servicesRes.value.ok) {
          const data = await servicesRes.value.json();
          const list = data.ServicesData || data.services || [];
          if (list.length > 0) {
            setServices(list);
          }
        }

        if (settingsRes.status === "fulfilled" && settingsRes.value.ok) {
          const sData = await settingsRes.value.json();
          if (sData?.settings?.servicesSection) {
            setSectionInfo(sData.settings.servicesSection);
          }
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Categories
  const categories = [
    { id: "All", label: "All Capabilities" },
    { id: "Engineering", label: "Full-Stack & Web" },
    { id: "Mobile", label: "Mobile Apps" },
    { id: "Cloud", label: "Cloud & DevOps" },
    { id: "Enterprise", label: "Enterprise Systems" },
    { id: "Marketing", label: "Growth & SEO" },
  ];

  const getCategoryForService = (slug: string = "", title: string = ""): string => {
    const s = slug.toLowerCase();
    const t = title.toLowerCase();
    if (s.includes("web") || s.includes("responsive") || t.includes("web")) return "Engineering";
    if (s.includes("mobile") || s.includes("app") || t.includes("mobile")) return "Mobile";
    if (s.includes("cloud") || s.includes("devops") || t.includes("cloud")) return "Cloud";
    if (s.includes("custom") || s.includes("crm") || s.includes("erp") || t.includes("software") || t.includes("crm")) return "Enterprise";
    if (s.includes("seo") || s.includes("marketing") || s.includes("ppc") || t.includes("marketing")) return "Marketing";
    return "Engineering";
  };

  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const cat = getCategoryForService(item.slug, item.title);
      const matchesCat = activeCategory === "All" || cat === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.features?.some((f: any) =>
          typeof f === "string"
            ? f.toLowerCase().includes(q)
            : f.title?.toLowerCase().includes(q) || f.description?.toLowerCase().includes(q)
        );

      return matchesCat && matchesSearch;
    });
  }, [services, activeCategory, searchQuery]);

  return (
    <section id="capabilities-catalog" className="bg-slate-950 py-24 sm:py-32 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-20 pointer-events-none" />

      <div className="container mx-auto lg:max-w-7xl px-4 relative z-10">
        
        {/* Section Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-sky-300 mb-4 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,82,204,0.3)]">
            <Icon icon="solar:widget-bold" width="18" height="18" className="text-sky-400" />
            Capabilities Directory
          </div>
          <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white mb-5 tracking-tight">
            Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Technology Solutions</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Explore our battle-tested engineering services engineered to scale your digital presence, optimize workflows, and build resilient infrastructure.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="relative flex items-center">
              <Icon
                icon="solar:magnifer-linear"
                width="22"
                height="22"
                className="absolute left-4 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search capabilities (e.g. Cloud, Mobile, React, DevOps, CRM)..."
                className="w-full pl-12 pr-10 py-3.5 bg-slate-900/80 border border-white/10 focus:border-sky-400/60 rounded-2xl text-white text-sm placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all shadow-lg focus:shadow-[0_0_25px_rgba(56,189,248,0.2)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Icon icon="solar:close-circle-bold" width="18" height="18" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(0,82,204,0.4)] scale-105"
                      : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/10"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
          ) : filteredServices.length > 0 ? (
            filteredServices.map((item, index) => {
              const catTag = getCategoryForService(item.slug, item.title);
              const topFeatures = Array.isArray(item.features) ? item.features.slice(0, 3) : [];

              return (
                <div
                  key={item.slug || index}
                  className="group relative flex flex-col justify-between rounded-3xl bg-slate-900/70 border border-white/10 hover:border-sky-500/40 p-8 backdrop-blur-xl shadow-xl hover:shadow-[0_15px_40px_-10px_rgba(0,82,204,0.3)] transition-all duration-500 overflow-hidden"
                >
                  {/* Hover ambient radial glow */}
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-sky-400/25 transition-all duration-500 pointer-events-none" />

                  {/* Top Header: Icon & Category Tag */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex justify-center items-center group-hover:bg-blue-600 group-hover:border-blue-400 group-hover:shadow-[0_0_25px_rgba(0,82,204,0.4)] transition-all duration-300">
                        <Icon
                          icon={item.icon || "solar:code-square-bold"}
                          width="28"
                          height="28"
                          className="text-sky-400 group-hover:text-white transition-colors duration-300"
                        />
                      </div>
                      <span className="px-3 py-1 text-[11px] font-bold text-sky-300 bg-sky-500/10 rounded-full border border-sky-500/20 uppercase tracking-wider">
                        {catTag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors duration-300">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm text-slate-300 leading-relaxed mb-6 font-normal"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </p>

                    {/* Key Capabilities List */}
                    {topFeatures.length > 0 && (
                      <div className="space-y-2 py-4 border-t border-white/5">
                        {topFeatures.map((feat: any, fIdx: number) => {
                          const fTitle = typeof feat === "string" ? feat : feat.title;
                          return (
                            <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                              <Icon icon="solar:check-circle-bold" width="15" height="15" className="text-sky-400 shrink-0" />
                              <span className="truncate">{fTitle}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom CTA Link */}
                  <div className="pt-5 mt-4 border-t border-white/5 relative z-10">
                    <Link
                      href={`/services/${item.slug}`}
                      className="inline-flex items-center justify-between w-full text-sm font-bold text-sky-400 group-hover:text-white transition-colors duration-300"
                    >
                      <span>Explore Architecture</span>
                      <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-blue-600 flex items-center justify-center transition-all duration-300">
                        <Icon
                          icon="solar:arrow-right-linear"
                          width="16"
                          height="16"
                          className="transform group-hover:translate-x-0.5 transition-transform"
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Icon icon="solar:magnifer-broken" width="32" height="32" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Matching Capabilities Found</h3>
              <p className="text-sm text-slate-400 mb-6">
                Try adjusting your search keywords or select another capability category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Bottom Consultation Banner */}
        <div className="mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-indigo-900/40 border border-white/10 backdrop-blur-2xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2 block">
              Bespoke Enterprise Solutions
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Need a Custom Architecture or Dedicated Team?
            </h3>
            <p className="text-sm text-slate-300">
              Our principal engineers can audit your current infrastructure or design a full-lifecycle software solution tailored to your exact business KPIs.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all shrink-0 flex items-center gap-2"
          >
            <span>Book Architectural Review</span>
            <Icon icon="solar:calendar-linear" width="18" height="18" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ServicesCard;
