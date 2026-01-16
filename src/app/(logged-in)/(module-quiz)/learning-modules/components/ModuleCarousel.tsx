"use client";

import { useRouter } from "next/navigation";
import type { Module } from "@/lib/models/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import styles from "./ModuleCarousel.module.css";

type ModuleCarouselProps = {
  modules: Module[];
  selectedIndex: number;
  onNavigate: (index: number) => void;
};

export default function ModuleCarousel({
  modules,
  selectedIndex,
  onNavigate,
}: ModuleCarouselProps) {
  const router = useRouter();

  if (modules.length === 0) return null;

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      onNavigate(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < modules.length - 1) {
      onNavigate(selectedIndex + 1);
    }
  };

  const getVisibleModules = () => {
    const visible: {
      module: Module;
      position: "left" | "center" | "right";
      index: number;
    }[] = [];

    // Left card
    if (selectedIndex > 0) {
      visible.push({
        module: modules[selectedIndex - 1],
        position: "left",
        index: selectedIndex - 1,
      });
    }

    // Center card (selected)
    visible.push({
      module: modules[selectedIndex],
      position: "center",
      index: selectedIndex,
    });

    // Right card
    if (selectedIndex < modules.length - 1) {
      visible.push({
        module: modules[selectedIndex + 1],
        position: "right",
        index: selectedIndex + 1,
      });
    }

    return visible;
  };

  const visibleModules = getVisibleModules();

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.carouselTitle}>Featured Module</h2>
      <div className={styles.carousel}>
        {/* Left Arrow */}
        <button
          onClick={handlePrevious}
          disabled={selectedIndex === 0}
          className={`${styles.arrowButton} ${styles.arrowLeft}`}
          aria-label="Previous module"
        >
          <ChevronLeftIcon className={styles.arrowIcon} />
        </button>

        {/* Cards */}
        <div className={styles.cardsContainer}>
          {visibleModules.map(({ module, position, index }) => (
            <div
              key={module.id}
              className={`${styles.carouselCard} ${styles[position]}`}
              onClick={() => {
                if (position === "center") {
                  router.push(`/learning-modules/${module.id}`);
                } else {
                  onNavigate(index);
                }
              }}
            >
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{module.title}</h3>
                <p className={styles.cardDescription}>{module.description}</p>
                {position === "center" && (
                  <div className={styles.cardMeta}>
                    {module.difficulty && (
                      <span className={styles.difficulty}>
                        {module.difficulty}
                      </span>
                    )}
                    {module.estimated_minutes && (
                      <span className={styles.time}>
                        {module.estimated_minutes} min
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={selectedIndex === modules.length - 1}
          className={`${styles.arrowButton} ${styles.arrowRight}`}
          aria-label="Next module"
        >
          <ChevronRightIcon className={styles.arrowIcon} />
        </button>
      </div>
    </div>
  );
}
