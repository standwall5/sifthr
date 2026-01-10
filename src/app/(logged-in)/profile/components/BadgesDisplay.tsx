"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import MediumCard from "@/app/components/MediumCard";
import styles from "./BadgesDisplay.module.css";
import type { UserBadge } from "@/app/lib/models/types";

export default function BadgesDisplay({ userId }: { userId: string }) {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBadges = useCallback(async () => {
    try {
      const res = await fetch(`/api/badges/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setBadges(data.badges || []);
      }
    } catch (error) {
      console.error("Failed to fetch badges:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserBadges();
  }, [fetchUserBadges]);

  if (loading)
    return (
      <MediumCard>
        <div>Loading badges...</div>
      </MediumCard>
    );

  return (
    <MediumCard>
      <div className={styles.badgesContainer}>
        <h3 className={styles.title}>🏆 Your Badges</h3>

        {badges.length === 0 ? (
          <p className={styles.noBadges}>
            No badges yet! Complete modules and quizzes to earn badges.
          </p>
        ) : (
          <div className={styles.badgeGrid}>
            {badges.map((userBadge) => (
              <div key={userBadge.id} className={styles.badgeCard}>
                <div className={styles.badgeIcon}>
                  {userBadge.badge?.icon_url ? (
                    <Image
                      src={userBadge.badge.icon_url}
                      alt={userBadge.badge.name}
                      width={64}
                      height={64}
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <span className={styles.badgeEmoji}>
                      {userBadge.badge?.badge_type === "streak"
                        ? "🔥"
                        : userBadge.badge?.badge_type === "milestone"
                          ? "🏆"
                          : "🎖️"}
                    </span>
                  )}
                </div>
                <div className={styles.badgeInfo}>
                  <h4>{userBadge.badge?.name}</h4>
                  <p>{userBadge.badge?.description}</p>
                  <span className={styles.earnedDate}>
                    Earned: {new Date(userBadge.earned_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MediumCard>
  );
}
