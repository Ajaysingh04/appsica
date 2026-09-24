"use client";

import { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import ServiceForm, { type ServiceFormInitial } from "./ServiceForm";

interface IServiceItem {
  _id: string;
  title: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  detail?: string;
  features?: Array<{ title: string; description?: string }>;
  demoLinks?: Array<{ name: string; url: string }>;
  order?: number;
  published?: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<IServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"new" | "edit">("new");
  const [editingId, setEditingId] = useState<string | undefined>();
  const [editingInitial, setEditingInitial] = useState<ServiceFormInitial | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      if (!res.ok) return;
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openNew = () => {
    setModalMode("new");
    setEditingId(undefined);
    setEditingInitial(undefined);
    setModalOpen(true);
  };

  const openEdit = (service: IServiceItem) => {
    setModalMode("edit");
    setEditingId(service._id);
    setEditingInitial({
      title: service.title,
      slug: service.slug,
      icon: service.icon,
      image: service.image,
      description: service.description,
      detail: service.detail,
      features: (service.features || []).map((f) => ({
        title: f.title,
        description: f.description || "",
      })),
      demoLinks: service.demoLinks || [],
      order: service.order,
      published: service.published !== false,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(undefined);
    setEditingInitial(undefined);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s._id !== id));
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
        "This will import/update all default services into your database so you can easily edit them. Continue?"
      )
    )
      return;
    try {
      setSeeding(true);
      const res = await fetch("/api/admin/services/seed", { method: "POST" });
      if (res.ok) {
        await fetchServices();
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
            <h1 className="text-2xl font-bold text-slate-900">Services Management</h1>
            <p className="mt-1 text-sm text-slate-600">
              Add, edit, or customize company services, detail pages, and features.
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
              {seeding ? "Importing…" : "Import Default Services"}
            </button>
            <button
              type="button"
              onClick={openNew}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
            >
              <Icon icon="solar:add-circle-bold" width={18} height={18} />
              Add New Service
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
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Icon icon="solar:code-linear" width={48} height={48} className="mx-auto text-slate-400 mb-3" />
            <p className="text-base font-bold text-slate-800">No Services Found</p>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              You haven't added any services yet. You can create a new service from scratch or import default templates.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={openNew}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                + Create Service
              </button>
              <button
                type="button"
                onClick={handleSeedDefaults}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Import Defaults
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 pb-12 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary border border-blue-100">
                      <Icon icon={item.icon || "solar:code-linear"} width={26} height={26} />
                    </div>
                    <div>
                      {item.published !== false ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-primary font-medium mt-0.5">/services/{item.slug}</p>
                  
                  <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description || "No description provided."}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-medium">
                      {item.features?.length || 0} Features
                    </span>
                    {item.demoLinks && item.demoLinks.length > 0 && (
                      <span className="rounded bg-indigo-50 text-indigo-700 px-2 py-0.5 font-medium">
                        {item.demoLinks.length} Demos
                      </span>
                    )}
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-medium">
                      Order: {item.order ?? 0}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <a
                    href={`/services/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-500 hover:text-primary flex items-center gap-1"
                  >
                    <span>View Page</span>
                    <Icon icon="solar:arrow-right-up-linear" width={14} height={14} />
                  </a>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === item._id}
                      onClick={() => handleDelete(item._id, item.title)}
                      className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                    >
                      {deletingId === item._id ? "…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
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
                {modalMode === "new" ? "Add New Service" : "Edit Service"}
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
              <ServiceForm
                key={editingId || "new"}
                serviceId={editingId}
                initial={editingInitial}
                onClose={closeModal}
                onSaved={async () => {
                  await fetchServices();
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
