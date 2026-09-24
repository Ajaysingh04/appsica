"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";

interface MetricItem {
  value: string;
  label: string;
  sub: string;
  icon: string;
}

const metrics: MetricItem[] = [
  {
    value: "100+",
    label: "Projects Delivered",
    sub: "Successful web, mobile & enterprise rollouts",
    icon: "solar:rocket-bold",
  },
  {
    value: "99%",
    label: "Client Satisfaction",
    sub: "Flawless track record of client partnerships",
    icon: "solar:heart-bold",
  },
  {
    value: "10 - 20",
    label: "Elite In-House Engineers",
    sub: "Full-stack architects, designers & DevOps pros",
    icon: "solar:users-group-rounded-bold",
  },
  {
    value: "24/7",
    label: "Technical Support",
    sub: "Round-the-clock SLA & hypercare monitoring",
    icon: "solar:shield-check-bold",
  },
];

const pillars = [
  {
    id: "arch",
    title: "Architecture-First Engineering",
    subtitle: "Built for Hyper-Scale & Zero Tech Debt",
    description:
      "We design decoupled, event-driven architectures with high cohesion and low coupling. Every database schema, cache layer, and API gateway is engineered to handle millions of transactions without performance degradation.",
    icon: "solar:server-square-bold",
    tags: ["Microservices", "Event-Driven", "Redis Caching", "Edge CDN"],
  },
  {
    id: "sec",
    title: "Enterprise Security & Compliance",
    subtitle: "Bank-Grade Encryption by Default",
    description:
      "Security is not an afterthought—it is baked into our code repositories from day zero. We enforce Zero-Trust principles, automated vulnerability scanning, OWASP hardening, and rigorous role-based access control.",
    icon: "solar:lock-keyhole-bold",
    tags: ["Zero-Trust", "OWASP Hardened", "JWT/RBAC", "Pen-Tested"],
  },
  {
    id: "cicd",
    title: "Continuous DevOps & Velocity",
    subtitle: "Automated Deployments with Zero Downtime",
    description:
      "Our CI/CD pipelines automate linting, unit testing, container builds, and cloud staging. We enable teams to deploy multiple times a day with instant rollback safeguards and canary rollouts.",
    icon: "solar:repeat-bold",
    tags: ["Docker", "Kubernetes", "GitHub Actions", "Terraform"],
  },
  {
    id: "ai",
    title: "Applied AI & Next-Gen Systems",
    subtitle: "Intelligent Workflows & Semantic Search",
    description:
      "We build production-ready intelligent capabilities—from customized LLM pipelines and retrieval-augmented generation (RAG) to real-time predictive analytics that give our partners an unfair competitive edge.",
    icon: "solar:cpu-bolt-bold",
    tags: ["Vector Search", "LLM Orchestration", "Predictive Analytics", "RAG"],
  },
];

const targetIndustries = [
  {
    title: "Startups & Scaleups",
    desc: "From rapid MVP prototyping to Series A architecture and high-velocity product iterations.",
    icon: "solar:rocket-2-bold",
    badge: "Agile Sprints",
  },
  {
    title: "E-Commerce & D2C",
    desc: "High-concurrency checkout engines, multi-vendor marketplaces, inventory sync, and payment gateways.",
    icon: "solar:cart-large-4-bold",
    badge: "High Concurrency",
  },
  {
    title: "EdTech & Learning Platforms",
    desc: "Interactive course platforms, video streaming pipelines, student tracking, and automated testing.",
    icon: "solar:square-academic-cap-bold",
    badge: "Scalable Media",
  },
  {
    title: "Healthcare & Telemedicine",
    desc: "Encrypted patient management, doctor tele-consultations, digital records, and appointment bookings.",
    icon: "solar:stethoscope-bold",
    badge: "Encrypted Data",
  },
  {
    title: "Real Estate & PropTech",
    desc: "Interactive property portals, virtual listing engines, lead attribution, and agent CRM automation.",
    icon: "solar:city-bold",
    badge: "Dynamic Portals",
  },
  {
    title: "FinTech & Financial Systems",
    desc: "Secure ledgers, payment reconciliation, wallet architectures, and bank-grade data encryption.",
    icon: "solar:wallet-money-bold",
    badge: "PCI Compliance",
  },
];

