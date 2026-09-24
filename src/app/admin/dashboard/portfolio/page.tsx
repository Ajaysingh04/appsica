import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import PortfolioDashboardClient, { type DashboardProjectCard } from "./PortfolioDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  let initialProjects: DashboardProjectCard[] = [];
  try {
    await connectDB();
    const raw = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    initialProjects = (
      raw as unknown as Array<{
        _id: unknown;
        title: string;
        slug: string;
        coverImage: string;
        published: boolean;
        isDemo?: boolean;
        liveLink: string;
        order?: number;
      }>
    ).map((p) => ({
      _id: String(p._id),
      title: p.title,
      slug: p.slug,
      coverImage: p.coverImage,
      published: p.published,
      isDemo: Boolean(p.isDemo),
      liveLink: p.liveLink || "",
      order: typeof p.order === "number" ? p.order : 0,
    }));
  } catch {
    initialProjects = [];
  }

  return <PortfolioDashboardClient initialProjects={initialProjects} />;
}
