import Link from "next/link";
import { Icon } from "@iconify/react";

type ServiceType = {
  icon: string;
  title: string;
  slug: string;
  description: string;
};

const SingleService = ({ service }: { service: ServiceType }) => {
  const { icon, title, description, slug } = service;

  return (
    <div className="group h-full py-2">
      <div className="relative h-full min-h-[360px] p-8 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 hover:border-sky-500/40 hover:shadow-[0_15px_40px_-10px_rgba(0,82,204,0.3)] transition-all duration-500 flex flex-col justify-between overflow-hidden">
        {/* Ambient Corner Glow on Hover */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-sky-400/25 transition-all duration-500 pointer-events-none" />

        {/* Top Content */}
        <div className="flex flex-col gap-5 relative z-10">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-400/20 flex justify-center items-center group-hover:bg-primary group-hover:border-blue-400 group-hover:shadow-[0_0_25px_rgba(0,82,204,0.4)] transition-all duration-300">
              <Icon
                icon={icon || "solar:code-square-bold"}
                width="28"
                height="28"
                className="text-sky-400 group-hover:text-white transition-colors duration-300"
              />
            </div>
            {/* Tech Pill */}
            <span className="px-2.5 py-1 text-[11px] font-bold text-sky-300 bg-sky-500/10 rounded-full border border-sky-500/20 uppercase tracking-wider">
              Architecture
            </span>
          </div>

          <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors duration-300">
            {title}
          </h3>

          <p
            className="text-sm sm:text-base font-normal text-slate-300 leading-relaxed overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description}
          </p>
        </div>

        {/* Bottom Link with hover effect */}
        <div className="pt-6 mt-4 border-t border-white/5 relative z-10">
          <Link
            href={`/services/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-sky-400 group-hover:text-white transition-colors duration-300 group/link"
          >
            <span>Explore Architecture</span>
            <Icon
              icon="solar:arrow-right-linear"
              width="18"
              height="18"
              className="transform group-hover/link:translate-x-1.5 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleService;