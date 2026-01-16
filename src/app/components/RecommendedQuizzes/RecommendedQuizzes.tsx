"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";
import { isGuestMode } from "@/app/lib/guestService";
import {
  CheckBadgeIcon,
  ClockIcon,
  SparklesIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import styles from "./RecommendedQuizzes.module.css";

type Quiz = {
  id: number;
  title: string;
  description: string;
  module_id?: number;
  passing_score?: number;
  time_limit_minutes?: number;
};

export default function RecommendedQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendedQuizzes();
  }, []);

  async function fetchRecommendedQuizzes() {
    try {
      const isGuest = isGuestMode();

      // Get all quizzes
      const { data: allQuizzes, error } = await supabase
        .from("quizzes")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      let incompleteQuizzes = allQuizzes || [];

      if (isGuest) {
        // For guest users: show all quizzes (don't filter by completion)
        incompleteQuizzes = allQuizzes || [];
      } else {
        // For authenticated users: filter out completed quizzes
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Get user's completed quizzes
          const { data: submissions } = await supabase
            .from("quiz_submissions")
            .select("quiz_id")
            .eq("user_id", user.id);

          const completedQuizIds = submissions?.map((s) => s.quiz_id) || [];

          // Filter out completed quizzes
          incompleteQuizzes =
            allQuizzes?.filter((q) => !completedQuizIds.includes(q.id)) || [];
        }
      }

      setQuizzes(incompleteQuizzes?.slice(0, 3) || []);
    } catch (error) {
      console.error("Error fetching recommended quizzes:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.recommendedSection}>
        <h2 className={styles.sectionTitle}>
          <DocumentTextIcon className="w-6 h-6 inline-block mr-2" />
          Recommended Quizzes
        </h2>
        <div className={styles.loadingState}>Loading recommendations...</div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className={styles.recommendedSection}>
        <h2 className={styles.sectionTitle}>
          <DocumentTextIcon className="w-6 h-6 inline-block mr-2" />
          Recommended Quizzes
        </h2>
        <div className={styles.emptyState}>
          <p>
            <SparklesIcon className="w-5 h-5 inline-block mr-1" />
            You&apos;ve completed all quizzes! Excellent work!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.recommendedSection}>
      <h2 className={styles.sectionTitle}>
        <DocumentTextIcon className="w-6 h-6 inline-block mr-2" />
        Test Your Knowledge
      </h2>
      <div className={styles.quizGrid}>
        {quizzes.map((quiz) => (
          <Link
            key={quiz.id}
            href={`/quizzes/${quiz.id}`}
            className={styles.quizCard}
          >
            <div className={styles.quizIcon}>
              <DocumentTextIcon className="w-8 h-8" />
            </div>
            <div className={styles.quizContent}>
              <h3 className={styles.quizTitle}>{quiz.title}</h3>
              <p className={styles.quizDescription}>{quiz.description}</p>
              <div className={styles.quizMeta}>
                {quiz.passing_score && (
                  <span className={styles.metaItem}>
                    <CheckBadgeIcon className="w-4 h-4 inline-block mr-1" />
                    Pass: {quiz.passing_score}%
                  </span>
                )}
                {quiz.time_limit_minutes && (
                  <span className={styles.metaItem}>
                    <ClockIcon className="w-4 h-4 inline-block mr-1" />
                    {quiz.time_limit_minutes} min
                  </span>
                )}
              </div>
              <div className={styles.quizAction}>Start Quiz →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
