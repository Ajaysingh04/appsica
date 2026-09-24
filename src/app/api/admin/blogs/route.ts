import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

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
    const blogs = await Blog.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ blogs });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load blogs." }, { status: 500 });
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
    const excerpt = String(body.excerpt || "").trim();
    const content = String(body.content || "").trim();
    const coverImage = String(body.coverImage || "").trim();
    const published = Boolean(body.published);
    const order = Number(body.order) || 0;

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (!slug) slug = slugify(title);
    if (!coverImage) {
      return NextResponse.json({ error: "Cover image URL is required." }, { status: 400 });
    }

    await connectDB();
    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      published,
      order,
    });

    return NextResponse.json({ blog });
  } catch (e: unknown) {
    const code = (e as { code?: number })?.code;
    if (code === 11000) {
      return NextResponse.json({ error: "Slug already exists. Use a unique slug." }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to create blog." }, { status: 500 });
  }
}
