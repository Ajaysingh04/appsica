import { redirect } from "next/navigation";

export default function LegacyNewProjectPage() {
  redirect("/admin/dashboard?new=1");
}
