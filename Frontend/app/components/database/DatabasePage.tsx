"use client";

import { useState, useRef } from "react";
import { useToast } from "@/app/context/ToastContext";

/* ──────── Types ──────── */
interface Hospital {
  id: string;
  name: string;
  location: string;
  type: string;
}

interface Patient {
  id: string;
  name: string;
  gender: string;
  blood: string;
  hospital: string;
}

interface MedRecord {
  id: string;
  patient: string;
  diagnosis: string;
  doctor: string;
}

interface MLUpdate {
  id: string;
  hospital: string;
  round: string;
  accuracy: string;
  hash: string;
}

/* ──────── Initial Data ──────── */
const initialHospitals: Hospital[] = [
  { id: "H001", name: "CityCare Hospital", location: "Chennai", type: "Private" },
  { id: "H002", name: "Green Valley Hospital", location: "Bangalore", type: "Private" },
  { id: "H003", name: "National Medical Center", location: "Delhi", type: "Government" },
];

const initialPatients: Patient[] = [
  { id: "P001", name: "Rohan Das", gender: "Male", blood: "B+", hospital: "H001" },
  { id: "P002", name: "Ananya Sen", gender: "Female", blood: "O+", hospital: "H001" },
  { id: "P003", name: "Karan Patel", gender: "Male", blood: "A+", hospital: "H002" },
  { id: "P004", name: "Meera Nair", gender: "Female", blood: "AB+", hospital: "H003" },
];

const initialRecords: MedRecord[] = [
  { id: "R001", patient: "Rohan Das", diagnosis: "Hypertension", doctor: "Dr. Arjun Mehta" },
  { id: "R002", patient: "Ananya Sen", diagnosis: "Type 2 Diabetes", doctor: "Dr. Priya Sharma" },
  { id: "R003", patient: "Karan Patel", diagnosis: "Viral Fever", doctor: "Dr. Rahul Verma" },
  { id: "R004", patient: "Meera Nair", diagnosis: "Migraine", doctor: "Dr. Neha Kapoor" },
];

const initialUpdates: MLUpdate[] = [
  { id: "U001", hospital: "H001", round: "TR001", accuracy: "89%", hash: "hash_abc123" },
  { id: "U002", hospital: "H002", round: "TR001", accuracy: "87%", hash: "hash_def456" },
  { id: "U003", hospital: "H003", round: "TR002", accuracy: "91%", hash: "hash_xyz789" },
];

const presets = [
  `SELECT mr.diagnosis,\n  COUNT(*) as cases,\n  COUNT(DISTINCT p.hospital_id) as hospitals,\n  AVG(EXTRACT(YEAR FROM AGE(p.date_of_birth))) as avg_age\nFROM medical_record mr\nJOIN patient p ON mr.patient_id = p.patient_id\nGROUP BY mr.diagnosis\nHAVING COUNT(*) > 1\nORDER BY cases DESC;`,
  `SELECT h.hospital_name,\n  COUNT(mu.update_id) as updates,\n  AVG(mu.accuracy)*100 as avg_acc,\n  AVG(cs.reputation_score) as reputation\nFROM hospital h\nJOIN model_update mu ON h.hospital_id = mu.hospital_id\nJOIN contribution_score cs ON h.hospital_id = cs.hospital_id\nGROUP BY h.hospital_name\nORDER BY avg_acc DESC;`,
];

const fakeResults = [
  { headers: ["diagnosis", "cases", "hospitals", "avg_age"], rows: [["Hypertension", "7", "3", "58.7"], ["Type 2 Diabetes", "8", "3", "52.3"], ["Migraine", "4", "2", "34.2"]] },
  { headers: ["hospital", "updates", "avg_acc", "reputation"], rows: [["Metro General", "4", "91.2%", "0.85"], ["CityCare Hospital", "4", "89.3%", "0.80"], ["Green Valley", "4", "87.1%", "0.75"]] },
  { headers: ["hospital", "patients", "avg_accuracy"], rows: [["Metro General", "1102", "91.0%"], ["CityCare Hospital", "847", "89.0%"], ["Green Valley", "623", "87.0%"]] },
];

