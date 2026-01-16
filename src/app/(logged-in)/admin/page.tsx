"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./admin.module.css";
import {
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  TrophyIcon,
  NewspaperIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function AdminPage() {
  const [stats, setStats] = useState({
    modules: 0,
    quizzes: 0,
    badges: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [modulesRes, quizzesRes, badgesRes] = await Promise.all([
        fetch("/api/admin/modules"),
        fetch("/api/getQuizzes"),
        fetch("/api/admin/badges"),
      ]);

      const [modulesData, quizzesData, badgesData] = await Promise.all([
        modulesRes.json(),
        quizzesRes.json(),
        badgesRes.json(),
      ]);

      setStats({
        modules: modulesData.modules?.length || 0,
        quizzes: quizzesData.quizzes?.length || 0,
        badges: badgesData.badges?.length || 0,
        users: 0, // TODO: Add users count endpoint
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }

  const quickActions = [
    {
      title: "Manage Modules",
      description: "Create and edit learning modules",
      icon: AcademicCapIcon,
      href: "/admin/modules",
      color: "#c8e524",
    },
    {
      title: "Manage Quizzes",
      description: "Create and edit quizzes",
      icon: ClipboardDocumentListIcon,
      href: "/admin/quizzes",
      color: "#83a5f0",
    },
    {
      title: "Manage Badges",
      description: "Create and edit badges",
      icon: TrophyIcon,
      href: "/admin/badges",
      color: "#9955eb",
    },
    {
      title: "Manage News",
      description: "Fetch and manage news articles",
      icon: NewspaperIcon,
      href: "/admin/news",
      color: "#ff6b35",
    },
  ];

  const statsCards = [
    {
      label: "Total Modules",
      value: stats.modules,
      icon: AcademicCapIcon,
      color: "#c8e524",
    },
    {
      label: "Total Quizzes",
      value: stats.quizzes,
      icon: ClipboardDocumentListIcon,
      color: "#83a5f0",
    },
    {
      label: "Total Badges",
      value: stats.badges,
      icon: TrophyIcon,
      color: "#9955eb",
    },
    {
      label: "Active Users",
      value: stats.users,
      icon: UserGroupIcon,
      color: "#ff6b35",
    },
  ];

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1>Admin Dashboard</h1>
        <p>Manage learning content, quizzes, and badges</p>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={styles.statCard}
              style={{ borderLeftColor: stat.color }}
            >
              <div className={styles.statIcon} style={{ color: stat.color }}>
                <Icon />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>
                  {loading ? "..." : stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={styles.actionCard}
              >
                <div
                  className={styles.actionIcon}
                  style={{ backgroundColor: action.color }}
                >
                  <Icon />
                </div>
                <h3 className={styles.actionTitle}>{action.title}</h3>
                <p className={styles.actionDescription}>{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
