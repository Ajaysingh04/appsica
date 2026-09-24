import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role === "admin") {
      redirect("/admin/dashboard");
    }
  } catch (e: unknown) {
    if ((e as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    console.error("Admin login page session error:", e);
  }

  return <LoginForm />;
}
