"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
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
  category?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
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

const CATEGORIES = [
  {
    id: "mobile",
    label: "Mobile App",
    subtitle: "Android & iOS Applications with Play Store / App Store",
    icon: "solar:smartphone-bold-duotone",
    badge: "Play Store Ready",
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: "enterprise",
    label: "Enterprise & SaaS",
    subtitle: "Cloud platforms, CRM, ERP, and internal management tools",
    icon: "solar:server-square-cloud-bold-duotone",
    badge: "Cloud System",
    color: "from-purple-600 to-indigo-600",
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    subtitle: "Online stores, marketplaces, cart checkouts & multi-vendor",
    icon: "solar:shop-2-bold-duotone",
    badge: "Commerce",
    color: "from-emerald-600 to-teal-600",
  },
  {
    id: "web",
    label: "Web Platform",
    subtitle: "High-speed modern websites, web platforms & SaaS frontends",
    icon: "solar:global-bold-duotone",
    badge: "Web App",
    color: "from-sky-600 to-blue-600",
  },
];

const MOBILE_TECH_PRESETS = [
  "Flutter",
  "React Native",
  "Android",
  "iOS",
  "Kotlin",
  "Swift",
  "Firebase",
  "Expo",
  "Node.js",
  "REST API",
  "GraphQL",
  "SQLite",
  "Fastlane",
];

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

  // Category determination
  const initialCategory = (() => {
    if (initial?.category) return initial.category;
    const text = (
      (initial?.title || "") +
      " " +
      (initial?.summary || "") +
      " " +
      (initial?.techStack || []).join(" ")
    ).toLowerCase();
    if (
      text.includes("mobile") ||
      text.includes("app") ||
      text.includes("flutter") ||
      text.includes("react native") ||
      text.includes("android") ||
      text.includes("ios")
    ) {
      return "mobile";
    }
    if (text.includes("commerce") || text.includes("shop") || text.includes("store")) {
      return "ecommerce";
    }
    if (text.includes("enterprise") || text.includes("saas") || text.includes("management")) {
      return "enterprise";
    }
    return "mobile";
  })();

  const [category, setCategory] = useState<string>(initialCategory);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  // Links
  const [playStoreUrl, setPlayStoreUrl] = useState(initial?.playStoreUrl ?? "");
  const [appStoreUrl, setAppStoreUrl] = useState(initial?.appStoreUrl ?? "");
  const [liveLink, setLiveLink] = useState(initial?.liveLink ?? "");

  // Images
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [images, setImages] = useState<string[]>(() => {
    if (initial?.images?.length) return [...initial.images];
    if (initial?.coverImage) return [initial.coverImage];
    return [];
  });
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [previewMockupMode, setPreviewMockupMode] = useState<boolean>(initialCategory === "mobile");

  // Features & Tech Stack
  const [features, setFeatures] = useState<Feature[]>(
    initial?.features?.length ? initial!.features! : [{ title: "", description: "" }]
  );
  const [techStackRaw, setTechStackRaw] = useState(
    (initial?.techStack ?? []).join(", ")
  );

  // Settings
  const [published, setPublished] = useState(initial?.published ?? true);
  const [isDemo, setIsDemo] = useState(initial?.isDemo ?? false);
  const [order, setOrder] = useState(
    initial?.order !== undefined && initial?.order !== null && initial?.order > 0
      ? Number(initial.order)
      : 1
  );

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>("");
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
        text: `Each image must be ${formatMaxImageSizeLabel()} or smaller. Exceeded: ${tooLarge.map((f) => f.name).join(", ")}`,
      });
    }

    const toUpload = fileArr.filter((f) => f.size <= MAX_ADMIN_IMAGE_BYTES);
    if (!toUpload.length) return;

    setUploading(true);
    setUploadProgressText(`Uploading 1 of ${toUpload.length}...`);

    try {
      const urls: string[] = [];
      for (let i = 0; i < toUpload.length; i++) {
        setUploadProgressText(`Uploading image ${i + 1} of ${toUpload.length}...`);
        const url = await uploadFile(toUpload[i]);
        urls.push(url);
      }

      setImages((prev) => {
        const merged = [...prev, ...urls];
        return [...new Set(merged)];
      });

      setCoverImage((c) => c || urls[0] || "");
      setMessage({
        type: "ok",
        text: `Successfully uploaded ${urls.length} image(s)!`,
      });
    } catch (e) {
      setMessage({ type: "err", text: (e as Error).message });
    } finally {
      setUploading(false);
      setUploadProgressText("");
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

  function moveImage(index: number, direction: "left" | "right") {
    setImages((prev) => {
      const targetIndex = direction === "left" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
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
      setMessage({ type: "err", text: "Project Title is required." });
      return;
    }
    if (!cover) {
      setMessage({
        type: "err",
        text: "Please upload at least one image or app icon for this project.",
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
        category,
        playStoreUrl: playStoreUrl.trim(),
        appStoreUrl: appStoreUrl.trim(),
        liveLink: liveLink.trim(),
        coverImage: cover,
        images: imageList,
        features: feats,
        techStack,
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

      setMessage({ type: "ok", text: "Project saved successfully!" });
      await onSaved?.();
      if (!onSaved) {
        router.refresh();
      }
    } catch {
      setMessage({ type: "err", text: "Save failed. Check your network connection." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-7 pb-10 text-slate-900">
      {/* Status Alert Banner */}
      {message && (
        <div
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition-all duration-300 ${
            message.type === "ok"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <Icon
            icon={message.type === "ok" ? "solar:check-circle-bold" : "solar:danger-circle-bold"}
            width={22}
            height={22}
            className={message.type === "ok" ? "text-emerald-600 shrink-0" : "text-red-500 shrink-0"}
          />
          <span className="flex-1">{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            <Icon icon="solar:close-circle-linear" width={18} height={18} />
          </button>
        </div>
      )}

      {/* SECTION 1: Category Selector */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/70 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
              <Icon icon="solar:widget-add-bold-duotone" width={18} height={18} className="text-blue-600" />
              <span>Project Category *</span>
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Select where this project appears on the public portfolio tabs.
            </p>
          </div>
          {category === "mobile" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
              <Icon icon="solar:smartphone-bold" width={14} height={14} />
              <span>Mobile App Mode Active</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  if (cat.id === "mobile") {
                    setPreviewMockupMode(true);
                  }
                }}
                className={`flex flex-col items-start text-left p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 shadow-md ring-2 ring-blue-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon icon={cat.icon} width={20} height={20} />
                  </div>
                  {isSelected && (
                    <Icon icon="solar:check-circle-bold" width={18} height={18} className="text-blue-600" />
                  )}
                </div>
                <p className="text-sm font-extrabold text-slate-900">{cat.label}</p>
                <p className="text-[11px] text-slate-500 leading-tight mt-1 line-clamp-2">
                  {cat.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: General Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
          <Icon icon="solar:pen-new-square-bold-duotone" width={18} height={18} className="text-blue-600" />
          <span>Basic Information</span>
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Project Title */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Project / App Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="e.g. QuickBite - Food Delivery Mobile App"
              className="admin-input mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
              required
            />
          </div>

          {/* URL Slug */}
          <div className="sm:col-span-2">
            <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
              <span>URL Slug</span>
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
                placeholder="quickbite-food-delivery"
                className="admin-input w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-24 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
              />
            </div>
          </div>

          {/* Short Summary */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Short Summary (Displayed on Project Card)
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A modern food delivery app with live GPS tracking, menu browsing, and instant checkout."
              className="admin-input mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
            />
          </div>

          {/* Full Description */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Detailed Architecture & Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Comprehensive overview of features, problem statement, technology stack, and engineering impact..."
              className="admin-input mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Store & Live Links (Play Store, App Store, Web Demo) */}
      <div
        className={`rounded-2xl border p-5 shadow-xs transition-all ${
          category === "mobile"
            ? "border-blue-300 bg-gradient-to-b from-blue-50/50 to-white ring-1 ring-blue-500/20"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
              <Icon icon="solar:link-circle-bold-duotone" width={18} height={18} className="text-blue-600" />
              <span>Direct Store & Live Application Links</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct download & demo links displayed on cards and case study hero.
            </p>
          </div>
          {category === "mobile" && (
            <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-extrabold text-emerald-800 flex items-center gap-1">
              <Icon icon="solar:check-circle-bold" width={14} height={14} />
              <span>Direct Play Store button enabled</span>
            </span>
          )}
        </div>

        <div className="space-y-4">
          {/* 1. Google Play Store Link */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Icon icon="solar:play-bold" width={14} height={14} />
                </span>
                <span>Google Play Store URL</span>
                {category === "mobile" && (
                  <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Recommended for Mobile Apps
                  </span>
                )}
              </label>
              {playStoreUrl && (
                <a
                  href={playStoreUrl.startsWith("http") ? playStoreUrl : `https://${playStoreUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <span>Test Link</span>
                  <Icon icon="solar:arrow-right-up-linear" width={13} height={13} />
                </a>
              )}
            </div>
            <input
              type="url"
              value={playStoreUrl}
              onChange={(e) => setPlayStoreUrl(e.target.value)}
              placeholder="https://play.google.com/store/apps/details?id=com.yourcompany.app"
              className="admin-input w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Visitors will see a <strong>"Google Play"</strong> download button directly opening this app on the Play Store.
            </p>
          </div>

          {/* 2. Apple App Store Link */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Icon icon="solar:round-apple-bold" width={14} height={14} />
                </span>
                <span>Apple App Store URL (Optional)</span>
              </label>
              {appStoreUrl && (
                <a
                  href={appStoreUrl.startsWith("http") ? appStoreUrl : `https://${appStoreUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <span>Test Link</span>
                  <Icon icon="solar:arrow-right-up-linear" width={13} height={13} />
                </a>
              )}
            </div>
            <input
              type="url"
              value={appStoreUrl}
              onChange={(e) => setAppStoreUrl(e.target.value)}
              placeholder="https://apps.apple.com/app/your-app-name/id123456789"
              className="admin-input w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all focus:border-slate-800 focus:ring-4 focus:ring-slate-500/15 focus:outline-none"
            />
          </div>

          {/* 3. Live Web / Demo URL */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Icon icon="solar:global-bold" width={14} height={14} />
                </span>
                <span>Live Web Demo URL (Optional)</span>
              </label>
              {liveLink && (
                <a
                  href={liveLink.startsWith("http") ? liveLink : `https://${liveLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <span>Test Link</span>
                  <Icon icon="solar:arrow-right-up-linear" width={13} height={13} />
                </a>
              )}
            </div>
            <input
              type="url"
              value={liveLink}
              onChange={(e) => setLiveLink(e.target.value)}
              placeholder="https://my-app-demo.com"
              className="admin-input w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Visual Images & Mobile Screenshots Uploader */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <Icon icon="solar:gallery-upload-bold-duotone" width={18} height={18} className="text-blue-600" />
              <span>Project Images & App Screenshots *</span>
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload multiple screenshots from files or enter image URLs. Click "Make Cover" to set the primary card image.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMockupMode(!previewMockupMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                previewMockupMode
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Icon icon="solar:smartphone-bold" width={14} height={14} />
              <span>{previewMockupMode ? "Mobile Mockup View: ON" : "Standard 16:9 View"}</span>
            </button>
          </div>
        </div>

        {/* Hidden Multi-file input */}
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

        {/* Upload Buttons & Drag Box */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Icon icon="solar:upload-track-2-bold" width={18} height={18} />
            <span>
              {uploading
                ? uploadProgressText || "Uploading Images…"
                : images.length === 0
                ? "Upload Images From File"
                : "+ Upload More Files"}
            </span>
          </button>

          <span className="text-xs font-bold text-slate-400">or</span>

          {/* Paste URL */}
          <div className="flex w-full sm:flex-1 gap-2">
            <input
              type="url"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="admin-input flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              Add URL
            </button>
          </div>
        </div>

        {uploading && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-xs font-bold text-blue-700 border border-blue-200">
            <Icon icon="eos-icons:loading" width={18} height={18} className="animate-spin text-blue-600" />
            <span>{uploadProgressText || "Uploading images to cloud storage, please wait…"}</span>
          </div>
        )}

        {/* Selected Images Gallery Preview */}
        {images.length > 0 ? (
          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700">
                Uploaded Images & Screenshots ({images.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Clear all uploaded images?")) {
                    setImages([]);
                    setCoverImage("");
                  }
                }}
                className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>

            {/* Grid of Images with Mobile phone frame support */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {images.map((url, idx) => {
                const isCover = coverImage === url;
                return (
                  <div
                    key={url + idx}
                    className={`group relative flex flex-col rounded-2xl overflow-hidden border-2 transition-all bg-slate-950 shadow-md ${
                      isCover
                        ? "border-blue-600 ring-2 ring-blue-500/30"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {/* Image View */}
                    <div
                      className={`relative w-full overflow-hidden flex items-center justify-center bg-slate-900 ${
                        previewMockupMode ? "h-64 sm:h-72" : "h-36 sm:h-40"
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`Screenshot ${idx + 1}`}
                        fill
                        className={previewMockupMode ? "object-contain p-2" : "object-cover"}
                        sizes="200px"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        {isCover ? (
                          <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-extrabold shadow flex items-center gap-1">
                            <Icon icon="solar:star-bold" width={11} height={11} />
                            <span>Primary Cover</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-bold backdrop-blur-xs">
                            #{idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        title="Remove Image"
                        className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-md"
                      >
                        <Icon icon="solar:trash-bin-trash-bold" width={12} height={12} />
                      </button>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="p-2 bg-slate-900 border-t border-white/10 flex items-center justify-between gap-1 text-[11px]">
                      {/* Make Cover Button */}
                      {!isCover ? (
                        <button
                          type="button"
                          onClick={() => setCoverImage(url)}
                          className="flex-1 py-1 px-2 rounded-lg bg-white/10 hover:bg-blue-600 text-white font-bold text-[10px] transition cursor-pointer text-center"
                        >
                          Set Cover
                        </button>
                      ) : (
                        <span className="flex-1 py-1 px-2 rounded-lg bg-blue-600/30 text-blue-300 font-extrabold text-[10px] text-center border border-blue-500/30">
                          Active Cover
                        </span>
                      )}

                      {/* Move Left / Right */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveImage(idx, "left")}
                          title="Move Left"
                          className="p-1 rounded-md bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Icon icon="solar:arrow-left-linear" width={12} height={12} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === images.length - 1}
                          onClick={() => moveImage(idx, "right")}
                          title="Move Right"
                          className="p-1 rounded-md bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Icon icon="solar:arrow-right-linear" width={12} height={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
              <Icon icon="solar:gallery-wide-bold" width={24} height={24} />
            </div>
            <p className="text-sm font-bold text-slate-800">No images uploaded yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Click <strong>"Upload Images From File"</strong> to select one or multiple app screenshots from your computer.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 5: Tech Stack & Features */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
          <Icon icon="solar:code-square-bold-duotone" width={18} height={18} className="text-blue-600" />
          <span>Technology Stack & Frameworks</span>
        </p>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Tech stack (comma-separated)
          </label>
          <input
            type="text"
            value={techStackRaw}
            onChange={(e) => setTechStackRaw(e.target.value)}
            placeholder="Flutter, Firebase, Kotlin, Dart, Node.js"
            className="admin-input mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
          />

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">
              {category === "mobile" ? "Mobile Stack Presets:" : "Quick add:"}
            </span>
            {(category === "mobile"
              ? MOBILE_TECH_PRESETS
              : ["Next.js", "React", "Node.js", "TypeScript", "Tailwind CSS", "MongoDB", "Stripe", "AWS", "Python", "Docker"]
            ).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  const current = techStackRaw
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  if (!current.includes(t)) {
                    setTechStackRaw(current.length > 0 ? `${current.join(", ")}, ${t}` : t);
                  }
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
              >
                + {t}
              </button>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Key Features & Capabilities
            </label>
            <button
              type="button"
              onClick={() => setFeatures((f) => [...f, { title: "", description: "" }])}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              + Add Feature
            </button>
          </div>

          <div className="space-y-2.5">
            {features.map((f, i) => (
              <div key={i} className="flex gap-2 items-start rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Feature title (e.g. Real-Time Order Tracking)"
                    value={f.title}
                    onChange={(e) => {
                      const next = [...features];
                      next[i] = { ...next[i], title: e.target.value };
                      setFeatures(next);
                    }}
                    className="admin-input w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
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
                    className="admin-input w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setFeatures((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                    title="Remove Feature"
                  >
                    <Icon icon="solar:trash-bin-trash-bold" width={16} height={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 6: Visibility & Display Settings */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
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
              <p className="text-xs font-bold text-amber-900">Demo Template / Hidden</p>
              <p className="text-[11px] text-amber-700/80 mt-0.5">
                Saved for admin reference only. Hidden from the live website.
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

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <div className="flex items-center gap-2.5">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all duration-150 hover:from-blue-700 hover:to-indigo-700 active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <>
                <Icon icon="eos-icons:loading" width={18} height={18} className="animate-spin" />
                <span>Saving Project…</span>
              </>
            ) : (
              <>
                <Icon icon="solar:diskette-bold" width={18} height={18} />
                <span>{projectId ? "Update Project" : "Create & Publish Project"}</span>
              </>
            )}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-2xs transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
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
            className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-xs font-bold text-red-600 transition-all duration-150 hover:bg-red-100 cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <Icon icon="solar:trash-bin-trash-bold" width={15} height={15} />
            <span>Delete Project</span>
          </button>
        )}
      </div>
    </form>
  );
}
