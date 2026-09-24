"use client";
import React, { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { SuccessModal } from "../Workflow";
import { fetchSiteSettings } from "@/lib/api";
import { defaultSiteSettings } from "@/lib/defaultData";

const Hero: React.FC = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [heroSettings, setHeroSettings] = useState(defaultSiteSettings.hero);

  useEffect(() => {
    const loadHero = async () => {
      const settings = await fetchSiteSettings();
      if (settings?.hero) {
        setHeroSettings(settings.hero as any);
      }
    };

    loadHero();
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-950 min-h-screen transition-colors duration-300 flex items-center pt-32 pb-24">
      {/* Video Background with Cyber Grid Overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={
            heroSettings.videoUrl ||
            "https://v1.pinimg.com/videos/mc/720p/44/e9/78/44e9787fdeeebbdb66fd50cf1aaab09e.mp4"
          }
        />
        {/* Darkening & Grid Overlay for high-tech aesthetic */}
        <div className="absolute inset-0 z-0 bg-slate-950/70 tech-grid-pattern" />
        {/* Radial Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
        {/* Bottom seamless fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none z-0" />
      </div>

      {/* Floating Tech Metric Badge (Left) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="hidden xl:flex items-center gap-3.5 absolute left-8 2xl:left-16 top-1/3 p-4 rounded-2xl glass-tech-card shadow-2xl z-20 animate-float-slow pointer-events-none"
      >
        <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-sky-400">
          <Icon icon="solar:shield-check-bold" width="24" height="24" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
              Live & Secure
            </span>
          </div>
          <p className="text-sm font-bold text-white tracking-wide">
            99.99% Architecture SLA
          </p>
        </div>
      </motion.div>

      {/* Floating Tech Metric Badge (Right) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="hidden xl:flex items-center gap-3.5 absolute right-8 2xl:right-16 top-1/2 p-4 rounded-2xl glass-tech-card shadow-2xl z-20 animate-float-slow pointer-events-none"
        style={{ animationDelay: "2s" }}
      >
        <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
          <Icon icon="solar:rocket-2-bold" width="24" height="24" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Cloud Native & Scalable
          </p>
          <p className="text-sm font-bold text-white tracking-wide">
            100+ Enterprise Apps
          </p>
        </div>
      </motion.div>

      {/* Main Hero Content */}
      <div className="container mx-auto px-4 lg:max-w-6xl relative z-10">
        <div className="text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex flex-col items-center"
          >
            {/* High-Tech Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-8 rounded-full bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 shadow-[0_0_25px_rgba(0,82,204,0.35)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-200 tracking-wide uppercase">
                {heroSettings.badge || "Next-Gen Software Engineering & Cloud Solutions"}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-white mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.12] tracking-tight max-w-5xl">
              {heroSettings.titlePrefix || "Empowering Your"}{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(56,189,248,0.3)]">
                {heroSettings.titleHighlight || "Digital Transformation"}
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl font-normal text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              {heroSettings.description ||
                "Appsica engineers mission-critical enterprise software, scalable cloud architecture, and resilient distributed systems for high-growth businesses."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center w-full max-w-md">
              <button
                onClick={() => setShowSuccessModal(true)}
                className="group relative px-8 py-4 rounded-xl text-base font-bold bg-primary text-white shadow-[0_0_30px_rgba(0,82,204,0.5)] hover:shadow-[0_0_45px_rgba(0,82,204,0.8)] hover:bg-blue-600 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Project Success</span>
                <Icon
                  icon="solar:arrow-right-linear"
                  width="20"
                  height="20"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl text-base font-bold backdrop-blur-xl bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-blue-400/50 hover:text-blue-300 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Get a Free Consultation</span>
              </Link>
            </div>

            {/* Tech capability tags below CTA */}
            <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-slate-400">
              <div className="flex items-center gap-2">
                <Icon icon="solar:check-circle-bold" className="text-emerald-400 text-base" />
                <span>Microservices & Cloud</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="solar:check-circle-bold" className="text-emerald-400 text-base" />
                <span>Agile CI/CD Pipelines</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="solar:check-circle-bold" className="text-emerald-400 text-base" />
                <span>Enterprise Security First</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <SuccessModal onClose={() => setShowSuccessModal(false)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
