"use client";

import React, { useState, useEffect, useMemo } from "react";
import "../../style.css";
import type { Quiz } from "@/lib/models/types";
import QuizCarousel from "./components/QuizCarousel";
import BadgeSidebar from "../learning-modules/components/BadgeSidebar";
import QuizBrowser from "./components/QuizBrowser";
import styles from "./page.module.css";

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedCarouselIndex, setSelectedCarouselIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetch("/api/getQuizzes")
      .then((res) => res.json())
      .then((data) => {
        setQuizzes(data);
        if (data.length > 0) {
          setSelectedCarouselIndex(0);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch quizzes:", err);
      });
  }, []);

  // Sort quizzes for carousel (by id)
  const sortedQuizzes = useMemo(() => {
    return [...quizzes].sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [quizzes]);

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
        <QuizCarousel
          quizzes={sortedQuizzes}
          selectedIndex={selectedCarouselIndex}
          onNavigate={setSelectedCarouselIndex}
        />

        {/* Quiz Browser */}
        <QuizBrowser quizzes={quizzes} />
      </div>
    </div>
  );
};

export default QuizzesPage;
