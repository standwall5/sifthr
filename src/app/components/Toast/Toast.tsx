"use client";

import React, { useEffect } from "react";
import {
  FireIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import styles from "./Toast.module.css";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info" | "streak";
  duration?: number;
  onClose: () => void;
  icon?: React.ReactNode;
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

  const getDefaultIcon = () => {
    if (type === "streak") {
      return <FireIcon className="w-6 h-6 text-yellow-500" />;
    }
    if (type === "success") {
      return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
    }
    if (type === "error") {
      return <ExclamationCircleIcon className="w-6 h-6 text-red-500" />;
    }
    return <InformationCircleIcon className="w-6 h-6 text-blue-500" />;
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.icon}>{icon || getDefaultIcon()}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
