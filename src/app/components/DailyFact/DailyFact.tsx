"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/app/context/LanguageContext";
import styles from "./DailyFact.module.css";

type DailyFact = {
  id: number;
  fact_text: string;
  language: string;
};

export default function DailyFact() {
  const { language } = useLanguage();
  const [fact, setFact] = useState<DailyFact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyFact();
  }, [language]);

  async function fetchDailyFact() {
    try {
      setLoading(true);
      const res = await fetch(`/api/daily-fact?language=${language}`);
      if (res.ok) {
        const data = await res.json();
        setFact(data.fact);
      }
    } catch (error) {
      console.error("Failed to fetch daily fact:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.dailyFactCard}>
        <div className={styles.loadingState}>Loading...</div>
      </div>
    );
  }

  if (!fact) {
    return null;
  }

  return (
    <div className={styles.dailyFactCard}>
      <div className={styles.mascotContainer}>
        <Image
          src="/assets/images/next-step/sifthr-mascot.webp"
          alt="SIFTHR Mascot"
          width={80}
          height={80}
          className={styles.mascot}
        />
      </div>
      <div className={styles.factContent}>
        <div className={styles.factHeader}>
          <span className={styles.badge}>
            <LightBulbIcon className="w-4 h-4 inline-block mr-1" />
            Daily Fact
          </span>
        </div>
        <p className={styles.factText}>{fact.fact_text}</p>
      </div>
    </div>
  );
}
