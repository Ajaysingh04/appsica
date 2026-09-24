import { PartnerService } from "@/services";
import { apiSuccess, apiError } from "@/lib/apiResponse";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const partners = await PartnerService.getAllPartners();
    return apiSuccess({ partners });
  } catch (error: any) {
    return apiError(error?.message || "Failed to fetch partners", 500);
  }
}
