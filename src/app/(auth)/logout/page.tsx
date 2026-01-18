"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => router.push("/"), 2000);
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        minWidth: "320px",
        gap: "2rem",
        fontSize: "1.5rem",
        fontWeight: "bold",
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          padding: "3rem",
          backgroundColor: "var(--card-bg)",
          borderRadius: "1rem",
          boxShadow: "0 0.5rem 0 var(--purple)",
        }}
      >
        <div>You have logged out...</div>
        <div style={{ fontSize: "1rem", opacity: 0.7, marginTop: "1rem" }}>
          redirecting in a sec.
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
