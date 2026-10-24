import mongoose, { Schema, models, model } from "mongoose";

const FeatureSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const AppItemSchema = new Schema(
  {
    role: { type: String, default: "customer" }, // "customer" | "vendor" | "delivery" | "custom"
    title: { type: String, default: "" },
    summary: { type: String, default: "" },
    playStoreUrl: { type: String, default: "", trim: true },
    appStoreUrl: { type: String, default: "", trim: true },
    liveLink: { type: String, default: "", trim: true },
    icon: { type: String, default: "" },
    images: [{ type: String }],
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, default: "" },
    description: { type: String, default: "" },
    coverImage: { type: String, required: true },
    images: [{ type: String }],
    features: [FeatureSchema],
    techStack: [{ type: String, trim: true }],
    liveLink: { type: String, default: "" },
    category: { type: String, default: "web", trim: true },
    playStoreUrl: { type: String, default: "", trim: true },
    appStoreUrl: { type: String, default: "", trim: true },
    apps: [AppItemSchema],
    published: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Project || model("Project", ProjectSchema);
