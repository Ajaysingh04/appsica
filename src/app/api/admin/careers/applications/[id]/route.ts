import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

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
    return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const status = String(body.status || "").trim();

    if (!["new", "reviewed", "shortlisted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    await connectDB();
    const app = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: app });
  } catch (error) {
    console.error("Failed to update application status:", error);
    return NextResponse.json({ error: "Failed to update application." }, { status: 500 });
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
    return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
  }

  try {
    await connectDB();
    await JobApplication.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete application:", error);
    return NextResponse.json({ error: "Failed to delete application." }, { status: 500 });
  }
}
