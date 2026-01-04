"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MediumCard from "@/app/components/MediumCard";
import Modal from "@/app/components/Modal";
import SignupForm from "@/app/(auth)/signup/components/SignupForm";
import LoginForm from "@/app/(auth)/login/components/LoginForm";
import styles from "@/app/(logged-in)/profile/components/Profile.module.css";
import {
  isGuestMode,
  getGuestProfile,
  getGuestStats,
  getGuestModuleProgress,
  getGuestQuizSubmissions,
  clearGuestData,
  deactivateGuestMode,
  type GuestProfile,
} from "@/app/lib/guestService";

type GuestStats = {
  modulesStarted: number;
  modulesCompleted: number;
  quizzesTaken: number;
  totalScore: number;
  averageScore: number;
};

type ModalType = "signup" | "login" | null;

export default function GuestProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [stats, setStats] = useState<GuestStats | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [match, setMatch] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPwdSignup, setShowPwdSignup] = useState(false);
  const [showPwdLogin, setShowPwdLogin] = useState(false);

  useEffect(() => {
    // Check if guest mode is active
    if (!isGuestMode()) {
      router.push("/");
      return;
    }

    // Load guest data
    const guestProfile = getGuestProfile();
    const guestStats = getGuestStats();

    setProfile(guestProfile);
    setStats(guestStats);
  }, [router]);

  // Check if passwords match
  useEffect(() => {
    setMatch(password.length > 0 && password === repeatPassword);
  }, [password, repeatPassword]);

  const openSignupModal = () => {
    setModalType("signup");
    setErrorMsg(null);
  };

  const openLoginModal = () => {
    setModalType("login");
    setErrorMsg(null);
  };

  const closeModal = () => {
    setModalType(null);
    setPassword("");
    setRepeatPassword("");
    setErrorMsg(null);
    setShowPwdSignup(false);
    setShowPwdLogin(false);
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const pwd = String(formData.get("password") ?? "");
    const rpt = String(formData.get("repeatPassword") ?? "");

    if (pwd !== rpt) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    // After successful signup, deactivate guest mode
    // The signup action will handle the redirect
    deactivateGuestMode();

    // Let the form submit naturally via formAction
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Deactivate guest mode when logging in
    deactivateGuestMode();

    // Let the form submit naturally via formAction
  };

  const handleClearData = () => {
    if (
      confirm(
        "Are you sure you want to clear all your guest data? This cannot be undone.",
      )
    ) {
      clearGuestData();
      router.push("/");
    }
  };

  if (!profile || !stats) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>Loading guest profile...</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.profileWrapper}>
        <MediumCard>
          <div className={styles.profileContainer}>
            <div className={styles.avatarContainer}>
              <Image
                src="/assets/images/userIcon.png"
                alt="Guest User"
                width={150}
                height={150}
                className={styles.avatar}
              />
              <div style={{ marginTop: "1rem" }}>
                <span
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "var(--purple)",
                    color: "white",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                  }}
                >
                  🎭 Guest Mode
                </span>
              </div>
            </div>
            <div className={styles.info}>
              <h1>{profile.name}</h1>
              <p
                style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}
              >
                Browsing as guest since{" "}
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </MediumCard>

        <MediumCard>
          <div className={styles.summaryContainer}>
            <span className={styles.modulePercent}>
              <span className={styles.percent}>{stats.modulesStarted}</span>
              <span className={styles.percentText}> Modules Started</span>
            </span>
            <span className={styles.modulePercent}>
              <span className={styles.percent}>{stats.quizzesTaken}</span>
              <span className={styles.percentText}> Quizzes Taken</span>
            </span>
            <span className={styles.modulePercent}>
              <span className={styles.percent}>
                {stats.averageScore > 0 ? `${stats.averageScore}%` : "N/A"}
              </span>
              <span className={styles.percentText}> Average Quiz Score</span>
            </span>
          </div>
        </MediumCard>

        <MediumCard>
          <div style={{ padding: "1rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>💡 Guest Mode Notice</h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
              You&apos;re currently browsing as a guest. Your progress is saved
              locally on this device only. Create an account or log in to:
            </p>
            <ul style={{ marginLeft: "1.5rem", marginBottom: "1.5rem" }}>
              <li>Access your progress from any device</li>
              <li>Earn badges and track achievements</li>
              <li>Get personalized recommendations</li>
              <li>Never lose your progress</li>
            </ul>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                onClick={openSignupModal}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "var(--lime)",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Create Account
              </button>
              <button
                onClick={openLoginModal}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "var(--blue)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Login
              </button>
              <button
                onClick={handleClearData}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "var(--red)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Clear Guest Data
              </button>
            </div>
          </div>
        </MediumCard>

        <MediumCard>
          <div className={styles.moduleQuizHistoryContainer}>
            <div className={styles.moduleQuizHistory}>
              <h2>Progress History</h2>
              <p
                style={{ marginBottom: "1rem", color: "var(--text-secondary)" }}
              >
                {getGuestModuleProgress().length} section(s) completed
              </p>
              {getGuestModuleProgress().length > 0 ? (
                <div
                  style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}
                >
                  <p>
                    Last activity:{" "}
                    {new Date(
                      getGuestModuleProgress()[
                        getGuestModuleProgress().length - 1
                      ].completedAt,
                    ).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p>No progress yet. Start a module to track your learning!</p>
              )}
            </div>
          </div>
        </MediumCard>

        <MediumCard>
          <div className={styles.moduleQuizHistoryContainer}>
            <div className={styles.moduleQuizHistory}>
              <h2>Quiz History</h2>
              {getGuestQuizSubmissions().length > 0 ? (
                <ul>
                  {getGuestQuizSubmissions().map((submission) => (
                    <li key={submission.id} style={{ marginBottom: "0.5rem" }}>
                      <span>Quiz #{submission.quizId}</span> -{" "}
                      <strong>{submission.score}%</strong>{" "}
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        (Attempt {submission.attempt})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  No quizzes taken yet. Start learning to test your knowledge!
                </p>
              )}
            </div>
          </div>
        </MediumCard>
      </div>

      {/* Signup Modal */}
      <Modal open={modalType === "signup"} onClose={closeModal}>
        <SignupForm
          handleRegister={handleSignupSubmit}
          closeModal={closeModal}
          showPwdSignup={showPwdSignup}
          errorMsg={errorMsg}
          toggleShowPwdSignup={() => setShowPwdSignup((prev) => !prev)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onRepeatPasswordChange={(e) => setRepeatPassword(e.target.value)}
          match={match}
          loading={loading}
        />
      </Modal>

      {/* Login Modal */}
      <Modal open={modalType === "login"} onClose={closeModal}>
        <LoginForm
          handleLogin={handleLoginSubmit}
          closeModal={closeModal}
          showPwdLogin={showPwdLogin}
          errorMsg={errorMsg}
          toggleShowPwdLogin={() => setShowPwdLogin((prev) => !prev)}
          loading={loading}
        />
      </Modal>
    </>
  );
}
