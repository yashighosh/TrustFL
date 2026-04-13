"use client";

import { useRouter } from "next/navigation";
import { useHospital } from "@/app/context/HospitalContext";

interface NavbarProps {
  onLogoClick: () => void;
}

export default function Navbar({ onLogoClick }: NavbarProps) {
  const router = useRouter();
  const { hospital, logout } = useHospital();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-16 bg-white/80 backdrop-blur-xl border-b border-border-custom shadow-sm">
      <button
        onClick={onLogoClick}
        className="font-mono text-lg font-bold text-text-primary tracking-tight bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
      >
        Trust<span className="text-primary">FL</span>
      </button>



      <div className="flex items-center gap-4">
        {hospital && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-2 border border-border-custom">
            <span className="text-sm">🏥</span>
            <span className="font-mono text-[10px] text-text-primary font-semibold truncate max-w-[140px]">
              {hospital.name}
            </span>
            <span className="font-mono text-[9px] text-muted">{hospital.id}</span>
          </div>
        )}
        <div className="flex items-center gap-2 font-mono text-[11px] text-neon-green">
          <div className="pulse-dot" />
          <span>Online</span>
        </div>
        <button
          onClick={() => { logout(); router.push("/auth"); }}
          className="px-3.5 py-1.5 rounded-lg font-mono text-[10px] cursor-pointer bg-transparent text-muted border border-border-2 tracking-wider transition-all hover:bg-surface-2 hover:text-text-primary"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
