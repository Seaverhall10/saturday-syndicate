import { useState, useEffect } from 'react';
import type { Game, UserPick, TiebreakerPick, LeagueMember } from './types/pickem';
import { INITIAL_GAMES, MOCK_LEAGUE_MEMBERS } from './data/mockData';
import { HISTORICAL_2025_GAMES, HISTORICAL_2025_MEMBERS, SIMULATION_STEPS } from './data/historical2025';
import type { SimulationPhase } from './data/historical2025';
import { PickSheet } from './components/PickSheet';
import { LiveMatrix } from './components/LiveMatrix';
import { CommissionerDashboard } from './components/CommissionerDashboard';
import { Standings } from './components/Standings';
import { GamedaySimulator } from './components/GamedaySimulator';
import { 
  Trophy, 
  CheckSquare, 
  ShieldCheck, 
  BarChart3
} from 'lucide-react';

type Tab = 'picks' | 'matrix' | 'standings' | 'commish';

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('picks');
  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('pickem_ncaa_opening_v3');
    return saved ? JSON.parse(saved) : INITIAL_GAMES;
  });

  const [members] = useState<LeagueMember[]>(() => {
    const saved = localStorage.getItem('pickem_ncaa_members_v3');
    return saved ? JSON.parse(saved) : MOCK_LEAGUE_MEMBERS;
  });

  const [userPicks, setUserPicks] = useState<Record<string, UserPick>>(() => {
    const saved = localStorage.getItem('pickem_ncaa_picks_v3');
    return saved ? JSON.parse(saved) : {
      'game-1': { gameId: 'game-1', selectedTeamId: 'psu', spreadAtPick: -24.5 },
      'game-6': { gameId: 'game-6', selectedTeamId: 'lsu', spreadAtPick: -9.5 },
    };
  });

  const [tiebreaker, setTiebreaker] = useState<TiebreakerPick>(() => {
    const saved = localStorage.getItem('pickem_ncaa_tiebreaker_v3');
    return saved ? JSON.parse(saved) : { week: 1, predictedTotalScore: 55 };
  });

  // 2025 Historical Simulation States
  const [isSimulating2025, setIsSimulating2025] = useState(false);
  const [simulationPhase, setSimulationPhase] = useState<SimulationPhase>('pre');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pickem_ncaa_opening_v3', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('pickem_ncaa_picks_v3', JSON.stringify(userPicks));
  }, [userPicks]);

  useEffect(() => {
    localStorage.setItem('pickem_ncaa_tiebreaker_v3', JSON.stringify(tiebreaker));
  }, [tiebreaker]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectPick = (gameId: string, selectedTeamId: string, spreadAtPick: number) => {
    setUserPicks((prev) => {
      const next = {
        ...prev,
        [gameId]: {
          gameId,
          selectedTeamId,
          spreadAtPick,
          submittedAt: new Date().toISOString(),
        },
      };
      return next;
    });
  };

  const handleTiebreakerChange = (score: number) => {
    setTiebreaker({
      week: 4,
      predictedTotalScore: score,
      submittedAt: new Date().toISOString(),
    });
  };

  const handleSubmitPicks = () => {
    showToast('✓ All picks successfully submitted and locked!');
  };

  // Commissioner Actions
  const handleUpdateGameSpread = (gameId: string, newSpread: number) => {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, spread: newSpread, isCustomSpread: true } : g))
    );
    showToast(`Spread updated to ${newSpread > 0 ? `+${newSpread}` : newSpread}`);
  };

  const handleToggleGameInclusion = (gameId: string) => {
    setGames((prev) => prev.filter((g) => g.id !== gameId));
    showToast('Game removed from weekly slate');
  };

  const handleAddCustomGame = (newGame: Game) => {
    setGames((prev) => [newGame, ...prev]);
    showToast(`Added ${newGame.awayTeam.name} @ ${newGame.homeTeam.name}`);
  };

  const handleUpdateScore = (
    gameId: string,
    homeScore: number,
    awayScore: number,
    status: 'pre' | 'in' | 'post'
  ) => {
    setGames((prev) =>
      prev.map((g) =>
        g.id === gameId
          ? {
              ...g,
              homeScore,
              awayScore,
              status,
              gameClock: status === 'in' ? 'Q3 08:30' : undefined,
            }
          : g
      )
    );
    showToast('Scores updated! Live matrix recalculated.');
  };

  const [proxyPicksEnabled, setProxyPicksEnabled] = useState(true);
  const [dropWorstWeekEnabled, setDropWorstWeekEnabled] = useState(true);

  const handleSyncEspnGames = (syncedGames: Game[]) => {
    setGames(syncedGames);
    showToast(`✓ Loaded ${syncedGames.length} real Saturday games from ESPN!`);
  };

  // 2025 Historical Simulation Selectors
  const simulationStep = SIMULATION_STEPS.find((s) => s.id === simulationPhase) || SIMULATION_STEPS[0];

  const displayGames: Game[] = isSimulating2025
    ? HISTORICAL_2025_GAMES.map((baseGame) => {
        const stepState = simulationStep.gamesState.find((s) => s.id === baseGame.id);
        if (!stepState) return baseGame;
        return {
          ...baseGame,
          status: stepState.status ?? baseGame.status,
          homeScore: stepState.homeScore ?? baseGame.homeScore,
          awayScore: stepState.awayScore ?? baseGame.awayScore,
          situation: stepState.situation !== undefined ? stepState.situation : baseGame.situation,
        };
      })
    : games;

  const displayMembers: LeagueMember[] = isSimulating2025 ? HISTORICAL_2025_MEMBERS : members;

  const displayUserPicks: Record<string, UserPick> = isSimulating2025
    ? (HISTORICAL_2025_MEMBERS.find((m) => m.isCurrentUser)?.picks as Record<string, UserPick> || {})
    : userPicks;

  const displayTiebreaker: TiebreakerPick = isSimulating2025
    ? { week: 1, predictedTotalScore: 45, submittedAt: '2025-08-30T14:00:00Z' }
    : tiebreaker;

  const handleToggleSeasonMode = (simulate2025: boolean) => {
    setIsSimulating2025(simulate2025);
    if (simulate2025) {
      setSimulationPhase('pre');
      showToast('Switched to 2025 Historical Replay Simulator');
    } else {
      showToast('Returned to Live 2026 Opening Saturday Slate');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-400 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Main App Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & League Switcher */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/20">
              🏈
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-white text-base sm:text-lg tracking-tight m-0">
                  Saturday Syndicate
                </h1>
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded border ${
                    isSimulating2025
                      ? 'bg-amber-950 text-amber-300 border-amber-700'
                      : 'bg-indigo-950 text-indigo-300 border-indigo-700'
                  }`}
                >
                  {isSimulating2025 ? 'HISTORICAL 2025' : 'NCAA 2026'}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <span>{isSimulating2025 ? '2025 Week 1 Replay' : 'Week 1 Opening Saturday'}</span>
                <span>•</span>
                <span className={isSimulating2025 ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
                  {isSimulating2025 ? '8 Real Marquee Games' : 'Top 25 Slate'}
                </span>
              </div>
            </div>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Seaver"
                className="w-6 h-6 rounded-full object-cover border border-slate-700"
              />
              <span className="text-xs font-bold text-white hidden sm:inline">Seaver</span>
              <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                Commish
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('picks')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'picks'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Weekly Picks</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Saturday Sweat Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('standings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'standings'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Season Standings</span>
          </button>

          <button
            onClick={() => setActiveTab('commish')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'commish'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-amber-400/80 hover:text-amber-300 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Commish God-Mode</span>
          </button>
        </div>
      </header>

      {/* Interactive Gameday Simulator Bar */}
      <GamedaySimulator
        currentPhase={simulationPhase}
        onPhaseChange={(phase) => setSimulationPhase(phase)}
        onResetTo2026={() => handleToggleSeasonMode(false)}
        isSimulating2025={isSimulating2025}
        onToggleSeasonMode={handleToggleSeasonMode}
        onApplySimulatedGames={(simGames) => setGames(simGames)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 mt-2">
        {activeTab === 'picks' && (
          <PickSheet
            games={displayGames}
            picks={displayUserPicks}
            tiebreaker={displayTiebreaker}
            onSelectPick={handleSelectPick}
            onTiebreakerChange={handleTiebreakerChange}
            onSubmitPicks={handleSubmitPicks}
          />
        )}

        {activeTab === 'matrix' && (
          <LiveMatrix
            games={displayGames}
            members={displayMembers}
            userPicks={displayUserPicks}
          />
        )}

        {activeTab === 'standings' && (
          <Standings members={displayMembers} />
        )}

        {activeTab === 'commish' && (
          <CommissionerDashboard
            games={displayGames}
            onUpdateGameSpread={handleUpdateGameSpread}
            onToggleGameInclusion={handleToggleGameInclusion}
            onAddCustomGame={handleAddCustomGame}
            onUpdateScore={handleUpdateScore}
            onSyncEspnGames={handleSyncEspnGames}
            proxyPicksEnabled={proxyPicksEnabled}
            onToggleProxyPicks={setProxyPicksEnabled}
            dropWorstWeekEnabled={dropWorstWeekEnabled}
            onToggleDropWorstWeek={setDropWorstWeekEnabled}
          />
        )}
      </main>
    </div>
  );
}

export default App;
