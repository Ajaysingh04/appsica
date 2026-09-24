import mongoose, { Schema, models, model } from "mongoose";

const FeatureSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
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
    published: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Project || model("Project", ProjectSchema);
