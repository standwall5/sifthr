/**
 * Guest Service - Manages localStorage for guest users
 * This service handles guest profile creation, module progress, and quiz submissions
 */

import type { QuizSubmission, UserAnswer } from "@/lib/models/types";

const GUEST_PREFIX = "sifthr_guest_";
const GUEST_PROFILE_KEY = `${GUEST_PREFIX}profile`;
const GUEST_MODULE_PROGRESS_KEY = `${GUEST_PREFIX}module_progress`;
const GUEST_QUIZ_SUBMISSIONS_KEY = `${GUEST_PREFIX}quiz_submissions`;
const GUEST_USER_ANSWERS_KEY = `${GUEST_PREFIX}user_answers`;
const GUEST_MODE_KEY = `${GUEST_PREFIX}mode_active`;

export type GuestProfile = {
  id: string; // generated UUID
  name: string;
  isGuest: true;
  createdAt: string;
};

export type GuestModuleProgress = {
  moduleId: number;
  moduleSectionId: number;
  completedAt: string;
};

export type GuestQuizSubmission = {
  id: string; // generated UUID
  quizId: number;
  score: number;
  attempt: number;
  submittedAt: string;
};

export type GuestUserAnswer = {
  quizSubmissionId: string;
  questionId: number;
  userInput: string | null;
  isCorrect: boolean;
};

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Set a cookie for middleware detection
 */
function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Remove a cookie
 */
function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Generate a simple UUID v4
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Check if guest mode is active
 */
export function isGuestMode(): boolean {
  if (!isLocalStorageAvailable()) return false;
  return localStorage.getItem(GUEST_MODE_KEY) === "true";
}

/**
 * Activate guest mode
 */
export function activateGuestMode(): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(GUEST_MODE_KEY, "true");
  // Set cookie for middleware detection
  setCookie("sifthr_guest_mode_active", "true");
}

/**
 * Deactivate guest mode (when user logs in)
 */
export function deactivateGuestMode(): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.removeItem(GUEST_MODE_KEY);
  // Remove cookie
  removeCookie("sifthr_guest_mode_active");
}

/**
 * Create or get guest profile
 */
export function getOrCreateGuestProfile(): GuestProfile {
  if (!isLocalStorageAvailable()) {
    throw new Error("localStorage is not available");
  }

  const existing = localStorage.getItem(GUEST_PROFILE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing) as GuestProfile;
    } catch {
      // If parsing fails, create new profile
    }
  }

  // Create new guest profile
  const profile: GuestProfile = {
    id: generateUUID(),
    name: "Guest User",
    isGuest: true,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

/**
 * Get guest profile (without creating)
 */
export function getGuestProfile(): GuestProfile | null {
  if (!isLocalStorageAvailable()) return null;

  const existing = localStorage.getItem(GUEST_PROFILE_KEY);
  if (!existing) return null;

  try {
    return JSON.parse(existing) as GuestProfile;
  } catch {
    return null;
  }
}

/**
 * Save module progress for guest
 */
export function saveGuestModuleProgress(
  moduleId: number,
  moduleSectionId: number,
): void {
  if (!isLocalStorageAvailable()) return;

  const progress = getGuestModuleProgress();

  // Check if already completed
  const exists = progress.some(
    (p) => p.moduleId === moduleId && p.moduleSectionId === moduleSectionId,
  );

  if (!exists) {
    progress.push({
      moduleId,
      moduleSectionId,
      completedAt: new Date().toISOString(),
    });
    localStorage.setItem(GUEST_MODULE_PROGRESS_KEY, JSON.stringify(progress));
  }
}

/**
 * Get all module progress for guest
 */
export function getGuestModuleProgress(): GuestModuleProgress[] {
  if (!isLocalStorageAvailable()) return [];

  const data = localStorage.getItem(GUEST_MODULE_PROGRESS_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data) as GuestModuleProgress[];
  } catch {
    return [];
  }
}

/**
 * Check if a specific module section is completed
 */
export function isGuestModuleSectionCompleted(
  moduleId: number,
  moduleSectionId: number,
): boolean {
  const progress = getGuestModuleProgress();
  return progress.some(
    (p) => p.moduleId === moduleId && p.moduleSectionId === moduleSectionId,
  );
}

/**
 * Check if entire module is completed
 */
