"use client";

import { useState } from "react";

interface AuthPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [role, setRole] = useState<"admin" | "patient" | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    roleName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      onLogin(); 
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBack = () => {
    if (role) {
      setRole(null);
      setIsLogin(true); 
    } else {
      onBack();
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen landing-gradient flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl opacity-60" />
        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-neon-blue/5 blur-3xl opacity-60" />

        <button
          onClick={handleBack}
          className="absolute top-8 left-10 text-muted hover:text-text-primary flex items-center gap-2 font-mono text-sm transition-colors z-20"
        >
          <span>←</span> Back to Home
        </button>

        <div className="text-center mb-12 relative z-10">
          <h2 className="text-4xl font-extrabold text-text-primary tracking-tight mb-4">
            Select Your Portal
          </h2>
          <p className="text-muted max-w-md mx-auto">
            Choose how you would like to securely access the decentralized network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl relative z-10">
          {/* Admin Card */}
          <button
            onClick={() => setRole("admin")}
            className="glass-card rounded-[2rem] p-10 text-left transition-all hover:-translate-y-2 hover:shadow-2xl border-transparent hover:border-primary/30 group bg-surface/40 hover:bg-surface/80"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              🏥
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">Hospital Administration</h3>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Manage doctors, medical staff, medicine, equipment, and track federated learning models.
            </p>
            <div className="font-mono text-xs text-primary font-bold tracking-wider inline-flex items-center gap-2">
              ENTER PORTAL <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>

          {/* Patient Card */}
          <button
            onClick={() => setRole("patient")}
            className="glass-card rounded-[2rem] p-10 text-left transition-all hover:-translate-y-2 hover:shadow-2xl border-transparent hover:border-neon-green/30 group bg-surface/40 hover:bg-surface/80"
          >
            <div className="w-16 h-16 rounded-2xl bg-green-light flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              👤
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">Patient Portal</h3>
            <p className="text-muted text-sm leading-relaxed mb-6">
              View your specific patient details, medical records, test results and manage data access securely.
            </p>
            <div className="font-mono text-xs text-neon-green font-bold tracking-wider inline-flex items-center gap-2">
              ENTER PORTAL <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen landing-gradient flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl opacity-60" />
      <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-neon-blue/5 blur-3xl opacity-60" />

      <button
        onClick={handleBack}
        className="absolute top-8 left-10 text-muted hover:text-text-primary flex items-center gap-2 font-mono text-sm transition-colors z-20"
      >
        <span>←</span> Back to Selection
      </button>

      <div className="glass-card rounded-[2rem] w-full max-w-md p-10 relative z-10" style={{ animation: "slideUp 0.5s ease" }}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm border ${
              role === "admin" ? "bg-primary-light border-primary/20" : "bg-green-light border-neon-green/20"
            }`}>
              {role === "admin" ? "🏥" : "👤"}
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
            {isLogin 
              ? (role === "admin" ? "Admin Login" : "Patient Login")
              : (role === "admin" ? "Register Hospital" : "Register Patient")
            }
          </h2>
          <p className="text-sm text-muted mt-2">
            {isLogin 
              ? "Sign in to access your dashboard." 
              : "Create an account to join the network."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-1.5">
                {role === "admin" ? "Hospital Name" : "Full Name"}
              </label>
              <input
                type="text"
                name="roleName"
                value={formData.roleName}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-xl bg-surface border border-border-custom outline-none transition-all text-sm focus:ring-1 ${
                  role === "admin" ? "focus:border-primary focus:ring-primary" : "focus:border-neon-green focus:ring-neon-green"
                }`}
                placeholder={role === "admin" ? "Central Hospital" : "Jane Doe"}
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-xl bg-surface border border-border-custom outline-none transition-all text-sm focus:ring-1 ${
                role === "admin" ? "focus:border-primary focus:ring-primary" : "focus:border-neon-green focus:ring-neon-green"
              }`}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-xl bg-surface border border-border-custom outline-none transition-all text-sm focus:ring-1 ${
                role === "admin" ? "focus:border-primary focus:ring-primary" : "focus:border-neon-green focus:ring-neon-green"
              }`}
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-1.5">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-xl bg-surface border border-border-custom outline-none transition-all text-sm focus:ring-1 ${
                  role === "admin" ? "focus:border-primary focus:ring-primary" : "focus:border-neon-green focus:ring-neon-green"
                }`}
                placeholder="••••••••"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl text-white font-bold font-mono tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                role === "admin" ? "bg-primary hover:bg-primary-dark" : "bg-neon-green hover:bg-[#047857]"
              }`}
            >
              {isLogin ? "Sign In →" : "Create Account →"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-muted">
          {isLogin ? "Don't have an account?" : "Already registered?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            type="button"
            className={`ml-2 font-bold hover:underline ${
              role === "admin" ? "text-primary" : "text-neon-green"
            }`}
          >
            {isLogin ? "Create one" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
