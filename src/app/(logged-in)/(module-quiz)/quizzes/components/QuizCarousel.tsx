"use client";

import { useRouter } from "next/navigation";
import type { Quiz } from "@/lib/models/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import styles from "./QuizCarousel.module.css";

type QuizCarouselProps = {
  quizzes: Quiz[];
  selectedIndex: number;
  onNavigate: (index: number) => void;
};

export default function QuizCarousel({
  quizzes,
  selectedIndex,
  onNavigate,
}: QuizCarouselProps) {
  const router = useRouter();

  if (quizzes.length === 0) return null;

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      onNavigate(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < quizzes.length - 1) {
      onNavigate(selectedIndex + 1);
    }
  };

  const getVisibleQuizzes = () => {
    const visible: {
      quiz: Quiz;
      position: "left" | "center" | "right";
      index: number;
    }[] = [];

    // Left card
    if (selectedIndex > 0) {
      visible.push({
        quiz: quizzes[selectedIndex - 1],
        position: "left",
        index: selectedIndex - 1,
      });
    }

    // Center card (selected)
    visible.push({
      quiz: quizzes[selectedIndex],
      position: "center",
      index: selectedIndex,
    });

    // Right card
    if (selectedIndex < quizzes.length - 1) {
      visible.push({
        quiz: quizzes[selectedIndex + 1],
        position: "right",
        index: selectedIndex + 1,
      });
    }

    return visible;
  };

  const visibleQuizzes = getVisibleQuizzes();

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.carouselTitle}>Next Quiz</h2>
      <div className={styles.carousel}>
        {/* Left Arrow */}
        <button
          onClick={handlePrevious}
          disabled={selectedIndex === 0}
          className={`${styles.arrowButton} ${styles.arrowLeft}`}
          aria-label="Previous quiz"
        >
          <ChevronLeftIcon className={styles.arrowIcon} />
        </button>

        {/* Cards */}
        <div className={styles.cardsContainer}>
          {visibleQuizzes.map(({ quiz, position, index }) => (
            <div
              key={quiz.id}
              className={`${styles.carouselCard} ${styles[position]}`}
              onClick={() => {
                if (position === "center") {
                  router.push(`/quizzes/${quiz.id}`);
                } else {
                  onNavigate(index);
                }
              }}
            >
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{quiz.title}</h3>
                <p className={styles.cardDescription}>{quiz.description}</p>
                {position === "center" && (
                  <div className={styles.cardMeta}>
                    <span className={styles.quizBadge}>Quiz #{quiz.id}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={selectedIndex === quizzes.length - 1}
          className={`${styles.arrowButton} ${styles.arrowRight}`}
          aria-label="Next quiz"
        >
          <ChevronRightIcon className={styles.arrowIcon} />
        </button>
      </div>
    </div>
  );
}
