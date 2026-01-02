"use client";

import React from "react";
import styles from "./BadgeModal.module.css";
import Button from "../Button/Button";

type BadgeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  badgeName: string;
  badgeDescription: string;
  badgeIcon?: string;
  type?: "badge" | "milestone" | "streak";
};

export default function BadgeModal({
  isOpen,
  onClose,
  badgeName,
  badgeDescription,
  badgeIcon,
  type = "badge",
}: BadgeModalProps) {
  if (!isOpen) return null;

  const emoji = type === "streak" ? "🔥" : type === "milestone" ? "🏆" : "🎖️";

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.celebration}>
          <div className={styles.confetti}>🎉</div>
          <div className={styles.confetti}>✨</div>
          <div className={styles.confetti}>🌟</div>
        </div>

        <div className={styles.badgeContainer}>
          {badgeIcon ? (
            <img src={badgeIcon} alt={badgeName} className={styles.badgeIcon} />
          ) : (
            <div className={styles.badgeEmoji}>{emoji}</div>
          )}
        </div>

        <h1 className={styles.title}>Congratulations!</h1>
        <h2 className={styles.badgeName}>{badgeName}</h2>
        <p className={styles.description}>{badgeDescription}</p>

        <Button onClick={onClose} className={styles.closeButton}>
          Awesome!
        </Button>
      </div>
    </div>
  );
}
