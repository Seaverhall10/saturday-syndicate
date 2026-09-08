import type { Game, SlateCurationConfig, Team } from '../types/pickem';

export const DEFAULT_CURATION_CONFIG: SlateCurationConfig = {
  includeTop25: true,
  maxRank: 25,
  includeConferences: ['SEC'],
  includeTeams: ['TCU', 'Horned Frogs'],
  excludeFcsVsFcs: true,
};

// Known SEC Teams for robust mapping even if conference property is missing
export const SEC_TEAMS_LIST = [
  'alabama', 'arkansas', 'auburn', 'florida', 'georgia', 'kentucky', 'lsu',
  'mississippi state', 'missouri', 'oklahoma', 'ole miss', 'south carolina',
  'tennessee', 'texas', 'texas a&m', 'vanderbilt'
];

export const SEC_ABBREVIATIONS = [
  'ALA', 'ARK', 'AUB', 'FLA', 'UGA', 'UK', 'LSU', 'MSST', 'MIZZ', 'OU',
  'MISS', 'SC', 'TENN', 'TEX', 'TA&M', 'VAN'
];

export function isSecTeam(team?: Team): boolean {
  if (!team) return false;
  if (team.conference) {
    return team.conference.toUpperCase() === 'SEC';
  }
  
  const name = (team.name || '').toLowerCase();
  const abbr = (team.abbreviation || '').toUpperCase();

  // Explicit non-SEC teams that share state names
  if (
    name.includes('oklahoma state') ||
    name.includes('georgia tech') ||
    name.includes('western kentucky') ||
    name.includes('eastern kentucky') ||
    name.includes('georgia southern') ||
    name.includes('georgia state') ||
    name.includes('texas state') ||
    name.includes('texas tech') ||
    name.includes('north texas')
  ) {
    return false;
  }

  if (SEC_ABBREVIATIONS.includes(abbr)) return true;
  return SEC_TEAMS_LIST.some((sec) => name.includes(sec));
}

export function isTcu(team?: Team): boolean {
  if (!team) return false;
  const str = `${team.name} ${team.shortName} ${team.abbreviation}`.toLowerCase();
  return str.includes('tcu') || str.includes('horned frog');
}

export interface CurationEvaluation {
  matched: boolean;
  reasons: string[];
}

export function evaluateGameForCuration(
  game: Game,
  config: SlateCurationConfig = DEFAULT_CURATION_CONFIG
): CurationEvaluation {
  const reasons: string[] = [];

  const homeRank = game.homeTeam.rank;
  const awayRank = game.awayTeam.rank;

  // 1. Check TCU (Custom Priority Team)
  const isHomeTcu = isTcu(game.homeTeam);
  const isAwayTcu = isTcu(game.awayTeam);
  const hasTcu = isHomeTcu || isAwayTcu;

  if (hasTcu) {
    reasons.push('🐸 TCU Special');
  }

  // 2. Check Top 25 Teams
  if (config.includeTop25) {
    const homeIsRanked = homeRank !== undefined && homeRank <= config.maxRank;
    const awayIsRanked = awayRank !== undefined && awayRank <= config.maxRank;

    if (homeIsRanked && awayIsRanked) {
      reasons.push(`⭐ Top 25 Clash (#${awayRank} @ #${homeRank})`);
    } else if (homeIsRanked) {
      reasons.push(`⭐ Top 25 (#${homeRank} ${game.homeTeam.shortName})`);
    } else if (awayIsRanked) {
      reasons.push(`⭐ Top 25 (#${awayRank} ${game.awayTeam.shortName})`);
    }
  }

  // 3. Check SEC Conference
  if (config.includeConferences.includes('SEC')) {
    const homeIsSec = isSecTeam(game.homeTeam);
    const awayIsSec = isSecTeam(game.awayTeam);

    if (homeIsSec && awayIsSec) {
      reasons.push('🏈 SEC Conference Clash');
    } else if (homeIsSec || awayIsSec) {
      const secTeamName = homeIsSec ? game.homeTeam.shortName : game.awayTeam.shortName;
      reasons.push(`🏈 SEC Matchup (${secTeamName})`);
    }
  }

  // 4. Custom team rule checking from config.includeTeams
  if (config.includeTeams.length > 0 && !hasTcu) {
    for (const target of config.includeTeams) {
      const tLower = target.toLowerCase();
      const awayMatch = `${game.awayTeam.name} ${game.awayTeam.abbreviation}`.toLowerCase().includes(tLower);
      const homeMatch = `${game.homeTeam.name} ${game.homeTeam.abbreviation}`.toLowerCase().includes(tLower);
      if (awayMatch || homeMatch) {
        reasons.push(`🎯 Must-Include (${target})`);
      }
    }
  }

  return {
    matched: reasons.length > 0,
    reasons,
  };
}

/**
 * Curates a pool of candidate games into the official weekly slate.
 * Sorts chronologically, tags reasons, and marks the premier matchup as tiebreaker.
 */
export function curateSlate(
  candidateGames: Game[],
  config: SlateCurationConfig = DEFAULT_CURATION_CONFIG
): Game[] {
  const curated: Game[] = [];

  for (const game of candidateGames) {
    const { matched, reasons } = evaluateGameForCuration(game, config);
    if (matched) {
      curated.push({
        ...game,
        curationReasons: reasons,
      });
    }
  }

  // Sort chronologically by kickoff time
  curated.sort((a, b) => new Date(a.kickoffTime).getTime() - new Date(b.kickoffTime).getTime());

  // If no game is designated tiebreaker, find the top ranked clash or the latest marquee primetime game
  const hasTiebreaker = curated.some((g) => g.isTiebreaker);
  if (!hasTiebreaker && curated.length > 0) {
    let bestGameIndex = 0;
    let bestScore = -999;

    curated.forEach((g, idx) => {
      let score = 0;
      if (g.homeTeam.rank) score += (26 - g.homeTeam.rank) * 2;
      if (g.awayTeam.rank) score += (26 - g.awayTeam.rank) * 2;
      if (isSecTeam(g.homeTeam) && isSecTeam(g.awayTeam)) score += 15;
      if (isTcu(g.homeTeam) || isTcu(g.awayTeam)) score += 5;
      // Bonus for evening/night games
      const hour = new Date(g.kickoffTime).getUTCHours();
      if (hour >= 23 || hour <= 2) score += 10;

      if (score > bestScore) {
        bestScore = score;
        bestGameIndex = idx;
      }
    });

    curated[bestGameIndex] = {
      ...curated[bestGameIndex],
      isTiebreaker: true,
    };
  }

  return curated;
}

export interface CurationBreakdown {
  total: number;
  top25Count: number;
  secCount: number;
  tcuIncluded: boolean;
}

export function getCurationBreakdown(games: Game[]): CurationBreakdown {
  let top25Count = 0;
  let secCount = 0;
  let tcuIncluded = false;

  for (const g of games) {
    const hasRank = (g.homeTeam.rank && g.homeTeam.rank <= 25) || (g.awayTeam.rank && g.awayTeam.rank <= 25);
    if (hasRank) top25Count++;

    if (isSecTeam(g.homeTeam) || isSecTeam(g.awayTeam)) secCount++;
    if (isTcu(g.homeTeam) || isTcu(g.awayTeam)) tcuIncluded = true;
  }

  return {
    total: games.length,
    top25Count,
    secCount,
    tcuIncluded,
  };
}
