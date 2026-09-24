export interface IJobRole {
  _id?: string;
  id?: string;
  title: string;
  slug?: string;
  department: string;
  category: "engineering" | "cloud" | "design" | "ai" | "other";
  location: string;
  experience: string;
  type: string;
  description: string;
  skills: string[];
  responsibilities: string[];
  linkedinUrl?: string;
  isActive: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IJobApplication {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  experience: string;
  skills: string;
  resumeUrl?: string;
  resumeAttachment?: {
    filename: string;
    content?: string;
  };
  message: string;
  status: "new" | "reviewed" | "shortlisted" | "rejected";
  createdAt: string;
  updatedAt?: string;
}
