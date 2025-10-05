"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./index.css";
import Modal from "./components/Modal";
import { signUp, signIn } from "@/app/lib/actions/auth-actions";

// TODO: receive error

export default function Home() {
  const router = useRouter();
  const [repeatPassword, setRepeatPassword] = useState("");
  const [password, setPassword] = useState("");
  const [match, setMatch] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    setMatch(password === repeatPassword);
  }, [password, repeatPassword]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn(email, password);
      if (result?.user) {
        console.log("Login successful!");
        router.push("/home");
      } else {
        setErrorMsg("Login failed. Please try again.");
      }
      // User is now registered and logged in automatically
    } catch (error) {
      setErrorMsg("Error occurred. Please try again.");
    }

    // const response = await fetch("/api/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });

    // if (response.ok) {
    //   router.push("/home");
    // } else {
    //   const data = await response.json();
    //   setErrorMsg(data.error || "Login failed");
    // }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const ageStr = formData.get("age") as string;
    const age = Number(ageStr);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeatPassword") as string;

    try {
      const result = await signUp(name, email, password, Number(age));
      if (result?.user) {
        console.log("Registration successful!");
        router.push("/home");
      } else {
        setErrorMsg("Registration failed. Please try again.");
      }
      // User is now registered and logged in automatically
    } catch (error) {
      setErrorMsg("Error occurred. Please try again.");
    }

    // const response = await fetch("/api/auth/register", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, age, email, password, repeatPassword }),
    // });

    // if (response.ok) {
    //   router.push("/home");
    // } else {
    //   const data = await response.json();
    //   setErrorMsg(data.error || "Login failed");
    // }
  }
  const [modalOpen, setModalOpen] = useState(false);
  const [formType, setFormType] = useState<"login" | "signup" | null>(null);
  const [showPwdLogin, setShowPwdLogin] = useState(false);
  const [showPwdSignup, setShowPwdSignup] = useState(false);

  const openLogin = () => {
    setFormType("login");
    setModalOpen(true);
    setShowPwdLogin(false);
  };

  const openSignup = () => {
    setFormType("signup");
    setModalOpen(true);
    setShowPwdSignup(false);
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
          <button>Browse as Guest</button>
        </div>

        <Modal open={modalOpen} onClose={closeModal}>
          {formType === "login" && (
            <form id="loginForm" onSubmit={handleLogin}>
              <h1>Login</h1>
              <p id="closeLogin" onClick={closeModal}>
                X
              </p>
              <label htmlFor="email">
                E-mail
                <input type="email" name="email" id="email" required />
              </label>
              <label htmlFor="passwordInput" id="password">
                Password
                <input
                  type={showPwdLogin ? "text" : "password"}
                  className="passwordInput"
                  name="password"
                  id="passwordInput"
                  required
                />
                <img
                  className="showPassword"
                  src="../assets/images/eye.png"
                  alt="Show password"
                  onClick={() => setShowPwdLogin((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                />
              </label>
              {errorMsg && (
                <div className="error" style={{ color: "red" }}>
                  {errorMsg}
                </div>
              )}
              <button type="submit" className="custom-button">
                Login
              </button>
            </form>
          )}
          {formType === "signup" && (
            <form id="signupForm" onSubmit={handleRegister}>
              <h1>Sign-up</h1>
              <p id="closeSignup" onClick={closeModal}>
                X
              </p>
              <label htmlFor="name">
                Full Name (i.e. Juan E. Dela Cruz)
                <input type="text" name="name" required />
              </label>
              <label htmlFor="age">
                Age
                <input type="text" name="age" required />
              </label>
              <label htmlFor="email">
                E-mail
                <input type="email" name="email" required />
              </label>
              <label htmlFor="password" id="password">
                Password
                <input
                  type={showPwdSignup ? "text" : "password"}
                  className="passwordInput"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <img
                  className="showPassword"
                  src="../assets/images/eye.png"
                  alt="Show Password"
                  onClick={() => setShowPwdSignup((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                />
              </label>
              <label htmlFor="repeatPassword" id="password">
                Password
                <input
                  type={showPwdSignup ? "text" : "password"}
                  className="passwordInput"
                  name="repeatPassword"
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                />
                <img
                  className="showPassword"
                  src="../assets/images/eye.png"
                  alt="Show Password"
                  onClick={() => setShowPwdSignup((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                />
              </label>
              {!match && (
                <div style={{ color: "red" }}>Passwords do not match</div>
              )}
              {errorMsg && (
                <div className="error" style={{ color: "red" }}>
                  {errorMsg}
                </div>
              )}
              <button type="submit" className="custom-button" disabled={!match}>
                Sign-up
              </button>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
}
