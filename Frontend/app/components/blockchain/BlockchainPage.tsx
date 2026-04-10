"use client";

import { useState, useRef, useCallback } from "react";
import { useToast } from "@/app/context/ToastContext";

/* ──────── Types ──────── */
interface ChainBlock {
  num: number;
  type: "genesis" | "block";
  hosp: string;
  hash: string;
  prev: string;
  status: "verified" | "pending" | "failed";
  acc: string | null;
  round: string;
}

interface TxEntry {
  id: number;
  msg: string;
  type: "ok" | "info" | "warn" | "err";
}

const hashes = [
  "0xa4c2e8f1d3b5a7c9e0f2d4b6a8c0e2f4d6b8a0c2e4f6d8b0a2c4e6f8d0b2a4c6",
  "0xd9f3b1e5c7a9d2f4b6c8e0a2f4d6b8c0e2a4f6b8d0c2e4a6f8b0d2c4e6a8f0b2",
  "0x7e2f9b4d6c8a0e2f4d6b8c0e2a4f6b8d0c2e4a6f8b0d2c4e6a8f0b2d4c6e8a0f2",
];

const initialBlocks: ChainBlock[] = [
  { num: 0, type: "genesis", hosp: "GENESIS", hash: "0x000000000000", prev: "0x000000000000", status: "verified", acc: null, round: "—" },
  { num: 1, type: "block", hosp: "H001", hash: "0xabc123hash456", prev: "0x000000000000", status: "verified", acc: "89%", round: "TR001" },
  { num: 2, type: "block", hosp: "H002", hash: "0xdef456hash789", prev: "0xabc123hash456", status: "verified", acc: "87%", round: "TR001" },
  { num: 3, type: "block", hosp: "H003", hash: "0xxyz789hash012", prev: "0xdef456hash789", status: "pending", acc: "91%", round: "TR002" },
];

