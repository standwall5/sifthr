type EmailConfirmationProps = {
  email: string;
  closeModal: () => void;
};

export default function EmailConfirmation({
  email,
  closeModal,
}: EmailConfirmationProps) {
  return (
    <div id="emailConfirmation" style={{ zIndex: 1000, padding: "2rem" }}>
      <h1>Check Your Email</h1>
      <p id="closeSignup" onClick={closeModal}>
        X
      </p>

      <div style={{ textAlign: "center", margin: "2rem 0" }}>
        <div style={{ fontSize: "48px", marginBottom: "1rem" }}>📧</div>

        <p style={{ marginBottom: "1rem" }}>
          We&apos;ve sent a confirmation email to:
        </p>

        <p style={{ fontWeight: "bold", marginBottom: "2rem" }}>{email}</p>

        <p style={{ marginBottom: "1rem" }}>
          Please check your inbox and click the confirmation link to activate
          your account.
        </p>

        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "2rem" }}>
          Don&apos;t see the email? Check your spam folder or wait a few
          minutes.
        </p>

        <button
          onClick={closeModal}
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
          Got it
        </button>
      </div>
    </div>
  );
}
