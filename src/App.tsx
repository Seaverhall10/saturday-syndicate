import { useState, useEffect } from 'react';
import type { Game, UserPick, TiebreakerPick, LeagueMember, SlateCurationConfig } from './types/pickem';
import { INITIAL_GAMES, MOCK_LEAGUE_MEMBERS } from './data/mockData';
import { WEEK_2_CURATED_GAMES, WEEK_2_CANDIDATE_POOL, WEEK_2_MEMBERS } from './data/week2Data';
import { curateSlate, DEFAULT_CURATION_CONFIG } from './services/slateCuratorService';
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
  
  // Multi-Week Slate System - Defaults to Week 2 ("Next Week" requested by user!)
  const [activeWeek, setActiveWeek] = useState<number>(() => {
    const saved = localStorage.getItem('pickem_active_week_v7');
    return saved ? parseInt(saved, 10) : 2;
  });

  const [weeklyGames, setWeeklyGames] = useState<Record<number, Game[]>>(() => {
    const saved = localStorage.getItem('pickem_weekly_games_v7');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      1: INITIAL_GAMES,
      2: WEEK_2_CURATED_GAMES,
    };
  });

  const [members] = useState<LeagueMember[]>(() => {
    const saved = localStorage.getItem('pickem_ncaa_members_v7');
    return saved ? JSON.parse(saved) : MOCK_LEAGUE_MEMBERS;
  });

  const [allUserPicks, setAllUserPicks] = useState<Record<number, Record<string, UserPick>>>(() => {
    const saved = localStorage.getItem('pickem_all_user_picks_v7');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      1: {
        'game-1': { gameId: 'game-1', selectedTeamId: 'psu', spreadAtPick: -24.5 },
        'game-6': { gameId: 'game-6', selectedTeamId: 'lsu', spreadAtPick: -9.5 },
      },
      2: {
        'w2-game-1': { gameId: 'w2-game-1', selectedTeamId: 'tex', spreadAtPick: 2.5 },
        'w2-game-5': { gameId: 'w2-game-5', selectedTeamId: 'tcu', spreadAtPick: -34.5 },
      },
    };
  });

  const [weeklyTiebreakers, setWeeklyTiebreakers] = useState<Record<number, TiebreakerPick>>(() => {
    const saved = localStorage.getItem('pickem_weekly_tiebreakers_v7');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      1: { week: 1, predictedTotalScore: 55 },
      2: { week: 2, predictedTotalScore: 58 },
    };
  });

  // 2025 Historical Simulation States
  const [isSimulating2025, setIsSimulating2025] = useState(false);
  const [simulationPhase, setSimulationPhase] = useState<SimulationPhase>('afternoon_kick');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pickem_active_week_v7', activeWeek.toString());
  }, [activeWeek]);

  useEffect(() => {
    localStorage.setItem('pickem_weekly_games_v7', JSON.stringify(weeklyGames));
  }, [weeklyGames]);

  useEffect(() => {
    localStorage.setItem('pickem_all_user_picks_v7', JSON.stringify(allUserPicks));
  }, [allUserPicks]);

  useEffect(() => {
    localStorage.setItem('pickem_weekly_tiebreakers_v7', JSON.stringify(weeklyTiebreakers));
  }, [weeklyTiebreakers]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentWeekPicks = allUserPicks[activeWeek] || {};
  const currentWeekTiebreaker = weeklyTiebreakers[activeWeek] || { week: activeWeek, predictedTotalScore: 58 };

  const handleSelectPick = (gameId: string, selectedTeamId: string, spreadAtPick: number) => {
    setAllUserPicks((prev) => ({
      ...prev,
      [activeWeek]: {
        ...(prev[activeWeek] || {}),
        [gameId]: {
          gameId,
          selectedTeamId,
          spreadAtPick,
          submittedAt: new Date().toISOString(),
        },
      },
    }));
  };

  const handleTiebreakerChange = (score: number) => {
    setWeeklyTiebreakers((prev) => ({
      ...prev,
      [activeWeek]: {
        week: activeWeek,
        predictedTotalScore: score,
        submittedAt: new Date().toISOString(),
      },
    }));
  };

  const handleSubmitPicks = () => {
    showToast(`✓ All Week ${activeWeek} picks successfully submitted and locked!`);
  };

  // Commissioner Actions
  const handleUpdateGameSpread = (gameId: string, newSpread: number) => {
    setWeeklyGames((prev) => ({
      ...prev,
      [activeWeek]: (prev[activeWeek] || []).map((g) =>
        g.id === gameId ? { ...g, spread: newSpread, isCustomSpread: true } : g
      ),
    }));
    showToast(`Spread updated to ${newSpread > 0 ? `+${newSpread}` : newSpread}`);
  };

  const handleToggleGameInclusion = (gameId: string) => {
    setWeeklyGames((prev) => ({
      ...prev,
      [activeWeek]: (prev[activeWeek] || []).filter((g) => g.id !== gameId),
    }));
    showToast('Game removed from weekly slate');
  };

  const handleAddCustomGame = (newGame: Game) => {
    setWeeklyGames((prev) => ({
      ...prev,
      [activeWeek]: [newGame, ...(prev[activeWeek] || [])],
    }));
    showToast(`Added ${newGame.awayTeam.name} @ ${newGame.homeTeam.name}`);
  };

  const handleUpdateScore = (
    gameId: string,
    homeScore: number,
    awayScore: number,
    status: 'pre' | 'in' | 'post'
  ) => {
    setWeeklyGames((prev) => ({
      ...prev,
      [activeWeek]: (prev[activeWeek] || []).map((g) =>
        g.id === gameId
          ? {
              ...g,
              homeScore,
              awayScore,
              status,
              gameClock: status === 'in' ? 'Q3 08:30' : undefined,
            }
          : g
      ),
    }));
    showToast('Scores updated! Live matrix recalculated.');
  };

  const [proxyPicksEnabled, setProxyPicksEnabled] = useState(true);
  const [dropWorstWeekEnabled, setDropWorstWeekEnabled] = useState(true);

  const handleSyncEspnGames = (syncedGames: Game[]) => {
    setWeeklyGames((prev) => ({
      ...prev,
      [activeWeek]: syncedGames,
    }));
    showToast(`✓ Loaded ${syncedGames.length} real Saturday games from ESPN!`);
  };

  const handleAutoCurateWeekSlate = (week: number, config: SlateCurationConfig = DEFAULT_CURATION_CONFIG) => {
    const pool = week === 2 ? WEEK_2_CANDIDATE_POOL : INITIAL_GAMES;
    const curated = curateSlate(pool, config);
    setWeeklyGames((prev) => ({
      ...prev,
      [week]: curated,
    }));
    showToast(`⚡ Auto-Selected ${curated.length} games for Week ${week} (Top 25 + SEC + TCU)!`);
  };

  // 2025 Historical Simulation Selectors
  const simulationStep = SIMULATION_STEPS.find((s) => s.id === simulationPhase) || SIMULATION_STEPS[0];

  const activeGames = weeklyGames[activeWeek] || (activeWeek === 2 ? WEEK_2_CURATED_GAMES : INITIAL_GAMES);

  const displayGames: Game[] = isSimulating2025
    ? HISTORICAL_2025_GAMES.map((baseGame) => {
        const stepState = simulationStep.gamesState.find((s) => s.id === baseGame.id);
        if (!stepState) return baseGame;
        const situation = stepState.situation !== undefined ? stepState.situation : baseGame.situation;
        const status = stepState.status ?? baseGame.status;
        return {
          ...baseGame,
          status,
          homeScore: stepState.homeScore ?? baseGame.homeScore,
          awayScore: stepState.awayScore ?? baseGame.awayScore,
          situation,
          gameClock: status === 'in' ? (situation?.downDistanceText || 'LIVE') : undefined,
        };
      })
    : activeGames;

  const displayMembers: LeagueMember[] = isSimulating2025
    ? HISTORICAL_2025_MEMBERS
    : activeWeek === 2
    ? WEEK_2_MEMBERS
    : members;

  const displayUserPicks: Record<string, UserPick> = isSimulating2025
    ? (HISTORICAL_2025_MEMBERS.find((m) => m.isCurrentUser)?.picks as Record<string, UserPick> || {})
    : currentWeekPicks;

  const displayTiebreaker: TiebreakerPick = isSimulating2025
    ? { week: 1, predictedTotalScore: 45, submittedAt: '2025-08-30T14:00:00Z' }
    : currentWeekTiebreaker;

  const handleToggleSeasonMode = (simulate2025: boolean) => {
    setIsSimulating2025(simulate2025);
    if (simulate2025) {
      setSimulationPhase('afternoon_kick');
      showToast('Switched to 2025 Replay: Showing completed & live games');
    } else {
      showToast(`Returned to Live NCAA 2026 Week ${activeWeek} Slate`);
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
                <span>
                  {isSimulating2025
                    ? '2025 Week 1 Replay'
                    : activeWeek === 2
                    ? 'Week 2 Next Week (Sep 12, 2026)'
                    : 'Week 1 Opening Saturday'}
                </span>
                <span>•</span>
                <span className={isSimulating2025 ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
                  {isSimulating2025
                    ? '8 Real Marquee Games'
                    : activeWeek === 2
                    ? '12 Curated Games (Top 25 + SEC + TCU)'
                    : 'Top 25 Slate'}
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
        onApplySimulatedGames={(simGames) =>
          setWeeklyGames((prev) => ({ ...prev, [activeWeek]: simGames }))
        }
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 mt-2">
        {activeTab === 'picks' && (
          <PickSheet
            games={displayGames}
            picks={displayUserPicks}
            tiebreaker={displayTiebreaker}
            activeWeek={activeWeek}
            onSelectWeek={setActiveWeek}
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
            activeWeek={activeWeek}
            onSelectWeek={setActiveWeek}
            onAutoCurateWeekSlate={handleAutoCurateWeekSlate}
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
