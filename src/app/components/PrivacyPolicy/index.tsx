"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

interface SectionItem {
  id: string;
  number: string;
  title: string;
  icon: string;
  badge?: string;
}

const sections: SectionItem[] = [
  { id: "introduction", number: "1", title: "Introduction", icon: "solar:shield-star-bold", badge: "Scope" },
  { id: "information-we-collect", number: "2", title: "Information We Collect", icon: "solar:document-add-bold", badge: "Telemetry & Forms" },
  { id: "how-we-use-information", number: "3", title: "How We Use Your Information", icon: "solar:settings-bold", badge: "Operations" },
  { id: "sharing-of-information", number: "4", title: "Sharing of Information", icon: "solar:share-circle-bold", badge: "No Sale Guarantee" },
  { id: "data-security", number: "5", title: "Data Security and Retention", icon: "solar:lock-keyhole-bold", badge: "Enterprise Grade" },
  { id: "your-rights", number: "6", title: "Your Rights", icon: "solar:user-check-bold", badge: "User Control" },
  { id: "contact-us", number: "7", title: "Contact Us", icon: "solar:letter-bold", badge: "Indore HQ" },
  { id: "updates", number: "8", title: "Updates", icon: "solar:refresh-circle-bold", badge: "Revision Policy" },
];

