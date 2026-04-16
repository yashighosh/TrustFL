"use client";

export default function Footer() {
  return (
    <footer className="border-t border-border-custom bg-surface py-6 px-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="font-mono text-sm font-bold text-text-primary tracking-tight">
          Trust<span className="text-primary">FL</span>
          <span className="ml-3 font-mono text-[10px] text-muted font-normal">v1.0.0</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="font-mono text-[10px] text-muted">
            21CSC205P · DBMS Mini Project · SRM IST
          </div>
          <div className="text-sm text-muted">
            Built with <span className="text-coral">♥</span> by{" "}
            <span className="font-semibold text-text-primary">Yashi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
