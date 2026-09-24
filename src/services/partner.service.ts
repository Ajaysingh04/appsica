import connectDB from "@/lib/mongodb";
import Partner from "@/models/Partner";
import { defaultPartners } from "@/lib/defaultData";
import { IPartner } from "@/types";

export class PartnerService {
  static async getAllPartners(): Promise<IPartner[]> {
    try {
      await connectDB();
      const partners = await Partner.find({ published: { $ne: false } })
        .sort({ order: 1, createdAt: 1 })
        .lean();

      if (partners && partners.length > 0) {
        return partners as unknown as IPartner[];
      }
      return defaultPartners as unknown as IPartner[];
    } catch {
      return defaultPartners as unknown as IPartner[];
    }
  }
}
