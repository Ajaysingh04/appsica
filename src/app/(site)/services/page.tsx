import ServicesCard from "@/app/components/Services/ServiceCard";
import { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";

export const metadata: Metadata = {
  title: "Enterprise Services & Engineering Capabilities | Appsica",
  description: "Appsica delivers mission-critical software solutions including Custom Enterprise Systems, Cloud Architecture, DevOps Pipelines, and High-Performance Mobile Ecosystems.",
  keywords: ["Enterprise Software", "Cloud DevOps", "Microservices", "Full-Stack Development", "Appsica Services"],
};

const ServicesHero = () => {
  return (
    <section className="bg-slate-950 relative overflow-hidden pt-36 sm:pt-44 pb-20 border-b border-white/10">
      {/* Dynamic ambient lights & grid pattern */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

      <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-sky-300 mb-6 w-fit mx-auto lg:mx-0 shadow-[0_0_20px_rgba(0,82,204,0.3)]">
              <Icon icon="solar:shield-check-bold" width="18" height="18" className="text-sky-400" />
              <span className="text-xs font-bold tracking-widest uppercase">Enterprise Capabilities</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.15]">
              Engineering Scalable Platforms for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                Modern Enterprises
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
              From resilient cloud microservices to high-performance mobile and web systems. We engineer production-ready, secure, and future-proof digital architectures designed for rapid scale.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12">
              <a 
                href="#capabilities-catalog" 
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5"
              >
                <span>Explore Capabilities</span>
                <Icon icon="solar:arrow-down-linear" width="18" height="18" />
              </a>

              <Link 
                href="/contact" 
                className="px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-base border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <span>Technical Consultation</span>
                <Icon icon="solar:chat-round-dots-linear" width="18" height="18" />
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
              <div className="text-center lg:text-left">
                <span className="text-2xl sm:text-3xl font-black text-white block">99.99%</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Uptime SLA</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="text-2xl sm:text-3xl font-black text-sky-400 block">100+</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Deployments</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="text-2xl sm:text-3xl font-black text-indigo-400 block">Zero-Trust</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Architecture</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">24/7</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">DevOps Support</span>
              </div>
            </div>
          </div>

          {/* Right Side: High-Tech Enterprise Terminal / Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-1 bg-gradient-to-br from-blue-500/30 via-white/10 to-sky-500/20 shadow-[0_20px_60px_-15px_rgba(0,82,204,0.4)]">
              <div className="rounded-[22px] bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-6 sm:p-7 overflow-hidden relative">
                
                {/* Window header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-xs font-mono text-slate-400">appsica-mesh // architecture.sh</span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    LIVE SYSTEM
                  </span>
                </div>

                {/* Architecture Metrics Grid */}
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                      <span className="text-slate-300">Cluster Status</span>
                    </div>
                    <span className="text-sky-400 font-bold">Optimal (Multi-Region)</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon icon="solar:server-square-bold" width="18" height="18" className="text-blue-400" />
                      <span className="text-slate-300">Microservices Mesh</span>
                    </div>
                    <span className="text-slate-200">18 Nodes Active</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon icon="solar:shield-warning-bold" width="18" height="18" className="text-indigo-400" />
                      <span className="text-slate-300">Security Ingress</span>
                    </div>
                    <span className="text-emerald-400">WAF / TLS 1.3 Strict</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon icon="solar:bolt-circle-bold" width="18" height="18" className="text-amber-400" />
                      <span className="text-slate-300">P99 Global Latency</span>
                    </div>
                    <span className="text-amber-300 font-bold">&lt; 38ms</span>
                  </div>
                </div>

                {/* Code snippet block */}
                <div className="mt-5 p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-slate-300 leading-relaxed">
                  <p className="text-slate-500 mb-1">// Deploying enterprise capability</p>
                  <p className="text-sky-300 font-semibold">$ appsica deploy --cluster=prod-enterprise</p>
                  <p className="text-emerald-400 mt-1">✓ Build verified: zero vulnerability findings</p>
                  <p className="text-slate-400">✓ CI/CD continuous deployment pipeline initialized</p>
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
      <ServicesHero />
      <ServicesCard />
    </>
  );
};

export default page;
