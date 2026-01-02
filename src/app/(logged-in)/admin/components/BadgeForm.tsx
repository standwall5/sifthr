"use client";

import React, { useState } from "react";
import Button from "@/app/components/Button/Button";
import Loading from "@/app/components/Loading";
import styles from "./Forms.module.css";

type BadgeType = "module_completion" | "milestone" | "streak" | "custom";

export default function BadgeForm() {
  const [loading, setLoading] = useState(false);

  const [badgeName, setBadgeName] = useState("");
  const [badgeDescription, setBadgeDescription] = useState("");
  const [badgeType, setBadgeType] = useState<BadgeType>("custom");
  const [iconUrl, setIconUrl] = useState("");
  const [requirementValue, setRequirementValue] = useState<number>(0);

  async function handleCreateBadge(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: badgeName,
          description: badgeDescription,
          badge_type: badgeType,
          icon_url: iconUrl || null,
          requirement_value: requirementValue || null,
        }),
      });

      if (res.ok) {
        alert("Badge created successfully!");
        setBadgeName("");
        setBadgeDescription("");
        setIconUrl("");
        setRequirementValue(0);
        setBadgeType("custom");
      } else {
        const data = await res.json();
        alert(`Failed to create badge: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating badge:", error);
      alert("Error creating badge");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.section}>
        <h2>🎖️ Create New Badge</h2>
        <form onSubmit={handleCreateBadge} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="badgeName">Badge Name</label>
            <input
              id="badgeName"
              type="text"
              value={badgeName}
              onChange={(e) => setBadgeName(e.target.value)}
              placeholder="e.g., First Steps"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="badgeDescription">Badge Description</label>
            <textarea
              id="badgeDescription"
              value={badgeDescription}
              onChange={(e) => setBadgeDescription(e.target.value)}
              placeholder="What this badge represents..."
              rows={3}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="badgeType">Badge Type</label>
            <select
              id="badgeType"
              value={badgeType}
              onChange={(e) => setBadgeType(e.target.value as BadgeType)}
              className={styles.select}
            >
              <option value="custom">Custom</option>
              <option value="module_completion">Module Completion</option>
              <option value="milestone">Milestone</option>
              <option value="streak">Streak</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="iconUrl">Badge Icon URL</label>
            <input
              id="iconUrl"
              type="url"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="/badges/your-badge.png"
            />
            <small className={styles.hint}>
              Leave empty to use default emoji. Upload to /public/badges/
              folder.
            </small>
          </div>

          {badgeType !== "custom" && (
            <div className={styles.formGroup}>
              <label htmlFor="requirementValue">Requirement Value</label>
              <input
                id="requirementValue"
                type="number"
                value={requirementValue}
                onChange={(e) => setRequirementValue(Number(e.target.value))}
                placeholder="e.g., 3 for 3 modules, 7 for 7-day streak"
              />
              <small className={styles.hint}>
                {badgeType === "module_completion" && "Module ID"}
                {badgeType === "milestone" && "Number of modules/quizzes"}
                {badgeType === "streak" && "Number of consecutive days"}
              </small>
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            loadingComponent={<Loading color="black" />}
          >
            Create Badge
          </Button>
        </form>
      </div>
    </div>
  );
}
