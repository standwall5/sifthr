"use client";

import React, { useState, useEffect } from "react";
import Button from "@/app/components/Button/Button";
import Loading from "@/app/components/Loading";
import styles from "./dailyFacts.module.css";

type DailyFact = {
  id: number;
  fact_text: string;
  language: string;
  created_at: string;
  is_active: boolean;
};

export default function AdminDailyFactsPage() {
  const [facts, setFacts] = useState<DailyFact[]>([]);
  const [loading, setLoading] = useState(false);
  const [factText, setFactText] = useState("");
  const [language, setLanguage] = useState<"en" | "tl">("en");

  useEffect(() => {
    fetchFacts();
  }, []);

  async function fetchFacts() {
    try {
      const res = await fetch("/api/admin/daily-facts");
      if (res.ok) {
        const data = await res.json();
        setFacts(data.facts || []);
      }
    } catch (error) {
      console.error("Failed to fetch facts:", error);
    }
  }

  async function handleCreateFact(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/daily-facts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fact_text: factText,
          language: language,
        }),
      });

      if (res.ok) {
        alert("Daily fact created successfully!");
        setFactText("");
        fetchFacts();
      } else {
        alert("Failed to create daily fact");
      }
    } catch (error) {
      console.error("Error creating fact:", error);
      alert("Error creating fact");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteFact(id: number) {
    if (!confirm("Are you sure you want to delete this fact?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/daily-facts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Fact deleted successfully!");
        fetchFacts();
      } else {
        alert("Failed to delete fact");
      }
    } catch (error) {
      console.error("Error deleting fact:", error);
      alert("Error deleting fact");
    }
  }

  async function handleToggleActive(id: number, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/daily-facts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (res.ok) {
        fetchFacts();
      } else {
        alert("Failed to update fact");
      }
    } catch (error) {
      console.error("Error updating fact:", error);
      alert("Error updating fact");
    }
  }

  const factsEn = facts.filter((f) => f.language === "en");
  const factsTl = facts.filter((f) => f.language === "tl");

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Daily Scam Facts</h1>
        <p>Manage daily educational facts about scams</p>
      </div>

      <div className={styles.content}>
        <div className={styles.createSection}>
          <h2>➕ Create New Fact</h2>
          <form onSubmit={handleCreateFact} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "tl")}
                className={styles.select}
              >
                <option value="en">English</option>
                <option value="tl">Tagalog</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="factText">Fact Text</label>
              <textarea
                id="factText"
                value={factText}
                onChange={(e) => setFactText(e.target.value)}
                placeholder="Enter an educational fact about scams..."
                rows={4}
                required
              />
              <small className={styles.hint}>
                Keep it short and informative (recommended: 150-200 characters)
              </small>
            </div>

            <Button
              type="submit"
              loading={loading}
              loadingComponent={<Loading color="black" />}
            >
              Create Fact
            </Button>
          </form>
        </div>

        <div className={styles.factsLists}>
          <div className={styles.factsList}>
            <h2>English Facts ({factsEn.length})</h2>
            {factsEn.length === 0 ? (
              <p className={styles.emptyState}>No English facts yet</p>
            ) : (
              <div className={styles.factCards}>
                {factsEn.map((fact) => (
                  <div key={fact.id} className={styles.factCard}>
                    <div className={styles.factHeader}>
                      <span
                        className={`${styles.statusBadge} ${
                          fact.is_active ? styles.active : styles.inactive
                        }`}
                      >
                        {fact.is_active ? "✓ Active" : "○ Inactive"}
                      </span>
                    </div>
                    <p className={styles.factText}>{fact.fact_text}</p>
                    <div className={styles.factActions}>
                      <button
                        onClick={() =>
                          handleToggleActive(fact.id, fact.is_active)
                        }
                        className={styles.toggleBtn}
                      >
                        {fact.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDeleteFact(fact.id)}
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.factsList}>
            <h2>Tagalog Facts ({factsTl.length})</h2>
            {factsTl.length === 0 ? (
              <p className={styles.emptyState}>No Tagalog facts yet</p>
            ) : (
              <div className={styles.factCards}>
                {factsTl.map((fact) => (
                  <div key={fact.id} className={styles.factCard}>
                    <div className={styles.factHeader}>
                      <span
                        className={`${styles.statusBadge} ${
                          fact.is_active ? styles.active : styles.inactive
                        }`}
                      >
                        {fact.is_active ? "✓ Active" : "○ Inactive"}
                      </span>
                    </div>
                    <p className={styles.factText}>{fact.fact_text}</p>
                    <div className={styles.factActions}>
                      <button
                        onClick={() =>
                          handleToggleActive(fact.id, fact.is_active)
                        }
                        className={styles.toggleBtn}
                      >
                        {fact.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDeleteFact(fact.id)}
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
