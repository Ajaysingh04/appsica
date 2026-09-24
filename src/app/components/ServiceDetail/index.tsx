"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
import ServiceDetailSkeleton from "../Skeleton/ServiceDetail/page";

const UsedTech = dynamic(() => import("@/app/components/Services/Technologies"), {
    ssr: false,
});

// Premium Unsplash images for Hero section
const premiumImages: Record<string, string> = {
    "web-development": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&h=750&q=80",
    "mobile-app-development": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&h=750&q=80",
    "cloud-devops": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&h=750&q=80",
    "custom-software": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=750&q=80",
    "ui-ux-design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&h=750&q=80",
    "digital-marketing": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&h=750&q=80",
    "e-commerce-development": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&h=750&q=80",
    "ppc-management": "https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&h=750&q=80",
    "search-engine-marketing": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=750&q=80",
    "seo": "https://images.unsplash.com/photo-1572177812156-58036aae439c?auto=format&fit=crop&w=1200&h=750&q=80",
    "social-media-marketing": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&h=750&q=80",
    "responsive-web-design": "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&h=750&q=80",
    "crm-erp-solutions": "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&h=750&q=80",
};

// Premium Unsplash images for 'What It Does' section
const contentImages: Record<string, string> = {
    "web-development": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=750&q=80",
    "mobile-app-development": "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&h=750&q=80",
    "cloud-devops": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&h=750&q=80",
    "custom-software": "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&h=750&q=80",
    "ui-ux-design": "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&h=750&q=80",
    "digital-marketing": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&h=750&q=80",
    "e-commerce-development": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&h=750&q=80",
    "ppc-management": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&h=750&q=80",
    "search-engine-marketing": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=750&q=80",
    "seo": "https://images.unsplash.com/photo-1512758117929-c8db463e2715?auto=format&fit=crop&w=1200&h=750&q=80",
    "social-media-marketing": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&h=750&q=80",
    "responsive-web-design": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&h=750&q=80",
    "crm-erp-solutions": "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&h=750&q=80",
};

const defaultImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80";

