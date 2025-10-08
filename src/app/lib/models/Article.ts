// lib/models/Article.ts
import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
  title: String,
  summary: String,
  link: { type: String, unique: true },
  imageUrl: String, // <--- add this line
  source: String,
  publishedAt: Date,
});

export default mongoose.models.Article ||
  mongoose.model("Article", ArticleSchema);
