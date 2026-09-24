import mongoose, { Schema, Document } from "mongoose";

export interface IJobRoleModel extends Document {
  title: string;
  slug: string;
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
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobRoleSchema = new Schema<IJobRoleModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    department: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["engineering", "cloud", "design", "ai", "other"],
      default: "engineering",
    },
    location: { type: String, default: "Indore HQ / Hybrid", trim: true },
    experience: { type: String, default: "2 - 5 Years", trim: true },
    type: { type: String, default: "Full-Time", trim: true },
    description: { type: String, default: "", trim: true },
    skills: { type: [String], default: [] },
    responsibilities: { type: [String], default: [] },
    linkedinUrl: { type: String, default: "", trim: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.JobRole ||
  mongoose.model<IJobRoleModel>("JobRole", JobRoleSchema);
