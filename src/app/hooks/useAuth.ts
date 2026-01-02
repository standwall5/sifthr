import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { signInUser, signUpUser } from "@/app/lib/authActions";

type FormType = "login" | "signup" | null;

export function useAuth() {
  const router = useRouter();

  // Form state
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [match, setMatch] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormType>(null);

  // Password visibility state
  const [showPwdLogin, setShowPwdLogin] = useState<boolean>(false);
  const [showPwdSignup, setShowPwdSignup] = useState<boolean>(false);

  // Check if user is already logged in
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

  // Check if passwords match
  useEffect(() => {
    setMatch(password.length > 0 && password === repeatPassword);
  }, [password, repeatPassword]);

  // Handle login
  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const pwd = String(formData.get("password") ?? "");

    if (!email || !pwd) {
      setErrorMsg("Email and password are required.");
      return;
    }

    const result = await signInUser(email, pwd);
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || "Login failed. Please try again.");
      return;
    }

    closeModal();
    router.push("/home");
  }

  // Handle signup
  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
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

    const result = await signUpUser(email, pwd, name, age);
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || "Registration failed. Please try again.");
      return;
    }

    closeModal();
    router.push("/home");
  }

  // Modal controls
  function openLogin() {
    setFormType("login");
    setModalOpen(true);
    setShowPwdLogin(false);
    setErrorMsg(null);
  }

  function openSignup() {
    setFormType("signup");
    setModalOpen(true);
    setShowPwdSignup(false);
    setErrorMsg(null);
  }

  function closeModal() {
    setModalOpen(false);
    setFormType(null);
    setShowPwdLogin(false);
    setShowPwdSignup(false);
    setErrorMsg(null);
    setPassword("");
    setRepeatPassword("");
  }

  // Password visibility toggles
  function toggleShowPwdLogin() {
    setShowPwdLogin((prev) => !prev);
  }

  function toggleShowPwdSignup() {
    setShowPwdSignup((prev) => !prev);
  }

  return {
    // State
    password,
    repeatPassword,
    match,
    errorMsg,
    modalOpen,
    formType,
    showPwdLogin,
    showPwdSignup,
    loading,

    // State setters
    setPassword,
    setRepeatPassword,

    // Handlers
    handleLogin,
    handleRegister,
    openLogin,
    openSignup,
    closeModal,
    toggleShowPwdLogin,
    toggleShowPwdSignup,
  };
}
