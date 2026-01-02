"use client";

import React, { useState } from "react";
import Image from "next/image";
import "@/app/(logged-in)/style.css";
import styles from "./support.module.css";

const Support = () => {
  const supportOrganizations = [
    {
      name: "National Privacy Commission",
      imageUrl: "/assets/images/NPC_Logo.webp",
      supportId: "national-privacy-commission",
    },
    {
      name: "Anti-Cybercrime Group",
      imageUrl: "/assets/images/AGC_Logo.webp",
      supportId: "agc-pnp",
    },
    {
      name: "Department of Trade and Industry",
      imageUrl: "/assets/images/AGC_Logo.webp",
      supportId: "agc-pnp",
    },
  ];
  return (
    <div className="module-container">
      <div className="module-quiz-box">
        <div className={`module-quiz-collection ${styles.supportCollection}`}>
          {supportOrganizations.map((org) => (
            <div
              key={org.supportId}
              className={`module-quiz-card ${styles.supportCard}`}
            >
              <img
                className={styles.supportLogo}
                src={org.imageUrl}
                alt={org.name}
              />
              <div className={styles.supportName}>{org.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
