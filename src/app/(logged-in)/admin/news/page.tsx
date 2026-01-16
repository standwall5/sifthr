"use client";

import React from "react";
import styles from "./adminPage.module.css";

export default function AdminNewsPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>News Management</h1>
        <p>Fetch and manage news articles</p>
      </div>
      <div className={styles.content}>
        <p className={styles.placeholder}>News management coming soon...</p>
      </div>
    </div>
  );
}
