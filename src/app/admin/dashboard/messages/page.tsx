"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

interface IMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
  projectName?: string;
  project?: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/messages");
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Client Inquiries & Leads</h1>
            <p className="mt-1 text-sm text-slate-600">
              Messages and quote requests submitted through the contact forms.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchMessages}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
          >
            <Icon icon="solar:restart-bold" width={16} height={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-slate-500">
            <Icon icon="eos-icons:loading" width={28} height={28} className="animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Icon
              icon="solar:letter-unread-linear"
              width={48}
              height={48}
              className="mx-auto text-slate-400 mb-3"
            />
            <p className="text-base font-semibold text-slate-700">No Inquiries Yet</p>
            <p className="text-sm text-slate-500 mt-1">
              When visitors submit messages on the contact form, they will appear here and in your email.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-12">
            {messages.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                      {item.projectName && (
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-primary border border-blue-100">
                          Project: {item.projectName}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <a
                        href={`mailto:${item.email}`}
                        className="flex items-center gap-1 text-primary hover:underline font-medium"
                      >
                        <Icon icon="solar:letter-bold" width={16} height={16} />
                        {item.email}
                      </a>
                      {item.phone && (
                        <a
                          href={`tel:${item.phone.replace(/\s+/g, "")}`}
                          className="flex items-center gap-1 text-slate-700 hover:text-primary font-medium"
                        >
                          <Icon icon="solar:phone-bold" width={16} height={16} />
                          {item.phone}
                        </a>
                      )}
                      {item.phone && (
                        <a
                          href={`https://wa.me/${item.phone.replace(/[^\d]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold"
                        >
                          <Icon icon="ic:baseline-whatsapp" width={16} height={16} />
                          WhatsApp Client
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${item.email}?subject=Re:%20Inquiry%20from%20Appsica%20Technologies`}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 flex items-center gap-1.5"
                    >
                      <Icon icon="solar:reply-bold" width={14} height={14} />
                      Reply
                    </a>
                    <button
                      type="button"
                      disabled={deletingId === item._id}
                      onClick={() => handleDelete(item._id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 cursor-pointer disabled:opacity-50"
                    >
                      {deletingId === item._id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Message:
                  </p>
                  <p className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap border border-slate-100">
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
