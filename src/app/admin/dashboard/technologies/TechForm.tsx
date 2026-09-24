"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

export type TechItem = { name: string; icon: string };

export type TechCategoryFormInitial = {
  category?: string;
  items?: TechItem[];
  order?: number;
  published?: boolean;
};

const SUGGESTED_TECHS = [
  { name: "React.js", icon: "logos:react" },
  { name: "Next.js", icon: "logos:nextjs-icon" },
  { name: "Node.js", icon: "logos:nodejs-icon" },
  { name: "TypeScript", icon: "logos:typescript-icon" },
  { name: "JavaScript", icon: "logos:javascript" },
  { name: "Python", icon: "logos:python" },
  { name: "Django", icon: "logos:django-icon" },
  { name: "Flutter", icon: "logos:flutter" },
  { name: "React Native", icon: "logos:react" },
  { name: "Swift", icon: "logos:swift" },
  { name: "Kotlin", icon: "logos:kotlin-icon" },
  { name: "Java", icon: "logos:java" },
  { name: "PHP", icon: "logos:php" },
  { name: "Laravel", icon: "logos:laravel" },
  { name: "MongoDB", icon: "logos:mongodb-icon" },
  { name: "MySQL", icon: "logos:mysql" },
  { name: "PostgreSQL", icon: "logos:postgresql" },
  { name: "Redis", icon: "logos:redis" },
  { name: "AWS", icon: "logos:aws" },
  { name: "Docker", icon: "logos:docker-icon" },
  { name: "Kubernetes", icon: "logos:kubernetes" },
  { name: "Firebase", icon: "logos:firebase" },
  { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
  { name: "GraphQL", icon: "logos:graphql" },
  { name: "WordPress", icon: "logos:wordpress-icon" },
  { name: "Shopify", icon: "logos:shopify" },
];

export default function TechForm({
  categoryId,
  initial,
  onClose,
  onSaved,
}: {
  categoryId?: string;
  initial?: TechCategoryFormInitial;
  onClose?: () => void;
  onSaved?: () => void | Promise<void>;
}) {
  const [category, setCategory] = useState(initial?.category ?? "");
  const [items, setItems] = useState<TechItem[]>(
    initial?.items?.length ? initial.items : [{ name: "", icon: "logos:react" }]
  );
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const addPresetItem = (preset: { name: string; icon: string }) => {
    if (items.some((it) => it.name.toLowerCase() === preset.name.toLowerCase())) return;
    setItems((prev) => [...prev.filter((it) => it.name.trim()), preset]);
  };

  const handleItemChange = (index: number, field: "name" | "icon", value: string) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { name: "", icon: "logos:react" }]);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const validItems = items.filter((it) => it.name.trim() && it.icon.trim());

    if (!category.trim()) {
      setMessage({ type: "err", text: "Category title is required." });
      return;
    }

    if (validItems.length === 0) {
      setMessage({ type: "err", text: "Please add at least one technology tool/framework." });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        category: category.trim(),
        items: validItems,
        order,
        published,
      };

      const url = categoryId ? `/api/admin/technologies/${categoryId}` : "/api/admin/technologies";
      const res = await fetch(url, {
        method: categoryId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Save failed." });
        setSaving(false);
        return;
      }

      setMessage({ type: "ok", text: "Saved successfully!" });
      await onSaved?.();
    } catch {
      setMessage({ type: "err", text: "Failed to save technology category." });
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Category Name *</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Frontend Technologies, AI & Machine Learning, Cloud DevOps"
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
      </div>

      {/* Quick Add Suggestions */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
          ⚡ 1-Click Quick Add Tech Tools:
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
          {SUGGESTED_TECHS.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => addPresetItem(s)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-primary hover:text-primary transition cursor-pointer"
            >
              <Icon icon={s.icon} width={14} height={14} />
              <span>+ {s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Technology Items List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700">
            Technology Items ({items.length})
          </label>
          <button
            type="button"
            onClick={addItem}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            + Add Custom Tool
          </button>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/30 p-2.5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200">
                <Icon icon={item.icon || "logos:react"} width={22} height={22} />
              </div>
              <input
                placeholder="Name (e.g. Next.js)"
                value={item.name}
                onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                className="w-1/3 rounded border border-slate-200 bg-white px-3 py-1.5 text-sm"
              />
              <input
                placeholder="Iconify Tag (e.g. logos:nextjs-icon)"
                value={item.icon}
                onChange={(e) => handleItemChange(idx, "icon", e.target.value)}
                className="flex-1 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 font-mono"
              />
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                title="Remove"
              >
                <Icon icon="solar:trash-bin-trash-bold" width={18} height={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Published Status */}
      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
          />
          <span>Published (Visible on Home & Services pages)</span>
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-60 cursor-pointer"
        >
          {saving ? "Saving…" : categoryId ? "Update Category" : "Create Category"}
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
