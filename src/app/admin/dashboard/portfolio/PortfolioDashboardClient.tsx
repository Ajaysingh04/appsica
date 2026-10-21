"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Icon } from "@iconify/react";
import PortfolioForm, { type PortfolioFormInitial } from "./PortfolioForm";

export type DashboardProjectCard = {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  published: boolean;
  isDemo?: boolean;
  liveLink: string;
  order?: number;
};

export default function PortfolioDashboardClient({
  initialProjects,
}: {
  initialProjects: DashboardProjectCard[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [activeTab, setActiveTab] = useState<"live" | "demo">("live");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"new" | "edit">("new");
  const [editingId, setEditingId] = useState<string | undefined>();
  const [editingInitial, setEditingInitial] = useState<PortfolioFormInitial | undefined>();
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshProjects = useCallback(async () => {
    const res = await fetch("/api/admin/portfolio");
    if (!res.ok) return;
    const data = await res.json();
    const list = (data.projects || []).map(
      (p: {
        _id: string;
        title: string;
        slug: string;
        coverImage: string;
        published: boolean;
        isDemo?: boolean;
        liveLink: string;
        order?: number;
      }) => ({
        _id: String(p._id),
        title: p.title,
        slug: p.slug,
        coverImage: p.coverImage,
        published: p.published,
        isDemo: Boolean(p.isDemo),
        liveLink: p.liveLink || "",
        order: typeof p.order === "number" ? p.order : 0,
      })
    );
    setProjects(list);
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
        const list = data.projects.map(
          (p: {
            _id: string;
            title: string;
            slug: string;
            coverImage: string;
            published: boolean;
            isDemo?: boolean;
            liveLink?: string;
            order?: number;
          }) => ({
            _id: String(p._id),
            title: p.title,
            slug: p.slug,
            coverImage: p.coverImage,
            published: p.published,
            isDemo: Boolean(p.isDemo),
            liveLink: p.liveLink || "",
            order: typeof p.order === "number" ? p.order : 0,
          })
        );
        setProjects(list);
        setToastMessage(`Project moved to Position #${targetPosition}!`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch {
      /* ignore */
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
    const res = await fetch(`/api/admin/portfolio/${id}`);
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
      coverImage: p.coverImage,
      liveLink: p.liveLink,
      published: p.published,
      isDemo: Boolean(p.isDemo),
      order: p.order,
    });
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(undefined);
    setEditingInitial(undefined);
  }, []);

  const liveProjects = projects.filter((p) => !p.isDemo);
  const demoProjects = projects.filter((p) => p.isDemo);
  const displayedProjects = activeTab === "live" ? liveProjects : demoProjects;

  return (
    <div className="flex h-full min-h-0 flex-col text-slate-900">
      {/* Top Banner / Header */}
      <div className="shrink-0 border-b border-slate-200/80 bg-white px-6 py-6 sm:px-8 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon icon="solar:gallery-wide-bold-duotone" width={22} height={22} />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Portfolio Showcase
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Manage client case studies, live demo links, and portfolio display sequence.
            </p>
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

        {/* Tab Switcher */}
        <div className="mt-6 flex gap-3 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("live")}
            className={`group flex items-center gap-2 border-b-2 pb-3 px-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "live"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon
              icon="solar:globus-bold"
              width={18}
              height={18}
              className={activeTab === "live" ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}
            />
            <span>Live Portfolio</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                activeTab === "live"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {liveProjects.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("demo")}
            className={`group flex items-center gap-2 border-b-2 pb-3 px-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "demo"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon
              icon="solar:archive-bold"
              width={18}
              height={18}
              className={activeTab === "demo" ? "text-amber-600" : "text-slate-400 group-hover:text-slate-600"}
            />
            <span>Demo Templates (Admin)</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                activeTab === "demo"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {demoProjects.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Body Grid */}
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
                Projects marked with &quot;Demo Template&quot; are only visible to admins inside this console. Website visitors will never see them on the public showcase.
              </p>
            </div>
          </div>
        )}

        {displayedProjects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Icon icon="solar:folder-open-bold-duotone" width={32} height={32} />
            </div>
            <p className="mt-4 text-base font-bold text-slate-800">
              {activeTab === "live" ? "No live portfolio projects yet" : "No demo templates found"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Get started by creating your first showcase project.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={openNew}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 cursor-pointer transition"
              >
                + Add First Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 pb-12 sm:grid-cols-2 lg:grid-cols-3">
            {displayedProjects.map((p, idx) => (
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

                  {/* Top Left: Position Badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-lg bg-slate-900/90 px-2.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md border border-white/20">
                    <Icon icon="solar:sort-vertical-bold" width={14} height={14} className="text-sky-400" />
                    <span>#{idx + 1}</span>
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
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {p.title}
                    </h2>
                    <p className="mt-1 text-xs font-mono text-slate-400">/{p.slug}</p>
                    {p.liveLink && (
                      <p className="mt-1.5 truncate text-xs text-blue-600 font-semibold flex items-center gap-1">
                        <Icon icon="solar:link-circle-bold" width={14} height={14} />
                        <span className="truncate">{p.liveLink}</span>
                      </p>
                    )}
                  </div>

                  {/* Position Dropdown Reorder Bar */}
                  <div className="mt-5 border-t border-slate-100 pt-3.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <label className="text-xs font-bold text-slate-500 shrink-0">Rank:</label>
                      <select
                        value={idx + 1}
                        disabled={reorderingId === p._id}
                        onChange={(e) => void handlePositionChange(p._id, Number(e.target.value))}
                        className="admin-input w-full max-w-[130px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-2xs outline-none transition hover:bg-white focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 cursor-pointer disabled:opacity-50"
                      >
                        {displayedProjects.map((_, optIdx) => {
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

                    <button
                      type="button"
                      onClick={() => void openEdit(p._id)}
                      className="shrink-0 flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold px-3 py-1.5 text-xs transition-colors cursor-pointer"
                    >
                      <Icon icon="solar:pen-bold" width={12} height={12} />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Modal Dialog */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-admin-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-modal-title"
          onClick={closeModal}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 animate-admin-modal text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon
                    icon={modalMode === "new" ? "solar:add-circle-bold-duotone" : "solar:pen-new-square-bold-duotone"}
                    width={22}
                    height={22}
                  />
                </div>
                <div>
                  <h2 id="portfolio-modal-title" className="text-lg font-bold text-slate-900">
                    {modalMode === "new" ? "New Portfolio Project" : "Edit Portfolio Project"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {modalMode === "new"
                      ? "Add a new showcase item to your portfolio."
                      : "Modify project metadata, display order, and live URLs."}
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

            {/* Modal Body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-slate-200">
              <PortfolioForm
                key={editingId || "new"}
                projectId={editingId}
                initial={editingInitial}
                onClose={closeModal}
                onSaved={async () => {
                  await refreshProjects();
                  closeModal();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
