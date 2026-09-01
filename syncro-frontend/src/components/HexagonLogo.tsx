import React from 'react';

interface HexagonLogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
  showText?: boolean;
}

export function HexagonLogo({ size = 48, animated = false, className = '', showText = false }: HexagonLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative flex-shrink-0 ${animated ? 'animate-float' : ''}`} style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" width={size} height={size} className="hex-glow">
          <defs>
            {/* Rich Obsidian & Radiant Gold Gradients */}
            <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D98B" />
              <stop offset="50%" stopColor="#C9A24B" />
              <stop offset="100%" stopColor="#8E6B23" />
            </linearGradient>
            <linearGradient id="blackCore" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0A0A0A" />
            </linearGradient>
            <linearGradient id="innerGoldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Outer Gold Hexagon border */}
          <polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill="url(#goldRim)" />
          {/* Inner Deep Black Hexagon core */}
          <polygon points="50,14 84,32 84,68 50,86 16,68 16,32" fill="url(#blackCore)" />
          {/* Subtle gold inner accent facet */}
          <polygon points="50,22 75,35 75,65 50,78 25,65 25,35" fill="url(#innerGoldAccent)" opacity="0.12" />
          {/* </> Glyph in brilliant gold */}
          <text x="50" y="58" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="800" fontSize="24" fill="#F5D98B">
            {'</>'}
          </text>
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className="font-display font-extrabold tracking-widest text-white"
            style={{ fontSize: size * 0.35, letterSpacing: '0.15em' }}
          >
            SYNCRO<span className="text-amber-400">.</span>LAB
          </span>
          <span
            className="text-gold-gradient font-bold tracking-wider"
            style={{ fontSize: size * 0.19, letterSpacing: '0.08em' }}
          >
            Code · Practice · Evolve
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── HexLoader ───────────────────────────────────────────────────────────── */
export function HexLoader({ size = 56, message }: { size?: number; message?: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Spinning Gold Dashed Hexagon */}
        <svg viewBox="0 0 100 100" width={size} height={size} className="animate-hex-spin absolute inset-0" style={{ animationDuration: '2.5s' }}>
          <defs>
            <linearGradient id="spinGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9A24B" stopOpacity="0" />
              <stop offset="50%" stopColor="#F5D98B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C9A24B" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill="none" stroke="url(#spinGold)" strokeWidth="4" strokeDasharray="10 4" />
        </svg>
        {/* Inner pulsing core */}
        <svg viewBox="0 0 100 100" width={size * 0.7} height={size * 0.7} className="animate-hex-pulse absolute" style={{ top: '15%', left: '15%' }}>
          <polygon points="50,8 88,30 88,70 50,92 12,70 12,30" fill="#0F172A" stroke="#C9A24B" strokeWidth="2" />
          <text x="50" y="58" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" fontSize="22" fill="#F5D98B">{'</>'}</text>
        </svg>
      </div>
      {message && <p className="text-slate-600 font-medium text-sm animate-pulse">{message}</p>}
    </div>
  );
}

/* ─── RankHex ─────────────────────────────────────────────────────────────── */
const TIER_STYLES: Record<string, { fill: string; stroke: string; text: string }> = {
  Bronze:   { fill: '#78350F', stroke: '#B45309', text: '#FEF3C7' },
  Silver:   { fill: '#475569', stroke: '#94A3B8', text: '#F8FAFC' },
  Gold:     { fill: '#92400E', stroke: '#F59E0B', text: '#FEF3C7' },
  Platinum: { fill: '#0F766E', stroke: '#2DD4BF', text: '#CCFBF1' },
  Diamond:  { fill: '#1E40AF', stroke: '#60A5FA', text: '#DBEAFE' },
  Master:   { fill: '#6B21A8', stroke: '#C084FC', text: '#F3E8FF' },
};

export function RankHex({ tier, size = 36 }: { tier: string; size?: number }) {
  const s = TIER_STYLES[tier] ?? TIER_STYLES.Bronze;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="drop-shadow-sm flex-shrink-0">
      <polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill={s.fill} stroke={s.stroke} strokeWidth="4" />
      <text x="50" y="60" textAnchor="middle" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="30" fill={s.text}>
        {tier[0]}
      </text>
    </svg>
  );
}
