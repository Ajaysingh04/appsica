"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@iconify/react";
import SignOutButton from "./SignOutButton";

interface AdminLayoutShellProps {
  userEmail: string;
  userName?: string;
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: {
    text: string;
    color: string;
  };
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Project Management",
    items: [
      {
        name: "All Projects",
        href: "/admin/dashboard",
        icon: "solar:folder-with-files-bold-duotone",
      },
      {
        name: "Portfolio",
        href: "/admin/dashboard/portfolio",
        icon: "solar:gallery-wide-bold-duotone",
      },
      {
        name: "Services",
        href: "/admin/dashboard/services",
        icon: "solar:layers-minimalistic-bold-duotone",
      },
      {
        name: "Technologies",
        href: "/admin/dashboard/technologies",
        icon: "solar:code-square-bold-duotone",
      },
    ],
  },
  {
    title: "Leads & Marketing",
    items: [
      {
        name: "Inquiries / Leads",
        href: "/admin/dashboard/messages",
        icon: "solar:chat-round-dots-bold-duotone",
        badge: {
          text: "Active",
          color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
        },
      },
      {
        name: "All Blogs",
        href: "/admin/dashboard/blogs",
        icon: "solar:document-text-bold-duotone",
      },
    ],
  },
  {
    title: "Company",
    items: [
      {
        name: "Careers & Jobs",
        href: "/admin/dashboard/careers",
        icon: "solar:case-round-minimalistic-bold-duotone",
        badge: {
          text: "Hiring",
          color: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
        },
      },
    ],
  },
];

export default function AdminLayoutShell({
  userEmail,
  userName = "Admin",
  children,
}: AdminLayoutShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/admin/dashboard") return "All Projects";
    if (pathname.startsWith("/admin/dashboard/portfolio")) return "Portfolio & Live Showcase";
    if (pathname.startsWith("/admin/dashboard/services")) return "Services Management";
    if (pathname.startsWith("/admin/dashboard/technologies")) return "Technologies & Stack";
    if (pathname.startsWith("/admin/dashboard/messages")) return "Client Inquiries & Leads";
    if (pathname.startsWith("/admin/dashboard/blogs")) return "Blog Articles";
    if (pathname.startsWith("/admin/dashboard/careers")) return "Careers & Job Openings";
    return "Admin Dashboard";
  };

  const getInitials = (nameOrEmail: string) => {
    if (!nameOrEmail) return "AD";
    const parts = nameOrEmail.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameOrEmail.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800/80 bg-[#0a0f1d] text-slate-300 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800/80 px-6">
          <Link
            href="/admin/dashboard"
            className="group flex items-center gap-3 transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white shadow-lg shadow-blue-500/25">
              <Icon icon="solar:shield-check-bold-duotone" width={24} height={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">Appsica</span>
                <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-blue-400 border border-blue-500/20">
                  Admin
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span>System Online</span>
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <Icon icon="ph:x-bold" width={20} height={20} />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-thumb-slate-800">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 text-[11px] font-bold tracking-wider uppercase text-slate-400/90">
                {section.title}
              </p>
              <div className="mt-2 space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/admin/dashboard"
                      ? pathname === "/admin/dashboard"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 font-semibold"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          icon={item.icon}
                          width={20}
                          height={20}
                          className={`transition-colors ${
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-blue-400"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : item.badge.color
                          }`}
                        >
                          {item.badge.text}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick External Link */}
          <div className="pt-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-3.5 py-2.5 text-xs font-semibold text-slate-400 transition hover:border-slate-700 hover:bg-slate-800/80 hover:text-white"
            >
              <div className="flex items-center gap-2.5">
                <Icon icon="solar:globus-bold-duotone" width={18} height={18} className="text-blue-400" />
                <span>Visit Live Website</span>
              </div>
              <Icon icon="solar:arrow-right-up-linear" width={14} height={14} />
            </a>
          </div>
        </div>

        {/* Footer Admin Profile */}
        <div className="border-t border-slate-800/80 bg-slate-950/60 p-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-900/60 p-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white shadow-inner">
              {getInitials(userName || userEmail)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-bold text-white">{userName}</p>
                <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-[9px] font-bold text-emerald-400">
                  Admin
                </span>
              </div>
              <p className="truncate text-[11px] text-slate-400">{userEmail}</p>
            </div>
          </div>
          <div className="mt-3">
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-slate-50 text-slate-900">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Icon icon="ph:list-bold" width={20} height={20} />
            </button>

            <div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Icon icon="solar:arrow-right-up-linear" width={14} height={14} className="text-blue-600" />
              <span>Live Site</span>
            </a>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="hidden md:inline">Logged in as</span>
              <strong className="text-slate-800">{userEmail.split("@")[0]}</strong>
            </div>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 min-h-0 overflow-y-auto bg-slate-100/60 animate-admin-fade">
          {children}
        </main>
      </div>
    </div>
  );
}
