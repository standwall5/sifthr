"use client";

import React, { useState, useRef } from "react";
import styles from "./PinGame.module.css";

type PinGameProps = {
  imageUrl: string;
  targetX: number;
  targetY: number;
  tolerance: number;
  onCorrect: () => void;
  onIncorrect: () => void;
  questionText: string;
};

export default function PinGame({
  imageUrl,
  targetX,
  targetY,
  tolerance,
  onCorrect,
  onIncorrect,
  questionText,
}: PinGameProps) {
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setClickPosition({ x, y });

    // Calculate distance
    const distance = Math.sqrt(
      Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2),
    );

    const correct = distance <= tolerance;
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      if (correct) {
        onCorrect();
      } else {
        onIncorrect();
      }
    }, 1500);
  };

  return (
    <div className={styles.pinGameContainer}>
      <h3 className={styles.questionText}>{questionText}</h3>
      <p className={styles.instruction}>
        📍 Click on the image to place your pin
      </p>

      <div
        ref={imageRef}
        className={styles.imageContainer}
        onClick={handleImageClick}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {clickPosition && (
          <div
            className={`${styles.pin} ${showFeedback ? (isCorrect ? styles.pinCorrect : styles.pinIncorrect) : ""}`}
            style={{
              left: `${clickPosition.x}%`,
              top: `${clickPosition.y}%`,
            }}
          >
            📍
          </div>
        )}

        {showFeedback && (
          <div
            className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}
          >
            {isCorrect ? "✓ Correct!" : "✗ Try Again!"}
          </div>
        )}
      </div>
    </div>
  );
}
