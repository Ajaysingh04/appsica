import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import JobRole from "@/models/JobRole";

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
    const roles = await JobRole.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, roles });
  } catch (error) {
    console.error("Failed to load job roles:", error);
    return NextResponse.json({ error: "Failed to load job roles." }, { status: 500 });
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

    // Check if slug exists
    const existing = await JobRole.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const jobRole = await JobRole.create({
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
    });

    return NextResponse.json({ success: true, role: jobRole });
  } catch (error: unknown) {
    const code = (error as { code?: number })?.code;
    if (code === 11000) {
      return NextResponse.json(
        { error: "A role with this title or slug already exists." },
        { status: 409 }
      );
    }
    console.error("Failed to create job role:", error);
    return NextResponse.json({ error: "Failed to create job role." }, { status: 500 });
  }
}
