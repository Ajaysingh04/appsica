"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

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
}

export default function ProjectDetailClient({ project }: { project: ProjectDetailProps }) {
  const gallery = [
    ...new Set([project.coverImage, ...(project.images || [])].filter(Boolean)),
  ];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fallbackFeatures = [
    {
      title: "Real-time Attendance & Shift Tracking",
      description: "Automated clock-in/out mechanisms with geo-verification and live manager dashboards.",
    },
    {
      title: "Automated Payroll & Compensation Engine",
      description: "Seamless calculation of overtime, deductions, and tax compliance with one-click export.",
    },
    {
      title: "Role-Based Access & Enterprise Security",
      description: "Granular permissions for employees, team leads, and HR managers with audit trail logs.",
    },
    {
      title: "Cloud Infrastructure & High Availability",
      description: "Engineered on scalable cloud containers ensuring 99.99% operational uptime.",
    },
  ];

  const features = project.features && project.features.length > 0
    ? project.features
    : fallbackFeatures;

  const techStack = project.techStack && project.techStack.length > 0
    ? project.techStack
    : ["React", "Next.js", "Node.js", "TypeScript", "Tailwind CSS", "Cloud Architecture", "MongoDB"];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* 1. High-Tech Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden border-b border-white/5">
        {/* Background Ambient Glows & Cyber Grid */}
        <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

        <div className="container mx-auto px-4 lg:max-w-6xl relative z-10">
          {/* Top Breadcrumb & Live Status Bar */}
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

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="uppercase tracking-wider">Production Architecture</span>
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
              className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-normal mb-10"
            >
              {project.summary ||
                "An enterprise-grade digital architecture built to streamline operations, enhance security, and deliver measurable performance outcomes at scale."}
            </motion.p>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,82,204,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span>Launch Live Application</span>
                  <Icon
                    icon="solar:arrow-right-up-linear"
                    width="18"
                    height="18"
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
              )}
              <Link
                href="/contact"
                className="px-7 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-sky-400/40 text-white font-bold text-sm backdrop-blur-xl transition-all duration-300 flex items-center gap-2"
              >
                <span>Request Custom Architecture</span>
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
              { label: "Architecture SLA", value: "99.99% Uptime", icon: "solar:shield-check-bold" },
              { label: "Deployment", value: "Multi-Region Cloud", icon: "solar:cloud-bold" },
              { label: "Engineering Scope", value: "Full-Stack System", icon: "solar:code-square-bold" },
              { label: "Release Status", value: "Active in Production", icon: "solar:rocket-2-bold" },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1">
                  <Icon icon={stat.icon} width="16" height="16" />
                  <span>{stat.label}</span>
                </div>
                <p className="text-white font-bold text-sm sm:text-base">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. Main Media Showcase & Deep-Dive Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 lg:max-w-6xl relative z-10">
          
          {/* Main Visual Showcase Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-16 rounded-3xl bg-slate-900/70 border border-white/10 p-3 sm:p-5 shadow-2xl backdrop-blur-2xl overflow-hidden"
          >
            {/* Active Display Image Canvas - 100% Uncropped with object-contain */}
            <div className="relative w-full h-[400px] sm:h-[560px] md:h-[680px] rounded-2xl overflow-hidden bg-slate-950/90 flex items-center justify-center p-2 sm:p-4">
              <Image
                src={gallery[activeImageIndex] || project.coverImage}
                alt={`${project.title} screenshot`}
                fill
                priority
                className="object-contain p-2 sm:p-4 transition-all duration-500"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />

              {/* Prev / Next Image Navigation Overlay (if multiple images) */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
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
                      setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl transition-all cursor-pointer z-20 hover:scale-110"
                    aria-label="Next Image"
                  >
                    <Icon icon="solar:arrow-right-linear" width="20" height="20" />
                  </button>
                </>
              )}

              {/* Bottom Image Caption Tag & Fullscreen prompt */}
              <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 z-10">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-950/90 backdrop-blur-md border border-white/20 text-white shadow-xl flex items-center gap-2">
                  <Icon icon="solar:camera-bold" width="14" height="14" className="text-sky-400" />
                  <span>Full View ({activeImageIndex + 1}/{gallery.length})</span>
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation (if multiple images) */}
            {gallery.length > 1 && (
              <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
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

          {/* 3. Two-Column Layout: Architecture Deep-Dive + Sticky Info Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            
            {/* Left Column: Overview, Features & Technical Architecture */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Architecture Overview */}
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <Icon icon="solar:document-text-bold" width="14" height="14" />
                  <span>Project Overview</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 tracking-tight">
                  The Problem & Architectural Approach
                </h2>
                <div className="text-slate-300 text-base sm:text-lg leading-relaxed space-y-4">
                  {project.description ? (
                    <p className="whitespace-pre-wrap">{project.description}</p>
                  ) : (
                    <>
                      <p>
                        Modern organizations require automated, resilient software ecosystems that eliminate administrative friction and guarantee data integrity across distributed departments.
                      </p>
                      <p>
                        Our engineering team architected a unified platform with clean microservices separation, role-based security policies, and high-performance database indexing to handle concurrent requests with sub-second response times.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Key Features Bento Grid */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <Icon icon="solar:widget-bold" width="14" height="14" />
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
                        <Icon icon="solar:check-circle-bold" width="20" height="20" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                        {feat.title}
                      </h3>
                      {feat.description && (
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {feat.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Radar */}
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <Icon icon="solar:code-bold" width="14" height="14" />
                  <span>Technology Radar</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
                  Technologies & Frameworks
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                  Leveraging cutting-edge cloud, backend, and frontend standards for optimal maintainability.
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

            {/* Right Column: Sticky Project Sidebar Widget */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                
                {/* Project Specs Card */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-5 pb-3 border-b border-white/5 flex items-center gap-2">
                    <Icon icon="solar:info-circle-bold" className="text-sky-400" width="20" height="20" />
                    <span>Project Specifications</span>
                  </h3>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Client Industry:</span>
                      <span className="text-white font-bold">Enterprise Software</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Execution Model:</span>
                      <span className="text-white font-bold">Agile Sprints</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Security Standard:</span>
                      <span className="text-emerald-400 font-bold">SOC-2 Ready</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Deployment SLA:</span>
                      <span className="text-sky-400 font-bold">99.99% Uptime</span>
                    </div>
                  </div>

                  {project.liveLink && (
                    <div className="mt-6 pt-5 border-t border-white/5">
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(0,82,204,0.4)] transition-all flex items-center justify-center gap-2 text-center"
                      >
                        <span>Open Live Deployment</span>
                        <Icon icon="solar:arrow-right-up-linear" width="16" height="16" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Direct Consultation Widget */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/30 via-slate-900/90 to-indigo-950/30 border border-blue-500/20 backdrop-blur-xl shadow-2xl text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-400/30 text-sky-400 flex items-center justify-center mx-auto mb-4">
                    <Icon icon="solar:chat-round-dots-bold" width="24" height="24" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    Planning Something Similar?
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-5">
                    Our principal architects can analyze your requirements and deliver a detailed engineering blueprint.
                  </p>
                  <Link
                    href="/contact"
                    className="block w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-lg hover:-translate-y-0.5 transition-all text-center"
                  >
                    Schedule Architecture Review
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
