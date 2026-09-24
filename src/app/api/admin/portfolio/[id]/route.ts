import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import mongoose from "mongoose";
import { deleteCloudinaryImageByUrl } from "@/lib/cloudinary";

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
    const coverImage = String(body.coverImage || "").trim();
    const liveLink = String(body.liveLink || "").trim();
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
