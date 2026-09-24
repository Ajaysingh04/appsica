"use client";

import { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import TechForm, { type TechCategoryFormInitial } from "./TechForm";

interface ITechItem {
  name: string;
  icon: string;
}

interface ITechCategoryItem {
  _id: string;
  category: string;
  items: ITechItem[];
  order?: number;
  published?: boolean;
}

export default function AdminTechnologiesPage() {
  const [categories, setCategories] = useState<ITechCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"new" | "edit">("new");
  const [editingId, setEditingId] = useState<string | undefined>();
  const [editingInitial, setEditingInitial] = useState<TechCategoryFormInitial | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const fetchTechnologies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/technologies");
      if (!res.ok) return;
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to load technologies:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  const openNew = () => {
    setModalMode("new");
    setEditingId(undefined);
    setEditingInitial(undefined);
    setModalOpen(true);
  };

  const openEdit = (cat: ITechCategoryItem) => {
    setModalMode("edit");
    setEditingId(cat._id);
    setEditingInitial({
      category: cat.category,
      items: cat.items || [],
      order: cat.order,
      published: cat.published !== false,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(undefined);
    setEditingInitial(undefined);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete category "${title}"?`)) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/technologies/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSeedDefaults = async () => {
    if (
      !confirm(
        "This will restore/update default technology categories (Frontend, Backend, Mobile, Databases, Cloud, etc.) into your database. Continue?"
      )
    )
      return;
    try {
      setSeeding(true);
      const res = await fetch("/api/admin/technologies/seed", { method: "POST" });
      if (res.ok) {
        await fetchTechnologies();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Technologies Management</h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage tech stacks, frameworks, and programming tools shown on the website.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={seeding}
              onClick={handleSeedDefaults}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Icon icon="solar:database-bold" width={16} height={16} className="text-primary" />
              {seeding ? "Importing…" : "Restore Default Tech Stacks"}
            </button>
            <button
              type="button"
              onClick={openNew}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
            >
              <Icon icon="solar:add-circle-bold" width={18} height={18} />
              Add Tech Category
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-slate-500">
            <Icon icon="eos-icons:loading" width={32} height={32} className="animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Icon icon="material-symbols:code-blocks-outline" width={48} height={48} className="mx-auto text-slate-400 mb-3" />
            <p className="text-base font-bold text-slate-800">No Technologies Found</p>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Create your tech categories or import standard tools (React, Node, Python, Mobile, Cloud, Databases).
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={openNew}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
              >
                + Add Tech Category
              </button>
              <button
                type="button"
                onClick={handleSeedDefaults}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Restore Defaults
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 pb-12 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3 border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">{cat.category}</h3>
                    {cat.published !== false ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                        Draft
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mb-3 font-medium">
                    {cat.items?.length || 0} Tools / Frameworks:
                  </p>

                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {(cat.items || []).map((tool, tIdx) => (
                      <div
                        key={tIdx}
                        className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 p-2 text-xs font-medium text-slate-800"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                          <Icon icon={tool.icon || "logos:react"} width={18} height={18} />
                        </div>
                        <span className="truncate">{tool.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-400 font-medium">Order: {cat.order ?? 0}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(cat)}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === cat._id}
                      onClick={() => handleDelete(cat._id, cat.category)}
                      className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                    >
                      {deletingId === cat._id ? "…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">
                {modalMode === "new" ? "Add Tech Category" : "Edit Tech Category"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
              >
                <Icon icon="ph:x-bold" width={20} height={20} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">
              <TechForm
                key={editingId || "new"}
                categoryId={editingId}
                initial={editingInitial}
                onClose={closeModal}
                onSaved={async () => {
                  await fetchTechnologies();
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
