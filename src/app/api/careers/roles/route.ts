import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import JobRole from "@/models/JobRole";
import { defaultJobRoles } from "@/lib/defaultJobs";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("all") === "true";

    await connectDB();
    const query = includeInactive ? {} : { isActive: { $ne: false } };
    const roles = await JobRole.find(query).sort({ order: 1, createdAt: 1 }).lean();

    if (roles && roles.length > 0) {
      return NextResponse.json({ success: true, roles });
    }

    // Fallback to default job roles if DB has no roles yet
    const fallbackRoles = includeInactive
      ? defaultJobRoles
      : defaultJobRoles.filter((r) => r.isActive !== false);

    return NextResponse.json({ success: true, roles: fallbackRoles, isDefault: true });
  } catch (error) {
    console.error("Failed to fetch job roles:", error);
    return NextResponse.json({
      success: true,
      roles: defaultJobRoles.filter((r) => r.isActive !== false),
      isDefault: true,
    });
  }
}
