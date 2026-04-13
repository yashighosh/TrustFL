"use client";

import { useRouter } from "next/navigation";
import { ToastProvider } from "@/app/context/ToastContext";
import Toast from "@/app/components/ui/Toast";
import PatientPortal from "@/app/components/patient/PatientPortal";

export default function PatientPage() {
  const router = useRouter();

  return (
    <ToastProvider>
      <Toast />
      {/* Minimal nav for patient view */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-16 bg-white/80 backdrop-blur-xl border-b border-border-custom shadow-sm">
        <div className="font-mono text-lg font-bold text-text-primary tracking-tight">
          Trust<span className="text-primary">FL</span>
          <span className="ml-2 px-2 py-0.5 rounded-md bg-green-light text-neon-green font-mono text-[10px] border border-neon-green/20">
            Patient Portal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-[11px] text-neon-green">
            <div className="pulse-dot" />
            <span>Secure Connection</span>
          </div>
          <button
            onClick={() => router.push("/auth")}
            className="px-5 py-2 rounded-lg font-mono text-xs cursor-pointer bg-transparent text-muted border border-border-2 tracking-wider transition-all hover:bg-surface-2"
          >
            Sign Out
          </button>
        </div>
      </nav>
      <div className="min-h-screen pt-16 relative z-[1]">
        <PatientPortal onBack={() => router.push("/database")} />
      </div>
    </ToastProvider>
  );
}
