import ContactInfo from "@/app/components/Contact/ContactInfo";
import React from "react";
import { Metadata } from "next";
import { Icon } from "@iconify/react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact Engineering & Consultations | Appsica",
  description: "Connect directly with Appsica's principal software architects and cloud consultants. Let's discuss your next mission-critical software development or infrastructure project.",
  keywords: ["Contact Appsica", "IT Consulting", "Software Architecture Consultation", "Hire Senior Engineers"],
};

const ContactHero = () => {
  return (
    <section className="bg-slate-950 relative overflow-hidden pt-36 sm:pt-44 pb-20 border-b border-white/10">
      {/* Background ambient lighting & cyber grid */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

      <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading, Description & Action */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-sky-300 mb-6 w-fit mx-auto lg:mx-0 shadow-[0_0_20px_rgba(0,82,204,0.3)]">
              <Icon icon="solar:chat-round-dots-bold" width="18" height="18" className="text-sky-400" />
              <span className="text-xs font-bold tracking-widest uppercase">Direct Principal Consultation</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.15]">
              Let's Architect Your Next{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                Digital Breakthrough
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
              Whether you are planning a greenfield cloud-native platform, refactoring legacy enterprise systems, or expanding your mobile and web footprint—our senior engineering team is ready to collaborate.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12">
              <a 
                href="#get-in-touch"
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5"
              >
                <span>Initiate Discussion</span>
                <Icon icon="solar:arrow-down-linear" width="18" height="18" />
              </a>

              <a 
                href="https://wa.me/919691847671?text=Hi%20Appsica%20Team%2C%20I%20would%20like%20to%20inquire%20about%20your%20software%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-base border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <Icon icon="ic:baseline-whatsapp" width="20" height="20" className="text-emerald-400" />
                <span>Instant WhatsApp</span>
              </a>
            </div>

            {/* 4-Item Quick Specs Dock */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
              <div className="text-center lg:text-left">
                <span className="text-2xl font-black text-white block">&lt; 24h</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Response SLA</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="text-2xl font-black text-sky-400 block">Strict NDA</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Confidentiality</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="text-2xl font-black text-indigo-400 block">Direct</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Architect Access</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="text-2xl font-black text-emerald-400 block">Global</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Timezone Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Tech Visual Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-1 bg-gradient-to-br from-blue-500/30 via-white/10 to-sky-500/20 shadow-[0_20px_60px_-15px_rgba(0,82,204,0.4)]">
              <div className="relative h-[360px] sm:h-[450px] w-full rounded-[22px] overflow-hidden bg-slate-900 border border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="Appsica Expert Engineering Team"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent pointer-events-none" />

                {/* Floating Status Badge */}
                <div className="absolute top-5 right-5 z-20 bg-slate-900/90 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Senior Architects On-Duty
                  </span>
                </div>

                {/* Quote Glass Card */}
                <div className="absolute bottom-6 left-6 right-6 z-20 bg-slate-900/80 backdrop-blur-xl border border-white/15 p-5 rounded-2xl shadow-2xl">
                  <p className="text-slate-200 text-xs sm:text-sm font-medium italic mb-4 leading-relaxed">
                    "Great software is built by great teams. We don't just write code, we engineer solutions that power long-term business growth."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      50+
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Dedicated Engineers</p>
                      <p className="text-xs text-sky-400">Ready for your roadmap</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const page = () => {
  return (
    <>
      <ContactHero />
      <ContactInfo />
    </>
  );
};

export default page;
