import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import JobRole from "@/models/JobRole";
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
    return NextResponse.json({ error: "Invalid role ID" }, { status: 400 });
  }

  try {
    await connectDB();
    const role = await JobRole.findById(id).lean();
    if (!role) {
      return NextResponse.json({ error: "Job role not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error("Failed to load job role:", error);
    return NextResponse.json({ error: "Failed to load job role." }, { status: 500 });
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
    return NextResponse.json({ error: "Invalid role ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    let slug = String(body.slug || "").trim().toLowerCase();
    const department = String(body.department || "Software Engineering").trim();
    const category = String(body.category || "engineering").trim();
    const location = String(body.location || "Indore HQ / Hybrid").trim();
    const experience = String(body.experience || "2 - 5 Years").trim();
    const type = String(body.type || "Full-Time").trim();
    const description = String(body.description || "").trim();
    const linkedinUrl = String(body.linkedinUrl || "").trim();
    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : true;
    const order = Number(body.order) || 0;

    const skills = Array.isArray(body.skills)
      ? body.skills.map((s: string) => String(s).trim()).filter(Boolean)
      : typeof body.skills === "string"
      ? body.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const responsibilities = Array.isArray(body.responsibilities)
      ? body.responsibilities.map((r: string) => String(r).trim()).filter(Boolean)
      : typeof body.responsibilities === "string"
      ? body.responsibilities.split("\n").map((r: string) => r.trim()).filter(Boolean)
      : [];

    if (!title) {
      return NextResponse.json({ error: "Job title is required." }, { status: 400 });
    }

    if (!slug) slug = slugify(title);

    await connectDB();

    const role = await JobRole.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        department,
        category,
        location,
        experience,
        type,
        description,
        skills,
        responsibilities,
        linkedinUrl,
        isActive,
        order,
      },
      { new: true, runValidators: true }
    ).lean();

    if (!role) {
      return NextResponse.json({ error: "Job role not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, role });
  } catch (error: unknown) {
    const code = (error as { code?: number })?.code;
    if (code === 11000) {
      return NextResponse.json(
        { error: "A role with this slug already exists." },
        { status: 409 }
      );
    }
    console.error("Failed to update job role:", error);
    return NextResponse.json({ error: "Failed to update job role." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid role ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const updateData: Record<string, unknown> = {};
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
    if (body.linkedinUrl !== undefined) updateData.linkedinUrl = String(body.linkedinUrl).trim();
    if (body.order !== undefined) updateData.order = Number(body.order);

    const role = await JobRole.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!role) {
      return NextResponse.json({ error: "Job role not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error("Failed to patch job role:", error);
    return NextResponse.json({ error: "Failed to update job role." }, { status: 500 });
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
    return NextResponse.json({ error: "Invalid role ID" }, { status: 400 });
  }

  try {
    await connectDB();
    await JobRole.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete job role:", error);
    return NextResponse.json({ error: "Failed to delete job role." }, { status: 500 });
  }
}
