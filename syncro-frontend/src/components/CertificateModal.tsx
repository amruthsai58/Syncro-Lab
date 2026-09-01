import React, { useRef, useState, useEffect } from 'react';
import { HexagonLogo } from './HexagonLogo';
import { QRCodeSVG } from 'qrcode.react';
import type { Certificate, CertificateTier } from '../types';
import { Download, Printer, Share2, Check, X, ShieldCheck, Award, Sparkles, ExternalLink, Smartphone, Settings, Maximize2 } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate;
  isOpen: boolean;
  onClose: () => void;
}

const TIER_THEMES: Record<CertificateTier, {
  accentTitle: string;
  badgeBorder: string;
  badgeBg: string;
  badgeText: string;
}> = {
  easy: {
    accentTitle: 'text-emerald-700',
    badgeBorder: 'border-emerald-300',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
  },
  medium: {
    accentTitle: 'text-amber-700',
    badgeBorder: 'border-amber-300',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
  },
  hard: {
    accentTitle: 'text-rose-700',
    badgeBorder: 'border-rose-300',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-800',
  },
};

export function CertificateModal({ certificate, isOpen, onClose }: CertificateModalProps) {
  const [copied, setCopied] = useState(false);
  const [lanIp, setLanIp] = useState<string>('172.17.88.131');
  const [customHost, setCustomHost] = useState<string>('');
  const [showConfig, setShowConfig] = useState(false);
  const [enlargeQR, setEnlargeQR] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  // Fetch local LAN IP from backend so external phones on same network can scan & open SYNCRO LAB
  useEffect(() => {
    fetch('http://localhost:3001/api/network-info')
      .then(res => res.json())
      .then(data => {
        if (data?.lanIp && data.lanIp !== 'localhost') {
          setLanIp(data.lanIp);
        }
      })
      .catch(() => {
        setLanIp('172.17.88.131');
      });
  }, []);

  if (!isOpen) return null;

  const theme = TIER_THEMES[certificate.tier];

  // Active host IP for mobile phone camera scanning
  const activeHost = customHost.trim() || lanIp || (window.location.hostname === 'localhost' ? '172.17.88.131' : window.location.hostname);
  const port = window.location.port ? `:${window.location.port}` : ':5173';
  const protocol = window.location.protocol;
  
  // Compact, high-contrast, fast-scanning short URL
  const verificationUrl = `${protocol}//${activeHost}${port}/v/${certificate.verificationCode}`;

  const localVerificationUrl = `${window.location.origin}/v/${certificate.verificationCode}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8">

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 px-2 no-print">
          <div className="flex items-center gap-2 text-white">
            <Award className="text-amber-400" size={22} />
            <span className="font-bold text-base sm:text-lg">
              Official Credential · Verified by <span className="text-amber-400 font-black">BACKBENCHERS</span>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={localVerificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all shadow-sm"
              title="Open the live verification page directly in SYNCRO LAB"
            >
              <ExternalLink size={14} /> Open Verification
            </a>

            <button
              onClick={() => setShowConfig(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-syncro-black-card hover:bg-syncro-black-hover text-slate-300 hover:text-white text-xs font-semibold border border-syncro-black-border transition-colors"
              title="Configure Phone Scanning IP"
            >
              <Smartphone size={14} className="text-syncro-gold" />
              <span>Scanner IP</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-syncro-black-card hover:bg-syncro-black-hover text-white text-xs font-semibold border border-syncro-black-border transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>

            <button
              onClick={handlePrint}
              className="btn-gold text-xs px-4 py-1.5 shadow-lg text-syncro-black"
            >
              <Printer size={14} /> Print / Save PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-syncro-black-card hover:bg-syncro-black-hover text-slate-400 hover:text-white transition-colors border border-syncro-black-border ml-1"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Scanner IP Config Drawer */}
        {showConfig && (
          <div className="mb-3 p-4 rounded-2xl bg-syncro-black-card border border-syncro-gold/40 text-white shadow-card animate-slide-down no-print">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-syncro-gold flex items-center gap-1.5">
                  <Smartphone size={15} /> Mobile Phone QR Scanner Settings
                </p>
                <p className="text-[11px] text-syncro-white-muted mt-0.5">
                  Your phone must be on the same Wi-Fi network. Active IP: <strong className="text-white font-mono">{activeHost}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. 172.17.88.131"
                  value={customHost}
                  onChange={e => setCustomHost(e.target.value)}
                  className="bg-syncro-black-soft border border-syncro-black-border text-white text-xs px-3 py-1.5 rounded-xl outline-none focus:border-syncro-gold w-36 font-mono"
                />
                <button
                  onClick={() => setCustomHost(lanIp)}
                  className="text-xs font-bold text-syncro-gold hover:underline px-2"
                >
                  Reset IP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── High-Resolution Classic White Official Certificate ─── */}
        <div
          id="printable-certificate"
          ref={certRef}
          className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border-8 border-slate-950 overflow-hidden text-slate-900"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F8FAFC 100%)`,
          }}
        >
          {/* Ornate Outer Guilloche Gold Border */}
          <div className="absolute inset-2 sm:inset-3 border-2 border-amber-500/60 rounded-2xl pointer-events-none" />
          <div className="absolute inset-3 sm:inset-4 border border-dashed border-amber-600/50 rounded-xl pointer-events-none" />

          {/* Corner Ornaments */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500 pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500 pointer-events-none" />

          {/* Watermark Hexagon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
            <HexagonLogo size={520} />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">

            {/* Header / Logo */}
            <div className="flex items-center gap-3 mb-2">
              <HexagonLogo size={46} />
              <div className="text-left">
                <span className="font-display font-black text-xl tracking-[0.2em] text-slate-950 block">
                  SYNCRO LAB
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-600">
                  Global Competitive Engineering
                </span>
              </div>
            </div>

            <div className="w-56 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent my-3" />

            {/* Main Certificate Title */}
            <p className="text-xs uppercase font-extrabold tracking-[0.3em] text-slate-500 mb-1">
              Official Certificate of Mastery & Excellence
            </p>
            <h1 className="font-serif font-black text-2xl sm:text-4xl text-slate-950 mb-3 tracking-tight">
              {certificate.title}
            </h1>

            <p className="text-sm italic text-slate-600 max-w-lg mb-3">
              This credential is proudly and officially conferred upon
            </p>

            {/* Recipient Display Name */}
            <div className="relative inline-block mb-3 px-8 py-1.5">
              <div className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-serif tracking-wide underline decoration-amber-500 decoration-2 underline-offset-8">
                {certificate.recipientName}
              </div>
            </div>

            {/* Citation Statement */}
            <p className="text-xs sm:text-sm text-slate-700 max-w-xl leading-relaxed mt-2 mb-5">
              for successfully achieving an elite score of <strong className="text-slate-950 font-bold">{certificate.scorePercentage}%</strong> across the{' '}
              <span className="font-bold text-slate-950 uppercase">{certificate.tier} Question Track</span> on SYNCRO LAB, demonstrating verified algorithmic competency, code optimization, and exceptional problem-solving speed.
            </p>

            {/* Track Badge & Metrics Ribbon */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 my-2 py-2.5 px-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm">
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-slate-500">Track Category</p>
                <p className={`text-sm font-extrabold capitalize ${theme.accentTitle}`}>
                  {certificate.tier} Problem Track
                </p>
              </div>

              <div className="h-6 w-px bg-slate-200" />

              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-slate-500">Score Secured</p>
                <p className="text-sm font-extrabold text-slate-950">
                  {certificate.scorePercentage}% Mastery
                </p>
              </div>

              <div className="h-6 w-px bg-slate-200" />

              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-slate-500">Evaluation Status</p>
                <p className="text-sm font-extrabold text-emerald-600 flex items-center gap-1 justify-center">
                  <ShieldCheck size={14} /> 80%+ Verified
                </p>
              </div>
            </div>

            {/* Footer / Scannable Valid QR Code + Seal + BACKBENCHERS Signatures */}
            <div className="w-full grid grid-cols-3 items-end mt-8 pt-4 border-t border-slate-200 text-xs">
              
              {/* Left: Ultra-Crisp Scannable QR Code */}
              <div className="flex items-center gap-3 text-left">
                <a
                  href={verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2 bg-white border-2 border-slate-400 hover:border-amber-500 rounded-2xl shadow-lg flex-shrink-0 transition-all hover:scale-105 cursor-pointer"
                  title="Scan with any phone camera or click to open live verification"
                >
                  <QRCodeSVG
                    value={verificationUrl}
                    size={92}
                    level="M"
                    includeMargin={true}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[8px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to Verify
                  </span>
                </a>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-extrabold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1 shadow-sm">
                    <Smartphone size={11} className="text-indigo-600" /> Scan with Phone
                  </span>
                  <p className="text-[10px] font-mono text-slate-800 font-extrabold tracking-wider">
                    {certificate.verificationCode}
                  </p>
                  <p className="text-[9px] text-slate-500">
                    {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Center: Wax Seal Badge */}
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, #F5D98B 0%, #C9A24B 60%, #8E6B23 100%)`,
                    boxShadow: '0 4px 18px rgba(201, 162, 75, 0.45)',
                  }}
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-white/60 flex flex-col items-center justify-center text-slate-950 text-[9px] font-bold uppercase text-center leading-none">
                    <Sparkles size={14} className="text-slate-950 mb-0.5" />
                    <span>SYNCRO</span>
                    <span className="text-[7px]">SEAL</span>
                  </div>
                </div>
              </div>

              {/* Right: Signature from BACKBENCHERS */}
              <div className="text-right space-y-1">
                <div className="font-serif font-black text-lg sm:text-2xl tracking-wider text-slate-950 uppercase">
                  BACKBENCHERS
                </div>
                <div className="w-36 ml-auto h-0.5 bg-slate-900" />
                <p className="text-[10px] uppercase font-extrabold text-amber-700">
                  Lead Evaluation Authority
                </p>
                <p className="text-[9px] text-slate-500">
                  SYNCRO LAB Evaluation Board
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
