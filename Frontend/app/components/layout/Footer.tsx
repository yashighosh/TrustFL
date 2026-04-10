"use client";

export default function Footer() {
  return (
    <footer className="border-t border-border-custom bg-surface py-6 px-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="font-mono text-sm font-bold text-text-primary tracking-tight">
          Trust<span className="text-primary">FL</span>
        </div>
        <div className="text-sm text-muted">
          Built with <span className="text-coral">♥</span> by{" "}
          <span className="font-semibold text-text-primary">Yashi</span>
        </div>
      </div>
    </footer>
  );
}
