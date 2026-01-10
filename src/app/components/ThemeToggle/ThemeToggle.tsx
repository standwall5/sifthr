"use client";

import React from "react";
import { useTheme } from "@/app/context/ThemeContext";
import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  showLabel = false
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.themeToggle} ${className}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span className={styles.icon}>
        {theme === "light" ? "🌙" : "☀️"}
      </span>
      {showLabel && (
        <span className={styles.label}>
          {theme === "light" ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
