export interface IBlog {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
