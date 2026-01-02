"use client";

import { useState, useCallback } from "react";

type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "streak";
  icon?: string;
};

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info", icon?: string) => {
      const id = toastId++;
      setToasts((prev) => [...prev, { id, message, type, icon }]);
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
  };
}
