"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "@/app/context/ToastContext";
import { useHospital } from "@/app/context/HospitalContext";
import { apiFetch } from "@/app/lib/api";

/* ──────── Types ──────── */
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  phone: string;
  status: "Active" | "On Leave";
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  blood: string;
  phone: string;
  registeredAt: string;
}

interface Medicine {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  stock: number;
  unit: string;
}

interface MedRecord {
  id: string;
  patientName: string;
  doctorName: string;
  diagnosis: string;
  symptoms: string;
  medication: string;
  dosage: string;
  date: string;
}

/* ──────── Initial Data (Removing Mocks, starting empty) ──────── */

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

/* ──────── SQL Presets ──────── */
const presets = [
  { label: "Patient Stats", query: `SELECT p.patient_name, p.blood_group,\n  COUNT(mr.record_id) as total_visits,\n  MAX(mr.visit_date) as last_visit\nFROM patient p\nLEFT JOIN medical_record mr\n  ON p.patient_id = mr.patient_id\nWHERE p.hospital_id = 'H001'\nGROUP BY p.patient_name, p.blood_group\nORDER BY total_visits DESC;` },
  { label: "Doctor Workload", query: `SELECT d.doctor_name, d.specialization,\n  COUNT(DISTINCT mr.patient_id) as patients,\n  COUNT(mr.record_id) as total_records\nFROM doctor d\nLEFT JOIN medical_record mr\n  ON d.doctor_id = mr.doctor_id\nGROUP BY d.doctor_name, d.specialization\nORDER BY patients DESC;` },
  { label: "Medicine Usage", query: `SELECT m.medicine_name, m.category,\n  COUNT(mr.record_id) as prescriptions,\n  m.stock_quantity as remaining_stock\nFROM medicine m\nLEFT JOIN medical_record mr\n  ON mr.medication LIKE '%' || m.medicine_name || '%'\nGROUP BY m.medicine_name, m.category, m.stock_quantity\nORDER BY prescriptions DESC;` },
  { label: "Diagnosis Report", query: `SELECT mr.diagnosis,\n  COUNT(*) as total_cases,\n  COUNT(DISTINCT mr.patient_id) as unique_patients,\n  COUNT(DISTINCT mr.doctor_id) as doctors_involved\nFROM medical_record mr\nWHERE mr.hospital_id = 'H001'\nGROUP BY mr.diagnosis\nHAVING COUNT(*) >= 1\nORDER BY total_cases DESC;` },
];

const fakeResults = [
  { headers: ["patient", "blood_group", "visits", "last_visit"], rows: [["Rohan Das", "B+", "3", "2026-03-10"], ["Ananya Sen", "O+", "2", "2026-03-12"], ["Karan Patel", "A+", "1", "2026-03-18"], ["Meera Nair", "AB+", "1", "2026-03-25"]] },
  { headers: ["doctor", "specialization", "patients", "records"], rows: [["Dr. Arjun Mehta", "Cardiology", "2", "2"], ["Dr. Priya Sharma", "Endocrinology", "1", "1"], ["Dr. Rahul Verma", "General Med", "1", "1"]] },
  { headers: ["medicine", "category", "prescriptions", "stock"], rows: [["Amlodipine", "Antihypertensive", "1", "500"], ["Metformin", "Antidiabetic", "1", "350"], ["Paracetamol", "Analgesic", "1", "1200"]] },
  { headers: ["diagnosis", "cases", "patients", "doctors"], rows: [["Hypertension", "3", "2", "1"], ["Type 2 Diabetes", "2", "2", "1"], ["Migraine", "2", "1", "1"], ["Viral Fever", "1", "1", "1"]] },
];

