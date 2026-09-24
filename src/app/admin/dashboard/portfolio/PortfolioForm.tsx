"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { MAX_ADMIN_IMAGE_BYTES, formatMaxImageSizeLabel } from "@/lib/adminUploadLimits";

export type PortfolioFormInitial = {
  title?: string;
  slug?: string;
  summary?: string;
  coverImage?: string;
  liveLink?: string;
  published?: boolean;
  isDemo?: boolean;
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

export default function PortfolioForm({
  projectId,
  initial,
  onClose,
  onSaved,
}: {
  projectId?: string;
  initial?: PortfolioFormInitial;
  onClose?: () => void;
  onSaved?: () => void | Promise<void>;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [liveLink, setLiveLink] = useState(initial?.liveLink ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [isDemo, setIsDemo] = useState(initial?.isDemo ?? false);
  const [order, setOrder] = useState(initial?.order !== undefined && initial?.order !== null && initial?.order > 0 ? Number(initial.order) : 1);
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
        summary: summary.trim(),
        liveLink: liveLink.trim(),
        coverImage: coverImage.trim(),
        published,
        isDemo,
        order,
      };
      const url = projectId ? `/api/admin/portfolio/${projectId}` : "/api/admin/portfolio";
      const res = await fetch(url, {
        method: projectId ? "PUT" : "POST",
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
          <label className="text-xs font-medium text-slate-700">Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-700">Live Link (Optional URL)</label>
          <input
            value={liveLink}
            onChange={(e) => setLiveLink(e.target.value)}
            placeholder="https://..."
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

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            Published on website (Visible to visitors)
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-amber-900 cursor-pointer">
            <input
              type="checkbox"
              checked={isDemo}
              onChange={(e) => setIsDemo(e.target.checked)}
              className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
            />
            Demo Template (Hidden from public website)
          </label>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Display Position (Order)</span>
                <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                  {order <= 1 ? "#1 (Top)" : `#${order}`}
                </span>
              </label>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Position 1 displays first on the website, followed by Position 2, Position 3, etc.
              </p>
            </div>

            <select
              value={order || 1}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer sm:w-52"
            >
              <option value={1}>1st - Position 1 (Top)</option>
              <option value={2}>2nd - Position 2</option>
              <option value={3}>3rd - Position 3</option>
              <option value={4}>4th - Position 4</option>
              <option value={5}>5th - Position 5</option>
              <option value={6}>6th - Position 6</option>
              <option value={7}>7th - Position 7</option>
              <option value={8}>8th - Position 8</option>
              <option value={9}>9th - Position 9</option>
              <option value={10}>10th - Position 10</option>
              <option value={11}>11th - Position 11</option>
              <option value={12}>12th - Position 12</option>
              <option value={15}>15th - Position 15</option>
              <option value={20}>20th - Position 20</option>
              {order > 20 && <option value={order}>{order}th Position</option>}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {saving ? "Saving…" : projectId ? "Update project" : "Create project"}
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
        {projectId && (
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Delete this project permanently?")) return;
              const res = await fetch(`/api/admin/portfolio/${projectId}`, { method: "DELETE" });
              if (res.ok) {
                await onSaved?.();
                if (!onSaved) router.push("/admin/dashboard/portfolio");
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
