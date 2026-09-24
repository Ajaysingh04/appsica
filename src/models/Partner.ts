import mongoose, { Schema, models, model } from "mongoose";

const PartnerSchema = new Schema(
  {
    name: { type: String, default: "" },
    image: { type: String, required: true },
    url: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Partner || model("Partner", PartnerSchema);
