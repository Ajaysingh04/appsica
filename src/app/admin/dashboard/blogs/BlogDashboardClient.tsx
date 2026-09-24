"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Icon } from "@iconify/react";
import BlogForm, { type BlogFormInitial } from "./BlogForm";

export type DashboardBlogCard = {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  published: boolean;
};

export default function BlogDashboardClient({
  initialBlogs,
}: {
  initialBlogs: DashboardBlogCard[];
}) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"new" | "edit">("new");
  const [editingId, setEditingId] = useState<string | undefined>();
  const [editingInitial, setEditingInitial] = useState<BlogFormInitial | undefined>();

  const refreshBlogs = useCallback(async () => {
    const res = await fetch("/api/admin/blogs");
    if (!res.ok) return;
    const data = await res.json();
    const list = (data.blogs || []).map(
      (b: { _id: string; title: string; slug: string; coverImage: string; published: boolean }) => ({
        _id: String(b._id),
        title: b.title,
        slug: b.slug,
        coverImage: b.coverImage,
        published: b.published,
      })
    );
    setBlogs(list);
  }, []);

  const openNew = useCallback(() => {
    setModalMode("new");
    setEditingId(undefined);
    setEditingInitial(undefined);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/blogs/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    const b = data.blog;
    if (!b) return;
    setModalMode("edit");
    setEditingId(id);
    setEditingInitial({
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      content: b.content,
      coverImage: b.coverImage,
      published: b.published,
      order: b.order,
    });
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(undefined);
    setEditingInitial(undefined);
  }, []);

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Blogs</h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage blog posts shown on home and blog listing pages.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {blogs.length === 0 && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm("Load sample blogs into the database?")) return;
                    try {
                      const res = await fetch("/api/admin/blogs/seed", { method: "POST" });
                      if (res.ok) await refreshBlogs();
                      else alert("Failed to seed blogs. Check MongoDB connection.");
                    } catch (e) {
                      alert("Error seeding blogs.");
                    }
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Load Demo Articles
                </button>
              )}
              <button
                type="button"
                onClick={openNew}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                New blog
              </button>
            </div>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {blogs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-slate-600">No blogs yet.</p>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={openNew}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Create your first blog
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((b) => (
                <button
                  key={b._id}
                  type="button"
                  onClick={() => void openEdit(b._id)}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:border-primary/40 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <Image
                      src={b.coverImage}
                      alt={b.title}
                      fill
                      className="object-cover transition group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {!b.published && (
                      <span className="absolute right-2 top-2 rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="font-semibold text-slate-900">{b.title}</h2>
                    <p className="mt-1 truncate text-xs text-slate-500">/{b.slug}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-modal-title"
          onClick={closeModal}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 id="blog-modal-title" className="text-lg font-bold text-slate-900">
                {modalMode === "new" ? "New blog" : "Edit blog"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close"
              >
                <Icon icon="ph:x-bold" width={22} height={22} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
              <BlogForm
                key={editingId || "new"}
                blogId={editingId}
                initial={editingInitial}
                onClose={closeModal}
                onSaved={async () => {
                  await refreshBlogs();
                  closeModal();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
