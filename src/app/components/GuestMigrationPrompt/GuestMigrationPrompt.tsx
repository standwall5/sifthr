/**
 * Guest Migration Prompt Component
 * Shows a notification when guest user logs in, offering to migrate their progress
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getGuestDataSummary,
  migrateGuestDataToUser,
} from "@/app/lib/guestMigration";
import { useToast } from "@/app/hooks/useToast";
import { BookOpenIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import styles from "./GuestMigrationPrompt.module.css";
import Button from "../Button/Button";

interface GuestMigrationPromptProps {
  userId: string;
  onComplete?: () => void;
}

export default function GuestMigrationPrompt({
  userId,
  onComplete,
}: GuestMigrationPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<{
    hasData: boolean;
    moduleCount: number;
    quizCount: number;
    message: string;
  } | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    // Check if there's guest data to migrate
    const guestSummary = getGuestDataSummary();
    setSummary(guestSummary);

    if (guestSummary.hasData) {
      setIsVisible(true);
    }
  }, []);

  const handleMigrate = async () => {
    setIsLoading(true);

    try {
      const result = await migrateGuestDataToUser(userId);

      if (result.success) {
        showToast(
          `Successfully transferred ${result.modulesTransferred} module sections and ${result.quizzesTransferred} quiz attempts!`,
          "success"
        );
        setIsVisible(false);
        onComplete?.();
        router.refresh();
      } else {
        showToast(
          result.error || "Failed to transfer progress. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Migration error:", error);
      showToast("An error occurred during migration.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible || !summary?.hasData) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Transfer Guest Progress?</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>{summary.message}</p>

          <div className={styles.details}>
            {summary.moduleCount > 0 && (
              <div className={styles.stat}>
                <BookOpenIcon className="w-5 h-5 flex-shrink-0" />
                <span>
                  {summary.moduleCount} Module Section
                  {summary.moduleCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}
            {summary.quizCount > 0 && (
              <div className={styles.stat}>
                <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                <span>
                  {summary.quizCount} Quiz Attempt
                  {summary.quizCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <p className={styles.warning}>
            Your guest progress will be transferred to your account. This action
            cannot be undone.
          </p>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.skipButton}
            onClick={handleDismiss}
            disabled={isLoading}
          >
            Skip
          </button>
          <Button onClick={handleMigrate} disabled={isLoading}>
            {isLoading ? "Transferring..." : "Transfer Progress"}
          </Button>
        </div>
      </div>
    </div>
  );
}
