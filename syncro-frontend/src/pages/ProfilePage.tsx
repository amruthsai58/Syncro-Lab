import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_USER, PROBLEM_LIST } from '../data/mockData';
import { RankHex } from '../components/HexagonLogo';
import { CertificateModal } from '../components/CertificateModal';
import type { Certificate, CertificateTier } from '../types';
import {
  Flame, Zap, BarChart2, Trophy, Award, CheckCircle2,
  Calendar, ShieldCheck, ArrowRight, Star, QrCode
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip,
} from 'recharts';
import { Link } from 'react-router-dom';

const SKILL_DATA = [
  { subject: 'Arrays', A: 85 }, { subject: 'DP', A: 70 }, { subject: 'Graphs', A: 55 },
  { subject: 'Trees', A: 78 }, { subject: 'Math', A: 82 }, { subject: 'Strings', A: 75 },
];

const RATING_HISTORY = [
  { date: 'Jun 1', rating: 1200 }, { date: 'Jun 8', rating: 1280 }, { date: 'Jun 15', rating: 1250 },
  { date: 'Jun 22', rating: 1320 }, { date: 'Jul 1', rating: 1380 }, { date: 'Jul 8', rating: 1360 },
  { date: 'Jul 15', rating: 1410 }, { date: 'Aug 1', rating: 1450 },
];