/* ══════════════════════════ DATABASE PAGE ══════════════════════════ */
export default function DatabasePage() {
  const { showToast } = useToast();
  const { hospital } = useHospital();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [records, setRecords] = useState<MedRecord[]>([]);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [dRes, pRes, mRes, rRes] = await Promise.all([
        apiFetch("/doctors/"),
        apiFetch("/patients/"),
        apiFetch("/medicines/"),
        apiFetch("/records/")
      ]);
      
      setDoctors(dRes.map((d: any) => ({
        id: d.doctor_id,
        name: d.doctor_name,
        specialization: d.specialization || "General",
        experience: d.experience_years || 0,
        phone: d.contact_number || "—",
        status: d.status || "Active"
      })));

      setPatients(pRes.map((p: any) => ({
        id: p.patient_id,
        name: p.patient_name,
        age: 30, // Default if date_of_birth is missing or to simplify
        gender: p.gender || "Unknown",
        blood: p.blood_group || "Unknown",
        phone: p.contact_phone || "—",
        registeredAt: p.registration_date ? p.registration_date.split("T")[0] : "—"
      })));

      setMedicines(mRes.map((m: any) => ({
        id: m.medicine_id,
        name: m.medicine_name,
        category: m.category || "General",
        manufacturer: m.manufacturer || "Unknown",
        stock: m.stock || 0,
        unit: m.unit || "N/A"
      })));

      setRecords(rRes.map((r: any) => ({
        id: r.record_id,
        patientName: r.patient_id, // Would be joined name ideally
        doctorName: r.doctor_id,   // Would be joined name ideally
        diagnosis: r.diagnosis || "—",
        symptoms: r.symptoms || "—",
        medication: "—",
        dosage: "—",
        date: r.visit_date ? r.visit_date.split("T")[0] : "—"
      })));
    } catch (err) {
      console.error(err);
      showToast("Failed to load dashboard data.", "error");
    }
  };

  useEffect(() => {
    if (hospital) {
      fetchData();
    }
  }, [hospital]);

  const [activeSection, setActiveSection] = useState<"overview" | "doctors" | "patients" | "medicines" | "records" | "sql">("overview");

  /* ── Form states (Doctor) ── */
  const [dName, setDName] = useState("");
  const [dSpec, setDSpec] = useState("Cardiology");
  const [dExp, setDExp] = useState("");
  const [dPhone, setDPhone] = useState("");

  /* ── Form states (Patient) ── */
  const [pName, setPName] = useState("");
  const [pAge, setPAge] = useState("");
  const [pGender, setPGender] = useState("Male");
  const [pBlood, setPBlood] = useState("A+");
  const [pPhone, setPPhone] = useState("");

  /* ── Form states (Medicine) ── */
  const [mName, setMName] = useState("");
  const [mCategory, setMCategory] = useState("");
  const [mManuf, setMManuf] = useState("");
  const [mStock, setMStock] = useState("");
  const [mUnit, setMUnit] = useState("");

  /* ── Form states (Record) ── */
  const [rPatient, setRPatient] = useState("");
  const [rDoctor, setRDoctor] = useState("");
  const [rDiag, setRDiag] = useState("");
  const [rSymp, setRSymp] = useState("");
  const [rMed, setRMed] = useState("");
  const [rDose, setRDose] = useState("");

  /* ── SQL ── */
  const [sqlQuery, setSqlQuery] = useState(presets[0].query);
  const [queryResult, setQueryResult] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [queryRunning, setQueryRunning] = useState(false);

  const inputClass = "w-full bg-surface-2 border border-border-2 rounded-lg px-3.5 py-2.5 text-text-primary font-sans text-sm outline-none transition-colors focus:border-cyan-2 focus:shadow-[0_0_0_3px_var(--color-cyan-dim)] placeholder:text-muted-2";

  /* ── Actions ── */
  async function addDoctor(e: React.FormEvent) {
    e.preventDefault();
    if (!dName.trim()) { showToast("Error", "Doctor name is required", "var(--color-coral)"); return; }
    
    try {
      const res = await apiFetch("/doctors/", {
        method: "POST",
        body: JSON.stringify({
          doctor_name: dName.trim(),
          specialization: dSpec,
          experience_years: parseInt(dExp) || 0,
          contact_number: dPhone || undefined,
          status: "Active"
        })
      });
      
      setDoctors((prev) => [...prev, {
        id: res.doctor_id, name: res.doctor_name, specialization: res.specialization || "General",
        experience: res.experience_years || 0, phone: res.contact_number || "—", status: "Active",
      }]);
      setDName(""); setDExp(""); setDPhone("");
      showToast("Doctor Registered", `${res.doctor_name} added successfully`);
    } catch (err: any) {
      showToast("Error", err.message || "Failed to add doctor", "var(--color-coral)");
    }
  }

  async function addPatient(e: React.FormEvent) {
    e.preventDefault();
    if (!pName.trim()) { showToast("Error", "Patient name is required", "var(--color-coral)"); return; }
    
    try {
      const res = await apiFetch("/patients/", {
        method: "POST",
        body: JSON.stringify({
          patient_name: pName.trim(),
          gender: pGender,
          blood_group: pBlood,
          contact_phone: pPhone || undefined,
        })
      });
      
      setPatients((prev) => [...prev, {
        id: res.patient_id, name: res.patient_name, age: 30, gender: res.gender || "Unknown",
        blood: res.blood_group || "Unknown", phone: res.contact_phone || "—",
        registeredAt: new Date().toISOString().split("T")[0],
      }]);
      setPName(""); setPAge(""); setPPhone("");
      showToast("Patient Registered", `${res.patient_name} added successfully`);
    } catch (err: any) {
      showToast("Error", err.message || "Failed to add patient", "var(--color-coral)");
    }
  }

  async function addMedicine(e: React.FormEvent) {
    e.preventDefault();
    if (!mName.trim()) { showToast("Error", "Medicine name is required", "var(--color-coral)"); return; }
    
    try {
      const res = await apiFetch("/medicines/", {
        method: "POST",
        body: JSON.stringify({
          medicine_name: mName.trim(),
          category: mCategory || "General",
          manufacturer: mManuf || "Unknown",
          stock: parseInt(mStock) || 0,
          unit: mUnit || "units"
        })
      });
      
      setMedicines((prev) => [...prev, {
        id: res.medicine_id, name: res.medicine_name, category: res.category || "General",
        manufacturer: res.manufacturer || "Unknown", stock: res.stock || 0, unit: res.unit || "N/A",
      }]);
      setMName(""); setMCategory(""); setMManuf(""); setMStock(""); setMUnit("");
      showToast("Medicine Added", `${res.medicine_name} added to inventory`);
    } catch (err: any) {
      showToast("Error", err.message || "Failed to add medicine", "var(--color-coral)");
    }
  }

  async function addRecord(e: React.FormEvent) {
    e.preventDefault();
    if (!rDiag.trim()) { showToast("Error", "Diagnosis is required", "var(--color-coral)"); return; }
    
    try {
      const patientId = rPatient || (patients[0]?.id || "");
      const doctorId = rDoctor || (doctors[0]?.id || "");
      
      // Setup prescriptions if provided
      const prescriptions = rMed && rDose ? [{ medication_name: rMed, dosage: rDose }] : [];
      
      const res = await apiFetch("/records/", {
        method: "POST",
        body: JSON.stringify({
          patient_id: patientId,
          doctor_id: doctorId,
          diagnosis: rDiag.trim(),
          symptoms: rSymp || undefined,
          prescriptions: prescriptions
        })
      });
      
      const pName = patients.find((p) => p.id === patientId)?.name || "Unknown";
      const dName = doctors.find((d) => d.id === doctorId)?.name || "Unknown";
      
      setRecords((prev) => [...prev, {
        id: res.record_id, patientName: pName, doctorName: dName, diagnosis: res.diagnosis || "—",
        symptoms: res.symptoms || "—", medication: rMed || "—", dosage: rDose || "—",
        date: new Date().toISOString().split("T")[0],
      }]);
      setRDiag(""); setRSymp(""); setRMed(""); setRDose("");
      showToast("Record Created", `Medical record created for ${pName}`);
    } catch (err: any) {
      showToast("Error", err.message || "Failed to add record", "var(--color-coral)");
    }
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

  const hospName = hospital?.name || "Hospital Dashboard";
  const hospId = hospital?.id || "H001";

  /* ── Navigation Items ── */
  const navItems = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "doctors", label: "Doctors", icon: "👨‍⚕️", count: doctors.length },
    { key: "patients", label: "Patients", icon: "🧑‍🤝‍🧑", count: patients.length },
    { key: "medicines", label: "Medicines", icon: "💊", count: medicines.length },
    { key: "records", label: "Medical Records", icon: "📋", count: records.length },
    { key: "sql", label: "SQL Terminal", icon: "💻" },
  ];

  return (
    <div className="page-section">
      {/* ── Hospital Header ── */}
      <div className="px-[60px] pt-[50px] pb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-light border border-primary/20 flex items-center justify-center text-2xl">
            🏥
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="text-primary">{hospName}</span> Dashboard
            </h1>
            <p className="text-muted text-sm font-mono">
              {hospId} · {hospital?.location || "Chennai"} · {hospital?.type || "Private"} · Registered: {hospital?.registeredAt || "2026-01-15"}
            </p>
          </div>
        </div>

        {/* ── Section Navigation ── */}
        <div className="flex gap-1.5 bg-surface-2 border border-border-custom rounded-xl p-1.5 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key as typeof activeSection)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs cursor-pointer border transition-all duration-200 tracking-wide whitespace-nowrap ${
                activeSection === item.key
                  ? "bg-primary-light text-primary border-primary/20 font-semibold"
                  : "bg-transparent text-muted border-transparent hover:text-text-primary hover:bg-surface-3"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
              {item.count !== undefined && (
                <span className={`px-1.5 py-0 rounded font-mono text-[9px] ${
                  activeSection === item.key
                    ? "bg-primary/10 text-primary"
                    : "bg-surface-3 text-muted"
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ══════ OVERVIEW ══════ */}
      {activeSection === "overview" && (
        <div className="px-[60px] pb-[60px]">
          {/* Stats cards */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            {[
              { val: doctors.length, label: "Doctors", icon: "👨‍⚕️", color: "text-primary", bg: "bg-primary-light", onClick: () => setActiveSection("doctors") },
              { val: patients.length, label: "Patients", icon: "🧑‍🤝‍🧑", color: "text-neon-green", bg: "bg-green-light", onClick: () => setActiveSection("patients") },
              { val: medicines.length, label: "Medicines", icon: "💊", color: "text-amber", bg: "bg-amber-light", onClick: () => setActiveSection("medicines") },
              { val: records.length, label: "Records", icon: "📋", color: "text-neon-blue", bg: "bg-blue-light", onClick: () => setActiveSection("records") },
            ].map((card) => (
              <button
                key={card.label}
                onClick={card.onClick}
                className="bg-surface border border-border-custom rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center text-xl`}>{card.icon}</div>
                  <span className="text-muted text-lg">→</span>
                </div>
                <div className={`text-3xl font-extrabold font-mono ${card.color}`}>{card.val}</div>
                <div className="text-xs text-muted font-mono mt-1">{card.label}</div>
              </button>
            ))}
          </div>

          {/* Recent Records */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom flex items-center justify-between">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Recent Medical Records</div>
                <button onClick={() => setActiveSection("records")} className="font-mono text-[10px] text-primary cursor-pointer bg-transparent border-none hover:underline">View All →</button>
              </div>
              <div className="p-0">
                {records.slice(-4).reverse().map((r) => (
                  <div key={r.id} className="flex items-center gap-3 px-5 py-3 border-b border-border-custom last:border-b-0 hover:bg-surface-2 transition-colors">
                    <Badge variant="blue">{r.id}</Badge>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{r.patientName} — {r.diagnosis}</div>
                      <div className="font-mono text-[10px] text-muted">{r.doctorName} · {r.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom flex items-center justify-between">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Active Doctors</div>
                <button onClick={() => setActiveSection("doctors")} className="font-mono text-[10px] text-primary cursor-pointer bg-transparent border-none hover:underline">Manage →</button>
              </div>
              <div className="p-0">
                {doctors.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 px-5 py-3 border-b border-border-custom last:border-b-0 hover:bg-surface-2 transition-colors">
                    <Badge variant="cyan">{d.id}</Badge>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{d.name}</div>
                      <div className="font-mono text-[10px] text-muted">{d.specialization} · {d.experience} yrs</div>
                    </div>
                    <Badge variant={d.status === "Active" ? "green" : "amber"}>{d.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ DOCTORS ══════ */}
      {activeSection === "doctors" && (
        <div className="px-[60px] pb-[60px]">
          <div className="grid grid-cols-2 gap-6">
            {/* Register form */}
            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Register New Doctor</div>
              </div>
              <form onSubmit={addDoctor} className="p-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-muted mb-1.5">doctor name *</label>
                  <input value={dName} onChange={(e) => setDName(e.target.value)} className={inputClass} placeholder="e.g. Dr. Arjun Mehta" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-muted mb-1.5">specialization</label>
                    <select value={dSpec} onChange={(e) => setDSpec(e.target.value)} className={inputClass}>
                      <option>Cardiology</option><option>Neurology</option><option>Endocrinology</option>
                      <option>General Medicine</option><option>Orthopedics</option><option>Dermatology</option>
                      <option>Pediatrics</option><option>Oncology</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted mb-1.5">experience (years)</label>
                    <input type="number" value={dExp} onChange={(e) => setDExp(e.target.value)} className={inputClass} placeholder="e.g. 10" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted mb-1.5">phone</label>
                  <input type="tel" value={dPhone} onChange={(e) => setDPhone(e.target.value)} className={inputClass} placeholder="+91-XXXXXXXXXX" />
                </div>
                <button type="submit" className="px-6 py-2.5 rounded-lg font-mono text-xs cursor-pointer border-none bg-primary text-white font-bold transition-all hover:bg-primary-dark hover:-translate-y-px tracking-wider shadow-sm">
                  Register Doctor →
                </button>
              </form>
            </div>

            {/* Table */}
            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom flex items-center justify-between">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">All Doctors</div>
                <Badge variant="cyan">{doctors.length} registered</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="db-table">
                  <thead><tr><th>ID</th><th>Name</th><th>Specialization</th><th>Exp</th><th>Status</th></tr></thead>
                  <tbody>
                    {doctors.map((d) => (
                      <tr key={d.id}>
                        <td><Badge variant="cyan">{d.id}</Badge></td>
                        <td>{d.name}</td><td>{d.specialization}</td><td>{d.experience} yrs</td>
                        <td><Badge variant={d.status === "Active" ? "green" : "amber"}>{d.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ PATIENTS ══════ */}
      {activeSection === "patients" && (
        <div className="px-[60px] pb-[60px]">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Register New Patient</div>
              </div>
              <form onSubmit={addPatient} className="p-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-muted mb-1.5">patient name *</label>
                  <input value={pName} onChange={(e) => setPName(e.target.value)} className={inputClass} placeholder="Full name" required />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-muted mb-1.5">age</label>
                    <input type="number" value={pAge} onChange={(e) => setPAge(e.target.value)} className={inputClass} placeholder="e.g. 36" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted mb-1.5">gender</label>
                    <select value={pGender} onChange={(e) => setPGender(e.target.value)} className={inputClass}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted mb-1.5">blood group</label>
                    <select value={pBlood} onChange={(e) => setPBlood(e.target.value)} className={inputClass}>
                      <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                      <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted mb-1.5">phone</label>
                  <input type="tel" value={pPhone} onChange={(e) => setPPhone(e.target.value)} className={inputClass} placeholder="+91-XXXXXXXXXX" />
                </div>
                <button type="submit" className="px-6 py-2.5 rounded-lg font-mono text-xs cursor-pointer border-none bg-neon-green text-white font-bold transition-all hover:opacity-90 hover:-translate-y-px tracking-wider shadow-sm">
                  Register Patient →
                </button>
              </form>
            </div>

            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom flex items-center justify-between">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">All Patients</div>
                <Badge variant="green">{patients.length} registered</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="db-table">
                  <thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Blood</th><th>Registered</th></tr></thead>
                  <tbody>
                    {patients.map((p) => (
                      <tr key={p.id}>
                        <td><Badge variant="amber">{p.id}</Badge></td>
                        <td>{p.name}</td><td>{p.age}</td><td>{p.gender}</td><td>{p.blood}</td>
                        <td className="font-mono text-[10px]">{p.registeredAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ MEDICINES ══════ */}
      {activeSection === "medicines" && (
        <div className="px-[60px] pb-[60px]">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Add New Medicine</div>
              </div>
              <form onSubmit={addMedicine} className="p-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-muted mb-1.5">medicine name *</label>
                  <input value={mName} onChange={(e) => setMName(e.target.value)} className={inputClass} placeholder="e.g. Amlodipine" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-muted mb-1.5">category</label>
                    <input value={mCategory} onChange={(e) => setMCategory(e.target.value)} className={inputClass} placeholder="e.g. Antihypertensive" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted mb-1.5">manufacturer</label>
                    <input value={mManuf} onChange={(e) => setMManuf(e.target.value)} className={inputClass} placeholder="e.g. Cipla" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-muted mb-1.5">stock quantity</label>
                    <input type="number" value={mStock} onChange={(e) => setMStock(e.target.value)} className={inputClass} placeholder="e.g. 500" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted mb-1.5">unit</label>
                    <input value={mUnit} onChange={(e) => setMUnit(e.target.value)} className={inputClass} placeholder="e.g. 5mg tablets" />
                  </div>
                </div>
                <button type="submit" className="px-6 py-2.5 rounded-lg font-mono text-xs cursor-pointer border-none bg-amber text-white font-bold transition-all hover:opacity-90 hover:-translate-y-px tracking-wider shadow-sm">
                  Add Medicine →
                </button>
              </form>
            </div>

            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom flex items-center justify-between">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Medicine Inventory</div>
                <Badge variant="amber">{medicines.length} items</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="db-table">
                  <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Manufacturer</th><th>Stock</th></tr></thead>
                  <tbody>
                    {medicines.map((m) => (
                      <tr key={m.id}>
                        <td><Badge variant="amber">{m.id}</Badge></td>
                        <td>{m.name}</td><td>{m.category}</td><td>{m.manufacturer}</td>
                        <td>
                          <span className={`font-mono text-xs font-bold ${m.stock < 100 ? "text-coral" : m.stock < 300 ? "text-amber" : "text-neon-green"}`}>
                            {m.stock}
                          </span>
                          <span className="text-muted text-[10px] ml-1">{m.unit}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ MEDICAL RECORDS ══════ */}
      {activeSection === "records" && (
        <div className="px-[60px] pb-[60px]">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">Create Medical Record</div>
              </div>
              <form onSubmit={addRecord} className="p-5 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-muted mb-1.5">patient</label>
                    <select value={rPatient} onChange={(e) => setRPatient(e.target.value)} className={inputClass}>
                      {patients.map((p) => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted mb-1.5">attending doctor</label>
                    <select value={rDoctor} onChange={(e) => setRDoctor(e.target.value)} className={inputClass}>
                      {doctors.map((d) => <option key={d.id} value={d.id}>{d.id} — {d.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted mb-1.5">diagnosis *</label>
                  <input value={rDiag} onChange={(e) => setRDiag(e.target.value)} className={inputClass} placeholder="e.g. Hypertension" required />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted mb-1.5">symptoms</label>
                  <input value={rSymp} onChange={(e) => setRSymp(e.target.value)} className={inputClass} placeholder="e.g. Headache, dizziness" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-muted mb-1.5">medication</label>
                    <select value={rMed} onChange={(e) => setRMed(e.target.value)} className={inputClass}>
                      <option value="">Select medicine...</option>
                      {medicines.map((m) => <option key={m.id} value={m.name}>{m.name} ({m.unit})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted mb-1.5">dosage</label>
                    <input value={rDose} onChange={(e) => setRDose(e.target.value)} className={inputClass} placeholder="e.g. 5mg daily" />
                  </div>
                </div>
                <button type="submit" className="px-6 py-2.5 rounded-lg font-mono text-xs cursor-pointer border-none bg-neon-blue text-white font-bold transition-all hover:opacity-90 hover:-translate-y-px tracking-wider shadow-sm">
                  Save Record →
                </button>
              </form>
            </div>

            <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-custom flex items-center justify-between">
                <div className="font-mono text-[11px] text-muted uppercase tracking-widest">All Medical Records</div>
                <Badge variant="blue">{records.length} records</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="db-table">
                  <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Diagnosis</th><th>Medication</th><th>Date</th></tr></thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.id}>
                        <td><Badge variant="blue">{r.id}</Badge></td>
                        <td>{r.patientName}</td><td className="text-xs">{r.doctorName}</td>
                        <td>{r.diagnosis}</td><td>{r.medication}</td>
                        <td className="font-mono text-[10px]">{r.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ SQL TERMINAL ══════ */}
      {activeSection === "sql" && (
        <div className="px-[60px] pb-[60px]">
          <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-custom">
              <div className="font-mono text-[11px] text-muted uppercase tracking-widest">SQL Query Runner</div>
              <div className="flex gap-2">
                <Badge variant="green">PostgreSQL 15</Badge>
                <Badge variant="cyan">trustfl_{hospId.toLowerCase()}_db</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-5">
              <div>
                <label className="block text-xs font-mono text-muted mb-2">query editor</label>
                <textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="w-full font-mono text-xs bg-surface-2 border border-border-2 rounded-lg p-3.5 text-text-primary min-h-[120px] resize-y outline-none leading-[1.7]"
                />
                <div className="flex gap-2 mt-2.5 flex-wrap">
                  <button onClick={runQuery} className="px-6 py-2.5 rounded-lg font-mono text-xs cursor-pointer border-none bg-primary text-white font-bold transition-all hover:bg-primary-dark hover:-translate-y-px tracking-wider shadow-sm">
                    Run Query ▶
                  </button>
                  {presets.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setSqlQuery(p.query)}
                      className="px-4 py-2 rounded-lg font-mono text-[10px] cursor-pointer bg-transparent text-primary border border-primary/30 transition-all hover:bg-primary-light tracking-wider"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-2">results</label>
                <div className="bg-surface-2 border border-border-2 rounded-lg p-3.5 min-h-[160px] font-mono text-[11px] text-muted overflow-x-auto">
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
      )}
    </div>
  );
}
