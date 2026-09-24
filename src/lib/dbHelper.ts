import connectDB from "./mongodb";
import SiteSettings from "@/models/SiteSettings";
import Service from "@/models/Service";
import Technology from "@/models/Technology";
import Workflow from "@/models/Workflow";
import Partner from "@/models/Partner";
import Project from "@/models/Project";
import {
  defaultSiteSettings,
  defaultServices,
  defaultTechnologies,
  defaultWorkflowSteps,
  defaultSuccessProjects,
  defaultPartners,
} from "./defaultData";

export async function getSiteSettingsData() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      try {
        const created = await SiteSettings.create(defaultSiteSettings);
        settings = created.toObject();
      } catch {
        return defaultSiteSettings;
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
    };
  } catch {
    return defaultSiteSettings;
  }
}

export async function getServicesData() {
  try {
    await connectDB();
    const services = await Service.find({ published: { $ne: false } })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    if (services && services.length > 0) {
      return services;
    }
    return defaultServices;
  } catch {
    return defaultServices;
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    await connectDB();
    const service = await Service.findOne({ slug, published: { $ne: false } }).lean();
    if (service) return service;
  } catch {
    // ignore
  }
  return defaultServices.find((s) => s.slug === slug) || null;
}

export async function getTechnologiesData() {
  try {
    await connectDB();
    const techs = await Technology.find({ published: { $ne: false } })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    if (techs && techs.length > 0) {
      return techs;
    }
    return defaultTechnologies;
  } catch {
    return defaultTechnologies;
  }
}

export async function getWorkflowData() {
  try {
    await connectDB();
    const steps = await Workflow.find().sort({ order: 1, createdAt: 1 }).lean();
    return {
      steps: steps && steps.length > 0 ? steps : defaultWorkflowSteps,
      successProjects: defaultSuccessProjects,
    };
  } catch {
    return {
      steps: defaultWorkflowSteps,
      successProjects: defaultSuccessProjects,
    };
  }
}

export async function getPartnersData() {
  try {
    await connectDB();
    const partners = await Partner.find({ published: { $ne: false } })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    if (partners && partners.length > 0) {
      return partners;
    }
    return defaultPartners;
  } catch {
    return defaultPartners;
  }
}

export async function getPortfolioData(includeDemo = false) {
  try {
    await connectDB();
    const filter: any = { published: { $ne: false } };
    if (!includeDemo) {
      filter.isDemo = { $ne: true };
    }
    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (projects && projects.length > 0) {
      return projects.map((p) => ({
        _id: String(p._id),
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        description: p.description,
        coverImage: p.coverImage,
        image: p.coverImage,
        images: p.images || [],
        liveLink: p.liveLink,
        isDemo: Boolean(p.isDemo),
        order: p.order,
      }));
    }
    return [];
  } catch {
    return [];
  }
}
