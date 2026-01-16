"use client";

import React from "react";
import styles from "./adminPage.module.css";

export default function AdminImagesPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Image Management</h1>
        <p>Browse and manage uploaded images</p>
      </div>
      <div className={styles.content}>
        <p className={styles.placeholder}>Image management coming soon...</p>
      </div>
    </div>
  );
}
