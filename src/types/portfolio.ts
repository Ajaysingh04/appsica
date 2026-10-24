export interface IProjectFeature {
  title: string;
  description: string;
}

export interface IProjectApp {
  role?: "customer" | "vendor" | "delivery" | "custom" | string;
  title: string;
  summary?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  liveLink?: string;
  icon?: string;
  images?: string[];
}

export interface IProject {
  _id?: string;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  coverImage: string;
  image?: string;
  images?: string[];
  features?: IProjectFeature[];
  techStack?: string[];
  liveLink?: string;
  category?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  apps?: IProjectApp[];
  order?: number;
  published?: boolean;
  isDemo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
