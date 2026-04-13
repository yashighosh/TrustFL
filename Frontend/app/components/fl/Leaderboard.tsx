"use client";

import { useState, useMemo } from "react";

/* ──────── Types ──────── */
interface HospitalRank {
  id: string;
  name: string;
  accuracy: number;
  rounds: number;
  updates: number;
  reputation: number;
  trend: "up" | "down" | "stable";
  tier: "gold" | "silver" | "bronze";
  color: string;
}

/* ──────── Mock Data ──────── */
const leaderboardData: HospitalRank[] = [
  { id: "H003", name: "National Medical Center", accuracy: 91.2, rounds: 10, updates: 12, reputation: 0.85, trend: "up", tier: "gold", color: "var(--color-neon-blue)" },
  { id: "H001", name: "CityCare Hospital", accuracy: 89.3, rounds: 10, updates: 12, reputation: 0.80, trend: "up", tier: "silver", color: "var(--color-primary)" },
  { id: "H002", name: "Green Valley Hospital", accuracy: 87.1, rounds: 10, updates: 12, reputation: 0.75, trend: "stable", tier: "bronze", color: "var(--color-amber)" },
];

const tierConfig = {
  gold: { emoji: "🥇", label: "GOLD", bg: "bg-amber-light", text: "text-amber", border: "border-amber/20" },
  silver: { emoji: "🥈", label: "SILVER", bg: "bg-surface-3", text: "text-muted", border: "border-border-2" },
  bronze: { emoji: "🥉", label: "BRONZE", bg: "bg-amber-light", text: "text-amber", border: "border-amber/20" },
};

const trendIcons = { up: "↑", down: "↓", stable: "→" };
const trendColors = { up: "text-neon-green", down: "text-coral", stable: "text-muted" };

/* ══════════════════════════ LEADERBOARD ══════════════════════════ */
export default function Leaderboard() {
  const [sortBy, setSortBy] = useState<"accuracy" | "reputation" | "updates">("accuracy");

  const sorted = useMemo(() => {
    return [...leaderboardData].sort((a, b) => {
      if (sortBy === "accuracy") return b.accuracy - a.accuracy;
      if (sortBy === "reputation") return b.reputation - a.reputation;
      return b.updates - a.updates;
    });
  }, [sortBy]);

  return (
    <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border-custom flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <div className="font-mono text-[11px] text-muted uppercase tracking-widest">
            Network Leaderboard
          </div>
        </div>
        <div className="flex gap-1 bg-surface-2 rounded-lg p-0.5 border border-border-custom">
          {(["accuracy", "reputation", "updates"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1 rounded-md font-mono text-[10px] cursor-pointer border-none transition-all ${
                sortBy === key
                  ? "bg-primary-light text-primary font-bold"
                  : "bg-transparent text-muted hover:text-text-primary"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-3">
        {sorted.map((hosp, rank) => {
          const tc = tierConfig[hosp.tier];
          return (
            <div
              key={hosp.id}
              className={`relative rounded-xl p-4 border transition-all hover:shadow-md ${
                rank === 0
                  ? "bg-amber-light border-amber/20"
                  : "bg-surface-2 border-border-custom"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="text-2xl w-10 text-center">{tc.emoji}</div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm truncate">{hosp.name}</span>
                    <span className={`inline-block px-1.5 py-0 rounded font-mono text-[9px] font-bold ${tc.bg} ${tc.text} border ${tc.border}`}>
                      {tc.label}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-muted">
                    {hosp.id} · {hosp.rounds} rounds · {hosp.updates} updates
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-mono text-lg font-extrabold" style={{ color: hosp.color }}>
                      {hosp.accuracy}%
                    </div>
                    <div className="font-mono text-[9px] text-muted">accuracy</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold text-text-primary">
                      {hosp.reputation.toFixed(2)}
                    </div>
                    <div className="font-mono text-[9px] text-muted">reputation</div>
                  </div>
                  <div className={`font-mono text-sm font-bold ${trendColors[hosp.trend]}`}>
                    {trendIcons[hosp.trend]}
                  </div>
                </div>
              </div>

              {/* Accuracy bar */}
              <div className="mt-3 bg-surface-3 rounded h-1.5 overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-1000"
                  style={{ width: `${hosp.accuracy}%`, background: hosp.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
