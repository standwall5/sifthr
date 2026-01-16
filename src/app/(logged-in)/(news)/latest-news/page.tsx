"use client";

import React, { useMemo, useState } from "react";
import "@/app/(logged-in)/style.css";
import "@/app/(logged-in)/(news)/latest-news/style.css";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useArticles } from "./components/useArticles";
import { isScholarshipRelated } from "./components/utils";
import { ArticlesSection } from "./components/ArticlesSection";
import { ArticleCard } from "./components/ArticleCard";
import styles from "./page.module.css";

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
  const { scholarshipArticles, otherArticles, recommendedArticles } =
    useMemo(() => {
      const scholarship = filteredArticles.filter(isScholarshipRelated);
      const other = filteredArticles.filter((a) => !isScholarshipRelated(a));
      const recommended = filteredArticles.slice(0, 5); // Top 5 as recommended
      return {
        scholarshipArticles: scholarship,
        otherArticles: other,
        recommendedArticles: recommended,
      };
    }, [filteredArticles]);

  return (
    <div className={styles.pageContainer}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.searchContainer}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
            aria-label="Search articles"
          />
        </div>

        {loading ? (
          <div className={styles.loading}>
            <p>Loading latest news…</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className={styles.noResults}>
            <p>No articles found{search ? ` for "${search}"` : ""}.</p>
          </div>
        ) : (
          <div className={styles.articlesGrid}>
            <ArticlesSection
              title="Scholarship & School-Related Scams"
              articles={scholarshipArticles}
              icon="📚"
              id="school"
            />
            <ArticlesSection
              title="Other Scam-Related News"
              articles={otherArticles}
              icon="🚨"
              id="other"
            />
          </div>
        )}
      </div>

      {/* Recommended Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <h3 className={styles.sidebarTitle}>Recommended Articles</h3>
          {loading ? (
            <p className={styles.sidebarLoading}>Loading...</p>
          ) : (
            <div className={styles.recommendedList}>
              {recommendedArticles.map((article) => (
                <div key={article.id} className={styles.recommendedItem}>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.recommendedLink}
                  >
                    <h4 className={styles.recommendedTitle}>{article.title}</h4>
                    <p className={styles.recommendedSource}>{article.source}</p>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default LatestNewsPage;
