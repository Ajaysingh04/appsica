export interface IProjectFeature {
  title: string;
  description: string;
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
  order?: number;
  published?: boolean;
  isDemo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
