"use client";
import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { fetchTechnologies, fetchSiteSettings } from "@/lib/api";
import { ITechCategory, ITechItem } from "@/types";
import { defaultTechnologies, defaultSiteSettings } from "@/lib/defaultData";

const Technologies = () => {
  const [techStack, setTechStack] = useState<ITechCategory[]>(
    defaultTechnologies as unknown as ITechCategory[]
  );
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sectionInfo, setSectionInfo] = useState({
    badge: defaultSiteSettings.technologiesSection.badge,
    title: defaultSiteSettings.technologiesSection.title,
    description: defaultSiteSettings.technologiesSection.description,
  });

  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-80px", once: true });

  useEffect(() => {
    const loadData = async () => {
      const [techData, settingsData] = await Promise.all([
        fetchTechnologies(),
        fetchSiteSettings(),
      ]);
      if (techData && techData.length > 0) {
        setTechStack(techData);
      }
      if (settingsData?.technologiesSection) {
        setSectionInfo(settingsData.technologiesSection as any);
      }
    };

    loadData();
  }, []);

  // Category clean name helper
  const cleanCatName = (cat: string) => cat.replace(/[:]/g, "").trim();

  // All unique tech items for the infinite marquee
  const allItems: Array<ITechItem & { category: string }> = techStack.flatMap((cat) =>
    (cat.items || []).map((item) => ({
      ...item,
      category: cleanCatName(cat.category),
    }))
  );

  const displayedCategories =
    activeTab === "all"
      ? techStack
      : techStack.filter((cat) => cleanCatName(cat.category) === activeTab);

  return (
    <section className="relative bg-slate-950 py-24 md:py-32 overflow-hidden border-t border-white/5">
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid Mesh Pattern Overlay */}
      <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

      <div ref={ref} className="container mx-auto lg:max-w-7xl px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 text-sky-300 mb-5 border border-blue-500/30 shadow-[0_0_20px_rgba(0,82,204,0.3)] backdrop-blur-md">
            <Icon icon="solar:code-square-bold" width="18" height="18" className="text-sky-400" />
            <span className="text-xs font-bold tracking-widest uppercase">{sectionInfo.badge || "Tech Stack"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            {sectionInfo.title.includes(" ") ? (
              <>
                {sectionInfo.title.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  {sectionInfo.title.split(" ").slice(-1)[0]}
                </span>
              </>
            ) : (
              sectionInfo.title
            )}
          </h2>

          <p className="text-base sm:text-lg text-slate-400 mt-4 mx-auto max-w-2xl leading-relaxed">
            {sectionInfo.description}
          </p>

          {/* Interactive Category Filter Tabs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === "all"
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(0,82,204,0.5)] scale-105"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              All Tech ({allItems.length})
            </button>
            {techStack.map((cat) => {
              const name = cleanCatName(cat.category);
              const isActive = activeTab === name;
              return (
                <button
                  key={cat._id || name}
                  type="button"
                  onClick={() => setActiveTab(name)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-primary text-white shadow-[0_0_20px_rgba(0,82,204,0.5)] scale-105"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <span>{name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {cat.items?.length || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Categories & Tech Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={`grid gap-6 ${
              displayedCategories.length === 1 ? "grid-cols-1 max-w-3xl mx-auto" : "grid-cols-1 lg:grid-cols-2"
            }`}
          >
            {displayedCategories.map((stack, idx) => (
              <motion.div
                key={stack._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-sky-500/40 hover:shadow-[0_0_35px_rgba(56,189,248,0.2)]"
              >
                {/* Card Glow Corner Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500 pointer-events-none" />

                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    {cleanCatName(stack.category)}
                  </h3>
                  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
                    {stack.items?.length || 0} Tools
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {(stack.items || []).map((item, itemIdx) => (
                    <motion.div
                      key={itemIdx}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="group/item flex flex-col items-center justify-center p-4 sm:p-5 bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-blue-400/50 rounded-2xl shadow-sm hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.06] group-hover/item:bg-blue-500/20 transition-colors mb-2.5">
                        <Icon
                          icon={item.icon || "solar:code-linear"}
                          width="34"
                          height="34"
                          className="drop-shadow group-hover/item:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-200 text-center line-clamp-1 group-hover/item:text-white transition-colors">
                        {item.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Continuous Animated Tech Logo Strip */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
            ✨ Powered by Industry-Leading Modern Frameworks & Cloud Platforms
          </p>
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 25,
                ease: "linear",
                repeat: Infinity,
              }}
              className="flex shrink-0 items-center gap-8 py-2"
            >
              {[...allItems, ...allItems].map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 transition shrink-0 cursor-pointer hover:border-primary/50"
                >
                  <Icon icon={t.icon} width="20" height="20" />
                  <span>{t.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technologies;

