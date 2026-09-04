import React, { useState } from 'react';
import type { Game, LeagueMember, UserPick } from '../types/pickem';
import { 
  Trophy, 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Radio, 
  MapPin, 
  LayoutGrid, 
  Table, 
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface LiveMatrixProps {
  games: Game[];
  members: LeagueMember[];
  userPicks: Record<string, UserPick>;
}

type ViewMode = 'war_room' | 'matrix';

export const LiveMatrix: React.FC<LiveMatrixProps> = ({ games, members, userPicks }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('war_room');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'LIVE' | 'TOP25' | 'FCS'>('ALL');
  const [previewAsOpponent, setPreviewAsOpponent] = useState(false);

  const filteredGames = games.filter((g) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'LIVE') return g.status === 'in';
    if (selectedFilter === 'TOP25') return (g.homeTeam.rank !== undefined && g.homeTeam.rank <= 25) || (g.awayTeam.rank !== undefined && g.awayTeam.rank <= 25);
    if (selectedFilter === 'FCS') return g.awayTeam.id === 'mtst' || g.homeTeam.id === 'mont' || g.league === 'CUSTOM';
    return true;
  });

  const isGameLocked = (game: Game) => {
    if (game.status === 'in' || game.status === 'post') return true;
    return new Date(game.kickoffTime).getTime() <= Date.now();
  };

  const getTeam = (game: Game, teamId: string) => {
    if (game.homeTeam.id === teamId) return game.homeTeam;
    if (game.awayTeam.id === teamId) return game.awayTeam;
    return null;
  };

  const getCoveringStatus = (game: Game, teamId: string) => {
    if (game.status === 'pre' || game.homeScore === undefined || game.awayScore === undefined) {
      return null;
    }

    const isHome = game.homeTeam.id === teamId;
    const homeMargin = game.homeScore + game.spread - game.awayScore;

    if (homeMargin === 0) return 'push';
    if (isHome) {
      return homeMargin > 0 ? 'win' : 'loss';
    } else {
      return homeMargin < 0 ? 'win' : 'loss';
    }
  };

  const getMemberGamePick = (member: LeagueMember, gameId: string) => {
    return member.isCurrentUser
      ? (userPicks[gameId] ? { selectedTeamId: userPicks[gameId].selectedTeamId } : member.picks[gameId])
      : member.picks[gameId];
  };

  // Compute live score dynamically for both 'in' (live covering) and 'post' (official final)
  const getLiveProjectedScore = (member: LeagueMember) => {
    let wins = 0;
    let pushes = 0;

    filteredGames.forEach((game) => {
      if (game.status === 'in' || game.status === 'post') {
        const pick = getMemberGamePick(member, game.id);
        if (pick?.selectedTeamId) {
          const status = getCoveringStatus(game, pick.selectedTeamId);
          if (status === 'win') wins += 1;
          else if (status === 'push') pushes += 1;
        }
      }
    });

    const anyStarted = filteredGames.some((g) => g.status === 'in' || g.status === 'post');
    if (!anyStarted) {
      return { wins: member.weeklyWins, pushes: 0, effectiveScore: member.weeklyWins };
    }

    return { wins, pushes, effectiveScore: wins + 0.5 * pushes };
  };

  const getLiveProjectedWins = (member: LeagueMember) => {
    return getLiveProjectedScore(member).wins;
  };

  // Sort members using 6-Tier Hierarchical Tiebreaker Standard
  const sortedMembers = [...members].sort((a, b) => {
    const scoreA = getLiveProjectedScore(a);
    const scoreB = getLiveProjectedScore(b);

    // Tier 1: Primary ATS Wins / Effective Score
    if (scoreB.effectiveScore !== scoreA.effectiveScore) {
      return scoreB.effectiveScore - scoreA.effectiveScore;
    }

    // Tier 2: Delta to Tiebreaker Game Total Score
    const tiebreakerGame = filteredGames[filteredGames.length - 1];
    if (
      tiebreakerGame &&
      (tiebreakerGame.status === 'in' || tiebreakerGame.status === 'post') &&
      tiebreakerGame.homeScore !== undefined &&
      tiebreakerGame.awayScore !== undefined
    ) {
      const actualTotal = tiebreakerGame.homeScore + tiebreakerGame.awayScore;
      const deltaA = Math.abs((a.tiebreakerPoints || 0) - actualTotal);
      const deltaB = Math.abs((b.tiebreakerPoints || 0) - actualTotal);
      if (deltaA !== deltaB) {
        return deltaA - deltaB; // Lowest delta wins
      }

      // Price-is-Right Directional Preference: Closest without going over
      const aIsUnder = (a.tiebreakerPoints || 0) <= actualTotal;
      const bIsUnder = (b.tiebreakerPoints || 0) <= actualTotal;
      if (aIsUnder && !bIsUnder) return -1;
      if (!aIsUnder && bIsUnder) return 1;
    }

    return 0;
  });

  const formatSpread = (spd: number) => {
    if (spd === 0) return 'PK';
    return spd > 0 ? `+${spd}` : `${spd}`;
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto px-2 sm:px-4 pb-24">
      {/* Header Controls & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-black text-white tracking-tight">
              Saturday Live Game Center
            </h2>
            <span className="flex items-center gap-1 bg-rose-950/80 border border-rose-800 text-rose-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
              <Radio className="w-3 h-3 text-rose-400" /> LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time down & distance, ball position, ATS sweat margins, and league picks.
          </p>
        </div>

        {/* View Toggle & Sport Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* War Room vs Spreadsheet Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('war_room')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'war_room'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>War Room Cards</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Grid Matrix</span>
            </button>
          </div>

          {/* College Football Category Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {([
              { id: 'ALL', label: 'All Games' },
              { id: 'LIVE', label: '🔴 Live Now' },
              { id: 'TOP25', label: 'Top 25' },
              { id: 'FCS', label: 'FCS' },
            ] as const).map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live "If Games Ended Right Now" Leaderboard Strip */}
      <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Live Projected Standings (If Games Ended Right Now)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Updates live with every score
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sortedMembers.map((member, idx) => {
            const projected = getLiveProjectedWins(member);
            const liveDiff = projected - member.weeklyWins;

            return (
              <div
                key={member.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  member.isCurrentUser
                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/20'
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                  </span>
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-700"
                  />
                  <div className="truncate">
                    <div className="font-bold text-white text-xs truncate flex items-center gap-1">
                      <span>{member.name}</span>
                      {member.isCurrentUser && (
                        <span className="text-[8px] bg-indigo-600 px-1 py-0.2 rounded font-black">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Official: {member.weeklyWins} pts
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-extrabold text-base text-emerald-400">
                    {projected} pts
                  </div>
                  {liveDiff > 0 && (
                    <div className="text-[9px] font-bold text-emerald-400 font-mono">
                      +{liveDiff} Live
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anti-Cheat Privacy & Opponent View Toggle */}
      <div className="bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">Anti-Cheat Privacy: </span>
            <span className="text-slate-300">
              Picks remain 100% confidential until kickoff. The instant a game kicks off, it locks and everyone's picks are revealed below in real time.
            </span>
          </div>
        </div>

        <button
          onClick={() => setPreviewAsOpponent(!previewAsOpponent)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all whitespace-nowrap self-start sm:self-auto shadow-sm ${
            previewAsOpponent
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 ring-1 ring-amber-500/40'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
          }`}
        >
          {previewAsOpponent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-indigo-400" />}
          <span>{previewAsOpponent ? 'Showing Opponent View (Active)' : 'Preview as Opponent'}</span>
        </button>
      </div>

      {/* VIEW 1: GAME DAY WAR ROOM (Interactive Cards with Ball Position & Who Picked Who) */}
      {viewMode === 'war_room' && (
        <div className="space-y-5">
          {filteredGames.map((game) => {
            const locked = isGameLocked(game);
            const isLive = game.status === 'in';
            const isFinal = game.status === 'post';
            const isUpcoming = game.status === 'pre' && !locked;

            const awaySpread = -game.spread;
            const homeSpread = game.spread;

            // Compute ATS cover margin if live or final
            const hasScores = game.homeScore !== undefined && game.awayScore !== undefined;
            const homeMargin = hasScores ? game.homeScore! + game.spread - game.awayScore! : 0;
            const isHomeCovering = hasScores && homeMargin > 0;
            const isAwayCovering = hasScores && homeMargin < 0;
            const isPush = hasScores && homeMargin === 0;
            const coverMargin = Math.abs(homeMargin);

            // Partition league members into who picked Home vs Away
            const awayPickers: { member: LeagueMember; isCovering: boolean }[] = [];
            const homePickers: { member: LeagueMember; isCovering: boolean }[] = [];
            let unrevealedCount = 0;

            members.forEach((m) => {
              const isUser = m.isCurrentUser;
              // If game is not locked, hide other players' picks
              if (!locked && (!isUser || previewAsOpponent)) {
                unrevealedCount += 1;
                return;
              }

              const pick = isUser 
                ? (userPicks[game.id] ? { selectedTeamId: userPicks[game.id].selectedTeamId } : m.picks[game.id])
                : m.picks[game.id];

              if (pick?.selectedTeamId === game.awayTeam.id) {
                awayPickers.push({
                  member: m,
                  isCovering: !isHomeCovering && !isPush,
                });
              } else if (pick?.selectedTeamId === game.homeTeam.id) {
                homePickers.push({
                  member: m,
                  isCovering: isHomeCovering && !isPush,
                });
              }
            });

            const totalRevealed = awayPickers.length + homePickers.length;
            const homePct = totalRevealed > 0 ? Math.round((homePickers.length / totalRevealed) * 100) : 50;
            const awayPct = totalRevealed > 0 ? 100 - homePct : 50;

            return (
              <div
                key={game.id}
                className={`rounded-2xl border overflow-hidden transition-all shadow-xl ${
                  isLive
                    ? 'bg-slate-900 border-indigo-500/50 ring-1 ring-indigo-500/30'
                    : isFinal
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                {/* Game Card Header: Venue, Weather, Clock/Status */}
                <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold px-2 py-0.5 rounded text-[10px] uppercase bg-amber-950 text-amber-300 border border-amber-800/60">
                      {game.league}
                    </span>
                    {game.location && (
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {game.location.stadium} • {game.location.city}, {game.location.state}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-medium">
                    {game.weather && (
                      <span className="text-slate-400 text-[11px] hidden sm:inline">
                        {game.weather.temperature}°F {game.weather.condition} • {game.weather.windMph} mph wind
                      </span>
                    )}
                    {isFinal ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-slate-300 font-bold bg-slate-800 px-2.5 py-0.5 rounded text-[11px] font-mono">
                          FINAL
                        </span>
                        <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            {isPush
                              ? 'ATS Push (Tied Spread)'
                              : isHomeCovering
                              ? `${game.homeTeam.name} COVERED ${formatSpread(homeSpread)} (by ${coverMargin.toFixed(1)} pts)`
                              : `${game.awayTeam.name} COVERED ${formatSpread(awaySpread)} (by ${coverMargin.toFixed(1)} pts)`}
                          </span>
                        </span>
                      </div>
                    ) : isLive ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded text-[11px] animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          {game.gameClock || 'LIVE'}
                        </span>
                        <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>
                            {isPush
                              ? 'Tied ATS'
                              : isHomeCovering
                              ? `${game.homeTeam.shortName} WINNING SPREAD ${formatSpread(homeSpread)} (+${coverMargin.toFixed(1)})`
                              : `${game.awayTeam.shortName} WINNING SPREAD ${formatSpread(awaySpread)} (+${coverMargin.toFixed(1)})`}
                          </span>
                        </span>
                      </div>
                    ) : (
                      <span className="text-indigo-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Upcoming Kickoff
                      </span>
                    )}
                  </div>
                </div>

                {/* Scoreboard & Ball Position Tracker */}
                <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-900 to-slate-925">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {/* Away Team Row */}
                    <div
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        isLive && isAwayCovering
                          ? 'bg-emerald-950/40 border-emerald-500/70 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                          : isFinal && isAwayCovering
                          ? 'bg-emerald-950/30 border-emerald-500/50'
                          : 'bg-slate-850/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={game.awayTeam.logoUrl}
                          alt={game.awayTeam.name}
                          className="w-12 h-12 object-contain"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            {game.awayTeam.rank && (
                              <span className="text-[10px] text-amber-400 font-bold bg-amber-950 px-1 py-0.2 rounded border border-amber-800">
                                #{game.awayTeam.rank}
                              </span>
                            )}
                            <span className="font-extrabold text-white text-base">
                              {game.awayTeam.name}
                            </span>
                            {game.situation?.possessionTeamId === game.awayTeam.id && (
                              <span className="text-xs animate-bounce" title="Has possession">
                                🏈
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            Spread: {formatSpread(awaySpread)} • {game.awayTeam.record}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          {(isLive || isFinal) && (
                            <div className={`font-mono font-black text-2xl sm:text-3xl ${
                              isAwayCovering ? 'text-emerald-400' : isFinal ? 'text-slate-400' : 'text-white'
                            }`}>
                              {game.awayScore}
                            </div>
                          )}
                          <div className="font-mono text-sm font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                            {formatSpread(awaySpread)}
                          </div>
                        </div>

                        {(isLive || isFinal) && (
                          <div className="font-mono text-xs">
                            {isFinal ? (
                              isAwayCovering ? (
                                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  ✓ COVERED (+{coverMargin.toFixed(1)})
                                </span>
                              ) : isHomeCovering ? (
                                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                  FAILED TO COVER
                                </span>
                              ) : (
                                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                  PUSH
                                </span>
                              )
                            ) : isLive ? (
                              isAwayCovering ? (
                                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                  WINNING SPREAD (+{coverMargin.toFixed(1)})
                                </span>
                              ) : isHomeCovering ? (
                                <span className="text-rose-400/80 text-[10px] font-bold uppercase tracking-wider">
                                  LOSING SPREAD (-{coverMargin.toFixed(1)})
                                </span>
                              ) : (
                                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                  TIED ATS
                                </span>
                              )
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Home Team Row */}
                    <div
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        isLive && isHomeCovering
                          ? 'bg-emerald-950/40 border-emerald-500/70 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                          : isFinal && isHomeCovering
                          ? 'bg-emerald-950/30 border-emerald-500/50'
                          : 'bg-slate-850/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={game.homeTeam.logoUrl}
                          alt={game.homeTeam.name}
                          className="w-12 h-12 object-contain"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            {game.homeTeam.rank && (
                              <span className="text-[10px] text-amber-400 font-bold bg-amber-950 px-1 py-0.2 rounded border border-amber-800">
                                #{game.homeTeam.rank}
                              </span>
                            )}
                            <span className="font-extrabold text-white text-base">
                              {game.homeTeam.name}
                            </span>
                            {game.situation?.possessionTeamId === game.homeTeam.id && (
                              <span className="text-xs animate-bounce" title="Has possession">
                                🏈
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            Spread: {formatSpread(homeSpread)} • {game.homeTeam.record}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          {(isLive || isFinal) && (
                            <div className={`font-mono font-black text-2xl sm:text-3xl ${
                              isHomeCovering ? 'text-emerald-400' : isFinal ? 'text-slate-400' : 'text-white'
                            }`}>
                              {game.homeScore}
                            </div>
                          )}
                          <div className="font-mono text-sm font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                            {formatSpread(homeSpread)}
                          </div>
                        </div>

                        {(isLive || isFinal) && (
                          <div className="font-mono text-xs">
                            {isFinal ? (
                              isHomeCovering ? (
                                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  ✓ COVERED (+{coverMargin.toFixed(1)})
                                </span>
                              ) : isAwayCovering ? (
                                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                  FAILED TO COVER
                                </span>
                              ) : (
                                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                  PUSH
                                </span>
                              )
                            ) : isLive ? (
                              isHomeCovering ? (
                                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                  WINNING SPREAD (+{coverMargin.toFixed(1)})
                                </span>
                              ) : isAwayCovering ? (
                                <span className="text-rose-400/80 text-[10px] font-bold uppercase tracking-wider">
                                  LOSING SPREAD (-{coverMargin.toFixed(1)})
                                </span>
                              ) : (
                                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                  TIED ATS
                                </span>
                              )
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Live Ball Position & Last Play Banner (Directly from ESPN API) */}
                  {isLive && game.situation && (
                    <div className="mt-3 bg-slate-950/80 border border-indigo-500/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">
                          BALL POSITION
                        </span>
                        <span className="font-mono font-bold text-slate-200">
                          {game.situation.downDistanceText}
                        </span>
                      </div>
                      {game.situation.lastPlayText && (
                        <div className="text-slate-400 text-[11px] truncate italic">
                          "{game.situation.lastPlayText}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* ATS Sweat Margin Indicator */}
                  {(isLive || isFinal) && hasScores && (
                    <div className="mt-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-white">
                          {isFinal ? 'Official ATS Result:' : 'Current ATS Cover Status:'}
                        </span>
                      </div>
                      <div className="font-mono font-bold">
                        {isPush ? (
                          <span className="text-amber-400">Push (Tied ATS)</span>
                        ) : isHomeCovering ? (
                          <span className="text-emerald-400">
                            {game.homeTeam.shortName} {isFinal ? 'COVERED' : 'is COVERING'} {formatSpread(homeSpread)} (by {Math.abs(homeMargin).toFixed(1)} pts)
                          </span>
                        ) : (
                          <span className="text-emerald-400">
                            {game.awayTeam.shortName} {isFinal ? 'COVERED' : 'is COVERING'} {formatSpread(awaySpread)} (by {Math.abs(homeMargin).toFixed(1)} pts)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* THE LEAGUE PICKS BREAKDOWN: WHO PICKED WHO */}
                <div className="p-4 bg-slate-950/90 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      League Picks Distribution {isUpcoming && '(Masked until Kickoff)'}
                    </span>
                    {totalRevealed > 0 && (
                      <span className="text-xs font-mono text-slate-400">
                        {awayPct}% {game.awayTeam.shortName} / {homePct}% {game.homeTeam.shortName}
                      </span>
                    )}
                  </div>

                  {/* Upcoming / Masked State */}
                  {isUpcoming ? (
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-sm">
                        <Lock className="w-4 h-4 text-slate-500" />
                        <span>All {members.length} League Picks Hidden Until Kickoff</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Players can switch picks freely right now. As soon as this game kicks off, everyone's pick will appear right here!
                      </p>
                    </div>
                  ) : (
                    /* Revealed State: Two Distinct Columns */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Away Pickers Column */}
                      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                          <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                            <img src={game.awayTeam.logoUrl} alt="" className="w-4 h-4 object-contain" />
                            {game.awayTeam.shortName} {formatSpread(awaySpread)} Pickers
                          </span>
                          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded">
                            {awayPickers.length}
                          </span>
                        </div>

                        {awayPickers.length === 0 ? (
                          <div className="text-xs text-slate-500 italic py-2">No one picked {game.awayTeam.shortName}</div>
                        ) : (
                          <div className="space-y-1.5">
                            {awayPickers.map(({ member, isCovering }) => (
                              <div
                                key={member.id}
                                className={`flex items-center justify-between p-1.5 rounded-lg text-xs font-medium ${
                                  (isLive || isFinal)
                                    ? isCovering
                                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
                                      : 'bg-rose-950/30 text-rose-400 border border-rose-900/40'
                                    : 'bg-slate-800/60 text-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <img
                                    src={member.avatarUrl}
                                    alt={member.name}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                  <span>{member.name}</span>
                                  {member.isCurrentUser && (
                                    <span className="text-[8px] bg-indigo-600 text-white font-bold px-1 rounded">
                                      YOU
                                    </span>
                                  )}
                                </div>
                                {(isLive || isFinal) && (
                                  <span className="font-mono text-[10px] font-bold">
                                    {isCovering ? '✓ Covering' : '✗ Trailing'}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Home Pickers Column */}
                      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                          <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                            <img src={game.homeTeam.logoUrl} alt="" className="w-4 h-4 object-contain" />
                            {game.homeTeam.shortName} {formatSpread(homeSpread)} Pickers
                          </span>
                          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded">
                            {homePickers.length}
                          </span>
                        </div>

                        {homePickers.length === 0 ? (
                          <div className="text-xs text-slate-500 italic py-2">No one picked {game.homeTeam.shortName}</div>
                        ) : (
                          <div className="space-y-1.5">
                            {homePickers.map(({ member, isCovering }) => (
                              <div
                                key={member.id}
                                className={`flex items-center justify-between p-1.5 rounded-lg text-xs font-medium ${
                                  (isLive || isFinal)
                                    ? isCovering
                                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
                                      : 'bg-rose-950/30 text-rose-400 border border-rose-900/40'
                                    : 'bg-slate-800/60 text-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <img
                                    src={member.avatarUrl}
                                    alt={member.name}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                  <span>{member.name}</span>
                                  {member.isCurrentUser && (
                                    <span className="text-[8px] bg-indigo-600 text-white font-bold px-1 rounded">
                                      YOU
                                    </span>
                                  )}
                                </div>
                                {(isLive || isFinal) && (
                                  <span className="font-mono text-[10px] font-bold">
                                    {isCovering ? '✓ Covering' : '✗ Trailing'}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: CLASSIC SPREADSHEET MATRIX (Full League Table) */}
      {viewMode === 'matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-950/90 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="sticky left-0 z-10 bg-slate-950/95 px-4 py-3.5 border-r border-slate-800 w-52">
                    Player / Standing
                  </th>
                  <th className="px-3 py-3.5 text-center border-r border-slate-800 w-24">
                    Points
                  </th>
                  {filteredGames.map((game) => {
                    const locked = isGameLocked(game);
                    const isLive = game.status === 'in';
                    const isFinal = game.status === 'post';

                    return (
                      <th
                        key={game.id}
                        className="px-3 py-3 text-center border-r border-slate-800 min-w-[110px]"
                      >
                        <div className="flex flex-col items-center">
                          <div className="font-extrabold text-slate-200 text-xs">
                            {game.awayTeam.abbreviation} @ {game.homeTeam.abbreviation}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {game.homeTeam.abbreviation}{' '}
                            {game.spread === 0 ? 'PK' : game.spread > 0 ? `+${game.spread}` : game.spread}
                          </div>
                          {isFinal ? (
                            <div className="flex flex-col items-center mt-1 gap-0.5">
                              <span className="text-[10px] text-slate-300 font-bold bg-slate-800 px-1.5 py-0.2 rounded font-mono">
                                {game.awayScore}-{game.homeScore}
                              </span>
                              {game.homeScore !== undefined && game.awayScore !== undefined && (
                                <span className="text-[9px] text-emerald-400 font-black">
                                  {game.homeScore + game.spread === game.awayScore
                                    ? 'PUSH'
                                    : game.homeScore + game.spread > game.awayScore
                                    ? `${game.homeTeam.abbreviation} Cov`
                                    : `${game.awayTeam.abbreviation} Cov`}
                                </span>
                              )}
                            </div>
                          ) : isLive ? (
                            <div className="flex flex-col items-center mt-1 gap-0.5">
                              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800/80 px-1.5 py-0.2 rounded font-mono animate-pulse">
                                {game.awayScore}-{game.homeScore}
                              </span>
                              {game.homeScore !== undefined && game.awayScore !== undefined && (
                                <span className="text-[9px] text-emerald-300 font-bold">
                                  {game.homeScore + game.spread === game.awayScore
                                    ? 'Tied ATS'
                                    : game.homeScore + game.spread > game.awayScore
                                    ? `${game.homeTeam.abbreviation} Lead ATS`
                                    : `${game.awayTeam.abbreviation} Lead ATS`}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 mt-1">
                              {locked ? 'Locked' : 'Upcoming'}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                  <th className="px-3 py-3 text-center min-w-[90px]">
                    Tiebreak
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60 text-sm">
                {sortedMembers.map((member, idx) => {
                  const isLeader = idx === 0;

                  return (
                    <tr
                      key={member.id}
                      className={`hover:bg-slate-850/50 transition-colors ${
                        member.isCurrentUser ? 'bg-indigo-950/20' : ''
                      }`}
                    >
                      {/* Sticky Player Column */}
                      <td className="sticky left-0 z-10 bg-slate-900/95 border-r border-slate-800 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold w-5 text-slate-400">
                            {isLeader ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                          </span>
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          />
                          <div className="truncate">
                            <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                              <span className="truncate">{member.name}</span>
                              {member.isCurrentUser && (
                                <span className="bg-indigo-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Season: {member.seasonWins}-{member.seasonLosses}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Points / Score Badge */}
                      <td className="px-3 py-3 text-center border-r border-slate-800">
                        <span className="font-mono font-extrabold text-base text-white">
                          {member.weeklyWins}
                        </span>
                        <span className="text-slate-500 text-xs font-normal"> pts</span>
                      </td>

                      {/* Game Pick Cells */}
                      {filteredGames.map((game) => {
                        const locked = isGameLocked(game);
                        const isUser = member.isCurrentUser;
                        
                        const pick = isUser 
                          ? (userPicks[game.id] ? { selectedTeamId: userPicks[game.id].selectedTeamId } : member.picks[game.id])
                          : member.picks[game.id];

                        const selectedTeam = pick?.selectedTeamId ? getTeam(game, pick.selectedTeamId) : null;
                        const coverStatus = selectedTeam ? getCoveringStatus(game, selectedTeam.id) : null;
                        const isFinal = game.status === 'post';
                        const isLive = game.status === 'in';

                        const hidePick = !locked && (!isUser || previewAsOpponent);

                        return (
                          <td
                            key={game.id}
                            className="px-2 py-3 text-center border-r border-slate-800/60"
                          >
                            {hidePick ? (
                              <div className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-slate-500">
                                <div className="flex items-center gap-1 text-[11px] font-bold">
                                  <Lock className="w-3 h-3 text-slate-500" />
                                  <span>Hidden</span>
                                </div>
                                <span className="text-[9px] text-slate-500 font-medium">
                                  Reveals at kick
                                </span>
                              </div>
                            ) : selectedTeam ? (
                              <div
                                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg font-bold text-xs transition-all ${
                                  isFinal
                                    ? coverStatus === 'win'
                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/80 shadow-sm'
                                    : coverStatus === 'loss'
                                    ? 'bg-rose-950/40 text-rose-400 border border-rose-900/60'
                                    : 'bg-amber-950/40 text-amber-300 border border-amber-900/60'
                                  : isLive
                                  ? coverStatus === 'win'
                                    ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500 shadow-emerald-500/20 animate-pulse'
                                    : 'bg-rose-950/30 text-rose-400 border border-rose-800/80'
                                  : 'bg-slate-800 text-slate-200 border border-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-1">
                                  <img
                                    src={selectedTeam.logoUrl}
                                    alt={selectedTeam.abbreviation}
                                    className="w-4 h-4 object-contain"
                                  />
                                  <span>{selectedTeam.abbreviation}</span>
                                </div>
                                {isFinal && (
                                  <span className="text-[10px] font-mono mt-0.5">
                                    {coverStatus === 'win' ? '✓ Win' : '✗ Loss'}
                                  </span>
                                )}
                                {isLive && (
                                  <span className="text-[9px] font-mono mt-0.5">
                                    {coverStatus === 'win' ? 'Covering' : 'Trailing'}
                                  </span>
                                )}
                                {!locked && isUser && (
                                  <span className="text-[9px] text-indigo-400 font-semibold mt-0.5 flex items-center gap-0.5">
                                    <EyeOff className="w-2.5 h-2.5" /> Hidden to others
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-600 italic">No pick</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Tiebreaker */}
                      <td className="px-3 py-3 text-center font-mono font-bold text-slate-300">
                        {member.tiebreakerPoints ? `${member.tiebreakerPoints} pts` : '--'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
