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

// Direct RSS feeds from trusted sources
const RSS_FEEDS: string[] = [
  // Philippines News - Major outlets
  "https://www.rappler.com/feed/",
  "https://www.gmanetwork.com/news/rss/",
  "https://www.philstar.com/rss/headlines",
  "https://newsinfo.inquirer.net/feed",
  "https://www.cnnphilippines.com/feed",

  // Tech/Security news
  "https://feeds.feedburner.com/TechCrunch/",
  "https://www.wired.com/feed/rss",
  "https://www.theverge.com/rss/index.xml",

  // Still use Google News but for specific searches
  "https://news.google.com/rss/search?q=philippines+scholarship+scam&hl=en&gl=PH&ceid=PH:en",
  "https://news.google.com/rss/search?q=online+scam+philippines&hl=en&gl=PH&ceid=PH:en",
];

// Trusted news sources - for filtering Google News results
const TRUSTED_SOURCES = [
  // Philippines
  "rappler.com",
  "inquirer.net",
  "abs-cbn.com",
  "gma.network",
  "philstar.com",
  "manilatimes.net",
  "sunstar.com.ph",
  "pna.gov.ph",
  "cnnphilippines.com",
  "mb.com.ph",
  // International
  "bbc.com",
  "cnn.com",
  "reuters.com",
  "apnews.com",
  "theguardian.com",
  "nytimes.com",
  // Tech
  "techcrunch.com",
  "wired.com",
  "theverge.com",
  "arstechnica.com",
  "zdnet.com",
];

// Keywords to filter for relevant scam/fraud articles
const SCAM_KEYWORDS = [
  // Online scams
  "online scam",
  "phishing",
  "fake advertisement",
  "fake ad",
  "social media scam",
  "facebook scam",
  "instagram scam",
  "tiktok scam",
  "fake scholarship",
  "scholarship scam",
  "fake offer",

  // Romance/investment scams
  "romance scam",
  "love scam",
  "pig butchering",
  "investment scam",
  "crypto scam",
  "ponzi scheme",
  "pyramid scheme",

  // Tech/identity scams
  "deepfake",
  "ai scam",
  "identity theft",
  "fake account",
  "imposter",
  "smishing",
  "vishing",
  "spoofing",

  // E-commerce scams
  "fake seller",
  "online shopping fraud",
  "delivery scam",
  "fake booking",
  "airbnb scam",
  "e-wallet scam",

  // Job/trafficking scams
  "job scam",
  "fake job offer",
  "trafficking",
  "scam hub",
  "pogo scam",
  "forced labor scam",
];

// Keywords to EXCLUDE (political corruption, government fraud cases)
const EXCLUDE_KEYWORDS = [
  "flood control",
  "infrastructure fraud",
  "government contract",
  "corruption case",
  "graft",
  "embezzlement",
  "plunder",
  "budget scam",
  "kickback",
  "bribery",
  "alice guo",
  "mayor sentenced",
  "official arrested",
  "political",
];

function extractImage(item: FeedItem): string | null {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item["media:thumbnail"]?.url) return item["media:thumbnail"].url;
  if (item["media:content"]?.url) return item["media:content"].url;

  const html = item["content:encoded"] || item.content || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function isRelevant(title: string, summary: string): boolean {
  const textToCheck = (title + " " + summary).toLowerCase();

  // First check if it contains exclusion keywords
  const shouldExclude = EXCLUDE_KEYWORDS.some((keyword) =>
    textToCheck.includes(keyword.toLowerCase()),
  );

  if (shouldExclude) {
    return false;
  }

  // Then check if it contains relevant scam keywords
  return SCAM_KEYWORDS.some((keyword) =>
    textToCheck.includes(keyword.toLowerCase()),
  );
}

