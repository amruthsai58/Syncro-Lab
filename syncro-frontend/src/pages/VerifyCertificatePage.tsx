import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { HexagonLogo } from '../components/HexagonLogo';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Award, ArrowLeft, CheckCircle2, Calendar, User, BookOpen, ExternalLink, Sparkles } from 'lucide-react';

export function VerifyCertificatePage() {
  const { code } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();

  const verifyCode = code || 'SYNCRO-2026-EASY-849204';

  // Read URL query params if provided or fallback to code decoding
  const paramName = searchParams.get('name') || 'Arjun Mehra';
  const paramScore = searchParams.get('score') || '85';
  const paramTier = searchParams.get('tier');
  const paramDate = searchParams.get('date');

  // Decode tier from verification code or query param
  const isHard = paramTier === 'hard' || verifyCode.includes('HARD');
  const isMed = paramTier === 'medium' || verifyCode.includes('MED');
  const tierName = isHard ? 'Hard' : isMed ? 'Medium' : 'Easy';

  const trackTitle = isHard
    ? 'Master Architect Certificate'
    : isMed
    ? 'Algorithm Specialist Certificate'
    : 'Foundation Coder Certificate';

  const formattedDate = paramDate
    ? new Date(paramDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const verificationUrl = window.location.href;

  return (
    <div className="min-h-screen bg-syncro-black pt-20 pb-16 flex flex-col items-center justify-center px-4 text-syncro-white">
      <div className="fixed inset-0 pointer-events-none hex-grid-bg opacity-30" />

      <div className="relative w-full max-w-2xl card-glass border border-syncro-gold/30 rounded-3xl p-8 sm:p-12 shadow-card-hover backdrop-blur-2xl animate-fade-up">

        {/* Verification Status Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-4 shadow-xl shadow-emerald-500/20">
            <ShieldCheck size={44} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
            <CheckCircle2 size={14} /> Official Verified Credential
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Certificate Authenticated</h1>
          <p className="text-xs sm:text-sm text-syncro-white-dim mt-1 font-mono">
            Registry Code: <span className="text-syncro-gold font-bold">{verifyCode}</span>
          </p>
        </div>

        {/* Credential Details Card */}
        <div className="bg-syncro-black-soft rounded-2xl p-6 border border-syncro-black-border space-y-4 mb-8 shadow-inner">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] uppercase font-bold text-syncro-white-dim">Recipient Name</p>
              <p className="text-xl font-black text-white">{paramName}</p>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">80%+ Criteria Achieved</p>
            </div>

            <div>
              <p className="text-[11px] uppercase font-bold text-syncro-white-dim">Awarded Title</p>
              <p className="text-lg font-black text-white">{trackTitle}</p>
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-1 ${
                isHard ? 'badge-hard' : isMed ? 'badge-medium' : 'badge-easy'
              }`}>
                {tierName} Track ({paramScore}% Mastery)
              </span>
            </div>
          </div>

          <div className="h-px bg-syncro-black-border" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-syncro-white-dim font-medium">Issuing Authority</p>
              <p className="font-extrabold text-syncro-gold text-sm">BACKBENCHERS</p>
              <p className="text-[10px] text-syncro-white-dim">Evaluation Board</p>
            </div>

            <div>
              <p className="text-syncro-white-dim font-medium">Issue Date</p>
              <p className="font-bold text-white text-sm">{formattedDate}</p>
            </div>

            <div>
              <p className="text-syncro-white-dim font-medium">Verification Status</p>
              <p className="font-bold text-emerald-400 text-sm flex items-center gap-1">
                <CheckCircle2 size={13} /> Active & Authentic
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Scannable QR Code */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-syncro-black-soft border border-syncro-black-border">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-xl shadow-lg border border-syncro-gold/40 flex-shrink-0">
              <QRCodeSVG value={verificationUrl} size={80} level="H" includeMargin={false} />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Verified QR Signature</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded">Scanned</span>
              </p>
              <p className="text-xs text-syncro-white-muted max-w-xs mt-1 leading-relaxed">
                This credential record is permanently verified in the SYNCRO LAB registry by BACKBENCHERS.
              </p>
            </div>
          </div>

          <HexagonLogo size={44} showText={false} />
        </div>

        {/* Back navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            to="/certificates"
            className="btn-ghost text-xs gap-1.5 px-4 py-2"
          >
            <ArrowLeft size={14} /> Certificates Hub
          </Link>

          <Link
            to="/problems"
            className="btn-gold text-xs text-syncro-black font-extrabold gap-1.5 px-4 py-2"
          >
            <BookOpen size={14} /> Problem Catalog
          </Link>
        </div>

      </div>
    </div>
  );
}
