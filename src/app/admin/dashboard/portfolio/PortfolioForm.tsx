"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
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
  const [order, setOrder] = useState(
    initial?.order !== undefined && initial?.order !== null && initial?.order > 0
      ? Number(initial.order)
      : 1
  );
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
    <form onSubmit={handleSubmit} className="space-y-6 text-slate-900 pb-2">
      {message && (
        <div
          className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-xs animate-admin-fade ${
            message.type === "ok"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <Icon
            icon={message.type === "ok" ? "solar:check-circle-bold" : "solar:danger-circle-bold"}
            width={20}
            height={20}
            className={message.type === "ok" ? "text-emerald-600 shrink-0" : "text-red-500 shrink-0"}
          />
          <span>{message.text}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Icon icon="solar:pen-bold-duotone" width={15} height={15} className="text-blue-600" />
            <span>Project Title *</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="e.g. Modern E-Commerce Platform"
            className="admin-input mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
            required
          />
        </div>

        {/* URL Slug */}
        <div>
          <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
            <span className="flex items-center gap-1.5">
              <Icon icon="solar:link-bold-duotone" width={15} height={15} className="text-blue-600" />
              <span>URL Slug</span>
            </span>
            <span className="text-[11px] font-normal normal-case text-slate-500">
              Auto-generated or custom
            </span>
          </label>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-semibold text-slate-400">
              /portfolio/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
              }}
              placeholder="project-slug"
              className="admin-input w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-24 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
            />
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Icon icon="solar:notes-bold-duotone" width={15} height={15} className="text-blue-600" />
            <span>Summary & Description</span>
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            placeholder="A brief overview of the project, features, client impact, or technologies used..."
            className="admin-input mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
          />
        </div>

        {/* Live Link */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Icon icon="solar:link-circle-bold-duotone" width={15} height={15} className="text-blue-600" />
            <span>Live Project URL (Optional)</span>
          </label>
          <input
            type="text"
            value={liveLink}
            onChange={(e) => setLiveLink(e.target.value)}
            placeholder="https://example.com"
            className="admin-input mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
          />
        </div>
      </div>

      {/* Cover Image Section */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Icon icon="solar:gallery-upload-bold-duotone" width={16} height={16} className="text-blue-600" />
          <span>Cover Image *</span>
        </label>
        <p className="mt-0.5 text-xs text-slate-500">
          Upload a high resolution banner or mockup (PNG, JPG, WebP under {formatMaxImageSizeLabel()}).
        </p>

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

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:bg-blue-700 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Icon icon="solar:upload-track-2-bold" width={16} height={16} />
            <span>{coverImage ? "Change Cover Image" : "Upload Cover Image"}</span>
          </button>
          {uploading && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
              <Icon icon="eos-icons:loading" width={16} height={16} className="animate-spin" />
              <span>Uploading to Cloudinary…</span>
            </span>
          )}
        </div>

        {coverImage && (
          <div className="group relative mt-4 h-36 w-60 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-md transition-transform hover:scale-[1.01]">
            <Image src={coverImage} alt="Cover preview" fill className="object-cover" sizes="240px" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold text-slate-800 shadow">
                Preview
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Visibility & Display Settings Card */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Visibility & Display Position
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Live Website Toggle Card */}
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

          {/* Demo Template Toggle Card */}
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
              <p className="text-xs font-bold text-amber-900">Demo Template Only</p>
              <p className="text-[11px] text-amber-700/80 mt-0.5">
                Admin mockup. Hidden from visitors on public site.
              </p>
            </div>
          </label>
        </div>

        {/* Position Selector */}
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

      {/* Action Footer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <div className="flex items-center gap-2.5">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all duration-150 hover:from-blue-700 hover:to-indigo-700 active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <>
                <Icon icon="eos-icons:loading" width={18} height={18} className="animate-spin" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                <Icon icon="solar:check-square-bold" width={18} height={18} />
                <span>{projectId ? "Update Project" : "Create Project"}</span>
              </>
            )}
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
              const res = await fetch(`/api/admin/portfolio/${projectId}`, { method: "DELETE" });
              if (res.ok) {
                await onSaved?.();
                if (!onSaved) router.push("/admin/dashboard/portfolio");
              }
            }}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-xs font-bold text-red-600 transition-all duration-150 hover:bg-red-100 cursor-pointer active:scale-95"
          >
            <Icon icon="solar:trash-bin-trash-bold" width={16} height={16} />
            <span>Delete Project</span>
          </button>
        )}
      </div>
    </form>
  );
}
