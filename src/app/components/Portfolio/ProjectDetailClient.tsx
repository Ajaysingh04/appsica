"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import type { IProjectApp } from "@/types/portfolio";

export interface ProjectDetailProps {
  slug: string;
  title: string;
  summary?: string;
  description?: string;
  coverImage: string;
  images?: string[];
  features?: { title: string; description?: string }[];
  techStack?: string[];
  liveLink?: string;
  category?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  apps?: IProjectApp[];
}

export default function ProjectDetailClient({ project }: { project: ProjectDetailProps }) {
  const hasMultiApps = Boolean(project.apps && project.apps.length > 1);
  const [selectedAppRole, setSelectedAppRole] = useState<string>("all");

  // Collect all images across project and its apps
  const allEcosystemImages = useMemo(() => {
    const list: string[] = [project.coverImage, ...(project.images || [])];
    if (project.apps) {
      project.apps.forEach((app) => {
        if (app.images && app.images.length > 0) {
          list.push(...app.images);
        }
      });
    }
    return [...new Set(list.filter(Boolean))];
  }, [project]);

  // Filter gallery images by selected app tab
  const activeGallery = useMemo(() => {
    if (selectedAppRole === "all" || !project.apps) {
      return allEcosystemImages;
    }
    const foundApp = project.apps.find((a) => a.role === selectedAppRole || a.title === selectedAppRole);
    if (foundApp && foundApp.images && foundApp.images.length > 0) {
      return foundApp.images;
    }
    return allEcosystemImages;
  }, [selectedAppRole, project.apps, allEcosystemImages]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset active image index when tab changes
  const handleTabChange = (role: string) => {
    setSelectedAppRole(role);
    setActiveImageIndex(0);
  };

  const selectedAppDetails = useMemo(() => {
    if (selectedAppRole === "all" || !project.apps) return null;
    return project.apps.find((a) => a.role === selectedAppRole || a.title === selectedAppRole) || null;
  }, [selectedAppRole, project.apps]);

  const fallbackFeatures = [
    {
      title: "Real-time Order & Workflow Synchronization",
      description: "Sub-second event streaming across Customer, Vendor, and Delivery applications via persistent WebSockets.",
    },
    {
      title: "Automated Routing & GPS Geofencing",
      description: "Smart algorithmic delivery assignment, distance optimization, and real-time live map beaconing.",
    },
    {
      title: "Merchant Inventory & Kitchen Display",
      description: "Granular stock toggling, surge-pricing controls, and live order preparation workflows for vendors.",
    },
    {
      title: "Cloud Infrastructure & High Availability",
      description: "Engineered on scalable microservice containers ensuring 99.99% operational uptime under peak flash sales.",
    },
  ];

  const features = project.features && project.features.length > 0 ? project.features : fallbackFeatures;

  const techStack =
    project.techStack && project.techStack.length > 0
      ? project.techStack
      : ["Flutter / React Native", "Next.js", "Node.js", "WebSockets", "MongoDB", "Google Maps API", "Cloud Containers"];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* 1. High-Tech Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden border-b border-white/5">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-violet-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

        <div className="container mx-auto px-4 lg:max-w-6xl relative z-10">
          {/* Top Breadcrumb & Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-8"
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white group transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-sky-500/40 group-hover:bg-blue-600/20 transition-all">
                <Icon
                  icon="solar:arrow-left-linear"
                  width="16"
                  height="16"
                  className="group-hover:-translate-x-0.5 transition-transform text-sky-400"
                />
              </div>
              <span>Back to All Case Studies</span>
            </Link>

            <div className="flex items-center gap-2">
              {hasMultiApps ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-950/80 to-indigo-950/80 border border-violet-500/40 text-violet-300 text-xs font-bold shadow-lg">
                  <Icon icon="solar:box-minimalistic-bold" width={14} height={14} className="text-violet-400" />
                  <span>{project.apps!.length}-in-1 Multi-App Ecosystem Suite</span>
                </div>
              ) : project.playStoreUrl ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-md">
                  <Icon icon="solar:play-bold" width={13} height={13} />
                  <span>Google Play Production App</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="uppercase tracking-wider">Production Architecture</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Title & Headline */}
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 capitalize"
            >
              {project.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-normal mb-8"
            >
              {project.summary ||
                "A scalable end-to-end digital architecture engineered for seamless operations, multi-stakeholder synchronization, and peak mobile performance."}
            </motion.p>

            {/* 3-in-1 Ecosystem Direct Downloads Card (Hero Highlight) */}
            {hasMultiApps && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mb-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-violet-950/70 via-slate-900/90 to-indigo-950/70 border border-violet-500/30 backdrop-blur-2xl shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-400/30 flex items-center justify-center text-violet-300">
                      <Icon icon="solar:box-minimalistic-bold" width={18} height={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">Tri-Party Mobile Ecosystem</h3>
                      <p className="text-xs text-slate-400">Available for immediate installation from Google Play</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-violet-300 bg-violet-500/20 border border-violet-500/30 px-2.5 py-1 rounded-full w-fit">
                    3 Synchronized Apps
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {project.apps!.map((app, idx) => {
                    const roleColor =
                      app.role === "customer"
                        ? "from-blue-500/20 to-sky-500/10 border-blue-500/30 text-sky-400"
                        : app.role === "vendor"
                        ? "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400"
                        : app.role === "delivery"
                        ? "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400"
                        : "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400";

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col justify-between hover:border-violet-400/50 transition-all group"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border bg-gradient-to-r uppercase tracking-wider ${roleColor}`}
                            >
                              {app.role || "Mobile"} App
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">#{idx + 1}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                            {app.title}
                          </h4>
                          {app.summary && (
                            <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                              {app.summary}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/5">
                          {app.playStoreUrl ? (
                            <a
                              href={app.playStoreUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg hover:shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                            >
                              <Icon icon="solar:play-bold" width={13} height={13} />
                              <span>Google Play</span>
                              <Icon icon="solar:arrow-right-up-linear" width={11} height={11} />
                            </a>
                          ) : (
                            <div className="text-center py-2 text-xs font-semibold text-slate-500 italic bg-white/[0.02] rounded-xl border border-white/5">
                              Play Store Available on Request
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Standard Single Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              {project.playStoreUrl && !hasMultiApps && (
                <a
                  href={project.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group"
                >
                  <Icon icon="solar:play-bold" width={18} height={18} />
                  <span>Get on Google Play</span>
                  <Icon
                    icon="solar:arrow-right-up-linear"
                    width={16}
                    height={16}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
              )}

              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,82,204,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span>Launch Live Deployment</span>
                  <Icon
                    icon="solar:arrow-right-up-linear"
                    width={18}
                    height={18}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
              )}

              <Link
                href="/contact"
                className="px-7 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-sky-400/40 text-white font-bold text-sm backdrop-blur-xl transition-all duration-300 flex items-center gap-2"
              >
                <span>Request Custom App Architecture</span>
              </Link>
            </motion.div>
          </div>

          {/* Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 pt-10 border-t border-white/5"
          >
            {[
              {
                label: "App Architecture",
                value: hasMultiApps ? "3 Synchronized Apps" : "Mobile / Web Platform",
                icon: "solar:smartphone-bold",
              },
              { label: "Deployment", value: "Multi-Region Cloud", icon: "solar:cloud-bold" },
              { label: "Sync Engine", value: "Real-Time WebSocket", icon: "solar:bolt-bold" },
              { label: "Release Status", value: "Production Verified", icon: "solar:shield-check-bold" },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1">
                  <Icon icon={stat.icon} width={16} height={16} />
                  <span>{stat.label}</span>
                </div>
                <p className="text-white font-bold text-sm sm:text-base">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. Main Media Showcase & Multi-App Gallery */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 lg:max-w-6xl relative z-10">
          {/* Multi-App Screenshot Switcher Tabs */}
          {hasMultiApps && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-white/10 backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTabChange("all")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    selectedAppRole === "all"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg scale-105"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon icon="solar:gallery-wide-bold" width={14} height={14} />
                  <span>All Screenshots ({allEcosystemImages.length})</span>
                </button>

                {project.apps!.map((app, idx) => {
                  const isActive = selectedAppRole === (app.role || app.title);
                  const count = app.images?.length || 0;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTabChange(app.role || app.title)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? "bg-violet-600 text-white shadow-lg scale-105"
                          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon
                        icon={
                          app.role === "customer"
                            ? "solar:user-bold"
                            : app.role === "vendor"
                            ? "solar:shop-2-bold"
                            : app.role === "delivery"
                            ? "solar:box-bold"
                            : "solar:smartphone-bold"
                        }
                        width={14}
                        height={14}
                      />
                      <span className="capitalize">{app.role ? `${app.role} App` : app.title}</span>
                      {count > 0 && <span className="text-[10px] opacity-75">({count})</span>}
                    </button>
                  );
                })}
              </div>

              {/* Quick direct download for current selected app */}
              {selectedAppDetails && selectedAppDetails.playStoreUrl && (
                <a
                  href={selectedAppDetails.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition hover:scale-105"
                >
                  <Icon icon="solar:play-bold" width={12} height={12} />
                  <span>Open {selectedAppDetails.role || "This"} App on Play Store</span>
                  <Icon icon="solar:arrow-right-up-linear" width={11} height={11} />
                </a>
              )}
            </div>
          )}

          {/* Main Visual Showcase Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-16 rounded-3xl bg-slate-900/70 border border-white/10 p-3 sm:p-5 shadow-2xl backdrop-blur-2xl overflow-hidden"
          >
            {/* Active Display Image Canvas - 100% Uncropped with object-contain */}
            <div className="relative w-full h-[400px] sm:h-[560px] md:h-[680px] rounded-2xl overflow-hidden bg-slate-950/90 flex items-center justify-center p-2 sm:p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedAppRole}-${activeImageIndex}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeGallery[activeImageIndex] || project.coverImage}
                    alt={`${project.title} screenshot`}
                    fill
                    priority
                    className="object-contain p-2 sm:p-4 transition-all duration-500"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next Navigation Overlay */}
              {activeGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev === 0 ? activeGallery.length - 1 : prev - 1));
                    }}
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl transition-all cursor-pointer z-20 hover:scale-110"
                    aria-label="Previous Image"
                  >
                    <Icon icon="solar:arrow-left-linear" width="20" height="20" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev === activeGallery.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl transition-all cursor-pointer z-20 hover:scale-110"
                    aria-label="Next Image"
                  >
                    <Icon icon="solar:arrow-right-linear" width="20" height="20" />
                  </button>
                </>
              )}

              {/* Bottom Image Caption Tag */}
              <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 z-10 flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-950/90 backdrop-blur-md border border-white/20 text-white shadow-xl flex items-center gap-2">
                  <Icon icon="solar:camera-bold" width="14" height="14" className="text-sky-400" />
                  <span>
                    Full View ({activeImageIndex + 1}/{activeGallery.length})
                  </span>
                </span>
                {selectedAppDetails && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-600/90 text-white shadow-lg capitalize">
                    {selectedAppDetails.role || "App"} Screen
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {activeGallery.length > 1 && (
              <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {activeGallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 sm:w-28 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-slate-950 ${
                      activeImageIndex === idx
                        ? "border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-105 opacity-100"
                        : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="thumbnail" fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* 3. Two-Column Layout: Architecture Deep-Dive + Sticky Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-12">
              {/* Architecture Overview */}
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <Icon icon="solar:document-text-bold" width="14" height="14" />
                  <span>Project Overview</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 tracking-tight">
                  {hasMultiApps ? "The 3-in-1 Ecosystem Architecture" : "The Problem & Architectural Approach"}
                </h2>
                <div className="text-slate-300 text-base sm:text-lg leading-relaxed space-y-4">
                  {project.description ? (
                    <p className="whitespace-pre-wrap">{project.description}</p>
                  ) : (
                    <>
                      <p>
                        High-velocity commercial mobile platforms demand seamless coordination between multiple
                        stakeholders: customers, merchants/vendors, and delivery fleets. Any data lag or dropped
                        socket event directly impacts customer satisfaction and operational margins.
                      </p>
                      <p>
                        Our engineering architects designed an event-driven microservices architecture connecting three
                        purpose-built native mobile applications through a centralized real-time dispatch and ordering
                        broker, ensuring sub-second state synchronization and high fault tolerance.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* 3-in-1 Ecosystem Deep Dive (if multi-apps) */}
              {hasMultiApps && (
                <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-violet-950/40 border border-violet-500/20 backdrop-blur-xl shadow-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4">
                    <Icon icon="solar:layers-bold" width={14} height={14} />
                    <span>Multi-Stakeholder Workflow</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 tracking-tight">
                    Synchronized Tri-Party Mobile Architecture
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-950/80 border border-blue-500/20">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-sky-400 flex items-center justify-center mb-3">
                        <Icon icon="solar:user-bold" width={20} height={20} />
                      </div>
                      <h3 className="text-base font-bold text-white mb-1.5">1. Customer App</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Explores catalog, customizes items, processes in-app payment, and tracks orders via live map
                        telemetry.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/20">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                        <Icon icon="solar:shop-2-bold" width={20} height={20} />
                      </div>
                      <h3 className="text-base font-bold text-white mb-1.5">2. Vendor App</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Receives audio-alerted orders, updates preparation milestones, and dispatches packages to the
                        nearest fleet driver.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/20">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                        <Icon icon="solar:box-bold" width={20} height={20} />
                      </div>
                      <h3 className="text-base font-bold text-white mb-1.5">3. Delivery App</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Auto-accepts optimal route batches, navigates via turn-by-turn GPS, and confirms delivery with
                        secure customer OTP.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Features Bento Grid */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <Icon icon="solar:widget-bold" width={14} height={14} />
                  <span>Core Capabilities</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 tracking-tight">
                  Engineered System Features
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {features.map((feat, i) => (
                    <div
                      key={i}
                      className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-sky-500/30 hover:shadow-[0_10px_30px_-10px_rgba(56,189,248,0.2)] transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/20 text-sky-400 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon icon="solar:check-circle-bold" width={20} height={20} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                        {feat.title}
                      </h3>
                      {feat.description && (
                        <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Radar */}
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <Icon icon="solar:code-bold" width={14} height={14} />
                  <span>Technology Radar</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
                  Technologies & Frameworks
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                  Engineered on high-performance frameworks with native compilation for fast startup and fluid 60fps UX.
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {techStack.map((tech, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-sky-500/40 hover:bg-white/[0.08] text-slate-200 text-xs sm:text-sm font-mono font-medium transition-all duration-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Project Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                {/* Project Specs Card */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-5 pb-3 border-b border-white/5 flex items-center gap-2">
                    <Icon icon="solar:info-circle-bold" className="text-sky-400" width={20} height={20} />
                    <span>Project Specifications</span>
                  </h3>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Platform Scope:</span>
                      <span className="text-white font-bold">
                        {hasMultiApps ? "3 Synchronized Mobile Apps" : "Mobile / Web App"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Store Verification:</span>
                      <span className="text-emerald-400 font-bold">Google Play Approved</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Real-Time Sync:</span>
                      <span className="text-sky-400 font-bold">&lt; 150ms Latency</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Uptime SLA:</span>
                      <span className="text-emerald-400 font-bold">99.99% Cloud SLA</span>
                    </div>
                  </div>

                  {/* Multi-App Play Store Links in Sidebar */}
                  {hasMultiApps && (
                    <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Get It On Google Play
                      </p>
                      {project.apps!.map((app, aIdx) => (
                        <div key={aIdx}>
                          {app.playStoreUrl ? (
                            <a
                              href={app.playStoreUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/30 text-white font-bold text-xs transition-all flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <Icon icon="solar:play-bold" width={14} height={14} className="text-emerald-400" />
                                <span className="capitalize">{app.role ? `${app.role} App` : app.title}</span>
                              </div>
                              <Icon icon="solar:arrow-right-up-linear" width={13} height={13} className="text-slate-400" />
                            </a>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}

                  {project.liveLink && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(0,82,204,0.4)] transition-all flex items-center justify-center gap-2 text-center"
                      >
                        <span>Open Live Deployment</span>
                        <Icon icon="solar:arrow-right-up-linear" width={16} height={16} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Consultation Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/30 via-slate-900/90 to-indigo-950/30 border border-blue-500/20 backdrop-blur-xl shadow-2xl text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-400/30 text-sky-400 flex items-center justify-center mx-auto mb-4">
                    <Icon icon="solar:chat-round-dots-bold" width={24} height={24} />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">Need a 3-in-1 Mobile App Suite?</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-5">
                    We develop and publish custom synchronized Customer, Vendor, and Delivery apps directly to the
                    Google Play Store.
                  </p>
                  <Link
                    href="/contact"
                    className="block w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-lg hover:-translate-y-0.5 transition-all text-center"
                  >
                    Discuss Your Mobile App Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
