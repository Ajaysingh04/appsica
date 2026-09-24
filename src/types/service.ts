export interface IServiceFeature {
  title: string;
  description: string;
}

export interface IServiceDemoLink {
  name: string;
  url: string;
}

export interface IService {
  _id?: string;
  title: string;
  slug: string;
  icon: string;
  image?: string;
  description: string;
  detail: string;
  features: IServiceFeature[];
  demoLinks?: IServiceDemoLink[];
  order?: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
