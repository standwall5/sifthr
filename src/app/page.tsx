"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./index.css";
import Modal from "./components/Modal";
import LoginForm from "./(auth)/login/components/LoginForm";
import SignupForm from "./(auth)/signup/components/SignupForm";
import { useAuth } from "./hooks/useAuth";
import { useNextStep } from "nextstepjs";

export default function Home() {
  const router = useRouter();
  const { startNextStep } = useNextStep();
  const {
    password,
    repeatPassword,
    match,
    errorMsg,
    modalOpen,
    formType,
    showPwdLogin,
    showPwdSignup,
    setPassword,
    setRepeatPassword,
    handleLogin,
    handleRegister,
    openLogin,
    openSignup,
    closeModal,
    toggleShowPwdLogin,
    toggleShowPwdSignup,
    loading,
  } = useAuth();

  return (
    <div className="content">
      <div className="box">
        <div className="cardContainer">
          <h1>Identifying scams in social media - one at a time.</h1>

          <div className="card">
            <Image
              src="/assets/images/landing-page/using-laptop.webp"
              alt="Be prepared"
              width={800}
              height={800}
              id="imageLogin"
            />
            <div className="cardContent">
              <h2>Be prepared - be ready</h2>
              <p>
                In this website, awareness about social media scams is spread.
                We educate users on recognizing fraud and empowering them to
                avoid scams, creating a safer space for everyone, especially the
                elderly.
              </p>
            </div>
          </div>
        </div>

        <div className="login-box">
          <button onClick={openLogin}>Login</button>
          <button onClick={openSignup}>Sign-up</button>
          <button onClick={() => router.push("/latest-news")}>
            Browse as Guest
          </button>
          {/*<button
            onClick={() => startNextStep("firstVisitTour")}
            style={{
              background: "var(--lime)",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            🎯 Start Tour (Test)
          </button>*/}
        </div>

        <Modal open={modalOpen} onClose={closeModal}>
          {formType === "login" && (
            <LoginForm
              handleLogin={handleLogin}
              closeModal={closeModal}
              showPwdLogin={showPwdLogin}
              errorMsg={errorMsg}
              toggleShowPwdLogin={toggleShowPwdLogin}
              loading={loading}
            />
          )}
          {formType === "signup" && (
            <SignupForm
              handleRegister={handleRegister}
              closeModal={closeModal}
              showPwdSignup={showPwdSignup}
              errorMsg={errorMsg}
              toggleShowPwdSignup={toggleShowPwdSignup}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onRepeatPasswordChange={(e) => setRepeatPassword(e.target.value)}
              match={match}
              loading={loading}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
