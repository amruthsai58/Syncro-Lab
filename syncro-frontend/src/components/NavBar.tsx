import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HexagonLogo, RankHex } from './HexagonLogo';
import { Code2, BookOpen, BarChart2, User, LogOut, Menu, X, Zap, Award, ShieldCheck, Monitor, Smartphone } from 'lucide-react';

const NAV_LINKS = [
  { to: '/problems', label: 'Problems', icon: Code2 },
  { to: '/certificates', label: 'Certificates (80%+)', icon: Award, highlight: true },
  { to: '/leaderboard', label: 'Leaderboard', icon: BarChart2 },
  { to: '/admin', label: 'Admin Portal', icon: ShieldCheck, adminBadge: true },
];

export function NavBar() {
  const { user, logout, isAuthenticated, devicePreference, setDevicePreference, isAdmin } = useAuth();
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

  const toggleDevice = () => {
    const nextMode = devicePreference === 'mobile' ? 'desktop' : 'mobile';
    setDevicePreference(nextMode);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled
        ? 'bg-syncro-black/95 backdrop-blur-xl border-b border-syncro-gold/20 shadow-lg shadow-black/60'
        : 'bg-syncro-black/75 backdrop-blur-md border-b border-syncro-black-border'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Brand Logo with Preserved Black & Gold Identity */}
        <Link to={isAuthenticated ? '/problems' : '/'} className="flex items-center gap-2 hover:opacity-95 transition-opacity">
          <HexagonLogo size={36} showText animated={!scrolled} />
        </Link>

        {/* Desktop Links */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1.5 bg-syncro-black-soft p-1.5 rounded-2xl border border-syncro-gold/20 backdrop-blur-md">
            {NAV_LINKS.map(({ to, label, icon: Icon, highlight, adminBadge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'text-syncro-black bg-syncro-gold shadow-md shadow-syncro-gold/30 font-extrabold'
                      : adminBadge
                      ? 'text-amber-300 hover:text-white hover:bg-syncro-black-hover'
                      : highlight
                      ? 'text-syncro-gold hover:text-syncro-gold-light hover:bg-syncro-black-hover'
                      : 'text-slate-300 hover:text-white hover:bg-syncro-black-hover'
                  }`
                }
              >
                <Icon size={15} className={adminBadge ? 'text-amber-400' : highlight ? 'text-syncro-gold' : ''} />
                {label}
                {highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-syncro-gold animate-pulse" />
                )}
                {adminBadge && isAdmin && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-md">
                    Active
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        )}

        {/* Right side Controls, Profile & Streak */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Quick Device Preference Toggle */}
              <button
                onClick={toggleDevice}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-syncro-black-card border border-syncro-gold/30 text-syncro-gold-light text-xs font-bold hover:bg-syncro-black-hover transition-colors"
                title={`Current mode: ${devicePreference || 'desktop'}. Click to switch.`}
              >
                {devicePreference === 'mobile' ? (
                  <><Smartphone size={14} className="text-syncro-gold" /> <span className="hidden sm:inline">Mobile Mode</span></>
                ) : (
                  <><Monitor size={14} className="text-syncro-gold" /> <span className="hidden sm:inline">Desktop Mode</span></>
                )}
              </button>

              {/* Streak Pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-syncro-gold/10 border border-syncro-gold/30 text-syncro-gold shadow-sm backdrop-blur-sm">
                <Zap size={14} className="text-syncro-gold fill-syncro-gold" />
                <span className="text-xs font-extrabold">{user.streakCount}d Streak</span>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  id="profile-menu-btn"
                  onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-syncro-black-card border border-syncro-black-border hover:border-syncro-gold hover:shadow-md transition-all duration-200"
                >
                  <RankHex tier={user.rankTier} size={24} />
                  <span className="hidden sm:block text-xs font-bold text-white max-w-[110px] truncate">
                    {user.displayName}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-syncro-black-card rounded-2xl border border-syncro-gold/30 shadow-2xl overflow-hidden animate-slide-down z-50 backdrop-blur-xl">
                    <div className="px-4 py-3 bg-syncro-black border-b border-syncro-black-border">
                      <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-syncro-gold">{user.rankTier} Tier</span>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-xs text-slate-400 font-medium">{user.rating} ELO</span>
                      </div>
                    </div>

                    <div className="py-1.5">
                      <Link
                        to={`/profile/${user.id}`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-syncro-black-hover transition-colors"
                      >
                        <User size={15} className="text-slate-400" /> My Profile & Analytics
                      </Link>

                      <Link
                        to="/certificates"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-syncro-gold hover:bg-syncro-gold/10 transition-colors"
                      >
                        <Award size={15} /> 80%+ Certificates Hub
                      </Link>

                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/10 transition-colors"
                      >
                        <ShieldCheck size={15} /> Admin Question Console
                      </Link>

                      <Link
                        to="/problems"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-syncro-black-hover transition-colors"
                      >
                        <BookOpen size={15} className="text-slate-400" /> Problem Catalog
                      </Link>
                    </div>

                    <div className="py-1 border-t border-syncro-black-border">
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
                className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-syncro-black-hover"
                onClick={() => setMobileOpen(o => !o)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          ) : (
            <Link to="/" className="btn-gold text-xs px-5 py-2 text-syncro-black font-extrabold">
              Enter Lab
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {mobileOpen && isAuthenticated && (
        <div className="md:hidden bg-syncro-black-card border-t border-syncro-black-border px-4 py-3 space-y-1 animate-slide-down">
          {NAV_LINKS.map(({ to, label, icon: Icon, highlight, adminBadge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'text-syncro-black bg-syncro-gold font-extrabold'
                    : adminBadge
                    ? 'text-amber-300 hover:bg-syncro-black-hover'
                    : highlight
                    ? 'text-syncro-gold hover:bg-syncro-black-hover'
                    : 'text-slate-300 hover:bg-syncro-black-hover'
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
