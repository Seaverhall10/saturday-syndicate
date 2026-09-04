import React, { useState } from 'react';
import type { LeagueMember } from '../types/pickem';
import { Trophy, Share2, Check } from 'lucide-react';

interface StandingsProps {
  members: LeagueMember[];
}

export const Standings: React.FC<StandingsProps> = ({ members }) => {
  const [copied, setCopied] = useState(false);

  // Sort by cumulative ATS win percentage using Half-Point Model (Push = 0.5 win)
  const getMemberWinPct = (m: LeagueMember) => {
    const total = m.seasonWins + m.seasonLosses + m.seasonPushes;
    if (total === 0) return 0;
    return ((m.seasonWins + 0.5 * m.seasonPushes) / total) * 100;
  };

  const sorted = [...members].sort((a, b) => {
    const aPct = getMemberWinPct(a);
    const bPct = getMemberWinPct(b);
    if (bPct !== aPct) return bPct - aPct;
    return b.seasonWins - a.seasonWins; // Secondary: straight wins
  });

  const handleCopyForGroupChat = () => {
    const lines = [
      '🏆 SATURDAY SYNDICATE — LEAGUE STANDINGS',
      '──────────────────────────────',
    ];

    sorted.forEach((m, idx) => {
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`;
      const pct = getMemberWinPct(m).toFixed(1);
      lines.push(`${medal} ${m.name} — ${m.seasonWins}-${m.seasonLosses}-${m.seasonPushes} (${pct}%)`);
    });

    lines.push('──────────────────────────────');
    lines.push('🏈 Saturday Syndicate | NCAA College Football Pick\'em');

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-4 pb-20">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Season Championship Standings</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cumulative Against-The-Spread (ATS) record across all weeks (Push = 0.5 Win).
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyForGroupChat}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md self-start sm:self-auto ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4 text-amber-400" />}
          <span>{copied ? 'Copied to Clipboard! ✓' : '📱 Copy for Group Chat'}</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
              <th className="px-4 py-3.5 w-16 text-center">Rank</th>
              <th className="px-4 py-3.5">Player</th>
              <th className="px-3 py-3.5 text-center">Record (W-L-P)</th>
              <th className="px-3 py-3.5 text-center">Win %</th>
              <th className="px-3 py-3.5 text-center">This Week</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {sorted.map((member, idx) => {
              const winPct = getMemberWinPct(member).toFixed(1);

              return (
                <tr
                  key={member.id}
                  className={`hover:bg-slate-850/50 transition-colors ${
                    member.isCurrentUser ? 'bg-indigo-950/20' : ''
                  }`}
                >
                  <td className="px-4 py-4 text-center font-bold font-mono">
                    {idx === 0 ? (
                      <span className="text-lg">🥇</span>
                    ) : idx === 1 ? (
                      <span className="text-lg">🥈</span>
                    ) : idx === 2 ? (
                      <span className="text-lg">🥉</span>
                    ) : (
                      <span className="text-slate-400 text-xs">{idx + 1}</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{member.name}</span>
                          {member.isCurrentUser && (
                            <span className="bg-indigo-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                              YOU
                            </span>
                          )}
                          {member.isCommissioner && (
                            <span className="bg-amber-600/30 border border-amber-500/50 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              COMMISH
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center font-mono font-bold text-white">
                    {member.seasonWins}-{member.seasonLosses}
                    {member.seasonPushes > 0 && `-${member.seasonPushes}`}
                  </td>
                  <td className="px-3 py-4 text-center font-mono font-bold text-emerald-400">
                    {winPct}%
                  </td>
                  <td className="px-3 py-4 text-center font-mono font-bold text-slate-300">
                    {member.weeklyWins} pts
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
