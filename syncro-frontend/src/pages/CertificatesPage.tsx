import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_USER, PROBLEM_LIST } from '../data/mockData';
import { CertificateModal } from '../components/CertificateModal';
import { QRCodeSVG } from 'qrcode.react';
import type { Certificate, CertificateTier, CertificateTrack } from '../types';
import {
  Award, CheckCircle2, Lock, ArrowRight, ShieldCheck,
  Sparkles, Zap, BookOpen, Download, Share2, QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TRACKS: CertificateTrack[] = [
  {
    tier: 'easy',
    title: 'Foundation Coder Certificate',
    difficultyLabel: 'Easy',
    badgeTitle: 'Emerald Distinction',
    description: 'Awarded for solving 80%+ of core foundational problems including HashMaps, Arrays, Strings, and Two Pointers.',
    requiredPercentage: 80,
    accentColor: 'text-emerald-400',
    bgGradient: 'from-emerald-500 to-teal-500',
    icon: '🌱',
  },
  {
    tier: 'medium',
    title: 'Algorithm Specialist Certificate',
    difficultyLabel: 'Medium',
    badgeTitle: 'Gold Distinction',
    description: 'Awarded for solving 80%+ of intermediate problems including Dynamic Programming, Graph Traversals, and Tree algorithms.',
    requiredPercentage: 80,
    accentColor: 'text-syncro-gold',
    bgGradient: 'from-amber-400 to-amber-600',
    icon: '⚡',
  },
  {
    tier: 'hard',
    title: 'Master Architect Certificate',
    difficultyLabel: 'Hard',
    badgeTitle: 'Ruby Distinction',
    description: 'Awarded for solving 80%+ of elite hard problems including Advanced DP, Complex Graph Theory, and Memory-Optimized Invariants.',
    requiredPercentage: 80,
    accentColor: 'text-rose-400',
    bgGradient: 'from-rose-500 to-red-600',
    icon: '👑',
  },
];

export function CertificatesPage() {
  const { user: authUser } = useAuth();
  const user = authUser ?? MOCK_USER;

  const totalEasy = PROBLEM_LIST.filter(p => p.difficulty === 'Easy').length || 5;
  const totalMedium = PROBLEM_LIST.filter(p => p.difficulty === 'Medium').length || 4;
  const totalHard = PROBLEM_LIST.filter(p => p.difficulty === 'Hard').length || 3;

  const [simulatedTiers, setSimulatedTiers] = useState<Record<CertificateTier, boolean>>({
    easy: true, // Default unlocked for demo preview
    medium: false,
    hard: false,
  });

  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);

  const getTierStats = (tier: CertificateTier) => {
    let solved = 0;
    let total = 0;

    if (tier === 'easy') {
      total = totalEasy;
      solved = simulatedTiers.easy ? Math.ceil(total * 0.85) : user.easySolved;
    } else if (tier === 'medium') {
      total = totalMedium;
      solved = simulatedTiers.medium ? Math.ceil(total * 0.85) : user.mediumSolved;
    } else {
      total = totalHard;
      solved = simulatedTiers.hard ? Math.ceil(total * 0.85) : user.hardSolved;
    }

    const percentage = Math.min(100, Math.round((solved / total) * 100));
    const isUnlocked = percentage >= 80;
    const needed = Math.max(0, Math.ceil(total * 0.8) - solved);

    return { solved, total, percentage, isUnlocked, needed };
  };

  const handleOpenCertificate = (track: CertificateTrack) => {
    const stats = getTierStats(track.tier);
    const cert: Certificate = {
      id: `cert-${track.tier}-${user.id}`,
      tier: track.tier,
      title: track.title,
      subtitle: `${track.difficultyLabel} Algorithmic Mastery Track`,
      recipientName: user.displayName,
      recipientId: user.id,
      scorePercentage: Math.max(80, stats.percentage),
      solvedCount: stats.solved,
      totalRequired: stats.total,
      issueDate: new Date().toISOString(),
      verificationCode: `SYNCRO-${new Date().getFullYear()}-${track.tier.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      instructorName: 'BACKBENCHERS',
      instructorTitle: 'Lead Evaluation Board, SYNCRO LAB',
    };
    setActiveCertificate(cert);
  };

  const toggleSimulate = (tier: CertificateTier) => {
    setSimulatedTiers(prev => ({ ...prev, [tier]: !prev[tier] }));
  };

  return (
    <div className="min-h-screen bg-syncro-black pt-20 pb-16 text-syncro-white">
      <div className="fixed inset-0 pointer-events-none hex-grid-bg opacity-30" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-syncro-gold/10 border border-syncro-gold/30 text-syncro-gold-light text-xs font-bold uppercase tracking-wider mb-4 shadow-sm backdrop-blur-sm">
            <Award size={15} className="text-syncro-gold" /> Authorized by BACKBENCHERS
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            SYNCRO LAB Official Certifications
          </h1>
          <p className="text-syncro-white-muted text-base sm:text-lg leading-relaxed">
            Earn verified, scannable credentials signed by <strong className="text-syncro-gold font-bold">BACKBENCHERS</strong> for securing <strong className="text-white font-bold">80% or higher</strong> across Easy, Medium, and Hard question tracks.
          </p>
        </div>

        {/* Simulator Banner / Interactive Tools */}
        <div className="card-glass p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-syncro-gold/20 bg-syncro-black-card shadow-card animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-syncro-gold/20 text-syncro-gold border border-syncro-gold/30 flex items-center justify-center flex-shrink-0">
              <QrCode size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>Interactive Certificate & QR Preview</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">Scannable QR Included</span>
              </p>
              <p className="text-xs text-syncro-white-dim">Toggle simulated 80%+ scores to test, inspect QR verification, and print white certificates.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(['easy', 'medium', 'hard'] as CertificateTier[]).map(tier => (
              <button
                key={tier}
                onClick={() => toggleSimulate(tier)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  simulatedTiers[tier]
                    ? 'btn-gold shadow-gold-sm text-syncro-black'
                    : 'bg-syncro-black-soft text-syncro-white-muted hover:bg-syncro-black-hover border border-syncro-black-border'
                }`}
              >
                {simulatedTiers[tier] ? '✓ Unlocked' : '+ Simulate'} {tier.toUpperCase()} 80%+
              </button>
            ))}
          </div>
        </div>

        {/* The 3 Certificate Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {TRACKS.map((track, i) => {
            const stats = getTierStats(track.tier);
            const isUnlocked = stats.isUnlocked;

            return (
              <div
                key={track.tier}
                className={`relative flex flex-col rounded-3xl p-6 transition-all duration-300 ${
                  isUnlocked
                    ? 'card-glass border-2 border-syncro-gold/40 shadow-card-hover hover:-translate-y-1.5'
                    : 'card-solid border border-syncro-black-border hover:border-syncro-gold/20'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Track Ribbon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{track.icon}</span>
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-3 py-1 rounded-full shadow-sm">
                      <ShieldCheck size={13} /> Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-syncro-white-dim bg-syncro-black-soft px-3 py-1 rounded-full">
                      <Lock size={12} /> {stats.percentage}% / 80%
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white mb-2">{track.title}</h3>
                <p className="text-xs text-syncro-white-muted leading-relaxed mb-6 flex-1">
                  {track.description}
                </p>

                {/* Progress Bar Toward 80% */}
                <div className="mb-6 bg-syncro-black-soft p-4 rounded-2xl border border-syncro-black-border">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-semibold text-syncro-white-muted">Track Mastery</span>
                    <span className="font-extrabold text-white">
                      {stats.percentage}% <span className="text-syncro-white-dim font-normal">({stats.solved}/{stats.total})</span>
                    </span>
                  </div>

                  <div className="h-2.5 bg-syncro-black-border rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${track.bgGradient}`}
                      style={{ width: `${Math.min(100, stats.percentage)}%` }}
                    />
                    {/* 80% threshold line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white z-10 opacity-70 shadow-sm"
                      style={{ left: '80%' }}
                      title="80% Certificate Requirement"
                    />
                  </div>

                  <div className="flex justify-between items-center mt-2 text-[11px] text-syncro-white-dim">
                    <span>Target: 80%</span>
                    {isUnlocked ? (
                      <span className="text-emerald-400 font-bold">Requirement Met! 🎉</span>
                    ) : (
                      <span>Solve {stats.needed} more</span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                {isUnlocked ? (
                  <button
                    onClick={() => handleOpenCertificate(track)}
                    className="btn-gold w-full py-3 text-xs text-syncro-black font-extrabold shadow-gold-sm flex items-center justify-center gap-2"
                  >
                    <Award size={16} /> View & Print Certificate
                  </button>
                ) : (
                  <Link
                    to={`/problems`}
                    className="btn-ghost w-full py-3 text-xs flex items-center justify-center gap-2"
                  >
                    <BookOpen size={15} /> Practice {track.difficultyLabel} Problems
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Credential Authority Info */}
        <div className="card-glass p-8 rounded-3xl border border-syncro-gold/20 bg-syncro-black-card">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck size={20} className="text-syncro-gold" />
            Verification Authority & Scannable QR Security
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 text-xs text-syncro-white-muted leading-relaxed">
            <div>
              <p className="font-bold text-white mb-1">Signed by BACKBENCHERS</p>
              <p>Official seal and signatory credentials assigned by the BACKBENCHERS evaluation team.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-1">Live Scannable QR Code</p>
              <p>Each certificate embeds a high-density QR code for instant smartphone camera verification.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-1">Strict 80% Threshold</p>
              <p>Ensures every certified engineer demonstrates verified problem-solving speed and algorithm correctness.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Certificate Modal */}
      {activeCertificate && (
        <CertificateModal
          certificate={activeCertificate}
          isOpen={Boolean(activeCertificate)}
          onClose={() => setActiveCertificate(null)}
        />
      )}
    </div>
  );
}
