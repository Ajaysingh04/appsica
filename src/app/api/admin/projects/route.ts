import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ projects });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load projects." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    let slug = String(body.slug || "").trim().toLowerCase();
    const summary = String(body.summary || "").trim();
    const description = String(body.description || "").trim();
    const coverImage = String(body.coverImage || "").trim();
    const liveLink = String(body.liveLink || "").trim();
    const images = Array.isArray(body.images)
      ? body.images.map((u: unknown) => String(u).trim()).filter(Boolean)
      : [];
    const features = Array.isArray(body.features)
      ? body.features.map((f: { title?: string; description?: string }) => ({
          title: String(f.title || "").trim(),
          description: String(f.description || "").trim(),
        }))
      : [];
    const techStack = Array.isArray(body.techStack)
      ? body.techStack.map((t: unknown) => String(t).trim()).filter(Boolean)
      : [];
    const published = Boolean(body.published);
    const isDemo = Boolean(body.isDemo);
    const order = Number(body.order) || 0;

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (!slug) slug = slugify(title);
    if (!coverImage) {
      return NextResponse.json({ error: "Cover image URL is required." }, { status: 400 });
    }

    await connectDB();
    const project = await Project.create({
      title,
      slug,
      summary,
      description,
      coverImage,
      images,
      features: features.filter((f: { title: string }) => f.title),
      techStack,
      liveLink,
      published,
      isDemo,
      order,
    });

    revalidatePath("/portfolio");
    revalidatePath("/");

    return NextResponse.json({ project });
  } catch (e: unknown) {
    const code = (e as { code?: number })?.code;
    if (code === 11000) {
      return NextResponse.json({ error: "Slug already exists. Use a unique slug." }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}
