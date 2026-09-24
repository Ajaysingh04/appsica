"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Features = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-slate-950 py-24 relative overflow-hidden border-t border-white/5">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

      <div ref={ref} className="container mx-auto lg:max-w-7xl px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Interactive Software Architecture Terminal Widget */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Terminal Window */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Window Header */}
                <div className="px-4 py-3 bg-slate-950/80 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">appsica-cloud-pipeline.sh</span>
                  <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ONLINE
                  </div>
                </div>

                {/* Code Terminal Content */}
                <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed text-slate-300 space-y-3">
                  <p className="text-slate-500"># Initializing enterprise cloud deployment</p>
                  <p className="text-sky-300">
                    <span className="text-emerald-400">appsica@production:~$</span> deploy --cluster=us-east-k8s --env=prod
                  </p>
                  
                  <div className="space-y-1.5 pl-2 border-l border-white/10 text-xs">
                    <p className="text-slate-300 flex items-center gap-2">
                      <span className="text-emerald-400">✔</span> Zero-Trust Security Policies verified
                    </p>
                    <p className="text-slate-300 flex items-center gap-2">
                      <span className="text-emerald-400">✔</span> 1,420 Automated Unit & E2E Tests passed
                    </p>
                    <p className="text-slate-300 flex items-center gap-2">
                      <span className="text-emerald-400">✔</span> Microservices Containerized & Signed
                    </p>
                    <p className="text-slate-300 flex items-center gap-2">
                      <span className="text-emerald-400">✔</span> Zero-Downtime Rolling Update complete
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 text-xs space-y-1 mt-4">
                    <div className="flex justify-between text-slate-400">
                      <span>Global Latency:</span>
                      <span className="text-emerald-400 font-bold">18ms (Edge Cache)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Uptime SLA:</span>
                      <span className="text-sky-400 font-bold">99.99% Guaranteed</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Distributed Nodes:</span>
                      <span className="text-white font-bold">Multi-Region Cloud</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating SLA Badge */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-slate-900/90 backdrop-blur-xl border border-sky-500/30 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-float-slow">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
                  <Icon icon="solar:shield-check-bold" width="22" height="22" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">Enterprise Verified</p>
                  <p className="text-xs sm:text-sm font-bold text-white">SOC-2 & ISO Architecture</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Why Choose Us Capabilities */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-sky-300 mb-4 shadow-[0_0_15px_rgba(0,82,204,0.25)]">
                <Icon icon="solar:star-fall-bold" width="18" height="18" className="text-sky-400" />
                <span className="text-xs font-bold tracking-widest uppercase">Why Choose Appsica</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
                Engineered for Scale, <br />
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  Resilient by Design.
                </span>
              </h2>

              <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                We combine deep technical architecture, modern DevOps practices, and agile delivery to build software that scales reliably as your business grows.
              </p>

              {/* Capability Checklist */}
              <div className="space-y-4">
                {[
                  {
                    title: "End-to-End Enterprise Architecture",
                    desc: "From system design and data modeling to production deployment and monitoring.",
                  },
                  {
                    title: "High-Performance Cloud & Microservices",
                    desc: "Decoupled distributed architectures designed for sub-second latency and elastic scale.",
                  },
                  {
                    title: "Automated CI/CD & Automated QA",
                    desc: "Zero-downtime releases with automated testing pipelines to ensure rock-solid stability.",
                  },
                  {
                    title: "Security & Compliance by Default",
                    desc: "Encryption in transit & at rest, role-based access control, and strict compliance readiness.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-sky-500/30 transition-colors">
                    <div className="mt-0.5 w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-sky-400 shrink-0">
                      <Icon icon="solar:check-circle-bold" width="18" height="18" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 py-3.5 px-7 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all"
                >
                  <span>Explore Technical Capabilities</span>
                  <Icon icon="solar:arrow-right-linear" width="18" height="18" />
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
