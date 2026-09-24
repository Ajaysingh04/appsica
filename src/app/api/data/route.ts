import { NextResponse } from "next/server";
import {
  getTechnologiesData,
  getPartnersData,
  getPortfolioData,
  getServicesData,
} from "@/lib/dbHelper";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const [techStack, partners, portfolio, services] = await Promise.all([
      getTechnologiesData(),
      getPartnersData(),
      getPortfolioData(),
      getServicesData(),
    ]);

    return NextResponse.json({
      Technologies: techStack,
      Portfolio: portfolio,
      partners: partners,
      Services: services,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch aggregated data" },
      { status: 500 }
    );
  }
};