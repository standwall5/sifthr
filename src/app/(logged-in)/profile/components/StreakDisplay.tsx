"use client";

import React, { useEffect, useState } from "react";
import MediumCard from "@/app/components/MediumCard";
import { useLanguage } from "@/app/context/LanguageContext";
import styles from "./StreakDisplay.module.css";

interface UserStreak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}

interface StreakDisplayProps {
  userId: string;
}

export default function StreakDisplay({ userId }: StreakDisplayProps) {
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await fetch("/api/streaks/current");
        if (response.ok) {
          const data = await response.json();
          setStreak(data.streak);
        }
      } catch (error) {
        console.error("Error fetching streak:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, [userId]);

  if (loading) return null;
  if (!streak) return null;

  return (
    <MediumCard>
      <div className={styles.streakContainer}>
        <div className={styles.streakItem}>
          <div className={styles.streakIcon}>🔥</div>
          <div className={styles.streakInfo}>
            <div className={styles.streakNumber}>{streak.current_streak}</div>
            <div className={styles.streakLabel}>
              {t("profile.currentStreak")}
            </div>
          </div>
        </div>
        <div className={styles.streakItem}>
          <div className={styles.streakIcon}>🏆</div>
          <div className={styles.streakInfo}>
            <div className={styles.streakNumber}>{streak.longest_streak}</div>
            <div className={styles.streakLabel}>Longest Streak</div>
          </div>
        </div>
      </div>
    </MediumCard>
  );
}
