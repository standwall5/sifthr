import mongoose, { Schema } from "mongoose";

const moduleSectionSchema = new Schema(
  {
    sectionId: Number,
    moduleId: Number,
    title: String,
    content: String,
    mediaUrl: String,
    position: Number,
  },
  { timestamps: true }
);

const ModuleSection =
  mongoose.models.ModuleSection ||
  mongoose.model("ModuleSection", moduleSectionSchema);

export default ModuleSection;
