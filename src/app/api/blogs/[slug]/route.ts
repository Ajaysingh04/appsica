import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const blog = await Blog.findOne({
      slug: slug.toLowerCase(),
      published: true,
    }).lean();

    if (!blog) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
