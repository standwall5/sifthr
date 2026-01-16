/**
 * Pin Quiz Utilities - Validation and scoring for pin-based quiz questions
 */

import type { UserPin, PinQuestion } from "@/app/components/PinQuiz";

export type PinValidationResult = {
  isCorrect: boolean;
  accuracy: number; // 0-100 percentage
  distance: number; // pixels from correct position
  matchedPinIndex?: number; // For multiple pin questions
};

/**
 * Calculate distance between two points
 */
function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Calculate distance as percentage of image dimensions
 */
function calculateRelativeDistance(
  pin1: { x: number; y: number },
  pin2: { x: number; y: number }
): number {
  return Math.sqrt(Math.pow(pin2.x - pin1.x, 2) + Math.pow(pin2.y - pin1.y, 2));
}

/**
 * Validate a single pin answer
 */
export function validateSinglePin(
  userPin: UserPin,
  correctX: number,
  correctY: number,
  tolerance: number = 50
): PinValidationResult {
  // Calculate distance using relative coordinates (percentage)
  const distance = calculateRelativeDistance(
    { x: userPin.relativeX, y: userPin.relativeY },
    { x: correctX, y: correctY }
  );

  // Convert tolerance from pixels to percentage (assuming 1000px reference width)
  const tolerancePercentage = (tolerance / 1000) * 100;

  const isCorrect = distance <= tolerancePercentage;

  // Calculate accuracy: 100% at exact match, 0% at tolerance boundary
  const accuracy = Math.max(
    0,
    Math.min(
      100,
      ((tolerancePercentage - distance) / tolerancePercentage) * 100
    )
  );

  return {
    isCorrect,
    accuracy: Math.round(accuracy),
    distance,
  };
}

/**
 * Validate multiple pin answers (must match all pins)
 */
export function validateMultiplePins(
  userPins: UserPin[],
  correctPins: Array<{ x: number; y: number; tolerance?: number }>,
  defaultTolerance: number = 50
): {
  overallCorrect: boolean;
  results: PinValidationResult[];
  totalAccuracy: number;
  pinsMatched: number;
} {
  if (userPins.length !== correctPins.length) {
    return {
      overallCorrect: false,
      results: [],
      totalAccuracy: 0,
      pinsMatched: 0,
    };
  }

  // Use Hungarian algorithm approximation: greedy matching
  const results: PinValidationResult[] = [];
  const usedCorrectPins = new Set<number>();
  const usedUserPins = new Set<number>();

  // Find best matches for each user pin
  for (let i = 0; i < userPins.length; i++) {
    let bestMatch: PinValidationResult | null = null;
    let bestMatchIndex = -1;

    for (let j = 0; j < correctPins.length; j++) {
      if (usedCorrectPins.has(j)) continue;

      const result = validateSinglePin(
        userPins[i],
        correctPins[j].x,
        correctPins[j].y,
        correctPins[j].tolerance || defaultTolerance
      );

      if (
        bestMatch === null ||
        result.distance < (bestMatch.distance || Infinity)
      ) {
        bestMatch = result;
        bestMatchIndex = j;
      }
    }

    if (bestMatch && bestMatchIndex >= 0) {
      results.push({ ...bestMatch, matchedPinIndex: bestMatchIndex });
      usedCorrectPins.add(bestMatchIndex);
      usedUserPins.add(i);
    } else {
      results.push({
        isCorrect: false,
        accuracy: 0,
        distance: 100, // Max distance
      });
    }
  }

  const pinsMatched = results.filter((r) => r.isCorrect).length;
  const totalAccuracy =
    results.reduce((sum, r) => sum + r.accuracy, 0) / results.length;
  const overallCorrect = pinsMatched === correctPins.length;

  return {
    overallCorrect,
    results,
    totalAccuracy: Math.round(totalAccuracy),
    pinsMatched,
  };
}

/**
 * Validate pin answer for any question type
 */
export function validatePinAnswer(
  question: PinQuestion,
  userPins: UserPin[]
): {
  isCorrect: boolean;
  accuracy: number;
  details: PinValidationResult | PinValidationResult[];
} {
  // Handle multiple pin questions
  if (question.question_type === "multiple_pin" && question.pins) {
    const result = validateMultiplePins(
      userPins,
      question.pins,
      question.pin_tolerance || 50
    );
    return {
      isCorrect: result.overallCorrect,
      accuracy: result.totalAccuracy,
      details: result.results,
    };
  }

  // Handle single pin questions (legacy format)
  if (
    question.pin_x_coordinate !== undefined &&
    question.pin_y_coordinate !== undefined
  ) {
    if (userPins.length === 0) {
      return {
        isCorrect: false,
        accuracy: 0,
        details: { isCorrect: false, accuracy: 0, distance: 100 },
      };
    }

    const result = validateSinglePin(
      userPins[0],
      question.pin_x_coordinate,
      question.pin_y_coordinate,
      question.pin_tolerance || 50
    );

    return {
      isCorrect: result.isCorrect,
      accuracy: result.accuracy,
      details: result,
    };
  }

  // No valid pin data
  return {
    isCorrect: false,
    accuracy: 0,
    details: { isCorrect: false, accuracy: 0, distance: 100 },
  };
}

/**
 * Generate feedback message based on accuracy
 */
export function getPinFeedback(accuracy: number, isCorrect: boolean): string {
  if (!isCorrect) {
    if (accuracy >= 70) {
      return "Close! You were just outside the target area.";
    } else if (accuracy >= 40) {
      return "Not quite. Try to be more precise.";
    } else {
      return "Incorrect. Review the question and try again.";
    }
  }

  if (accuracy >= 95) {
    return "Perfect! Excellent precision!";
  } else if (accuracy >= 80) {
    return "Great job! Very accurate!";
  } else {
    return "Correct! Within the acceptable range.";
  }
}
