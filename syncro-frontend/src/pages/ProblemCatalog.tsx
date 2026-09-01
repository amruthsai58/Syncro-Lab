import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PROBLEM_LIST, MOCK_USER } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import type { ProblemListItem, Difficulty } from '../types';
import { Search, Filter, CheckCircle2, Circle, Minus, ChevronRight, Tag, Award, ArrowRight, QrCode } from 'lucide-react';

const DIFFICULTIES: (Difficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard'];
const POPULAR_TAGS = ['Array', 'Dynamic Programming', 'Graph', 'String', 'Binary Search', 'Stack', 'Hash Table', 'Tree', 'Two Pointers'];

const DIFF_BADGES: Record<Difficulty, string> = {
  Easy: 'badge-easy',
  Medium: 'badge-medium',
  Hard: 'badge-hard',
};

function ProblemRow({ problem, index }: { problem: ProblemListItem; index: number }) {
  return (
    <Link
      to={`/problems/${problem.slug}`}
      className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-syncro-black-card border border-syncro-black-border hover:border-syncro-gold/40 hover:bg-syncro-black-hover hover:shadow-card transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Status indicator */}
      <div className="flex-shrink-0 w-6 flex justify-center">
        {problem.isSolved ? (
          <CheckCircle2 size={20} className="text-emerald-400 fill-emerald-500/20" />
        ) : problem.isAttempted ? (
          <Minus size={20} className="text-syncro-gold" />
        ) : (
          <Circle size={20} className="text-syncro-white-dim group-hover:text-syncro-white-muted" />
        )}
      </div>

      {/* Number */}
      <span className="flex-shrink-0 w-8 text-sm font-mono font-bold text-syncro-white-dim">
        {index + 1}.
      </span>

      {/* Title + tags */}
      <div className="flex-1 min-w-0">
        <span className="font-bold text-syncro-white group-hover:text-syncro-gold-light transition-colors truncate block text-base">
          {problem.title}
        </span>
        <div className="flex gap-1.5 mt-1 flex-wrap">
          {problem.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-syncro-black-border text-syncro-white-dim font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Difficulty Pill */}
      <div className="flex-shrink-0">
        <span className={DIFF_BADGES[problem.difficulty]}>{problem.difficulty}</span>
      </div>

      {/* Acceptance rate */}
      <div className="hidden sm:flex flex-col items-end flex-shrink-0 w-24">
        <span className="text-xs font-bold text-syncro-white-muted">{problem.acceptanceRate.toFixed(1)}%</span>
        <div className="w-full bg-syncro-black-border rounded-full h-1.5 mt-1 overflow-hidden">
          <div
            className={`h-full rounded-full ${
              problem.difficulty === 'Easy'
                ? 'bg-emerald-400'
                : problem.difficulty === 'Medium'
                ? 'bg-syncro-gold'
                : 'bg-rose-400'
            }`}
            style={{ width: `${problem.acceptanceRate}%` }}
          />
        </div>
      </div>

      <ChevronRight size={18} className="flex-shrink-0 text-syncro-white-dim group-hover:text-syncro-gold group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

export function ProblemCatalog() {
  const { user: authUser } = useAuth();
  const user = authUser ?? MOCK_USER;

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() =>
    PROBLEM_LIST.filter(p => {
      if (difficulty !== 'All' && p.difficulty !== difficulty) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) &&
          !p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false;
      if (selectedTags.length > 0 && !selectedTags.every(t => p.tags.includes(t))) return false;
      return true;
    }), [search, difficulty, selectedTags]);

  const toggleTag = (tag: string) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const counts = useMemo(() => ({
    easy: PROBLEM_LIST.filter(p => p.difficulty === 'Easy').length,
    medium: PROBLEM_LIST.filter(p => p.difficulty === 'Medium').length,
    hard: PROBLEM_LIST.filter(p => p.difficulty === 'Hard').length,
  }), []);

  // Certificate completion percentages
  const easyPct = Math.round((user.easySolved / Math.max(1, counts.easy)) * 100);
  const medPct = Math.round((user.mediumSolved / Math.max(1, counts.medium)) * 100);
  const hardPct = Math.round((user.hardSolved / Math.max(1, counts.hard)) * 100);

  return (
    <div className="min-h-screen bg-syncro-black pt-20 pb-16 text-syncro-white">
      <div className="fixed inset-0 pointer-events-none hex-grid-bg opacity-30" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

        {/* ─── 80%+ Certificate Goal Tracker Banner ─── */}
        <div className="mb-8 p-6 rounded-3xl bg-syncro-black-card border border-syncro-gold/30 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-up">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-syncro-gold/15 border border-syncro-gold/30 text-syncro-gold-light text-xs font-bold uppercase tracking-wider">
              <Award size={13} className="text-syncro-gold" />
              <span>Signed by BACKBENCHERS · QR Verified</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">80% Mastery Certificate Tracks</h2>
            <p className="text-xs sm:text-sm text-syncro-white-muted max-w-lg">
              Reach 80% or more on Easy, Medium, or Hard tracks to claim your certified credential with live scannable QR verification.
            </p>
          </div>

          {/* Mini Track Progress Pills */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {/* Easy */}
            <div className="bg-syncro-black-soft px-3.5 py-2.5 rounded-2xl border border-emerald-500/30 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Easy 80%+</span>
              <span className="text-sm font-black text-white">{easyPct}%</span>
              <span className="text-[10px] text-syncro-white-dim block">{user.easySolved}/{counts.easy}</span>
            </div>

            {/* Medium */}
            <div className="bg-syncro-black-soft px-3.5 py-2.5 rounded-2xl border border-syncro-gold/30 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-syncro-gold block">Med 80%+</span>
              <span className="text-sm font-black text-white">{medPct}%</span>
              <span className="text-[10px] text-syncro-white-dim block">{user.mediumSolved}/{counts.medium}</span>
            </div>

            {/* Hard */}
            <div className="bg-syncro-black-soft px-3.5 py-2.5 rounded-2xl border border-rose-500/30 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">Hard 80%+</span>
              <span className="text-sm font-black text-white">{hardPct}%</span>
              <span className="text-[10px] text-syncro-white-dim block">{user.hardSolved}/{counts.hard}</span>
            </div>

            <Link
              to="/certificates"
              className="btn-gold text-xs px-4 py-3 rounded-2xl shadow-gold-sm flex items-center gap-1.5"
            >
              View Hub <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <p className="text-syncro-gold text-xs tracking-widest uppercase font-extrabold mb-1">Algorithmic Problem Set</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Practice & Compete</h1>
          <p className="text-syncro-white-muted text-sm">Solve challenges, benchmark execution speeds, and unlock official credentials.</p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-up">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-syncro-white-dim" />
            <input
              id="problem-search"
              type="text"
              placeholder="Search problems, topics, tags…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-dark pl-10 h-12"
            />
          </div>

          <button
            id="filter-toggle-btn"
            onClick={() => setShowFilters(v => !v)}
            className={`btn-ghost h-12 px-5 gap-2 ${showFilters ? 'border-syncro-gold text-syncro-gold' : ''}`}
          >
            <Filter size={16} />
            <span>Filter Topics</span>
          </button>
        </div>

        {/* Difficulty Tabs */}
        <div className="flex gap-2 mb-6 animate-fade-up flex-wrap items-center justify-between">
          <div className="flex gap-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  difficulty === d
                    ? 'btn-gold shadow-gold-sm text-syncro-black'
                    : 'bg-syncro-black-card border border-syncro-black-border text-syncro-white-muted hover:text-white hover:border-syncro-gold/40'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-syncro-white-dim">
            Showing <strong className="text-white">{filtered.length}</strong> problems
          </span>
        </div>

        {/* Tag Filters Box */}
        {showFilters && (
          <div className="card-glass p-5 rounded-2xl mb-6 shadow-card border border-syncro-gold/20 animate-slide-down">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={15} className="text-syncro-gold" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">Filter By Topic</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {POPULAR_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-syncro-gold text-syncro-black font-bold shadow-sm'
                      : 'bg-syncro-black-soft text-syncro-white-muted hover:bg-syncro-black-hover border border-syncro-black-border'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="mt-3 text-xs text-rose-400 font-semibold hover:underline"
              >
                Clear all tags
              </button>
            )}
          </div>
        )}

        {/* Problem Rows List */}
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-syncro-black-card rounded-3xl border border-syncro-black-border">
              <Search size={40} className="mx-auto mb-3 text-syncro-white-dim" />
              <p className="text-lg font-bold text-white">No problems found</p>
              <p className="text-xs text-syncro-white-dim mt-1">Try clearing some search filters.</p>
            </div>
          ) : (
            filtered.map((p, i) => <ProblemRow key={p.id} problem={p} index={i} />)
          )}
        </div>

      </div>
    </div>
  );
}
