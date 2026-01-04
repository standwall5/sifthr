"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function SignupConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "your email";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          textAlign: "center",
          padding: "2rem",
          backgroundColor: "var(--card-bg, white)",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "1rem" }}>📧</div>

        <h1 style={{ marginBottom: "1rem" }}>Check Your Email</h1>

        <p style={{ marginBottom: "1rem", fontSize: "1rem" }}>
          We&apos;ve sent a confirmation email to:
        </p>

        <p
          style={{
            fontWeight: "bold",
            marginBottom: "2rem",
            fontSize: "1.1rem",
          }}
        >
          {email}
        </p>

        <p
          style={{ marginBottom: "1rem", color: "var(--text-secondary, #666)" }}
        >
          Please check your inbox and click the confirmation link to activate
          your account.
        </p>

        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary, #666)",
            marginBottom: "2rem",
          }}
        >
          Don&apos;t see the email? Check your spam folder or wait a few
          minutes.
        </p>

        <button
          onClick={() => router.push("/")}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: "var(--primary-color, #007bff)",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default function SignupConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupConfirmationContent />
    </Suspense>
  );
}
