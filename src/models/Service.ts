import mongoose, { Schema, models, model } from "mongoose";

const FeatureSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const DemoLinkSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, default: "solar:code-linear" },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    detail: { type: String, default: "" },
    features: [FeatureSchema],
    demoLinks: [DemoLinkSchema],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Service || model("Service", ServiceSchema);
