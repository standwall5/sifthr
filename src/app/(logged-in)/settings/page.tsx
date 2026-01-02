"use client";

import React from "react";
import MediumCard from "@/app/components/MediumCard";
import { useLanguage } from "@/app/context/LanguageContext";
import styles from "./settings.module.css";

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={styles.settingsWrapper}>
      <h1 className={styles.title}>{t("settings.title")}</h1>

      <MediumCard>
        <div className={styles.settingSection}>
          <h2>{t("settings.language")}</h2>
          <div className={styles.optionGroup}>
            <button
              className={`${styles.optionButton} ${language === "en" ? styles.active : ""}`}
              onClick={() => setLanguage("en")}
            >
              <span className={styles.icon}>🇺🇸</span>
              {t("settings.english")}
            </button>
            <button
              className={`${styles.optionButton} ${language === "tl" ? styles.active : ""}`}
              onClick={() => setLanguage("tl")}
            >
              <span className={styles.icon}>🇵🇭</span>
              {t("settings.tagalog")}
            </button>
          </div>
        </div>
      </MediumCard>

      <div className={styles.infoBox}>
        <p>💡 Your preferences are saved automatically</p>
      </div>
    </div>
  );
}
