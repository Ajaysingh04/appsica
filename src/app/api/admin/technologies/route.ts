import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import Technology from "@/models/Technology";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const categories = await Technology.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, categories });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load technologies." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const category = String(body.category || "").trim();
    const order = Number(body.order) || 0;
    const published = body.published !== undefined ? Boolean(body.published) : true;

    const items = Array.isArray(body.items)
      ? body.items
          .map((item: { name?: string; icon?: string }) => ({
            name: String(item.name || "").trim(),
            icon: String(item.icon || "").trim(),
          }))
          .filter((item: { name: string; icon: string }) => item.name && item.icon)
      : [];

    if (!category) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    if (items.length === 0) {
      return NextResponse.json({ error: "Please add at least one technology item." }, { status: 400 });
    }

    await connectDB();
    const techCategory = await Technology.create({
      category,
      items,
      order,
      published,
    });

    return NextResponse.json({ success: true, category: techCategory });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create technology category." }, { status: 500 });
  }
}
