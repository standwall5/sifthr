import React from "react";
import PhoneAdDetector from "../components/PhoneAdDetector";

export default function CameraPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <PhoneAdDetector />
    </div>
  );
}
