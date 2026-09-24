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
      (p: { _id: string; title: string; slug: string; coverImage: string; published: boolean; isDemo?: boolean; liveLink: string; order?: number }) => ({
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
          (p: { _id: string; title: string; slug: string; coverImage: string; published: boolean; isDemo?: boolean; liveLink?: string; order?: number }) => ({
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
        setToastMessage(`Project position updated to Position #${targetPosition}!`);
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
    <>
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Portfolio</h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage your live case studies and portfolio projects.
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
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Load Demo Projects
                </button>
              )}
              <button
                type="button"
                onClick={openNew}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                New project
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex gap-2 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab("live")}
              className={`pb-3 px-4 text-sm font-semibold transition border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === "live"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon icon="ph:globe-bold" width={18} height={18} />
              Live Website Projects
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === "live" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600"
                }`}
              >
                {liveProjects.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("demo")}
              className={`pb-3 px-4 text-sm font-semibold transition border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === "demo"
                  ? "border-amber-600 text-amber-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon icon="ph:archive-box-bold" width={18} height={18} />
              Demo Templates (Admin Only)
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === "demo" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                }`}
              >
                {demoProjects.length}
              </span>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {toastMessage && (
            <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm">
              <div className="flex items-center gap-2">
                <Icon icon="solar:check-circle-bold" className="text-emerald-600 shrink-0" width={20} height={20} />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {activeTab === "demo" && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900 flex items-start gap-3">
              <Icon icon="ph:info-bold" width={22} height={22} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Demo templates are hidden from the live website</p>
                <p className="mt-0.5 text-xs text-amber-800">
                  Projects with &quot;Demo Template&quot; enabled are only visible to admins in this dashboard. Website visitors will not see them on the public portfolio or homepage.
                </p>
              </div>
            </div>
          )}

          {displayedProjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-slate-600 font-medium">
                {activeTab === "live"
                  ? "No live projects added yet."
                  : "No demo templates found."}
              </p>
              {activeTab === "live" && (
                <div className="mt-4 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={openNew}
                    className="text-sm font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Add your first project
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-3">
              {displayedProjects.map((p, idx) => (
                <div
                  key={p._id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div
                    onClick={() => void openEdit(p._id)}
                    className="relative aspect-[16/10] bg-slate-100 cursor-pointer overflow-hidden"
                  >
                    <Image
                      src={p.coverImage}
                      alt={p.title}
                      fill
                      className="object-cover transition group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    {/* Top Left: Position Badge */}
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-slate-900/90 px-2 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-sm border border-white/20">
                      <Icon icon="solar:sort-vertical-bold" width={13} height={13} className="text-sky-400" />
                      <span>#{idx + 1}</span>
                    </div>

                    {/* Top Right: Status */}
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
                      {p.isDemo ? (
                        <span className="rounded bg-amber-500/90 px-2 py-0.5 text-xs font-bold text-white shadow-sm flex items-center gap-1">
                          <Icon icon="solar:lock-bold" width={11} height={11} />
                          Demo (Hidden)
                        </span>
                      ) : !p.published ? (
                        <span className="rounded bg-slate-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                          Draft
                        </span>
                      ) : (
                        <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                          Live
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div onClick={() => void openEdit(p._id)} className="cursor-pointer">
                      <h2 className="font-semibold text-slate-900 group-hover:text-primary transition line-clamp-1">{p.title}</h2>
                      <p className="mt-1 truncate text-xs text-slate-500">/{p.slug}</p>
                      {p.liveLink && (
                        <p className="mt-1 truncate text-xs text-primary font-medium flex items-center gap-1">
                          <Icon icon="solar:link-linear" width={13} height={13} />
                          {p.liveLink}
                        </p>
                      )}
                    </div>

                    {/* Position Dropdown Reorder Bar */}
                    <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <label className="text-xs font-bold text-slate-600 shrink-0">Position:</label>
                        <select
                          value={idx + 1}
                          disabled={reorderingId === p._id}
                          onChange={(e) => void handlePositionChange(p._id, Number(e.target.value))}
                          className="w-full max-w-[140px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm outline-none transition hover:bg-white focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary cursor-pointer disabled:opacity-50"
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
                        className="shrink-0 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 text-xs transition cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
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
          aria-labelledby="portfolio-modal-title"
          onClick={closeModal}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 id="portfolio-modal-title" className="text-lg font-bold text-slate-900">
                {modalMode === "new" ? "New Project" : "Edit Project"}
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
    </>
  );
}