function ActivityHeatmap() {
  const weeks = Array.from({ length: 52 }, () =>
    Array.from({ length: 7 }, () => {
      const r = Math.random();
      return r < 0.45 ? 0 : r < 0.65 ? 1 : r < 0.80 ? 2 : r < 0.92 ? 3 : 4;
    })
  );

  const cls = (v: number) => {
    if (v === 0) return 'bg-syncro-black-soft';
    if (v === 1) return 'bg-amber-950/60 border border-amber-900/40';
    if (v === 2) return 'bg-amber-800/80';
    if (v === 3) return 'bg-syncro-gold';
    return 'bg-syncro-gold-light';
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-[3px] min-w-max">
        {weeks.map((week, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {week.map((val, d) => (
              <div key={d} className={`w-3 h-3 rounded-sm ${cls(val)}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number; payload: { date: string } }[] }) => {
  if (active && payload?.length) {
    return (
      <div className="card-solid text-white rounded-xl px-3 py-2 shadow-card border border-syncro-gold/40">
        <p className="text-xs text-syncro-white-dim">{payload[0].payload.date}</p>
        <p className="text-sm font-bold text-syncro-gold">{payload[0].value} ELO rating</p>
      </div>
    );
  }
  return null;
};

export function ProfilePage() {
  const { user: authUser } = useAuth();
  const user = authUser ?? MOCK_USER;

  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const openCert = (tier: CertificateTier, title: string, pct: number) => {
    setSelectedCert({
      id: `cert-${tier}-${user.id}`,
      tier,
      title,
      subtitle: `${tier.toUpperCase()} Algorithmic Track`,
      recipientName: user.displayName,
      recipientId: user.id,
      scorePercentage: pct,
      solvedCount: Math.round(pct * 0.1),
      totalRequired: 10,
      issueDate: new Date().toISOString(),
      verificationCode: `SYNCRO-${new Date().getFullYear()}-${tier.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      instructorName: 'BACKBENCHERS',
      instructorTitle: 'Lead Evaluation Board, SYNCRO LAB',
    });
  };

  const solvePercent = Math.min(100, Math.round((user.totalSolved / 500) * 100));

  return (
    <div className="min-h-screen bg-syncro-black pt-20 pb-16 text-syncro-white">
      <div className="fixed inset-0 pointer-events-none hex-grid-bg opacity-30" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 space-y-8">

        {/* Profile Card */}
        <div className="card-glass rounded-3xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-syncro-gold/30 shadow-card animate-fade-up">
          <div className="relative flex-shrink-0">
            <RankHex tier={user.rankTier} size={84} />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-syncro-black shadow-sm" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user.displayName}</h1>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-syncro-gold bg-syncro-gold/10 border border-syncro-gold/30 px-3 py-1 rounded-full w-fit mx-auto sm:mx-0">
                <ShieldCheck size={13} /> Verified Member
              </span>
            </div>

            <p className="text-sm font-bold text-syncro-gold mt-1">
              {user.rankTier} Tier · {user.rating} ELO Rating
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-8 mt-5">
              <div className="text-center">
                <div className="text-2xl font-black text-white">{user.totalSolved}</div>
                <div className="text-xs text-syncro-white-dim font-medium">Problems Solved</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-black text-white flex items-center gap-1 justify-center">
                  <Flame size={20} className="text-syncro-gold" />
                  {user.streakCount}
                </div>
                <div className="text-xs text-syncro-white-dim font-medium">Day Streak</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-black text-white">{user.rating}</div>
                <div className="text-xs text-syncro-white-dim font-medium">Global Rating</div>
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="flex-shrink-0 w-full sm:w-56 bg-syncro-black-soft p-4 rounded-2xl border border-syncro-black-border">
            <div className="flex justify-between text-xs font-bold text-syncro-white-muted mb-2">
              <span>Overall Solved</span>
              <span>{user.totalSolved}/500</span>
            </div>
            <div className="h-2.5 bg-syncro-black-border rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-syncro-gold via-syncro-gold-light to-amber-500 transition-all duration-700"
                style={{ width: `${solvePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-400">{user.easySolved} Easy</span>
              <span className="text-syncro-gold">{user.mediumSolved} Med</span>
              <span className="text-rose-400">{user.hardSolved} Hard</span>
            </div>
          </div>
        </div>

        {/* ─── 3 Track Official Certificates Showcase ─── */}
        <div className="card-glass rounded-3xl p-6 sm:p-8 border border-syncro-gold/30 shadow-card animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-syncro-gold bg-syncro-gold/10 border border-syncro-gold/30 px-3 py-1 rounded-full mb-1">
                <Award size={14} /> Signed by BACKBENCHERS · Scannable QR Verified
              </div>
              <h2 className="text-xl font-bold text-white">Verified Track Certifications</h2>
            </div>

            <Link
              to="/certificates"
              className="text-xs font-bold text-syncro-gold hover:text-syncro-gold-light flex items-center gap-1"
            >
              Open Certificate Hub <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* Easy Track */}
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-syncro-black-soft flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">Easy Track (80%+)</span>
                <h3 className="font-bold text-white text-base mt-2">Foundation Coder</h3>
                <p className="text-xs text-syncro-white-muted mt-1">Arrays, HashMaps, Strings & Pointers</p>
              </div>
              <button
                onClick={() => openCert('easy', 'Foundation Coder Certificate', 85)}
                className="mt-4 w-full py-2 rounded-xl btn-gold text-xs text-syncro-black font-extrabold flex items-center justify-center gap-1.5 shadow-gold-sm"
              >
                <Award size={14} /> View Certificate
              </button>
            </div>

            {/* Medium Track */}
            <div className="p-5 rounded-2xl border border-syncro-gold/30 bg-syncro-black-soft flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-syncro-gold bg-syncro-gold/10 border border-syncro-gold/30 px-2.5 py-0.5 rounded-full">Medium Track (80%+)</span>
                <h3 className="font-bold text-white text-base mt-2">Algorithm Specialist</h3>
                <p className="text-xs text-syncro-white-muted mt-1">Dynamic Programming, Graphs, Trees</p>
              </div>
              <button
                onClick={() => openCert('medium', 'Algorithm Specialist Certificate', 82)}
                className="mt-4 w-full py-2 rounded-xl btn-gold text-xs text-syncro-black font-extrabold flex items-center justify-center gap-1.5 shadow-gold-sm"
              >
                <Award size={14} /> View Certificate
              </button>
            </div>

            {/* Hard Track */}
            <div className="p-5 rounded-2xl border border-rose-500/30 bg-syncro-black-soft flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-rose-400 bg-rose-950/70 border border-rose-500/40 px-2.5 py-0.5 rounded-full">Hard Track (80%+)</span>
                <h3 className="font-bold text-white text-base mt-2">Master Architect</h3>
                <p className="text-xs text-syncro-white-muted mt-1">Complex DP, Memory Invariants, Inversion</p>
              </div>
              <button
                onClick={() => openCert('hard', 'Master Architect Certificate', 88)}
                className="mt-4 w-full py-2 rounded-xl btn-gold text-xs text-syncro-black font-extrabold flex items-center justify-center gap-1.5 shadow-gold-sm"
              >
                <Award size={14} /> View Certificate
              </button>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Skill Radar Chart */}
          <div className="card-glass rounded-3xl p-6 border border-syncro-gold/20 shadow-card animate-fade-up">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={18} className="text-syncro-gold" />
              <h2 className="text-base font-bold text-white">Skill Competency Analytics</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={SKILL_DATA}>
                <PolarGrid stroke="#222222" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888888', fontSize: 12, fontWeight: 'bold' }} />
                <Radar name="Skill" dataKey="A" stroke="#C9A24B" fill="#C9A24B" fillOpacity={0.3} strokeWidth={2.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Badges Grid */}
          <div className="card-glass rounded-3xl p-6 border border-syncro-gold/20 shadow-card animate-fade-up">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={18} className="text-syncro-gold" />
              <h2 className="text-base font-bold text-white">Badges & Accolades</h2>
              <span className="ml-auto text-xs font-bold text-syncro-white-dim">{user.badges.length} Earned</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {user.badges.map(badge => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-syncro-black-soft border border-syncro-black-border hover:border-syncro-gold/40 hover:bg-syncro-black-hover transition-colors cursor-default"
                  title={badge.description}
                >
                  <div className="text-3xl">{badge.icon}</div>
                  <span className="text-[11px] font-bold text-syncro-white-muted text-center leading-tight">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rating History */}
        <div className="card-glass rounded-3xl p-6 border border-syncro-gold/20 shadow-card animate-fade-up">
          <div className="flex items-center gap-2 mb-6">
            <Zap size={18} className="text-syncro-gold" />
            <h2 className="text-base font-bold text-white">Rating Evolution History</h2>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={RATING_HISTORY}>
              <defs>
                <linearGradient id="ratingGradGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A24B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C9A24B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#888888', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888888', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="rating" stroke="#C9A24B" strokeWidth={3} fill="url(#ratingGradGold)"
                dot={{ fill: '#F5D98B', strokeWidth: 2, stroke: '#0A0A0A', r: 4 }} activeDot={{ r: 6, fill: '#FFFFFF' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Heatmap */}
        <div className="card-glass rounded-3xl p-6 border border-syncro-gold/20 shadow-card animate-fade-up">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-syncro-gold" />
            <h2 className="text-base font-bold text-white">Submission Activity Heatmap</h2>
            <span className="ml-auto text-xs font-semibold text-syncro-white-dim">Past 12 Months</span>
          </div>
          <ActivityHeatmap />
          <div className="flex items-center justify-end gap-2 mt-3 text-xs text-syncro-white-dim font-semibold">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map(v => (
              <div
                key={v}
                className={`w-3 h-3 rounded-sm ${
                  v === 0 ? 'bg-syncro-black-soft' : v === 1 ? 'bg-amber-950/60 border border-amber-900/40' : v === 2 ? 'bg-amber-800/80' : v === 3 ? 'bg-syncro-gold' : 'bg-syncro-gold-light'
                }`}
              />
            ))}
            <span>More</span>
          </div>
        </div>

      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          isOpen={Boolean(selectedCert)}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}
