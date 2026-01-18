"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrophyIcon,
  LockClosedIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { supabase } from "@/app/lib/supabaseClient";
import { isGuestMode } from "@/app/lib/guestService";
import SafeImage from "@/app/components/SafeImage";
import type { Badge, UserBadge } from "@/lib/models/types";
import styles from "./BadgeSidebar.module.css";

type BadgeSidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function BadgeSidebar({ isOpen, onToggle }: BadgeSidebarProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"easiest" | "hardest">("easiest");

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const isGuest = isGuestMode();

        // Fetch all badges from Supabase
        const { data: allBadges, error: badgesError } = await supabase
          .from("badges")
          .select("*")
          .order("id", { ascending: true });

        if (badgesError) {
          console.error("Error fetching badges:", badgesError);
          return;
        }

        setBadges(allBadges || []);

        if (isGuest) {
          // For guest users, no badges are earned
          setUserBadges([]);
        } else {
          // For authenticated users, fetch their earned badges
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            // First get app user id
            const { data: appUser } = await supabase
              .from("users")
              .select("id")
              .eq("auth_id", user.id)
              .single();

            if (appUser) {
              const { data: earnedBadges } = await supabase
                .from("user_badges")
                .select("*")
                .eq("user_id", appUser.id);

              setUserBadges(earnedBadges || []);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch badges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  const sortedBadges = [...badges].sort((a, b) => {
    const aVal = a.requirement_value || 0;
    const bVal = b.requirement_value || 0;
    return sortOrder === "easiest" ? aVal - bVal : bVal - aVal;
  });

  const unearnedBadges = sortedBadges.filter(
    (badge) => !userBadges.some((ub) => ub.badge_id === badge.id),
  );

  const nextBadge = unearnedBadges[0];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`${styles.toggleButton} ${
          isOpen ? styles.toggleOpen : styles.toggleClosed
        }`}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? (
          <ChevronLeftIcon className={styles.toggleIcon} />
        ) : (
          <ChevronRightIcon className={styles.toggleIcon} />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
      >
        <div className={styles.sidebarContent}>
          {/* Loading State */}
          {loading && (
            <div className={styles.loading}>
              <p>Loading badges...</p>
            </div>
          )}

          {/* No Badges State */}
          {!loading && badges.length === 0 && (
            <div className={styles.emptyState}>
              <TrophyIcon className={styles.emptyIcon} />
              <p>No badges available</p>
            </div>
          )}

          {/* Next Badge Section */}
          {!loading && nextBadge && (
            <div className={styles.nextBadgeSection}>
              <h3 className={styles.sectionTitle}>
                <TrophyIcon className={styles.trophyIcon} />
                Next Badge
              </h3>
              <div className={styles.nextBadgeCard}>
                <div className={styles.badgeIcon}>
                  {userBadges.length === 0 ? (
                    <LockClosedIcon className={styles.defaultBadgeIcon} />
                  ) : nextBadge.icon_url ? (
                    <SafeImage
                      src={nextBadge.icon_url}
                      alt={nextBadge.name}
                      fallbackIcon={SparklesIcon}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <TrophyIcon className={styles.defaultBadgeIcon} />
                  )}
                </div>
                <div className={styles.badgeInfo}>
                  <h4 className={styles.badgeName}>
                    {userBadges.length === 0 ? "???" : nextBadge.name}
                  </h4>
                  <p className={styles.badgeDescription}>
                    {userBadges.length === 0
                      ? "Complete modules to unlock badges"
                      : nextBadge.description || "Earn this badge!"}
                  </p>
                  {nextBadge.requirement_value && (
                    <div className={styles.badgeProgress}>
                      <span className={styles.progressText}>
                        {userBadges.length === 0
                          ? "Locked"
                          : `Goal: ${nextBadge.requirement_value}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* All Badges Section */}
          {!loading && badges.length > 0 && (
            <div className={styles.badgeListSection}>
              <div className={styles.listHeader}>
                <h3 className={styles.sectionTitle}>All Badges</h3>
                <button
                  onClick={() =>
                    setSortOrder(
                      sortOrder === "easiest" ? "hardest" : "easiest",
                    )
                  }
                  className={styles.sortButton}
                >
                  {sortOrder === "easiest" ? "Easiest First" : "Hardest First"}
                </button>
              </div>

              {loading ? (
                <div className={styles.loading}>Loading badges...</div>
              ) : (
                <div className={styles.badgeList}>
                  {sortedBadges.map((badge) => {
                    const isEarned = userBadges.some(
                      (ub) => ub.badge_id === badge.id,
                    );
                    return (
                      <div
                        key={badge.id}
                        className={`${styles.badgeItem} ${
                          isEarned ? styles.earned : styles.locked
                        }`}
                      >
                        <div className={styles.badgeIconSmall}>
                          {isEarned ? (
                            badge.icon_url ? (
                              <SafeImage
                                src={badge.icon_url}
                                alt={badge.name}
                                fallbackIcon={SparklesIcon}
                                className={styles.smallIcon}
                                style={{ width: "100%", height: "100%" }}
                              />
                            ) : (
                              <TrophyIcon className={styles.smallIcon} />
                            )
                          ) : (
                            <LockClosedIcon className={styles.smallIcon} />
                          )}
                        </div>
                        <div className={styles.badgeDetails}>
                          <span className={styles.badgeNameSmall}>
                            {isEarned ? badge.name : "???"}
                          </span>
                          {badge.requirement_value && (
                            <span className={styles.requirement}>
                              {isEarned ? badge.requirement_value : "Locked"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
