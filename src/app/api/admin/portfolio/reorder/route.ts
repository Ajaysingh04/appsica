import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const projectId = String(body.projectId || "").trim();
    const targetPosition = Number(body.targetPosition);

    if (!projectId || !targetPosition || targetPosition < 1) {
      return NextResponse.json(
        { error: "Valid projectId and targetPosition (>= 1) are required." },
        { status: 400 }
      );
    }

    // 1. Direct fetch target project to ensure it exists
    const targetProject = (await Project.findById(projectId).lean()) as any;
    if (!targetProject) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    // 2. Check if moving within demo group or production group
    const isDemo =
      body.isDemo !== undefined ? Boolean(body.isDemo) : Boolean(targetProject.isDemo);
    const filter = isDemo ? { isDemo: true } : { isDemo: { $ne: true } };

    const existingProjects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    const targetIdx = existingProjects.findIndex(
      (p) => String(p._id) === projectId
    );

    if (targetIdx !== -1) {
      const [itemToMove] = existingProjects.splice(targetIdx, 1);
      const destinationIdx = Math.max(
        0,
        Math.min(targetPosition - 1, existingProjects.length)
      );
      existingProjects.splice(destinationIdx, 0, itemToMove);
    } else {
      const destinationIdx = Math.max(
        0,
        Math.min(targetPosition - 1, existingProjects.length)
      );
      existingProjects.splice(destinationIdx, 0, targetProject);
    }

    const ops = existingProjects.map((p, idx) => ({
      updateOne: {
        filter: { _id: p._id },
        update: { $set: { order: idx + 1 } },
      },
    }));

    if (ops.length > 0) {
      await Project.bulkWrite(ops);
    }

    const updatedProjects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, projects: updatedProjects });
  } catch (e: any) {
    console.error("Reorder portfolio error:", e);
    return NextResponse.json(
      { error: e?.message || "Failed to reorder projects." },
      { status: 500 }
    );
  }
}
