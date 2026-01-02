"use client";

import { useState, useEffect, useCallback } from "react";
import type { Badge } from "@/app/lib/models/types";

type BadgeNotification = {
  badge: Badge;
  type: "badge" | "milestone" | "streak";
};

type BadgeCheckResponse = {
  badges: Array<{
    badge: Badge;
  }>;
};

export function useBadgeNotifications() {
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<BadgeNotification | null>(
    null,
  );
  const [badgeQueue, setBadgeQueue] = useState<BadgeNotification[]>([]);

  // Check for new badges
  const checkForNewBadges = useCallback(async () => {
    try {
      const res = await fetch("/api/badges/check", { method: "POST" });
      if (res.ok) {
        const data = (await res.json()) as BadgeCheckResponse;
        if (data.badges && data.badges.length > 0) {
          const notifications: BadgeNotification[] = data.badges.map((ub) => ({
            badge: ub.badge,
            type:
              ub.badge.badge_type === "streak"
                ? "streak"
                : ub.badge.badge_type === "milestone"
                  ? "milestone"
                  : "badge",
          }));
          setBadgeQueue((prev) => [...prev, ...notifications]);
        }
      }
    } catch (error) {
      console.error("Failed to check badges:", error);
    }
  }, []);

  // Show next badge in queue
  useEffect(() => {
    if (badgeQueue.length > 0 && !showBadgeModal) {
      const nextBadge = badgeQueue[0];
      setCurrentBadge(nextBadge);
      setShowBadgeModal(true);
      setBadgeQueue((prev) => prev.slice(1));
    }
  }, [badgeQueue, showBadgeModal]);

  const closeBadgeModal = useCallback(() => {
    setShowBadgeModal(false);
    setCurrentBadge(null);
  }, []);

  return {
    showBadgeModal,
    currentBadge,
    checkForNewBadges,
    closeBadgeModal,
  };
}
