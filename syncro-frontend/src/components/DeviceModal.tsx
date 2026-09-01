import React from 'react';
import { Monitor, Smartphone, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import type { DeviceMode } from '../context/AuthContext';

interface DeviceModalProps {
  isOpen: boolean;
  onSelect: (mode: DeviceMode) => void;
  candidateName: string;
}

export function DeviceModal({ isOpen, onSelect, candidateName }: DeviceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-syncro-black-card border border-syncro-gold/40 rounded-3xl p-6 sm:p-8 shadow-gold-lg text-white space-y-6">
        
        {/* Glow accent */}
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, #C9A24B 0%, transparent 70%)' }}
        />

        {/* Header */}
        <div className="text-center space-y-2 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-syncro-gold/10 border border-syncro-gold/30 text-syncro-gold text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} /> Interface Optimization
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Welcome, <span className="text-gold-gradient">{candidateName}</span>!
          </h2>
          <p className="text-sm text-syncro-white-muted">
            Are you using a desktop or a mobile? We will tailor your coding interface for the best experience.
          </p>
        </div>

        {/* Device Selection Cards */}
        <div className="grid sm:grid-cols-2 gap-4 relative">
          {/* Option 1: Desktop */}
          <button
            onClick={() => onSelect('desktop')}
            className="group text-left p-5 rounded-2xl bg-syncro-black border border-syncro-black-border hover:border-syncro-gold transition-all duration-300 hover:shadow-gold-sm hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-syncro-gold/10 border border-syncro-gold/30 flex items-center justify-center text-syncro-gold group-hover:scale-110 transition-transform">
                <Monitor size={24} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white group-hover:text-syncro-gold transition-colors flex items-center justify-between">
                  Desktop / Laptop
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-syncro-gold" />
                </h3>
                <p className="text-xs text-syncro-white-dim mt-1.5 leading-relaxed">
                  Dual-pane split IDE, side-by-side problem view, full Monaco editor, and multi-tab compiler.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-syncro-black-border flex items-center gap-1.5 text-[11px] font-bold text-syncro-gold">
              <CheckCircle2 size={13} /> High-productivity layout
            </div>
          </button>

          {/* Option 2: Mobile */}
          <button
            onClick={() => onSelect('mobile')}
            className="group text-left p-5 rounded-2xl bg-syncro-black border border-syncro-black-border hover:border-syncro-gold transition-all duration-300 hover:shadow-gold-sm hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-syncro-gold/10 border border-syncro-gold/30 flex items-center justify-center text-syncro-gold group-hover:scale-110 transition-transform">
                <Smartphone size={24} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white group-hover:text-syncro-gold transition-colors flex items-center justify-between">
                  Mobile / Tablet
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-syncro-gold" />
                </h3>
                <p className="text-xs text-syncro-white-dim mt-1.5 leading-relaxed">
                  Touch-friendly stacked interface, swipeable tabs, compact code editor, and quick buttons.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-syncro-black-border flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
              <CheckCircle2 size={13} /> Mobile & touch optimized
            </div>
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-500">
          You can switch interface modes anytime from the top navigation bar.
        </p>

      </div>
    </div>
  );
}
