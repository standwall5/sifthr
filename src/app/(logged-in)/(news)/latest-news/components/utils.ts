import type { NewsArticle } from "@/lib/models/types";

// Keywords for scholarship/school-related content
export const SCHOLARSHIP_KEYWORDS = [
  "scholarship",
  "school",
  "student",
  "education",
  "ched",
  "deped",
  "college",
  "university",
  "tuition",
  "academic",
  "iskolar",
  "scholar",
];

// Function to check if article is scholarship/school-related
export function isScholarshipRelated(article: NewsArticle): boolean {
  const textToCheck = (article.title + " " + article.summary).toLowerCase();
  return SCHOLARSHIP_KEYWORDS.some((keyword) =>
    textToCheck.includes(keyword.toLowerCase()),
  );
}
