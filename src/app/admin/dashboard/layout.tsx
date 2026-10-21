import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import AdminLayoutShell from "./AdminLayoutShell";

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
    <AdminLayoutShell
      userEmail={session.user.email || "admin@appsica.com"}
      userName={session.user.name || "Admin"}
    >
      {children}
    </AdminLayoutShell>
  );
}
