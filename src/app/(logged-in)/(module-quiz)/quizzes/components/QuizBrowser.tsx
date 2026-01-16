"use client";

import { useState, useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { Quiz } from "@/lib/models/types";
import QuizCollection from "./QuizCollection";
import styles from "./QuizBrowser.module.css";

type QuizBrowserProps = {
  quizzes: Quiz[];
};

export default function QuizBrowser({ quizzes }: QuizBrowserProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"easiest" | "hardest" | "recommended">(
    "easiest"
  );

  const filteredAndSortedQuizzes = useMemo(() => {
    let result = [...quizzes];

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(searchLower) ||
          q.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortBy === "easiest") {
      result.sort((a, b) => (a.id || 0) - (b.id || 0));
    } else if (sortBy === "hardest") {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (sortBy === "recommended") {
      // Recommended: sort by id (ascending)
      result.sort((a, b) => (a.id || 0) - (b.id || 0));
    }

    return result;
  }, [quizzes, search, sortBy]);

  return (
    <div className={styles.browserContainer}>
      <div className={styles.controls}>
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
            aria-label="Search quizzes"
          />
        </div>

        {/* Sort Dropdown */}
        <div className={styles.sortContainer}>
          <label htmlFor="sort-select" className={styles.sortLabel}>
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "easiest" | "hardest" | "recommended")
            }
            className={styles.sortSelect}
          >
            <option value="easiest">Easiest → Hardest</option>
            <option value="hardest">Hardest → Easiest</option>
            <option value="recommended">Recommended</option>
          </select>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className={styles.resultsContainer}>
        {search && (
          <p className={styles.resultCount}>
            {filteredAndSortedQuizzes.length} quiz
            {filteredAndSortedQuizzes.length !== 1 ? "zes" : ""} found
          </p>
        )}
        <QuizCollection filteredQuizzes={filteredAndSortedQuizzes} />
      </div>
    </div>
  );
}
