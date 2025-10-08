import { NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodbConnection";
import Article from "@/app/lib/models/Article";

export async function GET() {
  await connectMongoDB();

  // Define your relevant keywords
  const keywords = [
    "fake ad",
    "fake advertisement",
    "scam",
    "fraud",
    "phishing",
    "social media scam",
    "facebook scam",
    "instagram scam",
    "tiktok scam",
  ];

  // Make a case-insensitive regex from all keywords
  const regex = new RegExp(keywords.join("|"), "i");

  // Find unrelated articles
  const unrelated = await Article.find({
    $or: [{ title: { $not: regex } }, { summary: { $not: regex } }],
  });

  // Delete them
  const result = await Article.deleteMany({
    $or: [{ title: { $not: regex } }, { summary: { $not: regex } }],
  });

  return NextResponse.json({
    success: true,
    message: "Cleaned up unrelated articles.",
    deletedCount: result.deletedCount,
    checked: unrelated.length,
  });
}
