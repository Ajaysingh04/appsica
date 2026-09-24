import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import JobRole from "@/models/JobRole";
import { defaultJobRoles } from "@/lib/defaultJobs";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    for (const item of defaultJobRoles) {
      await JobRole.findOneAndUpdate(
        { slug: item.slug },
        { $setOnInsert: item },
        { upsert: true, new: true }
      );
    }

    const roles = await JobRole.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({
      success: true,
      message: `Seeded ${defaultJobRoles.length} default job roles successfully.`,
      roles,
    });
  } catch (error) {
    console.error("Failed to seed default job roles:", error);
    return NextResponse.json({ error: "Failed to seed default job roles." }, { status: 500 });
  }
}
