import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import SetupForm from "./SetupForm";

export default async function AdminSetupPage() {
  try {
    await connectDB();
    const count = await Admin.countDocuments();
    if (count > 0) {
      redirect("/admin/login");
    }
  } catch {
    /* allow setup UI if DB not configured — POST will fail with clear error */
  }
  return <SetupForm />;
}