/* ──────── Badge ──────── */
function Badge({ children, variant }: { children: React.ReactNode; variant: string }) {
  const styles: Record<string, string> = {
    green: "bg-green-light text-neon-green border border-neon-green/20",
    cyan: "bg-primary-light text-primary border border-primary/20",
    amber: "bg-amber-light text-amber border border-amber/20",
    coral: "bg-coral-light text-coral border border-coral/20",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-[5px] font-mono text-[10px] ${styles[variant] || styles.cyan}`}>
      {children}
    </span>
  );
}

/* ══════════════════════════ BLOCKCHAIN PAGE ══════════════════════════ */
export default function BlockchainPage() {
  const { showToast } = useToast();
  const [chainBlocks, setChainBlocks] = useState<ChainBlock[]>(initialBlocks);
  const [verifyIdx, setVerifyIdx] = useState(0);
  const [hashDisplay, setHashDisplay] = useState(hashes[0] + "...");
  const [txLog, setTxLog] = useState<TxEntry[]>([
    { id: 1, msg: "[INIT] Blockchain genesis block created", type: "info" },
    { id: 2, msg: "[OK] Block #1 — H001 update verified — 0xabc123", type: "ok" },
    { id: 3, msg: "[OK] Block #2 — H002 update verified — 0xdef456", type: "ok" },
    { id: 4, msg: "[OK] Block #3 — H003 update verified — 0xxyz789", type: "ok" },
    { id: 5, msg: "[PEND] Block #4 — awaiting confirmation...", type: "warn" },
  ]);
  const txIdRef = useRef(6);
  const blockNumRef = useRef(4);
  const txLogRef = useRef<HTMLDivElement>(null);

  const addTxLog = useCallback((msg: string, type: TxEntry["type"] = "info") => {
    const entry = { id: txIdRef.current++, msg, type };
    setTxLog((prev) => [...prev, entry]);
    setTimeout(() => {
      txLogRef.current?.scrollTo({ top: txLogRef.current.scrollHeight });
    }, 50);
  }, []);

  /* ── Integrity calculations ── */
  const verified = chainBlocks.filter((b) => b.status === "verified").length;
  const pending = chainBlocks.filter((b) => b.status === "pending").length;
  const failed = chainBlocks.filter((b) => b.status === "failed").length;
  const integrityPct = Math.round((verified / chainBlocks.length) * 100);

  const integrityColor = integrityPct > 80 ? "neon-green" : integrityPct > 50 ? "amber" : "coral";
  const integrityBgColor = integrityPct > 80 ? "green-dim" : integrityPct > 50 ? "amber-dim" : "coral-dim";

  /* ── Actions ── */
  function computeHash() {
    setHashDisplay(hashes[verifyIdx] + "...");
    addTxLog(`[HASH] Computed SHA-256 for update U00${verifyIdx + 1}`, "info");
  }

  function mineBlock() {
    const hosps = ["H001", "H002", "H003"];
    const rounds = ["TR003", "TR004", "TR005"];
    const accs = ["88%", "90%", "92%", "86%"];
    const h = hosps[Math.floor(Math.random() * hosps.length)];
    const prevHash = chainBlocks[chainBlocks.length - 1].hash;
    const newHash = "0x" + Math.random().toString(16).slice(2, 10) + "hash" + Math.random().toString(16).slice(2, 8);
    const num = blockNumRef.current++;
    const block: ChainBlock = {
      num,
      type: "block",
      hosp: h,
      hash: newHash,
      prev: prevHash,
      status: "pending",
      acc: accs[Math.floor(Math.random() * accs.length)],
      round: rounds[Math.floor(Math.random() * rounds.length)],
    };
    setChainBlocks((prev) => [...prev, block]);
    addTxLog(`[MINE] Block #${num} mined for ${h} — hash: ${newHash.slice(0, 14)}...`, "warn");
    setTimeout(() => {
      setChainBlocks((prev) =>
        prev.map((b) => (b.num === num ? { ...b, status: "verified" } : b))
      );
      addTxLog(`[OK] Block #${num} confirmed on blockchain`, "ok");
      showToast("Block Mined", "New block added and verified");
    }, 1800);
  }

  function verifyChain() {
    addTxLog("[VERIFY] Running chain integrity check...", "info");
    setTimeout(() => {
      setChainBlocks((prev) =>
        prev.map((b) => (b.status === "pending" ? { ...b, status: "verified" } : b))
      );
      addTxLog("[OK] All blocks verified. Chain intact.", "ok");
      showToast("Chain Verified", "All blocks integrity confirmed ✓");
    }, 1000);
  }

  function tamperBlock() {
    if (chainBlocks.length < 2) {
      showToast("Error", "Need more blocks", "var(--color-coral)");
      return;
    }
    const idx = 1 + Math.floor(Math.random() * (chainBlocks.length - 1));
    const tampered = "0xTAMPERED_" + Math.random().toString(16).slice(2, 10);
    setChainBlocks((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, hash: tampered, status: "failed" } : b))
    );
    addTxLog(`[ALERT] Block #${chainBlocks[idx].num} tampered! Hash mismatch detected!`, "err");
    showToast("Tamper Detected!", `Block #${idx} hash changed — chain compromised`, "var(--color-coral)");
  }

  function verifyUpdate() {
    addTxLog(`[VERIFY] Verifying update U00${verifyIdx + 1} hash against ledger...`, "info");
    setTimeout(() => {
      addTxLog(`[OK] U00${verifyIdx + 1} hash matches block #${verifyIdx + 1}. Integrity confirmed.`, "ok");
      showToast("Update Verified", `Model update U00${verifyIdx + 1} is authentic`);
    }, 800);
  }

  const txColorMap: Record<string, string> = { ok: "text-neon-green", info: "text-primary", warn: "text-amber", err: "text-coral" };

  return (
    <div className="page-section">
      {/* Hero */}
      <div className="text-center px-[60px] pt-[50px] pb-[30px]">
        <h1 className="text-[48px] font-extrabold tracking-[-2px] mb-3">
          Blockchain <span className="text-amber">Verification</span>
        </h1>
        <p className="text-muted max-w-[520px] mx-auto mb-8">
          Every model update is hashed with SHA-256 and recorded on an immutable ledger. Tamper-proof. Transparent. Trustless.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={mineBlock} className="px-6 py-2.5 rounded-lg font-mono text-xs cursor-pointer border-none bg-amber text-white font-bold tracking-wider transition-all shadow-sm hover:opacity-90">
            Mine New Block ⛏
          </button>
          <button onClick={verifyChain} className="px-5 py-2.5 rounded-lg font-mono text-xs cursor-pointer bg-transparent text-primary border border-primary/30 tracking-wider transition-all hover:bg-primary-light">
            Verify Chain Integrity ✓
          </button>
          <button onClick={tamperBlock} className="px-5 py-2.5 rounded-lg font-mono text-xs cursor-pointer bg-transparent text-coral border border-coral/30 tracking-wider transition-all hover:bg-coral-light">
            Simulate Tamper Attack ⚠
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid px-[60px] pb-[60px] gap-6" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
        {/* Chain Ledger */}
        <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-custom">
            <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Blockchain Ledger</div>
            <Badge variant="amber">{chainBlocks.length} blocks</Badge>
          </div>
          <div className="p-5 max-h-[520px] overflow-y-auto">
            {[...chainBlocks].reverse().map((b, i) => (
              <div key={b.num}>
                {i > 0 && <div className="flex justify-center text-muted-2 text-lg -my-0.5">↑</div>}
                <div className={`chain-block ${b.type === "genesis" ? "genesis" : ""} ${b.status}`}>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-mono text-sm font-bold text-amber">
                      #{b.num} {b.type === "genesis" ? "GENESIS" : "BLOCK"}
                    </span>
                    <span className="font-mono text-[10px] text-muted">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="font-mono text-[10px] text-primary mb-2 break-all">Hash: {b.hash}</div>
                  <div className="font-mono text-[10px] text-muted mb-2">Prev: {b.prev}</div>
                  <div className="flex gap-2 flex-wrap">
                    {b.hosp !== "GENESIS" && <Badge variant="amber">{b.hosp}</Badge>}
                    {b.round !== "—" && <Badge variant="cyan">{b.round}</Badge>}
                    {b.acc && (
                      <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] bg-green-light text-neon-green border border-neon-green/20">
                        acc:{b.acc}
                      </span>
                    )}
                    <Badge variant={b.status === "verified" ? "green" : b.status === "pending" ? "amber" : "coral"}>
                      {b.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Console */}
        <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-custom">
            <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Verification Console</div>
            <span
              className="inline-block px-2 py-0.5 rounded-[5px] font-mono text-[10px] border"
              style={{
                background: integrityPct > 80 ? 'var(--color-green-light)' : integrityPct > 50 ? 'var(--color-amber-light)' : 'var(--color-coral-light)',
                color: integrityPct > 80 ? 'var(--color-neon-green)' : integrityPct > 50 ? 'var(--color-amber)' : 'var(--color-coral)',
                borderColor: integrityPct > 80 ? 'rgba(5,150,105,0.2)' : integrityPct > 50 ? 'rgba(217,119,6,0.2)' : 'rgba(220,38,38,0.2)',
              }}
            >
              Integrity: {integrityPct}%
            </span>
          </div>

          <div className="p-5">
            {/* Verify select */}
            <div className="mb-3.5">
              <label className="block text-xs font-mono text-muted mb-1.5">model update to verify</label>
              <select
                value={verifyIdx}
                onChange={(e) => { setVerifyIdx(Number(e.target.value)); }}
                className="w-full bg-surface-2 border border-border-2 rounded-lg px-3.5 py-2.5 text-text-primary font-sans text-sm outline-none transition-colors focus:border-cyan-2"
              >
                <option value={0}>U001 — H001 — hash_abc123 — acc: 89%</option>
                <option value={1}>U002 — H002 — hash_def456 — acc: 87%</option>
                <option value={2}>U003 — H003 — hash_xyz789 — acc: 91%</option>
              </select>
            </div>

            {/* Hash display */}
            <label className="block text-xs font-mono text-muted mb-1.5">SHA-256 hash</label>
            <div className="font-mono text-[11px] bg-surface-2 border border-border-2 rounded-lg p-3 text-primary break-all leading-[1.6] min-h-[60px]">
              {hashDisplay}
            </div>

            {/* Integrity meter */}
            <div className="mt-4 bg-surface-2 border border-border-custom rounded-xl p-4">
              <div className="flex justify-between font-mono text-[11px] text-muted mb-2.5">
                <span>chain integrity score</span>
                <span style={{ color: integrityPct > 80 ? 'var(--color-neon-green)' : integrityPct > 50 ? 'var(--color-amber)' : 'var(--color-coral)' }}>{integrityPct}%</span>
              </div>
              <div className="bg-surface-3 rounded h-2 overflow-hidden mb-3">
                <div
                  className="h-full rounded transition-all duration-1000"
                  style={{ width: `${integrityPct}%`, background: "linear-gradient(90deg, var(--color-neon-green), var(--color-primary))" }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center">
                  <div className="font-mono text-lg font-bold text-neon-green">{verified}</div>
                  <div className="font-mono text-[10px] text-muted">verified</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-lg font-bold text-amber">{pending}</div>
                  <div className="font-mono text-[10px] text-muted">pending</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-lg font-bold text-coral">{failed}</div>
                  <div className="font-mono text-[10px] text-muted">failed</div>
                </div>
              </div>
            </div>

            {/* Merkle Tree */}
            <div className="bg-surface-2 border border-border-custom rounded-xl p-4 my-4">
              <div className="font-mono text-[11px] text-muted mb-3 uppercase tracking-wider">Merkle Tree — Round TR001</div>
              <svg className="w-full" viewBox="0 0 380 140" height="140">
                <rect x="130" y="5" width="120" height="32" rx="6" fill="#e0f2fe" stroke="#bae6fd" />
                <text x="190" y="26" textAnchor="middle" fill="#0284c7" fontFamily="Space Mono" fontSize="9" fontWeight="700">ROOT: 0xf7a2...</text>
                <line x1="190" y1="37" x2="95" y2="75" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 2" />
                <line x1="190" y1="37" x2="285" y2="75" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 2" />
                <rect x="30" y="75" width="130" height="28" rx="5" fill="#d1fae5" stroke="#a7f3d0" />
                <text x="95" y="93" textAnchor="middle" fill="#059669" fontFamily="Space Mono" fontSize="8">H001: 0xabc1...</text>
                <rect x="220" y="75" width="130" height="28" rx="5" fill="#fef3c7" stroke="#fde68a" />
                <text x="285" y="93" textAnchor="middle" fill="#d97706" fontFamily="Space Mono" fontSize="8">H002: 0xdef4...</text>
                <line x1="75" y1="103" x2="45" y2="125" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="115" y1="103" x2="145" y2="125" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                <rect x="10" y="115" width="80" height="22" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
                <text x="50" y="130" textAnchor="middle" fill="#64748b" fontFamily="Space Mono" fontSize="8">acc:0.89</text>
                <rect x="100" y="115" width="80" height="22" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
                <text x="140" y="130" textAnchor="middle" fill="#64748b" fontFamily="Space Mono" fontSize="8">loss:0.15</text>
                <rect x="215" y="115" width="80" height="22" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
                <text x="255" y="130" textAnchor="middle" fill="#64748b" fontFamily="Space Mono" fontSize="8">acc:0.87</text>
                <rect x="305" y="115" width="80" height="22" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
                <text x="345" y="130" textAnchor="middle" fill="#64748b" fontFamily="Space Mono" fontSize="8">loss:0.18</text>
              </svg>
            </div>

            {/* Transaction Log */}
            <label className="block text-xs font-mono text-muted mb-1.5">transaction log</label>
            <div ref={txLogRef} className="bg-surface-2 rounded-lg p-3 font-mono text-[11px] max-h-[140px] overflow-y-auto">
              {txLog.map((entry) => (
                <div key={entry.id} className="tx-entry">
                  <span className={txColorMap[entry.type]}>{entry.msg}</span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
              <button onClick={computeHash} className="flex-1 px-6 py-2.5 rounded-lg font-mono text-xs cursor-pointer border-none bg-primary text-white font-bold tracking-wider transition-all hover:bg-primary-dark shadow-sm">
                Compute Hash
              </button>
              <button onClick={verifyUpdate} className="flex-1 px-6 py-2.5 rounded-lg font-mono text-xs cursor-pointer border-none bg-neon-green text-white font-bold tracking-wider transition-all hover:opacity-90 shadow-sm">
                Verify Update ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
