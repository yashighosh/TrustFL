"use client";

import { useToast } from "@/app/context/ToastContext";

export default function Toast() {
  const { toast } = useToast();

  return (
    <div className={`toast-container ${toast.visible ? "show" : ""}`}>
      <div className="font-mono text-xs font-bold mb-1" style={{ color: toast.color }}>
        {toast.title}
      </div>
      <div className="font-mono text-xs text-text-primary">{toast.msg}</div>
    </div>
  );
}
