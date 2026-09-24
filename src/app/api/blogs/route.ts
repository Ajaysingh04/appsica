import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { professionalDummyBlogs } from "@/lib/dummyBlogs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limitParam = Number(url.searchParams.get("limit") || 0);

    await connectDB();
    let query = Blog.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .select("title slug excerpt coverImage createdAt");

    if (limitParam > 0) {
      query = query.limit(limitParam);
    }

    const blogs = await query.lean();
    
    // Fallback to dummy data if database is empty
    if (!blogs || blogs.length === 0) {
      return NextResponse.json({ 
        blogs: limitParam > 0 ? professionalDummyBlogs.slice(0, limitParam) : professionalDummyBlogs 
      });
    }

    return NextResponse.json({ blogs });
  } catch (error) {
    // Fallback to dummy data if database connection fails
    const url = new URL(request.url);
    const limitParam = Number(url.searchParams.get("limit") || 0);
    return NextResponse.json({ 
      blogs: limitParam > 0 ? professionalDummyBlogs.slice(0, limitParam) : professionalDummyBlogs 
    });
  }
}
