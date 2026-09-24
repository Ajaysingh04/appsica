import { WorkflowService } from "@/services";
import { apiSuccess, apiError } from "@/lib/apiResponse";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await WorkflowService.getWorkflowData();
    return apiSuccess(data);
  } catch (error: any) {
    return apiError(error?.message || "Failed to fetch workflow", 500);
  }
}
