import mongoose, { Schema } from "mongoose";

const moduleSchema = new Schema(
  {
    moduleId: String,
    title: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

const Module = mongoose.models.Module || mongoose.model("Module", moduleSchema);

export default Module;
