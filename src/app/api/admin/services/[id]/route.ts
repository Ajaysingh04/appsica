import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import mongoose from "mongoose";

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
    return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
  }

  try {
    await connectDB();
    const service = await Service.findById(id).lean();
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, service });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load service." }, { status: 500 });
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
    return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    let slug = String(body.slug || "").trim().toLowerCase();
    const icon = String(body.icon || "solar:code-linear").trim();
    const image = String(body.image || "").trim();
    const description = String(body.description || "").trim();
    const detail = String(body.detail || "").trim();
    const order = Number(body.order) || 0;
    const published = body.published !== undefined ? Boolean(body.published) : true;

    const features = Array.isArray(body.features)
      ? body.features
          .map((f: { title?: string; description?: string }) => ({
            title: String(f.title || "").trim(),
            description: String(f.description || "").trim(),
          }))
          .filter((f: { title: string }) => f.title)
      : [];

    const demoLinks = Array.isArray(body.demoLinks)
      ? body.demoLinks
          .map((d: { name?: string; url?: string }) => ({
            name: String(d.name || "").trim(),
            url: String(d.url || "").trim(),
          }))
          .filter((d: { name: string; url: string }) => d.name && d.url)
      : [];

    if (!title) {
      return NextResponse.json({ error: "Service title is required." }, { status: 400 });
    }
    if (!slug) slug = slugify(title);

    await connectDB();
    const service = await Service.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        icon,
        image,
        description,
        detail,
        features,
        demoLinks,
        order,
        published,
      },
      { new: true, runValidators: true }
    ).lean();

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, service });
  } catch (e: unknown) {
    const code = (e as { code?: number })?.code;
    if (code === 11000) {
      return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to update service." }, { status: 500 });
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
    return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
  }

  try {
    await connectDB();
    await Service.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete service." }, { status: 500 });
  }
}
