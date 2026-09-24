import { ServiceService } from "@/services";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await ServiceService.getAllServices();
    return apiSuccess({
      ServicesData: services,
      services,
    });
  } catch (error: any) {
    return apiError(error?.message || "Failed to fetch services", 500);
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return apiError("Unauthorized", 401);
    }

    const body = await request.json();
    const service = await ServiceService.createService(body);
    return apiSuccess({ service }, { status: 201 });
  } catch (error: any) {
    return apiError(error?.message || "Failed to create service", 500);
  }
}