const ServiceDetail = () => {
    const [services, setServices] = useState<any[]>([]);
    const [expandedFeature, setExpandedFeature] = useState<number | null>(0);
    const { slug } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/service');
                if (!res.ok) throw new Error('Failed to fetch');

                const data = await res.json();
                setServices(data.ServicesData || []);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchData();
    }, []);
    
    const item = services.find((item) => item.slug === slug);
    const heroImage = (slug && typeof slug === 'string' && premiumImages[slug]) ? premiumImages[slug] : defaultImage;
    const contentImage = (slug && typeof slug === 'string' && contentImages[slug]) ? contentImages[slug] : defaultImage;

    const techServices = [
        "web-development",
        "mobile-app-development",
        "cloud-devops",
        "custom-software",
        "e-commerce-development",
        "responsive-web-design",
        "crm-erp-solutions",
    ];
    const isTechService = typeof slug === "string" && techServices.includes(slug);

    if (!item) {
        return <ServiceDetailSkeleton />;
    }

    return (
        <div className="bg-slate-950 text-white min-h-screen relative overflow-hidden">
            
            {/* 1. Breadcrumbs & Top Bar */}
            <div className="pt-28 sm:pt-32 pb-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
                <div className="container mx-auto px-4 lg:max-w-7xl flex flex-wrap items-center justify-between gap-4">
                    <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span className="text-slate-600">/</span>
                        <Link href="/services" className="hover:text-white transition-colors">Services</Link>
                        <span className="text-slate-600">/</span>
                        <span className="text-sky-400 font-semibold">{item.title}</span>
                    </nav>

                    <Link 
                        href="/services" 
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    >
                        <Icon icon="solar:alt-arrow-left-linear" width="16" height="16" />
                        <span>All Capabilities</span>
                    </Link>
                </div>
            </div>

            {/* 2. Custom Hero Section */}
            <section className="relative pt-12 sm:pt-16 pb-20 sm:pb-28 border-b border-white/10 overflow-hidden">
                {/* Ambient glow & cyber grid pattern */}
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute bottom-10 -right-32 w-96 h-96 bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

                <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        
                        {/* Left Column: Details & CTAs */}
                        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
                            <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-sky-300 mb-6 w-fit mx-auto lg:mx-0 shadow-[0_0_20px_rgba(0,82,204,0.3)]">
                                <Icon icon="solar:widget-bold" width="18" height="18" className="text-sky-400" />
                                <span className="text-xs font-bold tracking-widest uppercase">Service Architecture Blueprint</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.15]">
                                {item.title}
                            </h1>

                            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
                                {item.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12">
                                <Link 
                                    href="/contact" 
                                    className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5"
                                >
                                    <span>Initiate Architecture Discussion</span>
                                    <Icon icon="solar:arrow-right-linear" width="18" height="18" />
                                </Link>

                                <a 
                                    href="#features-section" 
                                    className="px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-base border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2"
                                >
                                    <span>Explore System Specs</span>
                                    <Icon icon="solar:alt-arrow-down-linear" width="18" height="18" />
                                </a>
                            </div>

                            {/* Key Capability Metrics Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                                <div className="text-center lg:text-left">
                                    <span className="text-2xl font-black text-white block">Enterprise</span>
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tier SLA</span>
                                </div>
                                <div className="text-center lg:text-left">
                                    <span className="text-2xl font-black text-sky-400 block">&lt; 50ms</span>
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Edge Latency</span>
                                </div>
                                <div className="text-center lg:text-left">
                                    <span className="text-2xl font-black text-indigo-400 block">Zero-Trust</span>
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Compliance</span>
                                </div>
                                <div className="text-center lg:text-left">
                                    <span className="text-2xl font-black text-emerald-400 block">Agile</span>
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Sprint Velocity</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Hero Visual Container */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative rounded-3xl p-1 bg-gradient-to-br from-blue-500/30 via-white/10 to-sky-500/20 shadow-[0_20px_60px_-15px_rgba(0,82,204,0.4)]">
                                <div className="relative h-[320px] sm:h-[420px] w-full rounded-[22px] overflow-hidden bg-slate-900 border border-white/10 group">
                                    <Image
                                        src={heroImage}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

                                    {/* Floating Cyber Badges */}
                                    <div className="absolute top-5 right-5 z-20 bg-slate-900/90 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                                            Production Ready
                                        </span>
                                    </div>

                                    <div className="absolute bottom-5 left-5 z-20 bg-slate-900/90 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl shadow-xl">
                                        <div className="flex items-center gap-2">
                                            <Icon icon="solar:shield-check-bold" width="18" height="18" className="text-sky-400" />
                                            <span className="text-xs font-semibold text-slate-200">
                                                Audited Architecture
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. System Architecture & Scope (What We Deliver) */}
            <section className="py-20 lg:py-28 relative border-b border-white/10">
                <div className="container mx-auto px-4 lg:max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        
                        {/* Visual Frame */}
                        <div className="lg:col-span-5 order-2 lg:order-1">
                            <div className="relative rounded-3xl p-1 bg-gradient-to-tr from-sky-500/20 via-white/5 to-blue-600/30 shadow-2xl">
                                <div className="relative h-[300px] sm:h-[400px] w-full rounded-[22px] overflow-hidden bg-slate-900 border border-white/10">
                                    <Image
                                        src={contentImage}
                                        alt="Service Overview"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                                    
                                    {/* Tech Tags Overlay */}
                                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 z-10">
                                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-sky-300">
                                            #microservices
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-sky-300">
                                            #cloud-native
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-sky-300">
                                            #rest-graphql
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content & Pillars */}
                        <div className="lg:col-span-7 order-1 lg:order-2 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-sky-300 mb-4 text-xs font-bold uppercase tracking-widest">
                                <Icon icon="solar:server-square-bold" width="16" height="16" className="text-sky-400" />
                                Architectural Scope
                            </div>

                            <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-tight">
                                Engineering Depth &{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                                    Delivery Standards
                                </span>
                            </h2>

                            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-8">
                                {item.detail}
                            </p>

                            {/* 3 Architecture Pillars */}
                            <div className="space-y-4 text-left">
                                <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 flex items-start gap-4 backdrop-blur-xl">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0 text-sky-400">
                                        <Icon icon="solar:shield-check-bold" width="22" height="22" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-white mb-1">Zero-Vulnerability Security</h4>
                                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                            Strict TLS encryption, automated static code analysis, and secure tokenized authentication models.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 flex items-start gap-4 backdrop-blur-xl">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0 text-sky-400">
                                        <Icon icon="solar:bolt-circle-bold" width="22" height="22" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-white mb-1">Horizontal Scalability</h4>
                                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                            Stateless application servers and multi-region read replicas engineered to absorb sudden traffic surges.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Core Features Section */}
            <section id="features-section" className="py-20 lg:py-28 relative border-b border-white/10">
                <div className="container mx-auto px-4 lg:max-w-7xl">
                    <div className="text-center mb-14 lg:mb-18 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-sky-300 mb-4 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,82,204,0.3)]">
                            <Icon icon="solar:star-fall-bold-duotone" width="16" height="16" className="text-sky-400" />
                            Core Capabilities Breakdown
                        </div>
                        <h3 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white mb-4 tracking-tight">
                            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Peak Performance</span>
                        </h3>
                        <p className="text-base sm:text-lg text-slate-400">
                            Explore each structural layer and capability included in our {item.title.toLowerCase()} ecosystem.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {item.features.map((feature: any, index: number) => {
                            const isExpanded = expandedFeature === index;
                            return (
                                <div
                                    key={index}
                                    onClick={() => setExpandedFeature(isExpanded ? null : index)}
                                    className="relative bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-sky-500/40 shadow-xl hover:shadow-[0_15px_40px_-10px_rgba(0,82,204,0.3)] hover:-translate-y-1 transition-all duration-400 group overflow-hidden cursor-pointer"
                                >
                                    {/* Glowing corner background */}
                                    <div className={`absolute -top-12 -right-12 w-36 h-36 bg-blue-600/10 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${isExpanded ? 'bg-sky-400/25' : 'group-hover:bg-sky-400/20'}`}></div>
                                    
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className={`shrink-0 h-13 w-13 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-sky-400 flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(0,82,204,0.4)]' : 'group-hover:bg-blue-600 group-hover:text-white'}`}>
                                                <Icon
                                                    icon="solar:check-circle-bold"
                                                    width="26"
                                                    height="26"
                                                />
                                            </div>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-slate-300 transition-transform duration-400 ${isExpanded ? 'rotate-180 bg-blue-600 text-white' : ''}`}>
                                                <Icon icon="solar:alt-arrow-down-linear" width="18" height="18" />
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className={`text-xl font-bold text-white mb-3 transition-colors duration-300 ${isExpanded ? 'text-sky-300' : 'group-hover:text-sky-300'}`}>
                                                {feature.title}
                                            </h4>
                                            
                                            <div className={`grid transition-all duration-400 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                                                <p className="text-sm text-slate-300 leading-relaxed font-normal overflow-hidden">
                                                    {feature.description}
                                                </p>
                                            </div>

                                            {!isExpanded && (
                                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 group-hover:text-sky-400 transition-colors">
                                                    <span>Click to expand specifications</span>
                                                    <Icon icon="solar:alt-arrow-down-linear" width="12" height="12" />
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. Live Case Studies Section (if present) */}
            {item.demoLinks && item.demoLinks.length > 0 && (
                <section className="py-20 lg:py-28 relative border-b border-white/10">
                    <div className="container mx-auto px-4 lg:max-w-7xl">
                        <div className="text-center mb-14 max-w-2xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-sky-300 mb-4 text-xs font-bold uppercase tracking-widest">
                                <Icon icon="solar:shield-check-bold" width="16" height="16" className="text-sky-400" />
                                Live Deployments
                            </div>
                            <h3 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
                                Production <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Case Studies</span>
                            </h3>
                            <p className="text-base text-slate-400">
                                Explore live platforms and client systems deployed with this architecture.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {item.demoLinks.map((link: any, idx: number) => (
                                <a 
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between bg-slate-900/70 border border-white/10 rounded-2xl p-6 hover:border-sky-500/40 hover:shadow-[0_10px_30px_rgba(0,82,204,0.3)] hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="font-bold text-base text-white group-hover:text-sky-300 transition-colors">{link.name}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Icon icon="solar:arrow-right-up-linear" width="18" height="18" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 6. Used Technologies */}
            {isTechService && <UsedTech />}

            {/* 7. Bottom Enterprise CTA Banner */}
            <section className="py-20 lg:py-28 relative overflow-hidden">
                <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
                    <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-indigo-900/40 border border-white/10 backdrop-blur-2xl text-center flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                        {/* Ambient glow */}
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 max-w-2xl">
                            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-3 block">
                                Direct Principal Engagement
                            </span>
                            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                                Ready to Architect Your {item.title} Solution?
                            </h3>
                            <p className="text-base text-slate-300 mb-8 leading-relaxed">
                                Partner with Appsica to design, build, and deploy high-availability software engineered to your exact operational benchmarks.
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Link
                                    href="/contact"
                                    className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
                                >
                                    <span>Schedule Technical Consultation</span>
                                    <Icon icon="solar:calendar-linear" width="18" height="18" />
                                </Link>

                                <Link
                                    href="/portfolio"
                                    className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-base border border-white/10 transition-all flex items-center gap-2"
                                >
                                    <span>View Portfolio Case Studies</span>
                                    <Icon icon="solar:arrow-right-linear" width="18" height="18" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default ServiceDetail;