import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { NewsArticle } from "@/lib/models/types";

/**
 * Cleans unrelated news articles from the Supabase `articles` table.
 *
 * Logic:
 * - Load all article ids, titles, and summaries.
 * - Compute "unrelated" = articles whose title and summary do NOT contain any of the keywords (case-insensitive).
 * - Delete those "unrelated" rows in bulk.
 *
 * Notes:
 * - This route requires the SUPABASE_SERVICE_ROLE_KEY to be set on the server to bypass RLS for deletes.
 *   Do NOT expose this key to the client.
 * - Ensure RLS on `public.articles` is configured so public readers can still select (if desired).
 */

type MinimalArticle = Pick<NewsArticle, "id" | "title" | "summary">;

export async function GET() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Server is missing Supabase configuration. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.",
      },
      { status: 500 },
    );
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Define your relevant keywords (case-insensitive search)
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
  ].map((k) => k.toLowerCase());

  // Load articles (id, title, summary only)
  const { data: allArticles, error: loadError } = await admin
    .from("news_articles")
    .select("id,title,summary");

  if (loadError) {
    return NextResponse.json(
      {
        success: false,
        error: `Failed to load articles: ${loadError.message}`,
      },
      { status: 500 },
    );
  }

  const articles = (allArticles ?? []) as MinimalArticle[];

  // Compute unrelated = title and summary both do NOT contain any keyword
  const isRelated = (a: MinimalArticle): boolean => {
    const title = (a.title ?? "").toLowerCase();
    const summary = (a.summary ?? "").toLowerCase();
    return keywords.some((kw) => title.includes(kw) || summary.includes(kw));
  };

  const unrelated = articles.filter((a) => !isRelated(a));
  const unrelatedIds = unrelated.map((a) => a.id);

  if (unrelatedIds.length === 0) {
    return NextResponse.json({
      success: true,
      message: "No unrelated articles found.",
      deletedCount: 0,
      checked: articles.length,
    });
  }

  // Delete unrelated articles in bulk and return count
  const { data: deletedRows, error: deleteError } = await admin
    .from("news_articles")
    .delete()
    .in("id", unrelatedIds)
    .select("id");

  if (deleteError) {
    return NextResponse.json(
      {
        success: false,
        error: `Failed to delete unrelated articles: ${deleteError.message}`,
      },
      { status: 500 },
    );
  }

  const deletedCount = (deletedRows ?? []).length;

  return NextResponse.json({
    success: true,
    message: "Cleaned up unrelated articles.",
    deletedCount,
    checked: articles.length,
  });
}
