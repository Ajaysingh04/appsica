import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";
import ContactMessage from "@/models/ContactMessage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    await connectDB();
    const query = status && status !== "all" ? { status } : {};
    const applications = await JobApplication.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // If no applications in JobApplication collection yet, also check if any exist in ContactMessage with source "career-application"
    if (!applications || applications.length === 0) {
      const legacyCareerMessages = await ContactMessage.find({
        $or: [{ source: "career-application" }, { project: { $regex: /Resume:/i } }],
      })
        .sort({ createdAt: -1 })
        .lean();

      if (legacyCareerMessages && legacyCareerMessages.length > 0) {
        // Map legacy messages to application shape for smooth backward compatibility
        const mapped = legacyCareerMessages.map((m) => {
          const roleMatch = m.projectName?.match(/Role:\s*([^|]+)/i);
          const role = roleMatch ? roleMatch[1].trim() : "General Application";

          const skillsMatch = m.message?.match(/\[Skills:\s*([^\]]+)\]/i);
          const skills = skillsMatch ? skillsMatch[1].trim() : "";

          const resumeMatch = m.message?.match(/\[Resume:\s*([^\]]+)\]/i);
          const resumeUrl = resumeMatch && !resumeMatch[1].includes("Not provided") ? resumeMatch[1].trim() : "";

          return {
            _id: m._id.toString(),
            name: m.name,
            email: m.email,
            phone: m.phone || "",
            role,
            experience: "",
            skills,
            resumeUrl,
            message: m.message || "",
            status: "new" as const,
            createdAt: m.createdAt,
          };
        });

        return NextResponse.json({ success: true, applications: mapped });
      }
    }

    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error("Failed to load job applications:", error);
    return NextResponse.json(
      { error: "Failed to load job applications." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Application ID is required." }, { status: 400 });
    }

    await connectDB();
    await JobApplication.findByIdAndDelete(id);
    await ContactMessage.findByIdAndDelete(id).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete application:", error);
    return NextResponse.json({ error: "Failed to delete application." }, { status: 500 });
  }
}
