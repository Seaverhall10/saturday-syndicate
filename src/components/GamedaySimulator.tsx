import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Info, ShieldCheck, Clock, CloudLightning } from 'lucide-react';
import { SIMULATION_STEPS } from '../data/historical2025';
import type { SimulationPhase } from '../data/historical2025';
import type { Game } from '../types/pickem';

interface GamedaySimulatorProps {
  currentPhase: SimulationPhase;
  onPhaseChange: (phase: SimulationPhase) => void;
  onResetTo2026: () => void;
  isSimulating2025: boolean;
  onToggleSeasonMode: (is2025: boolean) => void;
  onApplySimulatedGames: (games: Game[]) => void;
}

export const GamedaySimulator: React.FC<GamedaySimulatorProps> = ({
  currentPhase,
  onPhaseChange,
  onResetTo2026,
  isSimulating2025,
  onToggleSeasonMode,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);

  const currentStepIndex = SIMULATION_STEPS.findIndex((s) => s.id === currentPhase);
  const currentStep = SIMULATION_STEPS[currentStepIndex] || SIMULATION_STEPS[0];

  // Auto-play interval
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        const nextIndex = (currentStepIndex + 1) % SIMULATION_STEPS.length;
        onPhaseChange(SIMULATION_STEPS[nextIndex].id);
        if (nextIndex === SIMULATION_STEPS.length - 1) {
          setIsPlaying(false);
        }
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStepIndex, onPhaseChange]);

  const handleNext = () => {
    if (currentStepIndex < SIMULATION_STEPS.length - 1) {
      onPhaseChange(SIMULATION_STEPS[currentStepIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      onPhaseChange(SIMULATION_STEPS[currentStepIndex - 1].id);
    }
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border-y border-indigo-500/30 shadow-2xl py-3 px-3 sm:px-6 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Season Switcher & Simulation Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSeasonMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                !isSimulating2025
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              2026 Opening Slate
            </button>
            <button
              onClick={() => onToggleSeasonMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
                isSimulating2025
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>⏪ 2025 Replay Simulator</span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-mono">
                REAL CFB
              </span>
            </button>
          </div>

          {isSimulating2025 && (
            <button
              onClick={() => setShowExplainer(!showExplainer)}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chaos Test Cases</span>
            </button>
          )}
        </div>

        {/* Center: Timeline Scrubber (Active in 2025 simulation mode) */}
        {isSimulating2025 ? (
          <div className="flex flex-col items-center gap-1.5 w-full md:w-auto">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous Step"
              >
                ◀
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 ${
                  isPlaying ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>
              <button
                onClick={handleNext}
                disabled={currentStepIndex === SIMULATION_STEPS.length - 1}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next Step"
              >
                ▶
              </button>

              {/* Step Pills */}
              <div className="hidden lg:flex items-center gap-1 ml-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                {SIMULATION_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      setIsPlaying(false);
                      onPhaseChange(step.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      step.id === currentPhase
                        ? 'bg-amber-500 text-slate-950 font-black shadow'
                        : idx < currentStepIndex
                        ? 'text-slate-300 hover:bg-slate-800'
                        : 'text-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}. {step.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Phase Context Bar */}
            <div className="flex items-center gap-2 text-center text-xs">
              <span className="font-mono font-bold text-amber-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {currentStep.timeDisplay}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-semibold">{currentStep.label}:</span>
              <span className="text-slate-400 text-[11px] truncate max-w-xs sm:max-w-md hidden sm:inline">
                {currentStep.description}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live 2026 Week 1 Pre-Kickoff Mode — Ready for Saturday picks.</span>
          </div>
        )}

        {/* Right: Quick Reset / Reset Slate */}
        <div className="flex items-center gap-2">
          {isSimulating2025 && (
            <>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  onPhaseChange('pre');
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset 2025</span>
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  onResetTo2026();
                }}
                className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 px-2.5 py-1 bg-indigo-950/60 hover:bg-indigo-900/80 rounded-lg border border-indigo-700/60 transition-colors"
              >
                <span>Back to 2026</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expandable Chaos Explainer Drawer */}
      {showExplainer && isSimulating2025 && (
        <div className="mt-3 pt-3 border-t border-slate-800 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
              <CloudLightning className="w-4 h-4 text-amber-400" />
              <span>Lightning Delay Monotonic Lock</span>
            </div>
            <p className="text-[11px] text-slate-400">
              In Step 3, West Virginia vs Penn State experienced a real 2h 19m lightning delay. Saturday Syndicate’s anti-cheat latch guarantees that weather halts NEVER reopen picks.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>No "Final Score Drop" Bug</span>
            </div>
            <p className="text-[11px] text-slate-400">
              When Georgia wraps up 34-3 in Step 4, its win remains solidly counted alongside active games. Scores never evaporate to 0 when status changes to 'post'.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
              <FastForward className="w-4 h-4 text-indigo-400" />
              <span>6-Tier Tiebreaker Resolution</span>
            </div>
            <p className="text-[11px] text-slate-400">
              In Step 6, Seaver and Dave both tie with 6 wins. Seaver predicted 45 points on the FSU/BC game (Actual: 41, Delta = 4), defeating Dave (Pred: 52, Delta = 11).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
