import { redirect } from "next/navigation";

export default async function LegacyEditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/dashboard?edit=${id}`);
}
