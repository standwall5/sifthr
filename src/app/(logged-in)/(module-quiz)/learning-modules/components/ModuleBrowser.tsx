"use client";

import { useState, useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { Module } from "@/lib/models/types";
import ModuleCollection from "./ModuleCollection";
import styles from "./ModuleBrowser.module.css";

type ModuleBrowserProps = {
  modules: Module[];
  loading: boolean;
};

export default function ModuleBrowser({
  modules,
  loading,
}: ModuleBrowserProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"easiest" | "hardest" | "recommended">(
    "easiest"
  );

  const filteredAndSortedModules = useMemo(() => {
    let result = [...modules];

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(searchLower) ||
          m.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortBy === "easiest") {
      result.sort((a, b) => {
        const difficultyOrder: Record<string, number> = {
          easy: 1,
          medium: 2,
          hard: 3,
        };
        const aVal = difficultyOrder[a.difficulty || "easy"] || 1;
        const bVal = difficultyOrder[b.difficulty || "easy"] || 1;
        return aVal - bVal;
      });
    } else if (sortBy === "hardest") {
      result.sort((a, b) => {
        const difficultyOrder: Record<string, number> = {
          easy: 1,
          medium: 2,
          hard: 3,
        };
        const aVal = difficultyOrder[a.difficulty || "easy"] || 1;
        const bVal = difficultyOrder[b.difficulty || "easy"] || 1;
        return bVal - aVal;
      });
    } else if (sortBy === "recommended") {
      // Recommended: incomplete modules first, sorted by difficulty
      result.sort((a, b) => {
        // For now, just sort by difficulty (easiest first)
        // In the future, you can add completion status here
        const difficultyOrder: Record<string, number> = {
          easy: 1,
          medium: 2,
          hard: 3,
        };
        const aVal = difficultyOrder[a.difficulty || "easy"] || 1;
        const bVal = difficultyOrder[b.difficulty || "easy"] || 1;
        return aVal - bVal;
      });
    }

    return result;
  }, [modules, search, sortBy]);

  return (
    <div className={styles.browserContainer}>
      <div className={styles.controls}>
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
            aria-label="Search modules"
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

      {/* Module Grid */}
      <div className={styles.resultsContainer}>
        {search && (
          <p className={styles.resultCount}>
            {filteredAndSortedModules.length} module
            {filteredAndSortedModules.length !== 1 ? "s" : ""} found
          </p>
        )}
        <ModuleCollection
          filteredModules={filteredAndSortedModules}
          loading={loading}
        />
      </div>
    </div>
  );
}
