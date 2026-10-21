"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { MAX_ADMIN_IMAGE_BYTES, formatMaxImageSizeLabel } from "@/lib/adminUploadLimits";

type Feature = { title: string; description: string };

export type ProjectFormInitial = {
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  coverImage?: string;
  images?: string[];
  features?: Feature[];
  techStack?: string[];
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

export default function ProjectForm({
  projectId,
  initial,
  onClose,
  onSaved,
}: {
  projectId?: string;
  initial?: ProjectFormInitial;
  onClose?: () => void;
  onSaved?: () => void | Promise<void>;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [images, setImages] = useState<string[]>(() => {
    if (initial?.images?.length) return [...initial.images];
    if (initial?.coverImage) return [initial.coverImage];
    return [];
  });
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [features, setFeatures] = useState<Feature[]>(
    initial?.features?.length ? initial!.features! : [{ title: "", description: "" }]
  );
  const [techStackRaw, setTechStackRaw] = useState(
    (initial?.techStack ?? []).join(", ")
  );
  const [liveLink, setLiveLink] = useState(initial?.liveLink ?? "");
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

  async function onPickFiles(files: FileList | null) {
    if (!files?.length) return;
    setMessage(null);

    const fileArr = Array.from(files);
    const tooLarge = fileArr.filter((f) => f.size > MAX_ADMIN_IMAGE_BYTES);
    if (tooLarge.length > 0) {
      setMessage({
        type: "err",
        text: `Each file must be ${formatMaxImageSizeLabel()} or smaller. Too large: ${tooLarge.map((f) => f.name).join(", ")}`,
      });
    }
    const toUpload = fileArr.filter((f) => f.size <= MAX_ADMIN_IMAGE_BYTES);
    if (!toUpload.length) return;

    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of toUpload) {
        const url = await uploadFile(file);
        urls.push(url);
      }
      setImages((prev) => {
        const merged = [...prev, ...urls];
        return [...new Set(merged)];
      });
      setCoverImage((c) => c || urls[0] || "");
    } catch (e) {
      setMessage({ type: "err", text: (e as Error).message });
    } finally {
      setUploading(false);
    }
  }

  function handleAddImageUrl() {
    if (!customImageUrl.trim()) return;
    const url = customImageUrl.trim();
    setImages((prev) => {
      const merged = [...prev, url];
      return [...new Set(merged)];
    });
    setCoverImage((c) => c || url);
    setCustomImageUrl("");
  }

  function removeImage(url: string) {
    setImages((prev) => {
      const next = prev.filter((u) => u !== url);
      setCoverImage((c) => (c === url ? next[0] || "" : c));
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const finalSlug = slug.trim() || slugify(title);
    const techStack = techStackRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const feats = features.filter((f) => f.title.trim());
    const imageList = images.length ? images : coverImage ? [coverImage] : [];
    const cover = coverImage || imageList[0] || "";

    if (!title.trim()) {
      setMessage({ type: "err", text: "Title is required." });
      return;
    }
    if (!cover) {
      setMessage({
        type: "err",
        text: "Please upload or provide at least one image/URL for this project.",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: finalSlug,
        summary: summary.trim(),
        description: description.trim(),
        coverImage: cover,
        images: imageList,
        features: feats,
        techStack,
        liveLink: liveLink.trim(),
        published,
        isDemo,
        order,
      };
      const url = projectId ? `/api/admin/projects/${projectId}` : "/api/admin/projects";
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
      if (!onSaved) {
        router.refresh();
      }
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
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Project Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="e.g. Modern E-Commerce Platform"
            className="admin-input mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">URL Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
            }}
            placeholder="auto-generated from title"
            className="admin-input mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Live Project Demo Link (Optional)
          </label>
          <input
            type="text"
            value={liveLink}
            onChange={(e) => setLiveLink(e.target.value)}
            placeholder="https://your-project.com"
            className="admin-input mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Short Summary (For cards)
          </label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="A scalable multi-vendor eCommerce app with Next.js and Stripe"
            className="admin-input mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Full Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Detailed overview of the project, problem solved, architecture, and impact..."
            className="admin-input mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
          Project Images *
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Upload images from your computer or paste an image URL below.
        </p>

        {/* Upload Buttons */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          className="sr-only"
          onChange={(e) => {
            void onPickFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          >
            {uploading ? "Uploading…" : images.length === 0 ? "📁 Upload Images" : "+ Add More Images"}
          </button>
        </div>

        {/* Or Paste URL */}
        <div className="mt-3 flex gap-2">
          <input
            type="url"
            value={customImageUrl}
            onChange={(e) => setCustomImageUrl(e.target.value)}
            placeholder="Or paste direct image URL (https://...)"
            className="admin-input flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15"
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Add URL
          </button>
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-700">
                Selected Images ({images.length}) — Click 'Cover' to set primary card image
              </p>
              <button
                type="button"
                onClick={() => {
                  setImages([]);
                  setCoverImage("");
                }}
                className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {images.map((url) => (
                <div
                  key={url}
                  className={`relative h-24 w-36 overflow-hidden rounded-lg border-2 ${
                    coverImage === url ? "border-primary shadow-md" : "border-slate-200"
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute bottom-1 left-1 right-1 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setCoverImage(url)}
                      className={`flex-1 rounded px-1 py-0.5 text-[10px] font-bold ${
                        coverImage === url ? "bg-primary text-white" : "bg-white/90 text-slate-800"
                      }`}
                    >
                      {coverImage === url ? "★ Cover" : "Make Cover"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Key Features</label>
          <button
            type="button"
            onClick={() => setFeatures((f) => [...f, { title: "", description: "" }])}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            + Add Feature
          </button>
        </div>
        <div className="space-y-3">
          {features.map((f, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
              <input
                type="text"
                placeholder="Feature title"
                value={f.title}
                onChange={(e) => {
                  const next = [...features];
                  next[i] = { ...next[i], title: e.target.value };
                  setFeatures(next);
                }}
                className="admin-input w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={f.description}
                onChange={(e) => {
                  const next = [...features];
                  next[i] = { ...next[i], description: e.target.value };
                  setFeatures(next);
                }}
                className="admin-input w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Tech stack (comma-separated)
        </label>
        <input
          type="text"
          value={techStackRaw}
          onChange={(e) => setTechStackRaw(e.target.value)}
          placeholder="Next.js, MongoDB, Tailwind CSS, Stripe"
          className="admin-input mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
        />
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400">Quick add:</span>
          {["Next.js", "React", "Node.js", "TypeScript", "Tailwind CSS", "MongoDB", "Stripe", "AWS", "Python", "Docker"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                const current = techStackRaw.split(",").map((s) => s.trim()).filter(Boolean);
                if (!current.includes(t)) {
                  setTechStackRaw(current.length > 0 ? `${current.join(", ")}, ${t}` : t);
                }
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
            >
              + {t}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Visibility & Display Position
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <label
            className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all cursor-pointer ${
              published
                ? "border-emerald-300 bg-emerald-50/60 shadow-xs"
                : "border-slate-200 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <div>
              <p className="text-xs font-bold text-slate-900">Published Live</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Visible to visitors on live portfolio & case studies.
              </p>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all cursor-pointer ${
              isDemo
                ? "border-amber-300 bg-amber-50/70 shadow-xs"
                : "border-slate-200 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={isDemo}
              onChange={(e) => setIsDemo(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
            <div>
              <p className="text-xs font-bold text-amber-900">Demo Mockup Only</p>
              <p className="text-[11px] text-amber-700/80 mt-0.5">
                Admin reference. Hidden from visitors on public website.
              </p>
            </div>
          </label>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Display Order Position</span>
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                  {order <= 1 ? "Rank #1 (Featured Top)" : `Rank #${order}`}
                </span>
              </label>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Determines sort order on the public website showcase.
              </p>
            </div>

            <select
              value={order || 1}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="admin-input rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-xs outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer sm:w-56"
            >
              <option value={1}>1st - Position 1 (Top Hero)</option>
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

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <div className="flex items-center gap-2.5">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all duration-150 hover:from-blue-700 hover:to-indigo-700 active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {saving ? "Saving…" : projectId ? "Update Project" : "Create Project"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        {projectId && (
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Are you sure you want to delete this project permanently?")) return;
              const res = await fetch(`/api/admin/projects/${projectId}`, { method: "DELETE" });
              if (res.ok) {
                await onSaved?.();
                if (!onSaved) router.push("/admin/dashboard");
              }
            }}
            className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-xs font-bold text-red-600 transition-all duration-150 hover:bg-red-100 cursor-pointer active:scale-95"
          >
            Delete Project
          </button>
        )}
      </div>
    </form>
  );
}
