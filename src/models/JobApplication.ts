import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplicationModel extends Document {
  name: string;
  email: string;
  phone: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplicationModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    role: { type: String, default: "General Application", trim: true },
    experience: { type: String, default: "", trim: true },
    skills: { type: String, default: "", trim: true },
    resumeUrl: { type: String, default: "", trim: true },
    resumeAttachment: {
      filename: { type: String, default: "" },
      content: { type: String, default: "" },
    },
    message: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["new", "reviewed", "shortlisted", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.models.JobApplication ||
  mongoose.model<IJobApplicationModel>("JobApplication", JobApplicationSchema);
