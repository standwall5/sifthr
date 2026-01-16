"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/app/lib/supabaseClient";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  isGuestMode,
  isGuestModuleCompleted,
  getGuestModuleProgress,
} from "@/app/lib/guestService";
import {
  BookOpenIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import styles from "./RecommendedModules.module.css";

type Module = {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  difficulty?: string;
  estimated_minutes?: number;
};

export default function RecommendedModules() {
  const { t } = useLanguage();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendedModules();
  }, []);

  async function fetchRecommendedModules() {
    try {
      const isGuest = isGuestMode();

      // Get all modules
      const { data: allModules, error } = await supabase
        .from("modules")
        .select("*")
        .order("difficulty", { ascending: true })
        .order("id", { ascending: true });

      if (error) throw error;

      let incompleteModules = allModules || [];

      if (isGuest) {
        // For guest users: show all modules (don't filter by completion)
        incompleteModules = allModules || [];
      } else {
        // For authenticated users: filter out completed modules
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Get user's completed modules
          const { data: progress } = await supabase
            .from("module_progress")
            .select("module_id")
            .eq("user_id", user.id);

          const completedModuleIds = progress?.map((p) => p.module_id) || [];

          // Filter out completed modules
          incompleteModules =
            allModules?.filter((m) => !completedModuleIds.includes(m.id)) || [];
        }
      }

      setModules(incompleteModules?.slice(0, 3) || []);
    } catch (error) {
      console.error("Error fetching recommended modules:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.recommendedSection}>
        <h2 className={styles.sectionTitle}>
          <BookOpenIcon className="w-6 h-6 inline-block mr-2" />
          Recommended Modules
        </h2>
        <div className={styles.loadingState}>Loading recommendations...</div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className={styles.recommendedSection}>
        <h2 className={styles.sectionTitle}>
          <BookOpenIcon className="w-6 h-6 inline-block mr-2" />
          Recommended Modules
        </h2>
        <div className={styles.emptyState}>
          <p>
            <SparklesIcon className="w-5 h-5 inline-block mr-1" />
            You&apos;ve completed all modules! Great job!
          </p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "#22c55e";
      case "medium":
        return "#f59e0b";
      case "hard":
        return "#ef4444";
      default:
        return "var(--purple)";
    }
  };

  return (
    <div className={styles.recommendedSection}>
      <h2 className={styles.sectionTitle}>
        <BookOpenIcon className="w-6 h-6 inline-block mr-2" />
        Recommended for You
      </h2>
      <div className={styles.moduleGrid}>
        {modules.map((module) => (
          <Link
            key={module.id}
            href={`/modules/${module.id}`}
            className={styles.moduleCard}
          >
            <div className={styles.moduleImage}>
              {module.image_url ? (
                <Image
                  src={module.image_url}
                  alt={module.title}
                  fill
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const placeholder = e.currentTarget.parentElement?.querySelector('.icon-placeholder');
                    if (placeholder) {
                      (placeholder as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div className={`${styles.imagePlaceholder} icon-placeholder`} style={{ display: module.image_url ? 'none' : 'flex' }}>
                <BookOpenIcon className="w-12 h-12" />
              </div>
            </div>
            <div className={styles.moduleContent}>
              <div className={styles.moduleMeta}>
                {module.difficulty && (
                  <span
                    className={styles.difficultyBadge}
                    style={{
                      backgroundColor: `${getDifficultyColor(
                        module.difficulty
                      )}20`,
                      color: getDifficultyColor(module.difficulty),
                    }}
                  >
                    {module.difficulty}
                  </span>
                )}
                {module.estimated_minutes && (
                  <span className={styles.timeBadge}>
                    <ClockIcon className="w-4 h-4 inline-block mr-1" />
                    {module.estimated_minutes} min
                  </span>
                )}
              </div>
              <h3 className={styles.moduleTitle}>{module.title}</h3>
              <p className={styles.moduleDescription}>{module.description}</p>
              <div className={styles.moduleAction}>Start Learning →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
