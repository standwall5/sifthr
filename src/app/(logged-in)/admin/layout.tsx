"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  TrophyIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  LanguageIcon,
  PhotoIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import styles from "./adminLayout.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "Overview",
      href: "/admin",
      icon: HomeIcon,
      description: "Dashboard and quick stats",
    },
    {
      name: "Modules",
      href: "/admin/modules",
      icon: AcademicCapIcon,
      description: "Learning modules and sections",
    },
    {
      name: "Quizzes",
      href: "/admin/quizzes",
      icon: ClipboardDocumentListIcon,
      description: "Quizzes and questions",
    },
    {
      name: "Badges",
      href: "/admin/badges",
      icon: TrophyIcon,
      description: "Badges and achievements",
    },
    {
      name: "News",
      href: "/admin/news",
      icon: NewspaperIcon,
      description: "News articles",
    },
    {
      name: "Daily Facts",
      href: "/admin/daily-facts",
      icon: ChatBubbleLeftRightIcon,
      description: "Daily scam facts",
    },
    {
      name: "Images",
      href: "/admin/images",
      icon: PhotoIcon,
      description: "Image management",
    },
    {
      name: "Translations",
      href: "/admin/translations",
      icon: LanguageIcon,
      description: "Multilingual content",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={styles.adminLayout}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={styles.menuButton}
        >
          {sidebarOpen ? (
            <XMarkIcon className={styles.menuIcon} />
          ) : (
            <Bars3Icon className={styles.menuIcon} />
          )}
        </button>
        <h1 className={styles.mobileTitle}>Admin Panel</h1>
      </div>

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>
            <span className={styles.logo}>
              <CogIcon className="w-6 h-6" />
            </span>
            Admin Panel
          </h2>
          <p className={styles.sidebarSubtitle}>Content Management System</p>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${
                  active ? styles.navItemActive : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={styles.navIcon} />
                <div className={styles.navContent}>
                  <span className={styles.navName}>{item.name}</span>
                  <span className={styles.navDescription}>
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/home" className={styles.backButton}>
            ← Back to Home
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
