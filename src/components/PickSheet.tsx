import React, { useState } from 'react';
import type { Game, UserPick, TiebreakerPick } from '../types/pickem';
import { 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
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

          return (
            <div
              key={game.id}
              className={`rounded-2xl border transition-all duration-150 overflow-hidden ${
                locked
                  ? 'bg-slate-900/50 border-slate-800/70'
                  : wasJustSaved
                  ? 'bg-slate-900 border-indigo-500/80 ring-1 ring-indigo-500/40 shadow-lg'
                  : currentPick
                  ? 'bg-slate-900 border-slate-800 shadow'
                  : 'bg-slate-900/90 border-slate-800/80 shadow hover:border-slate-700'
              }`}
            >
              {/* Clean 1-Line Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/50 border-b border-slate-800/50 text-xs">
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

                <div className="flex items-center gap-1.5 font-medium">
                  {isFinal ? (
                    <span className="text-slate-400 bg-slate-800/90 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                      FINAL
                    </span>
                  ) : isLive ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {game.gameClock || 'LIVE'}
                    </span>
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
                      ? 'bg-indigo-950/90 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                      : locked
                      ? 'bg-slate-900/40 border-slate-800/50 opacity-70 cursor-not-allowed'
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

                  <div className="text-right pl-2 shrink-0">
                    <div
                      className={`font-mono text-sm font-extrabold px-2.5 py-1 rounded-lg ${
                        isAwayPicked
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {formatSpread(awaySpread)}
                    </div>
                    {(isLive || isFinal) && (
                      <div className="text-xs font-bold text-slate-300 mt-1 font-mono">
                        {game.awayScore}
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
                      ? 'bg-indigo-950/90 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                      : locked
                      ? 'bg-slate-900/40 border-slate-800/50 opacity-70 cursor-not-allowed'
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

                  <div className="text-right pl-2 shrink-0">
                    <div
                      className={`font-mono text-sm font-extrabold px-2.5 py-1 rounded-lg ${
                        isHomePicked
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {formatSpread(homeSpread)}
                    </div>
                    {(isLive || isFinal) && (
                      <div className="text-xs font-bold text-slate-300 mt-1 font-mono">
                        {game.homeScore}
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
