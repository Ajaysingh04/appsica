import { PortfolioService } from "@/services";
import { apiSuccess, apiError } from "@/lib/apiResponse";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const list = await PortfolioService.getAllProjects();
    return apiSuccess({ projects: list });
  } catch (error: any) {
    return apiError(error?.message || "Failed to fetch portfolio", 500);
  }
}
