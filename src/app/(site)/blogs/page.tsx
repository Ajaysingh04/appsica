"use client";

import { useState } from "react";
import BlogsGrid from "@/app/components/BlogList/BlogsGrid";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

const BlogsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Articles");

  const categories = [
    "All Articles",
    "Web Development",
    "Mobile Apps",
    "Cloud & DevOps",
    "UI/UX Design",
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen relative overflow-hidden">
      {/* Dynamic ambient lights & tech grid */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

      {/* 1. Hero Section */}
      <section className="relative pt-36 sm:pt-44 pb-16 sm:pb-20 border-b border-white/10 z-10">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Heading & Description */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-sky-300 mb-6 w-fit mx-auto lg:mx-0 shadow-[0_0_20px_rgba(0,82,204,0.3)]">
                <Icon icon="solar:document-text-bold" width="18" height="18" className="text-sky-400" />
                <span className="text-xs font-bold tracking-widest uppercase">Software Engineering & Architecture</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.15]">
                Insights from the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  Frontlines of Code
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
                In-depth blueprints, cloud architecture strategies, and engineering lessons from designing and scaling mission-critical enterprise systems.
              </p>

              {/* Live Search Bar */}
              <div className="relative max-w-md mx-auto lg:mx-0">
                <div className="relative flex items-center">
                  <Icon
                    icon="solar:magnifer-linear"
                    width="20"
                    height="20"
                    className="absolute left-4 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, architectures, tech..."
                    className="w-full pl-12 pr-10 py-3.5 bg-slate-900/90 border border-white/10 focus:border-sky-400/60 rounded-2xl text-white text-sm placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all shadow-lg focus:shadow-[0_0_25px_rgba(56,189,248,0.2)]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                      <Icon icon="solar:close-circle-bold" width="18" height="18" />
                    </button>
                  )}
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-white/10 max-w-md mx-auto lg:mx-0">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-white block">10k+</span>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Monthly Devs</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-sky-400 block">Weekly</span>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Blueprints</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-indigo-400 block">100%</span>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Production Insights</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Console Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl p-1 bg-gradient-to-br from-blue-500/30 via-white/10 to-sky-500/20 shadow-[0_20px_60px_-15px_rgba(0,82,204,0.4)]">
                <div className="relative h-[340px] sm:h-[420px] w-full rounded-[22px] overflow-hidden bg-slate-900 border border-white/10 group">
                  <Image
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"
                    alt="Software Engineering Architecture Code"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent pointer-events-none" />

                  {/* Floating Badges */}
                  <div className="absolute top-5 right-5 z-20 bg-slate-900/90 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Architectural Digest
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 z-20 bg-slate-900/80 backdrop-blur-xl border border-white/15 p-5 rounded-2xl shadow-2xl">
                    <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-widest block mb-1">
                      Featured Blueprint
                    </span>
                    <p className="text-white text-sm sm:text-base font-bold line-clamp-2 leading-snug mb-2">
                      The Future of Microservices: Building Scalable Systems in 2026
                    </p>
                    <Link
                      href="/blogs/future-of-microservices"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 hover:text-white transition-colors"
                    >
                      <span>Read Full Blueprint</span>
                      <Icon icon="solar:arrow-right-linear" width="14" height="14" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Featured Post Showcase */}
      <section className="py-16 border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-400">
              <Icon icon="solar:star-fall-bold-duotone" width="18" height="18" />
              Editor's Spotlight
            </div>
            <div className="h-px bg-white/10 flex-grow"></div>
          </div>

          <div className="rounded-3xl bg-slate-900/70 border border-white/10 overflow-hidden shadow-2xl hover:border-sky-500/40 transition-all duration-400 flex flex-col lg:flex-row group backdrop-blur-xl">
            <div className="lg:w-1/2 relative overflow-hidden h-[280px] sm:h-[360px] lg:h-auto">
              <Image
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"
                alt="Featured Tech Blog"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-5 left-5 bg-blue-600/90 backdrop-blur-md text-white px-3.5 py-1 rounded-full text-xs font-mono font-bold shadow-lg border border-blue-400/30">
                Must Read Architecture
              </div>
            </div>

            <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mb-4">
                  <span className="text-sky-300 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full font-semibold">
                    Software Architecture
                  </span>
                  <span>•</span>
                  <span>Aug 3, 2026</span>
                  <span>•</span>
                  <span>8 min read</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-snug group-hover:text-sky-300 transition-colors">
                  The Future of Microservices: Building Scalable Systems in 2026
                </h3>

                <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed font-normal">
                  Explore how modern enterprises are transitioning from monolithic applications to highly resilient microservices. We dive deep into Docker, Kubernetes, event-driven architecture, and zero-downtime deployment pipelines.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-800 overflow-hidden border border-white/10 shadow-sm flex items-center justify-center text-sky-400 font-bold">
                    KG
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Krishna Gopal Singh</p>
                    <p className="text-xs text-slate-400">Lead Enterprise Architect</p>
                  </div>
                </div>

                <Link 
                  href="/blogs/future-of-microservices" 
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <span>Read Full Article</span>
                  <Icon icon="solar:arrow-right-linear" width="16" height="16" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Filter Tabs */}
      <section className="pt-12 pb-6 relative z-10">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
            {categories.map((cat, idx) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(0,82,204,0.4)] scale-105"
                      : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Latest Articles Grid */}
      <section className="py-12 pb-24 relative z-10">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {selectedCategory === "All Articles" ? "All Publications" : selectedCategory}
            </h2>
            <div className="h-px bg-white/10 flex-grow"></div>
          </div>

          <BlogsGrid selectedCategory={selectedCategory} searchQuery={searchQuery} />
        </div>
      </section>

      {/* 5. Consultation & Technical Discussion CTA */}
      <section className="pb-24 relative z-10">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-indigo-900/40 border border-white/10 backdrop-blur-2xl text-center flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2 block">
                Engineering Collaboration
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Want to Implement These Architectural Standards?
              </h3>
              <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
                Connect with our senior architects for an in-depth review of your technical stack, cloud infrastructure, or roadmap.
              </p>
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
              >
                <span>Schedule Architectural Session</span>
                <Icon icon="solar:calendar-linear" width="18" height="18" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BlogsPage;
