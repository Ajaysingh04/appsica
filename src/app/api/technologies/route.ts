import { TechService } from "@/services";
import { apiSuccess, apiError } from "@/lib/apiResponse";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const techStack = await TechService.getAllTechnologies();
    return apiSuccess({ techStack });
  } catch (error: any) {
    return apiError(error?.message || "Failed to fetch technologies", 500);
  }
}
