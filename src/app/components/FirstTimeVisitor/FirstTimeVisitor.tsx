"use client";

import React, { useEffect, useState } from "react";
import {
  shouldShowNextStep,
  markFirstVisitShown,
  hasAcceptedCookies,
} from "@/app/lib/cookieUtils";
import { useNextStep } from "nextstepjs";

interface FirstTimeVisitorProps {
  children?: React.ReactNode;
}

const FirstTimeVisitor: React.FC<FirstTimeVisitorProps> = ({ children }) => {
  const [shouldShowTour, setShouldShowTour] = useState(false);
  const { startNextStep } = useNextStep();

  useEffect(() => {
    // Wait a bit to ensure cookies are loaded
    const checkTimer = setTimeout(() => {
      // Only show if cookies are accepted and it's first visit
      if (hasAcceptedCookies() && shouldShowNextStep()) {
        setShouldShowTour(true);
      }
    }, 500);

    return () => clearTimeout(checkTimer);
  }, []);

  useEffect(() => {
    if (!shouldShowTour) return;

    // Start the tour after a short delay
    const tourTimer = setTimeout(() => {
      try {
        startNextStep("firstVisitTour");
        markFirstVisitShown();
      } catch (error) {
        console.error("Error starting NextStep tour:", error);
        markFirstVisitShown(); // Mark as shown to avoid errors
      }
    }, 1000);

    return () => clearTimeout(tourTimer);
  }, [shouldShowTour, startNextStep]);

  return <>{children}</>;
};

export default FirstTimeVisitor;
