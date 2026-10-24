"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

export interface ProjectCardData {
  title: string;
  slug: string;
  summary?: string;
  coverImage: string;
  images?: string[];
  liveLink?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  tag?: string;
  techStack?: string[];
  category?: string;
  apps?: {
    role?: "customer" | "vendor" | "delivery" | "custom" | string;
    title: string;
    summary?: string;
    playStoreUrl?: string;
    appStoreUrl?: string;
    liveLink?: string;
    icon?: string;
    images?: string[];
  }[];
}

interface PortfolioGridClientProps {
  projects: ProjectCardData[];
}

export default function PortfolioGridClient({ projects }: PortfolioGridClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Determine category dynamically with explicit category support
  const getProjectCategory = (p: ProjectCardData) => {
    if (p.category) {
      const c = p.category.toLowerCase().trim();
      if (c === "mobile" || c === "enterprise" || c === "ecommerce" || c === "web") {
        return c;
      }
    }
    if ((p.apps && p.apps.length > 0) || p.playStoreUrl || p.appStoreUrl) {
      return "mobile";
    }
    const text = (p.title + " " + (p.summary || "") + " " + (p.techStack || []).join(" ")).toLowerCase();
    if (text.includes("mobile") || text.includes("app") || text.includes("flutter") || text.includes("react native") || text.includes("ios") || text.includes("android")) {
      return "mobile";
    }
    if (text.includes("commerce") || text.includes("shop") || text.includes("store") || text.includes("cart") || text.includes("retail")) {
      return "ecommerce";
    }
    if (text.includes("management") || text.includes("dashboard") || text.includes("enterprise") || text.includes("crm") || text.includes("admin") || text.includes("cloud") || text.includes("saas")) {
      return "enterprise";
    }
    return "web";
  };

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "enterprise", label: "Enterprise & SaaS" },
    { id: "ecommerce", label: "E-Commerce" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "web", label: "Web Platforms" },
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesFilter =
        activeFilter === "all" || getProjectCategory(project) === activeFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        (project.summary && project.summary.toLowerCase().includes(q)) ||
        (project.techStack && project.techStack.some((t) => t.toLowerCase().includes(q)));

      return matchesFilter && matchesSearch;
    });
  }, [projects, activeFilter, searchQuery]);

  return (
    <div className="w-full">
      {/* Controls Bar: Filter Pills & Search Input */}
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-5 bg-slate-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => {
            const count =
              cat.id === "all"
                ? projects.length
                : projects.filter((p) => getProjectCategory(p) === cat.id).length;

            const isActive = activeFilter === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(0,82,204,0.4)] scale-105"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-white/10 text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Icon
            icon="solar:magnifer-linear"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            width="18"
            height="18"
          />
          <input
            type="text"
            placeholder="Search projects or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <Icon icon="solar:close-circle-bold" width="16" height="16" />
            </button>
          )}
        </div>
      </div>

      {/* Projects Count Header */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            Featured Case Studies
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-sky-400 border border-blue-500/20">
            {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
          </span>
        </div>
        <p className="text-xs text-slate-400 hidden sm:block">
          Click to inspect architecture & live demo
        </p>
      </div>

      {/* Responsive 3-Column Grid with Reduced Card Scale */}
      {filteredProjects.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => {
              const targetUrl = project.liveLink || `/portfolio/${project.slug}`;
              const isExternal = Boolean(project.liveLink);
              const fallbackTech = ["Cloud Native", "React", "Node.js"];
              const techList =
                project.techStack && project.techStack.length > 0
                  ? project.techStack
                  : fallbackTech;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={project.slug}
                  className="group relative flex flex-col rounded-2xl bg-slate-900/70 border border-white/10 hover:border-sky-500/40 hover:shadow-[0_15px_35px_-10px_rgba(56,189,248,0.2)] transition-all duration-300 overflow-hidden backdrop-blur-xl"
                >
                  {/* Image Container - Compact Height */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Gradient shade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Top Status Badge */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md border border-white/15 text-slate-200 shadow-md flex items-center gap-1.5">
                        {project.apps && project.apps.length > 1 ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
                            <Icon icon="solar:box-minimalistic-bold" width={11} height={11} className="text-violet-400" />
                            <span className="text-violet-300 font-extrabold">{project.apps.length}-in-1 Apps Suite</span>
                          </>
                        ) : project.playStoreUrl ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <Icon icon="solar:play-bold" width={10} height={10} className="text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Google Play App</span>
                          </>
                        ) : isExternal ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-emerald-400 font-bold">Live App</span>
                          </>
                        ) : (
                          <>
                            <Icon icon="solar:document-text-bold" width="12" height="12" className="text-sky-400" />
                            <span>Case Study</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Quick Link Action Indicator */}
                    <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="p-1.5 rounded-full bg-slate-900/90 text-sky-400 border border-sky-500/30 shadow-lg">
                        <Icon icon="solar:arrow-right-up-linear" width="14" height="14" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-grow justify-between bg-slate-900/80">
                    <div>
                      {/* Title */}
                      <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors capitalize tracking-tight line-clamp-1 mb-2">
                        {project.title}
                      </h3>

                      {/* Description */}
                      {project.summary ? (
                        <p className="line-clamp-2 text-xs sm:text-sm text-slate-400 leading-relaxed mb-3">
                          {project.summary}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500 italic mb-3">
                          Enterprise architectural solution engineered for scale and speed.
                        </p>
                      )}

                      {/* Multi-App Ecosystem Chips (if 3-in-1 suite) */}
                      {project.apps && project.apps.length > 1 && (
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {project.apps.map((app, aIdx) => (
                            <span
                              key={aIdx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-semibold capitalize"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                              <span>{app.role ? `${app.role} App` : app.title}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {techList.slice(0, 3).map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {techList.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-400">
                            +{techList.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Bottom Action Row */}
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <Link
                          href={`/portfolio/${project.slug}`}
                          className="font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                        >
                          <span>Case Study</span>
                          <Icon icon="solar:arrow-right-linear" width={14} height={14} />
                        </Link>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {project.apps && project.apps.some((a) => a.playStoreUrl) ? (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {project.apps
                                .filter((a) => a.playStoreUrl)
                                .map((app, aIdx) => (
                                  <Link
                                    key={aIdx}
                                    href={app.playStoreUrl!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all hover:scale-105"
                                    title={`${app.title || "App"}: Open on Google Play`}
                                  >
                                    <Icon icon="solar:play-bold" width={11} height={11} />
                                    <span>
                                      {app.role === "vendor"
                                        ? "Vendor Play Store"
                                        : app.role === "customer"
                                        ? "Customer Play Store"
                                        : app.role === "delivery"
                                        ? "Delivery Play Store"
                                        : "Google Play"}
                                    </span>
                                    <Icon icon="solar:arrow-right-up-linear" width={11} height={11} />
                                  </Link>
                                ))}
                            </div>
                          ) : project.playStoreUrl ? (
                            <Link
                              href={project.playStoreUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all hover:scale-105"
                            >
                              <Icon icon="solar:play-bold" width={11} height={11} />
                              <span>Play Store</span>
                              <Icon icon="solar:arrow-right-up-linear" width={11} height={11} />
                            </Link>
                          ) : isExternal ? (
                            <Link
                              href={project.liveLink!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(0,82,204,0.3)] transition-all hover:scale-105"
                            >
                              <span>Live Demo</span>
                              <Icon icon="solar:arrow-right-up-linear" width={13} height={13} />
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-12 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-sky-400 mb-4 border border-blue-500/20">
            <Icon icon="solar:magnifer-bold" width="28" height="28" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Matching Projects</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            We couldn't find any projects matching "{searchQuery}". Try selecting a different category or clear the search query.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("all");
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
