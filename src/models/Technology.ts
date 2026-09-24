import mongoose, { Schema, models, model } from "mongoose";

const TechItemSchema = new Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { _id: false }
);

const TechnologySchema = new Schema(
  {
    category: { type: String, required: true },
    items: [TechItemSchema],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Technology || model("Technology", TechnologySchema);
