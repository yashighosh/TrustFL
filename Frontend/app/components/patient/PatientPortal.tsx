"use client";

import { useState } from "react";

/* ──────── Types ──────── */
interface PatientRecord {
  id: string;
  date: string;
  diagnosis: string;
  doctor: string;
  symptoms: string;
  medication: string;
  dosage: string;
  labTest: string;
  labResult: string;
}

interface RiskFactor {
  label: string;
  value: number;
  maxValue: number;
  status: "low" | "moderate" | "high";
}

/* ──────── Mock Data ──────── */
const patientInfo = {
  id: "P001",
  name: "Rohan Das",
  age: 36,
  gender: "Male",
  blood: "B+",
  hospital: "CityCare Hospital",
  hospitalId: "H001",
  phone: "+91-9876543210",
  registered: "2026-01-15",
  riskScore: 32,
  riskLevel: "Moderate" as const,
};

const records: PatientRecord[] = [
  {
    id: "R001",
    date: "2026-03-10",
    diagnosis: "Hypertension",
    doctor: "Dr. Arjun Mehta",
    symptoms: "Headache, dizziness, fatigue",
    medication: "Amlodipine",
    dosage: "5mg daily",
    labTest: "Blood Pressure Test",
    labResult: "150/95 mmHg",
  },
  {
    id: "R005",
    date: "2026-02-18",
    diagnosis: "Follow-up Checkup",
    doctor: "Dr. Arjun Mehta",
    symptoms: "Mild headache",
    medication: "Amlodipine",
    dosage: "5mg daily",
    labTest: "Blood Pressure Test",
    labResult: "140/88 mmHg",
  },
  {
    id: "R008",
    date: "2026-01-22",
    diagnosis: "Initial Screening",
    doctor: "Dr. Priya Sharma",
    symptoms: "None reported",
    medication: "—",
    dosage: "—",
    labTest: "CBC, Blood Sugar",
    labResult: "Normal range",
  },
];

const riskFactors: RiskFactor[] = [
  { label: "Blood Pressure", value: 72, maxValue: 100, status: "high" },
  { label: "Cholesterol", value: 45, maxValue: 100, status: "moderate" },
  { label: "Blood Sugar", value: 22, maxValue: 100, status: "low" },
  { label: "BMI Index", value: 55, maxValue: 100, status: "moderate" },
];

const privacyLog = [
  { time: "10:42 AM", action: "Medical record accessed", by: "Dr. Arjun Mehta", type: "read" },
  { time: "10:15 AM", action: "Lab results uploaded", by: "Lab Technician", type: "write" },
  { time: "09:30 AM", action: "Prescription updated", by: "Dr. Arjun Mehta", type: "write" },
  { time: "Yesterday", action: "FL model used anonymised data", by: "TrustFL System", type: "fl" },
  { time: "2 days ago", action: "Blockchain audit recorded", by: "System", type: "chain" },
];

