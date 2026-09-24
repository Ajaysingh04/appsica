import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import { defaultServices } from "@/lib/defaultData";
import { IService } from "@/types";

export class ServiceService {
  static async getAllServices(): Promise<IService[]> {
    try {
      await connectDB();
      const services = await Service.find({ published: { $ne: false } })
        .sort({ order: 1, createdAt: 1 })
        .lean();

      if (services && services.length > 0) {
        return services as unknown as IService[];
      }
      return defaultServices as unknown as IService[];
    } catch {
      return defaultServices as unknown as IService[];
    }
  }

  static async getServiceBySlug(slug: string): Promise<IService | null> {
    try {
      await connectDB();
      const service = await Service.findOne({ slug, published: { $ne: false } }).lean();
      if (service) return service as unknown as IService;
    } catch {
      // fallback
    }
    const found = defaultServices.find((s) => s.slug === slug);
    return (found as unknown as IService) || null;
  }

  static async createService(data: Partial<IService>) {
    await connectDB();
    return Service.create(data);
  }

  static async updateServiceBySlug(slug: string, data: Partial<IService>) {
    await connectDB();
    return Service.findOneAndUpdate({ slug }, data, { new: true, upsert: true });
  }
}
