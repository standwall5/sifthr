import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type SuccessScreenProps = {
  show: boolean;
  hasQuiz?: boolean;
};

export default function SuccessScreen({
  show,
  hasQuiz = false,
}: SuccessScreenProps) {
  if (!show) return null;

  return (
    <div
      className="successPlayer"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <DotLottieReact src="/assets/images/animations/success.lottie" autoplay />
      {hasQuiz && (
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "var(--lime)", marginBottom: "0.5rem" }}>
            Great job! 🎉
          </h2>
          <p style={{ fontSize: "1.2rem" }}>Get ready for the quiz...</p>
        </div>
      )}
    </div>
  );
}
