"use client";

import { useEffect, useState, useMemo } from "react";
import BlogList from ".";
import { professionalDummyBlogs } from "@/lib/dummyBlogs";
import { Icon } from "@iconify/react";

interface BlogsGridProps {
  selectedCategory?: string;
  searchQuery?: string;
}

export default function BlogsGrid({ selectedCategory = "All Articles", searchQuery = "" }: BlogsGridProps) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          if (data.blogs && data.blogs.length > 0) {
            const list = data.blogs.map(
              (b: { _id: string; title: string; slug: string; excerpt?: string; coverImage: string; createdAt: string; category?: string }) => ({
                _id: b._id,
                title: b.title,
                slug: b.slug,
                excerpt: b.excerpt || "",
                coverImage: b.coverImage,
                date: b.createdAt,
                category: b.category || "Web Development"
              })
            );
            setBlogs(list);
            setLoading(false);
            return;
          }
        }
      } catch {
        // fallback to dummy blogs
      }

      // Fallback to professional dummy blogs
      const fallbackList = professionalDummyBlogs.map((b, idx) => {
        const cats = ["Cloud & DevOps", "Web Development", "Mobile Apps", "Cloud & DevOps", "UI/UX Design"];
        return {
          _id: `dummy-${idx}`,
          title: b.title,
          slug: b.slug,
          excerpt: b.excerpt || "",
          coverImage: b.coverImage,
          date: b.createdAt,
          category: cats[idx % cats.length],
        };
      });
      setBlogs(fallbackList);
      setLoading(false);
    };

    void fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory =
        selectedCategory === "All Articles" ||
        blog.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === "Web Development" && blog.category?.includes("Web")) ||
        (selectedCategory === "Cloud & DevOps" && (blog.category?.includes("Cloud") || blog.category?.includes("DevOps"))) ||
        (selectedCategory === "Mobile Apps" && blog.category?.includes("Mobile")) ||
        (selectedCategory === "UI/UX Design" && blog.category?.includes("UI/UX"));

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        blog.title?.toLowerCase().includes(q) ||
        blog.excerpt?.toLowerCase().includes(q) ||
        blog.category?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-xl animate-pulse"
          >
            <div className="h-48 bg-slate-800 rounded-2xl mb-5"></div>
            <div className="h-4 bg-slate-800/80 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-slate-800 rounded w-4/5 mb-3"></div>
            <div className="h-4 bg-slate-800/60 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-800/60 rounded w-2/3 mb-6"></div>
            <div className="h-8 bg-slate-800/40 rounded-xl w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredBlogs.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Icon icon="solar:magnifer-broken" width="32" height="32" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Articles Found</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          No publications matched your filter or search query. Try another keyword or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredBlogs.map((blog) => (
        <div key={blog._id || blog.slug} className="w-full">
          <BlogList blog={blog} />
        </div>
      ))}
    </div>
  );
}
