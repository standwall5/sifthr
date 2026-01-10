"use client";
import React from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  formAction?: (formData: FormData) => void | Promise<void>; // ✅ Fixed type
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  loadingComponent?: React.ReactNode;
};

export default function Button({
  children,
  onClick,
  formAction,
  disabled,
  className,
  type = "button",
  loading = false,
  loadingComponent,
}: ButtonProps) {
  const buttonClassName = `${styles.adeducateButton} ${className || ""}`.trim();

  return (
    <button
      className={buttonClassName}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      formAction={formAction}
    >
      <div className={styles.body}>
        {loading && loadingComponent && (
          <span className={styles.loadingSpinner}>{loadingComponent}</span>
        )}
        <span className={loading ? styles.buttonTextWithLoading : ""}>
          {children}
        </span>
      </div>
    </button>
  );
}
