import React from 'react';
import { HexagonLogo } from './HexagonLogo';
import { Sparkles, ExternalLink } from 'lucide-react';

function LinkedInIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
    </svg>
  );
}

export const FOUNDERS = [
  {
    name: 'Amruth Sai G V',
    linkedin: 'https://www.linkedin.com/in/amruth-sai-220240341',
  },
  {
    name: 'Amit Mohite',
    linkedin: 'https://www.linkedin.com/in/amit-mohite-296ba13b6?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  },
  {
    name: 'Anas Ahmed',
    linkedin: 'https://linkedin.com/in/anas-ahmed-ab1a94362',
  },
  {
    name: 'Andanareddi L',
    linkedin: 'https://www.linkedin.com/in/andanaraddi-l-62a406312?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  },
  {
    name: 'Ameen Saab',
    linkedin: 'https://www.linkedin.com/in/ameensab-p-1a38b1334?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  },
  {
    name: 'Amith J Sharma',
    linkedin: 'https://www.linkedin.com/in/amith-j-sharma-661b66303?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  },
];

export function Footer() {
  return (
    <footer className="border-t border-syncro-black-border bg-syncro-black-soft text-syncro-white py-12 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background Subtle Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-32 rounded-full pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(ellipse, #C9A24B 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto space-y-8 relative">

        {/* Top: Brand Info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-syncro-black-border">
          <div className="flex items-center gap-3">
            <HexagonLogo size={32} showText />
          </div>
          <div className="flex items-center gap-2 text-xs text-syncro-gold font-bold">
            <Sparkles size={14} />
            <span>Certified & Governed by BACKBENCHERS</span>
          </div>
        </div>

        {/* Middle: Founders Section */}
        <div className="space-y-4">
          <div className="text-center sm:text-left">
            <p className="text-[11px] uppercase tracking-widest font-extrabold text-syncro-gold">
              Leadership & Founding Team
            </p>
            <h4 className="text-base font-extrabold text-white mt-0.5">Founders</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {FOUNDERS.map((founder, idx) => (
              <a
                key={founder.name}
                href={founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-syncro-black border border-syncro-black-border hover:border-syncro-gold/50 hover:bg-syncro-black-hover transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-syncro-gold/10 border border-syncro-gold/30 flex items-center justify-center text-syncro-gold font-mono font-bold text-xs group-hover:scale-105 transition-transform flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-white group-hover:text-syncro-gold transition-colors truncate">
                      {founder.name}
                    </p>
                    <p className="text-[10px] text-syncro-white-dim flex items-center gap-1 font-mono">
                      <span>LinkedIn Profile</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0077B5]/15 border border-[#0077B5]/30 text-[#0077B5] group-hover:bg-[#0077B5] group-hover:text-white transition-all text-xs font-bold flex-shrink-0">
                  <LinkedInIcon size={14} />
                  <ExternalLink size={11} className="opacity-70 group-hover:opacity-100" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="pt-6 border-t border-syncro-black-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-syncro-white-dim">
          <p>© 2026 SYNCRO LAB. All rights reserved.</p>
          <p className="text-[11px] text-slate-500 font-mono">
            Crafted for Algorithmic Excellence · Verified by BACKBENCHERS
          </p>
        </div>

      </div>
    </footer>
  );
}