const clientGuarantees = [
  {
    title: "24/7 Dedicated Technical Support",
    desc: "Direct access to our engineering team at any hour. Zero tickets lost in limbo, immediate incident escalation.",
    icon: "solar:clock-circle-bold",
    highlight: "Always On",
  },
  {
    title: "Free Post-Launch Maintenance",
    desc: "Every project comes with complimentary post-deployment hypercare to ensure flawless stability under real-world traffic.",
    icon: "solar:wrench-bold",
    highlight: "Zero Risk",
  },
  {
    title: "100% On-Time Delivery Guarantee",
    desc: "Strictly defined sprint milestones, bi-weekly live demos, and transparent delivery with zero surprise delays.",
    icon: "solar:calendar-check-bold",
    highlight: "SLA Backed",
  },
];

const techCategories = [
  {
    category: "Frontend & Interfaces",
    techs: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Framer Motion"],
  },
  {
    category: "Backend & Systems",
    techs: ["Node.js", "Express", "Python / FastAPI", "RESTful APIs", "GraphQL", "WebSockets"],
  },
  {
    category: "Data & Storage",
    techs: ["MongoDB", "PostgreSQL", "Redis Cache", "Vector DBs", "Prisma / Mongoose", "AWS S3"],
  },
  {
    category: "Cloud & Infrastructure",
    techs: ["AWS Cloud", "Cloudflare CDN", "Docker", "Kubernetes", "Vercel Enterprise", "GitHub Actions"],
  },
];

