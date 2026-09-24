"use client";
import React, { FC, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { fetchServices, fetchSiteSettings } from "@/lib/api";
import { IService, ISiteSettings } from "@/types";
import { defaultSiteSettings, defaultServices } from "@/lib/defaultData";

const Footer: FC = () => {
  const pathname = usePathname();
  const [services, setServices] = useState<IService[]>(defaultServices as unknown as IService[]);
  const [settings, setSettings] = useState<ISiteSettings>(defaultSiteSettings as ISiteSettings);

  useEffect(() => {
    const loadData = async () => {
      const [servicesData, settingsData] = await Promise.all([
        fetchServices(),
        fetchSiteSettings(),
      ]);
      setServices(servicesData);
      setSettings(settingsData);
    };

    loadData();
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const phone = settings?.phone || "+91 9691847671";
  const emails = settings?.emails || ["contact@appsica.com", "hr@appsica.com"];
  const address =
    settings?.address ||
    "F7, Second Floor, Ahinsa Tower, MG Road Indore, Madhya Pradesh 452001";
  const mapUrl =
    settings?.mapUrl ||
    "https://www.google.com/maps/search/?api=1&query=F7,+Second+Floor,+Ahinsa+Tower,+MG+Road+Indore,+Madhya+Pradesh+452001";
  const socialLinks = settings?.socialLinks || {
    instagram: "https://www.instagram.com/appsica_technology/?hl=en",
    linkedin: "https://www.linkedin.com/company/appsica/?viewAsMember=true",
    facebook: "https://www.facebook.com/profile.php?id=61591531577413",
  };

  return (
    <footer className="bg-slate-950 pt-20 pb-10 border-t border-white/10 relative overflow-hidden text-white">
      {/* Dynamic ambient lights & grid pattern */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-15 pointer-events-none" />

      <div className="container mx-auto lg:max-w-7xl px-4 relative z-10">
        <div className="grid grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* 1. Brand & Contact Information (col-span-12 lg:col-span-4) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            
            {/* Logo & Brand Identity */}
            <div>
              <Link href="/" className="inline-flex items-center gap-3.5 group">
                <div className="w-13 h-13 rounded-2xl bg-white p-2.5 shadow-[0_4px_20px_rgba(0,82,204,0.35)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.6)] flex items-center justify-center transition-all duration-300">
                  <Image
                    src="/images/logo/logo-icon.png"
                    alt="Appsica Logo"
                    width={44}
                    height={44}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-2xl font-black text-white tracking-tight block group-hover:text-sky-300 transition-colors">
                    Appsica
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 block -mt-0.5">
                    Technologies
                  </span>
                </div>
              </Link>

              <p className="mt-4 font-normal text-sm sm:text-base text-slate-300 leading-relaxed max-w-sm">
                {settings?.footer?.aboutText ||
                  "Engineering high-availability custom software, cloud microservices, and mobile ecosystems for modern enterprises worldwide."}
              </p>
            </div>

            {/* Structured Contact Details */}
            <div className="space-y-3.5 pt-2">
              
              {/* Phone */}
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0 text-sky-400">
                  <Icon icon="solar:phone-bold" width="16" height="16" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs font-medium">Phone:</span>
                  <Link
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="text-slate-200 hover:text-sky-400 font-semibold transition-colors"
                  >
                    {phone}
                  </Link>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0 text-sky-400">
                  <Icon icon="solar:letter-bold" width="16" height="16" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400 text-xs font-medium">Email:</span>
                  <Link
                    href={`mailto:${emails[0]}`}
                    className="text-slate-200 hover:text-sky-400 font-semibold transition-colors"
                  >
                    {emails[0]}
                  </Link>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                  <Icon icon="ic:baseline-whatsapp" width="18" height="18" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs font-medium">WhatsApp:</span>
                  <Link
                    href={`https://wa.me/${(settings?.whatsapp || phone).replace(/[^\d]/g, "")}?text=${encodeURIComponent("Hi Appsica Team, I would like to inquire about your software development services.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>{settings?.whatsapp || phone}</span>
                    <Icon icon="solar:arrow-right-up-linear" width="12" height="12" />
                  </Link>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0 text-sky-400 mt-0.5">
                  <Icon icon="solar:map-point-bold" width="16" height="16" />
                </div>
                <div>
                  <Link
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-sky-400 font-normal transition-colors leading-relaxed block max-w-xs"
                  >
                    {address}
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* 2. Services Column (NO SCROLLBAR, Clean 2-Column Responsive Grid) */}
          <div className="col-span-12 sm:col-span-7 lg:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
              <h4 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wider">
                Engineering Services
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
              {services.map((item, index) => (
                <div key={item.slug || index}>
                  <Link
                    href={`/services/${item.slug}`}
                    className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-all duration-300"
                  >
                    <Icon
                      icon="solar:alt-arrow-right-line-duotone"
                      width="14"
                      height="14"
                      className="text-sky-400 transform group-hover:translate-x-1 transition-transform duration-300 shrink-0"
                    />
                    <span className="truncate group-hover:text-sky-300 transition-colors">{item.title}</span>
                  </Link>
                </div>
              ))}
            </div>

            <div className="pt-6 mt-4 border-t border-white/5">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-white transition-colors"
              >
                <span>View Full Capabilities Catalog</span>
                <Icon icon="solar:arrow-right-linear" width="14" height="14" />
              </Link>
            </div>
          </div>

          {/* 3. Company & Resources + Live SLA Status Pill */}
          <div className="col-span-12 sm:col-span-5 lg:col-span-3 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                <h4 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wider">
                  Company
                </h4>
              </div>

              <ul className="space-y-3">
                {[
                  { name: "About Appsica", href: "/about" },
                  { name: "Careers / We're Hiring", href: "/careers" },
                  { name: "Our Portfolio", href: "/portfolio" },
                  { name: "All Capabilities", href: "/services" },
                  { name: "Blogs & Insights", href: "/blogs" },
                  { name: "Contact Us", href: "/contact" },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      <Icon
                        icon="solar:alt-arrow-right-line-duotone"
                        width="14"
                        height="14"
                        className="text-blue-400 transform group-hover:translate-x-1 transition-transform duration-300 shrink-0"
                      />
                      <span className="group-hover:text-sky-300 transition-colors">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Live Systems SLA Beacon Widget */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-lg">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Operational
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Production architecture SLA: <strong className="text-white">99.99%</strong> uptime verified.
              </p>
            </div>

            {/* Follow Us / Social Icons with Hover Lift */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-3">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                {socialLinks.instagram && (
                  <Link
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center border border-white/10 bg-slate-900/90 rounded-xl text-slate-300 hover:text-white hover:border-sky-400 hover:bg-blue-600 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(0,82,204,0.4)] transition-all duration-300"
                    aria-label="Instagram"
                  >
                    <Icon icon="jam:instagram" width="20" height="20" />
                  </Link>
                )}
                {socialLinks.linkedin && (
                  <Link
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center border border-white/10 bg-slate-900/90 rounded-xl text-slate-300 hover:text-white hover:border-sky-400 hover:bg-blue-600 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(0,82,204,0.4)] transition-all duration-300"
                    aria-label="LinkedIn"
                  >
                    <Icon icon="typcn:social-linkedin" width="22" height="22" />
                  </Link>
                )}
                {socialLinks.facebook && (
                  <Link
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center border border-white/10 bg-slate-900/90 rounded-xl text-slate-300 hover:text-white hover:border-sky-400 hover:bg-blue-600 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(0,82,204,0.4)] transition-all duration-300"
                    aria-label="Facebook"
                  >
                    <Icon icon="grommet-icons:facebook-option" width="18" height="18" />
                  </Link>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* 4. Bottom Sub-Footer / Copyright & Compliance */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p className="text-xs text-slate-400">
              {settings?.footer?.copyrightText ||
                "© 2026 Appsica Technologies. All Rights Reserved."}
            </p>
            <span className="hidden sm:inline-block text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-mono">
              Enterprise Software & Cloud Engineering
            </span>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4 sm:gap-6 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <Icon icon="solar:shield-check-bold" width="14" height="14" className="text-sky-400" />
              SOC-2 Ready
            </span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Technical Support
            </Link>
            <Link href="/services" className="hover:text-white transition-colors">
              Solutions
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