/* ──────── Inner Tab Component ──────── */
function InnerTabs({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: string[];
  activeTab: number;
  onTabChange: (i: number) => void;
}) {
  return (
    <div className="flex" style={{ borderBottom: "none", gap: 0 }}>
      {tabs.map((label, i) => (
        <button
          key={i}
          onClick={() => onTabChange(i)}
          className={`px-5 py-3 font-mono text-[11px] cursor-pointer uppercase tracking-wider transition-all duration-200 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 ${
            activeTab === i
              ? "text-primary border-b-primary"
              : "text-muted border-b-transparent hover:text-text-primary"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ──────── Badge Component ──────── */
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

/* ──────── Schema Visual ──────── */
function SchemaVisual() {
  return (
    <div className="relative h-[420px]">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 420 420" preserveAspectRatio="none">
        <line x1="160" y1="55" x2="75" y2="120" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="200" y1="60" x2="210" y2="120" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="240" y1="55" x2="340" y2="120" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="195" y1="160" x2="155" y2="235" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="350" y1="160" x2="280" y2="235" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="155" y1="270" x2="195" y2="355" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="355" y1="265" x2="270" y2="355" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="255" y1="370" x2="330" y2="370" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 3" />
      </svg>

      <div className="schema-node n-hospital">
        <div className="font-bold text-xs mb-1.5 text-primary">Hospital</div>
        <div className="text-muted text-[10px] leading-[1.8]"><span className="text-cyan">PK</span> hospital_id</div>
        <div className="text-muted text-[10px] leading-[1.8]">hospital_name</div>
        <div className="text-muted text-[10px] leading-[1.8]">hospital_type</div>
      </div>

      <div className="schema-node n-doctor">
        <div className="font-bold text-xs mb-1.5">Doctor</div>
        <div className="text-muted text-[10px] leading-[1.8]"><span className="text-cyan">PK</span> doctor_id</div>
        <div className="text-muted text-[10px] leading-[1.8]"><span className="text-amber">FK</span> hospital_id</div>
        <div className="text-muted text-[10px] leading-[1.8]">specialization</div>
      </div>

      <div className="schema-node n-patient">
        <div className="font-bold text-xs mb-1.5">Patient</div>
        <div className="text-muted text-[10px] leading-[1.8]"><span className="text-cyan">PK</span> patient_id</div>
        <div className="text-muted text-[10px] leading-[1.8]"><span className="text-amber">FK</span> hospital_id</div>
        <div className="text-muted text-[10px] leading-[1.8]">blood_group</div>
      </div>

      <div className="schema-node n-contrib">
        <div className="font-bold text-xs mb-1.5 text-amber">Contribution</div>
        <div className="text-muted text-[10px] leading-[1.8]"><span className="text-cyan">PK</span> contrib_id</div>
        <div className="text-muted text-[10px] leading-[1.8]"><span className="text-amber">FK</span> hospital_id</div>
        <div className="text-muted text-[10px] leading-[1.8]">reputation_score</div>
      </div>

      <div className="schema-node n-medrec">
        <div className="font-bold text-xs mb-1.5">Medical_Record</div>
        <div className="text-muted text-[10px] leading-[1.8]"><span className="text-cyan">PK</span> record_id</div>
        <div className="text-muted text-[10px] leading-[1.8]">diagnosis</div>
        <div className="text-muted text-[10px] leading-[1.8]">symptoms</div>
      </div>

      <div className="schema-node n-mlmodel">
        <div className="font-bold text-xs mb-1.5 text-neon-green">ML_Model</div>
        <div className="text-muted text-[10px] leading-[1.8]"><span className="text-cyan">PK</span> model_id</div>
        <div className="text-muted text-[10px] leading-[1.8]">algorithm_type</div>
        <div className="text-muted text-[10px] leading-[1.8]">model_version</div>
      </div>

      <div className="schema-node n-update">
        <div className="font-bold text-xs mb-1.5 text-amber">Model_Update</div>
        <div className="text-muted text-[10px] leading-[1.8]"><span className="text-cyan">PK</span> update_id</div>
        <div className="text-muted text-[10px] leading-[1.8]">model_hash</div>
        <div className="text-muted text-[10px] leading-[1.8]">accuracy / loss</div>
      </div>

      <div className="schema-node n-blockchain">
        <div className="font-bold text-xs mb-1.5 text-coral">Blockchain</div>
        <div className="text-muted text-[10px] leading-[1.8]"><span className="text-cyan">PK</span> verify_id</div>
        <div className="text-muted text-[10px] leading-[1.8]">tx_hash</div>
        <div className="text-muted text-[10px] leading-[1.8]">block_number</div>
      </div>
    </div>
  );
}

/* ══════════════════════════ MAIN DATABASE PAGE ══════════════════════════ */
export default function DatabasePage() {
  const { showToast } = useToast();

  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [records, setRecords] = useState<MedRecord[]>(initialRecords);
  const [updates] = useState<MLUpdate[]>(initialUpdates);

  const [formTab, setFormTab] = useState(0);
  const [tableTab, setTableTab] = useState(0);

  // Form refs
  const hNameRef = useRef<HTMLInputElement>(null);
  const hLocRef = useRef<HTMLInputElement>(null);
  const hTypeRef = useRef<HTMLSelectElement>(null);
  const hEmailRef = useRef<HTMLInputElement>(null);
  const pNameRef = useRef<HTMLInputElement>(null);
  const pGenderRef = useRef<HTMLSelectElement>(null);
  const pBloodRef = useRef<HTMLSelectElement>(null);
  const pHospRef = useRef<HTMLSelectElement>(null);
  const rPatientRef = useRef<HTMLSelectElement>(null);
  const rDiagRef = useRef<HTMLInputElement>(null);
  const rSympRef = useRef<HTMLInputElement>(null);
  const rMedsRef = useRef<HTMLInputElement>(null);

  const [sqlQuery, setSqlQuery] = useState(
    `SELECT h.hospital_name, COUNT(p.patient_id) as patients,\nAVG(mu.accuracy)*100 as avg_accuracy\nFROM hospital h\nLEFT JOIN patient p ON h.hospital_id = p.hospital_id\nLEFT JOIN model_update mu ON h.hospital_id = mu.hospital_id\nGROUP BY h.hospital_name\nORDER BY avg_accuracy DESC;`
  );
  const [queryResult, setQueryResult] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [queryRunning, setQueryRunning] = useState(false);

  /* ── Actions ── */
  function registerHospital() {
    const name = hNameRef.current?.value.trim();
    if (!name) { showToast("Error", "Hospital name required", "var(--color-coral)"); return; }
    const loc = hLocRef.current?.value || "Unknown";
    const type = hTypeRef.current?.value || "Private";
    const id = `H00${hospitals.length + 1}`;
    setHospitals((prev) => [...prev, { id, name, location: loc, type }]);
    if (hNameRef.current) hNameRef.current.value = "";
    if (hLocRef.current) hLocRef.current.value = "";
    showToast("Hospital Registered", `${name} added as ${id}`);
  }

  function addPatient() {
    const name = pNameRef.current?.value.trim();
    if (!name) { showToast("Error", "Patient name required", "var(--color-coral)"); return; }
    const id = `P00${patients.length + 1}`;
    const gender = pGenderRef.current?.value || "Male";
    const blood = pBloodRef.current?.value || "A+";
    const hosp = pHospRef.current?.value.split(" ")[0] || "H001";
    setPatients((prev) => [...prev, { id, name, gender, blood, hospital: hosp }]);
    if (pNameRef.current) pNameRef.current.value = "";
    setTableTab(1);
    showToast("Patient Added", `${name} registered as ${id}`);
  }

  function addRecord() {
    const diag = rDiagRef.current?.value.trim();
    if (!diag) { showToast("Error", "Diagnosis required", "var(--color-coral)"); return; }
    const id = `R00${records.length + 1}`;
    const patient = rPatientRef.current?.value.split("—")[1]?.trim() || "Unknown";
    setRecords((prev) => [...prev, { id, patient, diagnosis: diag, doctor: "Dr. Auto-Assign" }]);
    if (rDiagRef.current) rDiagRef.current.value = "";
    if (rSympRef.current) rSympRef.current.value = "";
    if (rMedsRef.current) rMedsRef.current.value = "";
    showToast("Record Saved", `Medical record ${id} created for ${patient}`);
  }

  function runQuery() {
    setQueryRunning(true);
    setQueryResult(null);
    setTimeout(() => {
      setQueryResult(fakeResults[Math.floor(Math.random() * fakeResults.length)]);
      setQueryRunning(false);
      showToast("Query Complete", "Results returned successfully");
    }, 600);
  }

  const inputClass = "w-full bg-surface-2 border border-border-2 rounded-lg px-3.5 py-2.5 text-text-primary font-sans text-sm outline-none transition-colors focus:border-cyan-2 focus:shadow-[0_0_0_3px_var(--color-cyan-dim)] placeholder:text-muted-2";

  return (
    <div className="page-section">
      {/* ── Hero ── */}
      <div className="grid grid-cols-2 gap-[60px] items-center px-[60px] pt-[60px] pb-10">
        <div>
          <h1 className="text-[52px] font-extrabold leading-[1.1] tracking-[-2px] mb-4">
            Hospital<br />
            <em className="not-italic text-primary">Database</em><br />
            Registry
          </h1>
          <p className="text-muted text-base max-w-[420px] mb-8 leading-[1.7]">
            Manage hospitals, doctors, patients, and medical records. All data stays local — never shared across the network.
          </p>
          <div className="flex gap-6 mb-8">
            {[
              { val: hospitals.length, label: "hospitals" },
              { val: patients.length, label: "patients" },
              { val: records.length, label: "records" },
              { val: 4, label: "doctors" },
            ].map((s) => (
              <div key={s.label} className="bg-surface-2 border border-border-custom rounded-xl px-5 py-3.5">
                <div className="text-[28px] font-extrabold text-primary font-mono leading-none">{s.val}</div>
                <div className="text-[11px] text-muted font-mono mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <SchemaVisual />
      </div>

      {/* ── Content Panels ── */}
      <div className="grid grid-cols-2 gap-6 px-[60px] pb-[60px]">
        {/* Registration Panel */}
        <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border-custom">
            <InnerTabs
              tabs={["Register Hospital", "Add Patient", "Add Record"]}
              activeTab={formTab}
              onTabChange={setFormTab}
            />
          </div>

          {/* Hospital Form */}
          {formTab === 0 && (
            <div className="p-5">
              <div className="mb-3.5">
                <label className="block text-xs font-mono text-muted mb-1.5">hospital name</label>
                <input ref={hNameRef} className={inputClass} type="text" placeholder="e.g. City Care Hospital" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="mb-3.5">
                  <label className="block text-xs font-mono text-muted mb-1.5">location</label>
                  <input ref={hLocRef} className={inputClass} type="text" placeholder="Chennai" />
                </div>
                <div className="mb-3.5">
                  <label className="block text-xs font-mono text-muted mb-1.5">type</label>
                  <select ref={hTypeRef} className={inputClass}>
                    <option>Private</option>
                    <option>Government</option>
                    <option>Teaching</option>
                  </select>
                </div>
              </div>
              <div className="mb-3.5">
                <label className="block text-xs font-mono text-muted mb-1.5">contact email</label>
                <input ref={hEmailRef} className={inputClass} type="email" placeholder="admin@hospital.com" />
              </div>
              <button onClick={registerHospital} className="px-6 py-2.5 rounded-lg font-mono text-xs cursor-pointer border-none bg-primary text-white font-bold transition-all hover:bg-primary-dark hover:-translate-y-px tracking-wider shadow-sm">
                Register Hospital →
              </button>
            </div>
          )}

          {/* Patient Form */}
          {formTab === 1 && (
            <div className="p-5">
              <div className="mb-3.5">
                <label className="block text-xs font-mono text-muted mb-1.5">patient name</label>
                <input ref={pNameRef} className={inputClass} type="text" placeholder="Full name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="mb-3.5">
                  <label className="block text-xs font-mono text-muted mb-1.5">gender</label>
                  <select ref={pGenderRef} className={inputClass}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="mb-3.5">
                  <label className="block text-xs font-mono text-muted mb-1.5">blood group</label>
                  <select ref={pBloodRef} className={inputClass}>
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                  </select>
                </div>
              </div>
              <div className="mb-3.5">
                <label className="block text-xs font-mono text-muted mb-1.5">hospital</label>
                <select ref={pHospRef} className={inputClass}>
                  <option>H001 — CityCare Hospital</option>
                  <option>H002 — Green Valley Hospital</option>
                  <option>H003 — National Medical Center</option>
                </select>
              </div>
              <button onClick={addPatient} className="px-6 py-2.5 rounded-lg font-mono text-xs cursor-pointer border-none bg-neon-green text-white font-bold transition-all hover:opacity-90 hover:-translate-y-px tracking-wider shadow-sm">
                Add Patient →
              </button>
            </div>
          )}

          {/* Record Form */}
          {formTab === 2 && (
            <div className="p-5">
              <div className="mb-3.5">
                <label className="block text-xs font-mono text-muted mb-1.5">patient ID</label>
                <select ref={rPatientRef} className={inputClass}>
                  <option>P001 — Rohan Das</option>
                  <option>P002 — Ananya Sen</option>
                  <option>P003 — Karan Patel</option>
                  <option>P004 — Meera Nair</option>
                </select>
              </div>
              <div className="mb-3.5">
                <label className="block text-xs font-mono text-muted mb-1.5">diagnosis</label>
                <input ref={rDiagRef} className={inputClass} type="text" placeholder="e.g. Hypertension" />
              </div>
              <div className="mb-3.5">
                <label className="block text-xs font-mono text-muted mb-1.5">symptoms</label>
                <input ref={rSympRef} className={inputClass} type="text" placeholder="e.g. Headache, dizziness" />
              </div>
              <div className="mb-3.5">
                <label className="block text-xs font-mono text-muted mb-1.5">prescribe medication</label>
                <input ref={rMedsRef} className={inputClass} type="text" placeholder="e.g. Amlodipine 5mg" />
              </div>
              <button onClick={addRecord} className="px-6 py-2.5 rounded-lg font-mono text-xs cursor-pointer border-none bg-amber text-white font-bold transition-all hover:opacity-90 hover:-translate-y-px tracking-wider shadow-sm">
                Save Record →
              </button>
            </div>
          )}
        </div>

        {/* Data Tables Panel */}
        <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border-custom">
            <InnerTabs
              tabs={["Hospitals", "Patients", "Records", "ML Updates"]}
              activeTab={tableTab}
              onTabChange={setTableTab}
            />
          </div>

          <div className="overflow-x-auto pb-1">
            {tableTab === 0 && (
              <table className="db-table">
                <thead><tr><th>ID</th><th>Name</th><th>Location</th><th>Type</th><th>Status</th></tr></thead>
                <tbody>
                  {hospitals.map((h) => (
                    <tr key={h.id}>
                      <td><Badge variant="cyan">{h.id}</Badge></td>
                      <td>{h.name}</td><td>{h.location}</td><td>{h.type}</td>
                      <td><Badge variant="green">Active</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {tableTab === 1 && (
              <table className="db-table">
                <thead><tr><th>ID</th><th>Name</th><th>Gender</th><th>Blood</th><th>Hospital</th></tr></thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.id}>
                      <td><Badge variant="amber">{p.id}</Badge></td>
                      <td>{p.name}</td><td>{p.gender}</td><td>{p.blood}</td><td>{p.hospital}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {tableTab === 2 && (
              <table className="db-table">
                <thead><tr><th>ID</th><th>Patient</th><th>Diagnosis</th><th>Doctor</th></tr></thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id}>
                      <td><Badge variant="blue">{r.id}</Badge></td>
                      <td>{r.patient}</td><td>{r.diagnosis}</td><td>{r.doctor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {tableTab === 3 && (
              <table className="db-table">
                <thead><tr><th>Update ID</th><th>Hospital</th><th>Round</th><th>Accuracy</th><th>Hash</th></tr></thead>
                <tbody>
                  {updates.map((u) => (
                    <tr key={u.id}>
                      <td><Badge variant="coral">{u.id}</Badge></td>
                      <td>{u.hospital}</td><td>{u.round}</td><td>{u.accuracy}</td>
                      <td className="font-mono text-[10px] text-neon-green">{u.hash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* SQL Query Runner */}
        <div className="col-span-2 bg-surface border border-border-custom rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-custom">
            <div className="font-mono text-[11px] text-muted uppercase tracking-widest">SQL Query Runner</div>
            <div className="flex gap-2">
              <Badge variant="green">PostgreSQL 15</Badge>
              <Badge variant="cyan">flockchain_hospital_db</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 p-5">
            <div>
              <label className="block text-xs font-mono text-muted mb-2">query editor</label>
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="w-full font-mono text-xs bg-surface-2 border border-border-2 rounded-lg p-3.5 text-text-primary min-h-[90px] resize-y outline-none leading-[1.7]"
              />
              <div className="flex gap-2 mt-2.5">
                <button onClick={runQuery} className="px-6 py-2.5 rounded-lg font-mono text-xs cursor-pointer border-none bg-primary text-white font-bold transition-all hover:bg-primary-dark hover:-translate-y-px tracking-wider shadow-sm">
                  Run Query ▶
                </button>
                <button onClick={() => setSqlQuery(presets[0])} className="px-5 py-2.5 rounded-lg font-mono text-xs cursor-pointer bg-transparent text-primary border border-primary/30 transition-all hover:bg-primary-light tracking-wider">
                  Disease Prevalence
                </button>
                <button onClick={() => setSqlQuery(presets[1])} className="px-5 py-2.5 rounded-lg font-mono text-xs cursor-pointer bg-transparent text-primary border border-primary/30 transition-all hover:bg-primary-light tracking-wider">
                  FL Contributions
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-muted mb-2">results</label>
              <div className="bg-surface-2 border border-border-2 rounded-lg p-3.5 min-h-[130px] font-mono text-[11px] text-muted overflow-x-auto">
                {queryRunning ? (
                  <span className="text-primary">Executing query...</span>
                ) : queryResult ? (
                  <table className="db-table">
                    <thead>
                      <tr>{queryResult.headers.map((h) => <th key={h}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {queryResult.rows.map((row, i) => (
                        <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <span className="text-muted-2">{"// Press Run Query to execute..."}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
