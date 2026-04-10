"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

interface ToastState {
  title: string;
  msg: string;
  color: string;
  visible: boolean;
}

interface ToastContextValue {
  showToast: (title: string, msg: string, color?: string) => void;
  toast: ToastState;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    title: "",
    msg: "",
    color: "var(--color-neon-green)",
    visible: false,
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback(
    (title: string, msg: string, color = "var(--color-neon-green)") => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setToast({ title, msg, color, visible: true });
      timeoutRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3500);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
}
