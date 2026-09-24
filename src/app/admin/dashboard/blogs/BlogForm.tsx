"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { MAX_ADMIN_IMAGE_BYTES, formatMaxImageSizeLabel } from "@/lib/adminUploadLimits";

export type BlogFormInitial = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  published?: boolean;
  order?: number;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogForm({
  blogId,
  initial,
  onClose,
  onSaved,
}: {
  blogId?: string;
  initial?: BlogFormInitial;
  onClose?: () => void;
  onSaved?: () => void | Promise<void>;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  }, []);

  async function onPickFile(file: File | null) {
    if (!file) return;
    setMessage(null);
    if (file.size > MAX_ADMIN_IMAGE_BYTES) {
      setMessage({
        type: "err",
        text: `Image must be ${formatMaxImageSizeLabel()} or smaller.`,
      });
      return;
    }
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setCoverImage(url);
    } catch (e) {
      setMessage({ type: "err", text: (e as Error).message });
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const finalSlug = slug.trim() || slugify(title);

    if (!title.trim()) {
      setMessage({ type: "err", text: "Title is required." });
      return;
    }
    if (!coverImage.trim()) {
      setMessage({ type: "err", text: "Cover image is required." });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        coverImage: coverImage.trim(),
        published,
        order,
      };
      const url = blogId ? `/api/admin/blogs/${blogId}` : "/api/admin/blogs";
      const res = await fetch(url, {
        method: blogId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Save failed." });
        setSaving(false);
        return;
      }
      setMessage({ type: "ok", text: "Saved successfully." });
      await onSaved?.();
      if (!onSaved) router.refresh();
    } catch {
      setMessage({ type: "err", text: "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 pb-8">
      {message && (
        <div
          className={
            message.type === "ok"
              ? "rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
              : "rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          }
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-700">Title</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-700">URL slug</label>
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
            }}
            placeholder="auto from title"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-700">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-700">Blog content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700">Cover image</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          disabled={uploading}
          className="sr-only"
          onChange={(e) => {
            void onPickFile(e.target.files?.[0] || null);
            e.target.value = "";
          }}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {coverImage ? "Replace cover image" : "Upload cover image"}
          </button>
          {uploading && <span className="text-xs text-slate-500">Uploading…</span>}
        </div>
        {coverImage && (
          <div className="relative mt-4 h-28 w-44 overflow-hidden rounded-lg border border-slate-200">
            <Image src={coverImage} alt="" fill className="object-cover" sizes="176px" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded border-slate-300"
          />
          Published on site
        </label>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600">Sort order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value) || 0)}
            className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {saving ? "Saving…" : blogId ? "Update blog" : "Create blog"}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
        {blogId && (
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Delete this blog permanently?")) return;
              const res = await fetch(`/api/admin/blogs/${blogId}`, { method: "DELETE" });
              if (res.ok) {
                await onSaved?.();
                if (!onSaved) router.push("/admin/dashboard/blogs");
              }
            }}
            className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
