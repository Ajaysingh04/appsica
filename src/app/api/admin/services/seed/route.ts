import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import { defaultServices } from "@/lib/defaultData";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const existingCount = await Service.countDocuments();
    if (existingCount > 0) {
      // Upsert default services
      for (const item of defaultServices) {
        await Service.findOneAndUpdate(
          { slug: item.slug },
          { ...item, published: true },
          { upsert: true, new: true }
        );
      }
    } else {
      await Service.insertMany(
        defaultServices.map((item, index) => ({
          ...item,
          order: index + 1,
          published: true,
        }))
      );
    }

    const services = await Service.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, count: services.length, services });
  } catch (e) {
    console.error("Failed to seed services:", e);
    return NextResponse.json({ error: "Failed to seed services." }, { status: 500 });
  }
}
