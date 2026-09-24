import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function GET() {
  try {
    await connectDB();
    const count = await Admin.countDocuments();
    return NextResponse.json({ adminExists: count > 0, setupComplete: count > 0 });
  } catch {
    return NextResponse.json({ adminExists: false, setupComplete: false });
  }
}
