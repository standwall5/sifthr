"use client";

import React, { useEffect } from "react";
import styles from "./Toast.module.css";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info" | "streak";
  duration?: number;
  onClose: () => void;
  icon?: string;
};

export default function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
  icon,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const defaultIcon =
    type === "success"
      ? "✓"
      : type === "error"
        ? "✕"
        : type === "streak"
          ? "🔥"
          : "ℹ";

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.icon}>{icon || defaultIcon}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeBtn} onClick={onClose}>
        ×
      </button>
    </div>
  );
}
