/**
 * Pin Quiz Component - Image-based quiz where users click to place pins
 * Supports single and multiple pin questions
 */

"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./PinQuiz.module.css";

export type PinQuestion = {
  id: number;
  question_text: string;
  question_type: "pin" | "multiple_pin";
  image_url: string;
  pin_count: number;
  pins?: Array<{
    x: number;
    y: number;
    tolerance: number;
    label?: string;
  }>;
  // For backward compatibility with single pin
  pin_x_coordinate?: number;
  pin_y_coordinate?: number;
  pin_tolerance?: number;
};

export type UserPin = {
  x: number;
  y: number;
  relativeX: number; // Percentage 0-100
  relativeY: number; // Percentage 0-100
};

interface PinQuizProps {
  question: PinQuestion;
  onAnswer: (pins: UserPin[]) => void;
  showCorrectAnswer?: boolean;
  userPins?: UserPin[];
}

export default function PinQuiz({
  question,
  onAnswer,
  showCorrectAnswer = false,
  userPins = [],
}: PinQuizProps) {
  const [placedPins, setPlacedPins] = useState<UserPin[]>(userPins);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxPins =
    question.question_type === "multiple_pin" ? question.pin_count : 1;

  useEffect(() => {
    // Reset pins when question changes
    setPlacedPins(userPins);
    setImageLoaded(false);
  }, [question.id, userPins]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight,
      });
      setImageLoaded(true);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageLoaded || showCorrectAnswer) return;
    if (placedPins.length >= maxPins) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const relativeX = (x / rect.width) * 100;
    const relativeY = (y / rect.height) * 100;

    const newPin: UserPin = { x, y, relativeX, relativeY };
    const newPins = [...placedPins, newPin];
    setPlacedPins(newPins);
  };

  const handleRemovePin = (index: number) => {
    if (showCorrectAnswer) return;
    const newPins = placedPins.filter((_, i) => i !== index);
    setPlacedPins(newPins);
  };

  const handleSubmit = () => {
    if (placedPins.length === 0) return;
    onAnswer(placedPins);
  };

  const handleClear = () => {
    setPlacedPins([]);
  };

  // Get correct pins from question
  const getCorrectPins = (): Array<{
    x: number;
    y: number;
    label?: string;
  }> => {
    if (question.pins && question.pins.length > 0) {
      return question.pins;
    } else if (
      question.pin_x_coordinate !== undefined &&
      question.pin_y_coordinate !== undefined
    ) {
      return [{ x: question.pin_x_coordinate, y: question.pin_y_coordinate }];
    }
    return [];
  };

  const correctPins = showCorrectAnswer ? getCorrectPins() : [];

  return (
    <div className={styles.container}>
      <div className={styles.questionText}>
        <h3>{question.question_text}</h3>
        <p className={styles.instructions}>
          {maxPins === 1
            ? "Click on the image to place a pin at the correct location."
            : `Click on the image to place ${maxPins} pins at the correct locations.`}
        </p>
      </div>

      <div className={styles.imageWrapper} ref={containerRef}>
        <div
          className={styles.imageContainer}
          onClick={handleImageClick}
          style={{
            cursor:
              imageLoaded && !showCorrectAnswer && placedPins.length < maxPins
                ? "crosshair"
                : "default",
          }}
        >
          <img
            ref={imageRef}
            src={question.image_url}
            alt={question.question_text}
            className={styles.image}
            onLoad={handleImageLoad}
          />

          {/* User-placed pins */}
          {imageLoaded &&
            placedPins.map((pin, index) => (
              <div
                key={`user-pin-${index}`}
                className={`${styles.pin} ${styles.userPin} ${
                  showCorrectAnswer ? styles.pinDisabled : ""
                }`}
                style={{
                  left: `${pin.relativeX}%`,
                  top: `${pin.relativeY}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePin(index);
                }}
                title={
                  showCorrectAnswer ? "Your answer" : "Click to remove this pin"
                }
              >
                <div className={styles.pinMarker}>
                  <div className={styles.pinHead} />
                  <div className={styles.pinPoint} />
                </div>
                {maxPins > 1 && (
                  <span className={styles.pinLabel}>{index + 1}</span>
                )}
              </div>
            ))}

          {/* Correct answer pins (shown after submission) */}
          {imageLoaded &&
            showCorrectAnswer &&
            correctPins.map((pin, index) => (
              <div
                key={`correct-pin-${index}`}
                className={`${styles.pin} ${styles.correctPin}`}
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                }}
                title={pin.label || "Correct location"}
              >
                <div className={styles.pinMarker}>
                  <div className={styles.pinHead} />
                  <div className={styles.pinPoint} />
                </div>
                {pin.label && (
                  <span className={styles.pinLabel}>{pin.label}</span>
                )}
              </div>
            ))}
        </div>

        {!imageLoaded && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
            <p>Loading image...</p>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.pinCounter}>
          Pins placed: {placedPins.length} / {maxPins}
        </div>

        {!showCorrectAnswer && (
          <div className={styles.buttonGroup}>
            <button
              className={styles.clearButton}
              onClick={handleClear}
              disabled={placedPins.length === 0}
            >
              Clear All
            </button>
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={placedPins.length === 0}
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
