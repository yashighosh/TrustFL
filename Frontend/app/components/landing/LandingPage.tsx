"use client";

interface LandingPageProps {
  onGetStarted: () => void;
}

const features = [
  {
    icon: "🏥",
    title: "Hospital Database",
    desc: "Securely manage hospitals, doctors, patients, and medical records. All data stays local — never shared across the network.",
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: "🔗",
    title: "Blockchain Verification",
    desc: "Every model update is hashed with SHA-256 and recorded on an immutable ledger. Tamper-proof. Transparent. Trustless.",
    color: "text-amber",
    bg: "bg-amber-light",
  },
  {
    icon: "🧠",
    title: "Federated Learning",
    desc: "Collaborative model training across hospitals. Only model weights are shared — raw patient data never leaves the hospital.",
    color: "text-neon-green",
    bg: "bg-green-light",
  },
];

const steps = [
  { num: "01", title: "Register Hospitals", desc: "Add hospitals and their local patient databases to the federated network." },
  { num: "02", title: "Train Locally", desc: "Each hospital trains a model on its own data without sharing raw patient records." },
  { num: "03", title: "Aggregate Securely", desc: "Model weights are aggregated using FedAvg, improving accuracy without compromising privacy." },
  { num: "04", title: "Verify on Blockchain", desc: "Every update is hashed and recorded on-chain, ensuring tamper-proof audit trails." },
];

const stats = [
  { val: "3", label: "Connected Hospitals" },
  { val: "2,572", label: "Patient Records" },
  { val: "SHA-256", label: "Encryption Standard" },
  { val: "FedAvg", label: "Aggregation Protocol" },
];

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-16 bg-white/80 backdrop-blur-xl border-b border-border-custom">
        <div className="font-mono text-lg font-bold text-text-primary tracking-tight">
          Trust<span className="text-primary">FL</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm text-muted hover:text-text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted hover:text-text-primary transition-colors">How it Works</a>
          <button
            onClick={onGetStarted}
            className="px-5 py-2 rounded-lg font-mono text-xs bg-primary text-white font-bold tracking-wider transition-all hover:bg-primary-dark hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-gradient pt-32 pb-20 px-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-neon-blue/5 blur-3xl" />

        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light border border-primary/20 text-primary font-mono text-xs font-bold mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Privacy-Preserving Healthcare AI
            </div>
            <h1 className="text-[56px] font-extrabold leading-[1.05] tracking-[-2px] mb-6 text-text-primary">
              Trustworthy<br />
              <span className="text-primary">Federated</span><br />
              Learning
            </h1>
            <p className="text-lg text-muted leading-relaxed max-w-md mb-8">
              A blockchain-verified federated learning platform that enables hospitals to collaboratively train AI models — without ever sharing patient data.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-3.5 rounded-xl font-mono text-sm bg-primary text-white font-bold tracking-wider transition-all hover:bg-primary-dark hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                Get Started →
              </button>
              <a href="#how-it-works" className="px-6 py-3.5 rounded-xl font-mono text-sm text-primary border-2 border-primary/30 hover:bg-primary-light transition-all tracking-wider font-semibold">
                Learn More
              </a>
            </div>
          </div>

          {/* Visual */}
          <div className="relative flex justify-center">
            <div className="glass-card rounded-3xl p-8 w-[420px]" style={{ animation: "float 6s ease-in-out infinite" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-coral" />
                <div className="w-3 h-3 rounded-full bg-amber" />
                <div className="w-3 h-3 rounded-full bg-neon-green" />
                <span className="ml-2 font-mono text-[10px] text-muted">trustfl-server</span>
              </div>
              <div className="space-y-3">
                <div className="bg-surface-2 rounded-lg p-3 font-mono text-xs">
                  <span className="text-primary">→</span> <span className="text-muted">H001 local training...</span>
                  <span className="text-neon-green ml-2">✓ acc: 89.2%</span>
                </div>
                <div className="bg-surface-2 rounded-lg p-3 font-mono text-xs">
                  <span className="text-amber">→</span> <span className="text-muted">H002 local training...</span>
                  <span className="text-neon-green ml-2">✓ acc: 87.5%</span>
                </div>
                <div className="bg-surface-2 rounded-lg p-3 font-mono text-xs">
                  <span className="text-neon-blue">→</span> <span className="text-muted">H003 local training...</span>
                  <span className="text-neon-green ml-2">✓ acc: 91.0%</span>
                </div>
                <div className="bg-primary-light rounded-lg p-3 font-mono text-xs border border-primary/20">
                  <span className="text-primary font-bold">⚡ FedAvg</span>
                  <span className="text-muted ml-2">aggregating 3 models...</span>
                </div>
                <div className="bg-green-light rounded-lg p-3 font-mono text-xs border border-neon-green/20">
                  <span className="text-neon-green font-bold">✓ Global model</span>
                  <span className="text-muted ml-2">accuracy: 92.3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="max-w-5xl mx-auto mt-20 grid grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-5 text-center">
              <div className="text-2xl font-extrabold text-primary font-mono mb-1">{s.val}</div>
              <div className="text-xs text-muted font-mono">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-mono text-xs text-primary font-bold uppercase tracking-widest mb-3">Core Modules</div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Three Pillars of Trust</h2>
            <p className="text-muted max-w-lg mx-auto">
              TrustFL combines secure databases, blockchain verification, and federated learning into a unified healthcare AI platform.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center text-2xl mb-5`}>
                  {f.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${f.color}`}>{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="how-it-works" className="py-24 px-10 bg-surface-2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-mono text-xs text-primary font-bold uppercase tracking-widest mb-3">Process</div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">How TrustFL Works</h2>
            <p className="text-muted max-w-lg mx-auto">
              A four-step process that ensures privacy, accuracy, and verifiability across the healthcare network.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex gap-5 bg-surface rounded-2xl p-6 border border-border-custom shadow-sm hover:shadow-md transition-shadow">
                <div className="step-dot shrink-0">{s.num}</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">{s.title}</h4>
                  <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <button
              onClick={onGetStarted}
              className="px-10 py-4 rounded-xl font-mono text-sm bg-primary text-white font-bold tracking-wider transition-all hover:bg-primary-dark hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              Get Started with TrustFL →
            </button>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="py-20 px-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="font-mono text-xs text-muted uppercase tracking-widest mb-8">Built With</div>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            {["PyTorch", "FedAvg", "SHA-256", "PostgreSQL", "Blockchain", "React"].map((tech) => (
              <div key={tech} className="px-6 py-3 rounded-xl bg-surface border border-border-custom font-mono text-sm text-muted font-semibold shadow-sm">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border-custom bg-surface py-8 px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-mono text-lg font-bold text-text-primary tracking-tight">
            Trust<span className="text-primary">FL</span>
          </div>
          <div className="text-sm text-muted">
            Built with <span className="text-coral">♥</span> by <span className="font-semibold text-text-primary">Yashi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
