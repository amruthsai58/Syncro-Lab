import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HexagonLogo, RankHex } from './HexagonLogo';
import { Code2, BookOpen, BarChart2, User, LogOut, Menu, X, Zap, Award } from 'lucide-react';

const NAV_LINKS = [
  { to: '/problems', label: 'Problems', icon: Code2 },
  { to: '/certificates', label: 'Certificates (80%+)', icon: Award, highlight: true },
  { to: '/leaderboard', label: 'Leaderboard', icon: BarChart2 },
];

export function NavBar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled
        ? 'bg-slate-950/90 backdrop-blur-xl border-b border-indigo-500/20 shadow-lg shadow-black/40'
        : 'bg-slate-950/60 backdrop-blur-md border-b border-white/05'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Brand Logo with Preserved Black & Gold Identity */}
        <Link to={isAuthenticated ? '/problems' : '/'} className="flex items-center gap-2 hover:opacity-95 transition-opacity">
          <HexagonLogo size={36} showText animated={!scrolled} />
        </Link>

        {/* Desktop Links */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-indigo-500/20 backdrop-blur-md">
            {NAV_LINKS.map(({ to, label, icon: Icon, highlight }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/30'
                      : highlight
                      ? 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/80'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                <Icon size={15} className={highlight ? 'text-amber-400' : ''} />
                {label}
                {highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                )}
              </NavLink>
            ))}
          </div>
        )}

        {/* Right side Profile & Streak */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Streak Pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-sm backdrop-blur-sm">
                <Zap size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-extrabold">{user.streakCount}d Streak</span>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  id="profile-menu-btn"
                  onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-indigo-400 hover:shadow-md transition-all duration-200"
                >
                  <RankHex tier={user.rankTier} size={24} />
                  <span className="hidden sm:block text-xs font-bold text-white max-w-[110px] truncate">
                    {user.displayName}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-slate-900 rounded-2xl border border-indigo-500/30 shadow-2xl overflow-hidden animate-slide-down z-50 backdrop-blur-xl">
                    <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800">
                      <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-amber-400">{user.rankTier} Tier</span>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-xs text-slate-400 font-medium">{user.rating} ELO</span>
                      </div>
                    </div>

                    <div className="py-1.5">
                      <Link
                        to={`/profile/${user.id}`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <User size={15} className="text-slate-400" /> My Profile & Analytics
                      </Link>

                      <Link
                        to="/certificates"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-amber-400 hover:bg-amber-500/10 transition-colors"
                      >
                        <Award size={15} /> 80%+ Certificates Hub
                      </Link>

                      <Link
                        to="/problems"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <BookOpen size={15} className="text-slate-400" /> Problem Catalog
                      </Link>
                    </div>

                    <div className="py-1 border-t border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800"
                onClick={() => setMobileOpen(o => !o)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          ) : (
            <Link to="/" className="btn-primary text-xs px-5 py-2">
              Enter Lab
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {mobileOpen && isAuthenticated && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-1 animate-slide-down">
          {NAV_LINKS.map(({ to, label, icon: Icon, highlight }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'text-white bg-indigo-600'
                    : highlight
                    ? 'text-amber-400 hover:bg-slate-800'
                    : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </div>
      )}

      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </header>
  );
}
