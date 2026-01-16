import React from "react";
import PhoneAdDetector from "../components/PhoneAdDetector";

export default function CameraPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <PhoneAdDetector />
    </div>
  );
}
