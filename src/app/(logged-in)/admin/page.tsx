"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";
import ModuleForm from "./components/ModuleForm";
import QuizForm from "./components/QuizForm";
import BadgeForm from "./components/BadgeForm";

type Tab = "modules" | "quizzes" | "badges";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("modules");

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1>Admin Panel</h1>
        <p>Manage learning content, quizzes, and badges</p>
      </div>

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === "modules" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("modules")}
        >
          📚 Modules & Sections
        </button>
        <button
          className={`${styles.tab} ${activeTab === "quizzes" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("quizzes")}
        >
          📝 Quizzes & Questions
        </button>
        <button
          className={`${styles.tab} ${activeTab === "badges" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("badges")}
        >
          🎖️ Badges & Rewards
        </button>
      </div>

      <div className={styles.contentArea}>
        {activeTab === "modules" && <ModuleForm />}
        {activeTab === "quizzes" && <QuizForm />}
        {activeTab === "badges" && <BadgeForm />}
      </div>
    </div>
  );
}
