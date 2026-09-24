import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return null;
  }
  return session;
}

export const requireAdmin = requireAdminSession;
