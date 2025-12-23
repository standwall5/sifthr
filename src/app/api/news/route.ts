import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { supabase } from "@/app/lib/supabaseClient";

type FeedItem = {
  link?: string;
  title?: string;
  contentSnippet?: string;
  content?: string;
  "content:encoded"?: string;
  isoDate?: string;
  enclosure?: { url?: string };
  "media:thumbnail"?: { url?: string };
  "media:content"?: { url?: string };
};

const parser = new Parser<FeedItem>();

const RSS_FEEDS: string[] = [
  "https://news.google.com/rss/search?q=fake+social+media+ads+OR+online+scam+OR+fake+advertisement+OR+phishing&hl=en&gl=PH&ceid=PH:en",
  "https://news.google.com/rss/search?q=facebook+scam+OR+instagram+scam+OR+tiktok+ad+fraud&hl=en&gl=PH&ceid=PH:en",
];

function extractImage(item: FeedItem): string | null {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item["media:thumbnail"]?.url) return item["media:thumbnail"].url;
  if (item["media:content"]?.url) return item["media:content"].url;

  const html = item["content:encoded"] || item.content || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

export async function GET() {
  try {
    const relevantArticles: Array<{
      title: string;
      summary: string;
      link: string;
      thumbnail: string | null;
      source: string;
      published_at: string;
    }> = [];

    for (const feed of RSS_FEEDS) {
      try {
        const parsed = await parser.parseURL(feed);
        const source = parsed.title ?? "Google News";

        for (const item of parsed.items ?? []) {
          if (!item.link || !item.title) continue;

          relevantArticles.push({
            title: item.title,
            summary: item.contentSnippet ?? "",
            link: item.link,
            thumbnail: extractImage(item),
            source,
            published_at: item.isoDate
              ? new Date(item.isoDate).toISOString()
              : new Date().toISOString(),
          });
        }
      } catch {
        // continue on next feed
      }
    }

    // Save to database (upsert to avoid duplicates based on link)
    const articlesToSave = relevantArticles.slice(0, 20);

    for (const article of articlesToSave) {
      await supabase.from("news_articles").upsert(
        {
          title: article.title,
          summary: article.summary,
          link: article.link,
          thumbnail: article.thumbnail,
          source: article.source,
          published_at: article.published_at,
        },
        { onConflict: "link" },
      );
    }

    return NextResponse.json({
      success: true,
      total: relevantArticles.length,
      saved: articlesToSave.length,
      message: "Articles fetched and saved to database",
    });
  } catch (e: unknown) {
    let message = "Unexpected error";
    if (e instanceof Error) {
      message = e.message;
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