function isSourceTrusted(link: string): boolean {
  try {
    const url = new URL(link);
    const domain = url.hostname.replace("www.", "");

    // Skip Google News URLs - we'll accept them from our curated feeds
    if (domain.includes("news.google.com")) {
      return true;
    }

    const isTrusted = TRUSTED_SOURCES.some(
      (trusted) => domain.includes(trusted) || trusted.includes(domain),
    );

    return isTrusted;
  } catch {
    return false;
  }
}

function extractSourceFromUrl(link: string): string {
  try {
    const url = new URL(link);
    const domain = url.hostname.replace("www.", "");

    // Map domains to readable source names
    const sourceMap: Record<string, string> = {
      "rappler.com": "Rappler",
      "inquirer.net": "Philippine Daily Inquirer",
      "abs-cbn.com": "ABS-CBN News",
      "gma.network": "GMA News",
      "philstar.com": "The Philippine Star",
      "manilatimes.net": "The Manila Times",
      "sunstar.com.ph": "SunStar",
      "pna.gov.ph": "Philippine News Agency",
      "cnnphilippines.com": "CNN Philippines",
      "mb.com.ph": "Manila Bulletin",
      "bbc.com": "BBC News",
      "cnn.com": "CNN",
      "reuters.com": "Reuters",
      "apnews.com": "Associated Press",
      "theguardian.com": "The Guardian",
      "nytimes.com": "New York Times",
      "techcrunch.com": "TechCrunch",
      "wired.com": "Wired",
      "theverge.com": "The Verge",
      "arstechnica.com": "Ars Technica",
      "zdnet.com": "ZDNet",
    };

    // Check if domain matches any known source
    for (const [key, value] of Object.entries(sourceMap)) {
      if (domain.includes(key)) {
        return value;
      }
    }

    // If not found in map, capitalize the domain nicely
    return domain
      .split(".")
      .slice(0, -1) // Remove TLD
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } catch {
    return "Unknown Source";
  }
}

export async function GET() {
  console.log("🔄 Starting RSS fetch from trusted sources...");

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
        console.log(`\n📡 Fetching feed: ${feed.substring(0, 80)}...`);
        const parsed = await parser.parseURL(feed);
        const feedSource = parsed.title ?? "Unknown Source";
        console.log(
          `   ✅ Found ${parsed.items?.length || 0} items from ${feedSource}`,
        );

        for (const item of parsed.items ?? []) {
          if (!item.link || !item.title) continue;

          // Check if source is trusted
          if (!isSourceTrusted(item.link)) {
            console.log(`   ❌ Untrusted: ${item.title.substring(0, 50)}...`);
            continue;
          }

          // Check if article is relevant to scams/fraud
          if (!isRelevant(item.title, item.contentSnippet ?? "")) {
            console.log(`   ⊘ Not relevant: ${item.title.substring(0, 50)}...`);
            continue;
          }

          // Extract actual source from the article URL (not the feed title)
          const actualSource = extractSourceFromUrl(item.link);

          console.log(
            `   ✅ ACCEPTED: ${item.title.substring(0, 60)}... [${actualSource}]`,
          );

          relevantArticles.push({
            title: item.title,
            summary: item.contentSnippet ?? "",
            link: item.link,
            thumbnail: extractImage(item),
            source: actualSource, // Use the extracted source from URL
            published_at: item.isoDate
              ? new Date(item.isoDate).toISOString()
              : new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error(`❌ Failed to fetch feed: ${feed}`, err);
      }
    }

    console.log(
      `\n📰 Total relevant articles found: ${relevantArticles.length}`,
    );

    // Save top 20 to database
    const articlesToSave = relevantArticles.slice(0, 20);
    console.log(`💾 Saving ${articlesToSave.length} articles to database...`);

    for (const article of articlesToSave) {
      const { error } = await supabase.from("news_articles").upsert(
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

      if (error) {
        console.error("❌ Error saving article:", error);
      }
    }

    console.log("✅ Articles saved successfully!");

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

    console.error("❌ Fatal error:", e);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
