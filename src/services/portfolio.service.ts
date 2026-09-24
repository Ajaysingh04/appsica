import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { IProject } from "@/types";

export class PortfolioService {
  /**
   * Get public projects (only user-added projects, excluding demo templates)
   */
  static async getAllProjects(includeDemo = false): Promise<IProject[]> {
    try {
      await connectDB();
      const filter: any = { published: { $ne: false } };
      if (!includeDemo) {
        filter.isDemo = { $ne: true };
      }

      const projects = await Project.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .lean();

      if (projects && projects.length > 0) {
        return projects.map((p) => ({
          _id: String(p._id),
          title: p.title,
          slug: p.slug,
          summary: p.summary,
          description: p.description,
          coverImage: p.coverImage,
          image: p.coverImage,
          images: p.images || [],
          features: p.features || [],
          techStack: p.techStack || [],
          liveLink: p.liveLink,
          isDemo: Boolean(p.isDemo),
          order: p.order,
          published: p.published,
        })) as IProject[];
      }
      return [];
    } catch {
      return [];
    }
  }

  static async getProjectBySlug(slug: string): Promise<IProject | null> {
    try {
      await connectDB();
      const project = await Project.findOne({ slug, published: { $ne: false }, isDemo: { $ne: true } }).lean();
      if (project) return project as unknown as IProject;
    } catch {
      // ignore
    }
    return null;
  }
}
