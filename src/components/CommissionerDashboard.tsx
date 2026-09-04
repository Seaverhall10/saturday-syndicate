import React, { useState } from 'react';
import type { Game, SportLeague } from '../types/pickem';
import { ShieldCheck, Plus, Edit3, Check, Trash2, RefreshCw, Share2, Users } from 'lucide-react';
import { fetchLiveEspnScoreboard } from '../services/espnService';

interface CommissionerDashboardProps {
  games: Game[];
  onUpdateGameSpread: (gameId: string, newSpread: number) => void;
  onToggleGameInclusion: (gameId: string) => void;
  onAddCustomGame: (newGame: Game) => void;
  onUpdateScore: (gameId: string, homeScore: number, awayScore: number, status: 'pre' | 'in' | 'post') => void;
  onSyncEspnGames?: (games: Game[]) => void;
  proxyPicksEnabled?: boolean;
  onToggleProxyPicks?: (enabled: boolean) => void;
  dropWorstWeekEnabled?: boolean;
  onToggleDropWorstWeek?: (enabled: boolean) => void;
}

export const CommissionerDashboard: React.FC<CommissionerDashboardProps> = ({
  games,
  onUpdateGameSpread,
  onToggleGameInclusion,
  onAddCustomGame,
  onUpdateScore,
  onSyncEspnGames,
  proxyPicksEnabled = true,
  onToggleProxyPicks,
  dropWorstWeekEnabled = true,
  onToggleDropWorstWeek,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSpreadId, setEditingSpreadId] = useState<string | null>(null);
  const [spreadValue, setSpreadValue] = useState<string>('');
  const [isSyncingEspn, setIsSyncingEspn] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState<string | null>(null);
  const [inviteCopied, setInviteCopied] = useState(false);

  // New Custom Game Form State
  const [customAwayName, setCustomAwayName] = useState('');
  const [customAwayAbbr, setCustomAwayAbbr] = useState('');
  const [customHomeName, setCustomHomeName] = useState('');
  const [customHomeAbbr, setCustomHomeAbbr] = useState('');
  const [customLeague, setCustomLeague] = useState<SportLeague>('CFB');
  const [customSpread, setCustomSpread] = useState('-3.5');
  const [customKickoff, setCustomKickoff] = useState('');
  const [customStadium, setCustomStadium] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customState, setCustomState] = useState('');
  const [customWeatherTemp, setCustomWeatherTemp] = useState('72');
  const [customWeatherCond, setCustomWeatherCond] = useState('Sunny');
  const [customWindMph, setCustomWindMph] = useState('5');
  const [customNoteText, setCustomNoteText] = useState('');

  const handleStartEditSpread = (game: Game) => {
    setEditingSpreadId(game.id);
    setSpreadValue(game.spread.toString());
  };

  const handleSaveSpread = (gameId: string) => {
    const val = parseFloat(spreadValue);
    if (!isNaN(val)) {
      onUpdateGameSpread(gameId, val);
    }
    setEditingSpreadId(null);
  };

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAwayName || !customHomeName) return;

    const newGame: Game = {
      id: `custom-${Date.now()}`,
      league: customLeague,
      season: 2026,
      week: 4,
      kickoffTime: customKickoff ? new Date(customKickoff).toISOString() : new Date(Date.now() + 86400000).toISOString(),
      homeTeam: {
        id: `team-${customHomeAbbr.toLowerCase() || 'home'}`,
        name: customHomeName,
        shortName: customHomeName.split(' ').pop() || customHomeName,
        abbreviation: customHomeAbbr.toUpperCase() || 'HOM',
        logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/default.png',
        record: '0-0',
      },
      awayTeam: {
        id: `team-${customAwayAbbr.toLowerCase() || 'away'}`,
        name: customAwayName,
        shortName: customAwayName.split(' ').pop() || customAwayName,
        abbreviation: customAwayAbbr.toUpperCase() || 'AWY',
        logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/default.png',
        record: '0-0',
      },
      spread: parseFloat(customSpread) || 0.0,
      overUnder: 48.5,
      status: 'pre',
      isCustomSpread: true,
      spreadLocked: true,
      location: customStadium
        ? {
            stadium: customStadium,
            city: customCity || 'Campus',
            state: customState || 'USA',
          }
        : undefined,
      weather: customWeatherTemp
        ? {
            temperature: parseInt(customWeatherTemp) || 70,
            condition: customWeatherCond || 'Clear',
            windMph: parseInt(customWindMph) || 5,
          }
        : undefined,
      notes: customNoteText
        ? [
            {
              id: `note-${Date.now()}`,
              category: 'intel',
              text: customNoteText,
              impact: 'high',
            },
          ]
        : undefined,
    };

    onAddCustomGame(newGame);
    setShowAddModal(false);
    // Reset
    setCustomAwayName('');
    setCustomHomeName('');
    setCustomStadium('');
    setCustomCity('');
    setCustomNoteText('');
  };

  const handleSyncEspn = async () => {
    setIsSyncingEspn(true);
    setSyncStatusText('Fetching live scoreboard from ESPN...');
    try {
      const result = await fetchLiveEspnScoreboard();
      if (result.success && result.games.length > 0) {
        if (onSyncEspnGames) {
          onSyncEspnGames(result.games);
        }
        setSyncStatusText(`✓ Successfully synced ${result.games.length} real College Football games from ESPN!`);
      } else {
        setSyncStatusText(`ESPN sync note: ${result.error || 'No active games found.'}`);
      }
    } catch (err: any) {
      setSyncStatusText(`Sync error: ${err.message}`);
    } finally {
      setIsSyncingEspn(false);
      setTimeout(() => setSyncStatusText(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-2 sm:px-4 pb-24">
      {/* Commissioner Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Commissioner Control Center</h2>
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  God Mode
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize any spread, override dumb CBS lines, and add any missing game to your league slate.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncEspn}
              disabled={isSyncingEspn}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${isSyncingEspn ? 'animate-spin' : ''}`} />
              <span>{isSyncingEspn ? 'Syncing...' : 'Sync Live ESPN Slate'}</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Game</span>
            </button>
          </div>
        </div>

        {syncStatusText && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-in fade-in duration-150">
            <Check className="w-3.5 h-3.5" />
            <span>{syncStatusText}</span>
          </div>
        )}
      </div>

      {/* League Invite Code & Quick Join */}
      <div className="bg-gradient-to-r from-indigo-950/70 to-slate-900 border border-indigo-800/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-black">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">League Invite Code</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <div className="font-mono font-black text-xl text-white tracking-widest mt-0.5">
              SATURDAY26
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText('https://saturdaysyndicate.app/join?code=SATURDAY26');
            setInviteCopied(true);
            setTimeout(() => setInviteCopied(false), 2500);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto ${
            inviteCopied
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
          }`}
        >
          {inviteCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{inviteCopied ? 'Invite Link Copied! ✓' : 'Copy League Invite Link'}</span>
        </button>
      </div>

      {/* Anti-Abandonment Retention Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Anti-Abandonment Proxy Auto-Picks</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                Retention Shield
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              If a buddy forgets to pick before noon kickoff, auto-assign the consensus underdog with a 1-point penalty. Stops the 0-15 death spiral that causes players to quit.
            </p>
          </div>
          <button
            onClick={() => onToggleProxyPicks?.(!proxyPicksEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              proxyPicksEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {proxyPicksEnabled ? 'Enabled ✓' : 'Disabled'}
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Drop-Worst-Week Championship</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                Fair Play
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Count best 12 of 14 weeks for the Season Championship standings. Players with weddings, travel, or 1 bad Saturday remain in the title race all season.
            </p>
          </div>
          <button
            onClick={() => onToggleDropWorstWeek?.(!dropWorstWeekEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              dropWorstWeekEnabled ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {dropWorstWeekEnabled ? 'Active (Best 12) ✓' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Game Slate & Spread Editor */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="font-bold text-white text-base">Weekly Matchup & Spread Control</h3>
            <p className="text-xs text-slate-400">
              Click any spread to change it. Your league members will pick against these exact lines.
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-1 rounded-lg">
            {games.length} Games Active
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {games.map((game) => {
            const isEditing = editingSpreadId === game.id;

            return (
              <div
                key={game.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/40 transition-colors"
              >
                {/* Matchup Info */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {game.league}
                  </span>
                  <div className="flex items-center gap-2">
                    <img src={game.awayTeam.logoUrl} alt="" className="w-6 h-6 object-contain" />
                    <span className="font-bold text-white text-sm">
                      {game.awayTeam.name}
                    </span>
                    <span className="text-slate-500 text-xs font-semibold">@</span>
                    <img src={game.homeTeam.logoUrl} alt="" className="w-6 h-6 object-contain" />
                    <span className="font-bold text-white text-sm">
                      {game.homeTeam.name}
                    </span>
                  </div>
                </div>

                {/* Spread & Score Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Spread Modifier */}
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 font-medium">
                      {game.homeTeam.abbreviation} Spread:
                    </span>

                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="0.5"
                          value={spreadValue}
                          onChange={(e) => setSpreadValue(e.target.value)}
                          className="w-16 px-2 py-1 bg-slate-800 border border-indigo-500 rounded text-center text-sm font-mono font-bold text-white focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveSpread(game.id)}
                          className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEditSpread(game)}
                        className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-mono font-bold text-sm bg-indigo-950/60 hover:bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-800/60 transition-all"
                      >
                        <span>{game.spread === 0 ? 'PK (0.0)' : game.spread > 0 ? `+${game.spread}` : game.spread}</span>
                        <Edit3 className="w-3 h-3 text-indigo-400" />
                      </button>
                    )}
                  </div>

                  {/* Score Simulator / Tester */}
                  <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
                    <span className="text-slate-400">Score:</span>
                    <input
                      type="number"
                      placeholder="Away"
                      value={game.awayScore ?? ''}
                      onChange={(e) =>
                        onUpdateScore(
                          game.id,
                          game.homeScore ?? 0,
                          parseInt(e.target.value) || 0,
                          game.status === 'pre' ? 'in' : game.status
                        )
                      }
                      className="w-12 px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-center font-mono font-bold text-white text-xs"
                    />
                    <span className="text-slate-500">-</span>
                    <input
                      type="number"
                      placeholder="Home"
                      value={game.homeScore ?? ''}
                      onChange={(e) =>
                        onUpdateScore(
                          game.id,
                          parseInt(e.target.value) || 0,
                          game.awayScore ?? 0,
                          game.status === 'pre' ? 'in' : game.status
                        )
                      }
                      className="w-12 px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-center font-mono font-bold text-white text-xs"
                    />
                    <button
                      onClick={() =>
                        onUpdateScore(
                          game.id,
                          game.homeScore ?? 0,
                          game.awayScore ?? 0,
                          game.status === 'post' ? 'pre' : 'post'
                        )
                      }
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                        game.status === 'post'
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {game.status === 'post' ? 'Final' : 'Set Final'}
                    </button>
                  </div>

                  {/* Remove / Omit Game Button */}
                  <button
                    onClick={() => onToggleGameInclusion(game.id)}
                    title="Remove game from weekly slate"
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-all border border-transparent hover:border-rose-900/60"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Game Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                Add Missing or FCS Matchup
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGame} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Sport / League
                </label>
                <select
                  value={customLeague}
                  onChange={(e) => setCustomLeague(e.target.value as SportLeague)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-medium"
                >
                  <option value="CFB">NCAA FBS (Top 25, SEC, Big Ten, Big 12, ACC)</option>
                  <option value="CFB">NCAA FCS (Rivalries, Big Sky, Ivy, etc.)</option>
                  <option value="CUSTOM">Custom Rivalry / Exhibition</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Away Team Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Montana State"
                    value={customAwayName}
                    onChange={(e) => setCustomAwayName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Away Abbreviation
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MTST"
                    maxLength={5}
                    value={customAwayAbbr}
                    onChange={(e) => setCustomAwayAbbr(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Home Team Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Montana Grizzlies"
                    value={customHomeName}
                    onChange={(e) => setCustomHomeName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Home Abbreviation
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MONT"
                    maxLength={5}
                    value={customHomeAbbr}
                    onChange={(e) => setCustomHomeAbbr(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Home Spread (+/-)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="-3.5"
                    value={customSpread}
                    onChange={(e) => setCustomSpread(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                  <span className="text-[11px] text-slate-400">Negative = Home favored</span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Kickoff Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={customKickoff}
                    onChange={(e) => setCustomKickoff(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              {/* Stadium & Location */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Stadium / Venue
                  </label>
                  <input
                    type="text"
                    placeholder="The Big House"
                    value={customStadium}
                    onChange={(e) => setCustomStadium(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Ann Arbor"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="MI"
                    maxLength={2}
                    value={customState}
                    onChange={(e) => setCustomState(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white uppercase font-mono"
                  />
                </div>
              </div>

              {/* Weather Forecast */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Temp (°F)
                  </label>
                  <input
                    type="number"
                    placeholder="72"
                    value={customWeatherTemp}
                    onChange={(e) => setCustomWeatherTemp(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Condition
                  </label>
                  <input
                    type="text"
                    placeholder="Sunny / Rain"
                    value={customWeatherCond}
                    onChange={(e) => setCustomWeatherCond(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Wind (mph)
                  </label>
                  <input
                    type="number"
                    placeholder="8"
                    value={customWindMph}
                    onChange={(e) => setCustomWindMph(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Key Game Notes / Injury Intel */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Key Injury or Game Intel Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Starting QB Questionable with ankle sprain"
                  value={customNoteText}
                  onChange={(e) => setCustomNoteText(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-md"
                >
                  Add to Weekly Slate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
