import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

import { professionalDummyBlogs } from "@/lib/dummyBlogs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    try {
      await connectDB();
      const blog = await Blog.findOne({
        slug: slug.toLowerCase(),
        published: true,
      }).lean();

      if (blog) {
        return NextResponse.json({ blog });
      }
    } catch {
      // db error, fallback to dummy
    }

    const dummy = professionalDummyBlogs.find(
      (b) => b.slug === slug.toLowerCase()
    );
    if (dummy) {
      return NextResponse.json({ blog: dummy });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
