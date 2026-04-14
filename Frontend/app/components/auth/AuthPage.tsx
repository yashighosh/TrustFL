"use client";

import { useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { useHospital } from "@/app/context/HospitalContext";

interface AuthPageProps {
  onBack: () => void;
  onHospitalEntry: () => void;
  onSuperAdmin?: () => void;
}

export default function AuthPage({ onBack, onHospitalEntry, onSuperAdmin }: AuthPageProps) {
  const { setHospital, setIsAdmin } = useHospital();
  
  const [mode, setMode] = useState<"choice" | "register" | "login" | "superadmin">("choice");

  /* Registration form */
  const [regName, setRegName] = useState("");
  const [regLocation, setRegLocation] = useState("");
  const [regType, setRegType] = useState("Private");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  /* Login form */
  const [loginHosp, setLoginHosp] = useState("H001");
  const [loginPassword, setLoginPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminKey, setAdminKey] = useState("");

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-surface border border-border-custom outline-none transition-all text-sm focus:ring-1 focus:border-primary focus:ring-primary placeholder:text-muted-2";

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!regName.trim()) { setError("Hospital name is required"); return; }
    if (!regEmail.trim()) { setError("Email is required"); return; }
    if (regPassword.length < 4) { setError("Password must be at least 4 characters"); return; }
    if (regPassword !== regConfirm) { setError("Passwords do not match"); return; }

    setLoading(true);
    try {
      const generatedId = `H00${Math.floor(Math.random() * 100)}`; // Basic ID gen for now
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          hospital_id: generatedId,
          hospital_name: regName.trim(),
          hospital_location: regLocation.trim() || undefined,
          hospital_type: regType,
          contact_email: regEmail.trim(),
          contact_phone: regPhone.trim() || undefined,
          password: regPassword
        })
      });

      localStorage.setItem("trustfl_token", res.access_token);
      localStorage.setItem("trustfl_role", res.role);

      setHospital({
        id: res.hospital.hospital_id,
        name: res.hospital.hospital_name,
        location: res.hospital.hospital_location || "Unknown",
        type: res.hospital.hospital_type || "Unknown",
        email: res.hospital.contact_email,
        phone: res.hospital.contact_phone || "—",
        registeredAt: new Date(res.hospital.created_at).toISOString().split("T")[0],
      });
      onHospitalEntry();
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!loginPassword) { setError("Password is required"); return; }

    setLoading(true);
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          hospital_id: loginHosp,
          password: loginPassword
        })
      });

      localStorage.setItem("trustfl_token", res.access_token);
      localStorage.setItem("trustfl_role", res.role);

      setHospital({
        id: res.hospital.hospital_id,
        name: res.hospital.hospital_name,
        location: res.hospital.hospital_location || "Unknown",
        type: res.hospital.hospital_type || "Unknown",
        email: res.hospital.contact_email,
        phone: res.hospital.contact_phone || "—",
        registeredAt: new Date(res.hospital.created_at).toISOString().split("T")[0],
      });
      onHospitalEntry();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSuperAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!adminKey) { setError("Admin Key is required"); return; }

    setLoading(true);
    try {
      const res = await apiFetch("/auth/admin-login", {
        method: "POST",
        body: JSON.stringify({ admin_key: adminKey })
      });

      localStorage.setItem("trustfl_token", res.access_token);
      localStorage.setItem("trustfl_role", res.role);

      setIsAdmin(true);
      onSuperAdmin?.();
    } catch (err: any) {
      setError(err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  }

  /* ── Choice Screen ── */
  if (mode === "choice") {
    return (
      <div className="min-h-screen landing-gradient flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl opacity-60" />
        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-neon-blue/5 blur-3xl opacity-60" />

        <button
          onClick={onBack}
          className="absolute top-8 left-10 text-muted hover:text-text-primary flex items-center gap-2 font-mono text-sm transition-colors z-20 bg-transparent border-none cursor-pointer"
        >
          <span>←</span> Back to Home
        </button>

        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-light border border-primary/20 text-4xl mb-6">
            🏥
          </div>
          <h2 className="text-4xl font-extrabold text-text-primary tracking-tight mb-4">
            TrustFL Portal
          </h2>
          <p className="text-muted max-w-md mx-auto">
            Register your hospital, sign in to your dashboard, or access the network-wide super admin panel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl relative z-10">
          {/* Hospital Card */}
          <button
            onClick={() => setMode("login")}
            className="glass-card rounded-[2rem] p-10 text-left transition-all hover:-translate-y-2 hover:shadow-2xl border-transparent hover:border-primary/30 group bg-surface/40 hover:bg-surface/80 cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🏥
              </div>
              <div className="w-14 h-14 rounded-2xl bg-green-light flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🔑
              </div>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">Hospital Portal</h3>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Access your existing hospital dashboard, or register a new hospital to join the federated network.
            </p>
            <div className="font-mono text-xs text-primary font-bold tracking-wider inline-flex items-center gap-2">
              ENTER PORTAL <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>

          {/* Super Admin Card */}
          <button
            onClick={() => { setMode("superadmin"); setError(""); }}
            className="glass-card rounded-[2rem] p-10 text-left transition-all hover:-translate-y-2 hover:shadow-2xl border-transparent hover:border-amber/30 group bg-surface/40 hover:bg-surface/80 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-light flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🛡️
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">Super Admin</h3>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Network-wide view. Monitor all hospitals, view the blockchain verification ledger, and oversee FL training.
            </p>
            <div className="font-mono text-xs text-amber font-bold tracking-wider inline-flex items-center gap-2">
              ADMIN PANEL <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  /* ── Registration Form ── */
  if (mode === "register") {
    return (
      <div className="min-h-screen landing-gradient flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl opacity-60" />
        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-neon-blue/5 blur-3xl opacity-60" />

        <button
          onClick={() => { setMode("choice"); setError(""); }}
          className="absolute top-8 left-10 text-muted hover:text-text-primary flex items-center gap-2 font-mono text-sm transition-colors z-20 bg-transparent border-none cursor-pointer"
        >
          <span>←</span> Back
        </button>

        <div className="glass-card rounded-[2rem] w-full max-w-lg p-10 relative z-10" style={{ animation: "slideUp 0.5s ease" }}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light border border-primary/20 flex items-center justify-center text-2xl shadow-sm">
                🏥
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Register Hospital</h2>
            <p className="text-sm text-muted mt-2">Create your hospital profile to join the TrustFL network</p>
          </div>

          {error && (
            <div className="bg-coral-light border border-coral/20 text-coral rounded-xl px-4 py-3 mb-4 font-mono text-xs">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-1.5">Hospital Name *</label>
              <input
                type="text" value={regName} onChange={(e) => setRegName(e.target.value)}
                className={inputClass} placeholder="e.g. CityCare Hospital" required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-1.5">Location</label>
                <input
                  type="text" value={regLocation} onChange={(e) => setRegLocation(e.target.value)}
                  className={inputClass} placeholder="e.g. Chennai"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-1.5">Type</label>
                <select value={regType} onChange={(e) => setRegType(e.target.value)} className={inputClass}>
                  <option>Private</option>
                  <option>Government</option>
                  <option>Teaching</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-1.5">Email *</label>
                <input
                  type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                  className={inputClass} placeholder="admin@hospital.com" required
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-1.5">Phone</label>
                <input
                  type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)}
                  className={inputClass} placeholder="+91-XX-XXXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-1.5">Password *</label>
                <input
                  type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                  className={inputClass} placeholder="••••••••" required
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-1.5">Confirm *</label>
                <input
                  type="password" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)}
                  className={inputClass} placeholder="••••••••" required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold font-mono tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register Hospital →"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted">
            Already registered?{" "}
            <button onClick={() => { setMode("login"); setError(""); }} className="text-primary font-bold hover:underline bg-transparent border-none cursor-pointer">
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Super Admin Login Form ── */
  if (mode === "superadmin") {
    return (
      <div className="min-h-screen landing-gradient flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-amber/5 blur-3xl opacity-60" />
        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-amber/5 blur-3xl opacity-60" />

        <button
          onClick={() => { setMode("choice"); setError(""); }}
          className="absolute top-8 left-10 text-muted hover:text-text-primary flex items-center gap-2 font-mono text-sm transition-colors z-20 bg-transparent border-none cursor-pointer"
        >
          <span>←</span> Back
        </button>

        <div className="glass-card rounded-[2rem] w-full max-w-md p-10 relative z-10" style={{ animation: "slideUp 0.5s ease" }}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-light border border-amber/20 flex items-center justify-center text-2xl shadow-sm">
                🛡️
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Super Admin</h2>
            <p className="text-sm text-muted mt-2">Enter secret key to access network overview</p>
          </div>

          {error && (
            <div className="bg-coral-light border border-coral/20 text-coral rounded-xl px-4 py-3 mb-4 font-mono text-xs">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSuperAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-1.5">Admin Secret Key</label>
              <input
                type="password" value={adminKey} onChange={(e) => setAdminKey(e.target.value)}
                className={inputClass} placeholder="••••••••" required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold font-mono tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-amber hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Authenticating..." : "System Login →"}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-xs text-muted font-mono">
            Demo Key: <span className="text-text-primary font-bold">admin123</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Login Form ── */
  return (
    <div className="min-h-screen landing-gradient flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl opacity-60" />
      <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-neon-blue/5 blur-3xl opacity-60" />

      <button
        onClick={() => { setMode("choice"); setError(""); }}
        className="absolute top-8 left-10 text-muted hover:text-text-primary flex items-center gap-2 font-mono text-sm transition-colors z-20 bg-transparent border-none cursor-pointer"
      >
        <span>←</span> Back
      </button>

      <div className="glass-card rounded-[2rem] w-full max-w-md p-10 relative z-10" style={{ animation: "slideUp 0.5s ease" }}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-light border border-neon-green/20 flex items-center justify-center text-2xl shadow-sm">
              🔑
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Sign In</h2>
          <p className="text-sm text-muted mt-2">Access your hospital dashboard</p>
        </div>

        {error && (
          <div className="bg-coral-light border border-coral/20 text-coral rounded-xl px-4 py-3 mb-4 font-mono text-xs">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-1.5">Hospital ID</label>
            <input 
              type="text" 
              value={loginHosp} 
              onChange={(e) => setLoginHosp(e.target.value)} 
              className={inputClass} 
              placeholder="e.g. H001" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
              className={inputClass} placeholder="••••••••" required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold font-mono tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-neon-green hover:bg-[#047857] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-muted">
          New hospital?{" "}
          <button onClick={() => { setMode("register"); setError(""); }} className="text-primary font-bold hover:underline bg-transparent border-none cursor-pointer">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
