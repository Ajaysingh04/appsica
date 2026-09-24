import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

const BlogList = ({ blog }: { blog: any }) => {
  const { title, coverImage, date, slug, excerpt, category } = blog;

  return (
    <div className="group relative h-full flex flex-col justify-between rounded-3xl bg-slate-900/70 border border-white/10 hover:border-sky-500/40 p-6 backdrop-blur-xl shadow-xl hover:shadow-[0_15px_40px_-10px_rgba(0,82,204,0.3)] hover:-translate-y-1 transition-all duration-400 overflow-hidden">
      {/* Ambient hover glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-sky-400/20 transition-all duration-400 pointer-events-none" />

      <div>
        {/* Image Container */}
        <div className="overflow-hidden relative h-[220px] rounded-2xl bg-slate-950 mb-5 border border-white/5">
          {category && (
            <div className="absolute top-3.5 left-3.5 z-10 bg-slate-900/90 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-mono font-bold text-sky-300 rounded-full shadow-lg">
              {category}
            </div>
          )}
          <Link href={`/blogs/${slug}`} aria-label="blog cover" className="block w-full h-full relative overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
          </Link>
        </div>

        {/* Date & Metadata */}
        <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mb-3">
          <span className="flex items-center gap-1 text-sky-400">
            <Icon icon="solar:calendar-linear" width="14" height="14" />
            {date ? format(new Date(date), "dd MMM yyyy") : "Recent"}
          </span>
          <span>•</span>
          <span className="text-slate-400">5 min read</span>
        </div>

        {/* Title */}
        <h3 className="mb-3">
          <Link
            href={`/blogs/${slug}`}
            className="font-bold text-white group-hover:text-sky-300 transition-colors text-lg sm:text-xl line-clamp-2 leading-snug"
          >
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-slate-300 text-sm line-clamp-3 mb-6 font-normal leading-relaxed">
            {excerpt}
          </p>
        )}
      </div>

      {/* Card Action Link */}
      <div className="pt-4 border-t border-white/5 relative z-10">
        <Link 
          href={`/blogs/${slug}`}
          className="inline-flex items-center justify-between w-full text-sm font-bold text-sky-400 group-hover:text-white transition-colors duration-300"
        >
          <span>Read Blueprint</span>
          <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-blue-600 flex items-center justify-center transition-all duration-300">
            <Icon icon="solar:arrow-right-linear" width="14" height="14" className="transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BlogList;
