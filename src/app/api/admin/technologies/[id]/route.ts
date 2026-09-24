import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import Technology from "@/models/Technology";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

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
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  try {
    await connectDB();
    const category = await Technology.findById(id).lean();
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, category });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load category." }, { status: 500 });
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
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
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
    const updated = await Technology.findByIdAndUpdate(
      id,
      {
        category,
        items,
        order,
        published,
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update category." }, { status: 500 });
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
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  try {
    await connectDB();
    await Technology.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete category." }, { status: 500 });
  }
}
