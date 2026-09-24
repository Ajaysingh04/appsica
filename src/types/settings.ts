export interface ISocialLinks {
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  github?: string;
}

export interface IHeroSectionSettings {
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  videoUrl?: string;
}

export interface ISectionHeaderSettings {
  badge: string;
  title: string;
  subtitle?: string;
  description?: string;
  viewAllText?: string;
}

export interface ICTASettings {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface IFooterSettings {
  aboutText: string;
  copyrightText: string;
}

export interface ISiteSettings {
  _id?: string;
  companyName: string;
  tagline: string;
  phone: string;
  whatsapp?: string;
  emails: string[];
  address: string;
  mapUrl: string;
  socialLinks: ISocialLinks;
  hero: IHeroSectionSettings;
  servicesSection: ISectionHeaderSettings;
  portfolioSection: ISectionHeaderSettings;
  technologiesSection: ISectionHeaderSettings;
  workflowSection: ISectionHeaderSettings;
  partnersSection: {
    badge: string;
    description: string;
  };
  ctaSection: ICTASettings;
  footer: IFooterSettings;
  createdAt?: string;
  updatedAt?: string;
}
