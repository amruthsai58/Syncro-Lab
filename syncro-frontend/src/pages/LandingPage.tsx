import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HexagonLogo, HexLoader } from '../components/HexagonLogo';
import { Code2, TrendingUp, Users, ArrowRight, Star, Zap, Award, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

const PILLARS = [
  {
    icon: Code2,
    label: 'Code',
    title: 'World-Class Workspace',
    description: 'Multi-language Monaco editor with real-time test execution, instant feedback, and clean runtime statistics.',
    badgeBg: 'bg-syncro-black-card text-syncro-gold border-syncro-gold/30',
  },
  {
    icon: TrendingUp,
    label: 'Practice',
    title: 'Curated 3-Tier Tracks',
    description: 'Master foundational to elite algorithms structured neatly across Easy, Medium, and Hard problem catalogs.',
    badgeBg: 'bg-syncro-black-card text-emerald-400 border-emerald-500/30',
  },
  {
    icon: Award,
    label: 'Evolve',
    title: '80%+ Official Certificates',
    description: 'Solve 80% or more questions in any difficulty track to automatically unlock verified certificates signed by BACKBENCHERS.',
    badgeBg: 'bg-syncro-black-card text-amber-400 border-amber-500/30',
  },
];

const CERT_TRACKS = [
  {
    title: 'Foundation Coder',
    tier: 'Easy Track',
    threshold: '80%+ Solved',
    color: 'border-emerald-500/30 bg-syncro-black-card text-slate-100',
    iconColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
    desc: 'Demonstrates strong understanding of HashMaps, Arrays, Strings, and core problem solving.',
  },
  {
    title: 'Algorithm Specialist',
    tier: 'Medium Track',
    threshold: '80%+ Solved',
    color: 'border-amber-500/30 bg-syncro-black-card text-slate-100',
    iconColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
    desc: 'Validates deep mastery of Dynamic Programming, Graph Traversals, Trees, and optimization.',
  },
  {
    title: 'Master Architect',
    tier: 'Hard Track',
    threshold: '80%+ Solved',
    color: 'border-rose-500/30 bg-syncro-black-card text-slate-100',
    iconColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
    desc: 'Exhibits elite engineering problem-solving capabilities, complex system design, and advanced algorithms.',
  },
];

const STATS = [
  { value: '500+', label: 'Curated Problems', icon: Code2, color: 'text-syncro-gold' },
  { value: '80%', label: 'Cert Threshold', icon: Award, color: 'text-amber-400' },
  { value: '99ms', label: 'Avg Execution', icon: Zap, color: 'text-emerald-400' },
  { value: 'QR', label: 'Live Verification', icon: QrCode, color: 'text-syncro-gold-light' },
];


export function LandingPage() {
  const { isAuthenticated, isLoading, enterWithName } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [nameVisible, setNameVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) navigate('/problems', { replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setNameVisible(true), 350);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError('Enter your name to continue.'); return; }
    if (trimmed.length < 2) { setError('Name must be at least 2 characters.'); return; }
    if (trimmed.length > 24) { setError('Name must be 24 characters or less.'); return; }
    setIsSubmitting(true);
    setError('');
    await enterWithName(trimmed);
    navigate('/problems');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-syncro-black flex items-center justify-center">
        <HexLoader size={72} message="Initializing SYNCRO LAB…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-syncro-black overflow-hidden text-syncro-white">

      {/* Hero Ambient Gold & Dark Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #C9A24B 0%, transparent 70%)' }} />
        {/* Background Hex Pattern */}
        <div className="hex-grid-bg absolute inset-0 opacity-60" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">

        {/* Original Black & Gold Hexagon Logo */}
        <div className="animate-stagger-1 mb-6 flex flex-col items-center">
          <HexagonLogo size={96} animated showText={false} />
        </div>

        {/* Hero Title */}
        <div className="animate-stagger-2 text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-syncro-gold/10 border border-syncro-gold/30 text-syncro-gold-light text-xs font-bold uppercase tracking-wider mb-4 shadow-sm backdrop-blur-sm">
            <Award size={15} className="text-syncro-gold" />
            Certified by BACKBENCHERS · With Scannable QR Codes
          </div>

          <h1 className="font-display font-extrabold tracking-tight text-4xl sm:text-6xl md:text-7xl text-white mb-3 drop-shadow">
            SYNCRO<span className="text-syncro-gold">.</span>LAB
          </h1>

          <p className="text-gold-gradient font-bold tracking-[0.25em] text-base sm:text-xl uppercase">
            Code · Practice · Evolve
          </p>
        </div>

        {/* Subtitle */}
        <div className="animate-stagger-3 text-center max-w-2xl mb-10">
          <p className="text-syncro-white-muted text-base sm:text-lg leading-relaxed text-balance">
            The elite competitive coding dojo. Master algorithms, benchmark runtime metrics, and earn official <strong className="text-syncro-gold font-bold">Easy, Medium, and Hard certificates (80%+)</strong> signed by <strong className="text-white">BACKBENCHERS</strong>.
          </p>
        </div>

        {/* Name Entry Glass Card */}
        <div className={`animate-stagger-4 w-full max-w-md transition-all duration-700 ${nameVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="card-glass p-8 rounded-3xl border border-syncro-gold/30 shadow-card-hover"
            style={{ boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 30px rgba(201, 162, 75, 0.15)' }}>

            <div className="mb-6">
              <span className="text-syncro-gold text-xs uppercase font-extrabold tracking-wider">Instant Access</span>
              <h2 className="text-xl font-bold text-white mt-1">What should we call you?</h2>
              <p className="text-syncro-white-dim text-xs mt-1">No sign-up or password required. Enter your name to start coding.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  placeholder="e.g. Arjun Mehra, Alex Vance…"
                  maxLength={24}
                  autoFocus
                  className="input-dark text-base"
                  disabled={isSubmitting}
                />
                {error && (
                  <p className="text-rose-400 text-xs mt-1.5 font-medium flex items-center gap-1">⚠ {error}</p>
                )}
              </div>

              <button
                id="enter-lab-btn"
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="btn-gold w-full py-3.5 text-base font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2 text-syncro-black">
                    <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                    Entering Lab…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 text-syncro-black">
                    Enter the Lab <ArrowRight size={18} />
                  </span>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-xs text-syncro-white-dim mt-4">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Session auto-persisted on this device</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl animate-stagger-4">
          {STATS.map(({ value, label, icon: Icon, color }) => (
            <div key={label} className="text-center card-solid px-4 py-3.5 rounded-2xl shadow-card">
              <Icon size={18} className={`${color} mx-auto mb-1`} />
              <div className="text-xl font-black text-white">{value}</div>
              <div className="text-xs text-syncro-white-dim font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Types of Certificates Showcase Section */}
      <section className="relative py-20 px-4 bg-syncro-black-soft border-t border-syncro-black-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-syncro-gold/10 border border-syncro-gold/30 text-syncro-gold-light text-xs font-bold uppercase tracking-wider mb-2">
              <Award size={14} /> Authorized by BACKBENCHERS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Three Official 80%+ Certificate Tracks
            </h2>
            <p className="text-syncro-white-muted text-sm sm:text-base max-w-xl mx-auto mt-2">
              Solve at least <strong className="text-white font-bold">80% of questions</strong> in any track to unlock verified credentials with real scannable QR verification.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CERT_TRACKS.map((track) => (
              <div
                key={track.title}
                className={`card-solid p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover ${track.color}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-syncro-black-hover border border-syncro-black-border text-syncro-white">
                    {track.tier}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} /> {track.threshold}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{track.title}</h3>
                <p className="text-xs text-syncro-white-muted leading-relaxed mb-6">
                  {track.desc}
                </p>

                <div className="pt-4 border-t border-syncro-black-border flex items-center justify-between text-xs font-semibold">
                  <span className="text-syncro-white-dim flex items-center gap-1">
                    <QrCode size={13} className="text-syncro-gold" /> Scannable QR Verified
                  </span>
                  <span className="text-syncro-gold flex items-center gap-1 font-bold">
                    Print / PDF Ready <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="relative py-20 px-4 bg-syncro-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-syncro-gold text-xs tracking-widest uppercase font-extrabold mb-2">Engineered For Mastery</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why SYNCRO LAB?</h2>
            <div className="divider-gold w-28 mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PILLARS.map(({ icon: Icon, label, title, description, badgeBg }) => (
              <div
                key={label}
                className="card-glass p-8 rounded-3xl border border-syncro-gold/15 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 cursor-default"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${badgeBg}`}>
                  <Icon size={22} />
                </div>
                <p className="text-xs font-bold tracking-wider uppercase text-syncro-white-dim mb-1">{label}</p>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-syncro-white-muted text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-syncro-black-border py-8 bg-syncro-black-soft text-center">
        <HexagonLogo size={28} showText className="justify-center mb-3" />
        <p className="text-syncro-white-dim text-xs">© 2026 SYNCRO LAB — Code · Practice · Evolve. Certified by BACKBENCHERS.</p>
      </footer>

    </div>
  );
}
