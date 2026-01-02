"use client";

import React, { useEffect } from "react";
import { useBadgeNotifications } from "../hooks/useBadgeNotifications";
import { useToast } from "../hooks/useToast";
import BadgeModal from "./Badges/BadgeModal";
import Toast from "./Toast/Toast";
import { supabase } from "@/app/lib/supabaseClient";

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showBadgeModal, currentBadge, checkForNewBadges, closeBadgeModal } =
    useBadgeNotifications();
  const { toasts, showToast, removeToast } = useToast();

  // Listen for module completions and quiz submissions
  useEffect(() => {
    const handleModuleComplete = () => {
      checkForNewBadges();
    };

    const handleQuizComplete = () => {
      checkForNewBadges();
    };

    const handleStreakUpdate = (event: CustomEvent) => {
      const { streak } = event.detail;
      if (streak && streak.current_streak > 0) {
        showToast(
          `🔥 ${streak.current_streak} day streak! Keep it up!`,
          "streak",
          "🔥",
        );
      }
    };

    const handleToastShow = (event: CustomEvent) => {
      const { message, type, icon } = event.detail;
      showToast(message, type || "info", icon);
    };

    window.addEventListener("module:completed", handleModuleComplete);
    window.addEventListener("quiz:completed", handleQuizComplete);
    window.addEventListener(
      "streak:updated",
      handleStreakUpdate as EventListener,
    );
    window.addEventListener("toast:show", handleToastShow as EventListener);

    return () => {
      window.removeEventListener("module:completed", handleModuleComplete);
      window.removeEventListener("quiz:completed", handleQuizComplete);
      window.removeEventListener(
        "streak:updated",
        handleStreakUpdate as EventListener,
      );
      window.removeEventListener(
        "toast:show",
        handleToastShow as EventListener,
      );
    };
  }, [checkForNewBadges, showToast]);

  // Check for streak on mount
  useEffect(() => {
    let cancelled = false;

    const checkStreak = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || cancelled) return;

      try {
        const res = await fetch("/api/streaks/update", { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          if (data.streak) {
            window.dispatchEvent(
              new CustomEvent("streak:updated", {
                detail: { streak: data.streak },
              }),
            );
          }
        }
      } catch (error) {
        console.error("Failed to check streak:", error);
      }
    };

    checkStreak();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {children}

      {/* Badge Modal */}
      {showBadgeModal && currentBadge && (
        <BadgeModal
          isOpen={showBadgeModal}
          onClose={closeBadgeModal}
          badgeName={currentBadge.badge.name}
          badgeDescription={currentBadge.badge.description || ""}
          badgeIcon={currentBadge.badge.icon_url}
          type={currentBadge.type}
        />
      )}

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          icon={toast.icon}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}
