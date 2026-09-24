"use client";
import Link from "next/link";
import { Icon } from "@iconify/react";
import BlogCard from "./blogCard";
import { useEffect, useState } from "react";
import type { Blog as BlogType } from "@/app/types/blog";

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogType[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs?limit=3");
        if (!res.ok) return;
        const data = await res.json();
        const list = (data.blogs || []).map(
          (b: { _id: string; title: string; slug: string; excerpt?: string; coverImage: string; createdAt: string }) => ({
            _id: b._id,
            title: b.title,
            slug: b.slug,
            excerpt: b.excerpt || "",
            coverImage: b.coverImage,
            date: b.createdAt,
          })
        );
        setPosts(list);
      } catch {
        setPosts([]);
      }
    };
    void fetchBlogs();
  }, []);

  return (
    <section
      className="flex flex-wrap justify-center"
      id="blog"
    >
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
        <div className="flex items-baseline justify-between flex-wrap">
          <h2
            className="sm:mb-11 mb-3 text-4xl font-bold text-midnight_text"
          >
            Latest blog & news
          </h2>
          <Link
            href="/blogs"
            className="flex items-center gap-3 text-base text-midnight_text font-medium hover:text-primary sm:pb-0 pb-3"
          >
            View More
            <span>
              <Icon icon="solar:arrow-right-outline" width="30" height="30" />
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-12 gap-7">
          {posts.map((blog, i) => (
            <div
              key={i}
              className="w-full md:col-span-4 sm:col-span-6 col-span-12"
            >
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
