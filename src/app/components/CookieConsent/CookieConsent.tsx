"use client";

import React, { useState, useEffect } from "react";
import styles from "./CookieConsent.module.css";
import {
  hasAcceptedCookies,
  saveCookieConsent,
  markAsVisited,
} from "@/app/lib/cookieUtils";

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({
  onAccept,
  onDecline,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Only show if user hasn't accepted cookies yet
    if (!hasAcceptedCookies()) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    saveCookieConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    markAsVisited();
    setIsVisible(false);
    onAccept?.();
  };

  const handleAcceptNecessary = () => {
    saveCookieConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    markAsVisited();
    setIsVisible(false);
    onDecline?.();
  };

  const handleSavePreferences = () => {
    saveCookieConsent(preferences);
    markAsVisited();
    setIsVisible(false);
    onAccept?.();
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.banner}>
        <div className={styles.content}>
          <h2 className={styles.title}>🍪 Cookie Notice</h2>

          {!showDetails ? (
            <>
              <p className={styles.description}>
                We use cookies to enhance your browsing experience and analyze
                our traffic. By clicking &quot;Accept All&quot;, you consent to
                our use of cookies.
              </p>

              <div className={styles.buttonGroup}>
                <button
                  onClick={handleAcceptAll}
                  className={`${styles.button} ${styles.primaryButton}`}
                >
                  Accept All
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  className={`${styles.button} ${styles.secondaryButton}`}
                >
                  Necessary Only
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className={`${styles.button} ${styles.linkButton}`}
                >
                  Customize
                </button>
              </div>

              <p className={styles.policyLink}>
                Read our{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="/cookie-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cookie Policy
                </a>
              </p>
            </>
          ) : (
            <>
              <p className={styles.description}>
                Customize your cookie preferences below:
              </p>

              <div className={styles.preferences}>
                <label className={styles.preferenceItem}>
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                  />
                  <div className={styles.preferenceInfo}>
                    <strong>Necessary Cookies</strong>
                    <span>Required for the website to function properly</span>
                  </div>
                </label>

                <label className={styles.preferenceItem}>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        analytics: e.target.checked,
                      })
                    }
                  />
                  <div className={styles.preferenceInfo}>
                    <strong>Analytics Cookies</strong>
                    <span>
                      Help us understand how visitors interact with our website
                    </span>
                  </div>
                </label>

                <label className={styles.preferenceItem}>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        marketing: e.target.checked,
                      })
                    }
                  />
                  <div className={styles.preferenceInfo}>
                    <strong>Marketing Cookies</strong>
                    <span>Used to deliver personalized advertisements</span>
                  </div>
                </label>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  onClick={handleSavePreferences}
                  className={`${styles.button} ${styles.primaryButton}`}
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className={`${styles.button} ${styles.secondaryButton}`}
                >
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