/* ──────── Sub-Components ──────── */
function Badge({ children, variant }: { children: React.ReactNode; variant: "green" | "cyan" | "amber" | "coral" | "blue" }) {
  const styles: Record<string, string> = {
    green: "bg-green-light text-neon-green border border-neon-green/20",
    cyan: "bg-primary-light text-primary border border-primary/20",
    amber: "bg-amber-light text-amber border border-amber/20",
    coral: "bg-coral-light text-coral border border-coral/20",
    blue: "bg-blue-light text-neon-blue border border-neon-blue/20",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-[5px] font-mono text-[10px] ${styles[variant]}`}>
      {children}
    </span>
  );
}

function RiskGauge({ score, level }: { score: number; level: string }) {
  const color = level === "Low" ? "var(--color-neon-green)" : level === "Moderate" ? "var(--color-amber)" : "var(--color-coral)";
  const circumference = 2 * Math.PI * 54;
  const strokeOffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg width="144" height="144" viewBox="0 0 144 144" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="72" cy="72" r="54" fill="none" stroke="var(--color-surface-3)" strokeWidth="10" />
        <circle
          cx="72" cy="72" r="54" fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          style={{ transition: "stroke-dashoffset 1.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-mono text-3xl font-extrabold" style={{ color }}>{score}</div>
        <div className="font-mono text-[10px] text-muted uppercase tracking-wider">{level} risk</div>
      </div>
    </div>
  );
}

/* ══════════════════════════ PATIENT PORTAL ══════════════════════════ */
export default function PatientPortal({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const tabs = ["Overview", "Medical Records", "Privacy & Data"];

  return (
    <div className="page-section">
      {/* Header */}
      <div className="px-[60px] pt-[50px] pb-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-light border border-primary/20 flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Welcome back, <span className="text-primary">{patientInfo.name}</span>
              </h1>
              <p className="text-muted text-sm font-mono">
                {patientInfo.hospitalId} · {patientInfo.hospital} · Patient ID: {patientInfo.id}
              </p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-lg font-mono text-xs cursor-pointer bg-transparent text-primary border border-primary/30 tracking-wider transition-all hover:bg-primary-light"
          >
            ← Back to Admin
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 bg-surface-2 border border-border-custom rounded-xl p-1 w-fit">
          {tabs.map((label, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-2 rounded-lg font-mono text-xs cursor-pointer border transition-all duration-200 tracking-wide ${
                activeTab === i
                  ? "bg-primary-light text-primary border-primary/20 font-semibold"
                  : "bg-transparent text-muted border-transparent hover:text-text-primary hover:bg-surface-3"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB 0: Overview ── */}
      {activeTab === 0 && (
        <div className="px-[60px] pb-[60px]">
          {/* Top cards */}
          <div className="grid grid-cols-4 gap-5 mb-6">
            {[
              { label: "Blood Group", value: patientInfo.blood, icon: "🩸", color: "coral" },
              { label: "Age", value: `${patientInfo.age} yrs`, icon: "📅", color: "cyan" },
              { label: "Total Visits", value: `${records.length}`, icon: "🏥", color: "blue" },
              { label: "Active Prescriptions", value: "1", icon: "💊", color: "amber" },
            ].map((card) => (
              <div key={card.label} className="bg-surface border border-border-custom rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-xl">{card.icon}</div>
                  <div className="font-mono text-[10px] text-muted uppercase tracking-widest">{card.label}</div>
                </div>
                <div className="font-mono text-2xl font-extrabold text-text-primary">{card.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Risk Score */}
            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom flex items-center justify-between">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">AI Risk Assessment</div>
                <Badge variant="amber">ML-powered</Badge>
              </div>
              <div className="p-6">
                <RiskGauge score={patientInfo.riskScore} level={patientInfo.riskLevel} />
                <div className="mt-6 space-y-3">
                  {riskFactors.map((rf) => (
                    <div key={rf.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted font-mono">{rf.label}</span>
                        <span className={`font-mono font-bold ${
                          rf.status === "low" ? "text-neon-green" : rf.status === "moderate" ? "text-amber" : "text-coral"
                        }`}>
                          {rf.value}%
                        </span>
                      </div>
                      <div className="bg-surface-3 rounded h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded transition-all duration-1000"
                          style={{
                            width: `${rf.value}%`,
                            background: rf.status === "low" ? "var(--color-neon-green)" : rf.status === "moderate" ? "var(--color-amber)" : "var(--color-coral)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Latest Record */}
            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Latest Visit</div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">Diagnosis</div>
                  <div className="font-semibold text-lg">{records[0].diagnosis}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">Doctor</div>
                    <div className="text-sm font-medium">{records[0].doctor}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">Date</div>
                    <div className="text-sm font-mono">{records[0].date}</div>
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">Symptoms</div>
                  <div className="text-sm text-muted">{records[0].symptoms}</div>
                </div>
                <div className="bg-surface-2 rounded-xl p-3.5 border border-border-custom">
                  <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2">PRESCRIPTION</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{records[0].medication}</div>
                      <div className="font-mono text-xs text-muted">{records[0].dosage}</div>
                    </div>
                    <Badge variant="green">Active</Badge>
                  </div>
                </div>
                <div className="bg-surface-2 rounded-xl p-3.5 border border-border-custom">
                  <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2">LAB RESULT</div>
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm">{records[0].labTest}</div>
                    <div className="font-mono text-sm font-bold text-amber">{records[0].labResult}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Shield */}
            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom flex items-center justify-between">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Data Privacy</div>
                <Badge variant="green">Protected</Badge>
              </div>
              <div className="p-5">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-light border border-neon-green/20 text-3xl mb-3">
                    🛡️
                  </div>
                  <div className="font-bold text-lg text-neon-green">Data Sovereign</div>
                  <p className="text-xs text-muted mt-1 max-w-[220px] mx-auto">
                    Your medical records have never left {patientInfo.hospital}. Only anonymised model weights are shared.
                  </p>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Raw data shared externally", value: "0 records", status: "green" },
                    { label: "FL contributions (anonymised)", value: "3 rounds", status: "cyan" },
                    { label: "Blockchain verifications", value: "3 verified", status: "amber" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between bg-surface-2 rounded-lg px-3 py-2.5 border border-border-custom">
                      <span className="text-xs text-muted">{item.label}</span>
                      <Badge variant={item.status as "green" | "cyan" | "amber"}>{item.value}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 1: Medical Records ── */}
      {activeTab === 1 && (
        <div className="px-[60px] pb-[60px]">
          <div className="space-y-3">
            {records.map((rec) => (
              <div key={rec.id} className="bg-surface border border-border-custom rounded-2xl overflow-hidden transition-all hover:shadow-md">
                <button
                  onClick={() => setExpandedRecord(expandedRecord === rec.id ? null : rec.id)}
                  className="w-full px-6 py-4 flex items-center justify-between cursor-pointer bg-transparent border-none text-left"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant="blue">{rec.id}</Badge>
                    <div>
                      <div className="font-semibold text-sm">{rec.diagnosis}</div>
                      <div className="font-mono text-[11px] text-muted">{rec.doctor} · {rec.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="green">Verified on-chain</Badge>
                    <span className="text-muted text-lg transition-transform" style={{ transform: expandedRecord === rec.id ? "rotate(180deg)" : "rotate(0)" }}>
                      ▼
                    </span>
                  </div>
                </button>

                {expandedRecord === rec.id && (
                  <div className="px-6 pb-5 border-t border-border-custom pt-4" style={{ animation: "slideUp 0.3s ease" }}>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-surface-2 rounded-xl p-4 border border-border-custom">
                        <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2">Symptoms</div>
                        <div className="text-sm">{rec.symptoms}</div>
                      </div>
                      <div className="bg-surface-2 rounded-xl p-4 border border-border-custom">
                        <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2">Prescription</div>
                        <div className="text-sm font-semibold">{rec.medication}</div>
                        <div className="font-mono text-xs text-muted">{rec.dosage}</div>
                      </div>
                      <div className="bg-surface-2 rounded-xl p-4 border border-border-custom">
                        <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2">Lab Test</div>
                        <div className="text-sm">{rec.labTest}</div>
                        <div className="font-mono text-xs font-bold text-amber mt-1">{rec.labResult}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted">SHA-256:</span>
                      <span className="font-mono text-[10px] text-neon-green">
                        0x{Array.from({ length: 8 }, () => Math.random().toString(16).slice(2, 6)).join("")}
                      </span>
                      <Badge variant="green">✓ Blockchain Verified</Badge>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: Privacy & Data ── */}
      {activeTab === 2 && (
        <div className="px-[60px] pb-[60px]">
          <div className="grid grid-cols-2 gap-6">
            {/* Data Access Log */}
            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom flex items-center justify-between">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Data Access Audit Log</div>
                <Badge variant="cyan">{privacyLog.length} events</Badge>
              </div>
              <div className="p-0">
                {privacyLog.map((entry, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-border-custom last:border-b-0 hover:bg-surface-2 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                      entry.type === "read" ? "bg-primary-light" :
                      entry.type === "write" ? "bg-amber-light" :
                      entry.type === "fl" ? "bg-green-light" : "bg-coral-light"
                    }`}>
                      {entry.type === "read" ? "👁" : entry.type === "write" ? "✏️" : entry.type === "fl" ? "🧠" : "🔗"}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{entry.action}</div>
                      <div className="font-mono text-[10px] text-muted">{entry.by}</div>
                    </div>
                    <div className="font-mono text-[10px] text-muted">{entry.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Federated Learning Participation */}
            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom flex items-center justify-between">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Your data in FL</div>
                <Badge variant="green">Privacy Preserved</Badge>
              </div>
              <div className="p-5">
                <div className="bg-green-light rounded-2xl p-5 border border-neon-green/20 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🔒</div>
                    <div>
                      <div className="font-bold text-neon-green mb-1">Your privacy is guaranteed</div>
                      <p className="text-xs text-muted leading-relaxed">
                        TrustFL uses Federated Learning to improve AI models for disease prediction.
                        Your raw data <strong>never leaves</strong> {patientInfo.hospital}. Only mathematical
                        model weights (abstract numbers) are shared with the network. These weights
                        cannot be reverse-engineered to reveal any personal information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="font-mono text-[11px] text-muted uppercase tracking-wider mb-2">How your data contributed</div>
                  {[
                    { round: "TR001", model: "Heart Disease Predictor", contribution: "Included in local training", accuracy: "89.0%", date: "2026-03-10" },
                    { round: "TR002", model: "Heart Disease Predictor", contribution: "Included in local training", accuracy: "91.2%", date: "2026-03-15" },
                    { round: "TR003", model: "Diabetes Risk Predictor", contribution: "Included in local training", accuracy: "87.5%", date: "2026-03-20" },
                  ].map((fl) => (
                    <div key={fl.round} className="bg-surface-2 rounded-xl p-4 border border-border-custom">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="cyan">{fl.round}</Badge>
                          <span className="text-sm font-medium">{fl.model}</span>
                        </div>
                        <Badge variant="green">acc: {fl.accuracy}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>{fl.contribution}</span>
                        <span className="font-mono">{fl.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
