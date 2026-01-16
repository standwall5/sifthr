/**
 * Tour Trigger Component - Automatically starts tours for first-time visitors
 */

"use client";

import { useEffect } from "react";
import { hasSeenTour, markTourAsSeen, startTour } from "@/app/lib/tours";

interface TourTriggerProps {
  tourName: string;
  delay?: number; // Delay in ms before starting tour
  condition?: boolean; // Additional condition to check before starting
}

export default function TourTrigger({
  tourName,
  delay = 1000,
  condition = true,
}: TourTriggerProps) {
  useEffect(() => {
    if (!condition) return;

    const timer = setTimeout(() => {
      if (!hasSeenTour(tourName)) {
        startTour(tourName);
        markTourAsSeen(tourName);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [tourName, delay, condition]);

  return null; // This component doesn't render anything
}
