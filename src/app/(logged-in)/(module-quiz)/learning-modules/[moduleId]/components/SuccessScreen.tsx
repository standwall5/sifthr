import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type SuccessScreenProps = {
  show: boolean;
};

export default function SuccessScreen({ show }: SuccessScreenProps) {
  if (!show) return null;

  return (
    <div
      className="successPlayer"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Add your Lottie player here */}
      <DotLottieReact src="/assets/images/animations/success.lottie" autoplay />
    </div>
  );
}
