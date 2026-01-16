"use client";

import React from "react";
import MediumCard from "@/app/components/MediumCard";
import ChangePassword from "@/app/components/ChangePassword";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import styles from "./settings.module.css";

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.settingsWrapper}>
      <h1 className={styles.title}>{t("settings.title")}</h1>

      {/* Theme Settings */}
      <MediumCard>
        <div className={styles.settingSection}>
          <h2>Theme</h2>
          <div className={styles.optionGroup}>
            <button
              className={`${styles.optionButton} ${
                theme === "light" ? styles.active : ""
              }`}
              onClick={() => setTheme("light")}
            >
              <span className={styles.icon}>☀️</span>
              Light Mode
            </button>
            <button
              className={`${styles.optionButton} ${
                theme === "dark" ? styles.active : ""
              }`}
              onClick={() => setTheme("dark")}
            >
              <span className={styles.icon}>🌙</span>
              Dark Mode
            </button>
          </div>
        </div>
      </MediumCard>

      {/* Language Settings */}
      <MediumCard>
        <div className={styles.settingSection}>
          <h2>{t("settings.language")}</h2>
          <div className={styles.optionGroup}>
            <button
              className={`${styles.optionButton} ${
                language === "en" ? styles.active : ""
              }`}
              onClick={() => setLanguage("en")}
            >
              <span className={styles.icon}>🇺🇸</span>
              {t("settings.english")}
            </button>
            <button
              className={`${styles.optionButton} ${
                language === "tl" ? styles.active : ""
              }`}
              onClick={() => setLanguage("tl")}
            >
              <span className={styles.icon}>🇵🇭</span>
              {t("settings.tagalog")}
            </button>
          </div>
        </div>
      </MediumCard>

      {/* Info box now also wrapped in MediumCard for consistency */}
      <MediumCard>
        <div className={styles.infoBox}>
          <p>Your preferences are saved automatically</p>
        </div>
      </MediumCard>

      {/* Change Password Section */}
      <ChangePassword />
    </div>
  );
}
