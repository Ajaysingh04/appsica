"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { MAX_ADMIN_IMAGE_BYTES, formatMaxImageSizeLabel } from "@/lib/adminUploadLimits";

type Feature = { title: string; description: string };

export type SubAppFormState = {
  role: "customer" | "vendor" | "delivery" | "custom" | string;
  title: string;
  summary?: string;
  playStoreUrl: string;
  appStoreUrl?: string;
  liveLink?: string;
  images: string[];
};

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
  apps?: SubAppFormState[];
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
    label: "Mobile App (Suite)",
    subtitle: "Complete mobile ecosystem: Customer, Vendor, and Delivery apps",
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

const DEFAULT_ECOSYSTEM_APPS: SubAppFormState[] = [
  {
    role: "customer",
    title: "Customer Mobile App",
    summary: "Browse menus & catalog, real-time live order tracking, secure payment checkout.",
    playStoreUrl: "",
    appStoreUrl: "",
    liveLink: "",
    images: [],
  },
  {
    role: "vendor",
    title: "Vendor / Store Partner App",
    summary: "Order management, menu & inventory control, live revenue dashboard.",
    playStoreUrl: "",
    appStoreUrl: "",
    liveLink: "",
    images: [],
  },
  {
    role: "delivery",
    title: "Delivery Partner App",
    summary: "Instant dispatch alerts, live turn-by-turn route navigation, earnings payout.",
    playStoreUrl: "",
    appStoreUrl: "",
    liveLink: "",
    images: [],
  },
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

  // Multi-App Ecosystem State (Customer, Vendor, Delivery, etc.)
  const [isMultiAppSuite, setIsMultiAppSuite] = useState<boolean>(() => {
    if (initial?.apps && initial.apps.length > 0) return true;
    return initialCategory === "mobile";
  });

  const [appsList, setAppsList] = useState<SubAppFormState[]>(() => {
    if (initial?.apps && initial.apps.length > 0) {
      const existing: SubAppFormState[] = initial.apps.map((a) => ({
        role: a.role || "customer",
        title: a.title || "App",
        summary: a.summary || "",
        playStoreUrl: a.playStoreUrl || "",
        appStoreUrl: a.appStoreUrl || "",
        liveLink: a.liveLink || "",
        images: Array.isArray(a.images) ? a.images : [],
      }));

      // Ensure standard 3-in-1 ecosystem roles always exist
      const rolesPresent = new Set(existing.map((a) => a.role));
      DEFAULT_ECOSYSTEM_APPS.forEach((def) => {
        if (!rolesPresent.has(def.role)) {
          existing.push({ ...def });
        }
      });
      return existing;
    }
    // Pre-populate with 3-in-1 suite: Customer, Vendor, Delivery
    return DEFAULT_ECOSYSTEM_APPS.map((a, i) => ({
      ...a,
      playStoreUrl: i === 0 ? initial?.playStoreUrl || "" : "",
      appStoreUrl: i === 0 ? initial?.appStoreUrl || "" : "",
    }));
  });

  const [activeAppIndex, setActiveAppIndex] = useState<number>(0);
  const [appSavedToast, setAppSavedToast] = useState<{
    role: string;
    title: string;
    nextRole?: string;
    nextRoleTitle?: string;
  } | null>(null);

  // Fallback single links
  const [playStoreUrl, setPlayStoreUrl] = useState(initial?.playStoreUrl ?? "");
  const [appStoreUrl, setAppStoreUrl] = useState(initial?.appStoreUrl ?? "");
  const [liveLink, setLiveLink] = useState(initial?.liveLink ?? "");

  // Master Banner & Screenshots
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [images, setImages] = useState<string[]>(() => {
    if (initial?.images?.length) return [...initial.images];
    if (initial?.coverImage) return [initial.coverImage];
    return [];
  });
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [previewMockupMode, setPreviewMockupMode] = useState<boolean>(true);

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

  // Refs for upload
  const masterFileInputRef = useRef<HTMLInputElement>(null);
  const appFileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  }, []);

  // Upload Master / Global images
  async function onPickMasterFiles(files: FileList | null) {
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
        text: `Successfully uploaded ${urls.length} master image(s)!`,
      });
    } catch (e) {
      setMessage({ type: "err", text: (e as Error).message });
    } finally {
      setUploading(false);
      setUploadProgressText("");
    }
  }

  // Upload Sub-App Screenshots for active app
  async function onPickAppFiles(files: FileList | null) {
    if (!files?.length) return;
    setMessage(null);

    const fileArr = Array.from(files);
    const toUpload = fileArr.filter((f) => f.size <= MAX_ADMIN_IMAGE_BYTES);
    if (!toUpload.length) return;

    setUploading(true);
    setUploadProgressText(`Uploading screenshots for ${appsList[activeAppIndex]?.title || "App"}...`);

    try {
      const urls: string[] = [];
      for (let i = 0; i < toUpload.length; i++) {
        const url = await uploadFile(toUpload[i]);
        urls.push(url);
      }

      setAppsList((prev) => {
        const copy = [...prev];
        const currentApp = copy[activeAppIndex];
        if (currentApp) {
          copy[activeAppIndex] = {
            ...currentApp,
            images: [...new Set([...(currentApp.images || []), ...urls])],
          };
        }
        return copy;
      });

      // Also ensure master cover gets an image if currently empty
      if (!coverImage && urls[0]) {
        setCoverImage(urls[0]);
      }

      setMessage({
        type: "ok",
        text: `Uploaded ${urls.length} screenshots for ${appsList[activeAppIndex]?.title || "App"}!`,
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

  function removeMasterImage(url: string) {
    setImages((prev) => {
      const next = prev.filter((u) => u !== url);
      setCoverImage((c) => (c === url ? next[0] || "" : c));
      return next;
    });
  }

  function removeAppImage(appIdx: number, imgUrl: string) {
    setAppsList((prev) => {
      const copy = [...prev];
      const target = copy[appIdx];
      if (target) {
        copy[appIdx] = {
          ...target,
          images: (target.images || []).filter((u) => u !== imgUrl),
        };
      }
      return copy;
    });
  }

  function updateActiveAppField(field: keyof SubAppFormState, val: any) {
    setAppsList((prev) => {
      const copy = [...prev];
      if (copy[activeAppIndex]) {
        copy[activeAppIndex] = { ...copy[activeAppIndex], [field]: val };
      }
      return copy;
    });
  }

  function handleSwitchAppRole(targetRole: string) {
    const existingIndex = appsList.findIndex((a) => a.role === targetRole);
    if (existingIndex !== -1) {
      setActiveAppIndex(existingIndex);
    } else {
      const def = DEFAULT_ECOSYSTEM_APPS.find((d) => d.role === targetRole);
      const newApp: SubAppFormState = {
        role: targetRole,
        title: def?.title || `${targetRole.charAt(0).toUpperCase() + targetRole.slice(1)} App`,
        summary: def?.summary || "",
        playStoreUrl: "",
        appStoreUrl: "",
        liveLink: "",
        images: [],
      };
      setAppsList((prev) => [...prev, newApp]);
      setActiveAppIndex(appsList.length);
    }
    setAppSavedToast(null);
  }

  function handleSaveCurrentApp() {
    const current = appsList[activeAppIndex];
    if (!current) return;

    if (current.playStoreUrl.trim() && !current.playStoreUrl.trim().startsWith("http")) {
      updateActiveAppField("playStoreUrl", `https://${current.playStoreUrl.trim()}`);
    }

    const rolesOrder = ["customer", "vendor", "delivery"];
    const curIdx = rolesOrder.indexOf(current.role);
    const nextRole = curIdx !== -1 && curIdx < rolesOrder.length - 1 ? rolesOrder[curIdx + 1] : undefined;
    const nextRoleTitle =
      nextRole === "vendor"
        ? "Vendor Partner App"
        : nextRole === "delivery"
        ? "Delivery Partner App"
        : undefined;

    setAppSavedToast({
      role: current.role,
      title: current.title,
      nextRole,
      nextRoleTitle,
    });
  }

  function addNewCustomApp() {
    const newApp: SubAppFormState = {
      role: "custom",
      title: `App #${appsList.length + 1}`,
      summary: "Additional service or administrative mobile app.",
      playStoreUrl: "",
      appStoreUrl: "",
      liveLink: "",
      images: [],
    };
    setAppsList((prev) => [...prev, newApp]);
    setActiveAppIndex(appsList.length);
  }

  function removeApp(index: number) {
    if (appsList.length <= 1) {
      alert("At least one app is required in the ecosystem.");
      return;
    }
    if (confirm(`Remove "${appsList[index]?.title}" from this project?`)) {
      setAppsList((prev) => prev.filter((_, i) => i !== index));
      setActiveAppIndex(Math.max(0, index - 1));
    }
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

    // Gather all screenshots across all sub-apps + master images
    const subAppImages = appsList.flatMap((a) => a.images || []);
    const combinedImages = [...new Set([...images, ...subAppImages])].filter(Boolean);
    const masterCover = coverImage || combinedImages[0] || "";

    if (!title.trim()) {
      setMessage({ type: "err", text: "Project Title is required." });
      return;
    }
    if (!masterCover) {
      setMessage({
        type: "err",
        text: "Please upload at least one image or screenshot for this project.",
      });
      return;
    }

    // Determine primary Play Store URL
    const primaryPlayStore =
      playStoreUrl.trim() ||
      appsList[0]?.playStoreUrl?.trim() ||
      appsList.find((a) => a.playStoreUrl?.trim())?.playStoreUrl?.trim() ||
      "";

    const primaryAppStore =
      appStoreUrl.trim() ||
      appsList[0]?.appStoreUrl?.trim() ||
      "";

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: finalSlug,
        summary: summary.trim(),
        description: description.trim(),
        category,
        playStoreUrl: primaryPlayStore,
        appStoreUrl: primaryAppStore,
        liveLink: liveLink.trim(),
        coverImage: masterCover,
        images: combinedImages,
        apps: isMultiAppSuite ? appsList : [],
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

  const currentApp = appsList[activeAppIndex] || appsList[0];

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
            className="text-slate-400 hover:text-slate-700 cursor-pointer"
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
              <span>Mobile App Ecosystem Active</span>
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
                    setIsMultiAppSuite(true);
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
          <span>Product / Suite Information</span>
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Project Title */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Product / Project Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="e.g. QuickBite - 3-in-1 Food Delivery Ecosystem"
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
                placeholder="quickbite-food-delivery-ecosystem"
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
              placeholder="A complete 3-app ecosystem with Customer, Vendor Partner, and Delivery Rider mobile apps."
              className="admin-input mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
            />
          </div>

          {/* Full Description */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Detailed Architecture & Overview
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Architectural deep dive covering the 3 interconnected apps, real-time WebSocket dispatch engine, live geolocation tracking, and cloud scalability..."
              className="admin-input mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Multi-App Ecosystem Suite (Customer + Vendor + Delivery) */}
      <div className="rounded-2xl border-2 border-blue-500/30 bg-gradient-to-b from-blue-50/60 via-white to-slate-50/40 p-5 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Icon icon="solar:layers-minimalistic-bold-duotone" width={20} height={20} />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Multi-App Ecosystem (3-in-1 Suite Manager)
                </h3>
                <p className="text-xs text-slate-500">
                  Manage Customer App, Vendor Partner App, and Delivery Rider App links & screenshots together!
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <input
                type="checkbox"
                checked={isMultiAppSuite}
                onChange={(e) => setIsMultiAppSuite(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>Multi-App Suite Enabled ({appsList.length} Apps)</span>
            </label>
          </div>
        </div>

        {isMultiAppSuite && (
          <div>
            {/* Apps Tab Navigator */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {appsList.map((app, idx) => {
                const isActive = activeAppIndex === idx;
                const roleIcon =
                  app.role === "customer"
                    ? "solar:smartphone-bold"
                    : app.role === "vendor"
                    ? "solar:shop-2-bold"
                    : app.role === "delivery"
                    ? "solar:delivery-bold"
                    : "solar:widget-bold";

                const roleColor =
                  app.role === "customer"
                    ? "bg-emerald-500"
                    : app.role === "vendor"
                    ? "bg-amber-500"
                    : app.role === "delivery"
                    ? "bg-blue-600"
                    : "bg-purple-600";

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveAppIndex(idx)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer border ${
                      isActive
                        ? "bg-white text-slate-900 border-blue-600 shadow-md ring-2 ring-blue-500/20 scale-[1.02]"
                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-900"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${roleColor}`} />
                    <Icon icon={roleIcon} width={16} height={16} />
                    <span>{app.title || `App #${idx + 1}`}</span>
                    {app.images?.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                        {app.images.length}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={addNewCustomApp}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-blue-600 border border-dashed border-blue-300 hover:bg-blue-50 transition shrink-0 cursor-pointer"
              >
                <Icon icon="solar:add-circle-bold" width={16} height={16} />
                <span>+ Add App</span>
              </button>
            </div>

            {/* Active Sub-App Card Editor */}
            {currentApp && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800">
                      Configuring App #{activeAppIndex + 1}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({currentApp.role?.toUpperCase()})
                    </span>
                  </div>

                  {appsList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeApp(activeAppIndex)}
                      className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Icon icon="solar:trash-bin-trash-bold" width={14} height={14} />
                      <span>Remove This App</span>
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* App Role Switcher */}
                  <div>
                    <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-800">
                      <span>Select App Role to Configure *</span>
                      <span className="text-[11px] font-semibold normal-case text-blue-600">
                        Switches between Customer, Vendor & Delivery
                      </span>
                    </label>
                    <select
                      value={currentApp.role}
                      onChange={(e) => handleSwitchAppRole(e.target.value)}
                      className="admin-input mt-1.5 w-full rounded-xl border-2 border-blue-500 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 shadow-xs outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 cursor-pointer"
                    >
                      <option value="customer">
                        📱 Customer / User App {appsList.find((a) => a.role === "customer")?.playStoreUrl ? "— ✅ (Link Added)" : "— ⚪ (Link Empty)"}
                      </option>
                      <option value="vendor">
                        🏪 Vendor / Store Partner App {appsList.find((a) => a.role === "vendor")?.playStoreUrl ? "— ✅ (Link Added)" : "— ⚪ (Link Empty)"}
                      </option>
                      <option value="delivery">
                        🛵 Delivery Partner / Rider App {appsList.find((a) => a.role === "delivery")?.playStoreUrl ? "— ✅ (Link Added)" : "— ⚪ (Link Empty)"}
                      </option>
                      {appsList
                        .filter((a) => !["customer", "vendor", "delivery"].includes(a.role))
                        .map((a) => (
                          <option key={a.role} value={a.role}>
                            ⚡ {a.title} {a.playStoreUrl ? "— ✅ (Link Added)" : "— ⚪ (Link Empty)"}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* App Title */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      App Display Name *
                    </label>
                    <input
                      type="text"
                      value={currentApp.title}
                      onChange={(e) => updateActiveAppField("title", e.target.value)}
                      placeholder="e.g. Customer App or Vendor Partner App"
                      className="admin-input mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 shadow-2xs outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15"
                      required
                    />
                  </div>

                  {/* App Summary */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      App Purpose / Capabilities
                    </label>
                    <input
                      type="text"
                      value={currentApp.summary || ""}
                      onChange={(e) => updateActiveAppField("summary", e.target.value)}
                      placeholder="e.g. Live order reception, product catalog & revenue reports."
                      className="admin-input mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 shadow-2xs outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15"
                    />
                  </div>

                  {/* Direct Play Store Link for this App */}
                  <div className="sm:col-span-2 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <Icon icon="solar:play-bold" width={14} height={14} />
                        </span>
                        <span>Google Play Store URL for {currentApp.title}</span>
                      </label>
                      {currentApp.playStoreUrl && (
                        <a
                          href={currentApp.playStoreUrl.startsWith("http") ? currentApp.playStoreUrl : `https://${currentApp.playStoreUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-300 hover:bg-emerald-100"
                        >
                          <span>Test Link</span>
                          <Icon icon="solar:arrow-right-up-linear" width={12} height={12} />
                        </a>
                      )}
                    </div>

                    <input
                      type="url"
                      value={currentApp.playStoreUrl}
                      onChange={(e) => updateActiveAppField("playStoreUrl", e.target.value)}
                      placeholder={`Enter Google Play Store link for ${currentApp.title} (e.g. https://play.google.com/store/apps/details?id=...)`}
                      className="admin-input mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 shadow-2xs focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 outline-none"
                    />

                    {/* Dedicated Save Button & Next Role Switcher */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-emerald-200">
                      <button
                        type="button"
                        onClick={handleSaveCurrentApp}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md hover:shadow-emerald-500/25 transition-all hover:scale-[1.02] cursor-pointer"
                      >
                        <Icon icon="solar:diskette-bold" width={16} height={16} />
                        <span>Save {currentApp.title} Link</span>
                      </button>

                      {appSavedToast && appSavedToast.role === currentApp.role ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
                            <Icon icon="solar:check-circle-bold" width={16} height={16} className="text-emerald-600" />
                            <span>{currentApp.title} Link Saved!</span>
                          </span>

                          {appSavedToast.nextRole && (
                            <button
                              type="button"
                              onClick={() => handleSwitchAppRole(appSavedToast.nextRole!)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition hover:scale-105 cursor-pointer"
                            >
                              <span>Next: Switch to {appSavedToast.nextRoleTitle}</span>
                              <Icon icon="solar:arrow-right-linear" width={14} height={14} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          Click &quot;Save&quot; after pasting link to record this app.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Apple App Store Link for this App */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Icon icon="solar:round-apple-bold" width={14} height={14} />
                      <span>Apple App Store URL (Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={currentApp.appStoreUrl || ""}
                      onChange={(e) => updateActiveAppField("appStoreUrl", e.target.value)}
                      placeholder="https://apps.apple.com/app/id..."
                      className="admin-input mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 shadow-2xs focus:border-slate-800 outline-none"
                    />
                  </div>

                  {/* Web / Demo Link for this App */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Icon icon="solar:global-bold" width={14} height={14} />
                      <span>Web / Portal URL (Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={currentApp.liveLink || ""}
                      onChange={(e) => updateActiveAppField("liveLink", e.target.value)}
                      placeholder="https://portal.example.com"
                      className="admin-input mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 shadow-2xs focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                {/* Screenshots for this specific App */}
                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Icon icon="solar:gallery-wide-bold" width={15} height={15} className="text-blue-600" />
                      <span>{currentApp.title} Screenshots ({currentApp.images?.length || 0})</span>
                    </label>
                  </div>

                  <input
                    ref={appFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    className="sr-only"
                    onChange={(e) => {
                      void onPickAppFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => appFileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                    >
                      <Icon icon="solar:upload-track-2-bold" width={14} height={14} />
                      <span>Upload Screenshots for {currentApp.title}</span>
                    </button>
                  </div>

                  {/* App Screenshots Grid */}
                  {currentApp.images && currentApp.images.length > 0 ? (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                      {currentApp.images.map((imgUrl, imgIdx) => (
                        <div
                          key={imgUrl + imgIdx}
                          className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 h-36 flex items-center justify-center shadow-xs"
                        >
                          <Image src={imgUrl} alt="Screenshot" fill className="object-contain p-1" sizes="120px" />
                          <button
                            type="button"
                            onClick={() => removeAppImage(activeAppIndex, imgUrl)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 cursor-pointer shadow"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic mt-2">
                      No screenshots uploaded for this app yet. Click above to upload files.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Ecosystem App Links Status Checklist Overview */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Icon icon="solar:checklist-minimalistic-bold" width={14} height={14} />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Ecosystem App Links Status Checklist
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Verify Customer, Vendor & Delivery apps before saving the whole project.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                  {appsList.filter((a) => a.playStoreUrl).length} of {appsList.length} Links Saved
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {appsList.map((app, idx) => {
                  const hasLink = Boolean(app.playStoreUrl);
                  const isCurrent = activeAppIndex === idx;
                  const roleColor =
                    app.role === "customer"
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : app.role === "vendor"
                      ? "text-amber-700 bg-amber-50 border-amber-200"
                      : app.role === "delivery"
                      ? "text-blue-700 bg-blue-50 border-blue-200"
                      : "text-purple-700 bg-purple-50 border-purple-200";

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveAppIndex(idx);
                        setAppSavedToast(null);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20 scale-[1.02]"
                          : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase ${roleColor}`}>
                          {app.role} App
                        </span>
                        {hasLink ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Icon icon="solar:check-circle-bold" width={11} height={11} className="text-emerald-600" />
                            <span>Saved ✅</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            Link Pending
                          </span>
                        )}
                      </div>

                      <h5 className="text-xs font-bold text-slate-900 truncate mb-1">
                        {app.title}
                      </h5>

                      <p className="text-[11px] text-slate-500 font-mono truncate" title={app.playStoreUrl || "No link added yet"}>
                        {app.playStoreUrl || "Click to add Play Store link"}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">
                          {app.images?.length ? `${app.images.length} screenshots` : "0 screenshots"}
                        </span>
                        <span className="font-bold text-blue-600 flex items-center gap-0.5">
                          {isCurrent ? "Currently Editing" : "Configure ➔"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                <Icon icon="solar:info-circle-bold" width={16} height={16} className="text-blue-600 shrink-0" />
                <span>
                  <strong>Workflow Tip:</strong> Har role ke liye link add karke <em>&quot;Save Link&quot;</em> dabayein, fir sabhi apps config hone ke baad page ke sabse neeche jakar <strong>&quot;Update Project Suite&quot;</strong> par click karein.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: Master Banner & Primary Cover Image */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <Icon icon="solar:gallery-upload-bold-duotone" width={18} height={18} className="text-blue-600" />
              <span>Master Portfolio Banner & Global Gallery *</span>
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Primary banner mockup displayed on portfolio cards and header.
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
              <span>{previewMockupMode ? "Phone Frame: ON" : "Standard View"}</span>
            </button>
          </div>
        </div>

        {/* Hidden Master file input */}
        <input
          ref={masterFileInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          className="sr-only"
          onChange={(e) => {
            void onPickMasterFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {/* Upload Buttons & Drag Box */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            disabled={uploading}
            onClick={() => masterFileInputRef.current?.click()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Icon icon="solar:upload-track-2-bold" width={18} height={18} />
            <span>
              {uploading
                ? uploadProgressText || "Uploading…"
                : images.length === 0
                ? "Upload Master Images"
                : "+ Add More Master Images"}
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

        {/* Master Images Gallery */}
        {images.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">
                Uploaded Master Images ({images.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Clear master gallery images?")) {
                    setImages([]);
                    setCoverImage("");
                  }
                }}
                className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {images.map((url, idx) => {
                const isCover = coverImage === url;
                return (
                  <div
                    key={url + idx}
                    className={`group relative flex flex-col rounded-xl overflow-hidden border-2 transition-all bg-slate-950 shadow-sm ${
                      isCover ? "border-blue-600 ring-2 ring-blue-500/30" : "border-slate-200"
                    }`}
                  >
                    <div
                      className={`relative w-full overflow-hidden flex items-center justify-center bg-slate-900 ${
                        previewMockupMode ? "h-52 sm:h-60" : "h-32 sm:h-36"
                      }`}
                    >
                      <Image
                        src={url}
                        alt="Preview"
                        fill
                        className={previewMockupMode ? "object-contain p-2" : "object-cover"}
                        sizes="180px"
                      />
                      {isCover && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow">
                            ★ Master Cover
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeMasterImage(url)}
                        className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 cursor-pointer shadow"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-2 bg-slate-900 border-t border-white/10 flex items-center justify-between text-[10px]">
                      {!isCover ? (
                        <button
                          type="button"
                          onClick={() => setCoverImage(url)}
                          className="w-full py-1 rounded bg-white/10 hover:bg-blue-600 text-white font-bold transition text-center cursor-pointer"
                        >
                          Set As Main Banner
                        </button>
                      ) : (
                        <span className="w-full py-1 text-center font-extrabold text-blue-300 bg-blue-600/30 rounded border border-blue-500/30">
                          Active Banner
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: Tech Stack & Features */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
          <Icon icon="solar:code-square-bold-duotone" width={18} height={18} className="text-blue-600" />
          <span>Technology Stack & Features</span>
        </p>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Tech stack (comma-separated)
          </label>
          <input
            type="text"
            value={techStackRaw}
            onChange={(e) => setTechStackRaw(e.target.value)}
            placeholder="Flutter, Firebase, Kotlin, Node.js, WebSockets, Google Maps API"
            className="admin-input mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none"
          />

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Quick add:</span>
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
                    placeholder="Feature title (e.g. Real-Time Multi-Party WebSockets)"
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
                <span>Saving Suite…</span>
              </>
            ) : (
              <>
                <Icon icon="solar:diskette-bold" width={18} height={18} />
                <span>{projectId ? "Update Project Suite" : "Create & Publish Suite"}</span>
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
