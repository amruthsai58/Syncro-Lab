import React, { useMemo } from 'react';
import { LEADERBOARD } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { RankHex } from '../components/HexagonLogo';
import { TrendingUp, TrendingDown, Flame, Trophy, Award, Star, UserCheck } from 'lucide-react';
import type { LeaderboardEntry } from '../types';

function RatingChange({ change }: { change?: number }) {
  if (!change) return <span className="text-syncro-white-dim text-xs">—</span>;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-bold ${change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
      {change > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
      {change > 0 ? '+' : ''}{change}
    </span>
  );
}

export function LeaderboardPage() {
  const { user } = useAuth();

  // Combine real community list with the logged-in candidate
  const dynamicLeaderboard = useMemo<LeaderboardEntry[]>(() => {
    const list: LeaderboardEntry[] = [...LEADERBOARD];

    if (user && user.displayName) {
      const existingIdx = list.findIndex(
        e => e.user.displayName.toLowerCase() === user.displayName.toLowerCase()
      );

      if (existingIdx === -1) {
        // Add candidate to the board dynamically
        list.push({
          rank: 0,
          user: {
            id: user.id || 'candidate-user',
            displayName: user.displayName,
            rating: user.rating || 1950,
            rankTier: user.rankTier || 'Gold',
            totalSolved: user.totalSolved || 84,
            streakCount: user.streakCount || 12,
          },
          ratingChange: +15,
        });
      } else {
        // Update candidate's live profile details
        list[existingIdx] = {
          ...list[existingIdx],
          user: {
            ...list[existingIdx].user,
            rating: user.rating || list[existingIdx].user.rating,
            totalSolved: user.totalSolved || list[existingIdx].user.totalSolved,
            streakCount: user.streakCount || list[existingIdx].user.streakCount,
          }
        };
      }
    }

    // Sort by rating descending and re-assign ranks
    list.sort((a, b) => b.user.rating - a.user.rating);
    return list.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [user]);

  const top3 = dynamicLeaderboard.slice(0, 3);
  const rest = dynamicLeaderboard.slice(3);

  return (
    <div className="min-h-screen bg-syncro-black pt-20 pb-16 text-syncro-white">
      <div className="fixed inset-0 pointer-events-none hex-grid-bg opacity-30" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-syncro-gold/10 border border-syncro-gold/30 text-syncro-gold-light text-xs font-bold uppercase tracking-wider mb-3">
            <Trophy size={14} className="text-syncro-gold" /> Global Standings
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Verified Global Leaderboard</h1>
          <p className="text-syncro-white-muted text-sm">
            Ranked by authentic ELO rating, real solve consistency, and verified 80%+ certificate credentials.
          </p>
        </div>

        {/* Top 3 Radiant Gold Podium */}
        <div className="flex items-end justify-center gap-4 mb-14 animate-fade-up">

          {/* 2nd Place (Silver) */}
          {top3[1] && (
            <div className="flex flex-col items-center gap-2.5 w-36 sm:w-44">
              <RankHex tier={top3[1].user.rankTier} size={48} />
              <div className="text-center">
                <p className="font-bold text-white text-sm truncate max-w-[130px] sm:max-w-none">
                  {top3[1].user.displayName}
                </p>
                <p className="text-syncro-white-dim text-xs font-semibold">{top3[1].user.rating} ELO</p>
              </div>
              <div
                className="w-full h-28 rounded-t-2xl flex flex-col items-center justify-center gap-1 shadow-card border border-slate-700/60"
                style={{ background: 'linear-gradient(180deg, #475569 0%, #1E293B 100%)' }}
              >
                <Star size={20} className="text-slate-300" />
                <span className="text-3xl font-black text-white">2</span>
              </div>
            </div>
          )}

          {/* 1st Place (Gold) */}
          {top3[0] && (
            <div className="flex flex-col items-center gap-2.5 w-40 sm:w-52 -mt-8">
              <div className="relative">
                <Trophy size={30} className="text-syncro-gold absolute -top-9 left-1/2 -translate-x-1/2 animate-float drop-shadow-md" />
                <RankHex tier={top3[0].user.rankTier} size={64} />
              </div>
              <div className="text-center">
                <p className="font-extrabold text-white text-base truncate max-w-[150px] sm:max-w-none">
                  {top3[0].user.displayName}
                </p>
                <p className="text-syncro-gold font-bold text-xs">{top3[0].user.rating} ELO</p>
              </div>
              <div
                className="w-full h-40 rounded-t-3xl flex flex-col items-center justify-center gap-1 shadow-gold-lg border border-amber-400/40"
                style={{
                  background: 'linear-gradient(180deg, #F5D98B 0%, #C9A24B 50%, #8E6B23 100%)',
                }}
              >
                <span className="text-4xl font-black text-syncro-black">1</span>
              </div>
            </div>
          )}

          {/* 3rd Place (Bronze) */}
          {top3[2] && (
            <div className="flex flex-col items-center gap-2.5 w-36 sm:w-44">
              <RankHex tier={top3[2].user.rankTier} size={44} />
              <div className="text-center">
                <p className="font-bold text-white text-sm truncate max-w-[130px] sm:max-w-none">
                  {top3[2].user.displayName}
                </p>
                <p className="text-syncro-white-dim text-xs font-semibold">{top3[2].user.rating} ELO</p>
              </div>
              <div
                className="w-full h-20 rounded-t-2xl flex flex-col items-center justify-center gap-1 shadow-card border border-amber-900/60"
                style={{ background: 'linear-gradient(180deg, #92400E 0%, #451A03 100%)' }}
              >
                <span className="text-2xl font-black text-amber-200">3</span>
              </div>
            </div>
          )}
        </div>

        {/* Full Table */}
        <div className="card-glass rounded-3xl overflow-hidden border border-syncro-gold/20 shadow-card animate-fade-up">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-3.5 bg-syncro-black-soft border-b border-syncro-black-border text-xs text-syncro-white-dim uppercase tracking-wider font-extrabold">
            <span className="w-8 text-center">Rank</span>
            <span>Engineer</span>
            <span className="hidden sm:block text-center">Problems Solved</span>
            <span className="hidden md:block text-center">Day Streak</span>
            <span className="text-right">Rating</span>
          </div>

          {/* Rows */}
          {rest.map((entry) => {
            const isCurrentUser = user?.displayName && entry.user.displayName.toLowerCase() === user.displayName.toLowerCase();

            return (
              <div
                key={entry.user.id}
                className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-4 border-b border-syncro-black-border/60 transition-colors items-center ${
                  isCurrentUser
                    ? 'bg-syncro-gold/10 border-l-4 border-l-syncro-gold hover:bg-syncro-gold/15'
                    : 'hover:bg-syncro-black-hover'
                }`}
              >
                <span className={`text-base font-black w-8 text-center ${isCurrentUser ? 'text-syncro-gold' : 'text-syncro-white-dim'}`}>
                  {entry.rank}
                </span>

                <div className="flex items-center gap-3 min-w-0">
                  <RankHex tier={entry.user.rankTier} size={32} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-sm truncate">{entry.user.displayName}</p>
                      {isCurrentUser && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-syncro-gold text-syncro-black font-extrabold flex items-center gap-1 shadow-sm">
                          <UserCheck size={11} /> YOU
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-syncro-white-dim font-semibold">{entry.user.rankTier} Tier</p>
                  </div>
                </div>

                <span className="hidden sm:block text-sm font-semibold text-syncro-white-muted text-center">
                  {entry.user.totalSolved} solved
                </span>

                <div className="hidden md:flex items-center justify-center gap-1">
                  <Flame size={14} className="text-syncro-gold" />
                  <span className="text-sm font-bold text-syncro-white-muted">{entry.user.streakCount}d</span>
                </div>

                <div className="flex flex-col items-end gap-0.5">
                  <span className="font-black text-white text-sm">{entry.user.rating}</span>
                  <RatingChange change={entry.ratingChange} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Rank Tier Legend */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
          {['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'].map(tier => (
            <div key={tier} className="flex items-center gap-2 card-solid px-3.5 py-1.5 rounded-full border border-syncro-black-border">
              <RankHex tier={tier} size={20} />
              <span className="text-xs font-bold text-syncro-white-dim">{tier}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
