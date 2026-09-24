import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import Technology from "@/models/Technology";
import { defaultTechnologies } from "@/lib/defaultData";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    for (let i = 0; i < defaultTechnologies.length; i++) {
      await Technology.findOneAndUpdate(
        { category: defaultTechnologies[i].category },
        { ...defaultTechnologies[i], order: i + 1, published: true },
        { upsert: true, new: true }
      );
    }

    const categories = await Technology.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, count: categories.length, categories });
  } catch (e) {
    console.error("Failed to seed technologies:", e);
    return NextResponse.json({ error: "Failed to seed technologies." }, { status: 500 });
  }
}
