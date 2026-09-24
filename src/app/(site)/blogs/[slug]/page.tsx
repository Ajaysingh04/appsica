import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { professionalDummyBlogs } from "@/lib/dummyBlogs";
import { Icon } from "@iconify/react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    
    let post = null;
    try {
      await connectDB();
      post = await Blog.findOne({
        slug: slug.toLowerCase(),
        published: true,
      }).select("title excerpt").lean();
    } catch (e) {
      // Fallback on db error
    }

    if (!post) {
      const dummyPost = professionalDummyBlogs.find(b => b.slug === slug.toLowerCase());
      if (dummyPost) {
        return {
          title: `${dummyPost.title} | Appsica Engineering`,
          description: dummyPost.excerpt,
        };
      }
      return {
        title: "Article Not Found | Appsica",
        description: "No technical article found.",
      };
    }

    return {
      title: `${post.title} | Appsica Engineering`,
      description: post.excerpt || `${post.title} by Appsica.`,
    };
  } catch {
    return {
      title: "Blog | Appsica",
    };
  }
}

type BlogPost = {
  title: string;
  excerpt?: string;
  content?: string;
  coverImage: string;
  createdAt: string;
  category?: string;
};

export default async function Post({ params }: Props) {
  const { slug } = await params;

  let post: BlogPost | null = null;
  
  try {
    await connectDB();
    const doc = await Blog.findOne({
      slug: slug.toLowerCase(),
      published: true,
    }).lean();
    post = doc ? (doc as unknown as BlogPost) : null;
  } catch {
    // DB error, will check dummy blogs
  }

  if (!post) {
    const dummyPost = professionalDummyBlogs.find(b => b.slug === slug.toLowerCase());
    if (dummyPost) {
      post = dummyPost as BlogPost;
    } else {
      notFound();
    }
  }

  const blog: BlogPost = post;

  return (
    <div className="bg-slate-950 text-white min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-20 pointer-events-none" />

      {/* 1. Sticky Navigation Subbar */}
      <div className="pt-28 sm:pt-32 pb-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 lg:max-w-4xl flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link>
            <span className="text-slate-600">/</span>
            <span className="text-sky-400 font-semibold truncate max-w-[200px] sm:max-w-[320px]">
              {blog.title}
            </span>
          </nav>

          <Link 
            href="/blogs" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <Icon icon="solar:alt-arrow-left-linear" width="16" height="16" />
            <span>All Articles</span>
          </Link>
        </div>
      </div>

      {/* 2. Article Header */}
      <section className="relative pt-12 sm:pt-16 pb-12 z-10">
        <div className="container lg:max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-sky-300 bg-sky-500/10 px-3.5 py-1.5 rounded-full border border-sky-500/20 shadow-sm">
              {blog.category || "Software Architecture"}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Icon icon="solar:calendar-linear" width="15" height="15" className="text-sky-400" />
              {format(new Date(blog.createdAt), "dd MMMM yyyy")}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">8 min read</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal mb-8 pb-8 border-b border-white/10">
              {blog.excerpt}
            </p>
          )}

          {/* Author Meta Strip */}
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-bold text-base shadow-md">
                KG
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white text-sm sm:text-base">Krishna Gopal Singh</p>
                  <Icon icon="solar:verified-check-bold" width="16" height="16" className="text-sky-400" />
                </div>
                <p className="text-xs text-slate-400">Principal Enterprise Architect, Appsica</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline-block">Technical Blueprint</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* 3. Cover Image & Body Content */}
      <section className="pb-24 relative z-10">
        <div className="container lg:max-w-4xl mx-auto px-4">
          
          {/* Framed Image */}
          <div className="relative rounded-3xl p-1 bg-gradient-to-br from-blue-500/30 via-white/10 to-sky-500/20 shadow-[0_20px_60px_-15px_rgba(0,82,204,0.4)] mb-12">
            <div className="relative h-[280px] sm:h-[420px] md:h-[480px] w-full rounded-[22px] overflow-hidden bg-slate-900 border border-white/10">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Article Text */}
          <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-8 sm:p-12 backdrop-blur-xl shadow-2xl mb-16">
            <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-extrabold prose-p:text-slate-300 prose-p:leading-loose prose-a:text-sky-400 prose-blockquote:border-l-sky-500 prose-blockquote:bg-slate-950/50 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-2xl prose-code:text-sky-300 prose-code:bg-slate-950 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-pre:bg-slate-950/90 prose-pre:border prose-pre:border-white/10">
              <div 
                className="whitespace-pre-wrap leading-loose"
                dangerouslySetInnerHTML={{ __html: blog.content ? blog.content.replace(/\n/g, '<br/>') : "" }}
              />
            </div>
          </div>

          {/* Bottom Consultation Banner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-indigo-900/40 border border-white/10 backdrop-blur-2xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="max-w-lg">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2 block">
                Production Implementation
              </span>
              <h3 className="text-2xl font-extrabold text-white mb-2">
                Need Help Implementing this Architecture?
              </h3>
              <p className="text-sm text-slate-300">
                Partner with Appsica's senior engineers to build, audit, or scale this stack in your organization.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all shrink-0 flex items-center gap-2"
            >
              <span>Discuss Requirements</span>
              <Icon icon="solar:calendar-linear" width="18" height="18" />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
