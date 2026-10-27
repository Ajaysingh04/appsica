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
    const rawSlug = String(body.slug || "").trim();
    let slug = rawSlug ? slugify(rawSlug) : slugify(title);
    const summary = String(body.summary || "").trim();
    const description = body.description !== undefined ? String(body.description).trim() : undefined;
    const coverImage = String(body.coverImage || "").trim();

    let liveLink = body.liveLink !== undefined ? String(body.liveLink).trim() : "";
    if (liveLink && !/^https?:\/\//i.test(liveLink)) {
      liveLink = `https://${liveLink}`;
    }
    let playStoreUrl = body.playStoreUrl !== undefined ? String(body.playStoreUrl).trim() : undefined;
    if (playStoreUrl && !/^https?:\/\//i.test(playStoreUrl)) {
      playStoreUrl = `https://${playStoreUrl}`;
    }
    let appStoreUrl = body.appStoreUrl !== undefined ? String(body.appStoreUrl).trim() : undefined;
    if (appStoreUrl && !/^https?:\/\//i.test(appStoreUrl)) {
      appStoreUrl = `https://${appStoreUrl}`;
    }

    const apps = Array.isArray(body.apps)
      ? body.apps
          .map((a: any) => {
            let appLiveLink = String(a.liveLink || "").trim();
            if (appLiveLink && !/^https?:\/\//i.test(appLiveLink)) appLiveLink = `https://${appLiveLink}`;
            let appPlayStore = String(a.playStoreUrl || "").trim();
            if (appPlayStore && !/^https?:\/\//i.test(appPlayStore)) appPlayStore = `https://${appPlayStore}`;
            let appAppStore = String(a.appStoreUrl || "").trim();
            if (appAppStore && !/^https?:\/\//i.test(appAppStore)) appAppStore = `https://${appAppStore}`;

            return {
              role: String(a.role || "customer").trim(),
              title: String(a.title || "").trim(),
              summary: String(a.summary || "").trim(),
              playStoreUrl: appPlayStore,
              appStoreUrl: appAppStore,
              liveLink: appLiveLink,
              icon: String(a.icon || "").trim(),
              images: Array.isArray(a.images) ? a.images.map((img: any) => String(img).trim()).filter(Boolean) : [],
            };
          })
          .filter((a: any) => a.title || a.playStoreUrl || a.liveLink || a.appStoreUrl)
      : undefined;

    if (!liveLink && apps && apps.length > 0) {
      const found = apps.find((a: any) => a.liveLink);
      if (found) liveLink = found.liveLink;
    }
    if ((!playStoreUrl || playStoreUrl === "") && apps && apps.length > 0) {
      const found = apps.find((a: any) => a.playStoreUrl);
      if (found) playStoreUrl = found.playStoreUrl;
    }
    if ((!appStoreUrl || appStoreUrl === "") && apps && apps.length > 0) {
      const found = apps.find((a: any) => a.appStoreUrl);
      if (found) appStoreUrl = found.appStoreUrl;
    }

    const category = body.category !== undefined ? String(body.category).trim() : undefined;
    const images = Array.isArray(body.images)
      ? body.images.map((u: unknown) => String(u).trim()).filter(Boolean)
      : undefined;
    const features = Array.isArray(body.features)
      ? body.features
          .map((f: { title?: string; description?: string }) => ({
            title: String(f.title || "").trim(),
            description: String(f.description || "").trim(),
          }))
          .filter((f: { title: string }) => f.title)
      : undefined;
    const techStack = Array.isArray(body.techStack)
      ? body.techStack.map((t: unknown) => String(t).trim()).filter(Boolean)
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
      coverImage,
      liveLink,
      published,
      order,
    };
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (playStoreUrl !== undefined) updateData.playStoreUrl = playStoreUrl;
    if (appStoreUrl !== undefined) updateData.appStoreUrl = appStoreUrl;
    if (apps !== undefined) updateData.apps = apps;
    if (images !== undefined) updateData.images = images;
    if (features !== undefined) updateData.features = features;
    if (techStack !== undefined) updateData.techStack = techStack;
    if (isDemo !== undefined) {
      updateData.isDemo = isDemo;
    }

    const project = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (
      existing &&
      String((existing as { coverImage?: string }).coverImage || "").trim() &&
      String((existing as { coverImage?: string }).coverImage).trim() !== coverImage
    ) {
      try {
        await deleteCloudinaryImageByUrl(
          String((existing as { coverImage?: string }).coverImage).trim()
        );
      } catch (err) {
        console.error("Failed to delete old project image from Cloudinary:", err);
      }
    }

    revalidatePath("/portfolio");
    revalidatePath("/");
    revalidatePath(`/portfolio/${project.slug}`);
    if (existing.slug && existing.slug !== project.slug) {
      revalidatePath(`/portfolio/${existing.slug}`);
    }

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

    const oldCover = String((existing as { coverImage?: string }).coverImage || "").trim();
    if (oldCover) {
      try {
        await deleteCloudinaryImageByUrl(oldCover);
      } catch (err) {
        console.error("Failed to delete project image from Cloudinary:", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
  }
}