export function isGuestModuleCompleted(
  moduleId: number,
  totalSections: number,
): boolean {
  const progress = getGuestModuleProgress();
  const completedSections = progress.filter(
    (p) => p.moduleId === moduleId,
  ).length;
  return completedSections >= totalSections;
}

/**
 * Submit quiz for guest
 */
export function submitGuestQuiz(
  quizId: number,
  score: number,
  answers: Array<{
    questionId: number;
    userInput: string | null;
    isCorrect: boolean;
  }>,
): { submissionId: string; attempt: number } {
  if (!isLocalStorageAvailable()) {
    throw new Error("localStorage is not available");
  }

  // Get previous submissions for this quiz
  const submissions = getGuestQuizSubmissions();
  const previousAttempts = submissions.filter((s) => s.quizId === quizId);
  const attemptNumber = previousAttempts.length + 1;

  // Create new submission
  const submission: GuestQuizSubmission = {
    id: generateUUID(),
    quizId,
    score: Math.round(score),
    attempt: attemptNumber,
    submittedAt: new Date().toISOString(),
  };

  // Save submission
  submissions.push(submission);
  localStorage.setItem(GUEST_QUIZ_SUBMISSIONS_KEY, JSON.stringify(submissions));

  // Save answers
  const existingAnswers = getGuestUserAnswers();
  const newAnswers: GuestUserAnswer[] = answers.map((a) => ({
    quizSubmissionId: submission.id,
    questionId: a.questionId,
    userInput: a.userInput,
    isCorrect: a.isCorrect,
  }));

  existingAnswers.push(...newAnswers);
  localStorage.setItem(GUEST_USER_ANSWERS_KEY, JSON.stringify(existingAnswers));

  return {
    submissionId: submission.id,
    attempt: attemptNumber,
  };
}

/**
 * Get all quiz submissions for guest
 */
export function getGuestQuizSubmissions(): GuestQuizSubmission[] {
  if (!isLocalStorageAvailable()) return [];

  const data = localStorage.getItem(GUEST_QUIZ_SUBMISSIONS_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data) as GuestQuizSubmission[];
  } catch {
    return [];
  }
}

/**
 * Get quiz submissions for a specific quiz
 */
export function getGuestQuizSubmissionsByQuizId(
  quizId: number,
): GuestQuizSubmission[] {
  return getGuestQuizSubmissions().filter((s) => s.quizId === quizId);
}

/**
 * Get all user answers for guest
 */
export function getGuestUserAnswers(): GuestUserAnswer[] {
  if (!isLocalStorageAvailable()) return [];

  const data = localStorage.getItem(GUEST_USER_ANSWERS_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data) as GuestUserAnswer[];
  } catch {
    return [];
  }
}

/**
 * Get user answers for a specific submission
 */
export function getGuestUserAnswersBySubmissionId(
  submissionId: string,
): GuestUserAnswer[] {
  return getGuestUserAnswers().filter(
    (a) => a.quizSubmissionId === submissionId,
  );
}

/**
 * Clear all guest data (when user logs in or manually clears)
 */
export function clearGuestData(): void {
  if (!isLocalStorageAvailable()) return;

  localStorage.removeItem(GUEST_PROFILE_KEY);
  localStorage.removeItem(GUEST_MODULE_PROGRESS_KEY);
  localStorage.removeItem(GUEST_QUIZ_SUBMISSIONS_KEY);
  localStorage.removeItem(GUEST_USER_ANSWERS_KEY);
  localStorage.removeItem(GUEST_MODE_KEY);
  removeCookie("sifthr_guest_mode_active");
}

/**
 * Get statistics about guest progress
 */
export function getGuestStats(): {
  modulesStarted: number;
  modulesCompleted: number;
  quizzesTaken: number;
  totalScore: number;
  averageScore: number;
} {
  const progress = getGuestModuleProgress();
  const submissions = getGuestQuizSubmissions();

  // Count unique modules started
  const uniqueModules = new Set(progress.map((p) => p.moduleId));

  // This would need total sections per module to calculate completed modules
  // For now, just return modules started
  const totalScore = submissions.reduce((sum, s) => sum + s.score, 0);
  const averageScore =
    submissions.length > 0 ? totalScore / submissions.length : 0;

  return {
    modulesStarted: uniqueModules.size,
    modulesCompleted: 0, // Would need section counts per module
    quizzesTaken: submissions.length,
    totalScore,
    averageScore: Math.round(averageScore),
  };
}
