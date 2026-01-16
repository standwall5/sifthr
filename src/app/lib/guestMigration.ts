/**
 * Guest Migration Service - Transfers guest progress to authenticated user account
 */

import {
  getGuestModuleProgress,
  getGuestQuizSubmissions,
  getGuestUserAnswers,
  clearGuestData,
  deactivateGuestMode,
  type GuestModuleProgress,
  type GuestQuizSubmission,
  type GuestUserAnswer,
} from "./guestService";
import { supabase } from "@/app/lib/supabaseClient";

/**
 * Migration result type
 */
export type MigrationResult = {
  success: boolean;
  modulesTransferred: number;
  quizzesTransferred: number;
  error?: string;
};

/**
 * Migrate guest data to authenticated user account
 * Should be called after user signs up or logs in
 */
export async function migrateGuestDataToUser(
  userId: string
): Promise<MigrationResult> {
  try {
    // Get all guest data
    const moduleProgress = getGuestModuleProgress();
    const quizSubmissions = getGuestQuizSubmissions();
    const userAnswers = getGuestUserAnswers();

    let modulesTransferred = 0;
    let quizzesTransferred = 0;

    // Migrate module progress
    if (moduleProgress.length > 0) {
      const progressRecords = moduleProgress.map((p) => ({
        user_id: userId,
        module_id: p.moduleId,
        module_section_id: p.moduleSectionId,
        completed_at: p.completedAt,
      }));

      const { error: moduleError } = await supabase
        .from("module_progress")
        .upsert(progressRecords, {
          onConflict: "user_id,module_id,module_section_id",
          ignoreDuplicates: true,
        });

      if (moduleError) {
        console.error("Error migrating module progress:", moduleError);
      } else {
        modulesTransferred = progressRecords.length;
      }
    }

    // Migrate quiz submissions
    if (quizSubmissions.length > 0) {
      for (const submission of quizSubmissions) {
        // Insert quiz submission
        const { data: newSubmission, error: quizError } = await supabase
          .from("quiz_submissions")
          .insert({
            user_id: userId,
            quiz_id: submission.quizId,
            score: submission.score,
            attempt: submission.attempt,
            submitted_at: submission.submittedAt,
          })
          .select()
          .single();

        if (quizError || !newSubmission) {
          console.error("Error migrating quiz submission:", quizError);
          continue;
        }

        // Get answers for this submission
        const answers = userAnswers.filter(
          (a) => a.quizSubmissionId === submission.id
        );

        if (answers.length > 0) {
          const answerRecords = answers.map((a) => ({
            quiz_submission_id: newSubmission.id,
            question_id: a.questionId,
            user_input: a.userInput,
            is_correct: a.isCorrect,
          }));

          const { error: answerError } = await supabase
            .from("user_answers")
            .insert(answerRecords);

          if (answerError) {
            console.error("Error migrating user answers:", answerError);
          }
        }

        quizzesTransferred++;
      }
    }

    // Clear guest data after successful migration
    clearGuestData();
    deactivateGuestMode();

    return {
      success: true,
      modulesTransferred,
      quizzesTransferred,
    };
  } catch (error) {
    console.error("Guest migration error:", error);
    return {
      success: false,
      modulesTransferred: 0,
      quizzesTransferred: 0,
      error: error instanceof Error ? error.message : "Unknown migration error",
    };
  }
}

/**
 * Get a summary of guest data before migration
 */
export function getGuestDataSummary(): {
  hasData: boolean;
  moduleCount: number;
  quizCount: number;
  message: string;
} {
  const moduleProgress = getGuestModuleProgress();
  const quizSubmissions = getGuestQuizSubmissions();

  const moduleCount = moduleProgress.length;
  const quizCount = quizSubmissions.length;
  const hasData = moduleCount > 0 || quizCount > 0;

  let message = "No guest progress to transfer.";

  if (hasData) {
    const parts = [];
    if (moduleCount > 0) {
      parts.push(
        `${moduleCount} module section${moduleCount !== 1 ? "s" : ""}`
      );
    }
    if (quizCount > 0) {
      parts.push(`${quizCount} quiz attempt${quizCount !== 1 ? "s" : ""}`);
    }
    message = `You have completed ${parts.join(
      " and "
    )} as a guest. Sign in to save your progress!`;
  }

  return {
    hasData,
    moduleCount,
    quizCount,
    message,
  };
}

/**
 * Check if user should see migration prompt
 */
export function shouldShowMigrationPrompt(): boolean {
  const summary = getGuestDataSummary();
  return summary.hasData;
}
