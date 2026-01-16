"use client";

import React from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  showLabel = false,
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
        {theme === "light" ? (
          <MoonIcon className="w-5 h-5" />
        ) : (
          <SunIcon className="w-5 h-5" />
        )}
      </span>
      {showLabel && (
        <span className={styles.label}>
          {theme === "light" ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
