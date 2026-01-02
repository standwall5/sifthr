"use client";

import React, { useEffect, useState } from "react";
import styles from "./StreakDisplay.module.css";
import type { UserStreak } from "@/app/lib/models/types";

export default function StreakDisplay() {
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreak();

    // Listen for streak updates
    const handleStreakUpdate = (event: CustomEvent) => {
      setStreak(event.detail.streak);
    };

    window.addEventListener(
      "streak:updated",
      handleStreakUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "streak:updated",
        handleStreakUpdate as EventListener,
      );
    };
  }, []);

  async function fetchStreak() {
    try {
      const res = await fetch("/api/streaks/current");
      if (res.ok) {
        const data = await res.json();
        setStreak(data.streak);
      }
    } catch (error) {
      console.error("Failed to fetch streak:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return null;
  if (!streak) return null;

  return (
    <div className={styles.streakContainer}>
      <div className={styles.streakIcon}>🔥</div>
      <div className={styles.streakInfo}>
        <div className={styles.currentStreak}>
          <span className={styles.streakNumber}>{streak.current_streak}</span>
          <span className={styles.streakLabel}>Day Streak</span>
        </div>
        <div className={styles.longestStreak}>
          <span className={styles.longestLabel}>
            Best: {streak.longest_streak} days
          </span>
        </div>
      </div>
    </div>
  );
}
