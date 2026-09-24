import connectDB from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { defaultSiteSettings } from "@/lib/defaultData";
import { ISiteSettings } from "@/types";

export class SettingsService {
  static async getSettings(): Promise<ISiteSettings> {
    try {
      await connectDB();
      let settings = await SiteSettings.findOne().lean();
      if (!settings) {
        try {
          const created = await SiteSettings.create(defaultSiteSettings);
          settings = created.toObject();
        } catch {
          return defaultSiteSettings as ISiteSettings;
        }
      }
      return {
        ...defaultSiteSettings,
        ...settings,
        socialLinks: {
          ...defaultSiteSettings.socialLinks,
          ...(settings?.socialLinks || {}),
        },
        hero: {
          ...defaultSiteSettings.hero,
          ...(settings?.hero || {}),
        },
        servicesSection: {
          ...defaultSiteSettings.servicesSection,
          ...(settings?.servicesSection || {}),
        },
        portfolioSection: {
          ...defaultSiteSettings.portfolioSection,
          ...(settings?.portfolioSection || {}),
        },
        technologiesSection: {
          ...defaultSiteSettings.technologiesSection,
          ...(settings?.technologiesSection || {}),
        },
        workflowSection: {
          ...defaultSiteSettings.workflowSection,
          ...(settings?.workflowSection || {}),
        },
        partnersSection: {
          ...defaultSiteSettings.partnersSection,
          ...(settings?.partnersSection || {}),
        },
        ctaSection: {
          ...defaultSiteSettings.ctaSection,
          ...(settings?.ctaSection || {}),
        },
        footer: {
          ...defaultSiteSettings.footer,
          ...(settings?.footer || {}),
        },
      } as ISiteSettings;
    } catch {
      return defaultSiteSettings as ISiteSettings;
    }
  }

  static async updateSettings(data: Partial<ISiteSettings>) {
    await connectDB();
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(data);
    } else {
      Object.assign(settings, data);
      await settings.save();
    }
    return settings;
  }
}
