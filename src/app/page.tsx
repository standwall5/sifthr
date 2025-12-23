"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./index.css";
import Modal from "./components/Modal";
import LoginForm from "./(auth)/login/components/LoginForm";
import SignupForm from "./(auth)/signup/components/SignupForm";
import { supabase } from "@/app/lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [match, setMatch] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [formType, setFormType] = useState<"login" | "signup" | null>(null);
  const [showPwdLogin, setShowPwdLogin] = useState<boolean>(false);
  const [showPwdSignup, setShowPwdSignup] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled && data.session) {
        router.replace("/home");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    setMatch(password.length > 0 && password === repeatPassword);
  }, [password, repeatPassword]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const pwd = String(formData.get("password") ?? "");

    if (!email || !pwd) {
      setErrorMsg("Email and password are required.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pwd,
    });

    if (error) {
      setErrorMsg(error.message || "Login failed. Please try again.");
      return;
    }

    // No users upsert here. The trigger handled the row creation at signup.
    window.dispatchEvent(new Event("auth:changed"));
    router.push("/home");
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const ageStr = String(formData.get("age") ?? "");
    const email = String(formData.get("email") ?? "");
    const pwd = String(formData.get("password") ?? "");
    const rpt = String(formData.get("repeatPassword") ?? "");
    const age = Number.isNaN(Number(ageStr)) ? undefined : Number(ageStr);

    if (!name || !email || !pwd || !rpt || age === undefined) {
      setErrorMsg("All fields are required.");
      return;
    }
    if (pwd !== rpt) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pwd,
      options: {
        data: { name, age },
      },
    });

    if (error) {
      setErrorMsg(error.message || "Registration failed. Please try again.");
      return;
    }

    // No users upsert here. The DB trigger creates public.users row automatically.
    if (data.user) {
      window.dispatchEvent(new Event("auth:changed"));
      router.push("/home");
    } else {
      setErrorMsg("Please check your email to confirm your account.");
    }
  }

  const openLogin = () => {
    setFormType("login");
    setModalOpen(true);
    setShowPwdLogin(false);
    setErrorMsg(null);
  };

  const openSignup = () => {
    setFormType("signup");
    setModalOpen(true);
    setShowPwdSignup(false);
    setErrorMsg(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormType(null);
    setShowPwdLogin(false);
    setShowPwdSignup(false);
    setErrorMsg(null);
  };

  return (
    <div className="content">
      <div className="box">
        <div className="cardContainer">
          <h1>Identifying scams in social media - one at a time.</h1>

          <div className="card">
            <Image
              src="/assets/images/indexPhoto.webp"
              alt="Be prepared"
              width={500}
              height={500}
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
          <button onClick={() => router.push("/home")}>Browse as Guest</button>
        </div>

        <Modal open={modalOpen} onClose={closeModal}>
          {formType === "login" && (
            <LoginForm
              handleLogin={handleLogin}
              closeModal={closeModal}
              showPwdLogin={showPwdLogin}
              errorMsg={errorMsg}
              toggleShowPwdLogin={() => setShowPwdLogin((prev) => !prev)}
            />
          )}
          {formType === "signup" && (
            <SignupForm
              handleRegister={handleRegister}
              closeModal={closeModal}
              showPwdSignup={showPwdSignup}
              errorMsg={errorMsg}
              toggleShowPwdSignup={() => setShowPwdSignup((prev) => !prev)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onRepeatPasswordChange={(e) => setRepeatPassword(e.target.value)}
              match={match}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
