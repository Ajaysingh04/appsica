import { NextResponse } from "next/server";
import { getServicesData } from "@/lib/dbHelper";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await getServicesData();
    return NextResponse.json({
      ServicesData: services,
      services,
    });
  } catch {
    return NextResponse.json({
      ServicesData: [],
      services: [],
    });
  }
}