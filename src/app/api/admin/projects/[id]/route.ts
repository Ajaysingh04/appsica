import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import mongoose from "mongoose";
import { deleteCloudinaryImageByUrl } from "@/lib/cloudinary";
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await connectDB();
    const project = await Project.findById(id).lean();
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load project." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
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
    const category = body.category !== undefined ? String(body.category).trim() : undefined;
    const playStoreUrl = body.playStoreUrl !== undefined ? String(body.playStoreUrl).trim() : undefined;
    const appStoreUrl = body.appStoreUrl !== undefined ? String(body.appStoreUrl).trim() : undefined;
    const apps = Array.isArray(body.apps)
      ? body.apps
          .map((a: any) => ({
            role: String(a.role || "customer").trim(),
            title: String(a.title || "").trim(),
            summary: String(a.summary || "").trim(),
            playStoreUrl: String(a.playStoreUrl || "").trim(),
            appStoreUrl: String(a.appStoreUrl || "").trim(),
            liveLink: String(a.liveLink || "").trim(),
            icon: String(a.icon || "").trim(),
            images: Array.isArray(a.images) ? a.images.map((img: any) => String(img).trim()).filter(Boolean) : [],
          }))
          .filter((a: any) => a.title || a.playStoreUrl)
      : undefined;
    const published = Boolean(body.published);
    const isDemo = body.isDemo !== undefined ? Boolean(body.isDemo) : undefined;
    const order = Number(body.order) || 0;

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (!slug) slug = slugify(title);
    if (!coverImage) {
      return NextResponse.json({ error: "Cover image URL is required." }, { status: 400 });
    }

    await connectDB();
    const existing = await Project.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
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
      order,
    };
    if (category !== undefined) {
      updateData.category = category;
    }
    if (playStoreUrl !== undefined) {
      updateData.playStoreUrl = playStoreUrl;
    }
    if (appStoreUrl !== undefined) {
      updateData.appStoreUrl = appStoreUrl;
    }
    if (apps !== undefined) {
      updateData.apps = apps;
    }
    if (isDemo !== undefined) {
      updateData.isDemo = isDemo;
    }

    const project = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const oldUrls = new Set<string>(
      [String((existing as { coverImage?: string }).coverImage || ""), ...(((existing as { images?: string[] }).images || []).map(String))]
        .map((u) => u.trim())
        .filter(Boolean)
    );
    const newUrls = new Set<string>(
      [coverImage, ...images].map((u) => u.trim()).filter(Boolean)
    );
    const removedUrls = [...oldUrls].filter((u) => !newUrls.has(u));
    await Promise.all(
      removedUrls.map(async (url) => {
        try {
          await deleteCloudinaryImageByUrl(url);
        } catch (err) {
          console.error("Failed to delete image from Cloudinary:", err);
        }
      })
    );

    revalidatePath("/portfolio");
    revalidatePath("/");
    revalidatePath(`/portfolio/${project.slug}`);

    return NextResponse.json({ project });
  } catch (e: unknown) {
    const code = (e as { code?: number })?.code;
    if (code === 11000) {
      return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await connectDB();
    const existing = await Project.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ ok: true });
    }

    await Project.findByIdAndDelete(id);

    const urls = new Set<string>(
      [
        String((existing as { coverImage?: string }).coverImage || ""),
        ...(((existing as { images?: string[] }).images || []).map(String)),
      ]
        .map((u) => u.trim())
        .filter(Boolean)
    );
    await Promise.all(
      [...urls].map(async (url) => {
        try {
          await deleteCloudinaryImageByUrl(url);
        } catch (err) {
          console.error("Failed to delete image from Cloudinary:", err);
        }
      })
    );

    revalidatePath("/portfolio");
    revalidatePath("/");

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
  }
}
