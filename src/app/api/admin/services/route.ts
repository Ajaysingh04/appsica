import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";

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
    const services = await Service.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, services });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load services." }, { status: 500 });
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
    const service = await Service.create({
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
    });

    return NextResponse.json({ success: true, service });
  } catch (e: unknown) {
    const code = (e as { code?: number })?.code;
    if (code === 11000) {
      return NextResponse.json({ error: "Slug already exists. Please choose a unique slug." }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to create service." }, { status: 500 });
  }
}
