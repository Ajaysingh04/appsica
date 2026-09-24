import { SettingsService } from "@/services";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await SettingsService.getSettings();
    return apiSuccess({ settings });
  } catch (error: any) {
    return apiError(error?.message || "Failed to fetch settings", 500);
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return apiError("Unauthorized", 401);
    }

    const body = await request.json();
    const settings = await SettingsService.updateSettings(body);
    return apiSuccess({ settings });
  } catch (error: any) {
    return apiError(error?.message || "Failed to update settings", 500);
  }
}
