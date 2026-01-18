"use client";

import React, { useState } from "react";
import Card from "@/app/components/Card/Card";
import SafeImage from "@/app/components/SafeImage";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import styles from "./support.module.css";

type Organization = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  purpose: string;
  services: string[];
  email?: string;
  hotline?: string;
  website?: string;
};

const Support = () => {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const supportOrganizations: Organization[] = [
    {
      id: "npc",
      name: "National Privacy Commission (NPC)",
      imageUrl: "/assets/images/NPC_Logo.webp",
      description:
        "Protects the fundamental human right to privacy and data protection in the Philippines.",
      purpose:
        "Report data breaches, unauthorized use of personal information, and privacy violations in online scams.",
      services: [
        "File complaints about misuse of personal data",
        "Report data breach incidents",
        "Get guidance on privacy rights",
        "Investigate privacy violations",
      ],
      email: "info@privacy.gov.ph",
      hotline: "(02) 8234-2228",
      website: "https://www.privacy.gov.ph",
    },
    {
      id: "pnp-acg",
      name: "PNP Anti-Cybercrime Group (ACG)",
      imageUrl: "/assets/images/AGC_Logo.webp",
      description:
        "The Philippine National Police unit dedicated to combating cybercrime and online fraud.",
      purpose:
        "Report online scams, phishing, identity theft, and other cyber-related crimes.",
      services: [
        "Report online fraud and scams",
        "Investigate cybercrime cases",
        "File criminal complaints",
        "Track down scammers",
        "Provide evidence gathering assistance",
      ],
      email: "info@pnp-acg.org",
      hotline: "(02) 8723-0401 local 7491",
      website: "https://didm.pnp.gov.ph/Contact%20Us",
    },
    {
      id: "dti",
      name: "Department of Trade and Industry (DTI)",
      imageUrl: "/assets/images/DTI_Logo.webp",
      description:
        "Protects consumer rights and handles complaints against fraudulent business practices.",
      purpose:
        "Report fake online sellers, false advertising, and unfair trade practices on social media.",
      services: [
        "File consumer complaints",
        "Mediate disputes with sellers",
        "Report fake products or services",
        "Get assistance with refunds",
        "Report deceptive advertising",
      ],
      email: "fteb@dti.gov.ph",
      hotline: "1-DTI (1-384)",
      website: "https://www.dti.gov.ph",
    },
    {
      id: "bsp",
      name: "Bangko Sentral ng Pilipinas (BSP)",
      imageUrl: "/assets/images/BSP_Logo.webp",
      description:
        "Regulates financial institutions and protects consumers from fraudulent financial services.",
      purpose:
        "Report financial scams, fake investment schemes, and unauthorized lending apps.",
      services: [
        "Report illegal lending apps",
        "File complaints against financial fraud",
        "Report Ponzi/pyramid schemes",
        "Investigate fake investment opportunities",
        "Protect against unauthorized financial services",
      ],
      email: "consumeraffairs@bsp.gov.ph",
      hotline: "(02) 8708-7087",
      website: "https://www.bsp.gov.ph",
    },
    {
      id: "sec",
      name: "Securities and Exchange Commission (SEC)",
      imageUrl: "/assets/images/SEC_Logo.png",
      description:
        "Regulates investment schemes and protects investors from fraudulent securities.",
      purpose:
        "Report investment scams, pyramid schemes, and fake cryptocurrency schemes advertised online.",
      services: [
        "Report investment scams",
        "Verify legitimate investments",
        "File complaints against fraudulent companies",
        "Investigate pyramid/Ponzi schemes",
        "Shut down illegal investment operations",
      ],
      email: "feedback@sec.gov.ph",
      hotline: "(02) 8818-0921",
      website: "https://www.sec.gov.ph",
    },
    {
      id: "nbi-cybercrime",
      name: "NBI Cybercrime Division",
      imageUrl: "/assets/images/NBI_Logo.webp",
      description:
        "National Bureau of Investigation's specialized unit for investigating cybercrimes.",
      purpose:
        "Report serious cybercrimes, online fraud rings, and complex scam operations.",
      services: [
        "Investigate complex cybercrime cases",
        "Track cybercrime syndicates",
        "Conduct digital forensics",
        "File criminal charges",
        "Coordinate with international authorities",
      ],
      email: "cybercrime@nbi.gov.ph",
      hotline: "(02) 8525-4093",
      website: "https://nbi.gov.ph",
    },
  ];

  const handleCardClick = (org: Organization) => {
    setSelectedOrg(org);
  };

  const closeModal = () => {
    setSelectedOrg(null);
  };

  return (
    <div className="module-container">
      <div className="module-quiz-box">
        <div className={styles.supportHeader}>
          <h1>Get Help & Report Scams</h1>
          <p>
            If you&apos;ve been a victim of social media scams or fake
            advertisements, these organizations can help. Click on any card to
            see their contact information and services.
          </p>
        </div>

        <div className={styles.supportGrid}>
          {supportOrganizations.map((org) => (
            <Card
              key={org.id}
              title={org.name}
              description={org.description}
              onClick={() => handleCardClick(org)}
              className={styles.supportCard}
            >
              <div className={styles.cardContent}>
                <SafeImage
                  src={org.imageUrl}
                  alt={org.name}
                  className={styles.orgLogo}
                  fallbackIcon={BuildingOfficeIcon}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Modal for organization details */}
        {selectedOrg && (
          <div className={styles.modalBackdrop} onClick={closeModal}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeButton} onClick={closeModal}>
                ✕
              </button>

              <div className={styles.modalHeader}>
                <SafeImage
                  src={selectedOrg.imageUrl}
                  alt={selectedOrg.name}
                  className={styles.modalLogo}
                  fallbackIcon={BuildingOfficeIcon}
                />
                <h2>{selectedOrg.name}</h2>
              </div>

              <div className={styles.modalBody}>
                <section className={styles.modalSection}>
                  <h3>What they do</h3>
                  <p>{selectedOrg.purpose}</p>
                </section>

                <section className={styles.modalSection}>
                  <h3>How to contact</h3>
                  <div className={styles.contactInfo}>
                    {selectedOrg.hotline && (
                      <div className={styles.contactItem}>
                        <span className={styles.contactLabel}>Phone</span>
                        <a
                          href={`tel:${selectedOrg.hotline.replace(/[^0-9+]/g, "")}`}
                        >
                          {selectedOrg.hotline}
                        </a>
                      </div>
                    )}
                    {selectedOrg.email && (
                      <div className={styles.contactItem}>
                        <span className={styles.contactLabel}>Email</span>
                        <a href={`mailto:${selectedOrg.email}`}>
                          {selectedOrg.email}
                        </a>
                      </div>
                    )}
                    {selectedOrg.website && (
                      <div className={styles.contactItem}>
                        <span className={styles.contactLabel}>Website</span>
                        <a
                          href={selectedOrg.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {selectedOrg.website}
                        </a>
                      </div>
                    )}
                  </div>
                </section>

                <section className={styles.modalSection}>
                  <h3>They can help with</h3>
                  <ul className={styles.servicesList}>
                    {selectedOrg.services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </section>

                <div className={styles.helpText}>
                  <strong>Note:</strong> Have your evidence ready when you
                  contact them - screenshots, messages, receipts, etc.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
