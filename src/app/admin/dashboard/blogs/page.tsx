import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogDashboardClient, { type DashboardBlogCard } from "./BlogDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  let initialBlogs: DashboardBlogCard[] = [];
  try {
    await connectDB();
    const raw = await Blog.find().sort({ order: 1, createdAt: -1 }).lean();
    initialBlogs = (
      raw as unknown as Array<{
        _id: unknown;
        title: string;
        slug: string;
        coverImage: string;
        published: boolean;
      }>
    ).map((b) => ({
      _id: String(b._id),
      title: b.title,
      slug: b.slug,
      coverImage: b.coverImage,
      published: b.published,
    }));
  } catch {
    initialBlogs = [];
  }

  return <BlogDashboardClient initialBlogs={initialBlogs} />;
}
