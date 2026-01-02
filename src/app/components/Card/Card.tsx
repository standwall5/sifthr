"use client";
import React from "react";
import styles from "./Card.module.css";

type CardProps = {
  title?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  description?: string;
  onClick?: () => void;
};

export default function Card({
  title,
  footer,
  children,
  className,
  description,
  onClick,
}: CardProps) {
  const classes = [styles.card, onClick ? styles.clickable : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`${classes} ${styles.card}`} onClick={onClick}>
      {title && <div className={styles.header}>{title}</div>}
      {description && <div className={styles.description}>{description}</div>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}

      <svg
        className={styles.animatedBorderSvg}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <rect x="2" y="2" width="96" height="96" rx="16" ry="16" />
      </svg>
    </div>
  );
}
