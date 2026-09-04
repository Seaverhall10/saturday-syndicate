import React, { useState } from 'react';
import type { Game, UserPick, TiebreakerPick } from '../types/pickem';
import { 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PickSheetProps {
  games: Game[];
  picks: Record<string, UserPick>;
  tiebreaker: TiebreakerPick;
  onSelectPick: (gameId: string, teamId: string, spread: number) => void;
  onTiebreakerChange: (score: number) => void;
  onSubmitPicks: () => void;
}

export const PickSheet: React.FC<PickSheetProps> = ({
  games,
  picks,
  tiebreaker,
  onSelectPick,
  onTiebreakerChange,
  onSubmitPicks,
}) => {
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [justSavedId, setJustSavedId] = useState<string | null>(null);

  const toggleNotes = (gameId: string) => {
    setExpandedNotes((prev) => ({ ...prev, [gameId]: !prev[gameId] }));
  };

  const isGameLocked = (game: Game) => {
    if (game.status === 'in' || game.status === 'post') return true;
    return new Date(game.kickoffTime).getTime() <= Date.now();
  };

  const formatKickoff = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatSpread = (spd: number) => {
    if (spd === 0) return 'PK';
    return spd > 0 ? `+${spd}` : `${spd}`;
  };

  const picksMade = Object.keys(picks).length;
  const totalPicks = games.length;
  const isComplete = picksMade >= totalPicks && totalPicks > 0;

  const handlePickClick = (gameId: string, teamId: string, spread: number) => {
    onSelectPick(gameId, teamId, spread);
    setJustSavedId(gameId);
    setTimeout(() => setJustSavedId(null), 1200);
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    onSubmitPicks();
  };

  return (
    <div className="space-y-4 pb-24 max-w-3xl mx-auto px-2 sm:px-4">
      {/* Sleek Floating Status Bar */}
      <div className="sticky top-2 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-3 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-extrabold text-base sm:text-lg tracking-tight">
              {picksMade}
            </span>
            <span className="text-slate-500 font-medium text-sm">/ {totalPicks}</span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline ml-1">Picks</span>
          </div>

          {/* Mini Segmented Progress Dots */}
          <div className="flex items-center gap-1">
            {games.map((g) => (
              <div
                key={g.id}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  picks[g.id]
                    ? 'w-3 bg-indigo-500 shadow-sm shadow-indigo-500/50'
                    : 'w-1.5 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Auto-Saved</span>
          </div>

          {isComplete && (
            <button
              onClick={handleCelebrate}
              className="text-xs font-bold text-amber-300 hover:text-white bg-amber-950/60 hover:bg-amber-900 border border-amber-800/60 px-3 py-1 rounded-full transition-all flex items-center gap-1 active:scale-95 shadow-sm"
              title="All picks ready! Click to celebrate"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Celebrate</span>
            </button>
          )}
        </div>
      </div>

      {/* Game Cards List */}
      <div className="space-y-3">
        {games.map((game) => {
          const locked = isGameLocked(game);
          const currentPick = picks[game.id];
          const awaySpread = -game.spread;
          const homeSpread = game.spread;

          const isAwayPicked = currentPick?.selectedTeamId === game.awayTeam.id;
          const isHomePicked = currentPick?.selectedTeamId === game.homeTeam.id;

          const isFinal = game.status === 'post';
          const isLive = game.status === 'in';
          const notesExpanded = !!expandedNotes[game.id];
          const hasNotes = game.notes && game.notes.length > 0;
          const wasJustSaved = justSavedId === game.id;

          const hasScores = (isLive || isFinal) && game.homeScore !== undefined && game.awayScore !== undefined;
          const homeScore = game.homeScore ?? 0;
          const awayScore = game.awayScore ?? 0;
          // ATS Margin: positive means Home covered, negative means Away covered
          const homeMargin = hasScores ? homeScore + homeSpread - awayScore : 0;
          const isPush = hasScores && homeMargin === 0;
          const homeCovered = hasScores && homeMargin > 0;
          const awayCovered = hasScores && homeMargin < 0;
          const coverMargin = Math.abs(homeMargin);

          // Determine user's pick result
          const isUserHome = currentPick?.selectedTeamId === game.homeTeam.id;
          const isUserAway = currentPick?.selectedTeamId === game.awayTeam.id;
          let userPickStatus: 'won' | 'lost' | 'push' | null = null;
          if (hasScores && currentPick) {
            if (isPush) userPickStatus = 'push';
            else if (isUserHome) userPickStatus = homeCovered ? 'won' : 'lost';
            else if (isUserAway) userPickStatus = awayCovered ? 'won' : 'lost';
          }

          return (
            <div
              key={game.id}
              className={`rounded-2xl border transition-all duration-150 overflow-hidden ${
                isFinal && userPickStatus === 'won'
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg'
                  : isFinal && userPickStatus === 'lost'
                  ? 'bg-slate-900/90 border-rose-900/40 shadow'
                  : locked
                  ? 'bg-slate-900/50 border-slate-800/70'
                  : wasJustSaved
                  ? 'bg-slate-900 border-indigo-500/80 ring-1 ring-indigo-500/40 shadow-lg'
                  : currentPick
                  ? 'bg-slate-900 border-slate-800 shadow'
                  : 'bg-slate-900/90 border-slate-800/80 shadow hover:border-slate-700'
              }`}
            >
              {/* Clean 1-Line Header with ATS Cover Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/50 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-semibold">
                    {formatKickoff(game.kickoffTime)}
                  </span>
                  {game.isTiebreaker && (
                    <span className="bg-purple-950/80 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded text-[10px] font-bold">
                      ⭐ Tiebreaker
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-medium">
                  {isFinal ? (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                        FINAL
                      </span>
                      {isPush ? (
                        <span className="text-amber-400 text-[11px] font-bold">
                          ATS Push (Tied)
                        </span>
                      ) : homeCovered ? (
                        <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{game.homeTeam.shortName} Covered {formatSpread(homeSpread)} (by {coverMargin.toFixed(1)})</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{game.awayTeam.shortName} Covered {formatSpread(awaySpread)} (by {coverMargin.toFixed(1)})</span>
                        </span>
                      )}

                      {userPickStatus === 'won' && (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                          🏆 You Won
                        </span>
                      )}
                      {userPickStatus === 'lost' && (
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                          ✕ Pick Lost
                        </span>
                      )}
                      {userPickStatus === 'push' && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                          ↔ Push
                        </span>
                      )}
                    </div>
                  ) : isLive ? (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {game.gameClock || 'LIVE'}
                      </span>
                      {hasScores && (
                        <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>
                            {isPush
                              ? 'Tied ATS'
                              : homeCovered
                              ? `${game.homeTeam.shortName} WINNING SPREAD ${formatSpread(homeSpread)} (+${coverMargin.toFixed(1)})`
                              : `${game.awayTeam.shortName} WINNING SPREAD ${formatSpread(awaySpread)} (+${coverMargin.toFixed(1)})`}
                          </span>
                        </span>
                      )}
                    </div>
                  ) : locked ? (
                    <span className="flex items-center gap-1 text-rose-400 text-[11px] font-semibold">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px] font-medium">
                      Picks open
                    </span>
                  )}
                </div>
              </div>

              {/* Matchup Selection Cards */}
              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Away Team */}
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => handlePickClick(game.id, game.awayTeam.id, awaySpread)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isAwayPicked
                      ? isFinal && userPickStatus === 'won'
                        ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950/50'
                        : isFinal && userPickStatus === 'lost'
                        ? 'bg-rose-950/60 border-rose-800/80 ring-1 ring-rose-500/30 opacity-90'
                        : isLive && awayCovered
                        ? 'bg-emerald-950/70 border-emerald-500/80 ring-2 ring-emerald-500/40 shadow-lg'
                        : 'bg-indigo-950/90 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                      : locked
                      ? isFinal && awayCovered
                        ? 'bg-slate-900/80 border-emerald-500/30'
                        : 'bg-slate-900/40 border-slate-800/50 opacity-70 cursor-not-allowed'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850/60 active:scale-[0.99]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={game.awayTeam.logoUrl}
                      alt={game.awayTeam.name}
                      className="w-10 h-10 object-contain drop-shadow-sm flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        {game.awayTeam.rank && (
                          <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 border border-amber-800/80 px-1 py-0.2 rounded">
                            #{game.awayTeam.rank}
                          </span>
                        )}
                        <span className="font-bold text-white text-sm">
                          {game.awayTeam.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {game.awayTeam.record} • Away
                      </div>
                    </div>
                  </div>

                  <div className="text-right pl-2 shrink-0 flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      {hasScores && (
                        <span
                          className={`font-mono text-xl sm:text-2xl font-black ${
                            awayCovered
                              ? 'text-emerald-400'
                              : isFinal
                              ? 'text-slate-400'
                              : 'text-white'
                          }`}
                        >
                          {game.awayScore}
                        </span>
                      )}
                      <div
                        className={`font-mono text-sm font-extrabold px-2.5 py-1 rounded-lg ${
                          isAwayPicked
                            ? isFinal && userPickStatus === 'won'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : isFinal && userPickStatus === 'lost'
                              ? 'bg-rose-700 text-white shadow-sm'
                              : 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {formatSpread(awaySpread)}
                      </div>
                    </div>

                    {hasScores && (
                      <div className="flex items-center gap-1 font-mono">
                        {isFinal && awayCovered && (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                            ✓ COVERED (+{coverMargin.toFixed(1)})
                          </span>
                        )}
                        {isFinal && homeCovered && (
                          <span className="text-slate-500 text-[10px] font-semibold uppercase">
                            MISSED
                          </span>
                        )}
                        {isLive && awayCovered && (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded uppercase animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            WINNING SPREAD (+{coverMargin.toFixed(1)})
                          </span>
                        )}
                        {isLive && homeCovered && (
                          <span className="text-rose-400/80 text-[10px] font-semibold uppercase">
                            LOSING SPREAD (-{coverMargin.toFixed(1)})
                          </span>
                        )}
                        {isPush && (
                          <span className="text-amber-400 text-[10px] font-bold uppercase">
                            TIED ATS
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>

                {/* Home Team */}
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => handlePickClick(game.id, game.homeTeam.id, homeSpread)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isHomePicked
                      ? isFinal && userPickStatus === 'won'
                        ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950/50'
                        : isFinal && userPickStatus === 'lost'
                        ? 'bg-rose-950/60 border-rose-800/80 ring-1 ring-rose-500/30 opacity-90'
                        : isLive && homeCovered
                        ? 'bg-emerald-950/70 border-emerald-500/80 ring-2 ring-emerald-500/40 shadow-lg'
                        : 'bg-indigo-950/90 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                      : locked
                      ? isFinal && homeCovered
                        ? 'bg-slate-900/80 border-emerald-500/30'
                        : 'bg-slate-900/40 border-slate-800/50 opacity-70 cursor-not-allowed'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850/60 active:scale-[0.99]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={game.homeTeam.logoUrl}
                      alt={game.homeTeam.name}
                      className="w-10 h-10 object-contain drop-shadow-sm flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        {game.homeTeam.rank && (
                          <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 border border-amber-800/80 px-1 py-0.2 rounded">
                            #{game.homeTeam.rank}
                          </span>
                        )}
                        <span className="font-bold text-white text-sm">
                          {game.homeTeam.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {game.homeTeam.record} • Home
                      </div>
                    </div>
                  </div>

                  <div className="text-right pl-2 shrink-0 flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      {hasScores && (
                        <span
                          className={`font-mono text-xl sm:text-2xl font-black ${
                            homeCovered
                              ? 'text-emerald-400'
                              : isFinal
                              ? 'text-slate-400'
                              : 'text-white'
                          }`}
                        >
                          {game.homeScore}
                        </span>
                      )}
                      <div
                        className={`font-mono text-sm font-extrabold px-2.5 py-1 rounded-lg ${
                          isHomePicked
                            ? isFinal && userPickStatus === 'won'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : isFinal && userPickStatus === 'lost'
                              ? 'bg-rose-700 text-white shadow-sm'
                              : 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {formatSpread(homeSpread)}
                      </div>
                    </div>

                    {hasScores && (
                      <div className="flex items-center gap-1 font-mono">
                        {isFinal && homeCovered && (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                            ✓ COVERED (+{coverMargin.toFixed(1)})
                          </span>
                        )}
                        {isFinal && awayCovered && (
                          <span className="text-slate-500 text-[10px] font-semibold uppercase">
                            MISSED
                          </span>
                        )}
                        {isLive && homeCovered && (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded uppercase animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            WINNING SPREAD (+{coverMargin.toFixed(1)})
                          </span>
                        )}
                        {isLive && awayCovered && (
                          <span className="text-rose-400/80 text-[10px] font-semibold uppercase">
                            LOSING SPREAD (-{coverMargin.toFixed(1)})
                          </span>
                        )}
                        {isPush && (
                          <span className="text-amber-400 text-[10px] font-bold uppercase">
                            TIED ATS
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              </div>

              {/* Clean Subtitle Strip: Venue, Weather & Notes Toggle */}
              <div className="px-4 py-2 bg-slate-950/30 border-t border-slate-800/40 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2 truncate text-slate-400">
                  {game.location && (
                    <span className="truncate">
                      📍 {game.location.stadium}
                    </span>
                  )}
                  {game.weather && (
                    <>
                      <span>•</span>
                      <span>⛅ {game.weather.temperature}°F {game.weather.condition}</span>
                    </>
                  )}
                </div>

                {hasNotes && (
                  <button
                    onClick={() => toggleNotes(game.id)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors shrink-0 ml-2"
                  >
                    <span>Intel ({game.notes?.length})</span>
                    {notesExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Expandable Notes Drawer */}
              {notesExpanded && hasNotes && (
                <div className="px-4 py-3 bg-slate-950/90 border-t border-slate-800/60 divide-y divide-slate-800/60">
                  {game.notes?.map((n) => (
                    <div key={n.id} className="py-2 first:pt-0 last:pb-0 text-xs">
                      <div className="text-slate-200">{n.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Primetime Tiebreaker Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-800/50 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                TIEBREAKER
              </span>
              <h3 className="font-bold text-white text-sm sm:text-base">Primetime Combined Total Points</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Predict total combined points for the final game of the slate (e.g., 28 + 13 = 41).
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <input
              type="number"
              min="0"
              max="150"
              value={tiebreaker.predictedTotalScore || ''}
              onChange={(e) => onTiebreakerChange(parseInt(e.target.value) || 0)}
              placeholder="48"
              className="w-20 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-center font-mono font-bold text-base text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-xs font-semibold text-slate-300">Total Points</span>
          </div>
        </div>
      </div>
    </div>
  );
};
