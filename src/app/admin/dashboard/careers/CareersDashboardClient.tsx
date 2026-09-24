"use client";

import { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { IJobRole, IJobApplication } from "@/types/job";

interface RoleFormData {
  title: string;
  department: string;
  category: "engineering" | "cloud" | "design" | "ai" | "other";
  location: string;
  experience: string;
  type: string;
  description: string;
  skills: string;
  responsibilities: string;
  linkedinUrl: string;
  isActive: boolean;
  order: number;
}

const emptyFormData: RoleFormData = {
  title: "",
  department: "Software Engineering",
  category: "engineering",
  location: "Indore HQ / Hybrid",
  experience: "2 - 5 Years",
  type: "Full-Time",
  description: "",
  skills: "",
  responsibilities: "",
  linkedinUrl: "",
  isActive: true,
  order: 0,
};

export default function CareersDashboardClient() {
  const [activeTab, setActiveTab] = useState<"roles" | "applications">("roles");

  // Job Roles state
  const [roles, setRoles] = useState<IJobRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"new" | "edit">("new");
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [formData, setFormData] = useState<RoleFormData>(emptyFormData);
  const [savingRole, setSavingRole] = useState(false);
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);
  const [togglingRoleId, setTogglingRoleId] = useState<string | null>(null);
  const [seedingRoles, setSeedingRoles] = useState(false);

  // Applications state
  const [applications, setApplications] = useState<IJobApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appStatusFilter, setAppStatusFilter] = useState<string>("all");
  const [deletingAppId, setDeletingAppId] = useState<string | null>(null);
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Notification / Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Roles
  const fetchRoles = useCallback(async () => {
    try {
      setLoadingRoles(true);
      const res = await fetch("/api/admin/careers/roles");
      if (!res.ok) throw new Error("Failed to load roles");
      const data = await res.json();
      setRoles(data.roles || []);
    } catch (err) {
      console.error(err);
      showToast("Unable to load job roles.", "error");
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  // Fetch Applications
  const fetchApplications = useCallback(async () => {
    try {
      setLoadingApps(true);
      const res = await fetch("/api/admin/careers/applications");
      if (!res.ok) throw new Error("Failed to load applications");
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      console.error(err);
      showToast("Unable to load applications.", "error");
    } finally {
      setLoadingApps(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchApplications();
  }, [fetchRoles, fetchApplications]);

  // Open modal for new role
  const handleOpenNew = () => {
    setModalMode("new");
    setEditingRoleId(null);
    setFormData({
      ...emptyFormData,
      order: roles.length + 1,
    });
    setModalOpen(true);
  };

  // Open modal for editing role
  const handleOpenEdit = (role: IJobRole) => {
    setModalMode("edit");
    setEditingRoleId(role._id || role.id || null);
    setFormData({
      title: role.title,
      department: role.department,
      category: role.category,
      location: role.location,
      experience: role.experience,
      type: role.type,
      description: role.description || "",
      skills: Array.isArray(role.skills) ? role.skills.join(", ") : "",
      responsibilities: Array.isArray(role.responsibilities)
        ? role.responsibilities.join("\n")
        : "",
      linkedinUrl: role.linkedinUrl || "",
      isActive: role.isActive !== false,
      order: role.order || 0,
    });
    setModalOpen(true);
  };

  // Save role (Create or Update)
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast("Role title is required.", "error");
      return;
    }

    try {
      setSavingRole(true);
      const payload = {
        title: formData.title.trim(),
        department: formData.department.trim(),
        category: formData.category,
        location: formData.location.trim(),
        experience: formData.experience.trim(),
        type: formData.type.trim(),
        description: formData.description.trim(),
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        responsibilities: formData.responsibilities
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean),
        linkedinUrl: formData.linkedinUrl.trim(),
        isActive: formData.isActive,
        order: Number(formData.order) || 0,
      };

      const url =
        modalMode === "edit" && editingRoleId
          ? `/api/admin/careers/roles/${editingRoleId}`
          : "/api/admin/careers/roles";
      const method = modalMode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save role.");
      }

      showToast(
        modalMode === "edit"
          ? `Role "${formData.title}" updated successfully.`
          : `New role "${formData.title}" created successfully.`
      );
      setModalOpen(false);
      fetchRoles();
    } catch (err: unknown) {
      showToast((err as Error).message || "Error saving role.", "error");
    } finally {
      setSavingRole(false);
    }
  };

  // Quick Toggle Active/Inactive
  const handleToggleActive = async (role: IJobRole) => {
    const roleId = role._id || role.id;
    if (!roleId) return;
    const newStatus = !role.isActive;

    try {
      setTogglingRoleId(roleId);
      const res = await fetch(`/api/admin/careers/roles/${roleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to toggle status");
      }

      setRoles((prev) =>
        prev.map((r) => ((r._id || r.id) === roleId ? { ...r, isActive: newStatus } : r))
      );
      showToast(
        `Role is now ${newStatus ? "ACTIVE (Hiring Open)" : "INACTIVE (Hiring Paused)"}.`
      );
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to toggle status.", "error");
    } finally {
      setTogglingRoleId(null);
    }
  };

  // Delete role
  const handleDeleteRole = async (role: IJobRole) => {
    const roleId = role._id || role.id;
    if (!roleId) return;
    if (!confirm(`Are you sure you want to delete "${role.title}"?`)) return;

    try {
      setDeletingRoleId(roleId);
      const res = await fetch(`/api/admin/careers/roles/${roleId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete role");

      setRoles((prev) => prev.filter((r) => (r._id || r.id) !== roleId));
      showToast(`Deleted "${role.title}".`);
    } catch (err: unknown) {
      showToast((err as Error).message || "Error deleting role.", "error");
    } finally {
      setDeletingRoleId(null);
    }
  };

  // Seed Default Roles
  const handleSeedDefaults = async () => {
    if (
      roles.length > 0 &&
      !confirm("Default roles will be populated if not already present. Continue?")
    ) {
      return;
    }

    try {
      setSeedingRoles(true);
      const res = await fetch("/api/admin/careers/roles/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to seed defaults");

      showToast(data.message || "Default roles seeded successfully!");
      fetchRoles();
    } catch (err: unknown) {
      showToast((err as Error).message || "Error seeding default roles.", "error");
    } finally {
      setSeedingRoles(false);
    }
  };

  // Update Application Status
  const handleUpdateAppStatus = async (appId: string, newStatus: string) => {
    try {
      setUpdatingAppId(appId);
      const res = await fetch(`/api/admin/careers/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update status");

      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus as any } : a))
      );
      showToast(`Candidate status changed to "${newStatus.toUpperCase()}".`);
    } catch (err: unknown) {
      showToast((err as Error).message || "Error updating candidate status.", "error");
    } finally {
      setUpdatingAppId(null);
    }
  };

  // Delete Application
  const handleDeleteApp = async (appId: string, candidateName: string) => {
    if (!confirm(`Delete application for candidate "${candidateName}"?`)) return;

    try {
      setDeletingAppId(appId);
      const res = await fetch(`/api/admin/careers/applications?id=${appId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete application");

      setApplications((prev) => prev.filter((a) => a._id !== appId));
      showToast(`Deleted application for "${candidateName}".`);
    } catch (err: unknown) {
      showToast((err as Error).message || "Error deleting application.", "error");
    } finally {
      setDeletingAppId(null);
    }
  };

  // Stats
  const totalRoles = roles.length;
  const activeRoles = roles.filter((r) => r.isActive !== false).length;
  const inactiveRoles = totalRoles - activeRoles;
  const totalApps = applications.length;
  const newApps = applications.filter((a) => a.status === "new").length;

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesStatus =
      appStatusFilter === "all" || app.status === appStatusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      app.name?.toLowerCase().includes(term) ||
      app.email?.toLowerCase().includes(term) ||
      app.role?.toLowerCase().includes(term) ||
      app.skills?.toLowerCase().includes(term) ||
      app.message?.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          <Icon
            icon={
              toast.type === "success"
                ? "solar:check-circle-bold"
                : "solar:danger-triangle-bold"
            }
            className="text-lg"
          />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-4 sm:px-8 sm:py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Careers & Hiring Management</h1>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                Live Portal Control
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Manage open positions, toggle active/inactive hiring status, attach LinkedIn hiring post links, and review candidate applications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {activeTab === "roles" && (
              <>
                <button
                  type="button"
                  onClick={handleSeedDefaults}
                  disabled={seedingRoles}
                  className="flex-1 sm:flex-none justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Populate initial default job openings"
                >
                  <Icon
                    icon={seedingRoles ? "solar:spinner-linear" : "solar:magic-stick-3-bold"}
                    className={seedingRoles ? "animate-spin text-sm" : "text-sm text-indigo-600"}
                  />
                  <span>{seedingRoles ? "Seeding..." : "Seed Defaults"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenNew}
                  className="flex-1 sm:flex-none justify-center rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Icon icon="solar:add-circle-bold" className="text-base" />
                  <span>Add Job Role</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                fetchRoles();
                fetchApplications();
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Icon icon="solar:restart-bold" className="text-sm" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-4 sm:mt-5 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg sm:text-xl shrink-0">
              <Icon icon="solar:briefcase-bold" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">Total Positions</p>
              <p className="text-base sm:text-lg font-bold text-slate-900">{totalRoles}</p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg sm:text-xl shrink-0">
              <Icon icon="solar:check-circle-bold" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-medium text-emerald-700 truncate">Active (Open)</p>
              <p className="text-base sm:text-lg font-bold text-emerald-900">{activeRoles}</p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-lg sm:text-xl shrink-0">
              <Icon icon="solar:pause-circle-bold" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-medium text-amber-700 truncate">Inactive / Paused</p>
              <p className="text-base sm:text-lg font-bold text-amber-900">{inactiveRoles}</p>
            </div>
          </div>

          <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-lg sm:text-xl shrink-0">
              <Icon icon="solar:users-group-rounded-bold" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-medium text-purple-700 truncate">Applications</p>
              <p className="text-base sm:text-lg font-bold text-purple-900 truncate">
                {totalApps}{" "}
                {newApps > 0 && (
                  <span className="text-[11px] sm:text-xs font-semibold text-purple-600">
                    ({newApps} new)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-4 sm:mt-5 flex border-b border-slate-200 gap-4 sm:gap-6 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("roles")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "roles"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon icon="solar:document-bold" className="text-base" />
            <span>Open Job Roles ({roles.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("applications")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "applications"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon icon="solar:user-id-bold" className="text-base" />
            <span>Candidate Applications ({applications.length})</span>
            {newApps > 0 && (
              <span className="rounded-full bg-purple-600 text-white text-[10px] px-2 py-0.5 font-bold">
                {newApps}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6">
        {/* ================= TAB 1: JOB ROLES ================= */}
        {activeTab === "roles" && (
          <div>
            {loadingRoles ? (
              <div className="flex h-48 items-center justify-center text-slate-500">
                <Icon icon="eos-icons:loading" width={32} height={32} className="animate-spin" />
              </div>
            ) : roles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Icon
                  icon="solar:case-round-minimalistic-linear"
                  width={48}
                  height={48}
                  className="mx-auto text-slate-400 mb-3"
                />
                <h3 className="text-base font-bold text-slate-800">No Job Openings Created Yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Get started by adding your first position or click &quot;Seed Default Roles&quot; to populate standard engineering, cloud, AI, and design openings.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleSeedDefaults}
                    disabled={seedingRoles}
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Icon icon="solar:magic-stick-3-bold" />
                    <span>Seed Default Roles</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenNew}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Icon icon="solar:add-circle-bold" />
                    <span>Create Custom Role</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pb-12">
                {roles.map((role) => {
                  const roleId = role._id || role.id || "";
                  const isToggling = togglingRoleId === roleId;
                  const isDeleting = deletingRoleId === roleId;

                  return (
                    <div
                      key={roleId}
                      className={`rounded-2xl border bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md ${
                        role.isActive !== false
                          ? "border-slate-200"
                          : "border-slate-200 bg-slate-50/60 opacity-80"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Tags row */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {/* Active / Inactive Badge with Direct Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleActive(role)}
                              disabled={isToggling}
                              className={`rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                                role.isActive !== false
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                              }`}
                              title="Click to toggle Active / Inactive"
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  role.isActive !== false ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                                }`}
                              />
                              <span>
                                {isToggling
                                  ? "Updating..."
                                  : role.isActive !== false
                                  ? "Active (Hiring Open)"
                                  : "Inactive (Hiring Paused)"}
                              </span>
                              <Icon icon="solar:sort-vertical-linear" className="text-xs opacity-60" />
                            </button>

                            {/* Department */}
                            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-100">
                              {role.department}
                            </span>

                            {/* Location */}
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 flex items-center gap-1">
                              <Icon icon="solar:map-point-linear" />
                              {role.location}
                            </span>

                            {/* Experience */}
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 flex items-center gap-1">
                              <Icon icon="solar:briefcase-linear" />
                              {role.experience}
                            </span>

                            {/* Job Type */}
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                              {role.type}
                            </span>
                          </div>

                          {/* Role Title */}
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span>{role.title}</span>
                          </h3>

                          {/* Description */}
                          {role.description && (
                            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl line-clamp-2">
                              {role.description}
                            </p>
                          )}

                          {/* LinkedIn Post Indicator */}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {role.linkedinUrl ? (
                              <a
                                href={role.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0a66c2]/10 text-[#0a66c2] border border-[#0a66c2]/20 text-xs font-semibold hover:bg-[#0a66c2]/20 transition"
                              >
                                <Icon icon="mdi:linkedin" className="text-sm" />
                                <span>LinkedIn Post Linked</span>
                                <Icon icon="solar:arrow-right-up-linear" className="text-xs" />
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                                <Icon icon="mdi:linkedin" className="text-slate-400" />
                                <span>No LinkedIn post attached</span>
                              </span>
                            )}

                            {/* Skills preview */}
                            {role.skills && role.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {role.skills.slice(0, 5).map((skill, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-600"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {role.skills.length > 5 && (
                                  <span className="text-[11px] text-slate-400">
                                    +{role.skills.length - 5} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap sm:flex-nowrap items-stretch sm:items-center gap-2 lg:flex-col lg:items-end shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(role)}
                            disabled={isToggling}
                            className={`flex-1 sm:flex-none justify-center rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                              role.isActive !== false
                                ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            }`}
                          >
                            <Icon
                              icon={role.isActive !== false ? "solar:pause-bold" : "solar:play-bold"}
                              className="text-xs"
                            />
                            <span>{role.isActive !== false ? "Deactivate Role" : "Activate Role"}</span>
                          </button>

                          <div className="flex items-center gap-1.5 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(role)}
                              className="flex-1 sm:flex-none justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
                            >
                              <Icon icon="solar:pen-bold" className="text-xs text-blue-600" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRole(role)}
                              disabled={isDeleting}
                              className="flex-1 sm:flex-none justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: CANDIDATE APPLICATIONS ================= */}
        {activeTab === "applications" && (
          <div>
            {/* Search & Filter Bar */}
            <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Icon icon="solar:magnifer-linear" className="text-base" />
                </span>
                <input
                  type="text"
                  placeholder="Search candidates by name, role, email, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap gap-1.5 shrink-0">
                {[
                  { label: "All Status", value: "all" },
                  { label: "New", value: "new" },
                  { label: "Reviewed", value: "reviewed" },
                  { label: "Shortlisted", value: "shortlisted" },
                  { label: "Rejected", value: "rejected" },
                ].map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setAppStatusFilter(s.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      appStatusFilter === s.value
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingApps ? (
              <div className="flex h-48 items-center justify-center text-slate-500">
                <Icon icon="eos-icons:loading" width={32} height={32} className="animate-spin" />
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Icon
                  icon="solar:user-speak-linear"
                  width={48}
                  height={48}
                  className="mx-auto text-slate-400 mb-3"
                />
                <h3 className="text-base font-bold text-slate-800">No Candidate Applications Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  {searchTerm || appStatusFilter !== "all"
                    ? "No applications match your current filters. Try changing or clearing your search term."
                    : "When engineers submit applications on the Careers page, their profiles, resumes, and contact links will automatically appear here."}
                </p>
              </div>
            ) : (
              <div className="space-y-4 pb-12">
                {filteredApps.map((app) => {
                  const appId = app._id;
                  const isUpdating = updatingAppId === appId;
                  const isDeleting = deletingAppId === appId;
                  const initials = app.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || "CN";

                  const cleanPhone = app.phone ? app.phone.replace(/[^\d]/g, "") : "";

                  return (
                    <div
                      key={appId}
                      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-md"
                    >
                      {/* Top Candidate Row */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                        <div className="flex items-start gap-3.5">
                          {/* Avatar Initials */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
                            {initials}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold text-slate-900">{app.name}</h3>

                              {/* Target Role Badge */}
                              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-100">
                                {app.role || "General Application"}
                              </span>

                              {/* Experience Badge */}
                              {app.experience && (
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                  {app.experience}
                                </span>
                              )}

                              {/* Date */}
                              <span className="text-xs text-slate-400">
                                {new Date(app.createdAt).toLocaleString()}
                              </span>
                            </div>

                            {/* Contact Links */}
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
                              <a
                                href={`mailto:${app.email}?subject=Re:%20Application%20for%20${encodeURIComponent(app.role || "Role")}%20-%20Appsica%20Technologies`}
                                className="flex items-center gap-1 text-blue-600 hover:underline font-medium"
                              >
                                <Icon icon="solar:letter-bold" className="text-sm" />
                                <span>{app.email}</span>
                              </a>

                              {app.phone && (
                                <a
                                  href={`tel:${app.phone.replace(/\s+/g, "")}`}
                                  className="flex items-center gap-1 text-slate-700 hover:text-blue-600 font-medium"
                                >
                                  <Icon icon="solar:phone-bold" className="text-sm" />
                                  <span>{app.phone}</span>
                                </a>
                              )}

                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                    `Hi ${app.name}, thank you for your application for ${app.role || "the open role"} at Appsica Technologies.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold"
                                >
                                  <Icon icon="ic:baseline-whatsapp" className="text-sm" />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status selector & actions */}
                        <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          {/* Status Dropdown */}
                          <select
                            value={app.status || "new"}
                            disabled={isUpdating}
                            onChange={(e) => handleUpdateAppStatus(appId, e.target.value)}
                            className={`flex-1 sm:flex-none rounded-lg px-2.5 py-1.5 text-xs font-bold border transition cursor-pointer ${
                              app.status === "shortlisted"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                : app.status === "reviewed"
                                ? "bg-blue-50 text-blue-700 border-blue-300"
                                : app.status === "rejected"
                                ? "bg-rose-50 text-rose-700 border-rose-300"
                                : "bg-purple-50 text-purple-700 border-purple-300"
                            }`}
                          >
                            <option value="new">Status: New</option>
                            <option value="reviewed">Status: Reviewed</option>
                            <option value="shortlisted">Status: Shortlisted</option>
                            <option value="rejected">Status: Rejected</option>
                          </select>

                          {/* Delete Application */}
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleDeleteApp(appId, app.name)}
                            className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 transition cursor-pointer disabled:opacity-50 shrink-0"
                            title="Delete candidate application"
                          >
                            <Icon icon="solar:trash-bin-trash-bold" className="text-base" />
                          </button>
                        </div>
                      </div>

                      {/* Candidate Details & Resume */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Skills */}
                        <div className="md:col-span-2">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Candidate Technical Skills:
                          </p>
                          <p className="text-xs sm:text-sm font-mono text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            {app.skills || "Not specified"}
                          </p>

                          {/* Message / Pitch */}
                          {app.message && (
                            <div className="mt-2.5">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                Cover Message / Pitch:
                              </p>
                              <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap leading-relaxed">
                                {app.message}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Resume Card */}
                        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 flex flex-col justify-between">
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5 mb-2">
                              <Icon icon="solar:document-text-bold" className="text-blue-600 text-sm" />
                              <span>Candidate Resume</span>
                            </p>

                            {app.resumeUrl ? (
                              <div className="space-y-1.5">
                                <p className="text-xs text-slate-600 break-all line-clamp-2">
                                  {app.resumeUrl}
                                </p>
                                <a
                                  href={app.resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition w-full justify-center"
                                >
                                  <Icon icon="solar:link-circle-bold" className="text-sm" />
                                  <span>Open / View Resume</span>
                                </a>
                              </div>
                            ) : app.resumeAttachment?.content ? (
                              <div>
                                <p className="text-xs text-emerald-800 font-semibold mb-2">
                                  📎 File: {app.resumeAttachment.filename || "Resume.pdf"}
                                </p>
                                <a
                                  href={`data:application/octet-stream;base64,${app.resumeAttachment.content}`}
                                  download={app.resumeAttachment.filename || "Candidate_Resume.pdf"}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition w-full justify-center"
                                >
                                  <Icon icon="solar:download-bold" className="text-sm" />
                                  <span>Download Attached Resume</span>
                                </a>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic">
                                No resume file or URL link provided.
                              </p>
                            )}
                          </div>

                          <div className="mt-3 pt-2 border-t border-blue-100/80 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Direct Response</span>
                            <a
                              href={`mailto:${app.email}?subject=Invitation%20for%20Technical%20Discussion%20-%20Appsica%20Technologies`}
                              className="text-blue-600 font-bold hover:underline"
                            >
                              Send Interview Email &rarr;
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD / EDIT JOB ROLE ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {modalMode === "edit" ? "Edit Job Role" : "Create New Job Opening"}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in the details for this role. You can toggle it active or inactive anytime.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition"
              >
                <Icon icon="solar:close-circle-bold" className="text-2xl" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveRole} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
              {/* Row 1: Title & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Job Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full-Stack Engineer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineering / Cloud / AI"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 2: Category & Job Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as RoleFormData["category"],
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="engineering">Engineering</option>
                    <option value="cloud">Cloud & DevOps</option>
                    <option value="design">UI/UX Design</option>
                    <option value="ai">Applied AI</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Experience Level
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2 - 5 Years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Job Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Location & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Indore HQ / Hybrid"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 4: LINKEDIN HIRING POST LINK */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                <label className="block text-xs font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                  <Icon icon="mdi:linkedin" className="text-base text-[#0a66c2]" />
                  <span>LinkedIn Hiring Post URL (Visit LinkedIn Button Link)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/posts/..."
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                />
                <p className="mt-1 text-[11px] text-blue-700">
                  When added, a &quot;Visit LinkedIn&quot; button will appear on this role on the Careers page so candidates can directly view your LinkedIn announcement!
                </p>
              </div>

              {/* Row 5: ACTIVE / INACTIVE TOGGLE */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-900">
                    Hiring Status: {formData.isActive ? "Active (Hiring Open)" : "Inactive (Hiring Paused)"}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    {formData.isActive
                      ? "This role is currently visible on the Careers page for applications."
                      : "This role will be deactivated and hidden from open applications."}
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Row 6: Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Architect and build high-concurrency web applications..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Row 7: Skills (comma separated) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Next.js 15, TypeScript, React, Node.js, MongoDB, Tailwind CSS"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* Row 8: Responsibilities (one per line) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Key Responsibilities (one bullet point per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Lead technical design and development of end-to-end web architectures.&#10;Write clean, modular, and well-tested TypeScript code.&#10;Collaborate with UI/UX designers to implement interfaces."
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full sm:w-auto justify-center px-4 py-2.5 sm:py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer flex items-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRole}
                  className="w-full sm:w-auto justify-center px-5 py-2.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingRole ? (
                    <>
                      <Icon icon="solar:spinner-linear" className="animate-spin text-sm" />
                      <span>Saving Role...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="solar:check-circle-bold" className="text-sm" />
                      <span>{modalMode === "edit" ? "Update Role" : "Create Role"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
