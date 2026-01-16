"use client";
import React, { useEffect, useState, useMemo } from "react";
import "../moduleQuiz.css";
import "@/app/(logged-in)/style.css";
import type { Module } from "@/lib/models/types";
import ModuleCarousel from "./components/ModuleCarousel";
import BadgeSidebar from "./components/BadgeSidebar";
import ModuleBrowser from "./components/ModuleBrowser";
import styles from "./page.module.css";

export default function LearningModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCarouselIndex, setSelectedCarouselIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/getModules")
      .then((res) => res.json())
      .then((data) => {
        setModules(data);
        // Set default selected module to first incomplete (or first module)
        // For now, just select the first module
        if (data.length > 0) {
          setSelectedCarouselIndex(0);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch modules:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Sort modules for carousel (easiest to hardest by default)
  const sortedModules = useMemo(() => {
    return [...modules].sort((a, b) => {
      const difficultyOrder: Record<string, number> = {
        beginner: 1,
        intermediate: 2,
        advanced: 3,
      };
      const aVal = difficultyOrder[a.difficulty_level || "beginner"] || 1;
      const bVal = difficultyOrder[b.difficulty_level || "beginner"] || 1;
      return aVal - bVal;
    });
  }, [modules]);

  return (
    <div className={styles.pageContainer}>
      {/* Sidebar */}
      <BadgeSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div
        className={`${styles.mainContent} ${
          sidebarOpen ? styles.sidebarOpen : ""
        }`}
      >
        {/* Featured Carousel */}
        <ModuleCarousel
          modules={sortedModules}
          selectedIndex={selectedCarouselIndex}
          onNavigate={setSelectedCarouselIndex}
        />

        {/* Module Browser */}
        <ModuleBrowser modules={modules} loading={loading} />
      </div>
    </div>
  );
}
