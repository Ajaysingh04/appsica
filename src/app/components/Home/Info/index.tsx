"use client";
import React from "react";
import Image from "next/image";

const Info = () => {
  return (
    <section className="bg-slate-950 py-24 relative overflow-hidden border-t border-white/5">
      {/* Background ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

      <div className="container mx-auto lg:max-w-7xl px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Text Content */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 mb-5 shadow-[0_0_15px_rgba(16,185,129,0.15)] w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase">Available for Q3/Q4 Engagements</span>
            </div>

            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold pb-6 leading-tight tracking-tight">
              Let's Architect Your Next <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                Digital Breakthrough.
              </span>
            </h2>
            
            <p className="text-slate-300 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
              Our seasoned software architects, cloud engineers, and technical leaders partner directly with your team to deliver high-velocity, scalable digital platforms.
            </p>

            <div>
              <a 
                href="/contact" 
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-[0_0_30px_rgba(0,82,204,0.5)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Schedule an Architecture Call</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Side: Professional Image with Tech Frame */}
          <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-slate-900">
            {/* Overlay for better blending */}
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
            
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
              alt="Professional IT Engineering Team"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Floating Badge on Image */}
            <div className="absolute bottom-6 left-6 z-20 bg-slate-900/90 backdrop-blur-xl border border-white/15 p-4 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  50+
                </div>
                <div>
                  <p className="text-white font-bold text-sm sm:text-base">Elite Engineers</p>
                  <p className="text-slate-400 text-xs">Ready for Rapid Sprint Onboarding</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Info;