export default function AboutUsClient() {
  const [activeTab, setActiveTab] = useState<string>("arch");

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen selection:bg-blue-600 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-36 sm:pt-44 pb-24 border-b border-white/10">
        {/* Ambient Glows & Tech Grid */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-sky-300 mb-8 shadow-[0_0_20px_rgba(0,82,204,0.3)]"
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span className="text-xs font-bold tracking-widest uppercase">
                Est. 2026 • Indore, Madhya Pradesh
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.12]"
            >
              Engineering Scalable Systems for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                High-Growth Companies
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto"
            >
              Founded in 2026 and headquartered in Indore, Appsica Technologies is an elite software development powerhouse. With over <strong>100+ projects delivered</strong> and a <strong>99% client satisfaction rate</strong>, our team of 10 to 20 dedicated engineers crafts mission-critical digital products that fuel exponential business growth.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-16"
            >
              <Link
                href="/portfolio"
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
              >
                <span>Explore 100+ Projects</span>
                <Icon icon="solar:arrow-right-linear" width={18} height={18} />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-base border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <span>Connect With Us</span>
                <Icon icon="solar:chat-round-line-linear" width={18} height={18} />
              </Link>
            </motion.div>
          </div>

          {/* Key Metrics Strip */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-white/10"
          >
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-slate-900/90 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                    <Icon icon={m.icon} width={22} height={22} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
                <h3 className="text-3xl font-extrabold text-white tracking-tight mb-1">
                  {m.value}
                </h3>
                <p className="text-sm font-semibold text-slate-200 mb-1">{m.label}</p>
                <p className="text-xs text-slate-400 leading-normal">{m.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. FOUNDER & HEADQUARTERS SPOTLIGHT */}
      <section className="py-24 relative overflow-hidden bg-slate-950/90 border-b border-white/10">
        <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-sky-400 tracking-widest uppercase">
              Leadership & Headquarters
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Visionary Leadership Grounded in Craftsmanship
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Founder Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-7 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950 p-8 sm:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/30">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-bold text-sky-400">
                      KG
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Krishna Gopal Singh</h3>
                    <p className="text-sm font-semibold text-sky-400 flex items-center gap-1.5 mt-0.5">
                      <Icon icon="solar:crown-line-duotone" width={16} height={16} />
                      Founder, Appsica Technologies
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <Icon icon="solar:map-point-linear" width={14} height={14} className="text-slate-500" />
                      Indore, Madhya Pradesh, India
                    </p>
                  </div>
                </div>

                <blockquote className="text-base sm:text-lg text-slate-200 leading-relaxed italic border-l-4 border-blue-500 pl-4 my-6 bg-slate-950/40 py-3 rounded-r-xl">
                  &ldquo;At Appsica, our ethos is simple: treat every client&apos;s product like our own company depends on it. We build robust, production-grade software that stands the test of scale and brings real commercial impact.&rdquo;
                </blockquote>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Based in Indore, Madhya Pradesh, Krishna Gopal Singh envisioned a software engineering enterprise that matches Silicon Valley architectural standards while providing deeply accessible, honest, and high-velocity engineering to businesses across India and around the globe.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Icon icon="solar:verified-check-bold" className="text-blue-400" width={16} height={16} />
                  100+ Commercial Projects Guided
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Icon icon="solar:users-group-rounded-linear" className="text-sky-400" width={16} height={16} />
                  10-20 In-House Engineering Team
                </span>
              </div>
            </motion.div>

            {/* Headquarters Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-5 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-950 p-8 sm:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mb-6">
                  <Icon icon="solar:buildings-3-bold" width={26} height={26} />
                </div>

                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">
                  Corporate Headquarters
                </span>
                <h3 className="text-2xl font-bold text-white mt-2 mb-3">
                  Indore, Madhya Pradesh
                </h3>

                <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-5 mb-6">
                  <div className="flex items-start gap-3">
                    <Icon icon="solar:map-point-bold" className="text-red-400 mt-1 shrink-0" width={20} height={20} />
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Office Address</p>
                      <p className="text-sm font-semibold text-white mt-1 leading-relaxed">
                        Ahinsha Tower F7, MG Road,<br />
                        Indore, Madhya Pradesh, India
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Centrally located at Ahinsha Tower F7, MG Road, Indore, our modern tech facility serves clients seamlessly across time zones with high-speed fiber connectivity, secure staging servers, and 24/7 technical monitoring.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>Schedule an In-Person or Virtual Meeting</span>
                  <Icon icon="solar:arrow-right-linear" width={16} height={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. TARGET INDUSTRIES SERVED */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-sky-400 tracking-widest uppercase">
              Domain Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Industries We Transform With Modern Software
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              We engineer mission-critical applications tailored to specific regulatory and performance demands across key global industries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetIndustries.map((ind, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-white/10 bg-slate-900/50 p-7 hover:border-blue-500/40 hover:bg-slate-900/90 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                    <Icon icon={ind.icon} width={24} height={24} />
                  </div>
                  <span className="text-[11px] font-bold text-sky-300 bg-blue-950/80 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                    {ind.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                  {ind.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {ind.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WORK PROCESS & CLIENT GUARANTEE */}
      <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 border-y border-white/10 relative">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">
              Our Ironclad Commitment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              The Appsica Triple Guarantee
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              We stand behind every deliverable with concrete operational guarantees so your project succeeds without friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clientGuarantees.map((g, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/90 to-slate-950 p-8 relative overflow-hidden shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                  <Icon icon={g.icon} width={28} height={28} />
                </div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
                  {g.highlight}
                </span>
                <h3 className="text-xl font-bold text-white mt-4 mb-3">
                  {g.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {g.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ENGINEERING PILLARS */}
      <section className="py-24 bg-slate-950/80 border-b border-white/10 relative">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-bold text-sky-400 tracking-widest uppercase">
                Technical Foundation
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Engineered for Reliability at Scale
              </h2>
            </div>
            <p className="text-slate-400 max-w-md text-sm sm:text-base">
              The four technical cornerstones ensuring every system we ship is rock-solid, scalable, and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => {
              const isSelected = activeTab === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setActiveTab(p.id)}
                  className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border flex flex-col justify-between ${
                    isSelected
                      ? "border-blue-500 bg-slate-900/90 shadow-[0_0_30px_rgba(37,99,235,0.25)] ring-1 ring-blue-500/50"
                      : "border-white/10 bg-slate-900/40 hover:border-white/20 hover:bg-slate-900/70"
                  }`}
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-sky-400 mb-5">
                      <Icon icon={p.icon} width={24} height={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1.5">{p.title}</h3>
                    <p className="text-xs font-semibold text-sky-400 mb-3">{p.subtitle}</p>
                    <p className="text-xs text-slate-300 leading-relaxed mb-6">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                    {p.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. TECHNOLOGY STACK ECOSYSTEM */}
      <section className="py-24 bg-slate-900/50 border-b border-white/10">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-sky-400 tracking-widest uppercase">
              Modern Tech Arsenal
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Production-Proven Tech Stack
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              Curated, battle-tested enterprise technologies designed for speed, security, and developer maintainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techCategories.map((tc, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    {tc.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tc.techs.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HIGH-CONVERSION CTA */}
      <section className="pb-28 pt-12 relative">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="relative rounded-3xl overflow-hidden border border-blue-500/30 bg-gradient-to-r from-blue-950/90 via-slate-900/95 to-indigo-950/90 p-10 sm:p-16 text-center shadow-[0_0_50px_rgba(0,82,204,0.25)]">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-6">
              <Icon icon="solar:sparkles-bold" width={14} height={14} />
              Let&apos;s Build Together
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto mb-6 leading-tight">
              Ready to Partner with Appsica Technologies?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              From our Indore headquarters at Palasia Ahinsha Tower F7, our team of engineers is ready to turn your project requirements into high-performing reality.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
              >
                <span>Schedule a Consultation</span>
                <Icon icon="solar:arrow-right-linear" width={18} height={18} />
              </Link>
              <Link
                href="/portfolio"
                className="px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-base border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                Browse Our 100+ Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
