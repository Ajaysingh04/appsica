import { ServiceService } from "@/services";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const service = await ServiceService.getServiceBySlug(slug);

    if (!service) {
      return apiError("Service not found", 404);
    }

    return apiSuccess({ service });
  } catch (error: any) {
    return apiError(error?.message || "Internal server error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return apiError("Unauthorized", 401);
    }

    const { slug } = await params;
    const body = await request.json();

    const service = await ServiceService.updateServiceBySlug(slug, body);
    return apiSuccess({ service });
  } catch (error: any) {
    return apiError(error?.message || "Failed to update service", 500);
  }
}
