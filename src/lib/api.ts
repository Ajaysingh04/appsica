import {
  ISiteSettings,
  IService,
  IProject,
  ITechCategory,
  IWorkflowStep,
  ISuccessProject,
  IPartner,
  IContactFormInput,
  IContactResponse,
} from "@/types";
import {
  defaultSiteSettings,
  defaultServices,
  defaultPortfolio,
  defaultTechnologies,
  defaultWorkflowSteps,
  defaultSuccessProjects,
  defaultPartners,
} from "./defaultData";

export async function fetchSiteSettings(): Promise<ISiteSettings> {
  try {
    const res = await fetch("/api/settings", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.settings) return data.settings;
    }
  } catch (err) {
    console.warn("Using fallback site settings:", err);
  }
  return defaultSiteSettings as ISiteSettings;
}

export async function fetchServices(): Promise<IService[]> {
  try {
    const res = await fetch("/api/services", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const list = data.ServicesData || data.services || [];
      if (list.length > 0) return list;
    }
  } catch (err) {
    console.warn("Using fallback services:", err);
  }
  return defaultServices as unknown as IService[];
}

export async function fetchServiceBySlug(slug: string): Promise<IService | null> {
  try {
    const res = await fetch(`/api/services/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.service) return data.service;
    }
  } catch (err) {
    console.warn(`Using fallback service for slug: ${slug}`, err);
  }
  const found = defaultServices.find((s) => s.slug === slug);
  return (found as unknown as IService) || null;
}

export async function fetchPortfolio(): Promise<IProject[]> {
  try {
    const res = await fetch("/api/portfolio", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const list = data.projects || [];
      if (list.length > 0) return list;
    }
  } catch (err) {
    console.warn("Using fallback portfolio:", err);
  }
  return defaultPortfolio as unknown as IProject[];
}

export async function fetchTechnologies(): Promise<ITechCategory[]> {
  try {
    const res = await fetch("/api/technologies", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.techStack && data.techStack.length > 0) return data.techStack;
    }
  } catch (err) {
    console.warn("Using fallback tech stack:", err);
  }
  return defaultTechnologies as unknown as ITechCategory[];
}

export async function fetchWorkflow(): Promise<{
  steps: IWorkflowStep[];
  successProjects: ISuccessProject[];
}> {
  try {
    const res = await fetch("/api/workflow", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return {
        steps: data.steps || defaultWorkflowSteps,
        successProjects: data.successProjects || defaultSuccessProjects,
      };
    }
  } catch (err) {
    console.warn("Using fallback workflow:", err);
  }
  return {
    steps: defaultWorkflowSteps as unknown as IWorkflowStep[],
    successProjects: defaultSuccessProjects,
  };
}

export async function fetchPartners(): Promise<IPartner[]> {
  try {
    const res = await fetch("/api/partners", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.partners && data.partners.length > 0) return data.partners;
    }
  } catch (err) {
    console.warn("Using fallback partners:", err);
  }
  return defaultPartners as unknown as IPartner[];
}

export async function submitContactForm(
  formData: IContactFormInput
): Promise<IContactResponse> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to submit request.");
  }
  return data;
}
