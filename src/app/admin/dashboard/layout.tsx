import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import SignOutButton from "./SignOutButton";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Console
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Appsica Admin
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <Link
            href="/admin/dashboard"
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            All projects
          </Link>
          <Link
            href="/admin/dashboard/services"
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Services
          </Link>
          <Link
            href="/admin/dashboard/technologies"
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Technologies
          </Link>
          <Link
            href="/admin/dashboard/messages"
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 flex items-center justify-between"
          >
            <span>Inquiries / Leads</span>
            <span className="rounded-full bg-primary/10 text-primary font-bold text-xs px-2 py-0.5">New</span>
          </Link>
          <Link
            href="/admin/dashboard/blogs"
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            All blogs
          </Link>
          <Link
            href="/admin/dashboard/portfolio"
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Portfolio
          </Link>
          <Link
            href="/admin/dashboard/careers"
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 flex items-center justify-between"
          >
            <span>Careers & Jobs</span>
            <span className="rounded-full bg-blue-50 text-blue-600 border border-blue-200 font-bold text-[10px] px-2 py-0.5">Hiring</span>
          </Link>
        </nav>
        <div className="border-t border-slate-200 p-4">
          <p className="mb-3 truncate text-xs text-slate-500">{session.user.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
        {children}
      </main>
    </div>
  );
}
