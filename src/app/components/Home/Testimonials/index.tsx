"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const clientFeedback = [
  {
    name: "Michael Harrison",
    position: "E-Commerce Platform",
    review: "Appsica delivered our project flawlessly and ahead of schedule. Their technical expertise is truly unmatched.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Sarah Jenkins",
    position: "Fintech Mobile App",
    review: "Incredible communication and a top-notch end product. Our app's performance skyrocketed after their work.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "David Cooper",
    position: "Healthcare Dashboard",
    review: "They built a highly scalable infrastructure for us. Fast, reliable, and exactly what our team needed.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
  }
];

const Testimonials = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-slate-950 py-24 overflow-hidden border-t border-white/5 relative">
      {/* Background ambient glows */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

      <div
        ref={ref}
        className="container mx-auto lg:max-w-7xl px-4 relative z-10"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-sky-300 mb-4 shadow-[0_0_15px_rgba(0,82,204,0.25)]">
            <Icon icon="solar:star-bold" width="18" height="18" className="text-amber-400" />
            <span className="text-xs font-bold tracking-widest uppercase">Client Validation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Trusted by Leaders in <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Modern Tech</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mt-4 mx-auto max-w-2xl leading-relaxed">
            Discover how our engineering partnerships drive performance, reliability, and business acceleration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clientFeedback.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 30, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative p-8 rounded-3xl bg-slate-900/70 border border-white/10 shadow-2xl hover:shadow-[0_0_35px_rgba(56,189,248,0.2)] hover:-translate-y-1.5 hover:border-sky-500/40 transition-all duration-300 flex flex-col group backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Icon key={i} icon="mdi:star" width="20" height="20" className="text-amber-400" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <Icon icon="solar:check-circle-bold" width="12" height="12" />
                  Verified
                </span>
              </div>

              <p className="text-slate-300 text-base leading-relaxed mb-8 flex-grow font-normal relative z-10">
                "{item.review}"
              </p>

              <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 ring-2 ring-blue-500/20">
                  <Image src={item.avatarUrl} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{item.name}</h4>
                  <p className="text-xs font-semibold text-sky-400">{item.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
