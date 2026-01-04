"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { isGuestMode as checkGuestMode } from "@/app/lib/guestService";

interface GuestModeContextType {
  isGuest: boolean;
  refreshGuestStatus: () => void;
}

const GuestModeContext = createContext<GuestModeContextType | undefined>(
  undefined,
);

export function GuestModeProvider({ children }: { children: React.ReactNode }) {
  const [isGuest, setIsGuest] = useState(false);

  const refreshGuestStatus = () => {
    const guestStatus = checkGuestMode();
    setIsGuest(guestStatus);
  };

  useEffect(() => {
    refreshGuestStatus();
  }, []);

  return (
    <GuestModeContext.Provider value={{ isGuest, refreshGuestStatus }}>
      {children}
    </GuestModeContext.Provider>
  );
}

export function useGuestMode() {
  const context = useContext(GuestModeContext);
  if (context === undefined) {
    throw new Error("useGuestMode must be used within a GuestModeProvider");
  }
  return context;
}
