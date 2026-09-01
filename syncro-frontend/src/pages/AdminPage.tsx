import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProblems } from '../context/ProblemContext';
import type { Difficulty } from '../types';
import {
  ShieldCheck, KeyRound, Plus, Trash2, Edit3, ArrowLeft,
  CheckCircle2, AlertTriangle, Search, RefreshCw, X, Lock, Check
} from 'lucide-react';

export function AdminPage() {
  const { isAdmin, adminLogin, adminLogout, adminKey, setAdminKey } = useAuth();
  const { problems, addProblem, deleteProblem, resetToDefaults } = useProblems();

  const [inputKey, setInputKey] = useState('');
  const [authError, setAuthError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  
  // Add Problem Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('Medium');
  const [newDescription, setNewDescription] = useState('');
  const [newConstraints, setNewConstraints] = useState('1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4');
  const [newTags, setNewTags] = useState('Array, Dynamic Programming');
  const [newSampleInput, setNewSampleInput] = useState('nums = [1, 2, 3, 4]');
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Key Settings Modal State
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [currentKeyInput, setCurrentKeyInput] = useState('');
  const [newKeyInput, setNewKeyInput] = useState('');
  const [confirmKeyInput, setConfirmKeyInput] = useState('');
  const [keyError, setKeyError] = useState('');
  const [keySuccess, setKeySuccess] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setAuthError('Please enter the Master Admin Key.');
      return;
    }
    const success = adminLogin(inputKey);
    if (success) {
      setAuthError('');
      setInputKey('');
    } else {
      setAuthError('Invalid Admin Passcode. Access Denied.');
    }
  };

  const handleCreateProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) { setFormError('Problem title is required.'); return; }
    if (!newDescription.trim()) { setFormError('Problem description is required.'); return; }

    const constraintsArray = newConstraints.split('\n').map(s => s.trim()).filter(Boolean);
    const tagsArray = newTags.split(',').map(s => s.trim()).filter(Boolean);
    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    addProblem({
      title: newTitle.trim(),
      slug,
      difficulty: newDifficulty,
      description: newDescription.trim(),
      constraints: constraintsArray.length > 0 ? constraintsArray : ['1 <= n <= 10^5'],
      tags: tagsArray.length > 0 ? tagsArray : ['Algorithms'],
      companyTags: ['Amazon', 'Google', 'Microsoft'],
      examples: [
        { input: newSampleInput.trim() || 'nums = [1, 2, 3]', output: null },
      ],
      starterCode: {
        python: '',
        java: '',
        cpp: '',
        javascript: '',
        go: '',
      },
    });

    setSuccessToast(`Problem "${newTitle}" successfully added to the catalog!`);
    setTimeout(() => setSuccessToast(''), 4000);
    setIsAddModalOpen(false);

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewConstraints('1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4');
    setNewTags('Array, Dynamic Programming');
    setNewSampleInput('nums = [1, 2, 3, 4]');
    setFormError('');
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently remove "${title}" from SYNCRO LAB?`)) {
      deleteProblem(id);
      setSuccessToast(`Problem "${title}" removed.`);
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const handleUpdateKey = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyError('');
    setKeySuccess('');

    if (currentKeyInput.trim() !== adminKey.trim()) {
      setKeyError('Current passcode is incorrect.');
      return;
    }

    if (newKeyInput.trim().length < 4) {
      setKeyError('New passcode must be at least 4 characters long.');
      return;
    }

    if (newKeyInput.trim() !== confirmKeyInput.trim()) {
      setKeyError('New passcode and confirmation do not match.');
      return;
    }

    setAdminKey(newKeyInput.trim());
    setKeySuccess('Master Passcode successfully updated!');
    setTimeout(() => {
      setKeySuccess('');
      setIsKeyModalOpen(false);
      setCurrentKeyInput('');
      setNewKeyInput('');
      setConfirmKeyInput('');
    }, 1800);
  };

  // Filter problems
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'Hard').length;

  // ─── GATE 1: Unauthorized Screen ───
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-syncro-black flex flex-col items-center justify-center p-4 pt-16 text-white relative">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(circle, #C9A24B 0%, transparent 70%)' }}
        />

        <div className="relative w-full max-w-md bg-syncro-black-card border border-syncro-gold/40 rounded-3xl p-8 shadow-gold-lg space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-syncro-gold/10 border border-syncro-gold/30 flex items-center justify-center text-syncro-gold mx-auto">
            <Lock size={32} />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-white">Authorized Admin Portal</h1>
            <p className="text-xs text-syncro-white-muted">
              Access to question management is restricted to authorized platform administrators.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase font-bold text-syncro-gold mb-1.5 block">
                Enter Master Admin Key:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={inputKey}
                  onChange={e => { setInputKey(e.target.value); setAuthError(''); }}
                  placeholder="Enter passcode..."
                  className="w-full bg-syncro-black text-white font-mono text-sm px-4 py-3 pl-10 rounded-xl border border-syncro-black-border outline-none focus:border-syncro-gold"
                  autoFocus
                />
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-syncro-white-dim" />
              </div>
              {authError && (
                <p className="text-rose-400 text-xs font-semibold mt-1.5 flex items-center gap-1">
                  <AlertTriangle size={12} /> {authError}
                </p>
              )}
            </div>

            <button type="submit" className="w-full btn-gold py-3 text-syncro-black font-extrabold text-sm shadow-gold-sm">
              Authenticate & Unlock
            </button>
          </form>

          <div className="pt-3 border-t border-syncro-black-border text-center">
            <Link to="/problems" className="inline-flex items-center gap-1.5 text-xs text-syncro-white-dim hover:text-white transition-colors">
              <ArrowLeft size={13} /> Return to Problems Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── GATE 2: Authorized Management Dashboard ───
  return (
    <div className="min-h-screen bg-syncro-black flex flex-col pt-20 pb-16 text-syncro-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full space-y-8">

        {/* Top Action Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-syncro-black-card p-6 rounded-3xl border border-syncro-gold/30 shadow-card">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <ShieldCheck size={14} /> Authorized Administrator Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Question Management Dashboard
            </h1>
            <p className="text-xs text-syncro-white-muted">
              Add new coding questions, remove obsolete challenges, and maintain the problem database.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-gold px-5 py-2.5 text-xs font-extrabold text-syncro-black gap-2 shadow-gold-sm"
            >
              <Plus size={16} /> Add New Question
            </button>

            <button
              onClick={() => { setIsKeyModalOpen(true); setKeyError(''); setKeySuccess(''); }}
              className="btn-ghost px-4 py-2.5 text-xs gap-1.5"
            >
              <KeyRound size={14} className="text-syncro-gold" /> Change Passcode
            </button>

            <button
              onClick={adminLogout}
              className="px-4 py-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-bold transition-colors"
            >
              Lock Console
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-lg">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> {successToast}
            </span>
            <button onClick={() => setSuccessToast('')}><X size={14} /></button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-syncro-black-card p-5 rounded-2xl border border-syncro-black-border space-y-1">
            <p className="text-xs text-syncro-white-dim uppercase font-bold">Total Questions</p>
            <p className="text-2xl font-black text-white">{problems.length}</p>
          </div>
          <div className="bg-syncro-black-card p-5 rounded-2xl border border-syncro-black-border space-y-1">
            <p className="text-xs text-emerald-400 uppercase font-bold">Easy Track</p>
            <p className="text-2xl font-black text-emerald-400">{easyCount}</p>
          </div>
          <div className="bg-syncro-black-card p-5 rounded-2xl border border-syncro-black-border space-y-1">
            <p className="text-xs text-amber-400 uppercase font-bold">Medium Track</p>
            <p className="text-2xl font-black text-amber-400">{mediumCount}</p>
          </div>
          <div className="bg-syncro-black-card p-5 rounded-2xl border border-syncro-black-border space-y-1">
            <p className="text-xs text-rose-400 uppercase font-bold">Hard Track</p>
            <p className="text-2xl font-black text-rose-400">{hardCount}</p>
          </div>
        </div>

        {/* Question Database Table */}
        <div className="bg-syncro-black-card rounded-3xl border border-syncro-black-border overflow-hidden shadow-card">
          
          {/* Controls Bar */}
          <div className="p-5 bg-syncro-black-soft border-b border-syncro-black-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-syncro-white-dim" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search questions by title or tag…"
                className="w-full bg-syncro-black text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-syncro-black-border outline-none focus:border-syncro-gold"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="flex bg-syncro-black p-1 rounded-xl border border-syncro-black-border">
                {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(d)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      difficultyFilter === d
                        ? 'bg-syncro-gold text-syncro-black'
                        : 'text-syncro-white-dim hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <button
                onClick={resetToDefaults}
                title="Reset database to default questions"
                className="p-2.5 rounded-xl bg-syncro-black hover:bg-syncro-black-hover border border-syncro-black-border text-syncro-white-dim hover:text-white transition-colors"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-syncro-black/60 text-syncro-gold font-bold uppercase tracking-wider border-b border-syncro-black-border">
                <tr>
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">Question Title</th>
                  <th className="px-6 py-3.5">Difficulty</th>
                  <th className="px-6 py-3.5">Topics / Tags</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-syncro-black-border">
                {filteredProblems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-syncro-white-dim">
                      No questions matched your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProblems.map((prob, idx) => (
                    <tr key={prob.id} className="hover:bg-syncro-black-hover/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-syncro-white-dim font-bold">
                        #{idx + 1}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/problems/${prob.slug}`}
                          className="font-extrabold text-white hover:text-syncro-gold transition-colors text-sm"
                        >
                          {prob.title}
                        </Link>
                        <p className="text-[11px] text-slate-500 font-mono">/problems/{prob.slug}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={
                          prob.difficulty === 'Easy' ? 'badge-easy' : prob.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'
                        }>
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1.5 flex-wrap max-w-xs">
                          {prob.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-md bg-syncro-black border border-syncro-black-border text-[10px] text-syncro-white-dim font-semibold">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/problems/${prob.slug}`}
                            className="p-2 rounded-lg bg-syncro-black hover:bg-syncro-black-hover border border-syncro-black-border text-syncro-white-dim hover:text-white transition-colors"
                            title="Open Workspace"
                          >
                            <Edit3 size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(prob.id, prob.title)}
                            className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-300 hover:text-rose-100 transition-colors"
                            title="Delete Question"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* ─── MODAL 1: ADD NEW QUESTION ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-syncro-black-card border border-syncro-gold/40 rounded-3xl p-6 sm:p-8 shadow-gold-lg my-8 space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-syncro-black-border">
              <div className="flex items-center gap-2">
                <Plus size={20} className="text-syncro-gold" />
                <h2 className="text-xl font-extrabold text-white">Add New Problem to SYNCRO LAB</h2>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-syncro-white-dim hover:text-white">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <p className="text-rose-400 text-xs font-semibold bg-rose-950/50 p-3 rounded-xl border border-rose-800/40 flex items-center gap-1.5">
                <AlertTriangle size={14} /> {formError}
              </p>
            )}

            <form onSubmit={handleCreateProblem} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-syncro-gold mb-1 block">Question Title *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Reverse Linked List"
                    className="w-full bg-syncro-black px-3.5 py-2.5 rounded-xl border border-syncro-black-border text-white outline-none focus:border-syncro-gold font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-syncro-gold mb-1 block">Difficulty Tier *</label>
                  <select
                    value={newDifficulty}
                    onChange={e => setNewDifficulty(e.target.value as Difficulty)}
                    className="w-full bg-syncro-black px-3.5 py-2.5 rounded-xl border border-syncro-black-border text-white outline-none focus:border-syncro-gold font-sans"
                  >
                    <option value="Easy">Easy (Foundation Coder)</option>
                    <option value="Medium">Medium (Algorithm Specialist)</option>
                    <option value="Hard">Hard (Master Architect)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-syncro-gold mb-1 block">Problem Description *</label>
                <textarea
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  rows={4}
                  placeholder="Given the head of a singly linked list, reverse the list, and return the reversed list."
                  className="w-full bg-syncro-black p-3.5 rounded-xl border border-syncro-black-border text-white outline-none focus:border-syncro-gold font-sans resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-syncro-gold mb-1 block">Constraints (One per line)</label>
                <textarea
                  value={newConstraints}
                  onChange={e => setNewConstraints(e.target.value)}
                  rows={2}
                  placeholder="1 <= n <= 10^5"
                  className="w-full bg-syncro-black p-3 rounded-xl border border-syncro-black-border text-white font-mono outline-none focus:border-syncro-gold resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-syncro-gold mb-1 block">Topics / Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    placeholder="Linked List, Recursion"
                    className="w-full bg-syncro-black px-3.5 py-2.5 rounded-xl border border-syncro-black-border text-white outline-none focus:border-syncro-gold font-sans"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-syncro-gold mb-1 block">Sample Test Input</label>
                  <input
                    type="text"
                    value={newSampleInput}
                    onChange={e => setNewSampleInput(e.target.value)}
                    placeholder="head = [1, 2, 3, 4, 5]"
                    className="w-full bg-syncro-black px-3.5 py-2.5 rounded-xl border border-syncro-black-border text-white font-mono outline-none focus:border-syncro-gold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-syncro-black-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-syncro-black hover:bg-syncro-black-hover border border-syncro-black-border text-syncro-white-dim text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-6 py-2.5 text-xs text-syncro-black font-extrabold shadow-gold-sm"
                >
                  Publish Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: CHANGE MASTER KEY ─── */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-syncro-black-card border border-syncro-gold/40 rounded-3xl p-6 sm:p-8 shadow-gold-lg space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-syncro-black-border">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <KeyRound size={18} className="text-syncro-gold" /> Change Admin Master Passcode
              </h3>
              <button onClick={() => setIsKeyModalOpen(false)} className="text-syncro-white-dim hover:text-white">
                <X size={18} />
              </button>
            </div>

            {keyError && (
              <p className="text-rose-400 text-xs font-semibold bg-rose-950/50 p-2.5 rounded-xl border border-rose-800/40 flex items-center gap-1.5">
                <AlertTriangle size={14} /> {keyError}
              </p>
            )}

            {keySuccess && (
              <p className="text-emerald-400 text-xs font-bold bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/40 flex items-center gap-1.5">
                <Check size={14} /> {keySuccess}
              </p>
            )}

            <form onSubmit={handleUpdateKey} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] uppercase font-bold text-syncro-gold mb-1 block">Current Passcode:</label>
                <input
                  type="password"
                  value={currentKeyInput}
                  onChange={e => setCurrentKeyInput(e.target.value)}
                  placeholder="Enter current passcode..."
                  className="w-full bg-syncro-black text-white font-mono text-xs px-3.5 py-2.5 rounded-xl border border-syncro-black-border outline-none focus:border-syncro-gold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-syncro-gold mb-1 block">New Passcode:</label>
                <input
                  type="password"
                  value={newKeyInput}
                  onChange={e => setNewKeyInput(e.target.value)}
                  placeholder="Enter new passcode (min 4 chars)..."
                  className="w-full bg-syncro-black text-white font-mono text-xs px-3.5 py-2.5 rounded-xl border border-syncro-black-border outline-none focus:border-syncro-gold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-syncro-gold mb-1 block">Confirm New Passcode:</label>
                <input
                  type="password"
                  value={confirmKeyInput}
                  onChange={e => setConfirmKeyInput(e.target.value)}
                  placeholder="Re-enter new passcode..."
                  className="w-full bg-syncro-black text-white font-mono text-xs px-3.5 py-2.5 rounded-xl border border-syncro-black-border outline-none focus:border-syncro-gold"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-syncro-black hover:bg-syncro-black-hover border border-syncro-black-border text-syncro-white-dim text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-gold py-2.5 text-syncro-black font-extrabold text-xs shadow-gold-sm">
                  Save Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
