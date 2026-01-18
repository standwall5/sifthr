"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { isGuestMode } from "@/app/lib/guestService";
import SafeImage from "@/app/components/SafeImage";
import { SparklesIcon } from "@heroicons/react/24/outline";
import styles from "./BadgeScroll.module.css";
import { TrophyIcon } from "@heroicons/react/24/outline";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

type Badge = {
  id: number;
  name: string;
  description: string;
  icon_url?: string;
  rarity: string;
  points: number;
  is_earned: boolean;
};

export default function BadgeScroll() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortReversed, setSortReversed] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBadges();
  }, []);

  async function fetchBadges() {
    try {
      const isGuest = isGuestMode();

      // Get all badges
      const { data: allBadges, error: badgesError } = await supabase
        .from("badges")
        .select("*")
        .order("points", { ascending: true });

      if (badgesError) throw badgesError;

      if (isGuest) {
        // For guest users: show all badges as locked
        const badgesWithStatus = allBadges?.map((badge) => ({
          ...badge,
          is_earned: false,
        }));
        setBadges(badgesWithStatus || []);
      } else {
        // For authenticated users: check which badges they've earned
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // Show all badges as locked for non-authenticated users too
          const badgesWithStatus = allBadges?.map((badge) => ({
            ...badge,
            is_earned: false,
          }));
          setBadges(badgesWithStatus || []);
          setLoading(false);
          return;
        }

        // Get app user id from auth id
        const { data: appUser } = await supabase
          .from("users")
          .select("id")
          .eq("auth_id", user.id)
          .single();

        if (!appUser) {
          // Show all badges as locked if no app user found
          const badgesWithStatus = allBadges?.map((badge) => ({
            ...badge,
            is_earned: false,
          }));
          setBadges(badgesWithStatus || []);
          setLoading(false);
          return;
        }

        // Get user's earned badges
        const { data: userBadges } = await supabase
          .from("user_badges")
          .select("badge_id")
          .eq("user_id", appUser.id);

        const earnedBadgeIds = userBadges?.map((ub) => ub.badge_id) || [];

        // Combine data
        const badgesWithStatus = allBadges?.map((badge) => ({
          ...badge,
          is_earned: earnedBadgeIds.includes(badge.id),
        }));

        setBadges(badgesWithStatus || []);
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
    } finally {
      setLoading(false);
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const toggleSort = () => {
    setSortReversed(!sortReversed);
    setBadges([...badges].reverse());
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "#9ca3af";
      case "rare":
        return "#3b82f6";
      case "epic":
        return "#a855f7";
      case "legendary":
        return "#f59e0b";
      default:
        return "var(--purple)";
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)";
      case "rare":
        return "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
      case "epic":
        return "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)";
      case "legendary":
        return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
      default:
        return "linear-gradient(135deg, var(--purple) 0%, #7c3aed 100%)";
    }
  };

  if (loading) {
    return (
      <div className={styles.badgeSection}>
        <h2 className={styles.sectionTitle}>
          <TrophyIcon className="w-6 h-6 inline-block mr-2" />
          Your Badges
        </h2>
        <div className={styles.loadingState}>Loading badges...</div>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className={styles.badgeSection}>
        <h2 className={styles.sectionTitle}>
          <TrophyIcon className="w-6 h-6 inline-block mr-2" />
          Your Badges
        </h2>
        <div className={styles.emptyState}>
          <p>Complete modules and quizzes to earn badges!</p>
        </div>
      </div>
    );
  }

  const earnedCount = badges.filter((b) => b.is_earned).length;

  return (
    <div className={styles.badgeSection}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.sectionTitle}>
            <TrophyIcon className="w-6 h-6 inline-block mr-2" />
            Your Badges
          </h2>
          <p className={styles.badgeCount}>
            {earnedCount} of {badges.length} earned
          </p>
        </div>
        <button
          onClick={toggleSort}
          className={styles.sortButton}
          title="Toggle sort order"
        >
          <ArrowsUpDownIcon className={styles.sortIcon} />
          {sortReversed ? "Hardest First" : "Easiest First"}
        </button>
      </div>

      <div className={styles.scrollContainer}>
        <button
          onClick={() => scroll("left")}
          className={`${styles.scrollButton} ${styles.scrollLeft}`}
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className={styles.scrollIcon} />
        </button>

        <div className={styles.badgeScroll} ref={scrollContainerRef}>
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`${styles.badgeCard} ${
                badge.is_earned ? styles.earned : styles.locked
              }`}
            >
              <div
                className={styles.badgeIcon}
                style={{ background: getRarityGradient(badge.rarity) }}
              >
                {badge.is_earned ? (
                  badge.icon_url ? (
                    badge.icon_url.startsWith("http") ||
                    badge.icon_url.startsWith("/") ? (
                      <SafeImage
                        src={badge.icon_url}
                        alt={badge.name}
                        fallbackIcon={SparklesIcon}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <span className={styles.emojiIcon}>{badge.icon_url}</span>
                    )
                  ) : (
                    <span className={styles.defaultIcon}>
                      <TrophyIcon className="w-8 h-8" />
                    </span>
                  )
                ) : (
                  <span className={styles.lockedIcon}>
                    <LockClosedIcon className="w-8 h-8" />
                  </span>
                )}
              </div>
              <div className={styles.badgeInfo}>
                <div
                  className={styles.rarityBadge}
                  style={{
                    backgroundColor: `${getRarityColor(badge.rarity)}20`,
                    color: getRarityColor(badge.rarity),
                  }}
                >
                  {badge.rarity}
                </div>
                <h3 className={styles.badgeName}>
                  {badge.is_earned ? badge.name : "???"}
                </h3>
                <p className={styles.badgeDescription}>
                  {badge.is_earned
                    ? badge.description
                    : "Complete challenges to unlock"}
                </p>
                <div className={styles.badgePoints}>
                  {badge.is_earned ? `${badge.points} points` : "Locked"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className={`${styles.scrollButton} ${styles.scrollRight}`}
          aria-label="Scroll right"
        >
          <ChevronRightIcon className={styles.scrollIcon} />
        </button>
      </div>
    </div>
  );
}
