import React, { useState } from 'react';
import type { Game, UserPick, TiebreakerPick, GameNote } from '../types/pickem';
import { 
  Clock, 
  Lock, 
  Unlock,
  EyeOff,
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Wind, 
  Thermometer, 
  Flame, 
  Activity, 
  Info, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PickSheetProps {
  games: Game[];
  picks: Record<string, UserPick>;
  tiebreaker: TiebreakerPick;
  onSelectPick: (gameId: string, selectedTeamId: string, spreadAtPick: number) => void;
  onTiebreakerChange: (score: number) => void;
  onSubmitPicks: () => void;
  isCommissioner?: boolean;
}

export const PickSheet: React.FC<PickSheetProps> = ({
  games,
  picks,
  tiebreaker,
  onSelectPick,
  onTiebreakerChange,
  onSubmitPicks,
}) => {
  // State to toggle expanded intel drawer for each game
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

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

  const getTimeUntilLock = (dateStr: string) => {
    const diffMs = new Date(dateStr).getTime() - Date.now();
    if (diffMs <= 0) return 'Locked';
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `Locks in ${days}d ${hours % 24}h`;
    }
    return `Locks in ${hours}h ${mins}m`;
  };

  const totalPicks = games.length;
  const picksMade = Object.keys(picks).length;
  const isComplete = picksMade >= totalPicks && tiebreaker.predictedTotalScore > 0;

  const handleSubmit = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onSubmitPicks();
  };

  const getNoteBadgeStyle = (category: GameNote['category']) => {
    switch (category) {
      case 'injury':
        return 'bg-rose-950/70 text-rose-300 border-rose-800/80';
      case 'rivalry':
        return 'bg-amber-950/70 text-amber-300 border-amber-800/80';
      case 'weather':
        return 'bg-sky-950/70 text-sky-300 border-sky-800/80';
      default:
        return 'bg-indigo-950/70 text-indigo-300 border-indigo-800/80';
    }
  };

  const getNoteIcon = (category: GameNote['category']) => {
    switch (category) {
      case 'injury':
        return <Activity className="w-3 h-3 text-rose-400" />;
      case 'rivalry':
        return <Flame className="w-3 h-3 text-amber-400" />;
      case 'weather':
        return <Wind className="w-3 h-3 text-sky-400" />;
      default:
        return <Info className="w-3 h-3 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto px-2 sm:px-4">
      {/* Sticky Progress Banner */}
      <div className="sticky top-2 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              NCAA Pick Progress
            </span>
            {isComplete && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            )}
          </div>
          <div className="text-lg font-bold text-white mt-0.5">
            {picksMade} <span className="text-slate-500 font-normal">of</span> {totalPicks} Picks Selected
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className={`flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md ${
            isComplete
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 active:scale-95'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 active:scale-95'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <div className="text-left">
            <div className="leading-tight font-bold">{isComplete ? 'Save All Picks' : 'Save Picks'}</div>
            <div className="text-[10px] opacity-80 font-normal">Switch freely until kickoff</div>
          </div>
        </button>
      </div>

      {/* Game Cards List */}
      <div className="space-y-4">
        {games.map((game) => {
          const locked = isGameLocked(game);
          const currentPick = picks[game.id];
          const awaySpread = -game.spread;
          const homeSpread = game.spread;

          const formatSpread = (spd: number) => {
            if (spd === 0) return 'PK';
            return spd > 0 ? `+${spd}` : `${spd}`;
          };

          const isAwayPicked = currentPick?.selectedTeamId === game.awayTeam.id;
          const isHomePicked = currentPick?.selectedTeamId === game.homeTeam.id;

          const isFinal = game.status === 'post';
          const isLive = game.status === 'in';
          const notesExpanded = !!expandedNotes[game.id];

          return (
            <div
              key={game.id}
              className={`relative rounded-2xl border transition-all duration-200 overflow-hidden ${
                locked
                  ? 'bg-slate-900/60 border-slate-800/80 shadow-sm'
                  : 'bg-slate-900 border-slate-800 shadow-md hover:border-slate-700'
              }`}
            >
              {/* Header: Kickoff & Lock Status */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/70 border-b border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase bg-amber-950 text-amber-300 border border-amber-800/60">
                    {game.league}
                  </span>
                  <span className="text-slate-300 font-medium">
                    {formatKickoff(game.kickoffTime)}
                  </span>
                  {game.isTiebreaker && (
                    <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      ⭐ Tiebreaker Game
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 font-medium">
                  {isFinal ? (
                    <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-[11px] font-bold">
                      FINAL
                    </span>
                  ) : isLive ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded text-[11px] font-bold animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {game.gameClock || 'LIVE'}
                    </span>
                  ) : locked ? (
                    <span className="flex items-center gap-1 text-rose-400">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-indigo-400">
                      <Clock className="w-3 h-3" /> {getTimeUntilLock(game.kickoffTime)}
                    </span>
                  )}
                </div>
              </div>

              {/* Venue & Weather Intel Strip */}
              {(game.location || game.weather) && (
                <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  {game.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-medium text-slate-300">
                        {game.location.stadium}
                      </span>
                      <span>•</span>
                      <span>{game.location.city}, {game.location.state}</span>
                      {game.location.isNeutralSite && (
                        <span className="bg-slate-800 text-amber-300 px-1.5 py-0.2 rounded text-[9px] font-bold">
                          Neutral Site
                        </span>
                      )}
                    </div>
                  )}

                  {game.weather && (
                    <div className="flex items-center gap-2 bg-slate-900/90 px-2 py-0.5 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                        <Thermometer className="w-3 h-3" />
                        <span>{game.weather.temperature}°F</span>
                      </div>
                      <span className="text-slate-400 font-medium">{game.weather.condition}</span>
                      <div className="flex items-center gap-1 text-sky-400 font-mono text-[10px]">
                        <Wind className="w-3 h-3" />
                        <span>{game.weather.windMph} mph</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Status & Privacy Banner */}
              {!locked ? (
                <div className="px-4 py-1.5 bg-emerald-950/30 border-b border-emerald-900/40 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <Unlock className="w-3 h-3 text-emerald-400" />
                    <span>Picks Open: Switch freely • Hidden from opponents until kickoff</span>
                  </span>
                  <span className="text-slate-400 font-mono flex items-center gap-1">
                    <EyeOff className="w-3 h-3 text-slate-500" />
                    Private
                  </span>
                </div>
              ) : (
                <div className="px-4 py-1.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 font-bold text-rose-400">
                    <Lock className="w-3 h-3" />
                    <span>Locked at Kickoff • Picks now public to league</span>
                  </span>
                  <span className="text-slate-400 font-bold bg-slate-800/80 px-2 py-0.2 rounded text-[10px]">
                    Publicly Revealed
                  </span>
                </div>
              )}

              {/* Matchup Selection Body */}
              <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Away Team Selection Button */}
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => onSelectPick(game.id, game.awayTeam.id, awaySpread)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isAwayPicked
                      ? 'bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
                      : locked
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-80 cursor-not-allowed'
                      : 'bg-slate-850/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 active:scale-[0.99]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={game.awayTeam.logoUrl}
                      alt={game.awayTeam.name}
                      className="w-11 h-11 object-contain drop-shadow-sm flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        {game.awayTeam.rank && (
                          <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 border border-amber-800/80 px-1 py-0.2 rounded">
                            #{game.awayTeam.rank}
                          </span>
                        )}
                        <span className="font-bold text-white text-sm sm:text-base">
                          {game.awayTeam.name}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {game.awayTeam.record} • Away
                      </div>
                    </div>
                  </div>

                  <div className="text-right pl-2">
                    <div
                      className={`font-mono text-sm sm:text-base font-extrabold px-2.5 py-1 rounded-lg ${
                        isAwayPicked
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {formatSpread(awaySpread)}
                    </div>
                    {(isLive || isFinal) && (
                      <div className="text-xs font-bold text-slate-300 mt-1 font-mono">
                        Score: {game.awayScore}
                      </div>
                    )}
                  </div>
                </button>

                {/* Home Team Selection Button */}
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => onSelectPick(game.id, game.homeTeam.id, homeSpread)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isHomePicked
                      ? 'bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
                      : locked
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-80 cursor-not-allowed'
                      : 'bg-slate-850/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 active:scale-[0.99]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={game.homeTeam.logoUrl}
                      alt={game.homeTeam.name}
                      className="w-11 h-11 object-contain drop-shadow-sm flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        {game.homeTeam.rank && (
                          <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 border border-amber-800/80 px-1 py-0.2 rounded">
                            #{game.homeTeam.rank}
                          </span>
                        )}
                        <span className="font-bold text-white text-sm sm:text-base">
                          {game.homeTeam.name}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {game.homeTeam.record} • Home
                      </div>
                    </div>
                  </div>

                  <div className="text-right pl-2">
                    <div
                      className={`font-mono text-sm sm:text-base font-extrabold px-2.5 py-1 rounded-lg ${
                        isHomePicked
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {formatSpread(homeSpread)}
                    </div>
                    {(isLive || isFinal) && (
                      <div className="text-xs font-bold text-slate-300 mt-1 font-mono">
                        Score: {game.homeScore}
                      </div>
                    )}
                  </div>
                </button>
              </div>

              {/* Sub-card: Lines & Game Notes Toggle */}
              <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span>Total: O/U {game.overUnder}</span>
                  {game.isCustomSpread ? (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      ⚡ Custom Commish Line
                    </span>
                  ) : (
                    <span>Consensus Line</span>
                  )}
                </div>

                {game.notes && game.notes.length > 0 && (
                  <button
                    onClick={() => toggleNotes(game.id)}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                  >
                    <span>Game Intel ({game.notes.length})</span>
                    {notesExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>

              {/* Expandable Game Notes & Injuries Section */}
              {notesExpanded && game.notes && (
                <div className="px-4 py-3 bg-slate-950/90 border-t border-slate-800/70 space-y-2 animate-in fade-in duration-150">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    <Info className="w-3 h-3 text-indigo-400" />
                    Key Injuries & Matchup Intel
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {game.notes.map((note) => (
                      <div
                        key={note.id}
                        className={`flex items-start gap-2 p-2 rounded-lg border text-xs ${getNoteBadgeStyle(
                          note.category
                        )}`}
                      >
                        <div className="mt-0.5">{getNoteIcon(note.category)}</div>
                        <div className="font-medium text-slate-200 text-[11px] leading-snug">
                          {note.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Primetime Tiebreaker Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-800/50 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                TIEBREAKER
              </span>
              <h3 className="font-bold text-white text-base">NCAA Primetime Combined Total</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Predict the combined total points scored in Notre Dame @ USC (e.g. 31 + 27 = 58).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="150"
              value={tiebreaker.predictedTotalScore || ''}
              onChange={(e) => onTiebreakerChange(parseInt(e.target.value) || 0)}
              placeholder="e.g. 58"
              className="w-24 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-center font-mono font-bold text-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <span className="text-sm font-semibold text-slate-300">Total Points</span>
          </div>
        </div>
      </div>
    </div>
  );
};
