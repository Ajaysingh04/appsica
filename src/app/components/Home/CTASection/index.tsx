"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { fetchSiteSettings } from "@/lib/api";
import { defaultSiteSettings } from "@/lib/defaultData";

const CTASection = () => {
  const [cta, setCta] = useState(defaultSiteSettings.ctaSection);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await fetchSiteSettings();
      if (settings?.ctaSection) {
        setCta(settings.ctaSection);
      }
    };

    loadSettings();
  }, []);

  return (
    <section className="bg-slate-950 py-24 relative overflow-hidden border-t border-white/5">
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

      <div className="container mx-auto px-4 lg:max-w-5xl relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-900/40 via-slate-900/80 to-slate-900/90 border border-blue-500/30 p-10 sm:p-16 shadow-[0_0_60px_rgba(0,82,204,0.3)] backdrop-blur-2xl text-center overflow-hidden">
          {/* Inner ambient corner glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-sky-300 mb-6 shadow-[0_0_15px_rgba(0,82,204,0.25)]">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">Start Building Today</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {cta.title || "Ready to Transform Your Digital Infrastructure?"}
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-normal leading-relaxed">
            {cta.description ||
              "Partner with Appsica to build scalable custom software, modern cloud architecture, and high-performance engineering teams."}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5">
            <Link
              href={cta.primaryButtonLink || "/contact"}
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-[0_0_30px_rgba(0,82,204,0.6)] hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto text-center"
            >
              {cta.primaryButtonText || "Book Technical Consultation"}
            </Link>
            <Link
              href={cta.secondaryButtonLink || "/services"}
              className="px-8 py-4 rounded-xl border border-white/20 text-white font-bold text-base backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:border-sky-400/50 hover:text-sky-300 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto text-center"
            >
              {cta.secondaryButtonText || "Explore Core Services"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
