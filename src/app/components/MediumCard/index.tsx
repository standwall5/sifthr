"use client";
import React from "react";
import styles from "./MediumCard.module.css";

type MediumCardProps = {
  title?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  description?: string;
  role?: string;
  tabIndex?: number;
  hovered?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onClick?: () => void;
};

export default function MediumCard({
  title,
  footer,
  children,
  className,
  description,
  role,
  tabIndex,
  onKeyDown,
  onClick,
  hovered,
}: MediumCardProps) {
  const classes = [styles.card, onClick ? styles.clickable : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`${classes} ${styles.mediumCard} ${hovered ? styles.hovered : ""}`}
      onClick={onClick}
    >
      <div className={styles.body}>{children}</div>
    </div>
  );
}
