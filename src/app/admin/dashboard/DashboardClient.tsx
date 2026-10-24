"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useMemo, Suspense } from "react";
import { Icon } from "@iconify/react";
import ProjectForm, { type ProjectFormInitial } from "./projects/ProjectForm";

export type DashboardProjectCard = {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  published: boolean;
  isDemo?: boolean;
  liveLink?: string;
  category?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  apps?: any[];
  order?: number;
  techStack?: string[];
  summary?: string;
};

function DashboardInner({ initialProjects }: { initialProjects: DashboardProjectCard[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState(initialProjects);
  const [activeTab, setActiveTab] = useState<"all" | "live" | "demo">("live");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"new" | "edit">("new");
  const [editingId, setEditingId] = useState<string | undefined>();
  const [editingInitial, setEditingInitial] = useState<ProjectFormInitial | undefined>();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (!res.ok) return;
      const data = await res.json();
      const list = (data.projects || []).map((p: any) => ({
        _id: String(p._id),
        title: p.title,
        slug: p.slug,
        coverImage: p.coverImage,
        published: p.published,
        isDemo: Boolean(p.isDemo),
        liveLink: p.liveLink || "",
        category: p.category || "",
        playStoreUrl: p.playStoreUrl || "",
        appStoreUrl: p.appStoreUrl || "",
        apps: Array.isArray(p.apps) ? p.apps : [],
        order: typeof p.order === "number" ? p.order : 0,
        techStack: Array.isArray(p.techStack) ? p.techStack : [],
        summary: p.summary || "",
      }));
      setProjects(list);
    } catch {
      /* ignore */
    }
  }, []);

  const handlePositionChange = async (projectId: string, targetPosition: number) => {
    setReorderingId(projectId);
    try {
      const res = await fetch("/api/admin/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, targetPosition, isDemo: activeTab === "demo" }),
      });
      const data = await res.json();
      if (res.ok && data.projects) {
        const list = data.projects.map((p: any) => ({
          _id: String(p._id),
          title: p.title,
          slug: p.slug,
          coverImage: p.coverImage,
          published: p.published,
          isDemo: Boolean(p.isDemo),
          liveLink: p.liveLink || "",
          order: typeof p.order === "number" ? p.order : 0,
          techStack: Array.isArray(p.techStack) ? p.techStack : [],
          summary: p.summary || "",
        }));
        setProjects(list);
        setToastMessage(`Project moved to Position #${targetPosition}!`);
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        alert(data.error || "Failed to update project position.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating project position.");
    } finally {
      setReorderingId(null);
    }
  };

  const openNew = useCallback(() => {
    setModalMode("new");
    setEditingId(undefined);
    setEditingInitial(activeTab === "demo" ? { isDemo: true } : undefined);
    setModalOpen(true);
  }, [activeTab]);

  const openEdit = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      const p = data.project;
      if (!p) return;
      setModalMode("edit");
      setEditingId(id);
      setEditingInitial({
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        description: p.description,
        coverImage: p.coverImage,
        images: p.images?.length ? p.images : p.coverImage ? [p.coverImage] : [],
        features: p.features || [],
        techStack: p.techStack || [],
        category: p.category || "",
        playStoreUrl: p.playStoreUrl || "",
        appStoreUrl: p.appStoreUrl || "",
        apps: p.apps || [],
        liveLink: p.liveLink || "",
        published: p.published,
        isDemo: Boolean(p.isDemo),
        order: p.order,
      });
      setModalOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleDemoStatus = async (id: string, currentIsDemo: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDemo: !currentIsDemo }),
      });
      if (res.ok) {
        await refreshProjects();
        setToastMessage(
          !currentIsDemo
            ? "Project moved to Demo Templates (Hidden from site)"
            : "Project published to Live Portfolio Showcase!"
        );
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(undefined);
    setEditingInitial(undefined);
  }, []);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  useEffect(() => {
    const isNew = searchParams.get("new") === "1";
    const editId = searchParams.get("edit");
    if (isNew) {
      openNew();
      router.replace("/admin/dashboard", { scroll: false });
    } else if (editId) {
      void openEdit(editId);
      router.replace("/admin/dashboard", { scroll: false });
    }
  }, [searchParams, router, openNew, openEdit]);

  const liveProjects = useMemo(() => projects.filter((p) => !p.isDemo), [projects]);
  const demoProjects = useMemo(() => projects.filter((p) => p.isDemo), [projects]);

  const filteredProjects = useMemo(() => {
    let base =
      activeTab === "all"
        ? projects
        : activeTab === "live"
        ? liveProjects
        : demoProjects;

    if (!searchQuery.trim()) return base;

    const q = searchQuery.toLowerCase().trim();
    return base.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.techStack?.some((t) => t.toLowerCase().includes(q))
    );
  }, [projects, activeTab, liveProjects, demoProjects, searchQuery]);

  return (
    <div className="flex h-full min-h-0 flex-col text-slate-900">
      {/* Top Header / Stats Section */}
      <div className="shrink-0 border-b border-slate-200/80 bg-white px-6 py-6 sm:px-8 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
                <Icon icon="solar:folder-with-files-bold-duotone" width={24} height={24} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Projects & Portfolio
                </h1>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                  Manage live case studies, client showcase projects, and reference demo templates.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {projects.length === 0 && (
              <button
                type="button"
                onClick={async () => {
                  if (!confirm("Load sample demo projects into the database?")) return;
                  try {
                    const res = await fetch("/api/admin/portfolio/seed", { method: "POST" });
                    if (res.ok) await refreshProjects();
                    else alert("Failed to seed projects. Check MongoDB connection.");
                  } catch {
                    alert("Error seeding projects.");
                  }
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
              >
                Load Sample Projects
              </button>
            )}

            <button
              type="button"
              onClick={openNew}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all duration-150 hover:from-blue-700 hover:to-indigo-700 active:scale-95 cursor-pointer"
            >
              <Icon icon="solar:add-circle-bold" width={18} height={18} />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Filters, Search & View Switcher Bar */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100 pt-4">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("live")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "live"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
              }`}
            >
              <Icon icon="solar:globus-bold" width={16} height={16} />
              <span>Live Showcase</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  activeTab === "live" ? "bg-white/20 text-white" : "bg-white text-slate-700"
                }`}
              >
                {liveProjects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("demo")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "demo"
                  ? "bg-amber-600 text-white shadow-sm shadow-amber-500/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
              }`}
            >
              <Icon icon="solar:archive-bold" width={16} height={16} />
              <span>Demo Mockups (Admin)</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  activeTab === "demo" ? "bg-white/20 text-white" : "bg-white text-slate-700"
                }`}
              >
                {demoProjects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
              }`}
            >
              <span>All Projects</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  activeTab === "all" ? "bg-white/20 text-white" : "bg-white text-slate-700"
                }`}
              >
                {projects.length}
              </span>
            </button>
          </div>

          {/* Search & View Mode Switcher */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 md:w-72">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Icon icon="solar:magnifer-linear" width={16} height={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, slug, stack..."
                className="admin-input w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs font-medium text-slate-900 placeholder:text-slate-400 transition hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <Icon icon="ph:x-bold" width={14} height={14} />
                </button>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon icon="solar:widget-5-bold" width={17} height={17} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Table List View"
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon icon="solar:list-bold" width={17} height={17} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
        {toastMessage && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-semibold text-emerald-900 shadow-md animate-admin-slide">
            <div className="flex items-center gap-2.5">
              <Icon icon="solar:check-circle-bold" className="text-emerald-600 shrink-0" width={22} height={22} />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer p-1"
            >
              ✕
            </button>
          </div>
        )}

        {activeTab === "demo" && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200/90 bg-amber-50/80 p-4 text-xs sm:text-sm text-amber-900 shadow-2xs">
            <Icon icon="solar:info-circle-bold" width={22} height={22} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Demo templates are hidden from the live website</p>
              <p className="mt-0.5 text-xs text-amber-800">
                These mockups are kept here for design and sales references. Visitors will <strong>never</strong> see them on the public showcase. Click <strong>&quot;Publish Live&quot;</strong> to make any template visible on the public website.
              </p>
            </div>
          </div>
        )}

        {filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Icon icon="solar:folder-open-bold-duotone" width={32} height={32} />
            </div>
            <p className="mt-4 text-base font-bold text-slate-800">
              {searchQuery ? `No projects matching "${searchQuery}"` : "No projects found in this tab"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {searchQuery
                ? "Try searching for a different keyword or clear the search filter."
                : "Add a new project or switch between tabs above."}
            </p>
            <div className="mt-5 flex justify-center gap-3">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Clear Search
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openNew}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 cursor-pointer transition"
                >
                  + Add New Project
                </button>
              )}
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid gap-5 pb-12 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((p, idx) => (
              <div
                key={p._id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl"
              >
                {/* Image Container */}
                <div
                  onClick={() => void openEdit(p._id)}
                  className="relative aspect-[16/10] bg-slate-100 cursor-pointer overflow-hidden"
                >
                  <Image
                    src={p.coverImage}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

                  {/* Top Left: Position Badge & Category */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                    <div className="flex items-center gap-1 rounded-lg bg-slate-900/90 px-2 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md border border-white/20">
                      <Icon icon="solar:sort-vertical-bold" width={13} height={13} className="text-sky-400" />
                      <span>#{idx + 1}</span>
                    </div>
                    {p.apps && p.apps.length > 1 ? (
                      <span className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-2 py-1 text-[10px] font-extrabold text-white shadow-md backdrop-blur-md flex items-center gap-1">
                        <Icon icon="solar:box-minimalistic-bold" width={11} height={11} />
                        <span>{p.apps.length} Apps Suite</span>
                      </span>
                    ) : p.category === "mobile" ? (
                      <span className="rounded-lg bg-blue-600/90 px-2 py-1 text-[10px] font-extrabold text-white shadow-md backdrop-blur-md flex items-center gap-1">
                        <Icon icon="solar:smartphone-bold" width={11} height={11} />
                        <span>Mobile App</span>
                      </span>
                    ) : null}
                  </div>

                  {/* Top Right: Status Badge */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                    {p.isDemo ? (
                      <span className="rounded-lg bg-amber-500/95 px-2.5 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-md flex items-center gap-1">
                        <Icon icon="solar:lock-bold" width={12} height={12} />
                        Demo
                      </span>
                    ) : !p.published ? (
                      <span className="rounded-lg bg-slate-700/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-md">
                        Draft
                      </span>
                    ) : (
                      <span className="rounded-lg bg-emerald-600/95 px-2.5 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-md flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div onClick={() => void openEdit(p._id)} className="cursor-pointer">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {p.title}
                      </h2>
                    </div>
                    <p className="mt-0.5 text-xs font-mono text-slate-400">/{p.slug}</p>

                    {/* Links Row */}
                    {p.apps && p.apps.length > 1 ? (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {p.apps.map((app: any, aIdx: number) => (
                          app.playStoreUrl ? (
                            <a
                              key={aIdx}
                              href={app.playStoreUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold hover:bg-emerald-100 transition shadow-2xs"
                              title={`${app.title || "App"}: Open on Google Play`}
                            >
                              <Icon icon="solar:play-bold" width={10} height={10} className="text-emerald-600" />
                              <span className="capitalize">{app.role ? `${app.role} App` : app.title}</span>
                              <Icon icon="solar:arrow-right-up-linear" width={9} height={9} />
                            </a>
                          ) : (
                            <span key={aIdx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold capitalize">
                              {app.role || app.title}
                            </span>
                          )
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {p.playStoreUrl && (
                          <a
                            href={p.playStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition shadow-2xs"
                          >
                            <Icon icon="solar:play-bold" width={12} height={12} className="text-emerald-600" />
                            <span>Google Play</span>
                            <Icon icon="solar:arrow-right-up-linear" width={10} height={10} />
                          </a>
                        )}
                        {p.liveLink && (
                          <a
                            href={p.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 truncate text-xs text-blue-600 font-semibold hover:underline"
                          >
                            <Icon icon="solar:link-circle-bold" width={13} height={13} />
                            <span className="truncate max-w-[120px]">{p.liveLink}</span>
                            <Icon icon="solar:arrow-right-up-linear" width={10} height={10} />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Tech Stack Tags Preview */}
                    {p.techStack && p.techStack.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {p.techStack.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                          >
                            {t}
                          </span>
                        ))}
                        {p.techStack.length > 3 && (
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                            +{p.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions & Position Bar */}
                  <div className="mt-5 border-t border-slate-100 pt-3.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <label className="text-xs font-bold text-slate-500 shrink-0">Rank:</label>
                      <select
                        value={idx + 1}
                        disabled={reorderingId === p._id}
                        onChange={(e) => void handlePositionChange(p._id, Number(e.target.value))}
                        className="admin-input w-full max-w-[125px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-2xs outline-none transition hover:bg-white focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 cursor-pointer disabled:opacity-50"
                      >
                        {filteredProjects.map((_, optIdx) => {
                          const pos = optIdx + 1;
                          const label =
                            pos === 1
                              ? "1st (Top)"
                              : pos === 2
                              ? "2nd"
                              : pos === 3
                              ? "3rd"
                              : `${pos}th`;
                          return (
                            <option key={pos} value={pos}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        disabled={actionLoading === p._id}
                        onClick={(e) => void toggleDemoStatus(p._id, Boolean(p.isDemo), e)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer disabled:opacity-50 ${
                          p.isDemo
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                        }`}
                        title={p.isDemo ? "Publish to Live Website" : "Move to Demo Templates"}
                      >
                        {actionLoading === p._id
                          ? "…"
                          : p.isDemo
                          ? "Publish"
                          : "Demo"}
                      </button>

                      <button
                        type="button"
                        onClick={() => void openEdit(p._id)}
                        className="flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold px-3 py-1 text-xs transition-colors cursor-pointer"
                      >
                        <Icon icon="solar:pen-bold" width={12} height={12} />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table List View */
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs pb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3">Project</th>
                    <th className="px-3 py-3.5">Slug & Live URL</th>
                    <th className="px-3 py-3.5">Rank Position</th>
                    <th className="px-3 py-3.5">Visibility Status</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProjects.map((p, idx) => (
                    <tr
                      key={p._id}
                      className="group transition-colors hover:bg-slate-50/60 cursor-pointer"
                      onClick={() => void openEdit(p._id)}
                    >
                      <td className="py-3.5 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                            <Image
                              src={p.coverImage}
                              alt={p.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                              {p.title}
                            </p>
                            {p.techStack && p.techStack.length > 0 && (
                              <p className="text-[11px] text-slate-400">
                                {p.techStack.slice(0, 3).join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3.5">
                        <span className="font-mono text-slate-500">/{p.slug}</span>
                        {p.apps && p.apps.length > 1 ? (
                          <div className="mt-1 flex flex-wrap gap-1">
                            <span className="inline-flex items-center gap-1 rounded bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                              <Icon icon="solar:box-minimalistic-bold" width={10} height={10} />
                              {p.apps.length} Apps Suite
                            </span>
                          </div>
                        ) : p.playStoreUrl ? (
                          <div className="mt-0.5">
                            <a
                              href={p.playStoreUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline"
                            >
                              <Icon icon="solar:play-bold" width={11} height={11} />
                              <span className="truncate max-w-[150px]">Google Play</span>
                            </a>
                          </div>
                        ) : null}
                        {p.liveLink && (
                          <div>
                            <a
                              href={p.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
                            >
                              <Icon icon="solar:link-circle-bold" width={12} height={12} />
                              <span className="truncate max-w-[150px]">{p.liveLink}</span>
                            </a>
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={idx + 1}
                          disabled={reorderingId === p._id}
                          onChange={(e) => void handlePositionChange(p._id, Number(e.target.value))}
                          className="admin-input rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 shadow-2xs outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                        >
                          {filteredProjects.map((_, optIdx) => (
                            <option key={optIdx + 1} value={optIdx + 1}>
                              #{optIdx + 1}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-3 py-3.5">
                        {p.isDemo ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200">
                            <Icon icon="solar:lock-bold" width={12} height={12} />
                            Demo Mockup
                          </span>
                        ) : !p.published ? (
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 border border-slate-200">
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live on Site
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 pl-3 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={actionLoading === p._id}
                            onClick={(e) => void toggleDemoStatus(p._id, Boolean(p.isDemo), e)}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            {p.isDemo ? "Make Live" : "Make Demo"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void openEdit(p._id)}
                            className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-100 cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modern Modal Dialog */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-admin-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onClick={closeModal}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 animate-admin-modal text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon
                    icon={modalMode === "new" ? "solar:add-circle-bold-duotone" : "solar:pen-new-square-bold-duotone"}
                    width={22}
                    height={22}
                  />
                </div>
                <div>
                  <h2 id="project-modal-title" className="text-lg font-bold text-slate-900">
                    {modalMode === "new" ? "New Project & Showcase" : "Edit Project & Showcase"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {modalMode === "new"
                      ? "Create and publish a new client case study or demo project."
                      : "Update project metadata, gallery images, tech stack, and URLs."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                aria-label="Close"
              >
                <Icon icon="ph:x-bold" width={20} height={20} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-slate-200">
              <ProjectForm
                key={editingId || "new"}
                projectId={editingId}
                initial={editingInitial}
                onClose={closeModal}
                onSaved={async () => {
                  await refreshProjects();
                  closeModal();
                  router.refresh();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardClient({
  initialProjects,
}: {
  initialProjects: DashboardProjectCard[];
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center p-8 text-sm text-slate-500">
          <Icon icon="eos-icons:loading" width={28} height={28} className="animate-spin text-blue-600" />
        </div>
      }
    >
      <DashboardInner initialProjects={initialProjects} />
    </Suspense>
  );
}
