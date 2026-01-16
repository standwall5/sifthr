"use client";

import { useState } from "react";
import {
  BoltIcon,
  ArchiveBoxIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import CameraFeed from "./CameraFeed";
import PhoneAdDetector from "./PhoneAdDetector";

export default function DetectorComparison() {
  const [activeDetector, setActiveDetector] = useState<"new" | "old">("new");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Toggle Switch */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Detection Mode
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Switch between detection systems
              </p>
            </div>

            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setActiveDetector("new")}
                className={`px-6 py-2 rounded-md font-semibold transition-all ${
                  activeDetector === "new"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                🚀 Advanced (MediaPipe)
              </button>
              <button
                onClick={() => setActiveDetector("old")}
                className={`px-6 py-2 rounded-md font-semibold transition-all ${
                  activeDetector === "old"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                📦 Basic (COCO-SSD)
              </button>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
            <div
              className={`p-3 rounded-lg border-2 ${
                activeDetector === "new"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              }`}
            >
              <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-2 flex items-center">
                <BoltIcon className="w-5 h-5 inline-block mr-2" />
                Advanced Mode Features:
              </h3>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  Phone detection with MediaPipe
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  Social media app identification
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  Fake ad detection with accuracy scores
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  Real-time screen content analysis
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  60+ FPS performance
                </li>
              </ul>
            </div>

            <div
              className={`p-3 rounded-lg border-2 ${
                activeDetector === "old"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              }`}
            >
              <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                <ArchiveBoxIcon className="w-5 h-5 inline-block mr-2" />
                Basic Mode Features:
              </h3>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  General object detection
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  Multiple object types
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  Confidence scores
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  Simple bounding boxes
                </li>
                <li className="flex items-start">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  20-30 FPS performance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Active Detector Component */}
      {activeDetector === "new" ? <PhoneAdDetector /> : <CameraFeed />}
    </div>
  );
}
