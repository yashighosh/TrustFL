"use client";

interface NavbarProps {
  activeTab: number;
  onTabChange: (idx: number) => void;
  onLogoClick: () => void;
}

export default function Navbar({ activeTab, onTabChange, onLogoClick }: NavbarProps) {
  const tabs = ["01 / Database", "02 / Blockchain", "03 / Federated Learning"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-16 bg-white/80 backdrop-blur-xl border-b border-border-custom shadow-sm">
      <button
        onClick={onLogoClick}
        className="font-mono text-lg font-bold text-text-primary tracking-tight bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
      >
        Trust<span className="text-primary">FL</span>
      </button>

      <div className="flex gap-1 bg-surface-2 border border-border-custom rounded-xl p-1">
        {tabs.map((label, i) => (
          <button
            key={i}
            onClick={() => onTabChange(i)}
            className={`px-5 py-1.5 rounded-lg font-mono text-xs cursor-pointer border transition-all duration-200 tracking-wide ${
              activeTab === i
                ? "bg-primary-light text-primary border-primary/20 font-semibold"
                : "bg-transparent text-muted border-transparent hover:text-text-primary hover:bg-surface-3"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 font-mono text-[11px] text-neon-green">
        <div className="pulse-dot" />
        <span>3 nodes online</span>
      </div>
    </nav>
  );
}
