"use client";

import { useState } from "react";

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

/* ──────── Mock Network Data ──────── */
const networkHospitals: HospitalSummary[] = [
  { id: "H001", name: "CityCare Hospital", location: "Chennai", type: "Private", doctors: 3, patients: 4, records: 4, medicines: 4, flRounds: 10, accuracy: "89.3%", reputation: 0.80, status: "active", registeredAt: "2026-01-15" },
  { id: "H002", name: "Green Valley Hospital", location: "Bangalore", type: "Private", doctors: 2, patients: 3, records: 3, medicines: 3, flRounds: 10, accuracy: "87.1%", reputation: 0.75, status: "active", registeredAt: "2026-01-20" },
  { id: "H003", name: "National Medical Center", location: "Delhi", type: "Government", doctors: 4, patients: 6, records: 5, medicines: 5, flRounds: 10, accuracy: "91.2%", reputation: 0.85, status: "active", registeredAt: "2026-02-01" },
];

const networkDoctors = [
  { id: "D001", name: "Dr. Arjun Mehta", specialization: "Cardiology", hospital: "H001", hospitalName: "CityCare Hospital", experience: 10 },
  { id: "D002", name: "Dr. Priya Sharma", specialization: "Endocrinology", hospital: "H001", hospitalName: "CityCare Hospital", experience: 8 },
  { id: "D003", name: "Dr. Rahul Verma", specialization: "General Medicine", hospital: "H002", hospitalName: "Green Valley Hospital", experience: 12 },
  { id: "D004", name: "Dr. Neha Kapoor", specialization: "Neurology", hospital: "H003", hospitalName: "National Medical Center", experience: 9 },
  { id: "D005", name: "Dr. Suresh Iyer", specialization: "Orthopedics", hospital: "H003", hospitalName: "National Medical Center", experience: 15 },
  { id: "D006", name: "Dr. Kavitha Rajan", specialization: "Pediatrics", hospital: "H002", hospitalName: "Green Valley Hospital", experience: 7 },
  { id: "D007", name: "Dr. Deepak Joshi", specialization: "Oncology", hospital: "H003", hospitalName: "National Medical Center", experience: 11 },
  { id: "D008", name: "Dr. Aarti Singh", specialization: "Dermatology", hospital: "H003", hospitalName: "National Medical Center", experience: 6 },
  { id: "D009", name: "Dr. Mohan Das", specialization: "Cardiology", hospital: "H001", hospitalName: "CityCare Hospital", experience: 14 },
];

const networkPatients = [
  { id: "P001", name: "Rohan Das", age: 36, blood: "B+", hospital: "H001", hospitalName: "CityCare Hospital" },
  { id: "P002", name: "Ananya Sen", age: 28, blood: "O+", hospital: "H001", hospitalName: "CityCare Hospital" },
  { id: "P003", name: "Karan Patel", age: 45, blood: "A+", hospital: "H002", hospitalName: "Green Valley Hospital" },
  { id: "P004", name: "Meera Nair", age: 32, blood: "AB+", hospital: "H003", hospitalName: "National Medical Center" },
  { id: "P005", name: "Vikram Reddy", age: 52, blood: "O-", hospital: "H003", hospitalName: "National Medical Center" },
  { id: "P006", name: "Sneha Kulkarni", age: 41, blood: "A-", hospital: "H002", hospitalName: "Green Valley Hospital" },
  { id: "P007", name: "Arjun Nambiar", age: 58, blood: "B-", hospital: "H003", hospitalName: "National Medical Center" },
  { id: "P008", name: "Priya Deshmukh", age: 23, blood: "AB-", hospital: "H001", hospitalName: "CityCare Hospital" },
  { id: "P009", name: "Rajesh Gupta", age: 47, blood: "A+", hospital: "H002", hospitalName: "Green Valley Hospital" },
  { id: "P010", name: "Lakshmi Menon", age: 39, blood: "O+", hospital: "H001", hospitalName: "CityCare Hospital" },
  { id: "P011", name: "Sanjay Pillai", age: 63, blood: "B+", hospital: "H003", hospitalName: "National Medical Center" },
  { id: "P012", name: "Nandini Rao", age: 29, blood: "A+", hospital: "H003", hospitalName: "National Medical Center" },
  { id: "P013", name: "Amit Chopra", age: 44, blood: "O+", hospital: "H003", hospitalName: "National Medical Center" },
];

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

  const totalDoctors = networkHospitals.reduce((s, h) => s + h.doctors, 0);
  const totalPatients = networkHospitals.reduce((s, h) => s + h.patients, 0);
  const totalRecords = networkHospitals.reduce((s, h) => s + h.records, 0);
  const avgAccuracy = (networkHospitals.reduce((s, h) => s + parseFloat(h.accuracy), 0) / networkHospitals.length).toFixed(1);

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
