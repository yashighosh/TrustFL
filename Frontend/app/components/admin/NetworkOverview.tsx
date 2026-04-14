"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";

/* ──────── Types ──────── */
interface HospitalSummary {
  id: string;
  name: string;
  location: string;
  type: string;
  doctors: number;
  patients: number;
  records: number;
  medicines: number;
  flRounds: number;
  accuracy: string;
  reputation: number;
  status: "active" | "inactive";
  registeredAt: string;
}

/* ──────── Mock Data Removed ──────── */

/* ──────── Badge ──────── */
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

/* ══════════════════════════ NETWORK OVERVIEW ══════════════════════════ */
export default function NetworkOverview() {
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<"hospitals" | "doctors" | "patients">("hospitals");

  const [networkHospitals, setNetworkHospitals] = useState<HospitalSummary[]>([]);
  const [networkDoctors, setNetworkDoctors] = useState<any[]>([]);
  const [networkPatients, setNetworkPatients] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [netRes, docRes, patRes] = await Promise.all([
          apiFetch("/admin/network-overview"),
          apiFetch("/admin/doctors"),
          apiFetch("/admin/patients")
        ]);
        setNetworkHospitals(netRes.hospitals);
        setSummary(netRes.summary);
        setNetworkDoctors(docRes);
        setNetworkPatients(patRes);
      } catch (e) {
        console.error(e);
      }
    };
    loadStats();
  }, []);

  const totalDoctors = summary.total_doctors || 0;
  const totalPatients = summary.total_patients || 0;
  const totalRecords = summary.total_records || 0;
  const avgAccuracy = networkHospitals.length > 0 
    ? (networkHospitals.reduce((s, h) => s + parseFloat(h.accuracy), 0) / networkHospitals.length).toFixed(1) 
    : "0.0";

  const filteredDoctors = selectedHospital ? networkDoctors.filter((d) => d.hospital === selectedHospital) : networkDoctors;
  const filteredPatients = selectedHospital ? networkPatients.filter((p) => p.hospital === selectedHospital) : networkPatients;

  return (
    <div className="page-section">
      {/* Header */}
      <div className="px-[60px] pt-[50px] pb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-light border border-amber/20 flex items-center justify-center text-xl">
            🌐
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Network <span className="text-amber">Overview</span>
            </h1>
            <p className="text-muted text-sm font-mono">All hospitals connected to the TrustFL federated network</p>
          </div>
        </div>
      </div>

      {/* Network Stats */}
      <div className="px-[60px] pb-6">
        <div className="grid grid-cols-5 gap-4">
          {[
            { val: networkHospitals.length, label: "Hospitals", icon: "🏥", color: "text-primary" },
            { val: totalDoctors, label: "Doctors", icon: "👨‍⚕️", color: "text-neon-blue" },
            { val: totalPatients, label: "Patients", icon: "🧑‍🤝‍🧑", color: "text-neon-green" },
            { val: totalRecords, label: "Records", icon: "📋", color: "text-amber" },
            { val: avgAccuracy + "%", label: "Avg Accuracy", icon: "🎯", color: "text-coral" },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface border border-border-custom rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{stat.icon}</span>
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className={`font-mono text-2xl font-extrabold ${stat.color}`}>{stat.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="px-[60px] pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Registered Hospitals</div>
          {selectedHospital && (
            <button
              onClick={() => setSelectedHospital(null)}
              className="font-mono text-[10px] text-primary cursor-pointer bg-transparent border-none hover:underline"
            >
              ✕ Clear filter — show all
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-5">
          {networkHospitals.map((h) => {
            const isSelected = selectedHospital === h.id;
            const colors = h.id === "H001" ? "primary" : h.id === "H002" ? "amber" : "neon-blue";
            return (
              <button
                key={h.id}
                onClick={() => setSelectedHospital(isSelected ? null : h.id)}
                className={`bg-surface border rounded-2xl p-5 text-left transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer relative overflow-hidden ${
                  isSelected ? `border-${colors} ring-2 ring-${colors}/20 shadow-lg` : "border-border-custom"
                }`}
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{
                  background: h.id === "H001" ? "var(--color-primary)" : h.id === "H002" ? "var(--color-amber)" : "var(--color-neon-blue)"
                }} />

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={h.id === "H001" ? "cyan" : h.id === "H002" ? "amber" : "blue"}>{h.id}</Badge>
                    <Badge variant="green">{h.status}</Badge>
                  </div>
                  <span className="font-mono text-[9px] text-muted">{h.registeredAt}</span>
                </div>

                <h3 className="font-bold text-[15px] mb-0.5">{h.name}</h3>
                <p className="font-mono text-[11px] text-muted mb-4">{h.location} · {h.type}</p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {[
                    { label: "Doctors", val: h.doctors },
                    { label: "Patients", val: h.patients },
                    { label: "Records", val: h.records },
                    { label: "Medicines", val: h.medicines },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between text-xs">
                      <span className="text-muted">{s.label}</span>
                      <span className="font-mono font-bold text-text-primary">{s.val}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border-custom mt-3 pt-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-muted">FL Accuracy: </span>
                    <span className="font-mono text-sm font-bold text-neon-green">{h.accuracy}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-muted">Reputation: </span>
                    <span className="font-mono text-sm font-bold text-amber">{h.reputation.toFixed(2)}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 text-center">
                    <span className="font-mono text-[9px] text-primary font-bold">▼ FILTERING BY THIS HOSPITAL</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Explorer */}
      <div className="px-[60px] pb-[60px]">
        <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border-custom flex items-center justify-between">
            <div className="flex gap-1 bg-surface-2 rounded-lg p-0.5 border border-border-custom">
              {([
                { key: "hospitals", label: "All Hospitals", count: networkHospitals.length },
                { key: "doctors", label: "All Doctors", count: filteredDoctors.length },
                { key: "patients", label: "All Patients", count: filteredPatients.length },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setViewTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-mono text-[10px] cursor-pointer border-none transition-all ${
                    viewTab === tab.key
                      ? "bg-primary-light text-primary font-bold"
                      : "bg-transparent text-muted hover:text-text-primary"
                  }`}
                >
                  {tab.label}
                  <span className={`px-1.5 rounded text-[9px] ${
                    viewTab === tab.key ? "bg-primary/10 text-primary" : "bg-surface-3 text-muted"
                  }`}>{tab.count}</span>
                </button>
              ))}
            </div>
            {selectedHospital && (
              <Badge variant="amber">Filtered: {networkHospitals.find((h) => h.id === selectedHospital)?.name}</Badge>
            )}
          </div>

          <div className="overflow-x-auto">
            {viewTab === "hospitals" && (
              <table className="db-table">
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Location</th><th>Type</th><th>Doctors</th><th>Patients</th><th>Records</th><th>FL Accuracy</th><th>Reputation</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {networkHospitals.map((h) => (
                    <tr key={h.id} className={selectedHospital === h.id ? "bg-primary-light/30" : ""}>
                      <td><Badge variant="cyan">{h.id}</Badge></td>
                      <td className="font-semibold">{h.name}</td>
                      <td>{h.location}</td><td>{h.type}</td>
                      <td className="font-mono">{h.doctors}</td>
                      <td className="font-mono">{h.patients}</td>
                      <td className="font-mono">{h.records}</td>
                      <td><span className="font-mono font-bold text-neon-green">{h.accuracy}</span></td>
                      <td><span className="font-mono font-bold text-amber">{h.reputation.toFixed(2)}</span></td>
                      <td><Badge variant="green">{h.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {viewTab === "doctors" && (
              <table className="db-table">
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Specialization</th><th>Experience</th><th>Hospital</th></tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((d) => (
                    <tr key={d.id}>
                      <td><Badge variant="blue">{d.id}</Badge></td>
                      <td className="font-semibold">{d.name}</td>
                      <td>{d.specialization}</td>
                      <td>{d.experience} yrs</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="cyan">{d.hospital}</Badge>
                          <span className="text-xs text-muted">{d.hospitalName}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {viewTab === "patients" && (
              <table className="db-table">
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Age</th><th>Blood Group</th><th>Hospital</th></tr>
                </thead>
                <tbody>
                  {filteredPatients.map((p) => (
                    <tr key={p.id}>
                      <td><Badge variant="amber">{p.id}</Badge></td>
                      <td className="font-semibold">{p.name}</td>
                      <td>{p.age}</td>
                      <td><Badge variant="coral">{p.blood}</Badge></td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="cyan">{p.hospital}</Badge>
                          <span className="text-xs text-muted">{p.hospitalName}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
