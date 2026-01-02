"use client";

import React, { useMemo, useState } from "react";
import "@/app/(logged-in)/style.css";
import "@/app/(logged-in)/(news)/latest-news/style.css";
import { useArticles } from "./components/useArticles";
import { isScholarshipRelated } from "./components/utils";
import { ArticlesSection } from "./components/ArticlesSection";
import Link from "next/link";

const LatestNewsPage: React.FC = () => {
  const { articles, loading } = useArticles();
  const [search, setSearch] = useState<string>("");

  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase();
    let filtered = articles;

    // Apply search filter if there's a query
    if (q) {
      filtered = articles.filter((a) => {
        const title = a.title?.toLowerCase() ?? "";
        const summary = a.summary?.toLowerCase() ?? "";
        const source = a.source?.toLowerCase() ?? "";
        return title.includes(q) || summary.includes(q) || source.includes(q);
      });
    }

    // Sort: scholarship/school articles first, then others by date
    return filtered.sort((a, b) => {
      const aIsScholarship = isScholarshipRelated(a);
      const bIsScholarship = isScholarshipRelated(b);

      // If one is scholarship-related and the other isn't, scholarship goes first
      if (aIsScholarship && !bIsScholarship) return -1;
      if (!aIsScholarship && bIsScholarship) return 1;

      // If both are the same category, sort by date (newest first)
      const aDate = new Date(a.published_at || 0).getTime();
      const bDate = new Date(b.published_at || 0).getTime();
      return bDate - aDate;
    });
  }, [articles, search]);

  // Separate articles into categories for display
  const { scholarshipArticles, otherArticles } = useMemo(() => {
    const scholarship = filteredArticles.filter(isScholarshipRelated);
    const other = filteredArticles.filter((a) => !isScholarshipRelated(a));
    return { scholarshipArticles: scholarship, otherArticles: other };
  }, [filteredArticles]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const otherSectionRef = React.useRef<HTMLDivElement>(null);
  const schoolSectionRef = React.useRef<HTMLDivElement>(null);

  const scrollToOtherSection = (
    ref: React.RefObject<HTMLDivElement | null>,
  ) => {
    const container = containerRef.current;
    const target = ref.current;
    if (container && target) {
      container.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="module-container">
      <div className="module-quiz-box" ref={containerRef}>
        <div className="search-box-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 p-2 border rounded"
              aria-label="Search articles"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="module-quiz-collection">
            <div className="module-quiz-card article-box">
              <p>Loading latest news…</p>
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="module-quiz-collection">
            <div className="module-quiz-card article-box">
              <p>No articles found{search ? ` for "${search}"` : ""}.</p>
            </div>
          </div>
        ) : (
          <>
            <Link
              href="#other"
              onClick={(e) => {
                e.preventDefault();
                scrollToOtherSection(otherSectionRef);
              }}
            >
              Other
            </Link>{" "}
            <Link
              href="#school"
              onClick={(e) => {
                e.preventDefault();
                scrollToOtherSection(schoolSectionRef);
              }}
            >
              School
            </Link>
            <div
              className="module-quiz-collection"
              style={{ alignItems: "center" }}
            >
              <ArticlesSection
                ref={schoolSectionRef}
                title="Scholarship & School-Related Scams"
                articles={scholarshipArticles}
                icon="📚"
                id="school"
              />
              <ArticlesSection
                ref={otherSectionRef}
                title="Other Scam-Related News"
                articles={otherArticles}
                icon="🚨"
                id="other"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LatestNewsPage;
