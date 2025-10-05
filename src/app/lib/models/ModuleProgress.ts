import mongoose, { Schema } from "mongoose";

// Behavior:
// - Updates whenever user starts a module
// - Updates whenever user progresses/next page

const moduleProgressSchema = new Schema(
  {
    _id: String,
    moduleId: String, //moduleId ObjectId
    userId: String,
    position: Number,
    totalPages: Number,
  },
  {
    timestamps: true,
  }
);

const ModuleProgress =
  mongoose.models.ModuleProgress ||
  mongoose.model("ModuleProgress", moduleProgressSchema);

export default ModuleProgress;
