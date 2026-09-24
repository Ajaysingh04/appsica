import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function POST(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: "MONGODB_URI is not configured in .env.local" },
        { status: 500 }
      );
    }

    await connectDB();
    const existing = await Admin.countDocuments();
    if (existing > 0) {
      return NextResponse.json(
        { error: "An administrator account already exists. Please login." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await Admin.create({ email, passwordHash, name: name || "Admin" });

    return NextResponse.json({ ok: true, success: true });
  } catch (e: any) {
    console.error("Setup error:", e);
    return NextResponse.json(
      { error: e?.message || "Setup failed. Check MongoDB connection." },
      { status: 500 }
    );
  }
}
