import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { Metadata } from "next";
import { Icon } from "@iconify/react";
import { defaultPortfolio } from "@/lib/defaultData";
import PortfolioGridClient, { ProjectCardData } from "@/app/components/Portfolio/PortfolioGridClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio & Case Studies | Appsica",
  description: "Explore our portfolio of selected client work across web, mobile, and cloud. Discover how Appsica builds scalable and maintainable digital solutions.",
  keywords: ["Appsica Portfolio", "Case Studies", "Software Projects", "Web Development Work"],
};

function formatLiveUrl(url?: string) {
  if (!url || !url.trim()) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

const PortfolioHero = () => {
  return (
    <section className="bg-slate-950 relative overflow-hidden border-b border-white/5 pt-36 pb-20 flex items-center">
      {/* Background Ambient Glows & Cyber Grid */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

      <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Title & Description */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 text-sky-300 mb-6 border border-blue-500/30 shadow-[0_0_15px_rgba(0,82,204,0.25)] w-fit">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase">Production Case Studies</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.15]">
              Engineered Architectures &{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                Digital Products
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed mb-8">
              Explore our portfolio of selected client work across high-scale web platforms, mobile ecosystems, and cloud systems — engineered for clarity, speed, and long-term maintainability.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="#projects-grid" 
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
              >
                <span>Browse All Projects</span>
                <Icon icon="solar:arrow-down-linear" width="18" height="18" />
              </a>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 pl-2">
                <Icon icon="solar:shield-check-bold" className="text-emerald-400" width="18" height="18" />
                <span>Verified Client Deliveries</span>
              </div>
            </div>
          </div>

          {/* Right Side: Professional Workspace Image with Glass Tech Frame */}
          <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[380px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-slate-900">
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
            
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=750&q=80"
              alt="Digital Agency Dashboard"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Floating Badge */}
            <div className="absolute bottom-5 left-5 right-5 z-20 bg-slate-900/90 backdrop-blur-xl border border-white/15 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 font-bold">
                  <Icon icon="solar:check-circle-bold" width="20" height="20" />
                </div>
                <div>
                  <p className="text-white font-extrabold text-base">100+ Enterprise Apps</p>
                  <p className="text-slate-400 text-xs">Delivered On-Time & Scaled</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Active
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const page = async () => {
  let projects: ProjectCardData[] = [];

  try {
    await connectDB();
    const docs = await Project.find({ published: { $ne: false }, isDemo: { $ne: true } })
      .sort({ order: 1, createdAt: -1 })
      .select("title slug summary coverImage liveLink techStack")
      .lean();

    if (docs && docs.length > 0) {
      projects = docs.map((item: any) => ({
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        coverImage: item.coverImage,
        liveLink: formatLiveUrl(item.liveLink),
        tag: item.liveLink ? "Live App" : "Case Study",
        techStack: item.techStack || ["React", "Cloud", "Node.js"],
      }));
    } else {
      projects = (defaultPortfolio || []).map((item) => ({
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        coverImage: item.coverImage || item.image || "",
        liveLink: formatLiveUrl(item.liveLink),
        tag: item.liveLink ? "Live App" : "Case Study",
        techStack: ["Next.js", "Tailwind", "Cloud"],
      }));
    }
  } catch {
    projects = (defaultPortfolio || []).map((item) => ({
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      coverImage: item.coverImage || item.image || "",
      liveLink: formatLiveUrl(item.liveLink),
      tag: item.liveLink ? "Live App" : "Case Study",
      techStack: ["Next.js", "Tailwind", "Cloud"],
    }));
  }

  return (
    <>
      <PortfolioHero />
      <section id="projects-grid" className="bg-slate-950 py-16 relative border-t border-white/5">
        {/* Background ambient glows */}
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 tech-grid-pattern opacity-20 pointer-events-none" />

        <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
          <PortfolioGridClient projects={projects} />
        </div>
      </section>
    </>
  );
};

export default page;
