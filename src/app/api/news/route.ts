import { NextResponse } from "next/server";
import Parser from "rss-parser";
import connectMongoDB from "@/app/lib/mongodbConnection";
import Article from "@/app/lib/models/Article";

const parser = new Parser();

// 📰 Google News RSS feeds with search filters
const RSS_FEEDS = [
  "https://news.google.com/rss/search?q=fake+social+media+ads+OR+online+scam+OR+fake+advertisement+OR+phishing&hl=en&gl=PH&ceid=PH:en",
  "https://news.google.com/rss/search?q=facebook+scam+OR+instagram+scam+OR+tiktok+ad+fraud&hl=en&gl=PH&ceid=PH:en",
];

// 🧩 Extract image from enclosure or content
function extractImage(item: any): string | null {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item["media:thumbnail"]?.url) return item["media:thumbnail"].url;
  if (item["media:content"]?.url) return item["media:content"].url;

  const html = item["content:encoded"] || item.content || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

export async function GET() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await connectMongoDB();

    const relevantArticles: any[] = [];

    for (const feed of RSS_FEEDS) {
      try {
        console.log("Fetching feed:", feed);
        const parsed = await parser.parseURL(feed);
        const source = parsed.title || "Google News";

        for (const item of parsed.items) {
          if (!item.link || !item.title) continue;

          relevantArticles.push({
            title: item.title,
            summary: item.contentSnippet || "",
            link: item.link,
            thumbnail: extractImage(item),
            source,
            publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
          });
        }
      } catch (err) {
        console.error("⚠️ Error fetching feed:", feed, err);
      }
    }

    console.log(
      `🧾 ${relevantArticles.length} relevant Google News articles found.`
    );

    // Avoid duplicates
    let added = 0;
    for (const art of relevantArticles) {
      const exists = await Article.findOne({ link: art.link });
      if (!exists) {
        await Article.create(art);
        added++;
      }
    }

    const latest = await Article.find().sort({ publishedAt: -1 }).limit(20);

    return NextResponse.json({
      success: true,
      added,
      total: latest.length,
      articles: latest,
    });
  } catch (err: any) {
    console.error("❌ API error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
