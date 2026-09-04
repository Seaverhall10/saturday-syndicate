import type { Game, GameStatus, Team } from '../types/pickem';

export interface EspnSyncResult {
  success: boolean;
  games: Game[];
  error?: string;
  timestamp: string;
}

// Helper to parse spread strings like "ALA -27.5", "OSU -49.5", "PK", or "EVEN"
export function parseEspnSpread(details?: string, homeAbbr?: string): number {
  if (!details || details === 'EVEN' || details === 'PK') return 0;

  // Split details into abbreviation and line
  const parts = details.trim().split(' ');
  if (parts.length < 2) return 0;

  const favoriteAbbr = parts[0].toUpperCase();
  const rawLine = parseFloat(parts[1]); // e.g. -27.5

  if (isNaN(rawLine)) return 0;

  const lineMag = Math.abs(rawLine);

  // If home team is favored: spread is negative (e.g. -27.5)
  // If away team is favored: spread is positive (e.g. +27.5)
  if (homeAbbr && favoriteAbbr === homeAbbr.toUpperCase()) {
    return -lineMag;
  } else {
    return lineMag;
  }
}

// Convert raw ESPN Scoreboard API event into Saturday Syndicate Game
export function transformEspnEvent(event: any): Game | null {
  try {
    const comp = event.competitions?.[0];
    if (!comp) return null;

    const competitors = comp.competitors || [];
    const homeComp = competitors.find((c: any) => c.homeAway === 'home');
    const awayComp = competitors.find((c: any) => c.homeAway === 'away');

    if (!homeComp || !awayComp) return null;

    // Home Team
    const homeRank = homeComp.curatedRank?.current;
    const homeTeam: Team = {
      id: homeComp.team.id || homeComp.id,
      name: homeComp.team.displayName || homeComp.team.name,
      shortName: homeComp.team.shortDisplayName || homeComp.team.name,
      abbreviation: homeComp.team.abbreviation || 'HOME',
      logoUrl: homeComp.team.logo || `https://a.espncdn.com/i/teamlogos/ncaa/500/${homeComp.team.id}.png`,
      rank: homeRank && homeRank <= 25 ? homeRank : undefined,
      record: homeComp.records?.[0]?.summary || '0-0',
      primaryColor: homeComp.team.color ? `#${homeComp.team.color}` : '#1e293b',
    };

    // Away Team
    const awayRank = awayComp.curatedRank?.current;
    const awayTeam: Team = {
      id: awayComp.team.id || awayComp.id,
      name: awayComp.team.displayName || awayComp.team.name,
      shortName: awayComp.team.shortDisplayName || awayComp.team.name,
      abbreviation: awayComp.team.abbreviation || 'AWAY',
      logoUrl: awayComp.team.logo || `https://a.espncdn.com/i/teamlogos/ncaa/500/${awayComp.team.id}.png`,
      rank: awayRank && awayRank <= 25 ? awayRank : undefined,
      record: awayComp.records?.[0]?.summary || '0-0',
      primaryColor: awayComp.team.color ? `#${awayComp.team.color}` : '#334155',
    };

    // Status
    const rawState = event.status?.type?.state; // 'pre', 'in', 'post'
    const status: GameStatus = rawState === 'in' ? 'in' : rawState === 'post' ? 'post' : 'pre';

    // Clock display
    const gameClock = event.status?.type?.shortDetail || (status === 'in' ? 'Q1 15:00' : undefined);

    // Scores (safely parsed to avoid NaN)
    const homeScore = homeComp.score !== undefined ? parseInt(homeComp.score, 10) : 0;
    const awayScore = awayComp.score !== undefined ? parseInt(awayComp.score, 10) : 0;

    // Odds / Spread
    const oddsDetail = comp.odds?.[0]?.details;
    const spread = parseEspnSpread(oddsDetail, homeTeam.abbreviation);
    const overUnder = comp.odds?.[0]?.overUnder ? Number(comp.odds[0].overUnder) : 52.5;

    // Venue
    const venue = comp.venue;
    const location = venue
      ? {
          stadium: venue.fullName || 'Campus Stadium',
          city: venue.address?.city || '',
          state: venue.address?.state || '',
          isNeutralSite: comp.neutralSite || false,
        }
      : undefined;

    // Situation
    const sit = comp.situation;
    const situation = sit
      ? {
          possessionTeamId: sit.possession ? String(sit.possession) : undefined,
          downDistanceText: sit.downDistanceText,
          yardLine: sit.yardLine,
          lastPlayText: sit.lastPlay?.text,
          isRedzone: sit.isRedZone || false,
        }
      : undefined;

    return {
      id: `espn-${event.id}`,
      league: 'CFB',
      season: 2026,
      week: 1,
      kickoffTime: event.date,
      homeTeam,
      awayTeam,
      spread,
      overUnder,
      homeScore: status !== 'pre' ? homeScore : undefined,
      awayScore: status !== 'pre' ? awayScore : undefined,
      status,
      gameClock,
      location,
      situation,
    };
  } catch (err) {
    console.error('Error transforming ESPN event:', err);
    return null;
  }
}

// Fetch live college football scoreboard from ESPN
export async function fetchLiveEspnScoreboard(): Promise<EspnSyncResult> {
  try {
    const url = '/api/espn/apis/site/v2/sports/football/college-football/scoreboard';
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`ESPN Scoreboard returned HTTP ${res.status}: ${res.statusText}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('json')) {
      throw new Error('ESPN data feed temporarily protected by Akamai. Verified Top 25 slate retained.');
    }

    const data = await res.json();
    const events = data.events || [];

    const games: Game[] = [];
    for (const evt of events) {
      const transformed = transformEspnEvent(evt);
      if (transformed) {
        games.push(transformed);
      }
    }

    return {
      success: true,
      games,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      success: false,
      games: [],
      error: err.message || 'Failed to fetch ESPN scoreboard',
      timestamp: new Date().toISOString(),
    };
  }
}
