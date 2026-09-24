import mongoose, { Schema, models, model } from "mongoose";

const WorkflowStepSchema = new Schema(
  {
    number: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    icon: { type: String, default: "material-symbols:lightbulb-outline-rounded" },
    details: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Workflow || model("Workflow", WorkflowStepSchema);
