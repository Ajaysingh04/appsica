"use client";

import { useState, useRef, useCallback } from "react";
import { Icon } from "@iconify/react";
import { MAX_ADMIN_IMAGE_BYTES, formatMaxImageSizeLabel } from "@/lib/adminUploadLimits";

export type ServiceFeature = { title: string; description: string };
export type ServiceDemoLink = { name: string; url: string };

export type ServiceFormInitial = {
  title?: string;
  slug?: string;
  icon?: string;
  image?: string;
  description?: string;
  detail?: string;
  features?: ServiceFeature[];
  demoLinks?: ServiceDemoLink[];
  order?: number;
  published?: boolean;
};

const POPULAR_ICONS = [
  { name: "Code / Web", value: "solar:code-linear" },
  { name: "Mobile / Devices", value: "solar:devices-linear" },
  { name: "Cloud", value: "solar:cloud-linear" },
  { name: "Security", value: "solar:shield-check-linear" },
  { name: "Database", value: "solar:database-linear" },
  { name: "Analytics / AI", value: "solar:chart-square-linear" },
  { name: "Server / CPU", value: "solar:server-square-linear" },
  { name: "Settings / Gear", value: "solar:settings-linear" },
  { name: "Cart / E-commerce", value: "solar:cart-large-4-linear" },
  { name: "Rocket / Launch", value: "solar:rocket-linear" },
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ServiceForm({
  serviceId,
  initial,
  onClose,
  onSaved,
}: {
  serviceId?: string;
  initial?: ServiceFormInitial;
  onClose?: () => void;
  onSaved?: () => void | Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [icon, setIcon] = useState(initial?.icon ?? "solar:code-linear");
  const [image, setImage] = useState(initial?.image ?? "");
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [detail, setDetail] = useState(initial?.detail ?? "");
  const [features, setFeatures] = useState<ServiceFeature[]>(
    initial?.features?.length ? initial.features : [{ title: "", description: "" }]
  );
  const [demoLinks, setDemoLinks] = useState<ServiceDemoLink[]>(
    initial?.demoLinks?.length ? initial.demoLinks : []
  );
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? true);

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

  async function onPickFile(files: FileList | null) {
    if (!files?.length) return;
    setMessage(null);
    const file = files[0];
    if (file.size > MAX_ADMIN_IMAGE_BYTES) {
      setMessage({
        type: "err",
        text: `File size must be ${formatMaxImageSizeLabel()} or smaller.`,
      });
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFile(file);
      setImage(url);
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
    const validFeatures = features.filter((f) => f.title.trim());
    const validDemos = demoLinks.filter((d) => d.name.trim() && d.url.trim());

    if (!title.trim()) {
      setMessage({ type: "err", text: "Service title is required." });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: finalSlug,
        icon: icon.trim() || "solar:code-linear",
        image: image.trim(),
        description: description.trim(),
        detail: detail.trim(),
        features: validFeatures,
        demoLinks: validDemos,
        order,
        published,
      };

      const url = serviceId ? `/api/admin/services/${serviceId}` : "/api/admin/services";
      const res = await fetch(url, {
        method: serviceId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Save failed." });
        setSaving(false);
        return;
      }

      setMessage({ type: "ok", text: "Service saved successfully!" });
      await onSaved?.();
    } catch {
      setMessage({ type: "err", text: "Failed to save service." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-6">
      {message && (
        <div
          className={
            message.type === "ok"
              ? "rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800"
              : "rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700"
          }
        >
          {message.text}
        </div>
      )}

      {/* Main Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Service Title *</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="e.g. Custom Web & Cloud Development"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">URL Slug *</label>
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
            }}
            placeholder="web-development"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700">Sort Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Icon Selection */}
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Service Icon</label>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {POPULAR_ICONS.map((ico) => (
              <button
                key={ico.value}
                type="button"
                onClick={() => setIcon(ico.value)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  icon === ico.value
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon icon={ico.value} width={16} height={16} />
                <span>{ico.name}</span>
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-slate-500">Custom Iconify Tag:</span>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="solar:code-linear"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none"
            />
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-primary">
              <Icon icon={icon || "solar:code-linear"} width={20} height={20} />
            </div>
          </div>
        </div>

        {/* Short Description */}
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Short Summary (For Cards & Sliders)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Brief 1-2 sentence overview of what this service provides..."
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Full Detail */}
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Full Service Detail (For Detail Page)</label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={4}
            placeholder="Comprehensive description of the service capabilities, technologies, and methodologies..."
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Image Banner */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
          Service Cover Image (Optional)
        </label>
        <p className="text-xs text-slate-500 mb-3">Upload an image or paste a direct image URL.</p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          disabled={uploading}
          className="sr-only"
          onChange={(e) => {
            void onPickFile(e.target.files);
            e.target.value = "";
          }}
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          >
            {uploading ? "Uploading…" : image ? "Change Image" : "📁 Upload Image"}
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <input
            type="url"
            value={customImageUrl}
            onChange={(e) => setCustomImageUrl(e.target.value)}
            placeholder="Or paste direct image URL (https://...)"
            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => {
              if (customImageUrl.trim()) {
                setImage(customImageUrl.trim());
                setCustomImageUrl("");
              }
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Apply URL
          </button>
        </div>

        {image && (
          <div className="mt-3 relative w-48 h-28 rounded-lg overflow-hidden border border-slate-200">
            <img src={image} alt="Cover Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setImage("")}
              className="absolute top-1 right-1 rounded bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white shadow"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Key Features */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700">Key Features / Deliverables</label>
          <button
            type="button"
            onClick={() => setFeatures((f) => [...f, { title: "", description: "" }])}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            + Add Feature
          </button>
        </div>
        <div className="space-y-3">
          {features.map((f, i) => (
            <div key={i} className="flex gap-2 items-start rounded-lg border border-slate-200 bg-slate-50/40 p-3">
              <div className="flex-1 space-y-2">
                <input
                  placeholder="Feature title (e.g. Microservices Architecture)"
                  value={f.title}
                  onChange={(e) => {
                    const next = [...features];
                    next[i] = { ...next[i], title: e.target.value };
                    setFeatures(next);
                  }}
                  className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-sm"
                />
                <input
                  placeholder="Feature description (optional)"
                  value={f.description}
                  onChange={(e) => {
                    const next = [...features];
                    next[i] = { ...next[i], description: e.target.value };
                    setFeatures(next);
                  }}
                  className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600"
                />
              </div>
              <button
                type="button"
                onClick={() => setFeatures((prev) => prev.filter((_, idx) => idx !== i))}
                className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                title="Remove Feature"
              >
                <Icon icon="solar:trash-bin-trash-bold" width={18} height={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Links */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700">Live Demo Links (Optional)</label>
          <button
            type="button"
            onClick={() => setDemoLinks((d) => [...d, { name: "", url: "" }])}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            + Add Demo Link
          </button>
        </div>
        {demoLinks.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No demo links added.</p>
        ) : (
          <div className="space-y-2">
            {demoLinks.map((d, i) => (
              <div key={i} className="flex gap-2 items-center rounded-lg border border-slate-200 bg-slate-50/40 p-2.5">
                <input
                  placeholder="Link label (e.g. CRM Live Demo)"
                  value={d.name}
                  onChange={(e) => {
                    const next = [...demoLinks];
                    next[i] = { ...next[i], name: e.target.value };
                    setDemoLinks(next);
                  }}
                  className="w-1/3 rounded border border-slate-200 bg-white px-3 py-1.5 text-sm"
                />
                <input
                  placeholder="https://..."
                  value={d.url}
                  onChange={(e) => {
                    const next = [...demoLinks];
                    next[i] = { ...next[i], url: e.target.value };
                    setDemoLinks(next);
                  }}
                  className="flex-1 rounded border border-slate-200 bg-white px-3 py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setDemoLinks((prev) => prev.filter((_, idx) => idx !== i))}
                  className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  <Icon icon="solar:trash-bin-trash-bold" width={18} height={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Published Toggle */}
      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
          />
          <span>Published on website (Visible in header, footer, & services page)</span>
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-60 cursor-pointer"
        >
          {saving ? "Saving…" : serviceId ? "Update Service" : "Create Service"}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