export default function PrivacyPolicyClient() {
  const [activeSection, setActiveSection] = useState<string>("introduction");
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);

  // Calculate reading scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }

      const scrollPosition = window.scrollY + 220;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -110;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setMobileTocOpen(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter((sec) => sec.title.toLowerCase().includes(query));
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 selection:bg-blue-100 selection:text-blue-900 relative">
      {/* 0. Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200/50 z-[60] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(37,99,235,0.7)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 1. Hero Section */}
      <section className="bg-slate-950 text-white relative overflow-hidden pt-36 sm:pt-44 pb-20 sm:pb-24 border-b border-white/10">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-sky-500/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-sky-300 mb-6 shadow-[0_0_24px_rgba(0,82,204,0.35)] backdrop-blur-md">
              <Icon icon="solar:shield-check-bold" width="18" height="18" className="text-sky-400" />
              <span className="text-xs font-bold tracking-widest uppercase">Legal & Compliance Policy</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.12]">
              Privacy{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                Policy
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              Appsica Technology is dedicated to respecting and safeguarding your personal information.
              Review our global privacy standard for web visitors, clients, and partners.
            </p>

            {/* Metadata Pills */}
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-slate-400 bg-slate-900/80 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg">
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Icon icon="solar:calendar-date-bold" width="16" height="16" className="text-sky-400" />
                Last Updated: <strong className="text-white">13 October 2026</strong>
              </span>
              <span className="hidden sm:inline-block text-slate-600">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Icon icon="solar:verified-check-bold" width="16" height="16" className="text-emerald-400" />
                Active Version 2.0
              </span>
              <span className="hidden sm:inline-block text-slate-600">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Icon icon="solar:clock-circle-bold" width="16" height="16" className="text-indigo-400" />
                Est. Read Time: 4 Mins
              </span>
            </div>

            {/* Quick Hero Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-all active:scale-95"
              >
                <Icon icon="solar:printer-bold" width="16" height="16" className="text-sky-400" />
                Print / Save PDF
              </button>
              <button
                onClick={() => scrollTo("contact-us")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
              >
                <Icon icon="solar:letter-bold" width="16" height="16" />
                Direct Privacy Inquiry
              </button>
              <a
                href="https://wa.me/919691847671?text=Hi%20Appsica%20Team,%20I%20have%20a%20question%20regarding%20your%20privacy%20policy."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
              >
                <Icon icon="solar:chat-round-bold" width="16" height="16" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* 4 Core Commitments Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-14 max-w-6xl mx-auto">
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl hover:border-sky-500/40 transition-all duration-300 shadow-lg group">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-sky-400 flex items-center justify-center mb-3.5 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Icon icon="solar:shield-keyhole-bold" width="22" height="22" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">No Data Resale</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We never sell, rent, or monetize your information to data brokers or third parties.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300 shadow-lg group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3.5 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Icon icon="solar:lock-password-bold" width="22" height="22" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">Enterprise Security</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Industry-grade administrative, electronic, and physical safeguards for all data assets.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl hover:border-sky-500/40 transition-all duration-300 shadow-lg group">
              <div className="w-10 h-10 rounded-xl bg-sky-600/20 text-sky-300 flex items-center justify-center mb-3.5 border border-sky-500/20 group-hover:scale-110 transition-transform">
                <Icon icon="solar:file-check-bold" width="22" height="22" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">Transparent Usage</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Information is strictly used for software consultations, proposals, and service delivery.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl hover:border-indigo-500/40 transition-all duration-300 shadow-lg group">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3.5 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <Icon icon="solar:user-hand-up-bold" width="22" height="22" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">Your Full Control</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Easily request data access, correction, or permanent deletion whenever you choose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content & Navigation Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:max-w-7xl">
          {/* Mobile TOC Floating Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-slate-800 font-bold text-sm"
            >
              <div className="flex items-center gap-2.5">
                <Icon icon="solar:list-check-bold" width="18" height="18" className="text-blue-600" />
                <span>Jump to Section</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{sections.find((s) => s.id === activeSection)?.title || "Select"}</span>
                <Icon
                  icon={mobileTocOpen ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
                  width="16"
                  height="16"
                />
              </div>
            </button>

            {mobileTocOpen && (
              <div className="mt-2 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-1 z-30">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                      {section.number}
                    </span>
                    <span>{section.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Sticky Table of Contents & Quick Contact Sidebar */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                {/* Search Box */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="relative">
                    <Icon
                      icon="solar:magnifer-linear"
                      width="18"
                      height="18"
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Filter sections..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <Icon icon="solar:close-circle-bold" width="16" height="16" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Table of Contents Box */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Icon icon="solar:list-check-bold" width="16" height="16" className="text-blue-600" />
                      Table of Contents
                    </h3>
                    <span className="text-[11px] font-mono font-semibold text-slate-400">
                      8 Sections
                    </span>
                  </div>

                  <nav className="space-y-1.5">
                    {filteredSections.map((section) => {
                      const isActive = activeSection === section.id;
                      return (
                        <button
                          key={section.id}
                          onClick={() => scrollTo(section.id)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between group ${
                            isActive
                              ? "bg-blue-50/90 text-blue-700 font-bold shadow-xs border border-blue-100"
                              : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] shrink-0 font-bold ${
                                isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                              }`}
                            >
                              {section.number}
                            </span>
                            <span className="truncate">{section.title}</span>
                          </div>

                          {section.badge && (
                            <span
                              className={`text-[9.5px] px-2 py-0.5 rounded-full font-mono font-medium shrink-0 ml-1.5 ${
                                isActive
                                  ? "bg-blue-200/60 text-blue-800"
                                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                              }`}
                            >
                              {section.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Direct Contact Executive Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="w-10 h-10 rounded-xl bg-blue-600/25 text-sky-400 flex items-center justify-center mb-3.5 border border-blue-500/20">
                    <Icon icon="solar:chat-round-dots-bold" width="22" height="22" />
                  </div>
                  <h4 className="text-base font-bold mb-1">Direct Privacy Contact</h4>
                  <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                    Have specific questions about compliance, your data rights, or custom NDAs? Reach our team directly:
                  </p>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <Icon icon="solar:letter-bold" width="16" height="16" className="text-sky-400 shrink-0" />
                        <span className="text-slate-300 truncate">contact@appsica.com</span>
                      </div>
                      <button
                        onClick={() => handleCopy("contact@appsica.com", "sidebar-email")}
                        className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[10px] font-mono text-slate-200 transition-colors"
                      >
                        {copiedKey === "sidebar-email" ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <Icon icon="solar:phone-bold" width="16" height="16" className="text-emerald-400 shrink-0" />
                        <span className="text-slate-300 truncate">+91 9691847671</span>
                      </div>
                      <button
                        onClick={() => handleCopy("+919691847671", "sidebar-phone")}
                        className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[10px] font-mono text-slate-200 transition-colors"
                      >
                        {copiedKey === "sidebar-phone" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800/80">
                    <a
                      href="mailto:contact@appsica.com?subject=Privacy%20Policy%20Inquiry"
                      className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white shadow-md transition-all active:scale-95"
                    >
                      <Icon icon="solar:plain-bold" width="14" height="14" />
                      Email Privacy Officer
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Sections */}
            <div className="lg:col-span-8 space-y-8 sm:space-y-10">
              {/* 1. Introduction */}
              <article
                id="introduction"
                className="scroll-mt-28 p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-base shrink-0 border border-blue-200/60 shadow-xs">
                    01
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600">
                      Foundation
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      1. Introduction
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                  <p>
                    <strong>Appsica Technology</strong> (“Appsica”, “we”, “our”, or “us”) respects your privacy.
                    This Privacy Policy explains how we collect, use, and protect your information when you visit{" "}
                    <Link
                      href="https://appsica.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>https://appsica.com/</span>
                      <Icon icon="solar:link-linear" width="14" height="14" />
                    </Link>{" "}
                    or contact us through our website, Meta lead forms, phone, email, or WhatsApp.
                  </p>

                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-600 space-y-2">
                    <span className="font-bold text-slate-800 block">Communication & Interaction Channels Covered:</span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["Official Website", "Meta Lead Generation Forms", "WhatsApp Direct Business", "Corporate Email", "Telephone Calls"].map(
                        (channel, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-2xs"
                          >
                            <Icon icon="solar:check-circle-bold" width="14" height="14" className="text-emerald-500" />
                            {channel}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500">
                    By browsing our websites, submitting inquiries, or interacting with our representatives, you
                    consent to the terms outlined in this document.
                  </p>
                </div>
              </article>

              {/* 2. Information We Collect */}
              <article
                id="information-we-collect"
                className="scroll-mt-28 p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-base shrink-0 border border-blue-200/60 shadow-xs">
                    02
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600">
                      Data Ingestion
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      2. Information We Collect
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                  <p>
                    We may collect your name, phone number, email address, business details, project requirements,
                    estimated budget, and other information you voluntarily provide. Basic technical information may
                    also be collected when you visit our website, depending on the tools enabled.
                  </p>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Categorized Breakdown of Data Points
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {[
                        {
                          icon: "solar:user-bold",
                          title: "Contact Identity",
                          desc: "Full name, business email address, direct phone & WhatsApp contact details.",
                        },
                        {
                          icon: "solar:buildings-bold",
                          title: "Business Details",
                          desc: "Company or startup name, industry sector, website domain, and organization scale.",
                        },
                        {
                          icon: "solar:code-file-bold",
                          title: "Project Requirements",
                          desc: "Technical specifications, design wireframes, target milestones, and tech stack requests.",
                        },
                        {
                          icon: "solar:wallet-money-bold",
                          title: "Commercial & Budget",
                          desc: "Estimated budget parameters and commercial engagement timeline preferences.",
                        },
                        {
                          icon: "solar:chat-dots-bold",
                          title: "Voluntary Communications",
                          desc: "Details and attachments submitted through contact forms, emails, and direct chats.",
                        },
                        {
                          icon: "solar:laptop-minimalistic-bold",
                          title: "Basic Technical Data",
                          desc: "IP address, browser type, operating system, and general aggregated session telemetry.",
                        },
                      ].map((card, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-blue-300 hover:bg-blue-50/20 transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <Icon icon={card.icon} width="18" height="18" />
                            </div>
                            <span className="text-sm font-bold text-slate-900">{card.title}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed pl-10.5">{card.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>

              {/* 3. How We Use Your Information */}
              <article
                id="how-we-use-information"
                className="scroll-mt-28 p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-base shrink-0 border border-blue-200/60 shadow-xs">
                    03
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600">
                      Processing Objectives
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      3. How We Use Your Information
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                  <p>We use your information to:</p>

                  <div className="space-y-3 pt-2">
                    {[
                      {
                        title: "Respond to your enquiries and understand your project requirements.",
                        badge: "Inquiry Handling",
                        icon: "solar:chat-round-check-bold",
                      },
                      {
                        title: "Discuss software, website, and mobile app development services.",
                        badge: "Consultation",
                        icon: "solar:programming-bold",
                      },
                      {
                        title: "Provide consultations, proposals, and quotations.",
                        badge: "Commercials",
                        icon: "solar:document-text-bold",
                      },
                      {
                        title: "Contact you regarding your enquiry and provide customer support.",
                        badge: "Client Success",
                        icon: "solar:headphones-round-bold",
                      },
                      {
                        title: "Improve our services and meet legal obligations.",
                        badge: "Compliance",
                        icon: "solar:shield-check-bold",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3.5 p-4 rounded-2xl bg-blue-50/40 border border-blue-100 hover:border-blue-200 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          <Icon icon={item.icon} width="18" height="18" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-xs font-mono font-semibold text-blue-700 uppercase">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-sm sm:text-base font-medium text-slate-800 leading-snug">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* 4. Sharing of Information */}
              <article
                id="sharing-of-information"
                className="scroll-mt-28 p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-base shrink-0 border border-blue-200/60 shadow-xs">
                    04
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600">
                      Disclosures & Guarantees
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      4. Sharing of Information
                    </h2>
                  </div>
                </div>

                <div className="space-y-5 text-slate-700 text-sm sm:text-base leading-relaxed">
                  {/* Zero sale pledge banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Icon icon="solar:shield-check-bold" width="22" height="22" />
                    </div>
                    <div>
                      <strong className="text-emerald-950 font-bold text-sm sm:text-base block mb-0.5">
                        Strict Guarantee: We Do Not Sell Your Information
                      </strong>
                      <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                        We do not sell, rent, or trade your personal information or commercial proposals to advertisers
                        or third-party data brokers under any circumstances.
                      </p>
                    </div>
                  </div>

                  <p>
                    We may share relevant information with authorised service providers, technology partners, or other
                    parties where necessary to respond to your enquiry, deliver services, or comply with applicable law.
                  </p>

                  <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                      <Icon icon="solar:danger-triangle-bold" width="18" height="18" className="text-amber-500" />
                      Third-Party Platforms Notice
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Third-party platforms, including Meta and WhatsApp, may process information under their own privacy policies.
                      When you submit queries through Meta ad lead forms or WhatsApp Business, their independent terms govern transmission.
                    </p>
                  </div>
                </div>
              </article>

              {/* 5. Data Security and Retention */}
              <article
                id="data-security"
                className="scroll-mt-28 p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-base shrink-0 border border-blue-200/60 shadow-xs">
                    05
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600">
                      Protection & Lifecycle
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      5. Data Security and Retention
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                  <p>
                    We take reasonable measures to protect your information from unauthorised access, misuse, or
                    disclosure. We retain information only for as long as reasonably necessary for business, service
                    delivery, and legal purposes.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Icon icon="solar:lock-keyhole-minimalistic-bold" width="18" height="18" />
                        </div>
                        Administrative & Tech Controls
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Industry-standard role-based access management, encrypted storage for customer databases, and
                        secure communication protocols.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-2">
                        <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                          <Icon icon="solar:history-bold" width="18" height="18" />
                        </div>
                        Proportional Lifecycle
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Data is retained only as long as an active business dialogue, contracted development engagement,
                        or legal accounting mandate exists.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* 6. Your Rights */}
              <article
                id="your-rights"
                className="scroll-mt-28 p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-base shrink-0 border border-blue-200/60 shadow-xs">
                    06
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600">
                      User Sovereignty
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      6. Your Rights
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                  <p>
                    Subject to applicable law, you may request access to, correction of, or deletion of your personal
                    information, or withdraw consent where applicable. You may also ask us to stop promotional
                    communications.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      { title: "Right to Access", desc: "Request an overview of any personal details held on file." },
                      { title: "Right to Rectification", desc: "Update or correct outdated or incomplete contact information." },
                      { title: "Right to Deletion", desc: "Request full erasure of your details from active enquiry lists." },
                      { title: "Right to Opt-Out", desc: "Unsubscribe or stop promotional communications at any moment." },
                    ].map((right, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon icon="solar:check-circle-bold" width="16" height="16" className="text-emerald-500 shrink-0" />
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{right.title}</h4>
                        </div>
                        <p className="text-xs text-slate-500 pl-6 leading-relaxed">{right.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs sm:text-sm text-slate-700 flex items-center justify-between gap-4 flex-wrap">
                    <span>
                      To exercise any of these rights, email us directly at{" "}
                      <a href="mailto:contact@appsica.com" className="text-blue-600 font-bold hover:underline">
                        contact@appsica.com
                      </a>
                    </span>
                    <a
                      href="mailto:contact@appsica.com?subject=Data%20Rights%20Request"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
                    >
                      <Icon icon="solar:user-hand-up-bold" width="14" height="14" />
                      Submit Request
                    </a>
                  </div>
                </div>
              </article>

              {/* 7. Contact Us */}
              <article
                id="contact-us"
                className="scroll-mt-28 p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-base shrink-0 border border-blue-200/60 shadow-xs">
                    07
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600">
                      Direct Engagement
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      7. Contact Us
                    </h2>
                  </div>
                </div>

                <p className="text-slate-700 text-sm sm:text-base mb-6 leading-relaxed">
                  For privacy-related questions or requests, contact:
                </p>

                {/* Highly Polished Corporate Contact Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10 flex-wrap gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-600 text-white flex items-center justify-center font-extrabold text-xl shadow-lg">
                        A
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white">Appsica Technology</h3>
                        <p className="text-xs text-sky-400 font-mono">Software, Cloud & AI Engineering</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Active Office
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Website */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-sky-400 flex items-center justify-center shrink-0">
                        <Icon icon="solar:global-bold" width="22" height="22" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] text-slate-400 block font-mono">Website</span>
                        <Link
                          href="https://appsica.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-white hover:text-sky-300 transition-colors truncate block"
                        >
                          https://appsica.com/
                        </Link>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-sky-400 flex items-center justify-center shrink-0">
                        <Icon icon="solar:letter-bold" width="22" height="22" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] text-slate-400 block font-mono">Official Email</span>
                        <a
                          href="mailto:contact@appsica.com"
                          className="text-sm font-bold text-white hover:text-sky-300 transition-colors truncate block"
                        >
                          contact@appsica.com
                        </a>
                      </div>
                      <button
                        onClick={() => handleCopy("contact@appsica.com", "card-email")}
                        className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] text-slate-300 font-mono transition-colors"
                        title="Copy Email"
                      >
                        {copiedKey === "card-email" ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    {/* Phone / WhatsApp */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0">
                        <Icon icon="solar:phone-bold" width="22" height="22" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] text-slate-400 block font-mono">Phone / WhatsApp</span>
                        <a
                          href="tel:+919691847671"
                          className="text-sm font-bold text-white hover:text-sky-300 transition-colors truncate block"
                        >
                          +91 9691847671
                        </a>
                      </div>
                      <button
                        onClick={() => handleCopy("+919691847671", "card-phone")}
                        className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] text-slate-300 font-mono transition-colors"
                        title="Copy Phone"
                      >
                        {copiedKey === "card-phone" ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    {/* Address */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center shrink-0">
                        <Icon icon="solar:map-point-bold" width="22" height="22" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] text-slate-400 block font-mono">Corporate Address</span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-snug">
                          F7, Second Floor, Ahinsa Tower, MG Road, Indore, Madhya Pradesh 452001, India.
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(
                            "F7, Second Floor, Ahinsa Tower, MG Road, Indore, Madhya Pradesh 452001, India",
                            "card-addr"
                          )
                        }
                        className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] text-slate-300 font-mono transition-colors"
                        title="Copy Address"
                      >
                        {copiedKey === "card-addr" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3.5 items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="mailto:contact@appsica.com?subject=Privacy%20Question%20-%20Appsica"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                      >
                        <Icon icon="solar:letter-bold" width="16" height="16" />
                        Send Email Enquiry
                      </a>
                      <a
                        href="https://wa.me/919691847671"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                      >
                        <Icon icon="solar:chat-round-bold" width="16" height="16" />
                        WhatsApp Support
                      </a>
                    </div>

                    <a
                      href="tel:+919691847671"
                      className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white transition-colors"
                    >
                      <Icon icon="solar:outgoing-call-rounded-bold" width="16" height="16" className="text-sky-400" />
                      Direct Line: +91 9691847671
                    </a>
                  </div>
                </div>
              </article>

              {/* 8. Updates */}
              <article
                id="updates"
                className="scroll-mt-28 p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-base shrink-0 border border-blue-200/60 shadow-xs">
                    08
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600">
                      Revision Log
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      8. Updates
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                  <p>
                    We may update this Privacy Policy from time to time. Any changes will be published on this page
                    with an updated date.
                  </p>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <Icon icon="solar:bell-bing-bold" width="20" height="20" className="text-blue-600 shrink-0" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Material modifications will be notified via prominent notice on our homepage or direct email if you
                      maintain an active client agreement with us.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
