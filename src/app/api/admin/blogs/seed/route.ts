import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { professionalDummyBlogs } from "@/lib/dummyBlogs";

export async function POST() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    
    // Check if blogs already exist to avoid duplicate seeding
    const existingCount = await Blog.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({ message: "Database already has blogs. Seeding skipped." });
    }

    // Insert dummy blogs
    await Blog.insertMany(professionalDummyBlogs.map((b, i) => ({
      ...b,
      order: i
    })));

    return NextResponse.json({ success: true, message: "Sample blogs seeded successfully!" });
  } catch (e: any) {
    console.error("Seeding error:", e);
    return NextResponse.json({ error: "Failed to seed blogs. Check MongoDB connection." }, { status: 500 });
  }
}
