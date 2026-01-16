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
        minWidth: "100vw",
        gap: "2rem",
        fontSize: "1.5rem",
        fontWeight: "bold",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div>You have logged out...</div>
      <div style={{ fontSize: "1rem", opacity: 0.7 }}>
        redirecting in a sec.
      </div>
    </div>
  );
};

export default LogoutPage;
