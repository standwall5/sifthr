"use client";

import React, { useState } from "react";
import Button from "@/app/components/Button/Button";
import Loading from "@/app/components/Loading";
import { supabase } from "@/app/lib/supabaseClient";
import styles from "./ChangePassword.module.css";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate new password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setMessage({ type: "error", text: passwordError });
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    // Check if new password is different from current
    if (newPassword === currentPassword) {
      setMessage({
        type: "error",
        text: "New password must be different from current password",
      });
      return;
    }

    setLoading(true);

    try {
      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setMessage({
        type: "success",
        text: "Password changed successfully!",
      });

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to change password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string): string => {
    if (password.length === 0) return "";
    if (password.length < 8) return "weak";

    let strength = 0;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return "weak";
    if (strength === 3) return "medium";
    return "strong";
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className={styles.changePasswordContainer}>
      <h2 className={styles.title}>Change Password</h2>
      <p className={styles.description}>
        Update your password to keep your account secure
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type={showPasswords ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
            required
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type={showPasswords ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            required
            disabled={loading}
          />
          {newPassword && (
            <div className={styles.passwordStrength}>
              <div className={styles.strengthBar}>
                <div
                  className={`${styles.strengthFill} ${styles[passwordStrength]}`}
                  style={{
                    width:
                      passwordStrength === "weak"
                        ? "33%"
                        : passwordStrength === "medium"
                        ? "66%"
                        : "100%",
                  }}
                />
              </div>
              <span className={styles.strengthLabel}>
                Strength:{" "}
                <strong className={styles[passwordStrength]}>
                  {passwordStrength.charAt(0).toUpperCase() +
                    passwordStrength.slice(1)}
                </strong>
              </span>
            </div>
          )}
          <small className={styles.hint}>
            Must be at least 8 characters with uppercase, lowercase, and numbers
          </small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type={showPasswords ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            required
            disabled={loading}
          />
        </div>

        <div className={styles.showPasswordToggle}>
          <label>
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
            />
            <span>Show passwords</span>
          </label>
        </div>

        {message && (
          <div
            className={`${styles.message} ${styles[message.type]}`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        <Button
          type="submit"
          loading={loading}
          loadingComponent={<Loading color="black" />}
          disabled={loading}
        >
          Change Password
        </Button>
      </form>
    </div>
  );
}
