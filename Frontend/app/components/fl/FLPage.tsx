"use client";

import { useState, useRef, useCallback } from "react";
import { useToast } from "@/app/context/ToastContext";
import NetworkCanvas from "./NetworkCanvas";
import AccuracyChart, { type AccuracyChartHandle } from "./AccuracyChart";
import Leaderboard from "./Leaderboard";

/* ──────── Types ──────── */
interface LogEntry {
  id: number;
  ts: string;
  msg: string;
  type: "ok" | "info" | "warn" | "chain" | "sys";
}

interface HospitalMetrics {
  acc: string;
  loss: string;
  score: string;
  bar: number;
}

/* ──────── Helpers ──────── */
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getTimestamp() {
  const t = new Date();
  return `${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`;
}

const logTypeColor: Record<string, string> = {
  ok: "text-neon-green",
  info: "text-primary",
  warn: "text-amber",
  chain: "text-coral",
  sys: "text-neon-blue",
};

/* ══════════════════════════ FL PAGE ══════════════════════════ */
export default function FLPage() {
  const { showToast } = useToast();
  const chartRef = useRef<AccuracyChartHandle>(null);
  const logRef = useRef<HTMLDivElement>(null);

  /* ── State ── */
  const [flRound, setFlRound] = useState(0);
  const [flRunning, setFlRunning] = useState(false);
  const [flRounds, setFlRounds] = useState(10);
  const [flLr, setFlLr] = useState(3);
  const [flEpochs, setFlEpochs] = useState(5);
  const [modelName, setModelName] = useState("Heart Disease Predictor");
  const [globalAcc, setGlobalAcc] = useState("0.0");
  const [roundDisplay, setRoundDisplay] = useState("round 0 / 0");
  const [progress, setProgress] = useState(0);

  const [metrics, setMetrics] = useState<Record<string, HospitalMetrics>>({
    a: { acc: "89.0%", loss: "0.1540", score: "0.35", bar: 89 },
    b: { acc: "87.0%", loss: "0.1820", score: "0.30", bar: 87 },
    c: { acc: "91.0%", loss: "0.1200", score: "0.40", bar: 91 },
  });

  const [cardGlow, setCardGlow] = useState(false);

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, ts: "00:00", msg: "TrustFL initialised. PyTorch backend ready.", type: "sys" },
    { id: 2, ts: "00:00", msg: "3 hospital nodes connected to FL server.", type: "info" },
  ]);
  const logIdRef = useRef(3);

  // Use refs for mutable training state to avoid stale closures
  const flRoundRef = useRef(0);
  const flRunningRef = useRef(false);

  const addLog = useCallback((msg: string, type: LogEntry["type"] = "info") => {
    const entry: LogEntry = { id: logIdRef.current++, ts: getTimestamp(), msg, type };
    setLogs((prev) => [...prev, entry]);
    setTimeout(() => logRef.current?.scrollTo({ top: logRef.current.scrollHeight }), 50);
  }, []);

  /* ── Progress Ring ── */
  const circumference = 2 * Math.PI * 32;
  const strokeOffset = circumference - (progress / 100) * circumference;

  /* ── Run Single Round ── */
  const runFLRound = useCallback(async () => {
    if (flRunningRef.current || flRoundRef.current >= flRounds) return;
    flRunningRef.current = true;
    setFlRunning(true);

    flRoundRef.current++;
    const currentRound = flRoundRef.current;

    setFlRound(currentRound);
    setRoundDisplay(`round ${currentRound} / ${flRounds}`);
    addLog(`── Round ${currentRound} started ──`, "sys");
    setCardGlow(true);

    await sleep(350);

    // Local training
    const la = (62 + currentRound * 2.8 + (Math.random() - 0.5) * 3).toFixed(1);
    const lb = (60 + currentRound * 2.5 + (Math.random() - 0.5) * 3).toFixed(1);
    const lc = (63 + currentRound * 3.0 + (Math.random() - 0.5) * 3).toFixed(1);
    const lossa = (0.68 - currentRound * 0.048 + (Math.random() - 0.5) * 0.02).toFixed(4);
    const lossb = (0.72 - currentRound * 0.05 + (Math.random() - 0.5) * 0.02).toFixed(4);
    const lossc = (0.65 - currentRound * 0.045 + (Math.random() - 0.5) * 0.02).toFixed(4);

    addLog(`H001 — local training complete. acc=${la}% loss=${lossa}`, "ok");
    await sleep(200);
    addLog(`H002 — local training complete. acc=${lb}% loss=${lossb}`, "ok");
    await sleep(200);
    addLog(`H003 — local training complete. acc=${lc}% loss=${lossc}`, "ok");

    // Update cards
    const sa = (0.3 + Math.random() * 0.15).toFixed(2);
    const sb = (0.28 + Math.random() * 0.12).toFixed(2);
    const sc = (0.32 + Math.random() * 0.18).toFixed(2);

    setMetrics({
      a: { acc: la + "%", loss: lossa, score: sa, bar: Math.min(Number(la), 100) },
      b: { acc: lb + "%", loss: lossb, score: sb, bar: Math.min(Number(lb), 100) },
      c: { acc: lc + "%", loss: lossc, score: sc, bar: Math.min(Number(lc), 100) },
    });

    await sleep(400);
    addLog("FL Server — FedAvg aggregating 3 weight tensors...", "warn");

    const gAcc = ((parseFloat(la) + parseFloat(lb) + parseFloat(lc)) / 3).toFixed(1);
    await sleep(500);
    addLog(`Global model updated. accuracy=${gAcc}%`, "ok");

    // Blockchain
    await sleep(200);
    addLog(`Blockchain — hashing R${currentRound} updates (3 blocks)...`, "chain");
    await sleep(300);
    addLog(`Blockchain — blocks confirmed. Chain height: ${4 + currentRound * 3}`, "chain");

    // Chart update
    chartRef.current?.addData(`R${currentRound}`, parseFloat(gAcc), parseFloat(la), parseFloat(lb), parseFloat(lc));

    // Update global
    setGlobalAcc(gAcc);
    const prog = (currentRound / flRounds) * 100;
    setProgress(prog);
    setCardGlow(false);

    if (currentRound >= flRounds) {
      addLog(`Training complete! Final accuracy: ${gAcc}%`, "ok");
      setRoundDisplay("complete ✓");
      showToast("Training Complete", `Global model reached ${gAcc}% accuracy`);
    }

    flRunningRef.current = false;
    setFlRunning(false);
  }, [flRounds, addLog, showToast]);

  /* ── Run All ── */
  const runAllFL = useCallback(async () => {
    if (flRunningRef.current) return;
    while (flRoundRef.current < flRounds) {
      await runFLRound();
      await sleep(200);
    }
  }, [flRounds, runFLRound]);

  /* ── Reset ── */
  function resetFL() {
    flRoundRef.current = 0;
    flRunningRef.current = false;
    setFlRound(0);
    setFlRunning(false);
    setGlobalAcc("0.0");
    setRoundDisplay("round 0 / 0");
    setProgress(0);
    setMetrics({
      a: { acc: "89.0%", loss: "0.1540", score: "0.35", bar: 0 },
      b: { acc: "87.0%", loss: "0.1820", score: "0.30", bar: 0 },
      c: { acc: "91.0%", loss: "0.1200", score: "0.40", bar: 0 },
    });
    chartRef.current?.reset();
    setLogs([{ id: logIdRef.current++, ts: "00:00", msg: "TrustFL reset. Ready.", type: "sys" }]);
    showToast("Reset Complete", "FL training environment cleared");
  }

  const inputClass = "w-full bg-surface-2 border border-border-2 rounded-lg px-3.5 py-2.5 text-text-primary font-sans text-sm outline-none transition-colors focus:border-cyan-2";

  /* ── Hospital Card Data ── */
  const hospCards = [
    { key: "a", cls: "hc-a", name: "Apollo Medical — H001", loc: "Chennai · Private · 847 patients", colorClass: "text-primary" },
    { key: "b", cls: "hc-b", name: "Sunrise Health — H002", loc: "Bangalore · Private · 623 patients", colorClass: "text-amber" },
    { key: "c", cls: "hc-c", name: "Metro General — H003", loc: "Delhi · Government · 1102 patients", colorClass: "text-neon-blue" },
  ];

  return (
    <div className="page-section">
      {/* Hero */}
      <div className="text-center px-[60px] pt-[50px] pb-[30px]">
        <h1 className="text-[48px] font-extrabold tracking-[-2px] mb-3">
          Federated <span className="text-neon-green">Learning</span> Lab
        </h1>
        <p className="text-muted max-w-[520px] mx-auto mb-8">
          Simulate multi-hospital collaborative training. Weights are shared — never raw patient data. Watch FedAvg aggregate updates in real time.
        </p>
      </div>

      {/* Hospital Cards */}
      <div className="grid grid-cols-3 gap-4 px-[60px] pb-10">
        {hospCards.map((h) => {
          const m = metrics[h.key];
          return (
            <div
              key={h.key}
              className={`hosp-card ${h.cls}`}
              style={cardGlow ? { boxShadow: "0 0 20px rgba(0,229,255,0.15)" } : {}}
            >
              <div className="font-bold text-[15px] mb-1">{h.name}</div>
              <div className="font-mono text-[11px] text-muted mb-4">{h.loc}</div>
              {[
                { label: "Local accuracy", val: m.acc },
                { label: "Loss", val: m.loss },
                { label: "Contribution score", val: m.score },
              ].map((s) => (
                <div key={s.label} className="flex justify-between mb-1.5 text-[13px]">
                  <span className="text-muted">{s.label}</span>
                  <span className={`font-mono font-bold ${h.colorClass}`}>{s.val}</span>
                </div>
              ))}
              <div className="bg-surface-2 rounded h-[5px] mt-2.5 overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-1000"
                  style={{
                    width: `${m.bar}%`,
                    background: h.key === "a" ? "var(--color-cyan)" : h.key === "b" ? "var(--color-amber)" : "var(--color-neon-blue)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-6 px-[60px] pb-[60px]">
        {/* Network Canvas */}
        <NetworkCanvas />

        {/* Training Config */}
        <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-custom">
            <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Training Configuration</div>
            <span className="inline-block px-2 py-0.5 rounded-[5px] font-mono text-[10px] bg-blue-light text-neon-blue border border-neon-blue/20">
              {modelName}
            </span>
          </div>
          <div className="p-5">
            {/* Model select */}
            <div className="flex items-center justify-between mb-3.5">
              <span className="font-mono text-xs text-muted">model</span>
              <select
                className="bg-surface-2 border border-border-2 rounded-lg px-2.5 py-1.5 text-text-primary font-sans text-xs outline-none"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              >
                <option>Heart Disease Predictor</option>
                <option>Diabetes Risk Predictor</option>
              </select>
            </div>

            {/* FL Rounds */}
            <div className="flex items-center justify-between mb-3.5">
              <span className="font-mono text-xs text-muted">FL rounds</span>
              <div className="flex items-center gap-2.5">
                <input
                  type="range"
                  className="custom-range"
                  min="1"
                  max="20"
                  value={flRounds}
                  onChange={(e) => setFlRounds(Number(e.target.value))}
                />
                <span className="font-mono text-sm font-bold text-neon-green">{flRounds}</span>
              </div>
            </div>

            {/* Learning rate */}
            <div className="flex items-center justify-between mb-3.5">
              <span className="font-mono text-xs text-muted">learning rate</span>
              <div className="flex items-center gap-2.5">
                <input
                  type="range"
                  className="custom-range"
                  min="1"
                  max="10"
                  value={flLr}
                  onChange={(e) => setFlLr(Number(e.target.value))}
                />
                <span className="font-mono text-sm font-bold text-neon-green">0.00{flLr}</span>
              </div>
            </div>

            {/* Local epochs */}
            <div className="flex items-center justify-between mb-3.5">
              <span className="font-mono text-xs text-muted">local epochs</span>
              <div className="flex items-center gap-2.5">
                <input
                  type="range"
                  className="custom-range"
                  min="1"
                  max="20"
                  value={flEpochs}
                  onChange={(e) => setFlEpochs(Number(e.target.value))}
                />
                <span className="font-mono text-sm font-bold text-neon-green">{flEpochs}</span>
              </div>
            </div>

            {/* Aggregation */}
            <div className="flex items-center justify-between mb-3.5">
              <span className="font-mono text-xs text-muted">aggregation</span>
              <select className="bg-surface-2 border border-border-2 rounded-lg px-2.5 py-1.5 text-text-primary font-sans text-xs outline-none">
                <option>FedAvg</option>
                <option>FedProx</option>
                <option>FedNova</option>
              </select>
            </div>

            {/* Progress + Global Accuracy */}
            <div className="border-t border-border-custom mt-4 pt-4 flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
                  <circle className="prog-ring-bg" cx="40" cy="40" r="32" />
                  <circle
                    className="prog-ring-fill"
                    cx="40"
                    cy="40"
                    r="32"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-neon-green">
                  {Math.round(progress)}%
                </div>
              </div>
              <div className="flex-1">
                <div className="font-mono text-[22px] font-bold text-neon-green">{globalAcc}%</div>
                <div className="font-mono text-[11px] text-muted">global accuracy</div>
                <div className="font-mono text-sm text-amber mt-1">{roundDisplay}</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 flex-wrap mt-4">
              <button
                onClick={runFLRound}
                disabled={flRunning}
                className="px-5 py-2.5 rounded-lg font-mono text-xs cursor-pointer border-none bg-neon-green text-white font-bold tracking-wider transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                ▶ Run Round
              </button>
              <button
                onClick={runAllFL}
                disabled={flRunning}
                className="px-5 py-2.5 rounded-lg font-mono text-xs cursor-pointer border-none bg-primary text-white font-bold tracking-wider transition-all hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                ▶▶ Run All
              </button>
              <button
                onClick={resetFL}
                className="px-5 py-2.5 rounded-lg font-mono text-xs cursor-pointer bg-transparent text-primary border border-primary/30 tracking-wider transition-all hover:bg-primary-light"
              >
                ↺ Reset
              </button>
            </div>
          </div>
        </div>

        {/* Accuracy Chart */}
        <AccuracyChart ref={chartRef} />

        {/* Training Log */}
        <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-custom">
            <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Training Log</div>
            <span className="inline-block px-2 py-0.5 rounded-[5px] font-mono text-[10px] bg-primary-light text-primary border border-primary/20">
              {logs.length} entries
            </span>
          </div>
          <div ref={logRef} className="p-4 font-mono text-[11px] h-[200px] overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="leading-[1.8] log-entry">
                <span className="text-muted-2 mr-2.5">{log.ts}</span>
                <span className={logTypeColor[log.type]}>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard — full width */}
        <div className="col-span-2">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
