"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, Suspense } from "react";
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
  order?: number;
};

function DashboardInner({ initialProjects }: { initialProjects: DashboardProjectCard[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState(initialProjects);
  const [activeTab, setActiveTab] = useState<"live" | "demo">("live");
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
      const list = (data.projects || []).map((p: {
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
        }));
        setProjects(list);
        setToastMessage(`Project position updated to Position #${targetPosition}!`);
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
    setEditingInitial(undefined);
    setModalOpen(true);
  }, []);

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

  const liveProjects = projects.filter((p) => !p.isDemo);
  const demoProjects = projects.filter((p) => p.isDemo);
  const displayedProjects = activeTab === "live" ? liveProjects : demoProjects;

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        {/* Header */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Project Management</h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage your real website projects and reference demo templates.
              </p>
            </div>
            <button
              type="button"
              onClick={openNew}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
            >
              <Icon icon="ph:plus-bold" width={16} height={16} />
              Add New Project
            </button>
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
              Demo / Sample Templates (Admin Only)
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

        {/* Content Area */}
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
                  These 10 sample templates are kept here for your design reference. Website visitors will <strong>never</strong> see them on the home slider or portfolio page. If you want to use any demo template on your live site, click <strong>"Publish to Live Site"</strong>.
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
                <button
                  type="button"
                  onClick={openNew}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Icon icon="ph:plus-bold" width={16} height={16} />
                  Create your first live project
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 pb-8 sm:grid-cols-2 lg:grid-cols-3">
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

                    <div className="absolute top-2 right-2 z-10 flex flex-wrap gap-1.5">
                      {p.isDemo ? (
                        <span className="rounded bg-amber-600 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                          Demo Template
                        </span>
                      ) : (
                        <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                          Live On Site
                        </span>
                      )}
                      {!p.published && (
                        <span className="rounded bg-slate-600 px-2 py-0.5 text-xs font-semibold text-white">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div onClick={() => void openEdit(p._id)} className="cursor-pointer">
                      <h2 className="font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition">{p.title}</h2>
                      <p className="mt-1 truncate text-xs text-slate-500">/{p.slug}</p>
                      {p.liveLink && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-primary truncate font-medium">
                          <Icon icon="ph:arrow-square-out-bold" width={14} height={14} />
                          {p.liveLink}
                        </p>
                      )}
                    </div>

                    {/* Order Dropdown Controls & Action Button */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 gap-2">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
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

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={actionLoading === p._id}
                          onClick={(e) => toggleDemoStatus(p._id, Boolean(p.isDemo), e)}
                          className={`rounded-lg px-2 py-1 text-xs font-bold transition cursor-pointer ${
                            p.isDemo
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                          }`}
                        >
                          {actionLoading === p._id
                            ? "…"
                            : p.isDemo
                            ? "🚀 Publish"
                            : "Demo"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void openEdit(p._id)}
                          className="rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2 py-1 text-xs transition cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
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
          aria-labelledby="project-modal-title"
          onClick={closeModal}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 id="project-modal-title" className="text-lg font-bold text-slate-900">
                {modalMode === "new" ? "New project" : "Edit project"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                aria-label="Close"
              >
                <Icon icon="ph:x-bold" width={22} height={22} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
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
    </>
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
          Loading…
        </div>
      }
    >
      <DashboardInner initialProjects={initialProjects} />
    </Suspense>
  );
}

