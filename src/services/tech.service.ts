import connectDB from "@/lib/mongodb";
import Technology from "@/models/Technology";
import { defaultTechnologies } from "@/lib/defaultData";
import { ITechCategory } from "@/types";

export class TechService {
  static async getAllTechnologies(): Promise<ITechCategory[]> {
    try {
      await connectDB();
      const techs = await Technology.find({ published: { $ne: false } })
        .sort({ order: 1, createdAt: 1 })
        .lean();

      if (techs && techs.length > 0) {
        return techs as unknown as ITechCategory[];
      }
      return defaultTechnologies as unknown as ITechCategory[];
    } catch {
      return defaultTechnologies as unknown as ITechCategory[];
    }
  }
}
