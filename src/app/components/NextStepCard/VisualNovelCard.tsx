"use client";

import React, { useEffect, useState } from "react";
import { CardComponentProps } from "nextstepjs";
import Image from "next/image";
import styles from "./VisualNovelCard.module.css";

const VisualNovelCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  const [mascotOnRight, setMascotOnRight] = useState(false);

  useEffect(() => {
    // Determine mascot position based on target element
    if (step.selector) {
      const element = document.querySelector(step.selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        const screenMiddle = window.innerWidth / 2;

        // If element is on left half, put mascot on right
        setMascotOnRight(rect.left + rect.width / 2 < screenMiddle);
      }
    }
  }, [step.selector, currentStep]);

  return (
    <>
      {/* Mascot fixed at bottom corner */}
      <div
        className={`${styles.mascotFixed} ${
          mascotOnRight ? styles.mascotRight : styles.mascotLeft
        }`}
      >
        <Image
          src="/assets/images/next-step/mascotAdEducate.webp"
          alt="AdEducate Mascot"
          width={300}
          height={400}
          className={styles.mascotImage}
          priority
        />
      </div>

      {/* Dialogue Box */}
      <div
        className={`${styles.dialogueBox} ${
          mascotOnRight ? styles.dialogueRight : styles.dialogueLeft
        }`}
      >
        {/* Arrow pointing to highlighted element */}
        {arrow}

        {/* Title with Icon */}
        <div className={styles.titleContainer}>
          {step.icon && <span className={styles.icon}>{step.icon}</span>}
          <h3 className={styles.title}>{step.title}</h3>
        </div>

        {/* Content */}
        <div className={styles.content}>{step.content}</div>

        {/* Progress and Controls */}
        <div className={styles.footer}>
          <div className={styles.progressContainer}>
            <span className={styles.progressText}>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${((currentStep + 1) / totalSteps) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            {currentStep > 0 && (
              <button onClick={prevStep} className={styles.prevButton}>
                ← Previous
              </button>
            )}

            <button onClick={nextStep} className={styles.nextButton}>
              {isLastStep ? "Finish! 🎉" : "Next →"}
            </button>

            {step.showSkip && skipTour && (
              <button onClick={skipTour} className={styles.skipButton}>
                Skip Tour
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VisualNovelCard;
