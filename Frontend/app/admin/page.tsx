"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastProvider } from "@/app/context/ToastContext";
import { useHospital } from "@/app/context/HospitalContext";
import Toast from "@/app/components/ui/Toast";
import NetworkOverview from "@/app/components/admin/NetworkOverview";
import BlockchainPage from "@/app/components/blockchain/BlockchainPage";
import FLPage from "@/app/components/fl/FLPage";
import Footer from "@/app/components/layout/Footer";

export default function AdminPage() {
  const router = useRouter();
  const { logout } = useHospital();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "01 / Network", icon: "🌐" },
    { label: "02 / Blockchain", icon: "🔗" },
    { label: "03 / Federated Learning", icon: "🧠" },
  ];

  return (
    <ToastProvider>
      <Toast />
      {/* Super Admin Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-16 bg-white/80 backdrop-blur-xl border-b border-border-custom shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="font-mono text-lg font-bold text-text-primary tracking-tight bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
          >
            Trust<span className="text-primary">FL</span>
          </button>
          <span className="px-2.5 py-0.5 rounded-md bg-amber-light text-amber font-mono text-[10px] font-bold border border-amber/20">
            SUPER ADMIN
          </span>
        </div>

        <div className="flex gap-1 bg-surface-2 border border-border-custom rounded-xl p-1">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-1.5 px-5 py-1.5 rounded-lg font-mono text-xs cursor-pointer border transition-all duration-200 tracking-wide ${
                activeTab === i
                  ? "bg-primary-light text-primary border-primary/20 font-semibold"
                  : "bg-transparent text-muted border-transparent hover:text-text-primary hover:bg-surface-3"
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-[11px] text-neon-green">
            <div className="pulse-dot" />
            <span>3 nodes online</span>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/auth");
            }}
            className="px-3.5 py-1.5 rounded-lg font-mono text-[10px] cursor-pointer bg-transparent text-muted border border-border-2 tracking-wider transition-all hover:bg-surface-2 hover:text-text-primary"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="min-h-screen pt-16 relative z-[1]">
        {activeTab === 0 && <NetworkOverview />}
        {activeTab === 1 && <BlockchainPage />}
        {activeTab === 2 && <FLPage />}
      </div>

      <Footer />
    </ToastProvider>
  );
}
