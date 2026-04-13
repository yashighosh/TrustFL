"use client";

interface LandingPageProps {
  onGetStarted: () => void;
}


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




      {/* ── Footer ── */}
      <footer className="border-t border-border-custom bg-surface py-8 px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-mono text-lg font-bold text-text-primary tracking-tight">
            Trust<span className="text-primary">FL</span>
            <span className="ml-3 font-mono text-[10px] text-muted font-normal">v1.0.0</span>
          </div>
          <div className="text-sm text-muted">
            Built with <span className="text-coral">♥</span> by{" "}
            <span className="font-semibold text-text-primary">Yashi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
